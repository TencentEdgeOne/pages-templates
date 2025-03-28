import type { CollectionEntry } from 'astro:content';
import type { Blog } from './contentful';
import { defaultLocale } from '@/config';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { BLOCKS } from '@contentful/rich-text-types';
import { contentfulClient } from './contentful';

// Type definitions
export type Post = CollectionEntry<'posts'> & {
  remarkPluginFrontmatter: {
    minutes: number;
  };
};

// Add metadata including reading time to post
async function addMetaToPost(post: CollectionEntry<'posts'>): Promise<Post> {
  const { remarkPluginFrontmatter } = await post.render();
  return {
    ...post,
    remarkPluginFrontmatter: remarkPluginFrontmatter as { minutes: number },
  };
}

/**
 * Find duplicate post slugs within the same language
 * @param posts Array of blog posts
 * @returns Array of descriptive error messages for duplicate slugs
 */
export async function checkPostSlugDuplication(
  posts: CollectionEntry<'posts'>[],
): Promise<string[]> {
  const slugMap = new Map<string, Set<string>>();
  const duplicates: string[] = [];

  posts.forEach((post) => {
    const lang = post.data.lang;
    const slug = post.data.abbrlink || post.slug;

    if (!slugMap.has(lang)) {
      slugMap.set(lang, new Set());
    }

    const slugSet = slugMap.get(lang)!;
    if (slugSet.has(slug)) {
      if (!lang) {
        duplicates.push(
          `Duplicate slug "${slug}" found in universal post (applies to all languages)`,
        );
      } else {
        duplicates.push(
          `Duplicate slug "${slug}" found in "${lang}" language post`,
        );
      }
    } else {
      slugSet.add(slug);
    }
  });

  return duplicates;
}

export async function getPostsFromContentful(lang?: string) {
  const currentLang = lang || defaultLocale;

  const entries = await contentfulClient.getEntries<Blog>({
    content_type: 'blog',
  });
  // console.warn('entries', JSON.stringify(entries.items[1]))
  const parsedEntries = entries.items.map((item, index) => {
    index === 0 &&
      console.warn(
        item.fields.content,
        documentToHtmlString(item.fields.content),
      );
    const options = {
      renderNode: {
        [BLOCKS.EMBEDDED_ASSET]: (node) => {
          console.warn('asset', JSON.stringify(node), node);

          const { fields, sys } = node?.data?.target ?? {};
          const file = fields.file;

          if (sys.type === 'Asset' && file.contentType.startsWith('image')) {
            return `<img src=${file.url} alt=${file.title}/>`;
          }
          return `<div>other handler asset here</div>`;
        },
      },
    };
    const renderedContent = documentToHtmlString(item.fields.content, options);
    return {
      id: item.sys.id,
      slug: item.fields.slug,
      collection: 'posts',
      data: {
        title: item.fields.title,
        description: item.fields.description,
        published: new Date(item.fields.date || item.sys.createdAt),
        updated: new Date(item.sys.updatedAt),
        lang: item.fields?.language || currentLang,
        tags: item.metadata.tags.map((tag) => tag.sys.id),
        draft: import.meta.env.DEV ? !item.sys?.publishedAt : false,
        // pin: item.fields.pinned ? 1 : 0,
        abbrlink: item.fields.slug,
      },
      body: renderedContent || '',
      render: async () => {
        return {
          remarkPluginFrontmatter: {
            minutes: Math.ceil((renderedContent.length || 0) / 1000),
          },
        };
      },
    } as unknown as CollectionEntry<'posts'>;
  });
  return parsedEntries;
}
/**
 * Get all posts (including pinned ones, excluding drafts in production)
 * @param lang Language code, optional, defaults to site's default language
 * @returns Posts filtered by language, enhanced with metadata, sorted by date
 */
export async function getPosts(lang?: string) {
  const currentLang = lang || defaultLocale;

  const parsedEntries = ((await getPostsFromContentful(lang)) ?? []).filter(
    (data: CollectionEntry<'posts'>) => {
      const shouldInclude = import.meta.env.DEV || !data.data.draft;
      return (
        shouldInclude &&
        (data.data.lang === currentLang || data.data.lang === '')
      );
    },
  );

  const enhancedPosts = await Promise.all(parsedEntries.map(addMetaToPost));

  return enhancedPosts.sort(
    (a: Post, b: Post) =>
      b.data.published.valueOf() - a.data.published.valueOf(),
  );
}

/**
 * Get all non-pinned posts
 * @param lang Language code, optional, defaults to site's default language
 * @returns Regular posts (not pinned), already filtered by language and drafts
 */
export async function getRegularPosts(lang?: string) {
  const posts = await getPosts(lang);
  return posts.filter((post) => !post.data.pin);
}

/**
 * Get pinned posts and sort by pin priority
 * @param lang Language code, optional, defaults to site's default language
 * @returns Pinned posts sorted by pin value in descending order
 */
export async function getPinnedPosts(lang?: string) {
  const posts = await getPosts(lang);
  return posts
    .filter((post) => post.data.pin && post.data.pin > 0)
    .sort((a, b) => (b.data.pin || 0) - (a.data.pin || 0));
}

/**
 * Group posts by year and sort within each year
 * @param lang Language code, optional, defaults to site's default language
 * @returns Map of posts grouped by year (descending), with posts in each year sorted by date (descending)
 */
export async function getPostsByYear(
  lang?: string,
): Promise<Map<number, Post[]>> {
  const posts = await getRegularPosts(lang);
  const yearMap = new Map<number, Post[]>();

  posts.forEach((post: Post) => {
    const year = post.data.published.getFullYear();
    if (!yearMap.has(year)) {
      yearMap.set(year, []);
    }
    yearMap.get(year)!.push(post);
  });

  yearMap.forEach((yearPosts) => {
    yearPosts.sort((a, b) => {
      const aDate = a.data.published;
      const bDate = b.data.published;
      return (
        bDate.getMonth() - aDate.getMonth() || bDate.getDate() - aDate.getDate()
      );
    });
  });

  return new Map([...yearMap.entries()].sort((a, b) => b[0] - a[0]));
}

/**
 * Get all tags sorted by post count
 * @param lang Language code, optional, defaults to site's default language
 * @returns Array of tags sorted by popularity (most posts first)
 */
export async function getAllTags(lang?: string) {
  const tagMap = await getPostsGroupByTags(lang);
  const tagsWithCount = Array.from(tagMap.entries());

  tagsWithCount.sort((a, b) => b[1].length - a[1].length);
  return tagsWithCount.map(([tag]) => tag);
}

/**
 * Group posts by their tags
 * @param lang Language code, optional, defaults to site's default language
 * @returns Map where keys are tag names and values are arrays of posts with that tag
 */
export async function getPostsGroupByTags(lang?: string) {
  const posts = await getPosts(lang);
  const tagMap = new Map<string, Post[]>();

  posts.forEach((post: Post) => {
    post.data.tags?.forEach((tag: string) => {
      if (!tagMap.has(tag)) {
        tagMap.set(tag, []);
      }
      tagMap.get(tag)!.push(post);
    });
  });

  return tagMap;
}

/**
 * Get all posts that contain a specific tag
 * @param tag The tag name to filter posts by
 * @param lang Language code, optional, defaults to site's default language
 * @returns Array of posts that contain the specified tag
 */
export async function getPostsByTag(tag: string, lang?: string) {
  const tagMap = await getPostsGroupByTags(lang);
  return tagMap.get(tag) || [];
}

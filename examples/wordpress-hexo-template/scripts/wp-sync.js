const axios = require('axios');
const fs = require('fs');
const path = require('path');

const WP_API = `${process.env.WP_URL}/wp-json/wp/v2`;
const POSTS_DIR = path.join(process.cwd(), 'source/_posts');

// get categories
async function getCategories() {
  const response = await axios.get(`${WP_API}/categories`);
  return response.data;
}

// get posts
async function getPosts() {
  const response = await axios.get(`${WP_API}/posts`, {
    params: {
      per_page: 100,
      _embed: true
    }
  });
  return response.data;
}
// get tags
async function getTags() {
  const response = await axios.get(`${WP_API}/tags`);
  return response.data;
}

// get hexo post
function createHexoPost(post) {
  const categories = post._embedded['wp:term'][0] || [];
  const featuredMedia = post._embedded['wp:featuredmedia']?.[0];
  const tags = post._embedded['wp:term'][1] || [];
  return `---
title: "${post.title.rendered}"
date: ${new Date(post.date).toISOString()}
categories: [${categories.map(c => c.name).join(', ')}]
cover: ${featuredMedia?.source_url || ''}
tags: [${tags.map(t => t.name).join(', ')}]
---

${post.content.rendered}
`;
}

// main
async function main() {
  try {
    // create posts dir
    if (!fs.existsSync(POSTS_DIR)) {
      fs.mkdirSync(POSTS_DIR, { recursive: true });
    }

    // get and save categories
    const categories = await getCategories();
    fs.writeFileSync('./source/categories.json', JSON.stringify(categories, null, 2));

    const tags = await getTags();
    fs.writeFileSync('./source/tags.json', JSON.stringify(tags, null, 2));

    // get and save posts
    const posts = await getPosts();
    posts.forEach(post => {
      const filename = `${post.slug}.md`;
      fs.writeFileSync(path.join(POSTS_DIR, filename), createHexoPost(post));
    });

    console.log(`Successfully sync ${posts.length} posts`);
  } catch (error) {
    console.error('Sync failed:', error.message);
  }
}

main();

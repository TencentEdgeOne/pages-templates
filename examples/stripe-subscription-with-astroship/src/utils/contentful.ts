
import * as contentful from "contentful";
import type { EntryFieldTypes } from "contentful";

// console.log('import.meta.env.PUBLIC_CONTENTFUL_SPACE_ID', import.meta.env.PUBLIC_CONTENTFUL_SPACE_ID)
// console.log('import.meta.env.PUBLIC_CONTENTFUL_DELIVERY_TOKEN', import.meta.env.PUBLIC_CONTENTFUL_DELIVERY_TOKEN)
export const contentfulClient = contentful.createClient({
  space: import.meta.env.PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.DEV
    ? import.meta.env.PUBLIC_CONTENTFUL_PREVIEW_TOKEN
    : import.meta.env.PUBLIC_CONTENTFUL_DELIVERY_TOKEN,
  host: import.meta.env.DEV ? "preview.contentful.com" : "cdn.contentful.com",
});

export interface Blog {
  contentTypeId: "blog";
  fields: {
    title: EntryFieldTypes.Text;
    content: EntryFieldTypes.RichText;
    date: EntryFieldTypes.Date;
    description: EntryFieldTypes.Text;
    featuredImage: EntryFieldTypes.AssetLink;
    slug: EntryFieldTypes.Text;
    category: EntryFieldTypes.Text;
    author: EntryFieldTypes.Text;
  };
}
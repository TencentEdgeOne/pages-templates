import * as contentful from "contentful";
import type { EntryFieldTypes } from "contentful";

// Check if Contentful is properly configured
const spaceId = import.meta.env.PUBLIC_CONTENTFUL_SPACE_ID;
const deliveryToken = import.meta.env.PUBLIC_CONTENTFUL_DELIVERY_TOKEN;
const previewToken = import.meta.env.PUBLIC_CONTENTFUL_PREVIEW_TOKEN;

// Only create Contentful client if environment variables are properly configured (not placeholders)
const isContentfulConfigured = spaceId &&
  spaceId !== "space_id" &&
  deliveryToken &&
  deliveryToken !== "delivery_token";

export const contentfulClient = isContentfulConfigured
  ? contentful.createClient({
      space: spaceId,
      accessToken: import.meta.env.DEV
        ? previewToken || deliveryToken
        : deliveryToken,
      host: import.meta.env.DEV ? "preview.contentful.com" : "cdn.contentful.com",
    })
  : null;

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

# Static Blog Theme Based on AstroJS and Contentful

This template is modified from [retypeset](https://github.com/radishzzz/astro-theme-retypeset), thanks to the original author's contribution.
Contentful CMS integration has been added on top of the original template.

## Deploy

[![Deploy with EdgeOne Pages](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://edgeone.ai/pages/new?template=blog-with-retypeset-and-contentful)

More Templates: [EdgeOne Pages](https://edgeone.ai/pages/templates)

## Usage

### Contentful Configuration

- Step1 Register a [Contentful](https://www.contentful.com/) account and create your own space
- Step2 Install Contentful CLI and execute Contentful login to log in
- Step3 Download the [data configuration file](https://github.com/TencentEdgeOne/pages-templates/blob/main/examples/blog-with-retypeset-and-contentful/contentful-blog-model.json)
- Step4 Execute the import command: `contentful space import --content-file contentful-blog-model.json --space-id  ${your Contentful space id}`
- Step5 Copy the Contentful Space Id and Contentful Delivery API token for later use

> For more Contentful integration documentation:https://edgeone.ai/document/178178425272651776

### Using This Template

Select this template in the console, fill in the Contentful Space Id and Contentful Delivery API token as environment variables, and click deploy.

### Adding Content in Contentful

Use the Blog content type to add content. The template distinguishes languages based on the language field, with Chinese as the default language.
When the same article has multiple languages, please use the same Blog content type and keep the slug the same, using different language fields to distinguish them.

## Local Development

### Create a .env file and fill in the variables

```
CONTENTFUL_SPACE_ID=${your space id}
CONTENTFUL_DELIVERY_TOKEN=${Contentful delivery api token}
CONTENTFUL_PREVIEW_TOKEN=${Contentful preview api token}
DEV=true
```

### Start the Debug Service

Install dependencies: `npm i --legacy-peer-deps`

Start service: `npm run dev`

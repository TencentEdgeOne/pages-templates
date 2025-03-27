# Static Blog Theme Based on AstroJS and Contentful
This template is modified from [retypeset](https://github.com/radishzzz/astro-theme-retypeset), thanks to the original author's contribution.
Contentful CMS integration has been added on top of the original template.

## Usage
### Contentful Configuration
Step1 Register a [Contentful](https://www.contentful.com/) account and create your own space
Step2 Install Contentful CLI and execute Contentful login to log in
Step3 Download the [data configuration file](https://cdnstatic.tencentcs.com/edgeone/pages/docs/contentful-export.json)
Step4 Execute the import command: `contentful space import --content-file contentful-model.json --space-id ${your Contentful space id}`
Step5 Copy the Contentful Space Id and Contentful Delivery API token for later use

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

## Demo

- [Retypeset](https://retypeset.radishzz.cc/en/)
- [Retipografía](https://retypeset.radishzz.cc/es/)
- [Переверстка](https://retypeset.radishzz.cc/ru/)
- [重新编排](https://retypeset.radishzz.cc/)
- [重新編排](https://retypeset.radishzz.cc/zh-tw/)
- [再組版](https://retypeset.radishzz.cc/ja/)

## Features

- Built with Astro and UnoCSS
- Support for SEO, Sitemap, OpenGraph, TOC, RSS, MDX and LaTeX
- i18n support
- Light/Dark mode
- Elegant view transitions
- Rich theme customization
- Optimized typography
- Responsive design
- Comment system

## Performance

<p align="center">
  <a href="https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fretypeset.radishzz.cc%2F">
    <img width="710" alt="Retypeset Lighthouse Score" src="assets/retypeset-lighthouse-score.svg">
  <a>
</p>

## Deploy

1. Click [`Fork`](https://github.com/radishzzz/astro-theme-retypeset/fork) to clone this repository.

2. Click `Deploy to Netlify` or `Deploy to Vercel` below

&emsp;[![Deploy to Netlify](assets/deploy-netlify.svg)](https://app.netlify.com/start)
[![Deploy to Vercel](assets/deploy-vercel.svg)](https://vercel.com/new)

3. Select the repository and click `Deploy`.

For other platforms, please refer to the [Astro Deployment Guides](https://docs.astro.build/en/guides/deploy/).

## Updates

1. Follow the [GitHub Docs](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork) to run `Sync fork`.

2. Do not click `Discard Changes`.

## Documentation

- [Theme Guide](https://retypeset.radishzz.cc/en/posts/theme-guide/)
- [Theme Configuration File](https://github.com/radishzzz/astro-theme-retypeset/blob/master/src/config.ts)

## Credits

- [Typography](https://github.com/moeyua/astro-theme-typography)
- [Fuwriu](https://github.com/saicaca/fuwari)
- [Redefine](https://github.com/EvanNotFound/hexo-theme-redefine)
- [AstroPaper](https://github.com/satnaing/astro-paper)
- [heti](https://github.com/sivan/heti)
- [Early Summer Serif](https://github.com/GuiWonder/EarlySummerSerif)

## Star History

<p align="center">
<a href="https://star-history.com/#radishzzz/astro-theme-retypeset&Date">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=radishzzz/astro-theme-retypeset&type=Date&theme=dark" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=radishzzz/astro-theme-retypeset&type=Date" />
    <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=radishzzz/astro-theme-retypeset&type=Date" />
  </picture>
</p>

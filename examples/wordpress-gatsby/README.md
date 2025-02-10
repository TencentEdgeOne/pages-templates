# Boost WordPress Site Speed: Deploy to EdgeOne Pages

This example demonstrates how to deploy a WordPress site to EdgeOne Pages to enhance access speed.

## Deployment

[![Deploy with EdgeOne Pages](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://edgeone.ai/pages/new?from=github&template=wordpress-gatsby)

More Templates: [EdgeOne Pages](https://edgeone.ai/pages/templates)

## Preparations

Set up a WordPress service and log in to the console http://xxx.com/wp-admin

Install and enable the following plugins:

- WPGraphQL
- WP Gatsby

## Local Development

```sh
# Add .env file and write environment variables
GATSBY_API_URL=http://xxx.com/graphql

# Install dependencies
npm i

# Local debugging
npm run start
```

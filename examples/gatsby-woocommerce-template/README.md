# Gatsby Ecommerce for WordPress Headless CMS

Building an e-commerce website from scratch can be complex. This template implements a Jamstack architecture e-commerce solution powered by WordPress + WooCommerce backend, the frontend framework is GatsbyJS..

## Deploy

[![Deploy with EdgeOne Pages](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://edgeone.ai/pages/new?template=gatsby-woocommerce-template)

## WordPress Setup
### Docker Deployment(Recommended)
We provide a [pre-configured docker project](https://github.com/TencentEdgeOne/wp-ecommerce-docker-demo) that can be directly deployed to your server using Docker containers.

### Manual Deployment
If you prefer manual deployment, you need to install and activate the following WordPress plugins:
- Advanced Custom Fields
- WooCommerce  
- JWT Authentication for WP-API
- WPGraphQL
- WPGraphQL for ACF
- WPGraphQL for WooCommerce (WooGraphQL)
- WPGraphQL JWT Authentication

Complete WooCommerce initial setup and create sample products.  

Create three pages in Pages section: `highlight`, `promotion`, `sample-page`  

Import ACF configuration: `wordpress-data/acf-export-2025-02-13.json` via Advanced Custom Fields plugin  

Populate ACF data in the created pages and save.

After backend setup, configure the service URL in EdgeOne Pages project environment variables:
![](https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/bc4a7e54-5920-4f89-8e7c-a1889d659bb8.png)

## Project Startup
### Install Dependencies
`npm i`

### Local Development
```
gatsby develop && edgeone pages dev --fePort=8000 
// fePort should match Gatsby's running port for cross-origin auth handling
// Add GATSBY_ENV=dev to local .env file along with WP_URL
```
Visit `http://localhost:8000/` to view the project.
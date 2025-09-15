# SaaS Site Template with Supabase and Stripe

## Template Overview

This template implements almost all common features of a SaaS site, including user management, subscription payments, and podcast content.
Backend: Supabase + Stripe
Content CMS: Contentful
Frontend: AstroJS
The template code is open source. You can modify it and adopt specific modules or implementations.

## Deploy

[![Deploy with EdgeOne Pages](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://edgeone.ai/pages/new?template=stripe-subscription-with-astroship)

## 1. Preparation

### Supabase

This template uses Supabase API for order data and user management.

#### Prepare API Keys

After registering and logging into Supabase, create your own project.

Go to Project Settings - Data API, copy `Project Url`, `Anon Public Key`, and `Service_role Secret Key`.

![](https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/0f296398-aa8a-4d8f-b70f-45e4999c8faa.png)

#### Initialize Database

After registration, create a new project in Supabase. Copy the content from [database initialization file](https://cdnstatic.tencentcs.com/edgeone/pages/docs/database_init.sql) into Supabase console's SQL Editor to initialize the database.
![](https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/08263cd8-e0a9-478e-bfaf-51427f7588e8.png)

## Contentful

#### Prepare API Keys

Register and log into Contentful CMS console. Click Settings (top-left) - API keys, then create a new API key.
After creation, copy `Space ID`, `Content Delivery API - access token`, and `Content Preview API - access token`.

#### Create Blog Data Model

Install [`Contentful Cli`](https://www.contentful.com/developers/docs/tutorials/cli/import-and-export/) to directly import [configuration file](https://cdnstatic.tencentcs.com/edgeone/pages/docs/contentful-export.json).

Alternatively, create manually from console:
![](https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/571bb14d-11ad-4792-b634-dc9e3dfceb8a.png)

After creating the data model, you can create blog content.

## Stripe

#### Prepare API Keys

First name your application, e.g., my-saas-site.

Register a Stripe account (demo uses test mode), then go to dashboard.

Under Developers - API Keys, copy `STRIPE_SECRET_KEY`.

Go to Developers - Webhooks, click `Add destination` to create a webhook:
![](https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/85f02933-80b6-45c0-83f5-b6b65f6f419c.png)

Select these events in webhook configuration:
![](https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/f940cb43-59d0-4141-a277-f4f8d642f0c0.png)

Set `Endpoint URL` to `${your-app-name}.edgeone.app/stripe/webhook`. After deployment, Stripe products will trigger function updates to Supabase.

After creating webhook, copy `Signing secret`:
![](https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/c367b540-6cf6-4c5b-8a1a-635eab5e53bf.png)

## 2. Create Application

### Select Template

Go to [deployment page](https://edgeone.ai/pages/new?template=stripe-subscription-with-astroship&from=open_templates), fill in all prepared environment variables.
![](https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/225e2860-d58f-4515-8a77-40147cc1a0d9.png)
Click "Start Deployment".

### Create Project & Wait for Deployment

After deployment completes, click preview link to view the site.

### Configure Products in Stripe

Return to Stripe dashboard to add subscription products:
![](https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/210da878-c0df-4f6c-b68f-c83c9734db70.png)
Adding products will trigger edge functions to update Supabase data via webhooks.

### Configure Webhook in Contentful

The blog uses SSG (static site generation). Configure EdgeOne Pages' webhook in Contentful to trigger redeployments when content changes:
Create new webhook in project settings:
![](https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/97d70558-9259-4bea-8346-ce5bfb28f598.png)
Copy URL to Contentful's webhooks:
![](https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/bff20548-ebdd-490a-86f1-351bd5e657ba.png)
![](https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/7379144a-91f3-4e3e-8e7e-50cbe00e55b3.png)

## 3. Local Development

After cloning the project, install [Edgeone Pages Cli](https://www.npmjs.com/package/edgeone).
Run `edgeone login` to authenticate.
Then run `edgeone pages link` to link local config, which writes env vars to .env.


#### Run dev sever

`edgeone pages dev`

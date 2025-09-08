# Stripe subscription starter

## Template Overview
This template implements subscription based on Stripe.
Backend: Supabase + Stripe
Frontend: React
The template code is open source. You can modify it and adopt specific modules or implementations.

## 1. Preparation
### Supabase
This template uses Supabase API for order data and user management.

#### Prepare API Keys
After registering and logging into Supabase, create your own project.

Go to Project Settings - Data API, copy `Project Url`, `Anon Public Key`, and `Service_role Secret Key`.

![](https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/0f296398-aa8a-4d8f-b70f-45e4999c8faa.png)

> This template requires disabling email verification for email login.

#### Initialize Database
After registration, create a new project in Supabase. Copy the content from [database initialization file](https://cdnstatic.tencentcs.com/edgeone/pages/docs/database_init.sql) into Supabase console's SQL Editor to initialize the database.
![](https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/08263cd8-e0a9-478e-bfaf-51427f7588e8.png)


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
Go to [deployment page](https://console.tencentcloud.com/edgeone/pages/new?template=stripe-subscription-starter&from=open_templates), fill in all prepared environment variables.

![](https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/8ebf78b6-bed3-4319-aa3b-a2abc3ba7421.png)

Click "Start Deployment".

### Create Project & Wait for Deployment
After deployment completes, click preview link to view the site.

### Configure Products in Stripe
Return to Stripe dashboard to add subscription products:
![](https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/210da878-c0df-4f6c-b68f-c83c9734db70.png)
Adding products will trigger edge functions to update Supabase data via webhooks.

## 3. Local Development
After cloning the project, install [Edgeone Pages Cli](https://www.npmjs.com/package/edgeone).
Run `edgeone login` to authenticate.
Then run `edgeone link ${your-project-name}` to link local config, which writes env vars to .env.

#### Configure Dev Environment Variables
Add these variables in `.env` for cross-origin handling:
```
FRONT_END_URL_DEV=http://localhost:8080/
PUBLIC_API_URL_DEV=http://localhost:8088/
DEV=true
```
#### Run front end dev server
`npm run dev`

#### Run function sever
`edgeone pages dev`
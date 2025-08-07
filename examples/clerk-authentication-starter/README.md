# Clerk Authentication Starter

This template is an example template based on Clerk Authentication and Next.js static generation.

## Deploy

[![Deploy with EdgeOne Pages](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://edgeone.ai/pages/new?template=clerk-authentication-starter)

## Clerk Configuration

Register on [Clerk](https://clerk.com/) and create a new project.
Go to the [Dashboard](https://dashboard.clerk.com/last-active?path=api-keys) and copy the `CLERK_PUBLISHABLE_KEY` for later use.

## Environment Variables

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${your CLERK_PUBLISHABLE_KEY}
// The following paths are fixed in this project
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/account
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/account
```

## Local Development

Install dependencies: `npm install`
Local development: `npm run build`

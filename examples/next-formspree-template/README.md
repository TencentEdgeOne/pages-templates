# Next.js & Formspree Template

A simple and modern contact form built with Next.js and integrated with [Formspree](https://formspree.io) for easy form submission handling.

## Overview

This project provides a ready-to-use contact form template with client-side validation and Formspree integration. It's designed to be a clean, minimal example that developers can use as a reference or starting point for their own projects.

### Features

- Clean and responsive contact form UI
- Client-side form validation (required fields and email format)
- Formspree integration for backend form handling

## Tech Stack

- **Framework**: Next.js 16
- **Runtime**: React 19
- **Language**: TypeScript
- **Form Service**: @formspree/react

## Project Structure

```
next-formspree-template/
├── app/
│   ├── components/
│   │   └── ContactForm.tsx   # Contact form component with validation
│   ├── favicon.ico           # Site favicon
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── public/                   # Static assets
├── .env.example              # Environment variables example
├── next.config.ts            # Next.js configuration
├── package.json              # Dependencies and scripts
└── tsconfig.json             # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js 18.x or later

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd next-formspree-template
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Edit `.env.local` and add your Formspree form ID:

```
NEXT_PUBLIC_FORM=your_form_id
```

### Formspree Setup

1. Go to [Formspree](https://formspree.io) and create an account
2. Create a new form
3. Copy your form ID (e.g., `xabcdefg`)
4. Add the form ID to your `.env.local` file

### Development

Start the development server:

```bash
npm run dev
```

### Production Build

Build for production:

```bash
npm run build
```

## Configuration

### Static Export

This project is configured for static export. The `next.config.ts` includes:

```typescript
const nextConfig: NextConfig = {
  output: "export",
};
```

This generates a fully static site, ready for deployment to any static hosting service.

## License

MIT

## One-Click Deployment

[![Deploy with EdgeOne Pages](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://edgeone.ai/pages/new?from=github&template=next-formspree-template)

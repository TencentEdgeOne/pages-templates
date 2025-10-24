#!/bin/bash

# S3 Batch Uploader startup script
echo "🚀 Starting S3 Batch Uploader..."

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Warning: Current Node.js version is $(node -v), recommend using Node.js 18+ for best experience"
    echo "📝 If you encounter issues, please consider upgrading your Node.js version"
fi

# Check environment variables file
if [ ! -f ".env.local" ]; then
    echo "📋 Creating environment variables file..."
    cp .env.example .env.local
    echo "✅ Please edit .env.local file and fill in your AWS configuration"
fi

# Start development server
echo "🔧 Starting development server..."
npm run dev
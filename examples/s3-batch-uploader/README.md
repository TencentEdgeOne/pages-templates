# 🚀 S3 Batch Uploader

A feature-complete, beautifully designed AWS S3 batch file upload system with drag-and-drop upload, progress monitoring, and advanced features.

[![Deploy with EdgeOne Pages](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://edgeone.ai/pages/new?template=s3-batch-uploader)

More Templates: [EdgeOne Pages](https://edgeone.ai/pages/templates)

## ✨ Features

### 📁 File Upload
- ✅ **Drag & Drop Upload** - Support dragging files to the page for upload
- ✅ **Click to Select** - Traditional file selection method
- ✅ **Batch Processing** - Select multiple files for batch upload at once
- ✅ **File Preview** - Display image thumbnails and video covers
- ✅ **File Information** - Show file format, size and other detailed information

### 📊 Progress Monitoring
- ✅ **Real-time Progress Bar** - Display upload progress for each file
- ✅ **Upload Status** - Waiting, uploading, success, failure status indicators
- ✅ **Progress Overlay** - Display semi-transparent progress layer on file preview during upload
- ✅ **Error Handling** - Show error information and retry options when upload fails

### ⚙️ Advanced Configuration
- ✅ **Concurrency Control** - Configurable number of simultaneous file uploads
- ✅ **File Selection** - Check/uncheck files to upload

### 📋 Storage Bucket Management
- ✅ **Storage Bucket** - View list of uploaded files
- ✅ **File Details** - Click to view detailed file information

### 🎨 User Interface
- ✅ **Modern Design** - Clean and beautiful user interface
- ✅ **Responsive Layout** - Adapt to different screen sizes
- ✅ **Status Feedback** - Rich visual feedback and interactive effects

## 🚀 Quick Start

### 1. Project Already Running
Project is currently running at: **http://localhost:3003**

### 2. Configure AWS S3
Before using, please configure your AWS S3 settings:

```bash
# Copy environment variable template
cp .env.example .env.local

# Edit configuration file
nano .env.local
```

Fill in your AWS configuration:
```env
AWS_BUCKET_REGION=your-bucket-region
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_BUCKET_NAME=your-bucket-name
```

### 3. AWS S3 Setup

#### Create S3 Bucket
1. Login to AWS Console
2. Create new S3 bucket
3. Configure CORS policy:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

#### Create IAM User
1. Create new IAM user
2. Add S3 access permission policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::your-bucket-name",
        "arn:aws:s3:::your-bucket-name/*"
      ]
    }
  ]
}
```

## 📖 Usage Guide

### Upload Files
1. Visit http://localhost:3003
2. Select "Upload" page (default)
3. Drag files to upload area or click to select files
4. Configure upload options
5. Check files to upload
6. Click "Start Upload"

### View Storage Bucket
1. Click "Storage Bucket" menu on the left
2. Browse uploaded files
3. Click files to view detailed information

### Advanced Features
- **Batch Operations**: Can upload multiple files simultaneously

## 🛠️ Technical Architecture

### Frontend Tech Stack
- **Next.js 14** - React full-stack framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling framework
- **Lucide React** - Icon library

### Backend Integration
- **AWS SDK v3** - S3 client
- **Presigned URLs** - Secure file upload

### Core Features
- **Custom Hooks** - File upload logic encapsulation
- **State Management** - React useState/useEffect
- **Error Handling** - Comprehensive exception handling mechanism

## 📁 Project Structure

```
s3-batch-uploader/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── upload-batch/  # Batch upload API
│   ├── components/        # React components
│   │   ├── FileUpload/    # File upload components
│   │   ├── Navigation/    # Navigation components
│   │   └── ui/           # Common UI components
│   ├── hooks/            # Custom Hooks
│   │   └── useFileUpload.ts
│   ├── lib/              # Utility library
│   │   └── s3-client.ts  # S3 client configuration
│   ├── types/            # TypeScript type definitions
│   ├── upload/           # Upload page
│   ├── history/          # History page
│   └── globals.css       # Global styles
├── public/               # Static assets
├── .env.example          # Environment variable template
├── .env.local           # Local environment variables (needs configuration)
├── package.json         # Project dependencies
├── tailwind.config.js   # Tailwind configuration
├── start.sh            # Startup script
├── SETUP.md            # Setup guide
└── README.md           # Project documentation
```

## 🔧 Development

### Start Development Server
```bash
npm run dev
# Or use startup script
./start.sh
```

### Build Production Version
```bash
npm run build
npm start
```

### Code Linting
```bash
npm run lint
```

## 📚 References
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
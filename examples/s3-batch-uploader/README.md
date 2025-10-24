# 🚀 S3 Batch Uploader

A fully-featured, beautifully designed AWS S3 batch file upload system with drag-and-drop upload, progress monitoring, and other advanced features.

## ✨ Features

### 📁 File Upload
- ✅ **Drag & Drop Upload** - Support dragging files to the page for upload
- ✅ **Click to Select** - Traditional file selection method
- ✅ **Batch Processing** - Select multiple files for batch upload at once
- ✅ **File Preview** - Display image thumbnails and video covers
- ✅ **File Information** - Show detailed information like file format and size

### 📊 Progress Monitoring
- ✅ **Real-time Progress Bar** - Display upload progress for each file
- ✅ **Upload Status** - Waiting, uploading, success, and failure status indicators
- ✅ **Progress Overlay** - Show semi-transparent progress layer on file preview during upload
- ✅ **Error Handling** - Display error messages and retry options when upload fails

### ⚙️ Advanced Configuration
- ✅ **Concurrency Control** - Configure the number of files to upload simultaneously
- ✅ **File Selection** - Check/uncheck files to upload

### 📋 History Management
- ✅ **Upload History** - View list of uploaded files
- ✅ **File Details** - Click to view detailed file information

### 🎨 User Interface
- ✅ **Modern Design** - Clean and beautiful user interface
- ✅ **Responsive Layout** - Adapt to different screen sizes
- ✅ **Sidebar Navigation** - Switch between upload and history pages
- ✅ **Status Feedback** - Rich visual feedback and interactive effects

## 🚀 Quick Start

### 1. Project Running
The project is currently running at: **http://localhost:3003**

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
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_BUCKET_NAME=your-bucket-name
```

### 3. AWS S3 Setup

#### Create S3 Bucket
1. Log in to AWS Console
2. Create a new S3 bucket
3. Configure CORS policy:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"]
  }
]
```

#### Create IAM User
1. Create a new IAM user
2. Add S3 access permission policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
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

#### Allow Public Access Permissions
1. Enable public access permissions in the S3 bucket
2. Allow anonymous users to access objects in the bucket
3. Allow anonymous users to upload objects

## 📖 Usage Guide

### Upload Files
1. Visit http://localhost:3003
2. Select "Upload" page (default)
3. Drag files to the upload area or click to select files
4. Configure upload options
5. Check the files you want to upload
6. Click "Start Upload"

### View History
1. Click "History" menu on the left
2. Browse uploaded files
3. Click on files to view detailed information

### Advanced Features
- **Batch Operations**: Upload multiple files simultaneously

## 🛠️ Technical Architecture

### Frontend Tech Stack
- **Next.js 13** - React full-stack framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling framework
- **Lucide React** - Icon library

### Backend Integration
- **AWS SDK v3** - S3 client
- **Pre-signed URLs** - Secure file upload

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
│   ├── lib/              # Utility libraries
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

## References
- **AWS S3 Documentation**: https://docs.aws.amazon.com/s3/
- **Next.js App Router**: https://nextjs.org/docs/app
- **AWS SDK v3**: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/

## 🐛 Common Issues

### 1. Node.js Version Compatibility
- Recommended to use Node.js 18+ for optimal performance

### 2. AWS Configuration Issues
- Ensure AWS credentials are correct
- Check S3 bucket permissions
- Verify CORS configuration

### 3. Upload Failures
- Check file size limits
- Ensure stable network connection
- Check browser console for error messages

## 📞 Technical Support

If you encounter issues, please:
1. Check environment variable configuration
2. Verify AWS permission settings
3. Check browser console errors
# EdgeOne Pages Hono Application

This is a modern Web application built on the [Hono](https://hono.dev/) framework, deployed on the EdgeOne Pages platform.

Live demo: https://hono-template.edgeone.app

## Deploy

[![Deploy with EdgeOne Pages](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://edgeone.ai/pages/new?from=github&template=hono)

## 🚀 Project Features

- **Modular Route Design** - Clear route organization structure
- **Server-Side Rendering** - Page rendering using JSX and HTML templates
- **File Upload** - File upload functionality support
- **Book Management** - Example CRUD operations
- **Error Handling** - Beautiful 404 and 500 error pages
- **TypeScript Support** - Complete type definitions

## 📁 Project Structure

```
functions/
├── index.tsx              # Main entry file
├── [[default]].ts         # EdgeOne Functions default route
├── env.ts                 # Environment type definitions
├── components/            # Components directory
│   └── Layout.tsx         # Page layout component
└── routers/              # Route modules
    ├── index.ts          # Unified route exports
    ├── book.tsx          # Book related routes
    ├── ssr.tsx           # Server-side rendering routes
    └── upload.ts         # File upload routes
```

## 🛣️ Route Details

### Static Routes

| Path | Method | Description |
|------|------|------|
| `/` | GET | Static home page, serves `index.html` from public directory |

**Examples:**
- `https://hono.edgeone.app/` - Static home page

### SSR Routes (`/ssr`)

| Path | Method | Description |
|------|------|------|
| `/ssr/:name` | GET | Dynamic SSR page, displays personalized welcome message |

**Examples:**
- `https://hono.edgeone.app/ssr/john` - Shows "Hello john!" page

### Book Management Routes (`/book`)

| Path | Method | Description |
|------|------|------|
| `/book` | GET | Get all books list page |
| `/book/:id` | GET | Get specific book details page |
| `/book` | POST | Create new book (API endpoint) |

**Examples:**
- `https://hono.edgeone.app/book` - Book list
- `https://hono.edgeone.app/book/1` - Details of the first book

**Create Book API Request Example:**
```bash
curl -X POST https://hono.edgeone.app/book \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Book Title",
    "author": "Author Name"
  }'
```

**Supported Features:**
- CORS cross-origin support

### File Upload Routes (`/upload`)

| Path | Method | Description |
|------|------|------|
| `/upload` | POST | File upload endpoint |

**Example:**
```bash
curl -X POST https://hono.edgeone.app/upload \
  -F "file=@example.txt"
```

## 📖 Detailed API Documentation

### Basic Information

- **Base URL**: `https://hono.edgeone.app`
- **Content-Type**: `application/json`
- **Encoding**: UTF-8

### API Details

#### 1. File Upload

**Endpoint**: `POST /upload`

**Description**: Upload files to server

**Request Format**: `multipart/form-data`

**Request Parameters**:
- `file` (required): File to upload

**curl Request Examples**:
```bash
# Upload text file
curl -X POST https://hono.edgeone.app/upload \
  -F "file=@/path/to/your/file.txt"

# Upload image file
curl -X POST https://hono.edgeone.app/upload \
  -F "file=@/path/to/image.jpg"

# Upload with custom filename
curl -X POST https://hono.edgeone.app/upload \
  -F "file=@document.pdf;filename=my-document.pdf"
```

**Response Example**:
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "fileName": "file.txt"
}
```

**Error Response**:
```json
{
  "success": false,
  "message": "No file provided"
}
```

#### 2. Create Book

**Endpoint**: `POST /book`

**Description**: Create new book record

**Request Parameters**:
```json
{
  "title": "Book Title",
  "author": "Author Name"
}
```

**Parameter Description**:
- `title` (optional): Book title, defaults to "Untitled"
- `author` (optional): Author name, defaults to "Unknown"

**curl Request Examples**:
```bash
# Create book with complete information
curl -X POST https://hono.edgeone.app/book \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Dream of the Red Chamber",
    "author": "Cao Xueqin"
  }'

# Create book with only title
curl -X POST https://hono.edgeone.app/book \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Book Title"
  }'

# Create empty book (using defaults)
curl -X POST https://hono.edgeone.app/book \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Response Example**:
```json
{
  "success": true,
  "message": "Book created successfully",
  "book": {
    "id": "abc123def",
    "title": "Book Title",
    "author": "Author Name",
    "createdAt": "2023-12-01T10:00:00.000Z"
  }
}
```

#### 3. Get Book Information

**curl Request Examples**:
```bash
# Get all books list
curl -X GET https://hono.edgeone.app/book

# Get specific book details
curl -X GET https://hono.edgeone.app/book/1

# Get personal page
curl -X GET https://hono.edgeone.app/john
```

### Error Code Description

| Error Code | HTTP Status Code | Description |
|-----------|-------------|------|
| `VALIDATION_ERROR` | 400 | Request parameter validation failed |
| `FILE_UPLOAD_ERROR` | 400 | File upload failed |
| `NOT_FOUND` | 404 | Resource not found |
| `INTERNAL_ERROR` | 500 | Internal server error |

### Rate Limiting

- All API endpoints currently have no rate limiting
- Client-side request frequency control is recommended

### CORS Support

All API endpoints support cross-origin access, response headers include:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: POST, GET, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization`

## 🔧 Development

### Local Development

```bash
# Install dependencies
npm install

# Start development server
edgeone pages dev
```


## 🌐 Environment Variables

The project uses the following environment variables and global objects:

- `my_kv` - KV storage instance for data persistence

## 🛡️ Security Features

### IP Restriction (Optional)

The project includes IP restriction middleware configuration (commented by default), which can limit access sources:

```typescript
app.use('*', ipRestriction(/* configuration */));
```

## 📝 API Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error Response

```json
{
  "error": "ERROR_CODE",
  "message": "Error description"
}
```

## 🎨 UI Design

The project adopts modern UI design:
- Responsive layout
- System font stack
- Card-style design
- Unified color theme
- Elegant error pages

## 📦 Dependencies

- **hono** - Web framework
- **@edgeone/ef-types** - EdgeOne Functions type definitions
- **edgeone** - EdgeOne CLI tool

## 🤝 Contributing

Welcome to submit Issues and Pull Requests to improve this project.

## 📄 License

MIT License

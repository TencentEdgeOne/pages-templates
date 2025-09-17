# EdgeOne Pages Hono 应用程序

这是一个基于 [Hono](https://hono.dev/) 框架构建的现代 Web 应用程序，部署在 EdgeOne Pages 平台上。

在线演示：https://hono.edgeone.site

## 部署

[![使用 EdgeOne Pages 部署](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://console.cloud.tencent.com/edgeone/pages/new?template=hono)

## 🚀 项目特性

- **模块化路由设计** - 清晰的路由组织结构
- **服务端渲染** - 使用 JSX 和 HTML 模板进行页面渲染
- **文件上传** - 文件上传功能支持
- **图书管理** - 示例 CRUD 操作
- **错误处理** - 精美的 404 和 500 错误页面
- **TypeScript 支持** - 完整的类型定义

## 📁 项目结构

```
functions/
├── index.tsx              # 主入口文件
├── [[default]].ts         # EdgeOne Functions 默认路由
├── env.ts                 # 环境类型定义
├── components/            # 组件目录
│   └── Layout.tsx         # 页面布局组件
└── routers/              # 路由模块
    ├── index.ts          # 统一路由导出
    ├── book.tsx          # 图书相关路由
    ├── ssr.tsx           # 服务端渲染路由
    └── upload.ts         # 文件上传路由
```

## 🛣️ 路由详情

### 静态路由

| 路径 | 方法 | 描述 |
|------|------|------|
| `/` | GET | 静态首页，从 public 目录提供 `index.html` |

**示例：**
- `https://hono.edgeone.app/` - 静态首页

### SSR 路由 (`/ssr`)

| 路径 | 方法 | 描述 |
|------|------|------|
| `/ssr/:name` | GET | 动态 SSR 页面，显示个性化欢迎消息 |

**示例：**
- `https://hono.edgeone.app/ssr/john` - 显示 "Hello john!" 页面

### 图书管理路由 (`/book`)

| 路径 | 方法 | 描述 |
|------|------|------|
| `/book` | GET | 获取所有图书列表页面 |
| `/book/:id` | GET | 获取特定图书详情页面 |
| `/book` | POST | 创建新图书（API 端点） |

**示例：**
- `https://hono.edgeone.app/book` - 图书列表
- `https://hono.edgeone.app/book/1` - 第一本书的详情

**创建图书 API 请求示例：**
```bash
curl -X POST https://hono.edgeone.app/book \
  -H "Content-Type: application/json" \
  -d '{
    "title": "新书标题",
    "author": "作者姓名"
  }'
```

**支持的功能：**
- CORS 跨域支持

### 文件上传路由 (`/upload`)

| 路径 | 方法 | 描述 |
|------|------|------|
| `/upload` | POST | 文件上传端点 |

**示例：**
```bash
curl -X POST https://hono.edgeone.app/upload \
  -F "file=@example.txt"
```

## 📖 详细 API 文档

### 基本信息

- **Base URL**: `https://hono.edgeone.app`
- **Content-Type**: `application/json`
- **编码**: UTF-8

### API 详情

#### 1. 文件上传

**端点**: `POST /upload`

**描述**: 上传文件到服务器

**请求格式**: `multipart/form-data`

**请求参数**:
- `file` (必需): 要上传的文件

**curl 请求示例**:
```bash
# 上传文本文件
curl -X POST https://hono.edgeone.app/upload \
  -F "file=@/path/to/your/file.txt"

# 上传图片文件
curl -X POST https://hono.edgeone.app/upload \
  -F "file=@/path/to/image.jpg"

# 上传并自定义文件名
curl -X POST https://hono.edgeone.app/upload \
  -F "file=@document.pdf;filename=my-document.pdf"
```

**响应示例**:
```json
{
  "success": true,
  "message": "文件上传成功",
  "fileName": "file.txt"
}
```

**错误响应**:
```json
{
  "success": false,
  "message": "未提供文件"
}
```

#### 2. 创建图书

**端点**: `POST /book`

**描述**: 创建新的图书记录

**请求参数**:
```json
{
  "title": "图书标题",
  "author": "作者姓名"
}
```

**参数说明**:
- `title` (可选): 图书标题，默认为 "Untitled"
- `author` (可选): 作者姓名，默认为 "Unknown"

**curl 请求示例**:
```bash
# 创建包含完整信息的图书
curl -X POST https://hono.edgeone.app/book \
  -H "Content-Type: application/json" \
  -d '{
    "title": "红楼梦",
    "author": "曹雪芹"
  }'

# 只创建标题的图书
curl -X POST https://hono.edgeone.app/book \
  -H "Content-Type: application/json" \
  -d '{
    "title": "新书标题"
  }'

# 创建空图书（使用默认值）
curl -X POST https://hono.edgeone.app/book \
  -H "Content-Type: application/json" \
  -d '{}'
```

**响应示例**:
```json
{
  "success": true,
  "message": "图书创建成功",
  "book": {
    "id": "abc123def",
    "title": "图书标题",
    "author": "作者姓名",
    "createdAt": "2023-12-01T10:00:00.000Z"
  }
}
```

#### 3. 获取图书信息

**curl 请求示例**:
```bash
# 获取所有图书列表
curl -X GET https://hono.edgeone.app/book

# 获取特定图书详情
curl -X GET https://hono.edgeone.app/book/1

# 获取个人页面
curl -X GET https://hono.edgeone.app/john
```

### 错误码说明

| 错误码 | HTTP 状态码 | 描述 |
|-----------|-------------|------|
| `VALIDATION_ERROR` | 400 | 请求参数验证失败 |
| `FILE_UPLOAD_ERROR` | 400 | 文件上传失败 |
| `NOT_FOUND` | 404 | 资源未找到 |
| `INTERNAL_ERROR` | 500 | 内部服务器错误 |

### 频率限制

- 目前所有 API 端点均无频率限制
- 建议客户端进行请求频率控制

### CORS 支持

所有 API 端点均支持跨域访问，响应头包含：
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: POST, GET, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization`

## 🔧 开发

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
edgeone pages dev
```

## 🌐 环境变量

项目使用以下环境变量和全局对象：

- `my_kv` - KV 存储实例，用于数据持久化

## 🛡️ 安全特性

### IP 限制（可选）

项目包含 IP 限制中间件配置（默认注释），可以限制访问来源：

```typescript
app.use('*', ipRestriction(/* 配置 */));
```

## 📝 API 响应格式

### 成功响应

```json
{
  "success": true,
  "message": "操作成功",
  "data": {}
}
```

### 错误响应

```json
{
  "error": "ERROR_CODE",
  "message": "错误描述"
}
```

## 🎨 UI 设计

项目采用现代化 UI 设计：
- 响应式布局
- 系统字体栈
- 卡片式设计
- 统一色彩主题
- 优雅的错误页面

## 📦 依赖

- **hono** - Web 框架
- **@edgeone/ef-types** - EdgeOne Functions 类型定义
- **edgeone** - EdgeOne CLI 工具

## 🤝 贡献

欢迎提交 Issues 和 Pull Requests 来改进这个项目。

## �� 许可证

MIT License

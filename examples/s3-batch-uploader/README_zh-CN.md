# 🚀 S3 批量上传器

一个功能完整、界面美观的 AWS S3 批量文件上传系统，支持拖拽上传、进度监控等高级功能。

[![使用 EdgeOne Pages 部署](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://console.cloud.tencent.com/edgeone/pages/new?template=s3-batch-uploader)

## ✨ 功能特性

### 📁 文件上传
- ✅ **拖拽上传** - 支持将文件拖拽到页面进行上传
- ✅ **点击选择** - 传统的文件选择方式
- ✅ **批量处理** - 一次选择多个文件进行批量上传
- ✅ **文件预览** - 显示图片缩略图和视频封面
- ✅ **文件信息** - 显示文件格式、大小等详细信息

### 📊 进度监控
- ✅ **实时进度条** - 显示每个文件的上传进度
- ✅ **上传状态** - 等待、上传中、成功、失败状态指示
- ✅ **进度蒙板** - 上传时在文件预览上显示半透明进度层
- ✅ **错误处理** - 上传失败时显示错误信息和重试选项

### ⚙️ 高级配置
- ✅ **并发控制** - 可配置同时上传的文件数量
- ✅ **文件选择** - 可以勾选/取消勾选要上传的文件

### 📋 存储桶管理
- ✅ **存储桶记录** - 查看已上传的文件列表
- ✅ **在线预览** - 可以在线预览图片和视频文件

### 🎨 用户界面
- ✅ **现代化设计** - 简洁美观的用户界面
- ✅ **响应式布局** - 适配不同屏幕尺寸
- ✅ **状态反馈** - 丰富的视觉反馈和交互效果

## 🚀 快速开始

### 1. 项目已启动
项目当前运行在：**http://localhost:3003**

### 2. 配置 AWS S3
在使用前，请配置你的 AWS S3 设置：

```bash
# 复制环境变量模板
cp .env.example .env.local

# 编辑配置文件
nano .env.local
```

填入你的 AWS 配置：
```env
AWS_BUCKET_REGION=your-bucket-region
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_BUCKET_NAME=your-bucket-name
```

### 3. AWS S3 设置

#### 创建 S3 存储桶
1. 登录 AWS 控制台
2. 创建新的 S3 存储桶
3. 配置 CORS 策略：

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

#### 创建 IAM 用户
1. 创建新的 IAM 用户
2. 添加 S3 访问权限策略：

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

## 📖 使用指南

### 上传文件
1. 访问 http://localhost:3003
2. 选择"上传"页面（默认）
3. 拖拽文件到上传区域或点击选择文件
4. 配置上传选项
5. 勾选要上传的文件
6. 点击"开始上传"

### 查看存储桶
1. 点击左侧"存储桶"菜单
2. 浏览已上传的文件
3. 点击文件查看详细信息

### 高级功能
- **批量操作**：可以同时上传多个文件

## 🛠️ 技术架构

### 前端技术栈
- **Next.js 14** - React 全栈框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **Lucide React** - 图标库

### 后端集成
- **AWS SDK v3** - S3 客户端
- **预签名 URL** - 安全的文件上传

### 核心功能
- **自定义 Hooks** - 文件上传逻辑封装
- **状态管理** - React useState/useEffect
- **错误处理** - 完善的异常处理机制

## 📁 项目结构

```
s3-batch-uploader/
├── app/                           # Next.js App Router
│   ├── api/                      # API 路由
│   │   ├── health/               # 健康检查端点
│   │   ├── presigned-url/        # 预签名 URL 生成
│   │   ├── rewrite/              # URL 重写处理
│   │   ├── s3-files/             # S3 文件操作
│   │   ├── storage-usage/        # 存储使用统计
│   │   ├── upload/               # 单文件上传
│   │   └── upload-batch/         # 批量上传 API
│   ├── history/                  # 历史记录页面
│   │   └── page.tsx
│   ├── upload/                   # 上传页面
│   │   └── page.tsx
│   ├── favicon.ico
│   ├── layout.tsx               # 根布局
│   └── page.tsx                 # 首页
├── components/                   # React 组件
│   ├── FileUpload/              # 文件上传组件
│   │   ├── DropZone.tsx         # 拖拽上传区域
│   │   ├── FilePreview.tsx      # 文件预览显示
│   │   ├── ProgressOverlay.tsx  # 上传进度蒙板
│   │   └── UploadConfig.tsx     # 上传配置
│   ├── History/                 # 历史记录管理组件
│   │   ├── ErrorDisplay.tsx     # 错误显示组件
│   │   ├── ExportDialog.tsx     # 导出功能
│   │   ├── HistoryActions.tsx   # 操作按钮
│   │   ├── HistoryFilters.tsx   # 过滤控件
│   │   ├── HistoryHeader.tsx    # 头部组件
│   │   ├── HistoryList.tsx      # 文件列表显示
│   │   └── HistoryStats.tsx     # 统计信息显示
│   ├── Layout/                  # 布局组件
│   │   └── MainLayout.tsx       # 主布局包装器
│   ├── Sidebar/                 # 导航组件
│   │   └── Navigation.tsx       # 侧边栏导航
│   ├── Storage/                 # 存储组件
│   │   └── StorageUsage.tsx     # 存储使用显示
│   ├── UI/                      # 通用 UI 组件
│   │   ├── Button.tsx           # 按钮组件
│   │   ├── Modal.tsx            # 模态框组件
│   │   └── Progress.tsx         # 进度条组件
│   └── FileUploader.tsx         # 主文件上传器
├── config/                      # 配置文件
│   └── upload.ts               # 上传配置
├── hooks/                       # 自定义 React Hooks
│   ├── useFileUpload.ts        # 文件上传逻辑
│   ├── useHistoryFilters.ts    # 历史记录过滤
│   ├── useHistorySelection.ts  # 历史记录选择
│   ├── usePresignedUrl.ts      # 预签名 URL 管理
│   ├── useS3Files.ts           # S3 文件操作
│   ├── useStorageInfo.ts       # 存储信息
│   └── useStorageRefresh.ts    # 存储刷新逻辑
├── lib/                        # 工具库
│   ├── s3-client.ts           # S3 客户端配置
│   ├── storage.ts             # 存储工具
│   └── upload-utils.ts        # 上传辅助函数
├── messages/                   # 国际化
│   └── zh.json               # 中文翻译
├── public/                     # 静态资源
│   ├── icons/                 # 图标文件
│   │   └── file-default.svg   # 默认文件图标
│   ├── favicon-16.svg
│   ├── favicon-32.svg
│   ├── favicon.ico
│   └── favicon.svg
├── styles/                     # 样式文件
│   └── globals.css            # 全局样式
├── types/                      # TypeScript 类型定义
│   └── upload.ts              # 上传相关类型
├── .env.example               # 环境变量模板
├── .eslintrc.json            # ESLint 配置
├── .gitignore                # Git 忽略规则
├── .prettierrc               # Prettier 配置
├── middleware.ts             # Next.js 中间件
├── next.config.js            # Next.js 配置
├── package.json              # 项目依赖
├── postcss.config.js         # PostCSS 配置
├── start.sh                  # 启动脚本
├── tailwind.config.js        # Tailwind CSS 配置
├── tsconfig.json             # TypeScript 配置
├── README.md                 # 项目文档（英文）
└── README_zh-CN.md           # 项目文档（中文）
```

## 🔧 开发说明

### 启动开发服务器
```bash
npm run dev
# 或使用启动脚本
./start.sh
```

### 构建生产版本
```bash
npm run build
npm start
```

### 代码检查
```bash
npm run lint
```


## 参考资料
- **AWS S3 文档**: https://docs.aws.amazon.com/s3/
- **Next.js App Router**: https://nextjs.org/docs/app
- **AWS SDK v3**: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/


## 🐛 常见问题

### 1. Node.js 版本兼容性
- 推荐使用 Node.js 18+ 以获得最佳性能

### 2. AWS 配置问题
- 确保 AWS 凭证正确
- 检查 S3 存储桶权限
- 验证 CORS 配置

### 3. 上传失败
- 检查文件大小限制
- 确认网络连接稳定
- 查看浏览器控制台错误信息

## 📞 技术支持

如果遇到问题，请：
1. 检查环境变量配置
2. 验证 AWS 权限设置
3. 查看浏览器控制台错误

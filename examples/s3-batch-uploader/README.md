# 🚀 S3 批量上传器

一个功能完整、界面美观的 AWS S3 批量文件上传系统，支持拖拽上传、进度监控、断点续传等高级功能。

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

### 📋 历史管理
- ✅ **历史记录** - 查看已上传的文件列表
- ✅ **文件详情** - 点击查看文件的详细信息

### 🎨 用户界面
- ✅ **现代化设计** - 简洁美观的用户界面
- ✅ **响应式布局** - 适配不同屏幕尺寸
- ✅ **侧边导航** - 上传和历史记录页面切换
- ✅ **状态反馈** - 丰富的视觉反馈和交互效果

## 🚀 快速开始

### 1. 项目已启动
项目当前运行在：**http://localhost:3001**

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
AWS_REGION=us-east-1
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

#### 允许公共访问权限
1. 在 S3 存储桶中启用公共访问权限
2. 允许匿名用户访问存储桶中的对象
3. 允许匿名用户上传对象

## 📖 使用指南

### 上传文件
1. 访问 http://localhost:3001
2. 选择"上传"页面（默认）
3. 拖拽文件到上传区域或点击选择文件
4. 配置上传选项
5. 勾选要上传的文件
6. 点击"开始上传"

### 查看历史
1. 点击左侧"历史记录"菜单
2. 浏览已上传的文件
3. 点击文件查看详细信息

### 高级功能
- **批量操作**：可以同时上传多个文件

## 🛠️ 技术架构

### 前端技术栈
- **Next.js 13** - React 全栈框架
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
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   │   └── upload-batch/  # 批量上传 API
│   ├── components/        # React 组件
│   │   ├── FileUpload/    # 文件上传组件
│   │   ├── Navigation/    # 导航组件
│   │   └── ui/           # 通用 UI 组件
│   ├── hooks/            # 自定义 Hooks
│   │   └── useFileUpload.ts
│   ├── lib/              # 工具库
│   │   └── s3-client.ts  # S3 客户端配置
│   ├── types/            # TypeScript 类型定义
│   ├── upload/           # 上传页面
│   ├── history/          # 历史记录页面
│   └── globals.css       # 全局样式
├── public/               # 静态资源
├── .env.example          # 环境变量模板
├── .env.local           # 本地环境变量（需配置）
├── package.json         # 项目依赖
├── tailwind.config.js   # Tailwind 配置
├── start.sh            # 启动脚本
├── SETUP.md            # 设置指南
└── README.md           # 项目说明
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
- 当前支持 Node.js 16+
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

---

**🎉 享受现代化的文件上传体验！**
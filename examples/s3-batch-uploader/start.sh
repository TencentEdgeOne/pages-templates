#!/bin/bash

# S3 批量上传器启动脚本
echo "🚀 启动 S3 批量上传器..."

# 检查 Node.js 版本
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  警告: 当前 Node.js 版本为 $(node -v)，推荐使用 Node.js 18+ 以获得最佳体验"
    echo "📝 如果遇到问题，请考虑升级 Node.js 版本"
fi

# 检查环境变量文件
if [ ! -f ".env.local" ]; then
    echo "📋 创建环境变量文件..."
    cp .env.example .env.local
    echo "✅ 请编辑 .env.local 文件，填入你的 AWS 配置信息"
fi

# 启动开发服务器
echo "🔧 启动开发服务器..."
npm run dev
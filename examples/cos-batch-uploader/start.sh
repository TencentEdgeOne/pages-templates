#!/bin/bash

# 腾讯云COS批量上传器启动脚本
echo "🚀 启动腾讯云COS批量上传器..."

# 检查Node.js版本
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  警告: 当前Node.js版本为 $(node -v), 建议使用Node.js 18+以获得最佳体验"
    echo "📝 如果遇到问题,请考虑升级您的Node.js版本"
fi

# 检查环境变量文件
if [ ! -f ".env.local" ]; then
    echo "📋 创建环境变量文件..."
    cp .env.example .env.local
    echo "✅ 请编辑.env.local文件并填入您的腾讯云COS配置"
fi

# 启动开发服务器
echo "🔧 启动开发服务器..."
npm run dev
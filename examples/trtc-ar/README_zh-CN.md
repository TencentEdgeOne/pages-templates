# Web 美颜特效模板

这个模板可以使用腾讯 Web 美颜特效 , 可以体验各种美颜效果

## 部署到 Edgeone Pages

### 1. 一键部署到Edgeone Pages，获得项目预览链接地址

[![使用 EdgeOne Pages 部署](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://console.cloud.tencent.com/edgeone/pages/new?template=trtc-ar)

![1751509422980](https://raw.githubusercontent.com/clumsy-goose/template-readme-images/main/trtc-ar/1751509422980.png)

可在项目列表点击预览
![1751460123642](https://raw.githubusercontent.com/clumsy-goose/template-readme-images/main/trtc-ar/1751460123642.png)

或在项目的项目概览点击预览

![1751460335291](https://raw.githubusercontent.com/clumsy-goose/template-readme-images/main/trtc-ar/1751460335291.png)

点击复制预览地址，只用保留域名
![1751460335291](https://raw.githubusercontent.com/clumsy-goose/template-readme-images/main/trtc-ar/1751441411057.png)

**注意不要使用部署记录的预览地址域名，每次重新部署，将会重新生产一条部署记录并绑定新的域名，每条部署记录的域名都不一样，而项目的预览地址是固定的，访问项目的预览地址可以查看最新的部署结果**

### 2. 获取APPID；绑定预览链接地址， 创建 License，获得License Key 和 Token

参考文档 ：[获取 Web 美颜特效的 License 和 APPID](https://cloud.tencent.com/document/product/616/71364)

1. 获取APPID
   登录腾讯云控制台，进入账号信息 > [基本信息](https://console.cloud.tencent.com/developer "https://console.cloud.tencent.com/developer") 查看 APPID
   ![1751440561061](https://raw.githubusercontent.com/clumsy-goose/template-readme-images/main/trtc-ar/1751440561061.png)
2. 获取 License Key 和 Token
   进入音视频终端 SDK 控制台 > License 管理 > [Web License管理](https://console.cloud.tencent.com/vcube/web "https://console.cloud.tencent.com/vcube/web")
   若无已创建的Web License，新建License
   ![1751440847194](https://raw.githubusercontent.com/clumsy-goose/template-readme-images/main/trtc-ar/1751440847194.png) **Domain填写第一步获取的预览链接地址**

   查看已创建的Web License 并复制其 License Key 和 Token![1751441116051](https://raw.githubusercontent.com/clumsy-goose/template-readme-images/main/trtc-ar/1751441116051.png)
   **Web Domain：**创建项目时填写的域名信息，只可以在该域名和开发环境下使用此 License

### 3. 设置环境变量，重新部署

1. 在Edgeone Pages控制台**项目设置/环境变量**新增环境变量

   ```
   NEXT_PUBLIC_APPID = '你的腾讯云APPID'
   NEXT_PUBLIC_LICENSE_KEY = '你的 Web License Key'
   NEXT_PUBLIC_LICENSE_TOKEN = '你的 Web License Token'
   ```

   ![1751442074949](https://raw.githubusercontent.com/clumsy-goose/template-readme-images/main/trtc-ar/1751442074949.png) 2. 重新部署后，再次访问项目预览链接
   ![1751513489230](https://raw.githubusercontent.com/clumsy-goose/template-readme-images/main/trtc-ar/1751513489230.png)

## 本地开发

### 项目依赖安装

```sh
npm install
```

### 设置环境变量

#### 1. 获取环境变量

[获取 Web 美颜特效的 License 和 APPID](https://cloud.tencent.com/document/product/616/71364)

#### 2. 创建.env.local文件

![1751442977073](https://raw.githubusercontent.com/clumsy-goose/template-readme-images/main/trtc-ar/1751442977073.png)

#### 3. 在.env.local写入环境变量：

```
NEXT_PUBLIC_APPID = '你的腾讯云APPID'
NEXT_PUBLIC_LICENSE_KEY = '你的 Web License Key'
NEXT_PUBLIC_LICENSE_TOKEN = '你的 Web License Token'
```

### 本地开发调试

```sh
npm run dev
```

### 生产环境打包

```sh
npm run build
```

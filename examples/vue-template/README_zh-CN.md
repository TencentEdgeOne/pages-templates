# vue

此模板应帮助您在 Vite 中使用 Vue 3 开始开发。

## 部署

[![使用 EdgeOne Pages 部署](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://console.cloud.tencent.com/edgeone/pages/new?from=github&template=vue-template)

## 推荐的 IDE 设置

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)（并禁用 Vetur）。

## TS 中对 `.vue` 导入的类型支持

默认情况下，TypeScript 无法处理 `.vue` 导入的类型信息，因此我们用 `vue-tsc` 替代 `tsc` CLI 进行类型检查。在编辑器中，我们需要 [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) 使 TypeScript 语言服务意识到 `.vue` 类型。

## 自定义配置

请参见 [Vite 配置参考](https://vitejs.dev/config/)。

## 项目设置

```sh
npm install
```

### 开发环境下编译并热重载

```sh
npm run dev
```

### 生产环境下进行类型检查、编译和压缩

```sh
npm run build
```

### 使用 [ESLint](https://eslint.org/) 进行代码检查

```sh
npm run lint
```
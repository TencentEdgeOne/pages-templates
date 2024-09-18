# eleventy-base-blog v8

一个使用 [Eleventy](https://www.11ty.dev/) 网站生成器构建博客的起始库（使用 [v2.0 版本](https://www.11ty.dev/blog/eleventy-v2/)）。

## 部署

[![使用 EdgeOne Pages 部署](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://console.cloud.tencent.com/edgeone/pages/new?from=github&template=eleventy-boilerplate)

## 开始

* [想要更通用/详细的指南？](https://www.11ty.dev/docs/getting-started/)

1. 创建一个目录并导航到此目录：

```
mkdir my-blog-name
cd my-blog-name
```

2. 克隆此仓库

```
git clone https://github.com/11ty/eleventy-base-blog.git .
```

_可选:_ 查看 `eleventy.config.js` 和 `_data/metadata.js` 配置网站的选项和数据。

3. 安装依赖

```
npm install
```

4. 运行 Eleventy

生成生产就绪的构建到 `_site` 文件夹：

```
npx @11ty/eleventy
```

或者在本地开发服务器上构建和托管：

```
npx @11ty/eleventy --serve
```

或者你可以运行[调试模式](https://www.11ty.dev/docs/debugging/)来查看所有内部细节。

## 特点

- 使用 [Eleventy v2.0](https://www.11ty.dev/blog/eleventy-v2/)，零JavaScript输出。
	- 内容完全预渲染（这是一个静态网站）。
	- 可以轻松[部署到子文件夹而不更改任何内容](https://www.11ty.dev/docs/plugins/html-base/)
	- 所有 URL 与内容在文件系统中的位置解耦。
	- 通过 [Eleventy Data Cascade](https://www.11ty.dev/docs/data-cascade/) 配置模板。
- **性能聚焦**：开箱即用的四百 Lighthouse 分数！
	- [查看最新构建的 Lighthouse 报告](https://eleventy-base-blog.netlify.app/reports/lighthouse/)，感谢 [Netlify Lighthouse 插件](https://github.com/netlify/netlify-plugin-lighthouse)。
	- _零累计布局偏移_
	- _零总阻塞时间_
- 由 [Eleventy Dev Server](https://www.11ty.dev/docs/dev-server/) 提供本地开发实时重载。
- 内容驱动的[导航菜单](https://www.11ty.dev/docs/plugins/navigation/)
- 通过 `{% image %}` 短代码进行[图像优化](https://www.11ty.dev/docs/plugins/image/)。
	- 零JavaScript输出。
	- 自动支持现代图像格式（例如 AVIF 和 WebP）
	- 如果可能，优先使用 `<img>` 标记（单一图像格式），但会自动切换为 `<picture>` 以支持多图像格式。
	- 自动生成具有 `srcset` 和可选 `sizes` 的 `<picture>` 语法标记。
	- 包括 `width`/`height` 属性以避免[内容布局偏移](https://web.dev/cls/)。
	- 包括 `loading="lazy"` 进行本地懒加载，无需 JavaScript。
	- 包括 [`decoding="async"`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decoding)
	- 图像可以与博客文章文件共同定位。
	- 查看 [图像插件源代码](https://github.com/11ty/eleventy-base-blog/blob/main/eleventy.config.images.js)
- 每页 CSS 捆绑 [通过 `eleventy-plugin-bundle`](https://github.com/11ty/eleventy-plugin-bundle)。
- 内置[语法高亮](https://www.11ty.dev/docs/plugins/syntaxhighlight/)（零JavaScript输出）。
- 博客文章
	- 草稿文章：使用 `draft: true` 标记博客文章为草稿。草稿**仅**在 `--serve`/`--watch` 期间包含，不包含在完整构建中。查看 [草稿插件源代码](https://github.com/11ty/eleventy-base-blog/blob/main/eleventy.config.drafts.js)。
	- 自动的上/下一篇文章链接
	- 可访问的深层链接到标题
- 生成的页面
	- 主页、归档和关于页面。
	- [Atom 和 JSON 的订阅源](https://www.11ty.dev/docs/plugins/rss/)
	- `sitemap.xml`
	- 零维护标签页（[在演示中查看](https://eleventy-base-blog.netlify.app/tags/)）
	- 内容未找到（404）页面

### 实现注意事项

- `content/about/index.md` 是一个内容页面的示例。
- `content/blog/` 包含博客文章，但实际上它们可以位于任何目录。它们只需 `posts` 标签就可包含在博客文章[集合](https://www.11ty.dev/docs/collections/)中。
- 在前置数据中使用 `eleventyNavigation` 键（通过 [Eleventy Navigation 插件](https://www.11ty.dev/docs/plugins/navigation/)）将模板添加到顶级站点导航。此功能用于 `content/index.njk` 和 `content/about/index.md`。
- 内容可以采用 _任何模板格式_ （博客文章不必仅限于 markdown。例如），在 `eleventy.config.js` -> `templateFormats` 中配置项目的支持模板。
- 输入目录中的 `public` 文件夹将被复制到输出文件夹中（通过 `eleventy.config.js` 文件中的 `addPassthroughCopy`）。这意味着 `./public/css/*` 构建完成后将位于 `./_site/css/*`。
- 提供两个内容订阅源：
	- `content/feed/feed.njk`
	- `content/feed/json.njk`
- 此项目使用三个[Eleventy 布局](https://www.11ty.dev/docs/layouts/)：
	- `_includes/layouts/base.njk`：顶级 HTML 结构
	- `_includes/layouts/home.njk`：主页模板（包装到 `base.njk` 中）
	- `_includes/layouts/post.njk`：博客文章模板（包装到 `base.njk` 中）
- `_includes/postslist.njk` 是一个 Nunjucks 包含文件，是一个可重用的组件，用于显示所有文章的列表。`content/index.njk` 有一个如何使用它的示例。

#### 内容安全策略

如果你的网站实施 [内容安全策略](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)（如公共网站应当如此），你有以下几个选择（选择一个）：

1. 在 `base.njk` 中，移除 `<style>{% getBundle "css" %}</style>` 并取消注释 `<link rel="stylesheet" href="{% getBundleFileUrl "css" %}">`
2. 配置服务器使用 CSP 指令 `style-src: 'unsafe-inline'`（安全性较低）。
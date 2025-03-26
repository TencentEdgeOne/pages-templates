import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  // base: "http://localhost:8088/",
  site: "https://astroship.web3templates.com",
  integrations: [mdx(), sitemap(), icon(), react()],
  vite: {
    plugins: [tailwindcss()]
  },
  security: {
    checkOrigin: false,
  },
  server: {
    headers: {
      // 允许所有域名跨域访问（开发环境）
      "access-control-allow-origin": "http://localhost:8088",
      // 允许的 HTTP 方法
      "access-control-allow-methods": "OPTIONS,HEAD,DELETE,PUT,POST,PATCH,GET,TRACE,*",
      // 允许的请求头
      "access-control-allow-headers": "Content-Type, *",
      "access-control-allow-credentials": "true",
      "vary": "Origin"
    }
  },
  
});
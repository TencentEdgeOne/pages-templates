export type Locale = 'zh' | 'en';

type DeepWiden<T> = T extends string
  ? string
  : T extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepWiden<U>>
    : T extends object
      ? { readonly [K in keyof T]: DeepWiden<T[K]> }
      : T;

export const translations = {
  zh: {
    // Header
    header: {
      title: 'EdgeOne Pages',
    },
    // Welcome page
    welcome: {
      title: '网页版 MCP',
      subtitle: '快速部署 AI 内容，一键生成访问链接',
      description: '基于 EdgeOne 边缘函数实现的 MCP Client 与 MCP Server',
      placeholder: '生成一个',
    },
    // Placeholder variants
    placeholderVariants: [
      '表白网页',
      '个人简历',
      '博客站点',
      '商城应用',
      '作品集',
      '电子相册',
      '婚礼邀请函',
      '产品展示页',
      '旅行博客',
    ],
    // Prompt suggestions
    promptSuggestions: [
      {
        title: '旅游攻略',
        prompt: '生成一个成都三日游旅游攻略网页，包含每日推荐路线、美食推荐、交通建议和实用小贴士。页面采用清晰的卡片式布局，使用栅格系统确保各元素对齐，添加响应式设计适配不同设备。使用一致的颜色方案和字体层级，设计简约现代，确保导航便捷。',
      },
      {
        title: '个人简历',
        prompt: '生成一个响应式个人简历网站，包含技能展示、项目经历和联系方式。采用单页滚动设计，使用粘性导航确保快速访问各部分。使用进度条展示技能熟练度，时间轴展示工作经历，添加深色/浅色主题切换。精心设计间距和对齐，确保视觉层次清晰，元素排版。',
      },
      {
        title: '表白网页',
        prompt: '生成一个浪漫的表白网页，包含动态爱心动画、打字机效果的告白文字和背景音乐控制。页面布局简洁有序，主次分明，使用适当间距和留白提高可读性。添加可交互的爱情故事时间线，使用动画强化情感表达，确保全屏效果美观。重点优化色彩搭配与视觉平衡。',
      },
      {
        title: '贪吃蛇游戏',
        prompt: '生成一个经典的贪吃蛇小游戏网页，使用Canvas或SVG绘制游戏界面。游戏区域要有明确边界，控制面板位置合理易用，确保游戏区和信息区比例协调。包含计分系统、难度选择和清晰的游戏控制说明。设计简洁现代的UI界面，注重色彩对比度，确保所有元素对齐整齐，游戏流畅。',
      },
    ],
    // Messages
    messages: {
      send: '发送',
      back: '返回',
      mcpProcess: 'MCP 调用过程',
      searching: '边缘函数运行中，请稍后...',
      error: '抱歉，出现了错误。请重试。',
      httpError: 'HTTP错误：',
    },
    // Status messages
    status: {
      processing: '处理完成',
      success: '网页已成功部署',
      failed: '处理过程中遇到了一些问题',
      errorInfo: '错误信息',
    },
    // Footer
    footer: {
      learnMore: '了解更多',
    },
    // Language
    language: {
      zh: '中文',
      en: 'English',
    },
  },
  en: {
    // Header
    header: {
      title: 'EdgeOne Pages',
    },
    // Welcome page
    welcome: {
      title: 'Web MCP',
      subtitle: 'Deploy AI content quickly, generate access links with one click',
      description: 'MCP Client and MCP Server based on EdgeOne Edge Functions',
      placeholder: 'Generate a ',
    },
    // Placeholder variants
    placeholderVariants: [
      'love confession page',
      'personal resume',
      'blog site',
      'e-commerce app',
      'portfolio',
      'photo album',
      'wedding invitation',
      'product showcase',
      'travel blog',
    ],
    // Prompt suggestions
    promptSuggestions: [
      {
        title: 'Travel Guide',
        prompt: 'Generate a 3-day Chengdu travel guide webpage, including daily recommended routes, food recommendations, transportation suggestions, and practical tips. Use a clear card-based layout with a grid system to ensure element alignment, and add responsive design for different devices. Use a consistent color scheme and font hierarchy, with a simple and modern design for easy navigation.',
      },
      {
        title: 'Resume',
        prompt: 'Generate a responsive personal resume website with skill showcase, project experience, and contact information. Use a single-page scroll design with sticky navigation for quick access to each section. Use progress bars to show skill proficiency, a timeline for work experience, and add dark/light theme toggle. Carefully design spacing and alignment to ensure clear visual hierarchy and element layout.',
      },
      {
        title: 'Love Page',
        prompt: 'Generate a romantic love confession webpage with dynamic heart animations, typewriter effect text, and background music controls. The page layout should be clean and orderly, with clear priorities, using appropriate spacing and whitespace to improve readability. Add an interactive love story timeline, use animations to enhance emotional expression, and ensure full-screen aesthetic appeal. Focus on color matching and visual balance.',
      },
      {
        title: 'Snake Game',
        prompt: 'Generate a classic Snake game webpage using Canvas or SVG to draw the game interface. The game area should have clear boundaries, with control panels positioned reasonably for easy use, ensuring balanced proportions between the game area and info area. Include a scoring system, difficulty selection, and clear game control instructions. Design a simple and modern UI interface, focus on color contrast, ensure all elements are aligned neatly, and the game runs smoothly.',
      },
    ],
    // Messages
    messages: {
      send: 'Send',
      back: 'Back',
      mcpProcess: 'MCP Process',
      searching: 'Edge function running, please wait...',
      error: 'Sorry, an error occurred. Please try again.',
      httpError: 'HTTP error: ',
    },
    // Status messages
    status: {
      processing: 'Processing complete',
      success: 'Webpage deployed successfully',
      failed: 'Some issues occurred during processing',
      errorInfo: 'Error info',
    },
    // Footer
    footer: {
      learnMore: 'Learn more',
    },
    // Language
    language: {
      zh: '中文',
      en: 'English',
    },
  },
} as const;

export type Translations = DeepWiden<typeof translations.zh>;

export function getTranslation(locale: Locale): Translations {
  return translations[locale];
}

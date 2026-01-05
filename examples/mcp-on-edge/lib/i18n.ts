// Multi-language configuration
export const languages = {
  zh: '中文',
  en: 'English'
} as const;

export type Language = keyof typeof languages;

export const translations = {
  zh: {
    // Page title and description
    title: '网页版 MCP',
    subtitle: '一句话生成一个全球加速站点',
    description: '基于 EdgeOne 边缘函数实现的 MCP Client 与 MCP Server',
    
    // Page metadata
    metaTitle: '网页版 MCP 一句话生成一个全球加速站点',
    metaDescription: '基于 EdgeOne 边缘函数实现的 MCP Client 与 MCP Server。',
    metaKeywords: 'EdgeOne Pages, MCP, 模型上下文协议, 边缘函数, 智能聊天, Next.js',
    
    // Input and buttons
    placeholder: '帮我生成一个表白网页',
    sendButton: '发送',
    
    // Quick suggestions
    suggestions: {
      confession: { title: '表白网页', prompt: '生成一个表白网页，并部署' },
      resume: { title: '个人简历', prompt: '生成一个漂亮的个人简历，并部署' },
      blog: { title: '博客站点', prompt: '生成一个简约风格的博客站点，并部署' },
      portfolio: { title: '作品集', prompt: '生成一个展示作品的网站，并部署' }
    },
    
    placeholderVariants: [
      '表白网页',
      '个人简历',
      '博客站点',
      '商城应用',
      '作品集',
      '电子相册',
      '在线简历',
      '婚礼邀请函',
      '落地页',
      '产品展示页',
      '个人主页',
      '旅行博客'
    ],
    
    // Status messages
    searching: '边缘函数运行中，请稍后',
    thinking: '思考过程',
    
    // Error messages
    error: '抱歉，出现了错误。请重试。',
    
    // Footer
    poweredBy: 'Powered by EdgeOne Pages MCP Server'
  },
  en: {
    // Page title and description
    title: 'Web MCP',
    subtitle: 'Generate a global accelerated site with one sentence',
    description: 'MCP Client and Server based on EdgeOne Functions',
    
    // Page metadata
    metaTitle: 'Web MCP - Generate a global accelerated site with one sentence',
    metaDescription: 'MCP Client and Server implementation based on EdgeOne Functions.',
    metaKeywords: 'EdgeOne Pages, MCP, Model Context Protocol, Edge Functions, AI Chat, Next.js',
    
    // Input and buttons
    placeholder: 'Help me generate a confession website',
    sendButton: 'Send',
    
    // Quick suggestions
    suggestions: {
      confession: { title: 'Confession Site', prompt: 'Generate a confession website and deploy it' },
      resume: { title: 'Personal Resume', prompt: 'Generate a beautiful personal resume and deploy it' },
      blog: { title: 'Blog Site', prompt: 'Generate a minimalist blog site and deploy it' },
      portfolio: { title: 'Portfolio', prompt: 'Generate a portfolio website and deploy it' }
    },
    
    // Placeholder variants
    placeholderVariants: [
      'confession website',
      'personal resume',
      'blog site',
      'e-commerce app',
      'portfolio',
      'photo gallery',
      'online resume',
      'wedding invitation',
      'landing page',
      'product showcase',
      'personal homepage',
      'travel blog'
    ],
    
    // Status messages
    searching: 'Edge function running, please wait',
    thinking: 'Thinking Process',
    
    // Error messages
    error: 'Sorry, an error occurred. Please try again.',
    
    // Footer
    poweredBy: 'Powered by EdgeOne Pages MCP Server'
  }
} as const;

// Get translations for current language
export function getTranslations(lang: Language) {
  return translations[lang];
}

// Default language
export const DEFAULT_LANGUAGE: Language = 'zh';
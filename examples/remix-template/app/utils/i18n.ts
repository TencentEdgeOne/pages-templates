// Internationalization utilities
export type Language = 'en' | 'zh';

export interface Translations {
  // Meta information
  title: string;
  description: string;
  
  // Hero section
  heroTag: string;
  heroSubtitle: string;
  whyChooseTitle: string;
  
  // Features
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;
  
  // Quick start section
  quickStartTitle: string;
  
  // Cards
  card1Title: string;
  card1Desc: string;
  card1Action: string;
  
  card2Title: string;
  card2Desc: string;
  card2Action: string;
  
  card3Title: string;
  card3Desc: string;
  card3Action: string;
  
  // Footer
  footerText: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    title: "Remix Template - Modern Full-Stack Framework",
    description: "Modern full-stack web application template built with Remix, providing best practices and development experience",
    
    heroTag: "🚀 Modern Full-Stack Development",
    heroSubtitle: "Modern full-stack web application template built with",
    whyChooseTitle: "Why Choose This Template?",
    
    feature1Title: "Lightning Fast",
    feature1Desc: "Built-in hot reload, TypeScript support, ready to use",
    feature2Title: "Best Practices",
    feature2Desc: "Web standards compliant, SEO friendly, performance optimized",
    feature3Title: "Modern Toolchain",
    feature3Desc: "Vite, Tailwind CSS, ESLint complete configuration",
    
    quickStartTitle: "Get Started with Your Project",
    
    card1Title: "5-Minute Quick Start",
    card1Desc: "Quickly understand Remix basics and create your first application",
    card1Action: "Get Started",
    
    card2Title: "30-Minute Complete Tutorial",
    card2Desc: "Deep dive into Remix core features and build complete web applications",
    card2Action: "Start Learning",
    
    card3Title: "Official Documentation",
    card3Desc: "Browse complete API documentation and advanced feature guides",
    card3Action: "View Docs",
    
    footerText: "✨ Start building your next great project"
  },
  zh: {
    title: "Remix Template - 现代化全栈开发框架",
    description: "基于 Remix 构建的现代化全栈 Web 应用模板，提供最佳实践和开发体验",
    
    heroTag: "🚀 现代化全栈开发",
    heroSubtitle: "基于",
    whyChooseTitle: "为什么选择这个模板？",
    
    feature1Title: "极速开发",
    feature1Desc: "内置热重载、TypeScript 支持，开箱即用",
    feature2Title: "最佳实践",
    feature2Desc: "遵循 Web 标准，SEO 友好，性能优化",
    feature3Title: "现代工具链",
    feature3Desc: "Vite、Tailwind CSS、ESLint 完整配置",
    
    quickStartTitle: "快速开始你的项目",
    
    card1Title: "5分钟快速开始",
    card1Desc: "快速了解 Remix 基础概念，创建你的第一个应用",
    card1Action: "立即开始",
    
    card2Title: "30分钟完整教程",
    card2Desc: "深入学习 Remix 核心功能，构建完整的 Web 应用",
    card2Action: "开始学习",
    
    card3Title: "官方文档",
    card3Desc: "查阅完整的 API 文档和高级功能指南",
    card3Action: "查看文档",
    
    footerText: "✨ 开始构建你的下一个伟大项目"
  }
};

export function getTranslations(lang: Language): Translations {
  return translations[lang] || translations.en;
}
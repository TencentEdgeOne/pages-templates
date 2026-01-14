import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";
// eslint-disable-next-line import/no-unresolved, import/namespace
import { getTranslations, type Language } from "../utils/i18n";

export const meta: MetaFunction = () => {
  const t = getTranslations('en'); // Default to English
  return [
    { title: t.title },
    { name: "description", content: t.description },
  ];
};

export default function Index() {
  const [language, setLanguage] = useState<Language>('en');
  const t = getTranslations(language);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'zh' : 'en');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Multi-layer animated gradient backgrounds */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-pink-50/50 via-transparent to-cyan-50/50 animate-gradient-x"></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-violet-50/30 via-transparent to-emerald-50/30 animate-gradient-y"></div>
      
      {/* Decorative geometric shapes */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-pink-200/20 to-cyan-200/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      
      {/* Language toggle button */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={toggleLanguage}
          className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-white/30 hover:bg-white/90 transition-all duration-300 shadow-lg"
        >
          <span className="text-sm font-medium text-gray-700">
            {language === 'en' ? '中文' : 'English'}
          </span>
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
        </button>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 container mx-auto px-6 py-8 lg:py-12">
        {/* Hero section */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/20 mb-4 lg:mb-6">
            <span className="text-sm font-medium text-gray-600">{t.heroTag}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4 lg:mb-6">
            Remix Template
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl text-gray-600 mb-6 lg:mb-8 max-w-3xl mx-auto leading-relaxed">
            {t.heroSubtitle} <span className="font-semibold text-blue-600">Remix</span> {language === 'zh' ? '构建的现代化全栈 Web 应用模板' : ''}
          </p>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 lg:p-8 max-w-4xl mx-auto border border-white/30 shadow-xl">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-4">{t.whyChooseTitle}</h2>
            <div className="grid md:grid-cols-3 gap-4 lg:gap-6 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">⚡</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{t.feature1Title}</h3>
                  <p className="text-sm text-gray-600">{t.feature1Desc}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold">🎯</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{t.feature2Title}</h3>
                  <p className="text-sm text-gray-600">{t.feature2Desc}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold">🔧</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{t.feature3Title}</h3>
                  <p className="text-sm text-gray-600">{t.feature3Desc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick start cards */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl lg:text-3xl font-bold text-center text-gray-800 mb-8 lg:mb-12">{t.quickStartTitle}</h2>
          
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* 5-minute quick start */}
            <div className="group relative h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <a
                href="https://v2.remix.run/docs/start/quickstart/"
                target="_blank"
                rel="noreferrer"
                className="relative flex flex-col h-full bg-white/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/30 hover:bg-white/90 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl text-white font-bold">⚡</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{t.card1Title}</h3>
                <p className="text-gray-600 mb-6 flex-grow">
                  {t.card1Desc}
                </p>
                <div className="flex items-center text-blue-600 font-medium mt-auto">
                  {t.card1Action}
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            </div>

            {/* 30-minute tutorial */}
            <div className="group relative h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <a
                href="https://v2.remix.run/docs/start/tutorial"
                target="_blank"
                rel="noreferrer"
                className="relative flex flex-col h-full bg-white/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/30 hover:bg-white/90 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl text-white font-bold">📚</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{t.card2Title}</h3>
                <p className="text-gray-600 mb-6 flex-grow">
                  {t.card2Desc}
                </p>
                <div className="flex items-center text-purple-600 font-medium mt-auto">
                  {t.card2Action}
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            </div>

            {/* Official documentation */}
            <div className="group relative h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <a
                href="https://remix.run/docs"
                target="_blank"
                rel="noreferrer"
                className="relative flex flex-col h-full bg-white/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/30 hover:bg-white/90 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl text-white font-bold">📖</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{t.card3Title}</h3>
                <p className="text-gray-600 mb-6 flex-grow">
                  {t.card3Desc}
                </p>
                <div className="flex items-center text-emerald-600 font-medium mt-auto">
                  {t.card3Action}
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="text-center mt-12 lg:mt-16">
          <div className="inline-flex items-center px-6 py-3 bg-white/50 backdrop-blur-sm rounded-full border border-white/20">
            <span className="text-sm text-gray-600">
              {t.footerText}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

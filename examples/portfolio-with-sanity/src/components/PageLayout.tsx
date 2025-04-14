import { useState } from 'react';
import Link from 'next/link';

interface PageLayoutProps {
  children: React.ReactNode;
  fullHeight?: boolean;
  showBackgroundImage?: boolean;
  activePage?: string;
  darkBg?: boolean;
}

export default function PageLayout({
  children,
  fullHeight = false,
  showBackgroundImage = false,
  activePage = 'home',
  darkBg = false
}: PageLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className={`${fullHeight ? 'h-screen' : 'min-h-screen'} flex flex-col ${darkBg ? 'bg-main-background text-white' : ''}`}>
      {/* Full-screen Background Image */}
      {showBackgroundImage && (
        <div className="inset-0 z-[-20]">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
            style={{ backgroundImage: 'url(/hero-background.jpg)' }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-br from-theme-black via-theme-black/95 to-theme-gray/90"></div>
        </div>
      )}

      {/* Header */}
      <header className="py-6 px-6 lg:px-20 w-full z-30 transition-all duration-200">
        <div className="max-w-[1440px] mx-auto flex justify-between items-center">
          <Link href="/" className="text-white text-2xl font-medium">
            Portfolio Template<span className="text-theme-red">.</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8">
            <Link 
              href="/work" 
              className={`text-white hover:text-theme-red transition-colors ${activePage === 'work' ? 'border-b border-theme-red' : ''}`}
            >
              Portfolio
            </Link>
            <Link 
              href="/about" 
              className={`text-white hover:text-theme-red transition-colors ${activePage === 'about' ? 'border-b border-theme-red' : ''}`}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className={`text-white hover:text-theme-red transition-colors ${activePage === 'contact' ? 'border-b border-theme-red' : ''}`}
            >
              Contact
            </Link>
            
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-theme-black z-40 px-6 py-20">
          <div className="flex flex-col gap-8">
            <Link 
              href="/work" 
              className={`text-4xl font-medium text-white theme-hover ${activePage === 'work' ? 'border-b border-theme-red' : ''}`} 
              onClick={() => setIsMenuOpen(false)}
            >
              Portfolio
            </Link>
            <Link 
              href="/about" 
              className={`text-4xl font-medium text-white theme-hover ${activePage === 'about' ? 'border-b border-theme-red' : ''}`} 
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className={`text-4xl font-medium text-white theme-hover ${activePage === 'contact' ? 'border-b border-theme-red' : ''}`} 
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={`${fullHeight ? 'flex-grow flex items-center' : ''}`}>
        {children}
      </main>

      {/* Footer */}
      <footer className={`py-6 px-6 lg:px-20 ${darkBg ? 'border-theme-gray/50' : 'border-theme-gray/30'}`}>
        <div className="max-w-[1440px] mx-auto flex justify-between items-center">
          <span className="text-theme-light-gray">© 2025 EdgeOne Pages Portfolio Template</span>
        </div>
      </footer>
    </div>
  );
} 
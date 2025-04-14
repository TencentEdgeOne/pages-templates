import Link from 'next/link'
import { useState } from 'react'
import PageLayout from '@/components/PageLayout'

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <PageLayout fullHeight showBackgroundImage activePage="home">
      {/* Full-screen Background Image */}
      <div className="fixed inset-0 z-[-20]">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/hero-background.jpg)' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-theme-black via-theme-black/95 to-theme-gray/90"></div>
      </div>


      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-theme-black z-40 px-6 py-20">
          <div className="flex flex-col gap-8">
            <Link href="/work" className="text-4xl font-medium text-white theme-hover" onClick={() => setIsMenuOpen(false)}>
              Portfolio
            </Link>
            <Link href="/about" className="text-4xl font-medium text-white theme-hover" onClick={() => setIsMenuOpen(false)}>
              About
            </Link>
            <Link href="/contact" className="text-4xl font-medium text-white theme-hover" onClick={() => setIsMenuOpen(false)}>
              Contact
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="px-6 lg:px-20 relative overflow-hidden w-full">
        <div className="absolute inset-0 animate-pulse-opacity -z-10">
          <div className="animate-float absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-theme-red blur-3xl"></div>
          <div className="animate-float-delayed absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-theme-dark-red blur-3xl"></div>
          <div className="animate-pulse absolute top-1/3 right-1/3 w-48 h-48 rounded-full bg-theme-red opacity-60 blur-2xl"></div>
          <div className="animate-float-reverse absolute bottom-1/3 left-1/3 w-72 h-72 rounded-full bg-theme-red opacity-30 blur-3xl"></div>
          <div className="animate-float-reverse absolute -top-24 right-1/2 w-56 h-56 rounded-full bg-theme-dark-red opacity-20 blur-xl"></div>
        </div>
        <div className="max-w-[1440px] mx-auto relative z-10">
          <h1 className="text-5xl md:text-7xl font-medium mb-8 text-white">
            Visual Storyteller<br />
            <span className="theme-primary">Through Photography</span>
          </h1>
          <p className="text-xl md:text-2xl text-theme-light-gray max-w-2xl mb-12 animate-fadeInDelayed text-white">
            I capture the world through light and shadow, specializing in architecture, portrait, and landscape photography, telling stories through my unique visual perspective.
          </p>
          <Link 
            href="/work"
            className="btn btn-primary animate-fadeInDelayed2"
          >
            View Portfolio
          </Link>
        </div>
      </section>

    </PageLayout>
  )
} 
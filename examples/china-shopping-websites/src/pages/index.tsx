import { categories } from "@/lib/categories";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";


export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  // Listen for scroll events to control header styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className={`border-b top-0 z-10 sticky transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-white'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-7 w-7 text-teal-500" />
              <h1 className="text-2xl font-bold text-teal-600 tracking-tight">Chinese Shopping Websites</h1>
            </div>
           
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 relative z-0">
        <div className="mb-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">Discover China&apos;s Premium E-commerce Platforms</h2>
          <p className="text-slate-600 mt-2 max-w-2xl mx-auto text-lg">Curated selection of China&apos;s finest online shopping destinations offering the best prices and quality products</p>
        </div>
        
        <div className="flex flex-wrap gap-3 mb-12 justify-center">
          {categories.map((category) => (
            <a 
              key={category.id}
              href={`#${category.id}`}
              className="px-5 py-2.5 bg-white rounded-lg hover:text-white transition-colors font-medium text-slate-700 hover:bg-teal-400"
            >
              {category.title}
            </a>
          ))}
        </div>

        {categories.map((category) => (
          <div key={category.id} id={category.id} className="mb-16">
            <h3 className="text-xl font-semibold text-slate-800 mb-8 flex items-center">
              <span className="w-1.5 h-7 bg-teal-500 rounded-sm mr-3"></span>
              {category.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.items.map((item, index) => (
                <a
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-lg  transition-all duration-300 bg-white relative overflow-hidden card-hover-effect"
                >
                  <div className="absolute top-0 left-0 w-2 h-full bg-teal-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="p-6 flex items-start gap-5">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                      <div className="absolute inset-0 animate-pulse"></div>
                      <div className="relative w-full h-full">
                        {item.image && <Image 
                          src={item.image}
                          alt={item.name}
                          layout="fill"
                          objectFit="cover"
                          className="group-hover:scale-105 transition-transform duration-300"
                        />}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 group-hover:text-teal-600 transition-colors">{item.name}</h3>
                      <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </main>
      
      <footer className="py-8 bg-white">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© 2025 Chinese Shopping Websites. All platform names and trademarks belong to their respective owners.</p>
        </div>
      </footer>
    </div>
  );
}

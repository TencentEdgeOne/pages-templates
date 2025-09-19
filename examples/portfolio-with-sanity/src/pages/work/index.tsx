import Image from 'next/image';
import PageLayout from '@/components/PageLayout';
import { Project } from '@/lib/types';
import { GetStaticProps } from 'next';
import React, { useState } from 'react';
import {  fetchAllProjects, hasSanityClient } from '@/lib/sanity-fetch';
import { NEXT_REVALIDATE } from '@/conf';




// Define the page props type
interface WorkPageProps {
  projects: Project[];
}

// Use getStaticProps for static data fetching
export const getStaticProps: GetStaticProps<WorkPageProps> = async () => {
  try {
    const projects = await fetchAllProjects();
    return {
      props: {
        projects,
      },
      // If Sanity is configured, the ISR is enabled
      revalidate: hasSanityClient() ? NEXT_REVALIDATE : false
    };
  } catch (error) {
    console.error('Failed to get project list:', error);
    return {
      props: {
        projects: [],
      }
    };
  }
};

// Page component receives props
export default function Work({ projects }: WorkPageProps) {
  // Get unique categories
  const allCategories = ["All", ...Array.from(new Set(projects.map((project: Project) => project.category)))];
  
  // New: for managing the currently selected category and filtered projects
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter((project) => project.category === selectedCategory);

  // Function to get aspect ratio class name
  const getAspectRatio = (height: string) => {
    switch(height) {
      case 'sm': return 'aspect-[4/3]';
      case 'md': return 'aspect-[3/4]';
      case 'lg': return 'aspect-[2/3]';
      default: return 'aspect-[4/3]';
    }
  };

  return (
    <PageLayout activePage="work" darkBg>
      {/* Work Section */}
      <section className="pt-40 pb-20 px-6 lg:px-20">
        <div className="max-w-[1440px] mx-auto">
          <h1 className="text-4xl md:text-5xl font-medium mb-4 theme-primary">Gallery</h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl">
            Explore my photographic series, each of which conveys a unique visual language and emotional story.
          </p>
          
          {/* Filter Categories */}
          <div className="flex flex-wrap gap-4 mb-12">
            {allCategories.map((category: string) => (
              <button
                key={category}
                className={`px-4 py-2 text-sm transition-colors cursor-pointer hover:bg-theme-gray/80 ${selectedCategory === category ? 'bg-theme-red text-white' : 'bg-theme-gray text-white/80'}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category === "All" ? "All" : category}
              </button>
            ))}
          </div>
          
          {/* Projects Grid */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8">
            {filteredProjects.map((project: Project, index: number) => (
              <div key={index} className="mb-8 break-inside-avoid">
                <a 
                  href={`/work/project/${project.slug}`}
                  className="masonry-item group block overflow-hidden inline-block w-full"
                >
                  <div className={`relative ${getAspectRatio(project.height)} overflow-hidden`}>
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-6 backdrop-blur-sm">
                      <h3 className="text-2xl font-medium text-white mb-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">{project.title}</h3>
                      <div className="flex items-center gap-4 text-white/90 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">
                        <span>{project.category}</span>
                        <span>•</span>
                        <span>{new Date(project.publishedAt).getFullYear()}</span>
                      </div>
                      <span className="mt-6 px-4 py-2 border border-theme-red text-white text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-200 hover:bg-theme-red/20 transition-colors">View</span>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
} 
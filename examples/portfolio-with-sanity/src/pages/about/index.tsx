import Image from 'next/image';
import PageLayout from '../../components/PageLayout';

export default function About() {
  return (
    <PageLayout activePage="about" darkBg>
      {/* About Section */}
      <section className="pt-40 pb-20 px-6 lg:px-20 flex-grow flex items-center">
        <div className="max-w-[1440px] mx-auto">
          <h1 className="text-4xl md:text-5xl font-medium mb-8 theme-primary">About Me</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <p className="text-xl text-white/80 mb-6">
                I am a professional photographer with over 8 years of experience, specializing in architectural, landscape, and portrait photography. My work focuses on capturing the essence of moments and spaces through compelling visual narratives.
              </p>
              <p className="text-xl text-white/80 mb-6">
                Currently working as a freelance photographer, collaborating with various international publications and architectural firms. My work has been featured in National Geographic, Architectural Digest, and various photography exhibitions worldwide.
              </p>
              <p className="text-xl text-white/80">
                With a background in fine arts and architectural studies, I bring a unique perspective to my photography, combining technical precision with artistic vision to create images that tell powerful stories.
              </p>
              
              <div className="mt-12">
                <h2 className="text-2xl font-medium mb-6 text-white">Experience</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-medium text-white">Freelance Photographer</h3>
                    <p className="text-white/60">2020 — Present</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-white">Architectural Photographer — Studio Light</h3>
                    <p className="text-white/60">2018 — 2020</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-white">Photography Assistant — National Geographic</h3>
                    <p className="text-white/60">2016 — 2018</p>
                  </div>
                </div>
              </div>

              
            </div>
            
            <div>
              <div className="bg-theme-gray p-8 overflow-hidden">
                <Image
                  src="/about.png"
                  alt="Portfolio Template"
                  width={600}
                  height={400}
                  className="w-full mb-8"
                />
                
                <h3 className="text-white text-xl mb-4">Expertise</h3>
                <div className="flex flex-wrap gap-3 mb-8">
                  <span className="bg-theme-red text-white px-3 py-1 text-sm">Architectural Photography</span>
                  <span className="bg-theme-red text-white px-3 py-1 text-sm">Portrait Photography</span>
                  <span className="bg-theme-red text-white px-3 py-1 text-sm">Landscape Photography</span>
                  <span className="bg-theme-red text-white px-3 py-1 text-sm">Adobe Lightroom</span>
                  <span className="bg-theme-red text-white px-3 py-1 text-sm">Adobe Photoshop</span>
                  <span className="bg-theme-red text-white px-3 py-1 text-sm">Studio Lighting</span>
                  <span className="bg-theme-red text-white px-3 py-1 text-sm">Digital Post-processing</span>
                </div>
                
               
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
} 
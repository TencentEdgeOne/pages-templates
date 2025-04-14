import { useState } from 'react';
import PageLayout from '../../components/PageLayout';

export default function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic would go here
    alert('Form submitted!');
  };

  return (
    <PageLayout activePage="contact" darkBg>
      {/* Contact Section */}
      <section className="pt-40 pb-20 px-6 lg:px-20 flex-grow flex items-center">
        <div className="max-w-[1440px] mx-auto">
          <h1 className="text-4xl md:text-5xl font-medium mb-4 theme-primary">Get in Touch</h1>
          <p className="text-xl text-white/80 mb-12 max-w-2xl">
            I&apos;m always open to new opportunities and interesting projects. Feel free to reach out if you&apos;d like to collaborate or just say hello.
          </p>
          
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/2">
              <div className="mb-12">
                <h3 className="text-2xl mb-4 text-white">Direct Contact</h3>
                <a 
                  href="mailto:hello@arnauros.com"
                  className="text-xl theme-primary hover:text-theme-dark-red transition-colors block mb-3"
                >
                  hello@arnauros.com
                </a>
                <a 
                  href="tel:+34612345678"
                  className="text-xl theme-primary hover:text-theme-dark-red transition-colors"
                >
                  +34 612 345 678
                </a>
              </div>
              
              <div className="mb-12">
                <h3 className="text-2xl mb-4 text-white">Office</h3>
                <address className="text-xl text-white/70 not-italic">
                  Design Studio Barcelona<br />
                  Carrer de Mallorca 123<br />
                  08036 Barcelona, Spain
                </address>
              </div>
              
              <div>
                <h3 className="text-2xl mb-4 text-white">Social Media</h3>
                <div className="flex gap-6">
                  <a href="#" className="text-white/70 hover:text-theme-red transition-colors">Twitter</a>
                  <a href="#" className="text-white/70 hover:text-theme-red transition-colors">LinkedIn</a>
                  <a href="#" className="text-white/70 hover:text-theme-red transition-colors">Dribbble</a>
                  <a href="#" className="text-white/70 hover:text-theme-red transition-colors">Instagram</a>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2">
              <div className="bg-theme-gray p-8">
                <h3 className="text-2xl mb-6 text-white">Send a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block mb-2 text-white/70">Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      value={formState.name}
                      onChange={handleChange}
                      className="w-full p-3 bg-theme-black text-white border border-theme-gray focus:border-theme-red focus:outline-none" 
                      required 
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block mb-2 text-white/70">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email"
                      value={formState.email}
                      onChange={handleChange} 
                      className="w-full p-3 bg-theme-black text-white border border-theme-gray focus:border-theme-red focus:outline-none" 
                      required 
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block mb-2 text-white/70">Message</label>
                    <textarea 
                      id="message" 
                      name="message"
                      value={formState.message}
                      onChange={handleChange} 
                      rows={6} 
                      className="w-full p-3 bg-theme-black text-white border border-theme-gray focus:border-theme-red focus:outline-none"
                      required
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    className="bg-theme-red text-white px-6 py-3 hover:bg-theme-dark-red transition-colors"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
} 
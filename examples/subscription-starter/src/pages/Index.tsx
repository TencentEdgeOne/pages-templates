
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import PricingSection from '@/components/PricingSection';

const Index = () => {
  // Scroll restoration
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen" style={{ overflow: "hidden" }}>
      <Navbar />
      <PricingSection />
    </div>
  );
};

export default Index;


import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Check, X } from 'lucide-react';
import { getPrices, supabase } from '@/lib/supabase';

const PricingSection = () => {
  const pricingRef = useRef<HTMLDivElement>(null);
  const [plans, setPlans] = useState([]);


  useEffect(() => {
    getPrices().then(prices => {
      setPlans(prices);
    });
  },[])


  return (
    <section id="pricing" className="py-20 relative" ref={pricingRef}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-50 to-white -z-10" />
      <div className="absolute bottom-40 left-20 w-96 h-96 rounded-full bg-orange-200 opacity-20 blur-3xl -z-10" />

      <div className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in opacity-0">
          <h2 className="section-title">
            Simple,
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent ml-2">
              Transparent Pricing
            </span>
          </h2>
          <p className="section-subtitle">
            This is an example of a pricing section, uses the Stripe API to get the prices and display them. Click on the button to jump to the checkout page.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`animate-fade-in opacity-0 rounded-xl p-8 transition-all duration-300 ${
                plan.highlight
                  ? "bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200 shadow-xl relative z-10 transform md:-translate-y-4"
                  : "glass"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-muted-foreground mb-6">{plan.description}</p>

              <a
                href={
                  `/stripe/checkout?plan=${plan.id}&price=${plan.priceId}`
                }
              >
                <Button
                  className={`w-full mb-6 ${
                    plan.highlight
                      ? "bg-orange-500 hover:bg-orange-600"
                      : "bg-foreground/90 hover:bg-foreground"
                  }`}
                >
                  {plan.buttonText}
                </Button>
              </a>

              <div className="space-y-3">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}

                {plan.notIncluded?.map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-start text-muted-foreground"
                  >
                    <X className="h-5 w-5 text-muted-foreground/50 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;

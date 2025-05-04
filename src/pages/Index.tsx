
import React, { useEffect, useRef } from "react";
import Navbar from "@/components/navigation/navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Skull, Clock, ArrowDown } from "lucide-react";

const Index = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  
  // Add scroll animation for skull icons
  useEffect(() => {
    const scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    document.querySelectorAll('.scroll-animate').forEach((el) => {
      scrollObserver.observe(el);
    });
    
    return () => {
      scrollObserver.disconnect();
    };
  }, []);
  
  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div className="bg-vaporwave-darkPurple min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-28 pb-16 px-4 cyber-grid relative overflow-hidden">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <div className="mb-6 flex justify-center">
              <Skull className="h-16 w-16 text-vaporwave-neonPink animate-pulse" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-display mb-6 tracking-wider leading-tight">
              <span className="text-white">EVERYTHING DIES,</span><br />
              <span className="text-vaporwave-neonPink">INCLUDING YOUR SAAS TRIALS</span>
            </h1>
            
            <p className="text-gray-300 text-lg mb-10 font-mono">
              Track the lifespan of your subscriptions as they slowly march toward their inevitable demise.
              Pay your respects, or let them die in peace.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-vaporwave-neonPink hover:bg-vaporwave-neonPink/80 text-white font-mono text-lg py-6" asChild>
                <Link to="/dashboard">ENTER THE VOID</Link>
              </Button>
              
              <Button variant="outline" className="border-vaporwave-neonPink text-vaporwave-neonPink hover:bg-vaporwave-neonPink/20 font-mono text-lg py-6" onClick={scrollToFeatures}>
                LEARN MORE
              </Button>
            </div>
          </div>
          
          <div className="mt-16 flex justify-center">
            <ArrowDown className="h-8 w-8 text-vaporwave-neonPink animate-bounce cursor-pointer" onClick={scrollToFeatures} />
          </div>
        </div>
        
        {/* Floating elements in the background */}
        <div className="absolute top-20 left-16 opacity-20 animate-float">
          <Clock className="h-24 w-24 text-vaporwave-electricBlue" />
        </div>
        <div className="absolute bottom-40 right-20 opacity-20 animate-float" style={{ animationDelay: '2s' }}>
          <Skull className="h-32 w-32 text-vaporwave-neonPink" />
        </div>
      </section>
      
      {/* Features Section */}
      <section ref={featuresRef} className="py-20 px-4 bg-vaporwave-charcoal">
        <div className="container mx-auto">
          <h2 className="text-3xl font-display text-center mb-16 tracking-wider text-white">
            HOW IT <span className="text-vaporwave-neonPink">WORKS</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="glass-card p-8 rounded-lg text-center scroll-animate opacity-0">
              <div className="h-16 w-16 bg-vaporwave-neonPink/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-vaporwave-neonPink" />
              </div>
              <h3 className="text-xl font-bold mb-4">Track Your Deathclocks</h3>
              <p className="text-gray-300">
                Add your SaaS subscriptions and watch as their life bars slowly drain away.
                Get real-time countdowns to renewal or expiration.
              </p>
            </div>
            
            <div className="glass-card p-8 rounded-lg text-center scroll-animate opacity-0" style={{ animationDelay: '0.2s' }}>
              <div className="h-16 w-16 bg-vaporwave-electricBlue/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-vaporwave-electricBlue" />
              </div>
              <h3 className="text-xl font-bold mb-4">Remember Your Rites</h3>
              <p className="text-gray-300">
                Set reminders to "pay your respects" before your subscriptions expire.
                Never miss a renewal date again.
              </p>
            </div>
            
            <div className="glass-card p-8 rounded-lg text-center scroll-animate opacity-0" style={{ animationDelay: '0.4s' }}>
              <div className="h-16 w-16 bg-vaporwave-vividPurple/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Skull className="h-8 w-8 text-vaporwave-vividPurple" />
              </div>
              <h3 className="text-xl font-bold mb-4">Digital Funerals</h3>
              <p className="text-gray-300">
                When subscriptions expire, give them a proper send-off with
                themed digital funeral ceremonies.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-display mb-6 text-vaporwave-neonPink">
            READY TO FACE THE INEVITABLE?
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8 text-lg">
            Your subscriptions are dying. Track them, manage them, 
            and give them the digital funeral they deserve.
          </p>
          <Button className="bg-vaporwave-neonPink hover:bg-vaporwave-neonPink/80 text-white font-mono text-lg py-6 px-8" asChild>
            <Link to="/dashboard">START TRACKING NOW</Link>
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-10 px-4 border-t border-white/10">
        <div className="container mx-auto">
          <div className="flex justify-center items-center">
            <Skull className="h-6 w-6 text-vaporwave-neonPink mr-2" />
            <p className="text-gray-400 text-sm">
              © 2025 Death Clock | Memento Mori
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

import React, { useState, useEffect } from "react";
import Navbar from "@/components/navigation/navbar";
import { useSubscription } from "@/context/subscription-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skull } from "lucide-react";
import { CemeterySubscriptionForm } from "@/components/subscriptions/cemetery-subscription-form";
import { cn } from "@/lib/utils";

const Cemetery = () => {
  const { subscriptions, setSubscriptions } = useSubscription();
  const [resurrectDialogOpen, setResurrectDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<string | null>(null);
  const [lightningEffect, setLightningEffect] = useState(false);
  const [visibleTombstones, setVisibleTombstones] = useState<string[]>([]);
  
  // Show all expired subscriptions, regardless of deleted flag
  const expiredSubscriptions = subscriptions.filter(sub => sub.status === 'expired');
  // Debug: log all subscriptions and expired subscriptions
  console.table(subscriptions);
  if (subscriptions.length > 0) {
    console.log('First subscription:', subscriptions[0]);
  }
  console.log('Expired subscriptions:', expiredSubscriptions);
  
  // Update document title when entering cemetery
  useEffect(() => {
    const originalTitle = document.title;
    document.title = "💀 Digital Cemetery - Rest in Pixels";
    
    return () => {
      document.title = originalTitle;
    };
  }, []);

  // Lightning effect
  useEffect(() => {
    const triggerLightning = () => {
      setLightningEffect(true);
      setTimeout(() => setLightningEffect(false), 200);
      
      // Play thunder sound
      const thunder = new Audio('/sounds/thunder.mp3');
      thunder.volume = 0.3;
      thunder.play().catch(() => {});
    };

    const interval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance every 30 seconds
        triggerLightning();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Fade in tombstones
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisibleTombstones(expiredSubscriptions.map(sub => sub.id));
    }, 300);
    
    return () => clearTimeout(timer);
  }, [expiredSubscriptions]);
  
  // Force state sync from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('deathClock_subscriptions');
    if (saved) {
      setSubscriptions(JSON.parse(saved));
    }
  }, [setSubscriptions]);
  
  const getFuneralIcon = (funeralType: string) => {
    switch(funeralType) {
      case 'viking':
        return '⚔️';
      case 'pixelated':
        return '👾';
      case 'space':
        return '🚀';
      default:
        return '⚰️';
    }
  };
  
  // Add debug log before return
  console.log('Dialog open:', resurrectDialogOpen, 'Selected:', selectedSubscription);
  return (
    <div className={cn(
      "min-h-screen bg-black cursor-shovel relative overflow-hidden",
      lightningEffect && "animate-lightning"
    )}>
      <Navbar />
      
      {/* Fog overlay */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        <div className="absolute inset-0 animate-fog-1 opacity-30" 
          style={{
            backgroundImage: "url('/images/fog-1.png')",
            backgroundSize: "cover",
            transform: "translateZ(0)"
          }} 
        />
        <div className="absolute inset-0 animate-fog-2 opacity-20"
          style={{
            backgroundImage: "url('/images/fog-2.png')",
            backgroundSize: "cover",
            transform: "translateZ(0)"
          }}
        />
      </div>
      
      <main className="container mx-auto px-4 pt-28 pb-16 relative z-20">
        <div className="mb-12 text-center relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-40 bg-gradient-to-b from-transparent via-gray-800 to-transparent" />
          <Skull className="h-16 w-16 text-vaporwave-neonPink mx-auto mb-6 opacity-80 animate-float flicker" />
          <h1 className="text-4xl font-display mb-4 text-vaporwave-neonPink flicker glow">
            Digital <span className="text-gray-400 glow">Cemetery</span>
          </h1>
          <p className="text-gray-500 font-mono max-w-md mx-auto glow">
            Here lie the subscriptions that have departed. May they rest in digital peace.
          </p>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-40 bg-gradient-to-t from-transparent via-gray-800 to-transparent" />
        </div>
        
        {expiredSubscriptions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 relative">
            {expiredSubscriptions.map((subscription, index) => (
              <div
                key={subscription.id}
                className={cn(
                  "opacity-0 transition-all duration-1000 transform hover:scale-105",
                  visibleTombstones.includes(subscription.id) 
                    ? 'opacity-100 translate-y-0' 
                    : 'translate-y-8'
                )}
                style={{ 
                  transitionDelay: `${index * 300}ms`,
                  animation: visibleTombstones.includes(subscription.id) 
                    ? 'float 4s ease-in-out infinite'
                    : 'none'
                }}
              >
                <Card className="glass-card overflow-hidden border-gray-800 rounded-t-lg rounded-b-sm bg-gradient-to-b from-gray-900 to-black relative group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="p-6 text-center space-y-3 relative">
                    {/* Gravestone Top */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-gray-800 rounded-t-lg" />
                    
                    {/* RIP Text */}
                    <div className="text-xs text-gray-600 mb-2 font-mono">R.I.P</div>
                    
                    <div className="text-4xl mb-4 opacity-60 transform group-hover:scale-110 transition-transform duration-500">
                      {getFuneralIcon(subscription.funeralType)}
                    </div>
                    
                    {/* Subscription Name with Decorative Lines */}
                    <div className="relative py-2">
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
                      <h3 className="text-lg font-bold text-gray-400 font-serif">{subscription.name}</h3>
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
                    </div>
                    
                    <div className="text-gray-600 text-sm font-mono">
                      Cost of Life: ${subscription.cost} / {subscription.frequency}
                    </div>
                    
                    <div className="text-xs text-gray-700 font-mono">
                      Departed on {new Date(subscription.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="px-6 py-4 border-t border-gray-800 bg-black/40">
                    <Button
                      size="sm"
                      variant="ghost"
                      tabIndex={0}
                      style={{ zIndex: 9999, position: 'relative', background: 'rgba(255,0,0,0.1)' }}
                      className="text-gray-400 hover:text-gray-100 hover:bg-gray-800/50 mx-auto group/btn transition-all duration-300"
                      onClick={() => {
                        console.log('Resurrect clicked for', subscription.id);
                        setSelectedSubscription(subscription.id);
                        setResurrectDialogOpen(true);
                      }}
                    >
                      <span className="group-hover/btn:animate-pulse">Resurrect</span>
                    </Button>
                  </div>
                </Card>
                
                {/* Gravestone Base */}
                <div className="h-16 bg-gradient-to-b from-gray-900 to-black rounded-b-md relative overflow-hidden flex justify-center">
                  <div className="w-4 h-24 bg-gray-800 absolute -bottom-10 shadow-lg" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50" />
                  {/* Add some grass/ground texture */}
                  <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-gray-900 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 flex justify-around">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 h-2 bg-gray-800 rounded-t-sm transform -translate-y-1"
                        style={{ opacity: 0.3 + Math.random() * 0.4 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-bold mb-2 text-gray-400">Cemetery Empty</h3>
            <p className="text-gray-600">No expired subscriptions yet</p>
          </div>
        )}
      </main>
      
      <Dialog open={resurrectDialogOpen} onOpenChange={setResurrectDialogOpen}>
        {console.log('Dialog open:', resurrectDialogOpen, 'Selected:', selectedSubscription)}
        <DialogContent className="sm:max-w-[600px] glass-card border-gray-800 bg-black/95">
          <DialogHeader>
            <DialogTitle className="text-gray-400">Subscription Resurrection</DialogTitle>
          </DialogHeader>
          
          {selectedSubscription && (
            <CemeterySubscriptionForm 
              subscriptionId={selectedSubscription}
              onSuccess={() => {
                setResurrectDialogOpen(false);
                setSelectedSubscription(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Enhanced mist overlay */}
      <div className="pointer-events-none fixed inset-0 z-40">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 70%)',
          animation: 'pulse 4s ease-in-out infinite'
        }} />
      </div>
    </div>
  );
};

export default Cemetery;

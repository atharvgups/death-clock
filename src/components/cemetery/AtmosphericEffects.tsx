import React, { useEffect, useState } from 'react';

export const AtmosphericEffects = () => {
  const [showLightning, setShowLightning] = useState(false);
  const [thunderPlaying, setThunderPlaying] = useState(false);

  useEffect(() => {
    const triggerLightningAndThunder = () => {
      if (Math.random() < 0.1) { // 10% chance
        setShowLightning(true);
        setTimeout(() => setShowLightning(false), 200);
        
        // Play thunder sound with delay
        setTimeout(() => {
          const thunder = new Audio('/sounds/thunder.mp3');
          thunder.volume = 0.3;
          thunder.play().catch(() => {});
          setThunderPlaying(true);
          thunder.onended = () => setThunderPlaying(false);
        }, 200);
      }
    };

    const interval = setInterval(triggerLightningAndThunder, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Lightning Flash */}
      {showLightning && (
        <div className="fixed inset-0 bg-white/30 z-50 pointer-events-none animate-lightning" />
      )}

      {/* Floating Particles (Dust/Fireflies) */}
      <div className="fixed inset-0 pointer-events-none z-20">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gray-400/20 rounded-full animate-float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Fog Layers */}
      <div className="fixed inset-0 pointer-events-none z-30">
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

      {/* Enhanced Vignette Effect */}
      <div className="fixed inset-0 pointer-events-none z-40">
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/50 to-black opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      {/* Animated Shadows */}
      <div className="fixed inset-0 pointer-events-none z-25">
        {[...Array(10)].map((_, i) => (
          <div
            key={`shadow-${i}`}
            className="absolute w-32 h-32 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(0,0,0,0.2) 0%, transparent 70%)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: 'scale(2)',
              animation: `shadow-pulse ${8 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>
    </>
  );
}; 
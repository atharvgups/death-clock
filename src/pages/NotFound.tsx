
import React from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Skull } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  React.useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-vaporwave-darkPurple cyber-grid">
      <div className="text-center glass-card p-10 max-w-md">
        <Skull className="h-20 w-20 text-vaporwave-neonPink mx-auto mb-6 animate-pulse" />
        
        <h1 className="text-6xl font-display mb-6 text-vaporwave-neonPink">404</h1>
        <p className="text-2xl text-white mb-4 font-mono">PAGE NOT FOUND</p>
        
        <p className="text-gray-400 mb-8">
          The page you're looking for has already expired and passed into the digital afterlife.
        </p>
        
        <Button className="bg-vaporwave-neonPink hover:bg-vaporwave-neonPink/80 font-mono" asChild>
          <Link to="/">Return to the Living</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

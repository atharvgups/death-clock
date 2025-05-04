import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { Plus, Settings, Skull } from "lucide-react";
import { useCemetery } from "../../App";

const Navbar = () => {
  const location = useLocation();
  const { inCemetery } = useCemetery();
  
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1000 ${
      inCemetery 
        ? 'bg-black/80 border-b border-gray-800 backdrop-blur-sm' 
        : 'bg-background/80 border-b border-border backdrop-blur'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link 
            to="/" 
            className={`text-xl font-display flex items-center gap-2 transition-all duration-500 ${
              inCemetery ? 'text-gray-400 hover:text-gray-200' : 'text-foreground'
            }`}
          >
            {inCemetery ? (
              <>
                <Skull className="h-6 w-6" />
                <span>Digital Cemetery</span>
              </>
            ) : (
              <>Death Clock</>
            )}
          </Link>

          <div className="flex items-center gap-2">
            {!inCemetery && location.pathname === "/" && (
              <Button 
                variant="default" 
                size="sm"
                asChild
              >
                <Link to="/add">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Subscription
          </Link>
              </Button>
            )}
            
            <Button
              variant={inCemetery ? "ghost" : "outline"}
              size="icon"
              asChild
              className={inCemetery ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800' : ''}
            >
              <Link to="/settings">
                <Settings className="h-4 w-4" />
          </Link>
          </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/ui/theme-provider";
import { SubscriptionProvider } from "./context/subscription-context";
import Dashboard from "./pages/Dashboard";
import Cemetery from "./pages/Cemetery";
import Settings from "./pages/Settings";
import AuthCallback from "./pages/AuthCallback";
import { createContext, useContext, useState, useEffect } from "react";
import { UserProvider } from './context/UserContext';
import { SettingsProvider } from './context/SettingsContext';

type CemeteryContextType = {
  inCemetery: boolean;
  setInCemetery: (value: boolean) => void;
};

const CemeteryContext = createContext<CemeteryContextType | null>(null);

function RouteWrapper() {
  const location = useLocation();
  const context = useContext(CemeteryContext);
  
  useEffect(() => {
    if (context) {
      context.setInCemetery(location.pathname === "/cemetery");
    }
  }, [location, context]);
  
  return (
          <Routes>
      <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cemetery" element={<Cemetery />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/auth/v1/callback" element={<AuthCallback />} />
          </Routes>
  );
}

export function useCemetery() {
  const context = useContext(CemeteryContext);
  if (!context) {
    throw new Error("useCemetery must be used within a CemeteryProvider");
  }
  return context;
}

export default function App() {
  const [inCemetery, setInCemetery] = useState(false);

  return (
    <UserProvider>
      <SettingsProvider>
        <CemeteryContext.Provider value={{ inCemetery, setInCemetery }}>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <SubscriptionProvider>
              <Router>
                <div className={`min-h-screen transition-all duration-1000 ${
                  inCemetery ? 'grayscale bg-black' : 'bg-background'
                }`}>
                  <RouteWrapper />
                  <Toaster position="bottom-right" />
                </div>
              </Router>
            </SubscriptionProvider>
          </ThemeProvider>
        </CemeteryContext.Provider>
      </SettingsProvider>
    </UserProvider>
  );
}

import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Github, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-4">
            <Github className="h-16 w-16 text-white" />
          </div>
        </div>

        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-2xl text-white/80 mb-8">
          Oops! This page seems to have disappeared into the void
        </p>
        <p className="text-lg text-white/60 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist. Let's get you back to
          tracking those commits!
        </p>

        <Button
          asChild
          size="lg"
          className="bg-white text-primary hover:bg-white/90"
        >
          <a href="/" className="inline-flex items-center gap-2">
            <Home className="h-5 w-5" />
            Return to Home
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

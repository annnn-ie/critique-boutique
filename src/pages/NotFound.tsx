import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-neutral-50">404</h1>
        <p className="text-xl text-neutral-400 mb-4">Oops! Page not found</p>
        <a href="/" className="text-neutral-500 hover:text-neutral-300 underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;

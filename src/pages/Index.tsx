
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { user, hasActiveSubscription } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (hasActiveSubscription) {
        navigate("/dashboard");
      } else {
        navigate("/subscription");
      }
    }
  }, [user, hasActiveSubscription, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-100">
      <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-teer-blue mb-6">
          Shillong Teer Calculator
        </h1>
        <p className="text-xl text-gray-700 max-w-2xl mb-8">
          Get accurate predictions for Shillong Teer with our advanced calculator.
          Join now for SR H/E and S/R 4 Guti Number predictions.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Button 
            size="lg" 
            className="bg-teer-blue hover:bg-teer-blue/90 text-white px-8"
            onClick={() => navigate("/register")}
          >
            Get Started
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-teer-blue text-teer-blue hover:bg-teer-blue/10"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          <div 
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200 cursor-pointer"
            onClick={() => navigate("/sr-he")}
          >
            <div className="h-12 w-12 bg-teer-blue/10 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teer-blue">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">SR H/E Predictions</h3>
            <p className="text-gray-600 text-center">
              Get reliable head and even predictions for Shillong teer results.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="h-12 w-12 bg-teer-green/10 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teer-green">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="3" x2="9" y2="21"></line>
                <line x1="15" y1="3" x2="15" y2="21"></line>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="3" y1="15" x2="21" y2="15"></line>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">4 Guti Numbers</h3>
            <p className="text-gray-600 text-center">
              Access our exclusive 4 Guti number predictions daily.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="h-12 w-12 bg-teer-gold/10 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teer-gold">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">F/R H/E</h3>
            <p className="text-gray-600 text-center">
              Coming soon! Get early access to our new prediction feature.
            </p>
          </div>
        </div>
      </div>
      
      <footer className="bg-teer-dark text-white py-4 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Shillong Teer Calculator. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Index;

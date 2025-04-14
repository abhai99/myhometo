
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import SubscriptionCard from "@/components/SubscriptionCard";
import QRPayment from "@/components/QRPayment";
import { ref, onValue } from "firebase/database";
import { db } from "@/config/firebase";
import { toast } from "sonner";

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState<'weekly' | 'monthly' | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [prices, setPrices] = useState({
    weekly: "299",
    monthly: "999"
  });
  const { user, hasActiveSubscription } = useAuth();
  const { toast: uiToast } = useToast();
  const navigate = useNavigate();
  
  // Auto-refresh every 2 minutes to check subscription status
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      console.log("Auto-refreshing page to check subscription status");
      window.location.reload();
    }, 2 * 60 * 1000); // 2 minutes in milliseconds
    
    return () => clearInterval(refreshInterval);
  }, []);
  
  useEffect(() => {
    console.log("SubscriptionPage: Checking if user has active subscription:", hasActiveSubscription);
    // If user already has an active subscription, redirect to dashboard
    if (hasActiveSubscription) {
      console.log("User has active subscription, redirecting to dashboard");
      navigate('/dashboard');
    }
  }, [hasActiveSubscription, navigate]);
  
  useEffect(() => {
    // Fetch subscription prices from Firebase
    console.log("Fetching subscription prices from Firebase");
    const settingsRef = ref(db, 'settings');
    onValue(settingsRef, (snapshot) => {
      if (snapshot.exists()) {
        const settings = snapshot.val();
        console.log("Settings fetched:", settings);
        setPrices({
          weekly: settings.weeklyPrice.toString(),
          monthly: settings.monthlyPrice.toString()
        });
      } else {
        console.log("No settings data found");
      }
    });
  }, []);
  
  const weeklyFeatures = [
    "Access to SR H/E predictions",
    "Access to S/R 4 guti Number predictions",
    "Daily updated results",
    "Result history"
  ];
  
  const monthlyFeatures = [
    "Everything in Weekly plan",
    "Priority updates",
    "Early access to new features",
    "4x better value"
  ];
  
  const handleSelectPlan = (type: 'weekly' | 'monthly') => {
    console.log("Selected plan:", type);
    setSelectedPlan(type);
    setPaymentAmount(type === 'weekly' ? prices.weekly : prices.monthly);
    setShowPayment(true);
  };
  
  const handlePaymentComplete = () => {
    // Don't automatically activate subscription
    // Just inform the user that payment is being verified
    toast.info("Your payment is being verified. You will be notified once your subscription is activated by admin.");
    
    // Refresh page after 3 seconds to check if admin has approved
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="teer-heading">Choose Your Subscription Plan</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Select a subscription plan that works for you. Unlock predictions and improve your chances with our tools.
        </p>
      </div>
      
      {!showPayment ? (
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <SubscriptionCard 
            type="weekly" 
            price={`₹${prices.weekly}`} 
            features={weeklyFeatures}
            onSelect={() => handleSelectPlan('weekly')}
          />
          
          <Card className="max-w-[100px] py-6 flex items-center justify-center border-0 shadow-none">
            <span className="text-xl font-medium text-gray-500">OR</span>
          </Card>
          
          <SubscriptionCard 
            type="monthly" 
            price={`₹${prices.monthly}`}
            features={monthlyFeatures}
            onSelect={() => handleSelectPlan('monthly')}
          />
        </div>
      ) : (
        <div className="max-w-md mx-auto">
          <QRPayment 
            amount={paymentAmount} 
            onPaymentComplete={handlePaymentComplete} 
          />
          <button 
            onClick={() => setShowPayment(false)}
            className="mt-4 text-teer-blue hover:underline text-center w-full"
          >
            Back to plans
          </button>
        </div>
      )}
    </div>
  );
}

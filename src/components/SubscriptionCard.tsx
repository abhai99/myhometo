
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { SubscriptionCardProps } from "@/types/teer";

export default function SubscriptionCard({ type, price, features, onSelect }: SubscriptionCardProps) {
  const { subscribeUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubscribe = () => {
    if (onSelect) {
      onSelect();
      return;
    }
    
    setIsLoading(true);
    
    // Simulate payment process
    setTimeout(() => {
      subscribeUser(type);
      toast.success(`Successfully subscribed to ${type} plan!`);
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };
  
  return (
    <Card className="w-full max-w-sm border-2 hover:border-teer-blue transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-2xl">
          {type === 'weekly' ? 'Weekly' : 'Monthly'} Plan
        </CardTitle>
        <CardDescription className="text-center text-3xl font-bold text-teer-blue py-2">
          {price}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5 mr-2 text-teer-green"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-teer-green hover:bg-teer-green/90 text-white"
          onClick={handleSubscribe}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Subscribe Now"}
        </Button>
      </CardFooter>
    </Card>
  );
}


import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [daysLeft, setDaysLeft] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    // Calculate days left in subscription
    if (user?.subscription?.endDate) {
      const endDate = new Date(user.subscription.endDate);
      const today = new Date();
      const timeDiff = endDate.getTime() - today.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      setDaysLeft(daysDiff > 0 ? daysDiff : 0);
    }
    
    return () => clearInterval(timer);
  }, [user]);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  const getNextResultTime = () => {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour < 13) {
      return "1:00 PM (First Round)";
    } else if (hour < 16) {
      return "4:00 PM (Second Round)";
    } else {
      return "1:00 PM Tomorrow (First Round)";
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="bg-teer-blue text-white">
              <CardTitle className="text-2xl">Welcome, {user?.name}</CardTitle>
              <CardDescription className="text-gray-200">
                {formatDate(currentTime)} | {formatTime(currentTime)}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <p className="text-gray-700">
                  Next result expected at: <span className="font-medium">{getNextResultTime()}</span>
                </p>
                <div className="bg-teer-blue text-white px-4 py-2 rounded-full text-sm font-medium">
                  Subscription: {daysLeft} days left
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <Link to="/sr-he">
                  <Button className="w-full h-24 text-lg bg-teer-blue hover:bg-teer-blue/90">
                    SR H/E Prediction
                  </Button>
                </Link>
                <Link to="/sr-guti">
                  <Button className="w-full h-24 text-lg bg-teer-green hover:bg-teer-green/90">
                    S/R 4 Guti Number
                  </Button>
                </Link>
                <Button disabled className="w-full h-24 text-lg bg-gray-400 cursor-not-allowed">
                  F/R H/E
                  <span className="text-xs block mt-1">Coming Soon</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Recent Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-teer-green mr-2">•</span>
                  <span>Daily predictions are updated at 12:00 AM</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teer-green mr-2">•</span>
                  <span>Result tables are updated right after the official announcement</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teer-gold mr-2">•</span>
                  <span>F/R H/E predictions coming next week - stay tuned!</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

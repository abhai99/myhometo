
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CalendarDays } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireSubscription?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  requireSubscription = true 
}: ProtectedRouteProps) {
  const { user, isLoading, hasActiveSubscription } = useAuth();
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    if (user?.subscription?.endDate) {
      const endDate = new Date(user.subscription.endDate);
      const today = new Date();
      const timeDiff = endDate.getTime() - today.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      setDaysLeft(daysDiff > 0 ? daysDiff : 0);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teer-blue"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireSubscription && !hasActiveSubscription) {
    return <Navigate to="/subscription" replace />;
  }

  return (
    <>
      {hasActiveSubscription && (
        <Alert className="bg-teer-blue/10 border-teer-blue mb-4">
          <CalendarDays className="h-4 w-4 text-teer-blue" />
          <AlertDescription className="text-teer-blue">
            Your {user?.subscription?.type} subscription has {daysLeft} days remaining.
          </AlertDescription>
        </Alert>
      )}
      {children}
    </>
  );
}

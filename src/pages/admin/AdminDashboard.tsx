
import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "@/config/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import AdminSettings from "@/components/admin/AdminSettings";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminPayments from "@/components/admin/AdminPayments";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscriptions: 0,
    pendingPayments: 0,
    totalRevenue: 0
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin (in a real app, this would be server-side auth)
    const adminEmail = localStorage.getItem('adminEmail');
    if (!adminEmail) {
      toast({ title: "Access Denied", description: "You don't have permission to access this page." });
      navigate('/login');
      return;
    }
    
    setIsAdmin(true);
    
    // Fetch stats
    const fetchStats = async () => {
      try {
        // Users stats
        const usersRef = ref(db, 'users');
        onValue(usersRef, (snapshot) => {
          if (snapshot.exists()) {
            const users = Object.values(snapshot.val());
            const activeUsers = users.filter((user: any) => {
              if (!user.subscription) return false;
              const endDate = new Date(user.subscription.endDate);
              return endDate > new Date() && user.subscription.active;
            });
            
            setStats(prev => ({
              ...prev,
              totalUsers: users.length,
              activeSubscriptions: activeUsers.length
            }));
          }
        });
        
        // Payments stats
        const paymentsRef = ref(db, 'payments');
        onValue(paymentsRef, (snapshot) => {
          if (snapshot.exists()) {
            const payments = Object.values(snapshot.val());
            const pendingPayments = payments.filter((payment: any) => payment.status === 'pending');
            
            // Fix typing issues with explicit type annotations
            const total = payments.reduce((acc: number, payment: any) => {
              return payment.status === 'completed' ? acc + Number(payment.amount) : acc;
            }, 0) as number;
            
            setStats(prev => ({
              ...prev,
              pendingPayments: pendingPayments.length,
              totalRevenue: total
            }));
          }
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    
    fetchStats();
  }, [navigate, toast]);

  if (!isAdmin) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-gray-500">Active Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.activeSubscriptions}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-gray-500">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.pendingPayments}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">₹{stats.totalRevenue}</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="users">
        <TabsList className="w-full border-b mb-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <AdminUsers />
        </TabsContent>
        
        <TabsContent value="payments">
          <AdminPayments />
        </TabsContent>
        
        <TabsContent value="settings">
          <AdminSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}

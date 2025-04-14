
import { useState, useEffect } from "react";
import { ref, onValue, update } from "firebase/database";
import { db } from "@/config/firebase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

export default function AdminPayments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const paymentsRef = ref(db, 'payments');
    onValue(paymentsRef, (snapshot) => {
      if (snapshot.exists()) {
        const paymentsData = snapshot.val();
        const paymentsArray = Object.keys(paymentsData).map(key => ({
          id: key,
          ...paymentsData[key]
        })).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        
        setPayments(paymentsArray);
      }
    });
  }, []);

  const handleApprovePayment = async (payment: any) => {
    try {
      // Update payment status
      await update(ref(db, `payments/${payment.id}`), {
        status: 'completed'
      });
      
      // Update user's subscription
      if (payment.userId) {
        const subscriptionType = payment.amount === '999' ? 'monthly' : 'weekly';
        const startDate = new Date();
        const endDate = new Date();
        
        if (subscriptionType === 'weekly') {
          endDate.setDate(endDate.getDate() + 7);
        } else {
          endDate.setMonth(endDate.getMonth() + 1);
        }
        
        await update(ref(db, `users/${payment.userId}/subscription`), {
          type: subscriptionType,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          active: true
        });
      }
      
      toast.success("Payment approved and subscription activated");
    } catch (error) {
      console.error("Error approving payment:", error);
      toast.error("Failed to approve payment");
    }
  };

  const handleRejectPayment = async (payment: any) => {
    try {
      await update(ref(db, `payments/${payment.id}`), {
        status: 'rejected'
      });
      toast.success("Payment rejected");
    } catch (error) {
      console.error("Error rejecting payment:", error);
      toast.error("Failed to reject payment");
    }
  };

  const filteredPayments = payments.filter(payment => 
    payment.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.utrNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    
    // If it's a Firebase timestamp object
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString() + ' ' + timestamp.toDate().toLocaleTimeString();
    }
    
    // If it's a number
    return new Date(timestamp).toLocaleDateString() + ' ' + new Date(timestamp).toLocaleTimeString();
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Payment Management</h2>
          <Input
            placeholder="Search payments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>UTR Number</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map(payment => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{payment.userName}</div>
                      <div className="text-xs text-gray-500">{payment.userEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>₹{payment.amount}</TableCell>
                  <TableCell>{payment.utrNumber}</TableCell>
                  <TableCell>{formatDate(payment.timestamp)}</TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                        payment.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {payment.status === 'pending' && (
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-green-600"
                          onClick={() => handleApprovePayment(payment)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-red-600"
                          onClick={() => handleRejectPayment(payment)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

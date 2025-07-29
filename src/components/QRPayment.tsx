
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { toast } from "sonner";
import { InfoIcon } from "lucide-react";
import { ref, push, serverTimestamp } from "firebase/database";
import { db } from "@/config/firebase";
import { useAuth } from "@/context/AuthContext";

interface QRPaymentProps {
  amount: string;
  onPaymentComplete: () => void;
}

export default function QRPayment({ amount, onPaymentComplete }: QRPaymentProps) {
  const [utrNumber, setUtrNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const upiId = "tecmania@ybl";
  const { user } = useAuth();

  // Generate a UPI payment URL
  const generateUpiUrl = () => {
    const encodedName = encodeURIComponent("Teer Calculator");
    return `upi://pay?pa=${upiId}&pn=${encodedName}&am=${amount}&cu=INR`;
  };

  // Generate QR code URL using a free QR code API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(generateUpiUrl())}`;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!utrNumber.trim()) {
      toast.error("Please enter UTR number");
      return;
    }

    setIsProcessing(true);
    
    try {
      console.log("Recording payment with UTR:", utrNumber);
      
      // Record payment in Firebase with pending status
      const paymentData = {
        userId: user?.id,
        userName: user?.name,
        userEmail: user?.email,
        amount,
        utrNumber,
        status: 'pending',
        timestamp: serverTimestamp()
      };
      
      await push(ref(db, 'payments'), paymentData);
      console.log("Payment recorded successfully");
      
      // Notify user payment is pending approval
      toast.success("Payment recorded. It will be verified by admin shortly.");
      
      // Important: We don't automatically activate the subscription here anymore
      // Instead, we just notify the user their payment is under review
      setIsProcessing(false);
      onPaymentComplete();
    } catch (error) {
      console.error("Error recording payment:", error);
      toast.error("Failed to process payment. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Payment of ₹{amount}</CardTitle>
        <CardDescription className="text-center">
          Scan the QR code or use UPI ID to make payment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center">
          {/* Actual QR code using an API */}
          <div className="w-48 h-48 bg-white flex items-center justify-center mb-2 rounded-lg border-2 border-gray-300 overflow-hidden">
            <img 
              src={qrCodeUrl} 
              alt="UPI Payment QR Code" 
              className="h-full w-full object-contain"
            />
          </div>
          <div className="text-center font-medium text-teer-blue mt-2">
            UPI ID: {upiId}
          </div>
        </div>

        <div className="rounded-md bg-yellow-50 p-3 mt-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <InfoIcon className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Important Note</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  After payment, your subscription will be activated within 5-10 minutes after admin verification. 
                  In some cases, it may take up to 1 hour. Please be patient.
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Enter UTR/Reference Number</label>
            <Input
              type="text"
              value={utrNumber}
              onChange={(e) => setUtrNumber(e.target.value)}
              placeholder="UTR number after payment"
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full mt-4 bg-teer-green hover:bg-teer-green/90" 
            disabled={isProcessing}
          >
            {isProcessing ? "Submitting..." : "Submit Payment"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col text-sm text-gray-500">
        <p>Please take a screenshot of the payment for your records.</p>
      </CardFooter>
    </Card>
  );
}


import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Copy, Share2, Users } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function ReferralPage() {
  const { user, generateReferralLink } = useAuth();
  const [copied, setCopied] = useState(false);
  
  const referralLink = generateReferralLink();
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink)
      .then(() => {
        setCopied(true);
        toast.success("Referral link copied to clipboard!");
        setTimeout(() => setCopied(false), 3000);
      })
      .catch(err => {
        console.error("Failed to copy: ", err);
        toast.error("Failed to copy link. Please try again.");
      });
  };
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join Shillong Teer Calculator",
          text: "Get accurate predictions for Shillong Teer with this amazing calculator!",
          url: referralLink
        });
        toast.success("Thanks for sharing!");
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      // Fallback to copy
      handleCopyLink();
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Invite Friends & Earn Rewards</h1>
        
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle>Your Referral Link</CardTitle>
            <CardDescription>
              Share this link with friends and earn rewards when they sign up
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Input value={referralLink} readOnly className="bg-gray-50" />
              <Button onClick={handleCopyLink} variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
            
            <div className="mt-6 flex justify-center">
              <Button onClick={handleShare} className="bg-teer-blue">
                <Share2 className="h-5 w-5 mr-2" />
                Share Now
              </Button>
            </div>
          </CardContent>
          <CardFooter className="justify-between flex-col sm:flex-row gap-4">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-teer-blue mr-2" />
              <span>
                Your referrals: <strong>{user?.referrals || 0}</strong>
              </span>
            </div>
          </CardFooter>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Share2 className="h-6 w-6 text-teer-blue" />
              </div>
              <CardTitle className="text-lg">Share</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-gray-600">
              Share your unique referral link with friends and family
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="h-6 w-6 text-teer-green" />
              </div>
              <CardTitle className="text-lg">Invite</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-gray-600">
              Friends sign up using your referral link
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="text-teer-gold"
                >
                  <circle cx="12" cy="8" r="6" />
                  <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                </svg>
              </div>
              <CardTitle className="text-lg">Rewards</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-gray-600">
              Earn exclusive rewards for each successful referral
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

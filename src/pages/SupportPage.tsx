import { MessageCircle, Phone, Mail, Clock, Users, HelpCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SupportPage = () => {
  const handleTelegramContact = () => {
    window.open('https://t.me/teerai11', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teer-blue to-teer-purple p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Support & Help Center
          </h1>
          <p className="text-xl text-white/80">
            We're here to help you with any questions or issues
          </p>
        </div>

        {/* Main Support Card */}
        <Card className="mb-8 bg-white/95 backdrop-blur-sm shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-teer-blue rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-teer-blue">Contact Our Support Team</CardTitle>
            <CardDescription className="text-lg">
              Get instant help through our Telegram support channel
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              onClick={handleTelegramContact}
              className="bg-[#0088cc] hover:bg-[#006699] text-white px-8 py-3 text-lg rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Contact on Telegram
            </Button>
            <p className="text-gray-600 mt-4">
              Click above to chat with our support team on Telegram: <strong>@teerai11</strong>
            </p>
          </CardContent>
        </Card>

        {/* Support Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center">
              <Clock className="w-12 h-12 text-teer-blue mx-auto mb-2" />
              <CardTitle className="text-lg">24/7 Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Our support team is available round the clock to assist you
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center">
              <Users className="w-12 h-12 text-teer-blue mx-auto mb-2" />
              <CardTitle className="text-lg">Expert Team</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Experienced professionals ready to solve your queries
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center">
              <HelpCircle className="w-12 h-12 text-teer-blue mx-auto mb-2" />
              <CardTitle className="text-lg">Quick Response</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Fast and efficient responses to all your questions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-teer-blue">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">How do I get predictions?</h3>
                <p className="text-gray-600">Navigate to the SR H/E Prediction page to view the latest Teer predictions and results.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">How do I manage my subscription?</h3>
                <p className="text-gray-600">Go to your Dashboard to view and manage your subscription details.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">How do I refer friends?</h3>
                <p className="text-gray-600">Visit the Referral page to get your unique referral code and earn rewards.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Need more help?</h3>
                <p className="text-gray-600">
                  Contact our support team on Telegram for personalized assistance: 
                  <Button 
                    variant="link" 
                    onClick={handleTelegramContact}
                    className="text-[#0088cc] hover:text-[#006699] p-0 ml-1"
                  >
                    @teerai11
                  </Button>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupportPage;

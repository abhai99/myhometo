import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Smartphone } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const { login, forgotPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Attempting login from LoginPage component");
      const { redirectTo } = await login(email, password);
      
      // Show success toast
      toast.success("Login successful!");
      
      // Force reload the page which will trigger the auth state check and redirect
      window.location.href = redirectTo;
    } catch (error: any) {
      console.error("Login error in component:", error);
      // Error message already displayed by auth context
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail) {
      toast.error("Please enter your email address");
      return;
    }
    
    setIsResetting(true);
    
    try {
      await forgotPassword(resetEmail);
      // Success message shown by auth context
    } catch (error) {
      // Error handled in auth context
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-6 items-center">
      <div className="md:w-1/2 hidden md:block">
        <div className="bg-teer-blue/5 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-teer-blue mb-4">What you're missing</h2>
          <div className="relative">
            <div className="border-8 border-gray-800 rounded-3xl overflow-hidden w-64 mx-auto">
              <div className="bg-gray-800 h-6 flex justify-center items-center">
                <div className="w-20 h-2 bg-gray-700 rounded-full"></div>
              </div>
              <img 
                src="/lovable-uploads/31b82250-6427-454e-8019-63aaf81b0df5.png" 
                alt="Teer Results" 
                className="w-full h-auto"
              />
              <div className="bg-gray-800 h-6 flex justify-center items-center">
                <div className="w-8 h-3 border-2 border-gray-700 rounded-full"></div>
              </div>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 -right-4 bg-teer-blue text-white rounded-full p-2">
              <Smartphone className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-8 space-y-4 text-gray-700">
            <p className="flex items-center">
              <span className="text-teer-blue font-bold mr-2">✓</span>
              Daily prediction updates directly on your device
            </p>
            <p className="flex items-center">
              <span className="text-teer-blue font-bold mr-2">✓</span>
              Secure access to exclusive 4 Guti numbers
            </p>
            <p className="flex items-center">
              <span className="text-teer-blue font-bold mr-2">✓</span>
              Track your historic prediction performance
            </p>
          </div>
        </div>
      </div>
    
      <Card className="w-full md:w-1/2 max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="text-right">
                <Dialog>
                  <DialogTrigger asChild>
                    <button type="button" className="text-xs text-teer-blue hover:underline">
                      Forgot Password?
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reset Password</DialogTitle>
                      <DialogDescription>
                        Enter your email address and we'll send you a link to reset your password.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleResetPassword} className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label htmlFor="reset-email" className="text-sm font-medium">Email</label>
                        <Input
                          id="reset-email"
                          type="email"
                          placeholder="Email"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          required
                        />
                      </div>
                      <DialogFooter>
                        <Button 
                          type="submit" 
                          className="w-full bg-teer-blue hover:bg-teer-blue/90"
                          disabled={isResetting}
                        >
                          {isResetting ? "Sending..." : "Send Reset Link"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-teer-blue hover:bg-teer-blue/90"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 items-center">
          <div className="text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/register" className="text-teer-blue hover:underline">
              Register
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

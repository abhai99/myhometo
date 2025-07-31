
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, MessageCircle } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <nav className="bg-teer-blue text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {!isHomePage && (
            <Button
              variant="ghost"
              size="icon"
              className="text-white mr-1"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <Link to="/" className="text-xl md:text-2xl font-bold">
            {isAdmin ? "Admin Panel" : "Shillong Teer Calculator"}
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="hidden md:inline text-sm">Welcome, {user.name}</span>
              
              {!isAdmin && (
                <>
                  <Link to="/support">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white bg-transparent"
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Support
                    </Button>
                  </Link>
                  <Link to="/referral">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white bg-transparent"
                    >
                      <Users className="h-4 w-4 mr-1" />
                      Refer
                    </Button>
                  </Link>
                </>
              )}
              
              <Button 
                variant="outline" 
                size="sm" 
                className="border-white text-white bg-transparent"
                onClick={logout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-white text-white bg-transparent"
                >
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-white text-white bg-transparent"
                >
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types/teer";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail
} from "firebase/auth";
import { 
  ref, 
  set, 
  get, 
  update,
  query,
  orderByChild,
  equalTo,
  onValue 
} from "firebase/database";
import { auth, db } from "@/config/firebase";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{redirectTo: string}>;
  register: (name: string, email: string, password: string, referralCode?: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  subscribeUser: (subscriptionType: 'weekly' | 'monthly') => void;
  hasActiveSubscription: boolean;
  generateReferralLink: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [appSettings, setAppSettings] = useState({
    weeklyPrice: 299,
    monthlyPrice: 999
  });

  // Check for referral code in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const referralCode = params.get('ref');
    if (referralCode) {
      localStorage.setItem('referralCode', referralCode);
    }
  }, []);

  // Fetch app settings
  useEffect(() => {
    const settingsRef = ref(db, 'settings');
    onValue(settingsRef, (snapshot) => {
      if (snapshot.exists()) {
        setAppSettings(snapshot.val());
      }
    });
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        // User is signed in
        try {
          console.log("Auth user detected:", authUser.uid);
          const userRef = ref(db, `users/${authUser.uid}`);
          
          // Use onValue instead of get to listen for real-time changes
          const userListener = onValue(userRef, (snapshot) => {
            if (snapshot.exists()) {
              const userData = snapshot.val();
              const userWithId: User = {
                ...userData,
                id: authUser.uid
              };
              
              console.log("User data retrieved:", userWithId);
              setUser(userWithId);
              
              // Check subscription status
              if (userData.subscription) {
                // Only consider subscription active if it's marked active AND not expired
                const endDate = new Date(userData.subscription.endDate);
                const isActive = endDate > new Date() && userData.subscription.active;
                console.log("Subscription status:", isActive, "End date:", endDate);
                setHasActiveSubscription(isActive);
                
                // If we're on the subscription page and have an active subscription, redirect to dashboard
                if (isActive && window.location.pathname === '/subscription') {
                  window.location.href = '/dashboard';
                }
              } else {
                setHasActiveSubscription(false);
              }
            } else {
              console.log("No user data found for:", authUser.uid);
            }
            setIsLoading(false);
          });
          
          return () => userListener();
        } catch (error) {
          console.error("Error fetching user data:", error);
          setIsLoading(false);
        }
      } else {
        // User is signed out
        console.log("No auth user detected, signed out");
        setUser(null);
        setHasActiveSubscription(false);
        setIsLoading(false);
      }
    });
    
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Check for hidden admin login
      if (email === "admin11@teer.com" && password === "adminteer") {
        // Store admin access
        localStorage.setItem('adminEmail', email);
        toast.success("Admin login successful!");
        return { redirectTo: "/admin" };
      }
      
      // Regular user login
      console.log("Attempting login with:", email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful, user:", userCredential.user);
      
      // Get user data to check subscription status
      const userRef = ref(db, `users/${userCredential.user.uid}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        const userData = snapshot.val();
        
        // Determine where to redirect the user based on subscription status
        if (userData.subscription && userData.subscription.active) {
          const endDate = new Date(userData.subscription.endDate);
          const isActive = endDate > new Date();
          
          if (isActive) {
            console.log("User has active subscription, redirecting to dashboard");
            return { redirectTo: "/dashboard" };
          }
        }
        // No active subscription, redirect to subscription page
        console.log("User has no active subscription, redirecting to subscription page");
        return { redirectTo: "/subscription" };
      }
      
      // Default redirect if can't determine subscription status
      return { redirectTo: "/subscription" };
      
    } catch (error: any) {
      console.error("Login failed:", error);
      let errorMessage = "Login failed. Please check your credentials.";
      
      // Extract more specific error messages from Firebase
      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email address";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password, please try again";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email format";
      } else if (error.code === "auth/user-disabled") {
        errorMessage = "This account has been disabled";
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "Invalid login credentials, please check email and password";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, referralCode?: string) => {
    setIsLoading(true);
    try {
      console.log("Attempting to register with:", { name, email, referralCode });
      // Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      console.log("User created in Auth with UID:", uid);
      
      // Get referral code from localStorage if available
      const storedReferralCode = localStorage.getItem('referralCode') || referralCode;
      
      // Generate a unique referral code for this user (using their uid)
      const userReferralCode = name.split(' ')[0].toLowerCase() + uid.substring(0, 6);
      
      // Create user data - making sure undefined values are replaced with null or empty strings
      const userData: User = {
        id: uid,
        name,
        email,
        referralCode: userReferralCode,
        subscription: {
          type: 'weekly',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          active: false
        },
        registeredAt: new Date().toISOString(),
        referee: storedReferralCode || null // Use null instead of undefined
      };
      
      console.log("Saving user data to database:", userData);
      // Save user data to Firebase Realtime Database
      await set(ref(db, `users/${uid}`), userData);
      console.log("User data saved successfully");
      
      // If user was referred, update the referrer's referral count
      if (storedReferralCode) {
        try {
          // Find the user with this referral code
          const referralQuery = query(
            ref(db, 'users'), 
            orderByChild('referralCode'), 
            equalTo(storedReferralCode)
          );
          
          const snapshot = await get(referralQuery);
          if (snapshot.exists()) {
            const referrerData = Object.entries(snapshot.val())[0];
            const referrerId = referrerData[0];
            const referrer = referrerData[1] as any;
            
            // Update referrer's referral count
            const referrals = referrer.referrals || 0;
            await update(ref(db, `users/${referrerId}`), {
              referrals: referrals + 1
            });
          }
        } catch (error) {
          console.error("Error updating referrer data:", error);
          // Don't fail registration if referrer update fails
        }
      }
      
      // Clear the stored referral code
      localStorage.removeItem('referralCode');
      
      toast.success("Registration successful!");
    } catch (error: any) {
      console.error("Registration failed:", error);
      let errorMessage = "Registration failed. Please try again.";
      
      // Extract more specific error messages from Firebase
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Email is already in use";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters";
      } else if (error.code === "auth/operation-not-allowed") {
        errorMessage = "Email/password sign-up is not enabled. Please enable it in the Firebase console.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent. Please check your inbox.");
    } catch (error: any) {
      console.error("Password reset failed:", error);
      let errorMessage = "Failed to send password reset email. Please try again.";
      
      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email format";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      throw error;
    }
  };
  
  const generateReferralLink = () => {
    if (!user || !user.referralCode) return window.location.origin;
    return `${window.location.origin}/register?ref=${user.referralCode}`;
  };

  const subscribeUser = async (subscriptionType: 'weekly' | 'monthly') => {
    if (!user) {
      console.error("Cannot subscribe: No user logged in");
      return;
    }
    
    const startDate = new Date();
    const endDate = new Date();
    
    if (subscriptionType === 'weekly') {
      endDate.setDate(endDate.getDate() + 7); // Add 7 days
    } else {
      endDate.setMonth(endDate.getMonth() + 1); // Add 1 month
    }
    
    const updatedSubscription = {
      type: subscriptionType,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      // Important: Set active to false until admin approves payment
      active: false
    };
    
    try {
      console.log("Updating subscription for user:", user.id, "to:", updatedSubscription);
      
      // Update user's subscription in Firebase
      await update(ref(db, `users/${user.id}`), {
        subscription: updatedSubscription
      });
      
      // Update local user state
      setUser({
        ...user,
        subscription: updatedSubscription
      });
      
      // Don't set hasActiveSubscription to true here since it needs admin approval
      console.log("Subscription updated but not activated - waiting for admin approval");
    } catch (error) {
      console.error("Failed to update subscription:", error);
      toast.error("Failed to update subscription. Please try again.");
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      register, 
      logout,
      forgotPassword,
      subscribeUser, 
      hasActiveSubscription,
      generateReferralLink
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

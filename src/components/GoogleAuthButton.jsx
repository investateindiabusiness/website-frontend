// src/components/GoogleAuthButton.jsx
import React, { useState } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
// Make sure you have initialized firebaseApp in a config file
import { app } from '@/firebase'; // Import your firebase initialization
import { googleSyncRequest } from '@/api';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const GoogleAuthButton = ({ onSuccess, onError, text = "Continue with Google", userType }) => {
  const [loading, setLoading] = useState(false);

  const handleGoogleClick = async () => {
    try {
      setLoading(true);
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      
      // 1. Client-side Google Login
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      // 2. Sync with Backend (Passing the userType!)
      const userData = await googleSyncRequest(idToken, userType);

      // 3. Pass data back to parent component
      onSuccess(userData);
      
    } catch (error) {
      console.error(error);
      
      // 4. Handle Errors (Use inline error if provided, otherwise fallback to toast)
      const errorMessage = error.response?.data?.message || error.message || "Google authentication failed";
      
      if (onError) {
        onError(errorMessage);
      } else {
        toast({
          title: "Authentication Failed",
          description: errorMessage,
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      type="button" 
      variant="outline" 
      onClick={handleGoogleClick}
      disabled={loading}
      className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 font-semibold border-gray-200 relative mb-2"
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <>
          <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {text}
        </>
      )}
    </Button>
  );
};

export default GoogleAuthButton;
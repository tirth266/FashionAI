import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export const SocialLogin = () => {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      console.log('Google Login SUCCESS: Received credential from GIS');
      const result = await googleLogin(credentialResponse.credential);
      if (result.success) {
        console.log('Google Login SUCCESS: Backend authenticated');
        navigate(ROUTES.DASHBOARD);
      } else {
        console.error('Google Login FAILED: Backend rejected token', result.message);
      }
    } catch (error) {
      console.error('Google Login EXCEPTION: Error during flow', error);
    }
  };

  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-transparent text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-3">
        <div className="w-full flex justify-center min-h-[40px]">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => {
              console.error('Google Sign-In Error: Popup closed or failed to initialize.');
            }}
            useOneTap={false} // Avoid duplicate triggers from One Tap
            theme="filled_black"
            shape="pill"
            text="signin_with"
            width="320" // Numeric width instead of 100%
          />
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { AuthLayout } from '../components/auth/AuthLayout';
import { LoginForm } from '../components/auth/LoginForm';

export const LoginPage = () => {
  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Enter your details to access your fashion dashboard"
    >
      <LoginForm />
    </AuthLayout>
  );
};


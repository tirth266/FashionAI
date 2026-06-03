import React from 'react';
import { AuthLayout } from '../components/auth/AuthLayout';
import { RegisterForm } from '../components/auth/RegisterForm';

export const RegisterPage = () => {
  return (
    <AuthLayout 
      title="Create Account" 
      subtitle="Join our community of fashion enthusiasts"
    >
      <RegisterForm />
    </AuthLayout>
  );
};

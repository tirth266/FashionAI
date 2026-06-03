import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { AuthLayout } from '../components/auth/AuthLayout';
import { ROUTES } from '../constants/routes';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mock API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
    }, 1500);
  };

  return (
    <AuthLayout 
      title="Reset Password" 
      subtitle="We'll send you a link to reset your password"
    >
      {!isSent ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-white placeholder-gray-500"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            disabled={isSubmitting}
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Send Reset Link'}
          </motion.button>

          <Link to={ROUTES.LOGIN} className="flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={16} />
            Back to login
          </Link>
        </form>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="w-16 h-16 bg-green-500/10 border border-green-500/50 rounded-full flex items-center justify-center mx-auto text-green-500">
            <Mail size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">Check your email</h3>
            <p className="text-gray-400">
              We've sent a password reset link to <span className="text-white font-medium">{email}</span>
            </p>
          </div>
          <Link to={ROUTES.LOGIN} className="block w-full py-3 px-4 border border-white/10 rounded-xl text-sm font-semibold text-white hover:bg-white/5 transition-all">
            Return to login
          </Link>
        </motion.div>
      )}
    </AuthLayout>
  );
};


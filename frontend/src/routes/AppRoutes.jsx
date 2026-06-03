import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { Layout } from '../components/layout/Layout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import LandingPage from '../pages/LandingPage';

import {
  Dashboard,
  SavedOutfits,
  Recommendations,
  Trends,
  Settings,
  Wishlist,
  StylistChat,
  RecommendPage,
  NotFound,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage
} from '../pages';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES.HOME} element={<LandingPage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected Dashboard & App Routes */}
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route path={ROUTES.OUTFITS} element={<SavedOutfits />} />
        <Route path={ROUTES.RECOMMENDATIONS} element={<Recommendations />} />
        <Route path={ROUTES.RECOMMEND_PAGE} element={<RecommendPage />} />
        <Route path={ROUTES.TRENDS} element={<Trends />} />
        <Route path={ROUTES.WISHLIST} element={<Wishlist />} />
        <Route path={ROUTES.STYLIST_CHAT} element={<StylistChat />} />
        <Route path={ROUTES.SETTINGS} element={<Settings />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

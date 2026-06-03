import React from 'react';
import { Navbar } from '../components/landing/Navbar';
import { Hero } from '../components/landing/Hero';
import { Features } from '../components/landing/Features';
import { HowItWorks } from '../components/landing/HowItWorks';
import { Categories } from '../components/landing/Categories';
import { Testimonials } from '../components/landing/Testimonials';
import { Pricing } from '../components/landing/Pricing';
import { FAQ } from '../components/landing/FAQ';
import { CTA } from '../components/landing/CTA';
import { Footer } from '../components/landing/Footer';

export const LandingPage = () => {
  return (
    <div className="bg-darker min-h-screen text-white scroll-smooth selection:bg-purple-500/30">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Categories />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
};

export default LandingPage;

'use client';
import React, { useState, useEffect } from 'react';
import { WishlistProvider } from '../context/WishlistContext';
import { CartProvider } from '../context/CartContext';
import { BookingModalProvider } from '../context/BookingModalContext';
import { LanguageProvider } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';

export default function Providers({ children }) {
  const [preloaderActive, setPreloaderActive] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => {
      setPreloaderActive(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LanguageProvider>
    <WishlistProvider>
      <CartProvider>
        <BookingModalProvider>
        {/* Preloader */}
        {preloaderActive && (
          <div className="preloader">
            <div className="preloader-logo animate-fade-in visible" style={{ transform: 'none', opacity: 1 }}>
              KELLY DRESS
            </div>
            <div className="preloader-bar">
              <div className="preloader-progress"></div>
            </div>
          </div>
        )}

        {/* Layout wrapper */}
        <div className={`app-main-layout ${isMounted && !preloaderActive ? 'ready' : 'loading'}`}>
          <Navbar />
          <main className="main-content-flow">
            {children}
          </main>
          <Footer />
        </div>

        {/* Global Cart Drawer */}
        <CartDrawer />

        <style jsx global>{`
          .app-main-layout {
            opacity: 0;
            transition: opacity 1.5s ease;
          }
          .app-main-layout.ready {
            opacity: 1;
          }
          .app-main-layout.loading {
            opacity: 0;
            height: 100vh;
            overflow: hidden;
          }
          .main-content-flow {
            min-height: 80vh;
          }
        `}</style>
        </BookingModalProvider>
      </CartProvider>
    </WishlistProvider>
    </LanguageProvider>
  );
}

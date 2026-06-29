'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { usePathname } from 'next/navigation';
import { Heart, Menu, X, ChevronDown, ShoppingBag, Globe } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useLanguage, useTranslation } from '../context/LanguageContext';
import { collectionsData, dressesData } from '../data/dresses';

const Navbar = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const megaMenuTimer = useRef(null);
  const langMenuTimer = useRef(null);
  const { lang, setLang } = useLanguage();
  const { t } = useTranslation();
  const { wishlist } = useWishlist();
  const { cartCount, openCart } = useCart();

  const activeCollectionNames = [...new Set(dressesData.map(d => d.collection))];
  const activeCollections = collectionsData.filter(col => activeCollectionNames.includes(col.name));

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
    setIsMegaMenuOpen(false);
  };

  const toggleMegaMenuClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMegaMenuOpen(!isMegaMenuOpen);
  };

  const isHome = pathname === '/';

  return (
    <header className={`navbar-wrapper ${isScrolled ? 'scrolled' : ''} ${!isHome ? 'always-solid' : ''}`}>
      <div className="navbar-container">
        {/* Left Side: Burger Menu (Mobile Only) */}
          <button 
            className="navbar-burger" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={t('nav.menu')}
          >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Center/Left: Navigation Links (Desktop Only) */}
        <nav className="navbar-links">
          <Link 
            href="/" 
            className={`nav-item ${pathname === '/' ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            {t('nav.maison')}
          </Link>
          
          <div 
            className="nav-item-dropdown"
            onMouseEnter={() => {
              if (megaMenuTimer.current) clearTimeout(megaMenuTimer.current);
              setIsMegaMenuOpen(true);
            }}
            onMouseLeave={() => {
              megaMenuTimer.current = setTimeout(() => setIsMegaMenuOpen(false), 300);
            }}
          >
            {/* Click triggers toggle for mobile/tablet/touch screens, hover works on desktop */}
            <button 
              className="nav-item-trigger nav-item-trigger-btn"
              onClick={toggleMegaMenuClick}
            >
              {t('nav.collections')} <ChevronDown size={12} className="chevron" />
            </button>

            {/* Mega Menu */}
            <div className={`mega-menu ${isMegaMenuOpen ? 'open' : ''}`}>
              <div className="mega-menu-content">
                <div className="mega-menu-grid">
                  <div className="mega-menu-column collections-list">
                    <h4>{t('nav.nosCollections')}</h4>
                    <ul>
                      {activeCollections.map((col) => (
                        <li key={col.id}>
                          <Link 
                            href={`/catalog?collection=${encodeURIComponent(col.name)}`}
                            onClick={handleLinkClick}
                          >
                            {col.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mega-menu-column featured-collection">
                    <div className="featured-card">
                      <Image src="https://i.ibb.co/FkFWZzJj/980c30a1-fd3b-451c-b724-6e03eb444e2e.png" alt="Featured Collection" fill sizes="300px" />
                      <div className="featured-overlay">
                        <span>{t('nav.nouvelleEre')}</span>
                        <h3>{t('nav.collection2026')}</h3>
                        <Link 
                          href="/catalog?collection=Collection%202026"
                          className="featured-btn"
                          onClick={handleLinkClick}
                        >
                          {t('nav.decouvrir')}
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="mega-menu-column details-column">
                    <h4>{t('nav.experienceAtelier')}</h4>
                    <p>{t('nav.descAtelier')}</p>
                    <Link href="/catalog" className="btn-book-nav" onClick={handleLinkClick}>
                      {t('nav.decouvrirBoutique')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Link 
            href="/catalog" 
            className={`nav-item ${pathname.startsWith('/catalog') ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            {t('nav.catalogue')}
          </Link>

          <Link 
            href="/about" 
            className={`nav-item ${pathname === '/about' ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            {t('nav.aPropos')}
          </Link>
        </nav>

        {/* Center: Brand Logo */}
        <Link href="/" className="navbar-logo" onClick={handleLinkClick}>
          <span className="logo-text">Kelly Dress</span>
        </Link>

        {/* Right Side: Links & Actions */}
        <div className="navbar-actions">
          <Link 
            href="/contact" 
            className={`nav-item desktop-only ${pathname === '/contact' ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            {t('nav.contact')}
          </Link>

          {/* Language Switcher */}
          <div 
            className="lang-switcher"
            onMouseEnter={() => {
              if (langMenuTimer.current) clearTimeout(langMenuTimer.current);
              setIsLangMenuOpen(true);
            }}
            onMouseLeave={() => {
              langMenuTimer.current = setTimeout(() => setIsLangMenuOpen(false), 300);
            }}
          >
            <button className="navbar-action-btn lang-btn" onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}>
              <Globe size={16} />
              <span className="lang-current">{lang.toUpperCase()}</span>
            </button>
            <div className={`lang-dropdown ${isLangMenuOpen ? 'open' : ''}`}>
              <button onClick={() => { setLang('fr'); setIsLangMenuOpen(false); }} className={lang === 'fr' ? 'active' : ''}>Français</button>
              <button onClick={() => { setLang('en'); setIsLangMenuOpen(false); }} className={lang === 'en' ? 'active' : ''}>English</button>
              <button onClick={() => { setLang('es'); setIsLangMenuOpen(false); }} className={lang === 'es' ? 'active' : ''}>Español</button>
            </div>
          </div>

          <Link 
            href="/wishlist" 
            className="navbar-action-btn wishlist-icon-wrapper"
            onClick={handleLinkClick}
            aria-label={t('nav.favoris')}
          >
            <Heart size={18} className={wishlist.length > 0 ? 'filled-heart' : ''} />
            {wishlist.length > 0 && <span className="wishlist-badge">{wishlist.length}</span>}
          </Link>

          <button 
            className="navbar-action-btn cart-icon-wrapper-nav"
            onClick={openCart}
            aria-label={t('nav.panier')}
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div className={`mobile-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-content">
          <div className="mobile-drawer-links">
            <Link href="/" onClick={handleLinkClick}>{t('nav.maison')}</Link>
            <div className="mobile-subheader">{t('nav.collections')}</div>
            <div className="mobile-collections-grid">
              {activeCollections.map((col) => (
                <Link 
                  key={col.id} 
                  href={`/catalog?collection=${encodeURIComponent(col.name)}`}
                  onClick={handleLinkClick}
                  className="mobile-col-card"
                >
                  <div className="mobile-col-img">
                    <img src={col.image} alt={col.name} />
                  </div>
                  <div className="mobile-col-card-body">
                    <span className="mobile-col-name">{col.name}</span>
                    <span className="mobile-col-desc">{col.description}</span>
                  </div>
                </Link>
              ))}
            </div>
            <Link href="/catalog" onClick={handleLinkClick}>{t('nav.catalogue')}</Link>
            <Link href="/about" onClick={handleLinkClick}>{t('nav.aPropos')}</Link>
            <Link href="/contact" onClick={handleLinkClick}>{t('nav.contact')}</Link>
            <Link href="/wishlist" onClick={handleLinkClick}>{t('nav.favoris')} ({wishlist.length})</Link>
            <div className="mobile-lang-row">
              <button onClick={() => { setLang('fr'); setIsMobileMenuOpen(false); }} className={lang === 'fr' ? 'active' : ''}>FR</button>
              <button onClick={() => { setLang('en'); setIsMobileMenuOpen(false); }} className={lang === 'en' ? 'active' : ''}>EN</button>
              <button onClick={() => { setLang('es'); setIsMobileMenuOpen(false); }} className={lang === 'es' ? 'active' : ''}>ES</button>
            </div>
          </div>
          <button className="btn-gold-mobile" onClick={() => {
            setIsMobileMenuOpen(false);
            openCart();
          }}>
            {t('nav.voirPanier')} ({cartCount})
          </button>
        </div>
      </div>

      <style jsx>{`
        .navbar-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: var(--navbar-height);
          z-index: 1000;
          background-color: transparent;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          transition: var(--transition-medium);
        }

        .navbar-wrapper.scrolled {
          background-color: var(--color-white-overlay);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--color-beige-light);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.02);
        }

        .navbar-wrapper.always-solid {
          background-color: var(--color-white);
          border-bottom: 1px solid var(--color-beige-light);
        }

        .navbar-wrapper.scrolled .nav-item,
        .navbar-wrapper.always-solid .nav-item,
        .navbar-wrapper.scrolled .nav-item-trigger,
        .navbar-wrapper.always-solid .nav-item-trigger,
        .navbar-wrapper.scrolled .nav-item-trigger-btn,
        .navbar-wrapper.always-solid .nav-item-trigger-btn,
        .navbar-wrapper.scrolled .navbar-burger,
        .navbar-wrapper.always-solid .navbar-burger,
        .navbar-wrapper.scrolled .navbar-action-btn,
        .navbar-wrapper.always-solid .navbar-action-btn,
        .navbar-wrapper.scrolled .logo-text,
        .navbar-wrapper.always-solid .logo-text {
          color: var(--color-black);
        }

        .navbar-container {
          max-width: 1500px;
          margin: 0 auto;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
        }

        .navbar-burger {
          display: none;
          background: none;
          border: none;
          color: var(--color-white);
          cursor: pointer;
          padding: 5px;
          width: 30px;
          height: 30px;
          transition: var(--transition-fast);
        }

        .navbar-links {
          display: flex;
          align-items: center;
          gap: 30px;
          flex: 1;
        }

        .nav-item, .nav-item-trigger {
          background: none;
          border: none;
          color: var(--color-white);
          font-size: 0.72rem;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          cursor: pointer;
          padding: 10px 0;
          position: relative;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: var(--transition-fast);
        }

        .nav-item-trigger-btn {
          outline: none;
          font-family: var(--font-sans);
        }

        .nav-item-dropdown {
          position: relative;
        }

        .nav-item::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background-color: var(--color-gold);
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .nav-item:hover::after, .nav-item.active::after {
          transform: scaleX(1);
          transform-origin: left;
        }

        .nav-item:hover, .nav-item-trigger:hover {
          color: var(--color-gold) !important;
        }

        .navbar-logo {
          cursor: pointer;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
        }

        .logo-text {
          font-family: var(--font-serif);
          font-size: 1.6rem;
          font-style: italic;
          color: var(--color-white);
          letter-spacing: 0.08em;
          white-space: nowrap;
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 30px;
          flex: 1;
          justify-content: flex-end;
        }

        .navbar-action-btn {
          background: none;
          border: none;
          color: var(--color-white);
          cursor: pointer;
          position: relative;
          padding: 5px;
          transition: var(--transition-fast);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .navbar-action-btn:hover {
          color: var(--color-gold) !important;
        }

        /* Language Switcher */
        .lang-switcher {
          position: relative;
          display: flex;
          align-items: center;
        }

        .lang-btn {
          gap: 4px;
        }

        .lang-current {
          font-size: 0.65rem;
          letter-spacing: 0.1em;
        }

        .lang-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background-color: var(--color-white);
          border: 1px solid var(--color-beige-dark);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          opacity: 0;
          visibility: hidden;
          transform: translateY(10px);
          transition: opacity 0.2s ease, transform 0.2s ease;
          pointer-events: none;
          z-index: 100;
          min-width: 130px;
        }

        .lang-dropdown.open {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
          pointer-events: auto;
        }

        .lang-dropdown button {
          display: block;
          width: 100%;
          padding: 10px 20px;
          background: none;
          border: none;
          font-size: 0.8rem;
          color: var(--color-black);
          cursor: pointer;
          text-align: left;
          transition: var(--transition-fast);
          font-family: var(--font-sans);
        }

        .lang-dropdown button:hover {
          background-color: var(--color-beige-light);
          color: var(--color-gold);
        }

        .lang-dropdown button.active {
          color: var(--color-gold);
          font-weight: 500;
        }

        .filled-heart {
          fill: var(--color-gold);
          color: var(--color-gold) !important;
        }

        .wishlist-badge {
          position: absolute;
          top: -3px;
          right: -5px;
          background-color: var(--color-gold);
          color: var(--color-white);
          font-size: 0.6rem;
          border-radius: 50%;
          width: 15px;
          height: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 500;
        }

        .cart-icon-wrapper-nav {
          position: relative;
        }

        .cart-badge {
          position: absolute;
          top: -3px;
          right: -5px;
          background-color: var(--color-gold);
          color: var(--color-white);
          font-size: 0.6rem;
          border-radius: 50%;
          width: 15px;
          height: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 500;
        }

        /* Mega Menu Styles */
        .mega-menu {
          position: fixed;
          top: var(--navbar-height);
          left: 0;
          width: 100vw;
          background-color: var(--color-white);
          border-bottom: 1px solid var(--color-beige-light);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03);
          opacity: 0;
          visibility: hidden;
          transform: translateY(15px);
          transition: opacity 0.2s ease, transform 0.2s ease;
          pointer-events: none;
        }

        .mega-menu.open, .nav-item-dropdown:hover .mega-menu {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
          pointer-events: auto;
        }

        .mega-menu-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 60px 40px;
        }

        .mega-menu-grid {
          display: grid;
          grid-template-columns: 1fr 1.5fr 1.2fr;
          gap: 60px;
        }

        .mega-menu-column h4 {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: var(--color-gold);
          margin-bottom: 25px;
          font-weight: 500;
        }

        .collections-list ul {
          list-style: none;
        }

        .collections-list li {
          margin-bottom: 15px;
        }

        .collections-list a {
          font-family: var(--font-serif);
          font-size: 1.4rem;
          color: var(--color-black);
          cursor: pointer;
          transition: var(--transition-fast);
          display: block;
        }

        .collections-list a:hover {
          color: var(--color-gold);
          transform: translateX(5px);
        }

        .featured-card {
          position: relative;
          height: 250px;
          overflow: hidden;
        }

        .featured-card :global(img) {
          object-fit: cover !important;
          transition: var(--transition-slow);
        }

        .featured-card:hover :global(img) {
          transform: scale(1.05);
        }

        .featured-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(0deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.1) 100%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 30px;
          color: var(--color-white);
        }

        .featured-overlay span {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: var(--color-gold);
          margin-bottom: 5px;
        }

        .featured-overlay h3 {
          font-size: 1.8rem;
          margin-bottom: 15px;
        }

        .featured-btn {
          align-self: flex-start;
          background: transparent;
          border: none;
          color: var(--color-white);
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          border-bottom: 1px solid var(--color-white);
          padding-bottom: 3px;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .featured-btn:hover {
          color: var(--color-gold);
          border-bottom: 1px solid var(--color-gold);
        }

        .details-column p {
          font-size: 0.85rem;
          color: var(--color-charcoal);
          margin-bottom: 30px;
          line-height: 1.8;
        }

        .btn-book-nav {
          background-color: var(--color-black);
          color: var(--color-white);
          border: none;
          padding: 12px 30px;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          cursor: pointer;
          transition: var(--transition-fast);
          display: inline-block;
        }

        .btn-book-nav:hover {
          background-color: var(--color-gold);
        }

        /* Mobile Drawer Menu */
        .mobile-drawer {
          position: fixed;
          top: var(--navbar-height);
          left: 0;
          width: 100%;
          height: calc(100vh - var(--navbar-height));
          background-color: var(--color-white);
          z-index: 999;
          transform: translateY(-100%);
          opacity: 0;
          visibility: hidden;
          transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s, visibility 0.6s;
          border-top: 1px solid var(--color-beige-light);
          overflow-y: auto;
        }

        .mobile-drawer.open {
          transform: translateY(0);
          opacity: 1;
          visibility: visible;
        }

        .mobile-drawer-content {
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: calc(100vh - var(--navbar-height) - 40px);
        }

        .mobile-drawer-links {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .mobile-drawer-links a {
          text-align: left;
          font-family: var(--font-serif);
          font-size: 1.8rem;
          color: var(--color-black);
          cursor: pointer;
          padding: 5px 0;
          display: block;
        }

        .mobile-subheader {
          font-family: var(--font-sans);
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: var(--color-gold);
          margin-top: 15px;
          margin-bottom: 5px;
        }

        .mobile-collections-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin: 15px 0 25px 0;
        }

        .mobile-col-card {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          background-color: var(--color-ivory);
          border: 1px solid var(--color-beige-light);
          overflow: hidden;
          transition: var(--transition-fast);
        }

        .mobile-col-card:hover {
          border-color: var(--color-gold);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
        }

        .mobile-col-img {
          aspect-ratio: 4/3;
          overflow: hidden;
          background-color: var(--color-beige-light);
        }

        .mobile-col-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .mobile-col-card:hover .mobile-col-img img {
          transform: scale(1.05);
        }

        .mobile-col-card-body {
          padding: 12px;
        }

        .mobile-col-name {
          font-family: var(--font-serif);
          font-size: 1rem;
          color: var(--color-black);
          display: block;
          margin-bottom: 4px;
        }

        .mobile-col-desc {
          font-family: var(--font-sans);
          font-size: 0.65rem;
          color: var(--color-gray-medium);
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .btn-gold-mobile {
          background-color: var(--color-gold);
          color: var(--color-white);
          border: none;
          padding: 16px;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          width: 100%;
          cursor: pointer;
          margin-top: 40px;
        }

        .mobile-lang-row {
          display: flex;
          gap: 10px;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid var(--color-beige-light);
        }

        .mobile-lang-row button {
          flex: 1;
          padding: 10px;
          background: none;
          border: 1px solid var(--color-beige-dark);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--color-black);
          cursor: pointer;
          transition: var(--transition-fast);
          font-family: var(--font-sans);
        }

        .mobile-lang-row button:hover {
          border-color: var(--color-gold);
          color: var(--color-gold);
        }

        .mobile-lang-row button.active {
          background-color: var(--color-black);
          color: var(--color-white);
          border-color: var(--color-black);
        }

        .desktop-only {
          display: flex;
        }

        @media (max-width: 1024px) {
          .desktop-only {
            display: none !important;
          }
          
          .navbar-burger {
            display: block;
            order: 1;
          }

          .navbar-links {
            display: none;
          }

          .navbar-logo {
            order: 2;
          }

          .navbar-actions {
            order: 3;
            flex: none;
          }
          
          .navbar-wrapper.scrolled .navbar-burger,
          .navbar-wrapper.always-solid .navbar-burger {
            color: var(--color-black);
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;

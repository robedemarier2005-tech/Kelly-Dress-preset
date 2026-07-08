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
    <header 
      className={`navbar-wrapper ${isHome ? 'home' : ''} ${isScrolled ? 'scrolled' : ''} ${isMegaMenuOpen ? 'mega-open' : ''} ${isMobileMenuOpen ? 'mobile-open' : ''}`}
      style={isHome ? {
        backgroundColor: (isMegaMenuOpen || isScrolled) ? '#fff' : 'rgba(255,255,255,0.01)',
        backdropFilter: (isMegaMenuOpen || isScrolled) ? 'none' : 'blur(3px)',
        WebkitBackdropFilter: (isMegaMenuOpen || isScrolled) ? 'none' : 'blur(3px)',
        borderBottom: (isMegaMenuOpen || isScrolled) ? '1px solid #f5f1e9' : '1px solid rgba(255,255,255,0.1)',
        boxShadow: (isMegaMenuOpen || isScrolled) ? '0 2px 20px rgba(0,0,0,0.03)' : 'none',
      } : undefined}
    >
      <div className="navbar-container">
        {/* Left Side: Burger Menu (Mobile Only) */}
          <button 
            className="navbar-burger" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={t('nav.menu')}
            style={isHome ? { color: (!isScrolled && !isMegaMenuOpen) ? '#fff' : '#111' } : undefined}
          >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        {/* Center/Left: Navigation Links (Desktop Only) */}
        <nav className="navbar-links">
          <Link 
            href="/" 
            className={`nav-item ${pathname === '/' ? 'active' : ''}`}
            onClick={handleLinkClick}
            style={isHome ? { color: (!isScrolled && !isMegaMenuOpen) ? '#fff' : '#111' } : undefined}
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
            <button 
              className="nav-item-trigger nav-item-trigger-btn"
              onClick={toggleMegaMenuClick}
              style={isHome ? { color: (!isScrolled && !isMegaMenuOpen) ? '#fff' : '#111' } : undefined}
            >
              {t('nav.collections')} <ChevronDown size={14} className="chevron" />
            </button>

            <div className={`mega-menu ${isMegaMenuOpen ? 'open' : ''}`}>
              <div className="mega-menu-content">
                <div className="mega-menu-grid">
                  <div className="mega-menu-column collections-list menu-animate" style={{ animationDelay: '0ms' }}>
                    <h4>{t('nav.nosCollections')}</h4>
                    <p className="collections-intro">Explorez nos univers d'exception, chacune de nos collections raconte une histoire unique.</p>
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

                  <div className="mega-menu-column featured-collection menu-animate" style={{ animationDelay: '100ms' }}>
                    <div className="featured-card">
                      <Image src="https://i.ibb.co/FkFWZzJj/980c30a1-fd3b-451c-b724-6e03eb444e2e.png" alt="Featured Collection" fill sizes="300px" />
                      <div className="featured-overlay">
                        <span className="featured-badge">{t('nav.nouvelleEre')}</span>
                        <h3 className="featured-title">{t('nav.collection2026')}</h3>
                        <Link 
                          href="/catalog?collection=Collection%202026"
                          className="featured-btn"
                          onClick={handleLinkClick}
                        >
                          Explorer la collection <span className="btn-arrow">→</span>
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="mega-menu-column details-column menu-animate" style={{ animationDelay: '200ms' }}>
                    <h4>{t('nav.experienceAtelier')}</h4>
                    <p className="details-text">{t('nav.descAtelier')}</p>
                    <Link href="/catalog" className="btn-book-nav" onClick={handleLinkClick}>
                      {t('nav.decouvrirBoutique')}
                    </Link>
                    <div className="reassurance-list">
                      <div className="reassurance-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                        <span>Fabrication artisanale</span>
                      </div>
                      <div className="reassurance-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                        <span>Sur mesure</span>
                      </div>
                      <div className="reassurance-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                        <span>Livraison sécurisée</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Link 
            href="/catalog" 
            className={`nav-item ${pathname.startsWith('/catalog') ? 'active' : ''}`}
            onClick={handleLinkClick}
            style={isHome ? { color: (!isScrolled && !isMegaMenuOpen) ? '#fff' : '#111' } : undefined}
          >
            {t('nav.catalogue')}
          </Link>

          <Link 
            href="/about" 
            className={`nav-item ${pathname === '/about' ? 'active' : ''}`}
            onClick={handleLinkClick}
            style={isHome ? { color: (!isScrolled && !isMegaMenuOpen) ? '#fff' : '#111' } : undefined}
          >
            {t('nav.aPropos')}
          </Link>
        </nav>

        {/* Center: Brand Logo */}
        <Link href="/" className="navbar-logo" onClick={handleLinkClick}>
          <span className="logo-text" style={isHome ? { color: (!isScrolled && !isMegaMenuOpen) ? '#fff' : '#111' } : undefined}>Kelly Dress</span>
        </Link>

        {/* Right Side: Links & Actions */}
        <div className="navbar-actions">
          <Link 
            href="/contact" 
            className={`nav-item desktop-only ${pathname === '/contact' ? 'active' : ''}`}
            onClick={handleLinkClick}
            style={isHome ? { color: (!isScrolled && !isMegaMenuOpen) ? '#fff' : '#111' } : undefined}
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
            <button 
              className="navbar-action-btn lang-btn" 
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              style={isHome ? { color: (!isScrolled && !isMegaMenuOpen) ? '#fff' : '#111' } : undefined}
            >
              <Globe size={18} />
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
            style={isHome ? { color: (!isScrolled && !isMegaMenuOpen) ? '#fff' : '#111' } : undefined}
          >
            <Heart size={18} className={wishlist.length > 0 ? 'filled-heart' : ''} />
            {wishlist.length > 0 && <span className="wishlist-badge">{wishlist.length}</span>}
          </Link>

          <button 
            className="navbar-action-btn cart-icon-wrapper-nav"
            onClick={openCart}
            aria-label={t('nav.panier')}
            style={isHome ? { color: (!isScrolled && !isMegaMenuOpen) ? '#fff' : '#111' } : undefined}
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
            <Link href="/" onClick={handleLinkClick} className="mobile-nav-btn">{t('nav.maison')}</Link>
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
                  </div>
                </Link>
              ))}
            </div>
            <div className="mobile-divider"></div>
            <div className="mobile-nav-links">
              <Link href="/catalog" onClick={handleLinkClick} className="mobile-nav-btn">{t('nav.catalogue')}</Link>
              <Link href="/about" onClick={handleLinkClick} className="mobile-nav-btn">{t('nav.aPropos')}</Link>
              <Link href="/contact" onClick={handleLinkClick} className="mobile-nav-btn">{t('nav.contact')}</Link>
              <Link href="/wishlist" onClick={handleLinkClick} className="mobile-nav-btn-wishlist">
                {t('nav.favoris')} ({wishlist.length})
              </Link>
            </div>
          </div>
          <div className="mobile-bottom-section">
            <button className="btn-gold-mobile" onClick={() => {
              setIsMobileMenuOpen(false);
              openCart();
            }}>
              {t('nav.voirPanier')} ({cartCount})
            </button>
            <div className="mobile-lang-row">
              <button onClick={() => { setLang('fr'); setIsMobileMenuOpen(false); }} className={lang === 'fr' ? 'active' : ''}>FR</button>
              <button onClick={() => { setLang('en'); setIsMobileMenuOpen(false); }} className={lang === 'en' ? 'active' : ''}>EN</button>
              <button onClick={() => { setLang('es'); setIsMobileMenuOpen(false); }} className={lang === 'es' ? 'active' : ''}>ES</button>
            </div>
          </div>
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
          border-bottom: 1px solid rgba(255,255,255,0.03);
          transition: background-color 0.6s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.6s ease, box-shadow 0.6s ease, backdrop-filter 0.6s ease;
          animation: navbarSlideIn 1s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        @keyframes navbarSlideIn {
          from { opacity: 0; transform: translateY(-100%); }
          to { opacity: 1; transform: translateY(0); }
        }

        .navbar-wrapper.home {
          background-color: rgba(255,255,255,0.08);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.15);
        }

        .navbar-wrapper:not(.home) {
          background-color: var(--color-white);
          border-bottom: 1px solid var(--color-beige-light);
          box-shadow: 0 2px 20px rgba(0,0,0,0.025);
        }

        .navbar-wrapper:not(.home) .nav-item,
        .navbar-wrapper:not(.home) .nav-item-trigger,
        .navbar-wrapper:not(.home) .navbar-burger,
        .navbar-wrapper:not(.home) .navbar-action-btn,
        .navbar-wrapper:not(.home) .logo-text,
        .navbar-wrapper:not(.home) .lang-current {
          color: var(--color-black);
        }

        .navbar-wrapper:not(.scrolled):not(.mega-open):not(.home) .nav-item,
        .navbar-wrapper:not(.scrolled):not(.mega-open):not(.home) .nav-item-trigger,
        .navbar-wrapper:not(.scrolled):not(.mega-open):not(.home) .navbar-burger,
        .navbar-wrapper:not(.scrolled):not(.mega-open):not(.home) .navbar-action-btn,
        .navbar-wrapper:not(.scrolled):not(.mega-open):not(.home) .logo-text,
        .navbar-wrapper:not(.scrolled):not(.mega-open):not(.home) .lang-current {
          color: var(--color-black);
        }

        .navbar-wrapper.home .nav-item,
        .navbar-wrapper.home .nav-item-trigger,
        .navbar-wrapper.home .navbar-burger,
        .navbar-wrapper.home .navbar-action-btn,
        .navbar-wrapper.home .logo-text,
        .navbar-wrapper.home .lang-current {
          color: var(--color-white);
        }

        .navbar-wrapper.home.mega-open .nav-item,
        .navbar-wrapper.home.mega-open .nav-item-trigger,
        .navbar-wrapper.home.mega-open .navbar-burger,
        .navbar-wrapper.home.mega-open .navbar-action-btn,
        .navbar-wrapper.home.mega-open .logo-text,
        .navbar-wrapper.home.mega-open .lang-current {
          color: var(--color-black);
        }

        .navbar-wrapper.home.scrolled .nav-item,
        .navbar-wrapper.home.scrolled .nav-item-trigger,
        .navbar-wrapper.home.scrolled .navbar-burger,
        .navbar-wrapper.home.scrolled .navbar-action-btn,
        .navbar-wrapper.home.scrolled .logo-text,
        .navbar-wrapper.home.scrolled .lang-current {
          color: var(--color-black);
        }

        .navbar-wrapper.scrolled,
        .navbar-wrapper.mega-open {
          background-color: rgba(255,255,255,0.10);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 1px 12px rgba(0,0,0,0.04);
        }

        .navbar-wrapper.home.scrolled {
          background-color: var(--color-white);
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
          border-bottom: 1px solid var(--color-beige-light);
          box-shadow: 0 2px 20px rgba(0,0,0,0.03);
        }

        .navbar-wrapper.home.mega-open {
          background-color: var(--color-white);
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
          border-bottom: 1px solid var(--color-beige-light);
        }

        .navbar-wrapper.mobile-open {
          background-color: var(--color-white) !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          border-bottom: 1px solid var(--color-beige-light);
          box-shadow: 0 2px 20px rgba(0,0,0,0.05);
        }

        .navbar-wrapper.mobile-open .navbar-burger,
        .navbar-wrapper.mobile-open .navbar-action-btn,
        .navbar-wrapper.mobile-open .logo-text,
        .navbar-wrapper.mobile-open .lang-current {
          color: var(--color-black) !important;
        }

        .navbar-wrapper.scrolled .nav-item,
        .navbar-wrapper.scrolled .nav-item-trigger,
        .navbar-wrapper.scrolled .navbar-burger,
        .navbar-wrapper.scrolled .navbar-action-btn,
        .navbar-wrapper.scrolled .logo-text,
        .navbar-wrapper.scrolled .lang-current,
        .navbar-wrapper.mega-open .nav-item,
        .navbar-wrapper.mega-open .nav-item-trigger,
        .navbar-wrapper.mega-open .navbar-burger,
        .navbar-wrapper.mega-open .navbar-action-btn,
        .navbar-wrapper.mega-open .logo-text,
        .navbar-wrapper.mega-open .lang-current {
          color: var(--color-black);
        }

        .navbar-container {
          max-width: 1500px;
          margin: 0 auto;
          height: 100%;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          padding: 0 40px;
        }

        .navbar-burger {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 5px;
          width: 30px;
          height: 30px;
          transition: opacity 0.3s ease;
        }

        .navbar-links {
          display: flex;
          align-items: center;
          gap: 60px;
          justify-content: flex-start;
        }

        .nav-item, .nav-item-trigger {
          background: none;
          border: none;
          font-size: 0.68rem;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 0.28em;
          cursor: pointer;
          padding: 4px 0;
          position: relative;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: opacity 0.25s ease;
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
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 1px;
          background-color: rgba(0,0,0,0.15);
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.3s ease;
        }

        .nav-item:hover::after,
        .nav-item.active::after {
          transform: scaleX(1);
          transform-origin: left;
        }

        .nav-item:hover,
        .nav-item-trigger:hover {
          opacity: 0.6;
        }

        .navbar-logo {
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          height: 100%;
        }

        .logo-text {
          font-family: var(--font-serif);
          font-size: 2.03rem;
          font-weight: 400;
          font-style: italic;
          letter-spacing: 0.08em;
          white-space: nowrap;
          transition: opacity 0.25s ease;
          display: flex;
          align-items: center;
          color: rgba(255,255,255,0.95);
        }

        .navbar-logo:hover .logo-text {
          opacity: 0.7;
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 32px;
          justify-content: flex-end;
        }

        .navbar-action-btn {
          background: none;
          border: none;
          cursor: pointer;
          position: relative;
          padding: 4px;
          transition: opacity 0.25s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .navbar-action-btn:hover {
          opacity: 0.6;
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

        /* ---- Column animations ---- */
        @keyframes menuFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .menu-animate {
          animation: menuFadeUp 0.5s cubic-bezier(0.25, 1, 0.5, 1) both;
        }

        .mega-menu-column h4 {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: var(--color-gold);
          margin-bottom: 25px;
          font-weight: 500;
        }

        /* ---- Left column : collections ---- */
        .collections-intro {
          font-size: 0.8rem;
          color: var(--color-gray-medium);
          line-height: 1.7;
          margin-bottom: 30px;
        }

        .collections-list ul {
          list-style: none;
        }

        .collections-list li {
          margin-bottom: 18px;
        }

        .collections-list a {
          font-family: var(--font-serif);
          font-size: 1.35rem;
          color: var(--color-black);
          cursor: pointer;
          transition: var(--transition-fast);
          display: block;
        }

        .collections-list a:hover {
          color: var(--color-gold);
          transform: translateX(5px);
        }

        /* ---- Center column : featured card ---- */
        .featured-card {
          position: relative;
          height: 280px;
          overflow: hidden;
          border-radius: 14px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          transition: box-shadow 0.25s ease, transform 0.25s ease;
        }

        .featured-card :global(img) {
          object-fit: cover !important;
          transition: transform 0.25s ease;
        }

        .featured-card:hover {
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
        }

        .featured-card:hover :global(img) {
          transform: scale(1.03);
        }

        .featured-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(0deg, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.05) 100%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 30px;
          color: var(--color-white);
        }

        .featured-badge {
          font-size: 0.65rem;
          font-family: var(--font-sans);
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: var(--color-gold);
          margin-bottom: 6px;
        }

        .featured-title {
          font-family: var(--font-serif);
          font-size: 1.8rem;
          font-weight: 400;
          margin-bottom: 20px;
        }

        .featured-btn {
          align-self: flex-start;
          background: transparent;
          border: none;
          color: var(--color-white);
          font-size: 0.72rem;
          font-family: var(--font-sans);
          text-transform: uppercase;
          letter-spacing: 0.22em;
          border-bottom: 1px solid var(--color-white);
          padding-bottom: 3px;
          cursor: pointer;
          transition: var(--transition-fast);
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .btn-arrow {
          display: inline-block;
          transition: transform 0.25s ease;
        }

        .featured-btn:hover {
          color: var(--color-gold);
          border-bottom: 1px solid var(--color-gold);
        }

        .featured-btn:hover .btn-arrow {
          transform: translateX(4px);
        }

        /* ---- Right column : details + reassurance ---- */
        .details-text {
          font-size: 0.85rem;
          color: var(--color-charcoal);
          margin-bottom: 32px;
          line-height: 2;
        }

        .btn-book-nav {
          background-color: var(--color-black);
          color: var(--color-white);
          border: none;
          padding: 12px 30px;
          font-size: 0.75rem;
          font-family: var(--font-sans);
          text-transform: uppercase;
          letter-spacing: 0.15em;
          cursor: pointer;
          transition: var(--transition-fast);
          display: inline-block;
        }

        .btn-book-nav:hover {
          background-color: var(--color-gold);
        }

        .reassurance-list {
          margin-top: 40px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .reassurance-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.78rem;
          color: var(--color-charcoal);
          letter-spacing: 0.05em;
        }

        .reassurance-item svg {
          color: var(--color-gold);
          flex-shrink: 0;
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
          transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.5s, visibility 0.5s;
          overflow-y: auto;
        }

        .mobile-drawer.open {
          transform: translateY(0);
          opacity: 1;
          visibility: visible;
        }

        .mobile-drawer-content {
          padding: 24px 28px;
          display: flex;
          flex-direction: column;
          height: calc(100vh - var(--navbar-height));
        }

        .mobile-drawer-links {
          display: flex;
          flex-direction: column;
          gap: 0;
          flex: 1;
          overflow-y: auto;
        }

        .mobile-nav-links {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 8px;
        }

        .mobile-nav-btn {
          display: block;
          width: 100%;
          text-align: center;
          font-family: var(--font-serif);
          font-size: 1.3rem;
          color: var(--color-black) !important;
          cursor: pointer;
          padding: 14px 16px;
          background-color: var(--color-ivory);
          border: 1px solid var(--color-beige-light);
          border-radius: 8px;
          letter-spacing: 0.02em;
          transition: all 0.25s ease;
          text-decoration: none;
        }

        .mobile-nav-btn:hover {
          border-color: var(--color-gold);
          background-color: var(--color-white);
          color: var(--color-gold) !important;
        }

        .mobile-nav-btn-wishlist {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          text-align: center;
          font-family: var(--font-serif);
          font-size: 1.3rem;
          color: var(--color-black) !important;
          cursor: pointer;
          padding: 14px 16px;
          background-color: var(--color-ivory);
          border: 1px solid var(--color-beige-light);
          border-radius: 8px;
          letter-spacing: 0.02em;
          transition: all 0.25s ease;
          text-decoration: none;
        }

        .mobile-nav-btn-wishlist:hover {
          border-color: var(--color-gold);
          background-color: var(--color-white);
        }

        .mobile-subheader {
          font-family: var(--font-sans);
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: var(--color-gold);
          margin-top: 20px;
          margin-bottom: 10px;
          font-weight: 500;
        }

        .mobile-collections-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin: 0 0 10px 0;
        }

        .mobile-col-card {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          background-color: var(--color-ivory);
          border: 1px solid var(--color-beige-light);
          overflow: hidden;
          transition: all 0.25s ease;
          border-radius: 8px;
        }

        .mobile-col-card:hover {
          border-color: var(--color-gold);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
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
          transition: transform 0.5s ease;
        }

        .mobile-col-card:hover .mobile-col-img img {
          transform: scale(1.05);
        }

        .mobile-col-card-body {
          padding: 8px 10px;
        }

        .mobile-col-name {
          font-family: var(--font-serif);
          font-size: 0.85rem;
          color: var(--color-black);
          display: block;
          margin-bottom: 2px;
        }

        .mobile-col-desc {
          font-family: var(--font-sans);
          font-size: 0.58rem;
          color: var(--color-gray-medium);
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .mobile-divider {
          height: 1px;
          background-color: var(--color-beige-light);
          margin: 12px 0;
        }

        .mobile-bottom-section {
          padding-top: 16px;
          border-top: 1px solid var(--color-beige-light);
          flex-shrink: 0;
        }

        .btn-gold-mobile {
          background-color: var(--color-gold);
          color: var(--color-white);
          border: none;
          padding: 15px;
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          width: 100%;
          cursor: pointer;
          border-radius: 8px;
          font-family: var(--font-sans);
          font-weight: 500;
          transition: background-color 0.25s ease;
        }

        .btn-gold-mobile:hover {
          background-color: var(--color-gold-hover);
        }

        .mobile-lang-row {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }

        .mobile-lang-row button {
          flex: 1;
          padding: 10px;
          background: none;
          border: 1px solid var(--color-beige-dark);
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--color-black);
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: var(--font-sans);
          border-radius: 6px;
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

        @media (max-width: 1300px) {
          .mega-menu-grid {
            gap: 40px;
          }
          .collections-list a {
            font-size: 1.1rem;
          }
        }

        @media (max-width: 1100px) {
          .mega-menu-grid {
            grid-template-columns: 1fr 1.3fr 1.1fr;
            gap: 30px;
          }
          .featured-card {
            height: 240px;
          }
        }

        @media (max-width: 1024px) {
          .desktop-only {
            display: none !important;
          }

          .navbar-container {
            grid-template-columns: auto 1fr auto;
          }
          
          .navbar-burger {
            display: block;
          }

          .navbar-links {
            display: none;
          }

          .navbar-actions {
            gap: 20px;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;

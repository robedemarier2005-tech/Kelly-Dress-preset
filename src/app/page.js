'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { collectionsData } from '../data/dresses';

export default function Home() {
  const { t } = useTranslation();
  useEffect(() => { document.title = 'Kelly Dress | Robes de Mariée Haute Couture Parisienne'; }, []);
  const collectionRefs = useRef([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [featuredDresses, setFeaturedDresses] = useState([]);
  const parallaxRef = useRef(null);
  const sliderImages = [
    'https://i.ibb.co/FkFWZzJj/980c30a1-fd3b-451c-b724-6e03eb444e2e.png',
    'https://i.ibb.co/SD59NTYH/4c6861f7-5c86-403f-a434-7107cfcc3826.png',
    'https://i.ibb.co/xktd8js/df6e8020-1423-4be3-9dc5-278ea60ae235.png'
  ];

  const featuredRefs = ['KD-15834683343192', 'KD-15834687045976', 'KD-15834687144280'];

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { getData } = await import('../lib/shopify');
        const data = await getData('products');
        console.log('All products loaded:', data.length, data.map(d => d.reference));
        const uniqueData = Array.from(new Map(data.map(item => [item.id, item])).values());
        const selected = featuredRefs
          .map(ref => uniqueData.find(d => d.reference === ref || d.id === ref))
          .filter(Boolean);
        console.log('Selected featured:', selected.length, selected.map(d => d.reference));
        setFeaturedDresses(selected.length > 0 ? selected : uniqueData.slice(0, 3));
      } catch (error) {
        console.error('Error loading products:', error);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    const handleParallax = () => {
      if (!parallaxRef.current) return;
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        parallaxRef.current.style.transform = `translateY(${scrolled * 0.12}px)`;
      }
    };
    window.addEventListener('scroll', handleParallax, { passive: true });
    return () => window.removeEventListener('scroll', handleParallax);
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.animate-fade-in');
    fadeElements.forEach(el => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [featuredDresses]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-wrapper">
      {/* Fullscreen Hero */}
      <section className="hero-section">
        <div className="hero-bg hero-slider" ref={parallaxRef}>
          {sliderImages.map((src, i) => (
            <div
              key={i}
              className={`hero-slide ${activeSlide === i ? 'active' : ''}`}
            >
              <Image src={src} alt="" fill sizes="100vw" priority={i === 0} />
            </div>
          ))}
          <div className="hero-overlay"></div>
        </div>

        <div className="hero-dots">
          {sliderImages.map((_, i) => (
            <button
              key={i}
                className={`hero-dot ${activeSlide === i ? 'active' : ''}`}
                onClick={() => setActiveSlide(i)}
                aria-label={`Slide ${i + 1}`}
              />
          ))}
        </div>

        <div className="hero-text-backdrop"></div>
        <div className="hero-content">
          <span className="hero-tagline animate-fade-in visible">{t('hero.tagline')}</span>
          <h1 className="hero-title animate-fade-in visible" style={{ transitionDelay: '0.2s' }}>{t('hero.title')}</h1>
          <p className="hero-slogan animate-fade-in visible" style={{ transitionDelay: '0.35s' }}>L'élégance intemporelle pensée pour votre mariage.</p>
          <span className="hero-luxury-line animate-fade-in visible" style={{ transitionDelay: '0.45s' }}>Haute Couture • Sur rendez-vous</span>
          <div className="hero-decorative-line animate-fade-in visible" style={{ transitionDelay: '0.5s' }}></div>
          <div className="hero-ctas animate-fade-in visible" style={{ transitionDelay: '0.55s' }}>
            <Link 
              href="/catalog" 
              className="hero-cta-primary"
            >
              {t('hero.cta')}
            </Link>
            <Link 
              href="/contact" 
              className="hero-cta-secondary"
            >
              Prendre rendez-vous
            </Link>
          </div>
        </div>

        <div className="scroll-indicator" onClick={() => {
          document.getElementById('la-maison').scrollIntoView({ behavior: 'smooth' });
        }}>
          <span className="scroll-arrows">
            <span className="scroll-arrow-item" style={{ animationDelay: '0s' }}>↓</span>
            <span className="scroll-arrow-item" style={{ animationDelay: '0.15s' }}>↓</span>
            <span className="scroll-arrow-item" style={{ animationDelay: '0.3s' }}>↓</span>
          </span>
          <span className="scroll-text">SCROLL</span>
        </div>
      </section>

      {/* Nos Collections */}
      <section className="collections-home-section section-padding">
        <div className="container">
          <div className="section-header animate-fade-in">
            <span className="section-subtitle">{t('featured.subtitle')}</span>
            <h2 className="section-title">{t('nav.nosCollections')}</h2>
          </div>
          <div className="collections-home-grid">
            {collectionsData.slice(0, 3).map((col, i) => (
              <Link 
                key={col.id}
                href={`/catalog?collection=${encodeURIComponent(col.name)}`}
                className="collection-card animate-fade-in"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="collection-card-img">
                  <Image src={col.image} alt={col.name} fill sizes="33vw" />
                  <div className="collection-card-overlay"></div>
                </div>
                <div className="collection-card-info">
                  <h3>{col.name}</h3>
                  <p className="collection-desc">{col.description}</p>
                  <span className="collection-link">Explorer <ArrowRight size={12} /></span>
                </div>
              </Link>
            ))}
          </div>
          <div className="collections-footer animate-fade-in">
            <Link href="/catalog" className="btn-featured-all">
              {t('featured.voirTout')} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Excellence Section */}
      <section id="la-maison" className="maison-section container section-padding">
        <div className="maison-grid">
          <div className="maison-text animate-fade-in">
            <span className="section-subtitle">{t('about.subtitle')}</span>
            <h2 className="maison-title">L'Excellence dans Chaque Détail</h2>
            <p className="maison-p font-serif-style">
              Chaque robe Kelly Dress est une promesse tenue — celle d'un savoir-faire exigeant, d'une matière noble et d'un accompagnement à la hauteur de vos attentes.
            </p>
            <p className="maison-p">
              Nos créations naissent de matières soigneusement sélectionnées pour leur qualité exceptionnelle. Chaque silence, chaque finition, chaque couture est examiné avec la même rigueur que dans les plus grands ateliers de couture, avant de vous être confié.
            </p>
            <div className="trust-grid">
              <div className="trust-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                <span className="trust-label">Paiement sécurisé</span>
              </div>
              <div className="trust-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <span className="trust-label">Accompagnement sur mesure</span>
              </div>
              <div className="trust-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                <span className="trust-label">Matières d'exception</span>
              </div>
              <div className="trust-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <span className="trust-label">Contrôle qualité rigoureux</span>
              </div>
            </div>
          </div>
          <div className="maison-image-container animate-fade-in">
            <div className="maison-img-frame">
              <Image src="https://i.ibb.co/07v0Bzq/26f17a07-c620-4b21-b650-5cf9fa1a0891.png" alt="Finitions haute couture" fill sizes="(max-width: 768px) 100vw, 50vw" className="maison-img" />
            </div>
          </div>
        </div>
      </section>

      {/* Robes en Vedette */}
      <section className="featured-section section-padding">
        <div className="container">
          <div className="section-header animate-fade-in">
            <span className="section-subtitle">{t('featured.subtitle')}</span>
            <h2 className="section-title">{t('featured.title')}</h2>
          </div>

          <div className="featured-grid">
            {featuredDresses.map((dress, index) => (
              <div 
                key={dress.id} 
                className="featured-card animate-fade-in"
                ref={el => collectionRefs.current[index] = el}
              >
                <Link href={`/catalog/${dress.id}`} className="featured-img-wrapper" aria-label={dress.name}>
                  <Image src={dress.image} alt={dress.name} fill sizes="(max-width: 768px) 100vw, 33vw" />
                </Link>
                <div className="featured-card-info">
                  <h3>{dress.name}</h3>
                  <span className="featured-card-price">{dress.price} €</span>
                </div>
              </div>
            ))}
          </div>

          <div className="featured-footer animate-fade-in">
            <Link href="/catalog" className="btn-featured-all">
              {t('featured.voirTout')} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .hero-section {
          height: 100vh;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: var(--color-white);
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .hero-section {
            height: 650px;
            min-height: 650px;
          }
        }

        @media (max-width: 480px) {
          .hero-section {
            height: 550px;
            min-height: 550px;
          }
        }

        .hero-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          overflow: hidden;
        }

        .hero-slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          background-color: #1a1a1a;
          transition: opacity 1s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .hero-slide.active {
          opacity: 1;
        }

        .hero-slide :global(img) {
          object-fit: cover !important;
          transform: scale(1.05);
          filter: brightness(0.95) contrast(1.05);
          animation: heroZoom 1s ease-out forwards, heroSlowZoom 20s ease-in-out 1s infinite alternate;
        }

        .hero-slide.active :global(img) {
          animation: heroZoom 1s ease-out forwards, heroSlowZoom 20s ease-in-out 1s infinite alternate;
        }

        @keyframes heroZoom {
          0% { transform: scale(1.05); }
          100% { transform: scale(1.00); }
        }

        @keyframes heroSlowZoom {
          0% { transform: scale(1.00); }
          100% { transform: scale(1.03); }
        }

        .hero-dots {
          position: absolute;
          bottom: 100px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          display: flex;
          gap: 14px;
        }

        .hero-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid var(--color-white);
          background: none;
          cursor: pointer;
          transition: var(--transition-fast);
          padding: 0;
        }

        .hero-dot.active {
          background-color: var(--color-white);
        }

        .hero-dot:hover {
          border-color: var(--color-gold);
          background-color: var(--color-gold);
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.04) 40%, rgba(0,0,0,0.12) 100%);
          z-index: 1;
        }

        .hero-text-backdrop {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 55%;
          max-width: 750px;
          height: 55%;
          z-index: 2;
          background: radial-gradient(ellipse at center, rgba(255,255,255,0.12) 0%, rgba(0,0,0,0.35) 35%, rgba(0,0,0,0.15) 60%, transparent 75%);
          pointer-events: none;
        }

        .hero-content {
          position: relative;
          z-index: 3;
          max-width: 680px;
          padding: 0 32px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-top: -2vh;
          margin-left: -80px;
        }

        .hero-tagline {
          font-family: var(--font-sans);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.45em;
          color: rgba(255,252,245,0.55);
          margin-bottom: 36px;
          display: block;
          font-weight: 400;
        }

        .hero-title {
          font-family: var(--font-serif);
          font-size: 5.2rem;
          font-weight: 300;
          letter-spacing: 0.16em;
          margin-bottom: 40px;
          text-transform: uppercase;
          font-style: italic;
          color: rgba(255,252,245,0.93);
          line-height: 1.15;
          text-shadow: 0 2px 12px rgba(0,0,0,0.18);
        }

        .hero-slogan {
          font-size: 1.35rem;
          letter-spacing: 0.06em;
          margin-bottom: 20px;
          color: rgba(255,252,245,0.9);
          font-weight: 300;
          max-width: 520px;
          line-height: 1.8;
          font-family: var(--font-sans);
        }

        .hero-luxury-line {
          font-family: var(--font-sans);
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.35em;
          color: rgba(255,252,245,0.45);
          margin-bottom: 24px;
          display: block;
          font-weight: 400;
        }

        .hero-decorative-line {
          width: 120px;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(255,252,245,0.3) 30%, rgba(201,169,123,0.5) 50%, rgba(255,252,245,0.3) 70%, transparent 100%);
          margin-bottom: 48px;
          position: relative;
        }

        .hero-decorative-line::after {
          content: '✦';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 0.5rem;
          color: rgba(201,169,123,0.6);
          background: transparent;
          padding: 0 8px;
        }

        .hero-ctas {
          display: flex;
          gap: 24px;
          align-items: center;
        }

        :global(.hero-cta-primary) {
          display: inline-block;
          background: linear-gradient(135deg, #c5a880 0%, #d4b896 50%, #c5a880 100%);
          color: #fff;
          padding: 18px 50px;
          font-size: 0.65rem;
          font-family: var(--font-sans);
          text-transform: uppercase;
          letter-spacing: 0.28em;
          text-decoration: none;
          border: none;
          border-radius: 0;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
          box-shadow: 0 4px 20px rgba(197,168,128,0.3);
          font-weight: 500;
          position: relative;
          overflow: hidden;
        }

        :global(.hero-cta-primary::before) {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.6s ease;
        }

        :global(.hero-cta-primary:hover::before) {
          left: 100%;
        }

        :global(.hero-cta-primary:hover) {
          background: linear-gradient(135deg, #b4966e 0%, #c5a880 50%, #b4966e 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(197,168,128,0.45);
        }

        :global(.hero-cta-secondary) {
          display: inline-block;
          background: transparent;
          border: 1.5px solid rgba(255,255,255,0.6);
          color: #fff;
          padding: 17px 50px;
          font-size: 0.65rem;
          font-family: var(--font-sans);
          text-transform: uppercase;
          letter-spacing: 0.28em;
          text-decoration: none;
          border-radius: 0;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
          font-weight: 500;
          position: relative;
          overflow: hidden;
        }

        :global(.hero-cta-secondary::before) {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          transition: left 0.6s ease;
        }

        :global(.hero-cta-secondary:hover::before) {
          left: 100%;
        }

        :global(.hero-cta-secondary:hover) {
          border-color: var(--color-gold);
          background: rgba(197,168,128,0.15);
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(197,168,128,0.2);
        }

        .scroll-indicator {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          color: rgba(255,252,245,0.55);
          font-size: 0.55rem;
          font-family: var(--font-sans);
          text-transform: uppercase;
          letter-spacing: 0.4em;
          opacity: 1;
          transition: color 0.3s ease;
          gap: 6px;
        }

        .scroll-indicator:hover {
          color: rgba(255,252,245,0.8);
        }

        .scroll-arrows {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .scroll-arrow-item {
          font-size: 0.7rem;
          line-height: 1;
          animation: scrollDescend 2s ease-in-out infinite;
          opacity: 0.5;
        }

        @keyframes scrollDescend {
          0%, 100% { opacity: 0.3; transform: translateY(0); }
          50% { opacity: 0.8; transform: translateY(4px); }
        }

        .scroll-text {
          font-size: 0.5rem;
          letter-spacing: 0.35em;
          margin-top: 4px;
        }

        .hero-dots {
          position: absolute;
          bottom: 100px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .hero-dot {
          width: 28px;
          height: 2px;
          border: none;
          background-color: rgba(255,255,255,0.35);
          cursor: pointer;
          transition: background-color 0.3s ease, width 0.3s ease;
          padding: 0;
          border-radius: 0;
        }

        .hero-dot.active {
          background-color: var(--color-white);
          width: 44px;
        }

        .hero-dot:hover {
          background-color: rgba(255,255,255,0.7);
        }

        /* Maison Section */
        .maison-section {
          background-color: var(--color-ivory);
        }

        .maison-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        .maison-title {
          font-size: 2.8rem;
          color: var(--color-black);
          margin-bottom: 30px;
        }

        .maison-p {
          font-size: 0.95rem;
          color: var(--color-charcoal);
          margin-bottom: 25px;
          line-height: 1.8;
        }

        .font-serif-style {
          font-family: var(--font-serif);
          font-size: 1.35rem;
          line-height: 1.6;
          color: var(--color-black);
          font-style: italic;
        }

        .maison-image-container {
          position: relative;
        }

        .maison-img-frame {
          position: relative;
          padding-bottom: 125%;
          overflow: hidden;
        }

        .maison-img-frame :global(img) {
          object-fit: cover !important;
        }

        .trust-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 40px;
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px 20px;
          background-color: transparent;
          border: none;
          border-bottom: 1px solid var(--color-beige-dark);
          border-radius: 0;
          transition: border-color 0.3s ease;
        }

        .trust-item:hover {
          border-color: var(--color-gold);
        }

        .trust-item svg {
          color: var(--color-gold);
          flex-shrink: 0;
          opacity: 0.7;
        }

        .trust-label {
          font-family: var(--font-sans);
          font-size: 0.75rem;
          color: var(--color-gray-medium);
          font-weight: 400;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .featured-section {
          background-color: var(--color-white);
        }

        .featured-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          max-width: 1100px;
          margin: 0 auto;
        }

        :global(.featured-card) {
          display: flex;
          flex-direction: column;
          cursor: pointer;
        }

        :global(.featured-card:hover .featured-img-wrapper img) {
          transform: scale(1.03);
        }

        :global(.featured-card-info) {
          padding: 16px 4px 0;
          text-align: center;
        }

        :global(.featured-card-info h3) {
          font-family: var(--font-serif);
          font-size: 1.1rem;
          color: var(--color-black);
          margin-bottom: 4px;
          font-weight: 400;
        }

        :global(.featured-card-price) {
          font-family: var(--font-sans);
          font-size: 0.8rem;
          color: var(--color-gray-medium);
          letter-spacing: 0.05em;
        }

        :global(.featured-img-wrapper) {
          position: relative;
          overflow: hidden;
          aspect-ratio: 3/4;
          display: block;
          background-color: var(--color-ivory);
          padding: 8px;
        }

        :global(.featured-img-wrapper img) {
          object-fit: contain !important;
          object-position: center !important;
          transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .featured-footer {
          text-align: center;
          margin-top: 60px;
        }

        .btn-featured-all {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: none;
          border: 1px solid var(--color-black);
          padding: 14px 35px;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--color-black);
          cursor: pointer;
          transition: background-color 0.3s ease, color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
          text-decoration: none;
        }

        .btn-featured-all:hover {
          background-color: var(--color-black);
          color: var(--color-white);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }

        @media (max-width: 900px) {
          .featured-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
          }
        }

        @media (max-width: 600px) {
          .featured-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }

        /* Collections Section */
        .collections-home-section {
          background-color: var(--color-ivory);
        }

        .collections-home-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .collection-card {
          text-decoration: none;
          display: flex;
          flex-direction: column;
          transition: transform 0.4s ease;
        }

        .collection-card:hover {
          transform: translateY(-4px);
        }

        .collection-card-img {
          position: relative;
          aspect-ratio: 3/4;
          overflow: hidden;
          background-color: var(--color-beige-light);
        }

        .collection-card-img :global(img) {
          object-fit: cover !important;
          transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .collection-card:hover .collection-card-img :global(img) {
          transform: scale(1.05);
        }

        .collection-card-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.3) 100%);
          pointer-events: none;
        }

        .collection-card-info {
          padding: 25px 0 0 0;
        }

        .collection-card-info h3 {
          font-family: var(--font-serif);
          font-size: 1.5rem;
          color: var(--color-black);
          font-weight: 400;
          margin-bottom: 8px;
        }

        .collection-desc {
          font-size: 0.8rem;
          color: var(--color-gray-medium);
          line-height: 1.6;
          margin-bottom: 12px;
        }

        .collection-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-sans);
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--color-black);
          transition: color 0.3s ease;
          border-bottom: 1px solid var(--color-black);
          padding-bottom: 2px;
        }

        .collection-link :global(svg) {
          transition: transform 0.3s ease;
        }

        .collection-card:hover .collection-link {
          color: var(--color-gold);
          border-bottom-color: var(--color-gold);
        }

        .collection-card:hover .collection-link :global(svg) {
          transform: translateX(4px);
        }

        .collections-footer {
          text-align: center;
          margin-top: 60px;
        }

        /* Animation utilities */
        .animate-fade-in {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 1s cubic-bezier(0.25, 1, 0.5, 1), transform 1s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .animate-fade-in.visible {
          opacity: 1;
          transform: translateY(0);
        }

        @media (max-width: 1024px) {
          .collections-home-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
          }
        }

        @media (max-width: 768px) {
          .hero-section {
            height: 100vh;
            min-height: 650px;
          }

          .hero-content {
            padding: 0 28px;
            max-width: 100%;
            text-align: center;
            margin-top: 0;
            margin-left: 0;
          }

          .hero-tagline {
            font-size: 0.58rem;
            letter-spacing: 0.45em;
            margin-bottom: 28px;
            text-align: center;
          }

          .hero-title {
            font-size: 3rem;
            letter-spacing: 0.08em;
            margin-bottom: 24px;
            line-height: 1.12;
            text-align: center;
          }

          .hero-slogan {
            font-size: 0.9rem;
            letter-spacing: 0.1em;
            margin-bottom: 16px;
            text-align: center;
            max-width: 85%;
          }

          .hero-luxury-line {
            font-size: 0.55rem;
            margin-bottom: 20px;
          }

          .hero-decorative-line {
            width: 80px;
            margin-bottom: 36px;
          }

          .hero-ctas {
            flex-direction: column;
            gap: 20px;
          }

          .hero-cta-primary {
            padding: 15px 40px;
            font-size: 0.65rem;
            width: 100%;
            max-width: 280px;
            text-align: center;
          }

          .hero-cta-secondary {
            font-size: 0.6rem;
            padding: 14px 40px;
          }

          .hero-text-backdrop {
            width: 85%;
            height: 45%;
          }

          .hero-dots {
            bottom: 90px;
            gap: 10px;
          }

          .hero-dot {
            width: 22px;
          }

          .hero-dot.active {
            width: 34px;
          }

          .scroll-indicator {
            bottom: 30px;
            font-size: 0.6rem;
          }

          .maison-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .maison-title {
            font-size: 2rem;
          }

          .maison-p {
            font-size: 0.9rem;
          }

          .font-serif-style {
            font-size: 1.15rem;
          }

          .collections-home-grid {
            grid-template-columns: 1fr;
            gap: 40px;
            max-width: 450px;
          }

          .collection-card-info h3 {
            font-size: 1.3rem;
          }
        }

        @media (max-width: 480px) {
          .hero-section {
            min-height: 550px;
          }

          .hero-content {
            padding: 0 20px;
            margin-top: 0;
          }

          .hero-title {
            font-size: 2rem;
            letter-spacing: 0.06em;
            margin-bottom: 20px;
            line-height: 1.1;
          }

          .hero-tagline {
            font-size: 0.55rem;
            letter-spacing: 0.35em;
            margin-bottom: 24px;
          }

          .hero-slogan {
            font-size: 0.82rem;
            letter-spacing: 0.1em;
            margin-bottom: 14px;
            max-width: 90%;
          }

          .hero-luxury-line {
            font-size: 0.5rem;
            margin-bottom: 16px;
          }

          .hero-decorative-line {
            width: 60px;
            margin-bottom: 28px;
          }

          .hero-cta-primary {
            padding: 14px 36px;
            font-size: 0.6rem;
          }

          .hero-cta-secondary {
            font-size: 0.55rem;
            padding: 13px 36px;
          }

          .hero-text-backdrop {
            width: 95%;
            height: 40%;
          }

          .hero-dots {
            bottom: 80px;
          }

          .scroll-indicator {
            bottom: 25px;
            font-size: 0.55rem;
          }
        }
      `}</style>
    </div>
  );
}

'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export default function Home() {
  const { t } = useTranslation();
  useEffect(() => { document.title = 'Kelly Dress | Robes de Mariée Haute Couture Parisienne'; }, []);
  const collectionRefs = useRef([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const sliderImages = [
    'https://i.ibb.co/FkFWZzJj/980c30a1-fd3b-451c-b724-6e03eb444e2e.png',
    'https://i.ibb.co/SD59NTYH/4c6861f7-5c86-403f-a434-7107cfcc3826.png',
    'https://i.ibb.co/xktd8js/df6e8020-1423-4be3-9dc5-278ea60ae235.png'
  ];

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
      fadeElements.forEach(el => observer.unobserve(el));
    };
  }, []);

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
        <div className="hero-bg hero-slider">
          {sliderImages.map((src, i) => (
            <div
              key={i}
              className={`hero-slide ${activeSlide === i ? 'active' : ''}`}
            >
              <img src={src} alt="" />
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
            />
          ))}
        </div>

        <div className="hero-content">
          <span className="hero-tagline animate-fade-in">{t('hero.tagline')}</span>
          <h1 className="hero-title animate-fade-in">{t('hero.title')}</h1>
          <p className="hero-slogan animate-fade-in">{t('hero.slogan')}</p>
          <Link 
            href="/catalog" 
            className="btn-gold hero-btn animate-fade-in"
          >
            {t('hero.cta')}
          </Link>

        </div>

        <div className="scroll-indicator" onClick={() => {
          document.getElementById('la-maison').scrollIntoView({ behavior: 'smooth' });
        }}>
          <span>{t('hero.explorer')}</span>
          <ArrowDown size={14} className="arrow-bounce" />
        </div>
      </section>

      {/* La Maison Section */}
      <section id="la-maison" className="maison-section container section-padding">
        <div className="maison-grid">
          <div className="maison-text animate-fade-in">
            <span className="section-subtitle">{t('about.subtitle')}</span>
            <h2 className="maison-title">L'Excellence de la Haute Couture Nuptiale</h2>
            <p className="maison-p font-serif-style">
              Chaque mariage raconte une histoire unique. La nôtre commence par la création d'une robe qui sublime la vôtre.
            </p>
            <div className={`maison-more ${showMore ? 'expanded' : ''}`}>
              <p className="maison-p">
                Depuis notre atelier, nous imaginons des créations d'exception où chaque détail est pensé pour révéler l'élégance, la grâce et la personnalité de chaque mariée. Chaque silhouette est entièrement façonnée à la main par des artisans passionnés, héritiers d'un savoir-faire d'excellence où la précision devient un art.
              </p>
              <p className="maison-p">
                Nous sélectionnons avec exigence les plus belles matières : dentelles d'exception, soies nobles, tulles délicats et broderies raffinées, choisis pour leur légèreté, leur mouvement et leur qualité incomparable.
              </p>
              <p className="maison-p">
                Notre signature associe l'élégance intemporelle de la haute couture à une vision contemporaine de la féminité. Des lignes épurées, des coupes parfaitement maîtrisées et des finitions d'une précision absolue donnent naissance à des créations qui traversent le temps sans jamais perdre leur éclat.
              </p>
              <p className="maison-p">
                Plus qu'une robe, nous créons une émotion. Celle de vous sentir unique, rayonnante et inoubliable lors du plus beau jour de votre vie.
              </p>
            </div>
            <div className="maison-actions">
              <button className="btn-maison-more" onClick={() => setShowMore(!showMore)}>
                {showMore ? 'Lire moins —' : 'Lire la suite —'}
              </button>
              <Link href="/about" className="btn-outline">
                {t('about.decouvrir')}
              </Link>
            </div>
          </div>
          <div className="maison-image-container animate-fade-in">
            <div className="maison-img-frame">
              <img src="https://i.ibb.co/VpT8RnwP/cccc.png" alt="Atelier Couture" className="maison-img" />
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
            {[
              { src: 'https://i.ibb.co/23wyhDRq/dazdaz.png' },
              { src: 'https://i.ibb.co/0RNYvXZM/1sss.png' },
              { src: 'https://i.ibb.co/7dCH7bpP/3e51177d-e9b9-4fd3-bc16-60fd8d33e63b.jpg' }
            ].map((img, index) => (
              <div 
                key={index} 
                className="featured-card animate-fade-in"
                ref={el => collectionRefs.current[index] = el}
              >
                <Link href="/catalog" className="featured-img-wrapper">
                  <img src={img.src} alt="" />
                </Link>
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
            height: 100vh;
            min-height: 650px;
          }
        }

        @media (max-width: 480px) {
          .hero-section {
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
          transition: opacity 1.2s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .hero-slide.active {
          opacity: 1;
        }

        .hero-slide img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.03);
          animation: heroZoom 8s ease-out forwards;
        }

        .hero-slide.active img {
          animation: heroZoom 8s ease-out forwards;
        }

        @keyframes heroZoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.08); }
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
          background: radial-gradient(circle, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%);
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 800px;
          padding: 0 20px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .hero-tagline {
          font-family: var(--font-sans);
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.4em;
          color: var(--color-white);
          margin-bottom: 20px;
          display: block;
        }

        .hero-title {
          font-family: var(--font-serif);
          font-size: 5.5rem;
          font-weight: 300;
          letter-spacing: 0.1em;
          margin-bottom: 25px;
          text-transform: uppercase;
          font-style: italic;
          color: var(--color-white);
        }

        .hero-slogan {
          font-size: 1.1rem;
          letter-spacing: 0.15em;
          margin-bottom: 40px;
          color: var(--color-white);
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
          color: var(--color-white);
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          opacity: 0.8;
          transition: var(--transition-fast);
        }

        .scroll-indicator:hover {
          opacity: 1;
          color: var(--color-gold);
        }

        .arrow-bounce {
          margin-top: 10px;
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
          60% { transform: translateY(-3px); }
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
          padding-bottom: 125%; /* 4:5 Aspect Ratio */
          overflow: hidden;
        }

        .maison-img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 1.5s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .maison-img-frame:hover .maison-img {
          transform: scale(1.05);
        }

        .maison-more {
          overflow: hidden;
          max-height: 0;
          opacity: 0;
          transition: max-height 0.6s ease, opacity 0.6s ease;
        }

        .maison-more.expanded {
          max-height: 800px;
          opacity: 1;
        }

        .maison-actions {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-top: 10px;
        }

        .btn-maison-more {
          background: none;
          border: none;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: var(--color-black);
          cursor: pointer;
          padding: 0;
          font-family: inherit;
          transition: var(--transition-fast);
          opacity: 0.6;
        }

        .btn-maison-more:hover {
          opacity: 1;
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

        .featured-card {
          display: flex;
          flex-direction: column;
        }

        .featured-img-wrapper {
          position: relative;
          overflow: hidden;
          aspect-ratio: 3/4;
          display: block;
          background-color: var(--color-ivory);
          padding: 8px;
        }

        .featured-img-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
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
          transition: var(--transition-fast);
          text-decoration: none;
        }

        .btn-featured-all:hover {
          background-color: var(--color-black);
          color: var(--color-white);
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
        .collections-section {
          background-color: var(--color-white);
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

        @media (max-width: 768px) {
          .hero-section {
            height: 100vh;
            min-height: 650px;
          }

          .hero-content {
            padding: 0 20px;
            max-width: 100%;
            text-align: center;
          }

          .hero-tagline {
            font-size: 0.7rem;
            letter-spacing: 0.3em;
            margin-bottom: 15px;
            text-align: center;
          }

          .hero-title {
            font-size: 2.8rem;
            letter-spacing: 0.05em;
            margin-bottom: 18px;
            line-height: 1.15;
            text-align: center;
          }

          .hero-slogan {
            font-size: 0.9rem;
            letter-spacing: 0.12em;
            margin-bottom: 28px;
            text-align: center;
            max-width: 85%;
          }

          .hero-btn {
            padding: 14px 32px;
            font-size: 0.75rem;
          }

          .hero-dots {
            bottom: 90px;
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
        }

        @media (max-width: 480px) {
          .hero-section {
            min-height: 550px;
          }

          .hero-content {
            padding: 0 15px;
          }

          .hero-title {
            font-size: 2rem;
            letter-spacing: 0.04em;
            margin-bottom: 15px;
            line-height: 1.1;
          }

          .hero-tagline {
            font-size: 0.6rem;
            letter-spacing: 0.25em;
            margin-bottom: 12px;
          }

          .hero-slogan {
            font-size: 0.8rem;
            letter-spacing: 0.1em;
            margin-bottom: 22px;
            max-width: 90%;
          }

          .hero-btn {
            padding: 12px 28px;
            font-size: 0.7rem;
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

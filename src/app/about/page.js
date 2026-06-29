'use client';
import React from 'react';
import { useTranslation } from '../../context/LanguageContext';

export default function About() {
  const { t } = useTranslation();
  return (
    <div className="about-wrapper">
      <section className="about-hero section-padding">
        <div className="container">
          <span className="section-subtitle">{t('about.title')}</span>
          <h1 className="section-title">{t('about.hero')}</h1>
          <p className="about-intro">{t('about.heroDesc')}</p>
        </div>
      </section>

      <section className="about-content section-padding">
        <div className="container">
          <div className="about-grid">
            <div className="about-block">
              <h3>{t('about.heritage')}</h3>
              <p>{t('about.heritageDesc')}</p>
            </div>
            <div className="about-block">
              <h3>{t('about.metiers')}</h3>
              <p>{t('about.metiersDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-engagement section-padding">
        <div className="container">
          <div className="engagement-content">
            <span className="section-subtitle">{t('about.metiers')}</span>
            <h2 className="engagement-title">{t('about.engagement')}</h2>
            <p className="engagement-desc">{t('about.engagementDesc')}</p>
          </div>
        </div>
      </section>

      <style jsx>{`
        .about-wrapper {
          background-color: var(--color-ivory);
          padding-top: 100px;
        }

        .about-hero {
          text-align: center;
          background-color: var(--color-white);
          border-bottom: 1px solid var(--color-beige-light);
          padding-top: 150px;
        }

        .about-intro {
          font-size: 0.95rem;
          color: var(--color-gray-medium);
          max-width: 500px;
          margin: 20px auto 0 auto;
          line-height: 1.6;
        }

        .about-content {
          background-color: var(--color-white);
        }

        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
        }

        .about-block h3 {
          font-size: 1.6rem;
          color: var(--color-black);
          margin-bottom: 20px;
          font-family: var(--font-serif);
        }

        .about-block p {
          font-size: 0.95rem;
          color: var(--color-charcoal);
          margin-bottom: 20px;
          line-height: 1.8;
        }

        .about-engagement {
          background-color: var(--color-ivory);
          text-align: center;
        }

        .engagement-content {
          max-width: 700px;
          margin: 0 auto;
        }

        .engagement-title {
          font-size: 2.5rem;
          color: var(--color-black);
          margin-bottom: 30px;
          font-family: var(--font-serif);
        }

        .engagement-desc {
          font-size: 1rem;
          color: var(--color-charcoal);
          line-height: 1.9;
          max-width: 600px;
          margin: 0 auto;
        }

        @media (max-width: 992px) {
          .about-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }
      `}</style>
    </div>
  );
}

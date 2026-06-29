'use client';
import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';

const Instagram = ({ size = 24, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Facebook = ({ size = 24, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export default function Contact() {
  const { t } = useTranslation();

  return (
    <div className="contact-wrapper">
      {/* Hero */}
      <section className="contact-hero section-padding">
        <div className="container">
          <span className="section-subtitle">{t('contact.title')}</span>
          <h1 className="section-title">{t('contact.nousEcrire')}</h1>
          <p className="contact-intro">{t('contact.intro')}</p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="contact-content container">
        <div className="contact-grid-layout">
          {/* Coordinates Column */}
          <div className="coordinates-column">
            <h2>{t('contact.maisonParis')}</h2>
            <p className="coord-intro">{t('contact.coordIntro')}</p>

            <div className="coordinate-item">
              <Phone size={18} />
              <div>
                <h4>{t('contact.telephone')}</h4>
                <p>+33 (0)1 42 68 53 00</p>
              </div>
            </div>

            <div className="coordinate-item">
              <Mail size={18} />
              <div>
                <h4>{t('contact.relations')}</h4>
                <p>atelier@kellydress.com</p>
              </div>
            </div>

            <div className="social-links-row">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><Instagram size={20} /></a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><Facebook size={20} /></a>
            </div>
          </div>

          {/* Form Column */}
          <div className="form-column">
            <div className="luxury-contact-form disabled-form">
                <h3>{t('contact.envoyerMessage')}</h3>

                <div className="form-group">
                  <label className="form-label">{t('contact.nomComplet')}</label>
                  <input type="text" className="form-input" disabled />
                </div>

                <div className="form-row-split">
                  <div className="form-group flex-1">
                    <label className="form-label">{t('contact.email')}</label>
                    <input type="email" className="form-input" disabled />
                  </div>
                  <div className="form-group flex-1">
                    <label className="form-label">{t('contact.telephoneLabel')}</label>
                    <input type="tel" className="form-input" disabled />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{t('contact.dateMariage')}</label>
                  <input type="date" className="form-input" disabled />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('contact.message')}</label>
                  <textarea className="form-textarea" rows="5" disabled></textarea>
                </div>

                <button type="button" className="btn-gold btn-send-message disabled-btn" disabled>
                  Bientôt...
                </button>
              </div>
          </div>
        </div>
      </section>



      <style jsx>{`
        .contact-wrapper {
          background-color: var(--color-ivory);
          padding-top: 100px;
          min-height: 100vh;
        }

        .contact-hero {
          text-align: center;
          background-color: var(--color-white);
          border-bottom: 1px solid var(--color-beige-light);
          padding-top: 150px;
        }

        .contact-intro {
          font-size: 0.95rem;
          color: var(--color-gray-medium);
          max-width: 500px;
          margin: 20px auto 0 auto;
          line-height: 1.6;
        }

        /* Layout Grid */
        .contact-grid-layout {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 80px;
          margin: 80px 0;
          align-items: flex-start;
        }

        /* Coordinates Column */
        .coordinates-column h2 {
          font-size: 2.2rem;
          color: var(--color-black);
          margin-bottom: 20px;
        }

        .coord-intro {
          font-size: 0.95rem;
          color: var(--color-charcoal);
          line-height: 1.8;
          margin-bottom: 40px;
        }

        .coordinate-item {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
        }

        .coordinate-item svg {
          color: var(--color-gold);
          margin-top: 4px;
        }

        .coordinate-item h4 {
          font-family: var(--font-sans);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--color-gold);
          margin-bottom: 5px;
          font-weight: 500;
        }

        .coordinate-item p {
          font-size: 0.9rem;
          color: var(--color-black);
          line-height: 1.6;
        }

        .coordinate-item span {
          font-size: 0.75rem;
          color: var(--color-gray-medium);
          font-style: italic;
        }

        .social-links-row {
          display: flex;
          gap: 20px;
          margin-top: 40px;
        }

        .social-links-row a {
          color: var(--color-black);
          transition: var(--transition-fast);
        }

        .social-links-row a:hover {
          color: var(--color-gold);
        }

        /* Form Column */
        .form-column {
          background-color: var(--color-white);
          border: 1px solid var(--color-beige-dark);
          padding: 50px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.02);
        }

        .luxury-contact-form h3 {
          font-size: 1.6rem;
          margin-bottom: 35px;
          color: var(--color-black);
          border-bottom: 1px solid var(--color-beige-light);
          padding-bottom: 15px;
        }

        .form-row-split {
          display: flex;
          gap: 20px;
        }

        .flex-1 {
          flex: 1;
        }

        .disabled-form input,
        .disabled-form textarea {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .disabled-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 20px;
          opacity: 0.5;
          cursor: not-allowed;
          background-color: #888 !important;
          border-color: #888 !important;
        }

        .btn-send-message {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 20px;
        }

        /* Success box */
        .contact-success-box {
          text-align: center;
          padding: 40px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .success-icon-ring {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          border: 1px solid var(--color-gold);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-gold);
          margin-bottom: 25px;
        }

        .contact-success-box p {
          font-size: 0.9rem;
          color: var(--color-charcoal);
          margin-bottom: 15px;
          line-height: 1.8;
          max-width: 400px;
        }

        @media (max-width: 992px) {
          .contact-grid-layout {
            grid-template-columns: 1fr;
            gap: 50px;
          }
        }

        @media (max-width: 768px) {
          .form-column {
            padding: 30px 20px;
          }

          .form-row-split {
            flex-direction: column;
            gap: 0;
          }

        }
      `}</style>
    </div>
  );
}

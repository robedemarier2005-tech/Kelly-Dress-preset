'use client';
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '../context/LanguageContext';

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
    aria-hidden="true"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Footer = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="footer-wrapper">
      <div className="container">
        <div className="footer-grid">
          {/* Column 1: Newsletter */}
          <div className="footer-col newsletter-col">
            <h3>{t('footer.newsletter')}</h3>
            <p>{t('footer.newsletterDesc')}</p>
            {subscribed ? (
              <div className="subscription-success">
                <span>{t('footer.newsletterSucces')}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="footer-form" aria-label={t('footer.newsletter')}>
                <input 
                  type="email" 
                  placeholder={t('footer.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-label={t('footer.emailPlaceholder')}
                />
                <button type="submit" aria-label={t('footer.sinscrire')}>
                  <ArrowRight size={18} />
                </button>
              </form>
            )}
          </div>

          {/* Column 2: Navigation Links */}
          <div className="footer-col links-col">
            <h3>{t('footer.navigation')}</h3>
            <ul>
              <li><Link href="/">{t('nav.maison')}</Link></li>
              <li><Link href="/catalog">{t('nav.catalogue')}</Link></li>
              <li><Link href="/about">{t('nav.aPropos')}</Link></li>
              <li><Link href="/contact">{t('nav.contact')}</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact/Hours */}
          <div className="footer-col address-col">
            <h3>{t('footer.maisonParis')}</h3>

            <p className="contact-details">
              {t('footer.email')}<br />
              {t('footer.telephone')}
            </p>

          </div>

          {/* Column 4: Instagram Coming Soon */}
          <div className="footer-col instagram-col">
            <h3>Instagram</h3>
            <p className="instagram-coming-soon">On ouvrira bientôt un Instagram</p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <div className="footer-legal">
            <span className="copyright">© {new Date().getFullYear()} Kelly Dress. {t('footer.droits')}</span>
            <div className="legal-links">
              <Link href="/mentions">{t('footer.mentions')}</Link>
              <Link href="/cgu">{t('footer.cgu')}</Link>
              <Link href="/confidentialite">{t('footer.confidentialite')}</Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .footer-wrapper {
          background-color: var(--color-black);
          color: var(--color-white);
          padding: 100px 0 50px 0;
          border-top: 1px solid var(--color-charcoal);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1.2fr 1.3fr;
          gap: 60px;
          margin-bottom: 80px;
        }

        .footer-col h3 {
          font-family: var(--font-sans);
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: var(--color-gold);
          margin-bottom: 25px;
        }

        .footer-col p {
          font-size: 0.85rem;
          color: var(--color-gray-medium);
          line-height: 1.8;
          margin-bottom: 20px;
        }

        .newsletter-col p {
          max-width: 320px;
        }

        .footer-form {
          display: flex;
          border-bottom: 1px solid var(--color-charcoal);
          padding-bottom: 10px;
          max-width: 300px;
        }

        .footer-form input {
          background: transparent;
          border: none;
          color: var(--color-white);
          font-family: var(--font-sans);
          font-size: 0.8rem;
          letter-spacing: 0.15em;
          flex: 1;
          outline: none;
        }

        .footer-form input::placeholder {
          color: #555555;
        }

        .footer-form button {
          background: none;
          border: none;
          color: var(--color-gold);
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .footer-form button:hover {
          color: var(--color-white);
          transform: translateX(3px);
        }

        .subscription-success {
          font-size: 0.8rem;
          color: var(--color-gold);
          letter-spacing: 0.1em;
        }

        .links-col ul {
          list-style: none;
        }

        .links-col li {
          margin-bottom: 12px;
        }

        .links-col button {
          background: none;
          border: none;
          color: var(--color-gray-medium);
          font-size: 0.85rem;
          cursor: pointer;
          padding: 0;
          transition: var(--transition-fast);
        }

        .links-col button:hover {
          color: var(--color-gold);
          transform: translateX(3px);
        }

        .address-col .contact-details {
          color: var(--color-white);
          margin-top: 15px;
        }

        .address-col .hours {
          font-size: 0.75rem;
          color: var(--color-gold);
        }

        .instagram-coming-soon {
          font-size: 0.85rem;
          color: var(--color-gray-medium);
          line-height: 1.6;
          font-style: italic;
        }

        .instagram-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-bottom: 15px;
        }

        .insta-item {
          position: relative;
          aspect-ratio: 1;
          overflow: hidden;
          display: block;
        }

        .insta-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--transition-slow);
        }

        .insta-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-white);
          opacity: 0;
          transition: var(--transition-fast);
        }

        .insta-item:hover img {
          transform: scale(1.1);
        }

        .insta-item:hover .insta-overlay {
          opacity: 1;
        }

        .insta-link-text {
          font-size: 0.75rem;
          color: var(--color-gold);
          text-transform: lowercase;
          letter-spacing: 0.15em;
        }

        .insta-link-text:hover {
          color: var(--color-white);
        }

        /* Footer Bottom */
        .footer-bottom {
          border-top: 1px solid var(--color-charcoal);
          padding-top: 50px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 40px;
        }

        .footer-legal {
          width: 100%;
          display: flex;
          justify-content: space-between;
          font-size: 0.7rem;
          color: #555555;
          letter-spacing: 0.1em;
        }

        .legal-links {
          display: flex;
          gap: 30px;
        }

        .legal-links a:hover {
          color: var(--color-gold);
        }

        @media (max-width: 992px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 40px;
          }
        }

        @media (max-width: 576px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .footer-legal {
            flex-direction: column;
            align-items: center;
            gap: 20px;
            text-align: center;
          }

          .legal-links {
            flex-direction: column;
            gap: 10px;
            align-items: center;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;

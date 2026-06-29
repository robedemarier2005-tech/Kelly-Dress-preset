'use client';
import React from 'react';
import Link from 'next/link';
import { Heart, ArrowRight, Trash2 } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useTranslation } from '../../context/LanguageContext';

export default function Wishlist() {
  const { t } = useTranslation();
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <div className="wishlist-page-wrapper">
      {/* Hero */}
      <section className="wishlist-hero section-padding">
        <div className="container">
          <span className="section-subtitle">{t('wishlist.title')}</span>
          <h1 className="section-title">{t('wishlist.title')}</h1>
          <p className="wishlist-intro">{t('wishlist.emptyDesc')}</p>
        </div>
      </section>

      {/* Grid */}
      <section className="wishlist-content container">
        {wishlist.length > 0 ? (
          <div className="wishlist-grid">
            {wishlist.map(dress => (
              <Link 
                href={`/catalog/${dress.id}`}
                key={dress.id} 
                className="wishlist-card"
              >
                <div className="wishlist-img-frame">
                  <img src={dress.image} alt={dress.name} />
                  <button 
                    className="btn-remove-wishlist"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent navigating to detail
                      e.stopPropagation();
                      removeFromWishlist(dress.id);
                    }}
                    aria-label={t('wishlist.retirer')}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="wishlist-card-details">
                  <h3>{dress.name}</h3>
                  <span className="wishlist-col">{dress.collection}</span>
                  <div className="wishlist-card-footer">
                    <span className="wishlist-price">{dress.price} €</span>
                    <span className="wishlist-browse-link">
                      {t('wishlist.decouvrir')} <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-wishlist-view">
            <Heart size={48} className="heart-empty-icon" />
            <h2>{t('wishlist.empty')}</h2>
            <p>{t('wishlist.emptyDesc')}</p>
            <Link href="/catalog" className="btn-gold">
              {t('wishlist.decouvrir')}
            </Link>
          </div>
        )}
      </section>

      <style jsx>{`
        .wishlist-page-wrapper {
          background-color: var(--color-ivory);
          padding-top: 100px;
          min-height: 100vh;
        }

        .wishlist-hero {
          text-align: center;
          background-color: var(--color-white);
          border-bottom: 1px solid var(--color-beige-light);
          padding-top: 150px;
        }

        .wishlist-intro {
          font-size: 0.95rem;
          color: var(--color-gray-medium);
          max-width: 500px;
          margin: 20px auto 0 auto;
          line-height: 1.6;
        }

        .wishlist-content {
          margin-top: 80px;
          margin-bottom: 120px;
        }

        .wishlist-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
        }

        :global(.wishlist-card) {
          background-color: var(--color-white);
          border: 1px solid var(--color-beige-light);
          cursor: pointer;
          transition: var(--transition-medium);
          display: block;
        }

        :global(.wishlist-card:hover) {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.02);
        }

        .wishlist-img-frame {
          aspect-ratio: 3/4;
          overflow: hidden;
          position: relative;
          background-color: var(--color-beige-light);
        }

        .wishlist-img-frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 1.2s ease;
        }

        :global(.wishlist-card:hover) .wishlist-img-frame img {
          transform: scale(1.03);
        }

        .btn-remove-wishlist {
          position: absolute;
          top: 15px;
          right: 15px;
          background-color: rgba(255, 255, 255, 0.9);
          border: none;
          border-radius: 50%;
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #cc0000;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          transition: var(--transition-fast);
          z-index: 5;
        }

        .btn-remove-wishlist:hover {
          transform: scale(1.08);
          background-color: #cc0000;
          color: var(--color-white);
        }

        .wishlist-card-details {
          padding: 25px;
        }

        .wishlist-card-details h3 {
          font-size: 1.4rem;
          color: var(--color-black);
          margin-bottom: 5px;
        }

        .wishlist-col {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--color-gold);
          display: block;
          margin-bottom: 20px;
        }

        .wishlist-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--color-beige-light);
          padding-top: 15px;
        }

        .wishlist-price {
          font-size: 0.95rem;
          color: var(--color-black);
          font-weight: 400;
        }

        .wishlist-browse-link {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-black);
          display: flex;
          align-items: center;
          gap: 6px;
          transition: var(--transition-fast);
        }

        :global(.wishlist-card:hover) .wishlist-browse-link {
          color: var(--color-gold);
        }

        /* Empty state */
        .empty-wishlist-view {
          text-align: center;
          padding: 80px 0;
        }

        .heart-empty-icon {
          color: var(--color-gold);
          margin-bottom: 25px;
          opacity: 0.5;
        }

        .empty-wishlist-view h2 {
          font-size: 2rem;
          margin-bottom: 15px;
          color: var(--color-black);
        }

        .empty-wishlist-view p {
          font-size: 0.95rem;
          color: var(--color-gray-medium);
          margin-bottom: 35px;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.6;
        }

        @media (max-width: 992px) {
          .wishlist-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 30px;
          }
        }

        @media (max-width: 576px) {
          .wishlist-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

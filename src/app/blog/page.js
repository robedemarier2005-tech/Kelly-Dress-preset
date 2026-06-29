'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { blogArticles } from '../../data/blog';
import { useTranslation } from '../../context/LanguageContext';

export default function Blog() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Défilés', 'Évènements', 'Nouveautés'];

  const filteredArticles = activeCategory === 'All'
    ? blogArticles
    : blogArticles.filter(art => art.category === activeCategory);

  return (
    <div className="blog-wrapper">
      {/* Hero */}
      <section className="blog-hero section-padding">
        <div className="container">
          <span className="section-subtitle">{t('blog.title')}</span>
          <h1 className="section-title">{t('blog.title')} & Défilés</h1>
          <p className="blog-intro">{t('blog.intro')}</p>
        </div>
      </section>

      {/* Category Tabs */}
      <div className="container blog-categories-bar">
        {categories.map(cat => (
          <button 
            key={cat} 
            className={`blog-cat-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <section className="blog-grid-section container">
        <div className="blog-grid">
          {filteredArticles.map(art => (
            <Link 
              href={`/blog/${art.id}`}
              key={art.id} 
              className="blog-card"
            >
              <div className="blog-card-img">
                <img src={art.image} alt={art.title} />
                <span className="blog-card-category">{art.category}</span>
              </div>
              <div className="blog-card-details">
                <div className="blog-card-meta">
                  <span>{art.date}</span>
                  <span className="bullet">•</span>
                  <span>{art.readTime}</span>
                </div>
                <h3>{art.title}</h3>
                <p>{art.excerpt}</p>
                <span className="blog-card-link">
                  {t('blog.lireAussi')} <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <style jsx>{`
        .blog-wrapper {
          background-color: var(--color-ivory);
          padding-top: 100px;
          min-height: 100vh;
        }

        .blog-hero {
          text-align: center;
          background-color: var(--color-white);
          border-bottom: 1px solid var(--color-beige-light);
          padding-top: 150px;
        }

        .blog-intro {
          font-size: 0.95rem;
          color: var(--color-gray-medium);
          max-width: 500px;
          margin: 20px auto 0 auto;
          line-height: 1.6;
        }

        .blog-categories-bar {
          display: flex;
          justify-content: center;
          gap: 30px;
          margin-top: 50px;
          margin-bottom: 60px;
          border-bottom: 1px solid var(--color-beige-dark);
          padding-bottom: 20px;
        }

        .blog-cat-btn {
          background: none;
          border: none;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--color-gray-medium);
          cursor: pointer;
          position: relative;
          padding-bottom: 5px;
          transition: var(--transition-fast);
        }

        .blog-cat-btn:hover {
          color: var(--color-black);
        }

        .blog-cat-btn.active {
          color: var(--color-gold);
          font-weight: 500;
        }

        .blog-cat-btn.active::after {
          content: '';
          position: absolute;
          bottom: -21px;
          left: 0;
          width: 100%;
          height: 1px;
          background-color: var(--color-gold);
        }

        /* Grid */
        .blog-grid-section {
          margin-bottom: 120px;
        }

        .blog-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
        }

        :global(.blog-card) {
          background-color: var(--color-white);
          border: 1px solid var(--color-beige-light);
          cursor: pointer;
          transition: var(--transition-medium);
          display: block;
        }

        :global(.blog-card:hover) {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.03);
        }

        .blog-card-img {
          position: relative;
          aspect-ratio: 16/11;
          overflow: hidden;
        }

        .blog-card-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 1.2s ease;
        }

        :global(.blog-card:hover) .blog-card-img img {
          transform: scale(1.05);
        }

        .blog-card-category {
          position: absolute;
          top: 15px;
          left: 15px;
          background-color: var(--color-white-overlay);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          padding: 6px 14px;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--color-gold);
        }

        .blog-card-details {
          padding: 30px;
        }

        .blog-card-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.75rem;
          color: var(--color-gray-medium);
          margin-bottom: 15px;
        }

        .blog-card-details h3 {
          font-size: 1.4rem;
          line-height: 1.4;
          color: var(--color-black);
          margin-bottom: 15px;
          height: 80px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .blog-card-details p {
          font-size: 0.85rem;
          color: var(--color-charcoal);
          line-height: 1.6;
          margin-bottom: 25px;
          height: 80px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }

        .blog-card-link {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--color-black);
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          transition: var(--transition-fast);
        }

        :global(.blog-card:hover) .blog-card-link {
          color: var(--color-gold);
        }

        @media (max-width: 1024px) {
          .blog-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .blog-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }
        }
      `}</style>
    </div>
  );
}

'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, X } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export default function BlogDetailClient({ article }) {
  const { t } = useTranslation();
  const [activeImage, setActiveImage] = useState(article.image);

  const allImages = [article.image, ...(article.gallery || [])];

  return (
    <div className="blog-article-detail-wrapper section-padding">
      <div className="container">
        <Link href="/blog" className="btn-back" aria-label={t('blog.retour')}>
          <ArrowLeft size={16} /> <span>{t('blog.retour')}</span>
        </Link>

        <article className="full-article">
          <span className="article-category">{article.category}</span>
          <h1 className="article-title">{article.title}</h1>
          
          <div className="article-meta">
            <div className="meta-item">
              <Calendar size={14} /> <span>{article.date}</span>
            </div>
            <div className="meta-item">
              <Clock size={14} /> <span>{article.readTime}</span>
            </div>
          </div>

          {/* Main Image */}
          <div className="article-img-frame">
            <img src={activeImage} alt={article.title} />
          </div>

          {/* Image Gallery Thumbnails */}
          {allImages.length > 1 && (
            <div className="article-gallery">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  className={`gallery-thumb ${activeImage === img ? 'active' : ''}`}
                  onClick={() => setActiveImage(img)}
                >
                  <img src={img} alt={`${article.title} - Image ${i + 1}`} />
                </button>
              ))}
            </div>
          )}

          <div className="article-body">
            {article.content.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </article>
      </div>

      <style jsx>{`
        .blog-article-detail-wrapper {
          padding-top: 150px;
          background-color: var(--color-ivory);
          min-height: 100vh;
        }

        :global(.btn-back) {
          background: none;
          border: none;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          cursor: pointer;
          margin-bottom: 50px;
          color: var(--color-black);
          transition: var(--transition-fast);
        }

        :global(.btn-back:hover) {
          color: var(--color-gold);
          transform: translateX(-5px);
        }

        .full-article {
          max-width: 800px;
          margin: 0 auto;
        }

        .article-category {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: var(--color-gold);
          display: block;
          margin-bottom: 15px;
          text-align: center;
        }

        .article-title {
          font-size: 3rem;
          text-align: center;
          line-height: 1.3;
          margin-bottom: 25px;
          color: var(--color-black);
        }

        .article-meta {
          display: flex;
          justify-content: center;
          gap: 30px;
          font-size: 0.8rem;
          color: var(--color-gray-medium);
          margin-bottom: 50px;
          border-bottom: 1px solid var(--color-beige-dark);
          border-top: 1px solid var(--color-beige-dark);
          padding: 15px 0;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .article-img-frame {
          aspect-ratio: 16/9;
          overflow: hidden;
          margin-bottom: 20px;
          border: 1px solid var(--color-beige-light);
        }

        .article-img-frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .article-gallery {
          display: flex;
          gap: 12px;
          margin-bottom: 50px;
          overflow-x: auto;
          padding-bottom: 10px;
        }

        .gallery-thumb {
          flex: 0 0 120px;
          aspect-ratio: 3/4;
          border: 2px solid transparent;
          overflow: hidden;
          cursor: pointer;
          padding: 0;
          background: none;
          transition: var(--transition-fast);
        }

        .gallery-thumb.active {
          border-color: var(--color-gold);
        }

        .gallery-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .article-body p {
          font-size: 1rem;
          color: var(--color-charcoal);
          line-height: 1.9;
          margin-bottom: 30px;
          text-align: justify;
          white-space: pre-line;
        }

        @media (max-width: 768px) {
          .article-title {
            font-size: 2.2rem;
          }
        }
      `}</style>
    </div>
  );
}
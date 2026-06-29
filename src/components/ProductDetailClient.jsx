'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ZoomIn, ShoppingBag, Mail, FileText, ChevronRight, X, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export default function ProductDetailClient({ dress, similarDresses }) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const allImages = dress.gallery || [dress.image, dress.alternateImage].filter(Boolean);
  const [activeImage, setActiveImage] = useState(allImages[0]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [quoteDetails, setQuoteDetails] = useState({ name: '', email: '', message: '' });

  // Sync active image when dress details change
  useEffect(() => {
    setActiveImage(allImages[0]);
  }, [dress]);

  const toggleWishlist = () => {
    if (isInWishlist(dress.id)) {
      removeFromWishlist(dress.id);
    } else {
      addToWishlist(dress);
    }
  };

  const handleQuoteSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => {
      setQuoteSubmitted(true);
    }, 400);
  };

  const closeQuoteModal = () => {
    setShowQuoteForm(false);
    setQuoteSubmitted(false);
    setQuoteDetails({ name: '', email: '', message: '' });
  };

  return (
    <div className="product-detail-wrapper">
      {/* Breadcrumb */}
      <div className="container">
        <nav className="breadcrumb">
          <Link href="/">Maison</Link>
          <ChevronRight size={12} />
          <Link href="/catalog">Catalogue</Link>
          <ChevronRight size={12} />
          <span className="current-crumb">{dress.name}</span>
        </nav>
      </div>

      {/* Main Details Grid */}
      <section className="product-main container">
        {/* Gallery Column */}
        <div className="product-gallery">
          {/* Thumbnails */}
          <div className="gallery-thumbnails">
            {allImages.map((img, i) => (
              <button 
                key={i}
                className={`thumb-btn ${activeImage === img ? 'active' : ''}`}
                onClick={() => setActiveImage(img)}
              >
                <img src={img} alt={`${dress.name} - ${i + 1}`} />
              </button>
            ))}
          </div>

          {/* Large Image Frame */}
          <div className="gallery-main-frame" onClick={() => setIsZoomOpen(true)}>
            <img src={activeImage} alt={dress.name} className="gallery-main-image" />
            <button className="btn-zoom-trigger" onClick={(e) => {
              e.stopPropagation();
              setIsZoomOpen(true);
            }}>
              <ZoomIn size={18} />
            </button>
          </div>
        </div>

        {/* Info Column */}
        <div className="product-info-sidebar">
          <span className="info-collection">{dress.collection}</span>
          <h1 className="info-title">{dress.name}</h1>
          <span className="info-reference">Réf. {dress.reference}</span>
          
          <div className="info-price">{dress.price} €</div>
          
          <p className="info-description">{dress.description}</p>

          <div className="info-divider"></div>

          {/* Details Lists */}
          <div className="detail-lists">
            <div className="info-row">
              <span className="row-label">Matières Nobles</span>
              <span className="row-value">{dress.materials.join(', ')}</span>
            </div>
            <div className="info-row">
              <span className="row-label">Nuances Disponibles</span>
              <span className="row-value">{dress.colors.join(', ')}</span>
            </div>
            <div className="info-row">
              <span className="row-label font-gold">Conseil Silhouette</span>
              <span className="row-value">{dress.silhouette}</span>
            </div>
          </div>

          <div className="info-divider"></div>

          {/* Size Info / Guide */}
          <div className="size-guide-section">
            <h4>Choisissez votre taille</h4>
            <div className="sizes-available">
              {dress.sizes.map(size => (
                <button
                  key={size}
                  className={`size-bubble ${selectedSize === size ? 'selected' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
            <p className="size-note">
              *Toutes nos créations finales sont entièrement retravaillées à vos mesures exactes au sein de notre atelier.
            </p>
          </div>

          {/* CTA Action Buttons */}
          <div className="action-buttons-group">
            <button
              className={`btn-gold w-full action-btn ${!selectedSize ? 'disabled' : ''}`}
              onClick={() => { if (selectedSize) { addToCart(dress, selectedSize); } }}
              disabled={!selectedSize}
            >
              <ShoppingBag size={16} /> <span>{selectedSize ? 'Ajouter au Panier' : 'Sélectionnez une taille'}</span>
            </button>
            
            <div className="action-row-split">
              <button className="btn-outline action-btn flex-1" onClick={() => setShowQuoteForm(true)}>
                <FileText size={16} /> <span>Demander un devis</span>
              </button>
              
              <button 
                className={`btn-outline action-btn wishlist-toggle-btn ${isInWishlist(dress.id) ? 'active' : ''}`}
                onClick={toggleWishlist}
                aria-label="Favoris"
              >
                <Heart size={16} className={isInWishlist(dress.id) ? 'filled' : ''} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Dresses Carousel / Grid */}
      <section className="similar-section section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Pour Continuer</span>
            <h2 className="section-title">Robes Similaires</h2>
          </div>

          <div className="similar-grid">
            {similarDresses.map(d => (
              <Link 
                href={`/catalog/${d.id}`}
                key={d.id} 
                className="similar-card"
              >
                <div className="similar-img-wrapper">
                  <img src={d.image} alt={d.name} />
                </div>
                <h3>{d.name}</h3>
                <span className="similar-collection">{d.collection}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* High-Resolution Zoom Overlay Slider */}
      {isZoomOpen && (
        <div className="zoom-overlay" onClick={() => setIsZoomOpen(false)}>
          <button className="zoom-close" onClick={() => setIsZoomOpen(false)}>
            <X size={24} />
          </button>
          <button className="zoom-nav-btn zoom-nav-prev" onClick={(e) => {
            e.stopPropagation();
            const currentIndex = allImages.indexOf(activeImage);
            const prevIndex = currentIndex === 0 ? allImages.length - 1 : currentIndex - 1;
            setActiveImage(allImages[prevIndex]);
          }}>
            <ChevronLeft size={32} />
          </button>
          <button className="zoom-nav-btn zoom-nav-next" onClick={(e) => {
            e.stopPropagation();
            const currentIndex = allImages.indexOf(activeImage);
            const nextIndex = currentIndex === allImages.length - 1 ? 0 : currentIndex + 1;
            setActiveImage(allImages[nextIndex]);
          }}>
            <ChevronRightIcon size={32} />
          </button>
          <div className="zoom-image-container" onClick={(e) => e.stopPropagation()}>
            <img src={activeImage} alt={`${dress.name} Zoom`} />
          </div>
          <div className="zoom-thumbnails">
            {allImages.map((img, i) => (
              <button 
                key={i}
                className={`zoom-thumb ${activeImage === img ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImage(img);
                }}
              >
                <img src={img} alt={`${dress.name} - ${i + 1}`} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quote Request Modal */}
      {showQuoteForm && (
        <div className="modal-overlay">
          <div className="modal-content quote-modal-content">
            <button className="modal-close" onClick={closeQuoteModal}>
              <X size={20} />
            </button>
            
            {!quoteSubmitted ? (
              <div className="modal-body">
                <span className="modal-subtitle">Devis Personnalisé</span>
                <h2>Demande d'information pour la robe {dress.name}</h2>
                <p className="modal-intro">Réf. {dress.reference} — Notre service relation clientèle vous répondra sous 24h avec une estimation personnalisée.</p>
                
                <form onSubmit={handleQuoteSubmit} className="booking-form">
                  <div className="form-group">
                    <label className="form-label">Votre Nom</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      required 
                      value={quoteDetails.name}
                      onChange={(e) => setQuoteDetails({...quoteDetails, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Votre Adresse E-mail</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      required 
                      value={quoteDetails.email}
                      onChange={(e) => setQuoteDetails({...quoteDetails, email: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Votre Message / Précisions (Date mariage, modifications éventuelles...)</label>
                    <textarea 
                      className="form-textarea" 
                      rows="4" 
                      value={quoteDetails.message}
                      onChange={(e) => setQuoteDetails({...quoteDetails, message: e.target.value})}
                      placeholder="Souhaitez-vous personnaliser le décolleté ? Ajuster la longueur de la traîne ? Faites-nous part de vos désirs..."
                    ></textarea>
                  </div>

                  <button type="submit" className="btn-gold w-full">
                    Envoyer la Demande de Devis
                  </button>
                </form>
              </div>
            ) : (
              <div className="booking-success-view">
                <div className="success-icon-wrapper">
                  <Mail size={40} className="check-icon" />
                </div>
                <h2>Demande Envoyée</h2>
                <p>Nous vous remercions, <strong>{quoteDetails.name}</strong>. Votre demande de devis pour le modèle <strong>{dress.name}</strong> est bien transmise.</p>
                <p>Notre concierge haute couture va étudier votre projet avec le chef d'atelier et vous recontacter par e-mail dans les plus brefs délais.</p>
                <button onClick={closeQuoteModal} className="btn-gold" style={{ marginTop: '20px' }}>
                  Fermer la Fenêtre
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .product-detail-wrapper {
          padding-top: 130px;
          background-color: var(--color-ivory);
        }

        /* Breadcrumb */
        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--color-gray-medium);
          margin-bottom: 50px;
        }

        .breadcrumb a {
          color: var(--color-gray-medium);
          transition: var(--transition-fast);
        }

        .breadcrumb a:hover {
          color: var(--color-black);
        }

        .current-crumb {
          color: var(--color-gold);
          font-weight: 400;
        }

        /* Layout Grid */
        .product-main {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 80px;
          align-items: flex-start;
          margin-bottom: 120px;
        }

        /* Gallery Column */
        .product-gallery {
          display: flex;
          gap: 25px;
        }

        .gallery-thumbnails {
          display: flex;
          flex-direction: column;
          gap: 15px;
          width: 90px;
        }

        .thumb-btn {
          width: 80px;
          background: none;
          border: 1px solid var(--color-beige-dark);
          padding: 0;
          cursor: pointer;
          overflow: hidden;
          transition: var(--transition-fast);
        }

        .thumb-btn img {
          width: 100%;
          height: auto;
          display: block;
        }

        .thumb-btn.active {
          border-color: var(--color-gold);
        }

        .gallery-main-frame {
          flex: 1;
          position: relative;
          background-color: var(--color-white);
          border: 1px solid var(--color-beige-light);
          cursor: zoom-in;
        }

        .gallery-main-frame:hover .btn-zoom-trigger {
          opacity: 1;
        }

        .gallery-main-image {
          width: 100%;
          height: auto;
          display: block;
        }

        .btn-zoom-trigger {
          position: absolute;
          bottom: 20px;
          right: 20px;
          background-color: rgba(255, 255, 255, 0.9);
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--color-black);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
          transition: var(--transition-fast);
          opacity: 0;
        }

        .btn-zoom-trigger:hover {
          background-color: var(--color-black);
          color: var(--color-white);
        }

        /* Info Column */
        .product-info-sidebar {
          padding-top: 10px;
        }

        .info-collection {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: var(--color-gold);
          display: block;
          margin-bottom: 15px;
        }

        .info-title {
          font-size: 3.5rem;
          color: var(--color-black);
          margin-bottom: 5px;
        }

        .info-reference {
          font-size: 0.75rem;
          color: var(--color-gray-medium);
          letter-spacing: 0.1em;
          display: block;
          margin-bottom: 25px;
        }

        .info-price {
          font-size: 1.8rem;
          color: var(--color-black);
          margin-bottom: 35px;
          font-weight: 300;
        }

        .info-description {
          font-size: 0.95rem;
          color: var(--color-charcoal);
          line-height: 1.8;
          margin-bottom: 40px;
        }

        .info-divider {
          height: 1px;
          background-color: var(--color-beige-dark);
          margin: 35px 0;
        }

        .detail-lists {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
        }

        .row-label {
          color: var(--color-gray-medium);
          font-weight: 400;
        }

        .row-label.font-gold {
          color: var(--color-gold);
        }

        .row-value {
          color: var(--color-black);
          text-align: right;
          max-width: 60%;
        }

        /* Sizes Guide */
        .size-guide-section h4 {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--color-black);
          margin-bottom: 15px;
        }

        .sizes-available {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
        }

        .size-bubble {
          border: 1px solid var(--color-beige-dark);
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          color: var(--color-black);
          background: none;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .size-bubble:hover {
          border-color: var(--color-gold);
        }

        .size-bubble.selected {
          border-color: var(--color-black);
          background-color: var(--color-black);
          color: var(--color-white);
        }

        .action-btn.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .size-note {
          font-size: 0.7rem;
          color: var(--color-gray-medium);
          font-style: italic;
        }

        /* CTAs */
        .action-buttons-group {
          margin-top: 45px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-size: 0.8rem;
          font-weight: 400;
        }

        .action-row-split {
          display: flex;
          gap: 15px;
        }

        .flex-1 {
          flex: 1;
        }

        .wishlist-toggle-btn {
          flex: 0 0 50px;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .wishlist-toggle-btn.active {
          border-color: var(--color-gold);
        }

        .wishlist-toggle-btn.active :global(svg) {
          fill: var(--color-gold);
          color: var(--color-gold);
        }

        /* Similar Dresses */
        .similar-section {
          background-color: var(--color-white);
          border-top: 1px solid var(--color-beige-light);
        }

        .similar-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
        }

        .similar-card {
          text-align: center;
          cursor: pointer;
          display: block;
        }

        .similar-img-wrapper {
          aspect-ratio: 3/4;
          overflow: hidden;
          margin-bottom: 20px;
        }

        .similar-img-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 1.2s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .similar-card:hover .similar-img-wrapper img {
          transform: scale(1.05);
        }

        .similar-card h3 {
          font-size: 1.4rem;
          color: var(--color-black);
          margin-bottom: 5px;
        }

        .similar-collection {
          font-size: 0.75rem;
          color: var(--color-gray-medium);
          text-transform: uppercase;
          letter-spacing: 0.15em;
        }

        /* Zoom Overlay */
        .zoom-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(255, 255, 255, 0.98);
          z-index: 4000;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: zoom-out;
        }

        .zoom-close {
          position: absolute;
          top: 30px;
          right: 30px;
          background: none;
          border: none;
          color: var(--color-black);
          cursor: pointer;
        }

        .zoom-image-container {
          max-width: 90%;
          max-height: 90%;
        }

        .zoom-image-container img {
          max-width: 100%;
          max-height: 90vh;
          object-fit: contain;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
        }

        .zoom-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background-color: rgba(255, 255, 255, 0.9);
          border: none;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--color-black);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transition: var(--transition-fast);
          z-index: 10;
        }

        .zoom-nav-btn:hover {
          background-color: var(--color-black);
          color: var(--color-white);
        }

        .zoom-nav-prev {
          left: 30px;
        }

        .zoom-nav-next {
          right: 30px;
        }

        .zoom-thumbnails {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 10px;
          z-index: 10;
        }

        .zoom-thumb {
          width: 60px;
          height: 60px;
          border: 2px solid transparent;
          border-radius: 4px;
          overflow: hidden;
          cursor: pointer;
          transition: var(--transition-fast);
          background: none;
          padding: 0;
        }

        .zoom-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .zoom-thumb.active {
          border-color: var(--color-gold);
        }

        .zoom-thumb:hover {
          border-color: var(--color-black);
        }

        .quote-modal-content {
          max-width: 550px;
        }

        @media (max-width: 1024px) {
          .product-main {
            grid-template-columns: 1fr;
            gap: 50px;
          }
        }

        @media (max-width: 768px) {
          .product-gallery {
            flex-direction: column-reverse;
          }
          
          .gallery-thumbnails {
            flex-direction: row;
            width: 100%;
          }

          .thumb-btn {
            width: 70px;
          }

          .info-title {
            font-size: 2.8rem;
          }

          .similar-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }
        }
      `}</style>
    </div>
  );
}

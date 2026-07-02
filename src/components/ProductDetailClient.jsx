'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ZoomIn, ShoppingBag, Mail, FileText, ChevronRight, X, ChevronLeft, ChevronRight as ChevronRightIcon, Scissors, Truck, Ruler, Shield, Star, Share2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { getOverrideDescription, getOverrideName, getOverrideMaterials, getOverrideMaterialsTable, getOverrideStory } from '../data/productOverrides';

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
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Use override description if available, otherwise use original
  const displayDescription = getOverrideDescription(dress.reference) || dress.description;

  // Use override name if available, otherwise use original
  const displayName = getOverrideName(dress.reference) || dress.name;

  // Use override materials if available
  const displayMaterials = getOverrideMaterials(dress.reference);

  // Use override materials table if available
  const displayMaterialsTable = getOverrideMaterialsTable(dress.reference);

  // Use override story if available
  const displayStory = getOverrideStory(dress.reference);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Swipe support for mobile gallery
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    if (Math.abs(diff) > 50) {
      const currentIndex = allImages.indexOf(activeImage);
      if (diff > 0) {
        // Swipe left - next image
        const nextIndex = currentIndex === allImages.length - 1 ? 0 : currentIndex + 1;
        setActiveImage(allImages[nextIndex]);
      } else {
        // Swipe right - previous image
        const prevIndex = currentIndex === 0 ? allImages.length - 1 : currentIndex - 1;
        setActiveImage(allImages[prevIndex]);
      }
    }
    setTouchStart(null);
  };

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

  // Parse description to extract FAQ items
  const parseDescription = (desc) => {
    const lines = desc
      .replace(/<p[^>]*>/gi, '\n')
      .replace(/<\/p>/gi, '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line);

    const result = [];
    let inFaq = false;
    let currentFaq = null;

    lines.forEach((line, i) => {
      if (line === 'FAQ') {
        inFaq = true;
        result.push({ type: 'label', content: line });
        return;
      }

      if (inFaq) {
        if (line.endsWith('?')) {
          if (currentFaq) {
            result.push(currentFaq);
          }
          currentFaq = { type: 'faq', question: line, answer: '', index: result.length };
        } else if (currentFaq) {
          currentFaq.answer += (currentFaq.answer ? ' ' : '') + line;
        }
      } else {
        if (line.match(/^(Informations pratiques)/)) {
          result.push({ type: 'label', content: line });
        } else if (line.match(/^[🧵📏📦🚚🔒📞🤍]/)) {
          result.push({ type: 'icon', content: line });
        } else {
          result.push({ type: 'text', content: line });
        }
      }
    });

    if (currentFaq) {
      result.push(currentFaq);
    }

    return result;
  };

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: displayName,
          text: `Découvrez cette magnifique robe de mariée : ${displayName}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papiers !');
    }
  };

  // Handle keyboard navigation for zoom
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isZoomOpen) return;
      
      if (e.key === 'Escape') {
        setIsZoomOpen(false);
      } else if (e.key === 'ArrowLeft') {
        const currentIndex = allImages.indexOf(activeImage);
        const prevIndex = currentIndex === 0 ? allImages.length - 1 : currentIndex - 1;
        setActiveImage(allImages[prevIndex]);
      } else if (e.key === 'ArrowRight') {
        const currentIndex = allImages.indexOf(activeImage);
        const nextIndex = currentIndex === allImages.length - 1 ? 0 : currentIndex + 1;
        setActiveImage(allImages[nextIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomOpen, activeImage, allImages]);

  return (
    <div className="product-detail-wrapper">
      {/* Breadcrumb */}
      <div className="container">
        <nav className="breadcrumb">
          <Link href="/catalog">Catalogue</Link>
          <ChevronRight size={12} />
          <span className="current-crumb">{displayName}</span>
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
                <img src={img} alt={`${displayName} - ${i + 1}`} />
              </button>
            ))}
          </div>

          {/* Large Image Frame */}
          <div 
            className="gallery-main-frame" 
            onClick={() => setIsZoomOpen(true)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <img src={activeImage} alt={displayName} className="gallery-main-image" />
            <button className="btn-zoom-trigger" onClick={(e) => {
              e.stopPropagation();
              setIsZoomOpen(true);
            }}>
              <ZoomIn size={18} />
            </button>
            {/* Active Photo Indicator */}
            <div className="photo-indicator">
              {allImages.map((_, i) => (
                <span key={i} className={`indicator-dot ${i === allImages.indexOf(activeImage) ? 'active' : ''}`}></span>
              ))}
            </div>
          </div>
        </div>

        {/* Info Column */}
        <div className="product-info-sidebar">
          <span className="info-collection">{dress.collection}</span>
          <h1 className="info-title">{displayName}</h1>
          <span className="info-reference">Réf. {dress.reference}</span>
          
          <div className="info-price">{dress.price} €</div>
          
          {/* Short emotional text */}
          <p className="info-emotional">
            Une robe d'exception conçue pour sublimer votre jour unique. L'élégance à la française.
          </p>

          {/* 4 Key Benefits */}
          <div className="benefits-grid">
            <div className="benefit-item">
              <Scissors size={20} className="benefit-icon" />
              <span>Confection artisanale</span>
            </div>
            <div className="benefit-item">
              <Shield size={20} className="benefit-icon" />
              <span>Satin premium</span>
            </div>
            <div className="benefit-item">
              <Ruler size={20} className="benefit-icon" />
              <span>Sur mesure</span>
            </div>
            <div className="benefit-item">
              <Truck size={20} className="benefit-icon" />
              <span>Livraison offerte</span>
            </div>
          </div>

          {/* Size Selection */}
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
          </div>

          {/* Main CTA */}
          <div className="action-buttons-group">
            <button
              className={`btn-primary-cta ${!selectedSize ? 'disabled' : ''}`}
              onClick={() => { if (selectedSize) { addToCart(dress, selectedSize); } }}
              disabled={!selectedSize}
            >
              <ShoppingBag size={18} /> <span>{selectedSize ? 'Ajouter au Panier' : 'Sélectionnez une taille'}</span>
            </button>
            
            <p className="reassurance-text">
              <span>✓ Paiement sécurisé</span>
              <span>✓ Livraison offerte</span>
              <span>✓ Confection artisanale</span>
            </p>
            
            <button 
              className={`btn-wishlist ${isInWishlist(dress.id) ? 'active' : ''}`}
              onClick={toggleWishlist}
            >
              <Heart size={18} className={isInWishlist(dress.id) ? 'filled' : ''} />
              <span>{isInWishlist(dress.id) ? 'Ajouté aux favoris' : 'Ajouter aux favoris'}</span>
            </button>
            
            <button 
              className="btn-share"
              onClick={handleShare}
            >
              <Share2 size={18} />
              <span>Partager</span>
            </button>
          </div>
        </div>
      </section>

      {/* Mobile Sticky CTA */}
      {isMobile && (
        <div className="mobile-sticky-cta">
          <button
            className={`btn-primary-cta ${!selectedSize ? 'disabled' : ''}`}
            onClick={() => { if (selectedSize) { addToCart(dress, selectedSize); } }}
            disabled={!selectedSize}
          >
            <ShoppingBag size={18} /> <span>{selectedSize ? 'Ajouter au Panier' : 'Sélectionnez une taille'}</span>
          </button>
        </div>
      )}

      {/* Secondary Information Section (Below Fold) */}
      <section className="product-details-section container">
        <div className="details-grid">
          {/* Description */}
          <div className="detail-card">
            <h3>L'Histoire de la Robe</h3>
            <div className="detail-content">
              {displayStory ? (
                <>
                  <p className="story-intro">{displayStory.intro}</p>
                  <p className="story-paragraph">{displayStory.paragraph1}</p>
                  <p className="story-paragraph">{displayStory.paragraph2}</p>
                  <p className="story-paragraph">{displayStory.paragraph3}</p>
                </>
              ) : (
                <>
                  <p className="story-intro">
                    Une création d'exception née de la passion pour l'élégance intemporelle et le savoir-faire artisanal français.
                  </p>
                  <p className="story-paragraph">
                    Inspirée par la grâce des silhouettes parisiennes, cette robe incarne l'alliance parfaite entre tradition et modernité. Chaque couture, chaque pli a été pensé pour magnifier votre mouvement et sublimer votre présence le jour J.
                  </p>
                  <p className="story-paragraph">
                    Les matières nobles sélectionnées — satin duchesse, dentelle de Calais, doublure en soie — offrent un confort exceptionnel et un tombé irréprochable qui épouse délicatement les courbes.
                  </p>
                  <p className="story-paragraph">
                    Conçue pour vous faire sentir unique, cette robe est bien plus qu'un vêtement : c'est une œuvre d'art qui raconte votre histoire, avec une attention portée aux moindres détails pour une expérience inoubliable.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Materials & Details */}
          <div className="detail-card">
            <h3>Matières & Confection</h3>
            <div className="detail-content">
              {displayMaterials ? (
                <p className="materials-override">{displayMaterials}</p>
              ) : displayMaterialsTable ? (
                <div className="premium-table">
                  {displayMaterialsTable.map((row, i) => (
                    <div key={i} className="table-row">
                      <span className="table-label">{row.label}</span>
                      <span className="table-dots"></span>
                      <span className="table-value">{row.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="premium-table">
                  <div className="table-row">
                    <span className="table-label">Matière</span>
                    <span className="table-dots"></span>
                    <span className="table-value">Satin duchesse</span>
                  </div>
                  <div className="table-row">
                    <span className="table-label">Doublure</span>
                    <span className="table-dots"></span>
                    <span className="table-value">Satin de soie</span>
                  </div>
                  <div className="table-row">
                    <span className="table-label">Coupe</span>
                    <span className="table-dots"></span>
                    <span className="table-value">Princesse</span>
                  </div>
                  <div className="table-row">
                    <span className="table-label">Fabrication</span>
                    <span className="table-dots"></span>
                    <span className="table-value">Artisanale</span>
                  </div>
                  <div className="table-row">
                    <span className="table-label">Nuances</span>
                    <span className="table-dots"></span>
                    <span className="table-value">{dress.colors.join(', ')}</span>
                  </div>
                  <div className="table-row">
                    <span className="table-label font-gold">Silhouette</span>
                    <span className="table-dots"></span>
                    <span className="table-value">{dress.silhouette}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* FAQ */}
          <div className="detail-card">
            <h3>Questions Fréquentes</h3>
            <div className="detail-content">
              {parseDescription(displayDescription).map((item, i) => {
                if (item.type === 'faq') {
                  return (
                    <div key={i} className="faq-item">
                      <button 
                        className="faq-question"
                        onClick={() => toggleFaq(item.index)}
                      >
                        <span>{item.question}</span>
                        <ChevronRight size={16} className={`faq-chevron ${expandedFaq === item.index ? 'expanded' : ''}`} />
                      </button>
                      {expandedFaq === item.index && (
                        <div className="faq-answer">
                          <p>{item.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              })}
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
            <img src={activeImage} alt={`${displayName} Zoom`} />
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
                <img src={img} alt={`${displayName} - ${i + 1}`} />
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
                <h2>Demande d'information pour la robe {displayName}</h2>
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
                <p>Nous vous remercions, <strong>{quoteDetails.name}</strong>. Votre demande de devis pour le modèle <strong>{displayName}</strong> est bien transmise.</p>
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
          animation: fadeInPage 0.4s ease;
        }

        @keyframes fadeInPage {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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
          margin-bottom: 100px;
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
          overflow: hidden;
        }

        .gallery-main-frame:hover .gallery-main-image {
          transform: scale(1.05);
          transition: transform 0.3s ease;
        }

        .gallery-main-frame:hover .btn-zoom-trigger {
          opacity: 1;
        }

        .gallery-main-image {
          width: 100%;
          height: auto;
          display: block;
          transition: transform 0.3s ease;
        }

        .photo-indicator {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          z-index: 5;
        }

        .indicator-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.5);
          transition: all 0.2s ease;
        }

        .indicator-dot.active {
          background-color: var(--color-gold);
          transform: scale(1.2);
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
          font-size: 4rem;
          color: var(--color-black);
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }

        .info-reference {
          font-size: 0.75rem;
          color: var(--color-gray-medium);
          letter-spacing: 0.1em;
          display: block;
          margin-bottom: 25px;
        }

        .info-price {
          font-size: 2.5rem;
          color: var(--color-black);
          margin-bottom: 30px;
          font-weight: 300;
          letter-spacing: -0.01em;
        }

        .info-emotional {
          font-size: 1rem;
          color: var(--color-charcoal);
          line-height: 1.7;
          margin-bottom: 40px;
          font-style: italic;
        }

        /* Benefits Grid */
        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
          margin-bottom: 45px;
        }

        .benefit-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.9rem;
          color: var(--color-charcoal);
          padding: 12px 16px;
          background-color: var(--color-white);
          border: 1px solid var(--color-beige-light);
          border-radius: 8px;
          transition: var(--transition-fast);
        }

        .benefit-item:hover {
          border-color: var(--color-gold);
          transform: translateY(-2px);
        }

        .benefit-icon {
          color: var(--color-gold);
        }

        .info-description {
          font-size: 0.9rem;
          color: var(--color-charcoal);
          line-height: 1.7;
          margin-bottom: 40px;
          padding: 20px;
          background-color: var(--color-white);
          border: 1px solid var(--color-beige-light);
          border-radius: 8px;
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }
        .info-description .desc-line {
          margin-bottom: 12px;
          padding-left: 0;
        }
        .info-description .desc-label {
          font-family: var(--font-sans);
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--color-gold);
          margin: 20px 0 10px 0;
          font-weight: 600;
          padding-bottom: 6px;
          border-bottom: 1px solid var(--color-beige-light);
        }
        .info-description .desc-question {
          font-weight: 600;
          color: var(--color-black);
          margin-top: 16px;
          margin-bottom: 6px;
          font-size: 0.85rem;
        }
        .info-description .desc-icon-line {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--color-beige-light);
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 0.8rem;
          margin-bottom: 6px;
          margin-right: 6px;
        }

        /* FAQ Accordion */
        .faq-item {
          margin-bottom: 12px;
          border-bottom: 1px solid var(--color-beige-light);
        }
        .faq-question {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 0;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--color-black);
          transition: color 0.2s;
        }
        .faq-question:hover {
          color: var(--color-gold);
        }
        .faq-chevron {
          transition: transform 0.25s ease;
          color: var(--color-gray-medium);
        }
        .faq-chevron.expanded {
          transform: rotate(90deg);
        }
        .faq-answer {
          padding: 0 0 16px 0;
          font-size: 0.9rem;
          color: var(--color-charcoal);
          line-height: 1.7;
          animation: fadeIn 0.25s ease;
        }
        .faq-answer p {
          margin: 0;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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
          margin-bottom: 25px;
        }

        .size-bubble {
          border: 1px solid var(--color-beige-dark);
          width: 42px;
          height: 42px;
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

        /* Primary CTA Button */
        .btn-primary-cta {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-size: 0.95rem;
          font-weight: 500;
          padding: 0 24px;
          height: 58px;
          background-color: var(--color-black);
          color: var(--color-white);
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.05em;
        }

        .btn-primary-cta:hover:not(.disabled) {
          background-color: var(--color-black);
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .btn-primary-cta.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .reassurance-text {
          font-size: 0.8rem;
          color: var(--color-gray-medium);
          text-align: center;
          margin: 20px 0 25px 0;
          letter-spacing: 0.05em;
          display: flex;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .reassurance-text span {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* Wishlist Button */
        .btn-wishlist {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 0.85rem;
          font-weight: 400;
          padding: 14px 24px;
          height: 50px;
          background-color: var(--color-white);
          color: var(--color-black);
          border: 1px solid var(--color-beige-dark);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.05em;
        }

        .btn-wishlist:hover {
          border-color: var(--color-gold);
          background-color: var(--color-ivory);
        }

        .btn-wishlist.active {
          border-color: var(--color-gold);
          background-color: var(--color-gold);
          color: var(--color-white);
        }

        .btn-wishlist.active .filled {
          fill: var(--color-white);
          color: var(--color-white);
        }

        /* Share Button */
        .btn-share {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 0.85rem;
          font-weight: 400;
          padding: 14px 24px;
          height: 50px;
          background-color: var(--color-white);
          color: var(--color-black);
          border: 1px solid var(--color-beige-dark);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.05em;
        }

        .btn-share:hover {
          border-color: var(--color-gold);
          background-color: var(--color-ivory);
        }

        .action-btn.disabled {
          opacity: 0.5;
          cursor: not-allowed;
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

        /* Secondary Details Section */
        .product-details-section {
          padding: 60px 0;
          background-color: var(--color-white);
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }

        .detail-card {
          background-color: var(--color-ivory);
          border: 1px solid var(--color-beige-light);
          border-radius: 12px;
          padding: 30px;
          transition: var(--transition-fast);
        }

        .detail-card:hover {
          border-color: var(--color-gold);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
        }

        .detail-card h3 {
          font-family: var(--font-serif);
          font-size: 1.4rem;
          color: var(--color-black);
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid var(--color-beige-light);
        }

        .detail-content {
          font-size: 0.95rem;
          color: var(--color-charcoal);
          line-height: 1.8;
        }

        .story-intro {
          font-style: italic;
          color: var(--color-black);
          margin-bottom: 20px;
          font-size: 1rem;
        }

        .story-paragraph {
          margin-bottom: 16px;
        }

        .detail-content .desc-line {
          margin-bottom: 12px;
        }

        .detail-content .desc-icon-line {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--color-beige-light);
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 0.8rem;
          margin-bottom: 8px;
          margin-right: 6px;
        }

        .detail-content .desc-label {
          font-family: var(--font-sans);
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--color-gold);
          margin: 20px 0 10px 0;
          font-weight: 600;
        }

        .detail-content .info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 0.85rem;
        }

        .detail-content .row-label {
          color: var(--color-gray-medium);
        }

        .detail-content .row-label.font-gold {
          color: var(--color-gold);
        }

        .detail-content .row-value {
          color: var(--color-black);
          text-align: right;
          max-width: 60%;
        }

        /* Premium Table */
        .premium-table {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .materials-override {
          font-size: 0.9rem;
          line-height: 1.7;
          color: var(--color-charcoal);
          font-style: italic;
        }

        .table-row {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.9rem;
        }

        .table-label {
          color: var(--color-gray-medium);
          font-size: 0.85rem;
          min-width: 100px;
        }

        .table-label.font-gold {
          color: var(--color-gold);
        }

        .table-dots {
          flex: 1;
          border-bottom: 1px dotted var(--color-beige-dark);
          min-width: 20px;
        }

        .table-value {
          color: var(--color-black);
          font-weight: 500;
          min-width: 100px;
          text-align: right;
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

          .details-grid {
            grid-template-columns: 1fr;
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

          .info-price {
            font-size: 1.8rem;
          }

          .benefits-grid {
            grid-template-columns: 1fr;
          }

          .similar-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .detail-card {
            padding: 20px;
          }

          /* Mobile Sticky CTA */
          .mobile-sticky-cta {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: var(--color-white);
            padding: 16px 20px;
            box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
            z-index: 1000;
          }

          .mobile-sticky-cta .btn-primary-cta {
            height: 52px;
          }
        }
      `}</style>
    </div>
  );
}

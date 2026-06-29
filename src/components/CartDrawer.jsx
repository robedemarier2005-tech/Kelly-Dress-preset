'use client';
import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, CheckCircle, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTranslation } from '../context/LanguageContext';

export default function CartDrawer() {
  const { t } = useTranslation();
  const { cart, isCartOpen, closeCart, updateQuantity, removeFromCart, cartTotal, clearCart, useShopify, getCheckoutUrl } = useCart();
  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart' | 'checkout' | 'success'
  const [shippingInfo, setShippingInfo] = useState({ name: '', email: '', address: '', city: '', zip: '', card: '' });
  const [isRedirecting, setIsRedirecting] = useState(false);

  if (!isCartOpen) return null;

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    setCheckoutStep('success');
  };

  const handleShopifyCheckout = async () => {
    if (!useShopify) {
      setCheckoutStep('checkout');
      return;
    }

    setIsRedirecting(true);
    try {
      const checkoutUrl = await getCheckoutUrl();
      
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        alert('Unable to get checkout URL. Please try again.');
        setIsRedirecting(false);
      }
    } catch (error) {
      console.error('Error redirecting to checkout:', error);
      alert('Error redirecting to checkout. Please try again.');
      setIsRedirecting(false);
    }
  };

  const handleSuccessClose = () => {
    clearCart();
    setCheckoutStep('cart');
    closeCart();
  };

  return (
    <div className="cart-overlay" onClick={closeCart}>
      <div className="cart-drawer-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-drawer-header">
          <div className="header-title-row">
            <ShoppingBag size={20} className="bag-icon" />
            <h3>{t('cart.monPanier')}</h3>
          </div>
          <button className="cart-close-btn" onClick={closeCart} aria-label={t('cart.fermer')}>
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="cart-drawer-body">
          {checkoutStep === 'cart' && (
            <>
              {cart.length > 0 ? (
                <div className="cart-items-flow">
                  {cart.map((item) => (
                    <div key={`${item.dress.id}-${item.size}`} className="cart-item-row">
                      <div className="cart-item-img-frame">
                        <img src={item.dress.image} alt={item.dress.name} />
                      </div>
                      <div className="cart-item-details">
                        <h4>{item.dress.name}</h4>
                        <span className="cart-item-meta">{t('cart.taille')}: {item.size}</span>
                        <div className="qty-price-row">
                          <div className="qty-controls">
                            <button onClick={() => updateQuantity(item.dress.id, item.size, item.quantity - 1)}>
                              <Minus size={12} />
                            </button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.dress.id, item.size, item.quantity + 1)}>
                              <Plus size={12} />
                            </button>
                          </div>
                          <span className="cart-item-price">{item.dress.price * item.quantity} €</span>
                        </div>
                      </div>
                      <button 
                        className="btn-item-remove"
                        onClick={() => removeFromCart(item.dress.id, item.size)}
                        aria-label={t('cart.supprimer')}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}

                  {/* Summary Block */}
                    <div className="cart-summary-block">
                    <div className="summary-row">
                      <span>{t('cart.sousTotal')}</span>
                      <span className="summary-price">{cartTotal} €</span>
                    </div>
                    <p className="shipping-note">{t('cart.livraison')}</p>
                    <button 
                      className="btn-gold w-full btn-checkout-trigger"
                      onClick={handleShopifyCheckout}
                      disabled={isRedirecting}
                    >
                      {isRedirecting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Redirection...</span>
                        </>
                      ) : (
                        t('cart.payer')
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="empty-cart-state">
                  <ShoppingBag size={40} className="empty-bag-icon" />
                  <h4>{t('cart.vide')}</h4>
                  <p>{t('cart.videDesc')}</p>
                  <button className="btn-gold" onClick={closeCart}>
                    {t('cart.continuer')}
                  </button>
                </div>
              )}
            </>
          )}

          {checkoutStep === 'checkout' && (
            <div className="checkout-form-container">
              <h3>{t('cart.paiement')}</h3>
              <p className="checkout-subtitle">{t('cart.paiementDesc')}</p>

              <form onSubmit={handleCheckoutSubmit} className="checkout-inputs-form">
                <div className="form-group">
                  <label className="form-label">{t('cart.nom')}</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required 
                    value={shippingInfo.name}
                    onChange={(e) => setShippingInfo({...shippingInfo, name: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('cart.email')}</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    required 
                    value={shippingInfo.email}
                    onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('cart.adresse')}</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required 
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                  />
                </div>

                <div className="form-row-split">
                  <div className="form-group flex-1">
                    <label className="form-label">{t('cart.codePostal')}</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      required 
                      value={shippingInfo.zip}
                      onChange={(e) => setShippingInfo({...shippingInfo, zip: e.target.value})}
                    />
                  </div>
                  <div className="form-group flex-1">
                    <label className="form-label">{t('cart.ville')}</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      required 
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{t('cart.carte')}</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder={t('cart.cartePlaceholder')}
                    required 
                    value={shippingInfo.card}
                    onChange={(e) => setShippingInfo({...shippingInfo, card: e.target.value})}
                  />
                </div>

                <div className="checkout-summary-box">
                  <span>{t('cart.total')}</span>
                  <strong>{cartTotal} €</strong>
                </div>

                <div className="checkout-btn-group">
                  <button type="submit" className="btn-gold flex-1">
                    {t('cart.confirmer')}
                  </button>
                  <button 
                    type="button" 
                    className="btn-outline" 
                    onClick={() => setCheckoutStep('cart')}
                  >
                    {t('cart.retour')}
                  </button>
                </div>
              </form>
            </div>
          )}

          {checkoutStep === 'success' && (
            <div className="success-order-container">
              <CheckCircle size={55} className="success-gold-icon" />
              <h2>{t('cart.merci')}</h2>
              <p>{t('cart.cher')} <strong>{shippingInfo.name}</strong>, {t('cart.commandeValidee')}</p>
              <p className="order-intro">{t('cart.emailConfirmation')} <strong>{shippingInfo.email}</strong>.</p>
              <p className="confection-note">
                {t('cart.atelier')}
              </p>
              
              <button className="btn-gold" onClick={handleSuccessClose}>
                {t('cart.fermer')}
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .cart-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          z-index: 5000;
          display: flex;
          justify-content: flex-end;
          animation: overlayFade 0.4s ease forwards;
        }

        .cart-drawer-content {
          width: 100%;
          max-width: 480px;
          height: 100%;
          background-color: var(--color-ivory);
          border-left: 1px solid var(--color-beige-dark);
          box-shadow: -10px 0 40px rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          animation: drawerSlide 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        .cart-drawer-header {
          padding: 30px;
          border-bottom: 1px solid var(--color-beige-dark);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-title-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .bag-icon {
          color: var(--color-gold);
        }

        .cart-drawer-header h3 {
          font-size: 1.1rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--color-black);
          font-weight: 500;
        }

        .cart-close-btn {
          background: none;
          border: none;
          color: var(--color-black);
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .cart-close-btn:hover {
          color: var(--color-gold);
        }

        .cart-drawer-body {
          flex: 1;
          overflow-y: auto;
          padding: 30px;
          display: flex;
          flex-direction: column;
        }

        /* Cart Items Row */
        .cart-items-flow {
          display: flex;
          flex-direction: column;
          gap: 25px;
          flex: 1;
        }

        .cart-item-row {
          display: flex;
          gap: 20px;
          position: relative;
          padding-bottom: 25px;
          border-bottom: 1px solid var(--color-beige-light);
        }

        .cart-item-img-frame {
          width: 80px;
          aspect-ratio: 3/4;
          background-color: var(--color-white);
          border: 1px solid var(--color-beige-light);
          overflow: hidden;
          flex-shrink: 0;
        }

        .cart-item-img-frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .cart-item-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .cart-item-details h4 {
          font-size: 1.1rem;
          color: var(--color-black);
          margin-bottom: 4px;
        }

        .cart-item-meta {
          font-size: 0.75rem;
          color: var(--color-gray-medium);
          margin-bottom: 12px;
          display: block;
        }

        .qty-price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .qty-controls {
          display: flex;
          align-items: center;
          border: 1px solid var(--color-beige-dark);
          gap: 12px;
          padding: 4px 10px;
        }

        .qty-controls button {
          background: none;
          border: none;
          color: var(--color-black);
          cursor: pointer;
          display: flex;
          align-items: center;
        }

        .qty-controls button:hover {
          color: var(--color-gold);
        }

        .qty-controls span {
          font-size: 0.8rem;
          font-weight: 400;
        }

        .cart-item-price {
          font-size: 0.95rem;
          font-weight: 400;
          color: var(--color-gold);
        }

        .btn-item-remove {
          position: absolute;
          top: 0;
          right: 0;
          background: none;
          border: none;
          color: var(--color-gray-medium);
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .btn-item-remove:hover {
          color: #cc0000;
        }

        /* Summary */
        .cart-summary-block {
          margin-top: auto;
          border-top: 1px solid var(--color-beige-dark);
          padding-top: 30px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--color-black);
          margin-bottom: 15px;
          font-weight: 500;
        }

        .summary-price {
          color: var(--color-gold);
          font-size: 1.2rem;
        }

        .shipping-note {
          font-size: 0.7rem;
          color: var(--color-gray-medium);
          line-height: 1.6;
          margin-bottom: 25px;
          font-style: italic;
        }

        /* Empty State */
        .empty-cart-state {
          text-align: center;
          padding: 80px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          justify-content: center;
          flex: 1;
        }

        .empty-bag-icon {
          color: var(--color-gold);
          opacity: 0.4;
        }

        .empty-cart-state h4 {
          font-size: 1.3rem;
          color: var(--color-black);
        }

        .empty-cart-state p {
          font-size: 0.9rem;
          color: var(--color-gray-medium);
          max-width: 250px;
          line-height: 1.6;
        }

        /* Checkout Form */
        .checkout-form-container {
          display: flex;
          flex-direction: column;
        }

        .checkout-form-container h3 {
          font-size: 1.6rem;
          color: var(--color-black);
          margin-bottom: 5px;
        }

        .checkout-subtitle {
          font-size: 0.8rem;
          color: var(--color-gray-medium);
          margin-bottom: 30px;
        }

        .checkout-inputs-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .form-row-split {
          display: flex;
          gap: 20px;
        }

        .flex-1 {
          flex: 1;
        }

        .checkout-summary-box {
          background-color: var(--color-beige-light);
          padding: 20px;
          border: 1px solid var(--color-beige-dark);
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 15px;
          font-size: 0.9rem;
        }

        .checkout-summary-box strong {
          font-size: 1.15rem;
          color: var(--color-gold);
        }

        .checkout-btn-group {
          display: flex;
          gap: 15px;
          margin-top: 25px;
        }

        /* Success Container */
        .success-order-container {
          text-align: center;
          padding: 50px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          flex: 1;
          justify-content: center;
        }

        .success-gold-icon {
          color: var(--color-gold);
        }

        .success-order-container h2 {
          font-size: 2rem;
          color: var(--color-black);
        }

        .success-order-container p {
          font-size: 0.9rem;
          color: var(--color-charcoal);
          line-height: 1.8;
          max-width: 380px;
        }

        .success-order-container .order-intro {
          font-weight: 400;
        }

        .success-order-container .confection-note {
          font-size: 0.75rem;
          color: var(--color-gray-medium);
          font-style: italic;
        }

        .btn-checkout-trigger {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .btn-checkout-trigger:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        @keyframes overlayFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes drawerSlide {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

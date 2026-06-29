'use client';
import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Check } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

const BookingModal = ({ isOpen, onClose }) => {
  const { t, lang } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    boutique: 'Paris — Faubourg Saint-Honoré',
    time: '14:00',
    notes: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API request
    setTimeout(() => {
      setIsSubmitted(true);
    }, 500);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      date: '',
      boutique: 'Paris — Faubourg Saint-Honoré',
      time: '14:00',
      notes: ''
    });
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose} aria-label={t('booking.fermer')}>
          <X size={20} />
        </button>

        {!isSubmitted ? (
          <div className="modal-body">
            <span className="modal-subtitle">{t('booking.rendezVous')}</span>
            <h2>{t('booking.reserver')}</h2>
            <p className="modal-intro">{t('booking.intro')}</p>
            
            <form onSubmit={handleSubmit} className="booking-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">{t('booking.nom')}</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row split">
                <div className="form-group">
                  <label className="form-label">{t('booking.email')}</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('booking.telephone')}</label>
                  <input 
                    type="tel" 
                    className="form-input" 
                    required 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row split">
                <div className="form-group">
                  <label className="form-label">{t('booking.boutique')}</label>
                  <select 
                    className="form-select"
                    value={formData.boutique}
                    onChange={(e) => setFormData({...formData, boutique: e.target.value})}
                  >
                    <option>{t('booking.paris')}</option>
                    <option>{t('booking.lyon')}</option>
                    <option>{t('booking.geneve')}</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">{t('booking.date')}</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    required 
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row split">
                <div className="form-group">
                  <label className="form-label">{t('booking.heure')}</label>
                  <select 
                    className="form-select"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                  >
                    <option>10:00</option>
                    <option>11:30</option>
                    <option>14:00</option>
                    <option>15:30</option>
                    <option>17:00</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t('booking.demandes')}</label>
                <textarea 
                  className="form-textarea" 
                  rows="3"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                ></textarea>
              </div>

              <button type="submit" className="btn-gold btn-submit-booking">
                {t('booking.confirmer')}
              </button>
            </form>
          </div>
        ) : (
          <div className="booking-success-view">
            <div className="success-icon-wrapper">
              <Check size={40} className="check-icon" />
            </div>
            <h2>{t('booking.succes')}</h2>
            <p>{t('booking.merci')} <strong>{formData.name}</strong>, {t('booking.remerciement')}</p>
            <p>{t('booking.conseillere')}</p>
            
            <div className="booking-details-summary">
              <h3>{t('booking.recapitulatif')}</h3>
              <div className="detail-item">
                <MapPin size={16} /> <span>{formData.boutique}</span>
              </div>
              <div className="detail-item">
                <Calendar size={16} /> <span>{new Date(formData.date).toLocaleDateString(lang === 'en' ? 'en-US' : lang === 'es' ? 'es-ES' : 'fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="detail-item">
                <Clock size={16} /> <span>{formData.time}</span>
              </div>
            </div>

            <button onClick={handleReset} className="btn-gold">
              {t('booking.fermerFenetre')}
            </button>
          </div>
        )}
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: modalFadeIn 0.5s ease forwards;
        }

        .modal-content {
          background-color: var(--color-ivory);
          border: 1px solid var(--color-beige-dark);
          width: 100%;
          max-width: 650px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          padding: 50px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          animation: modalSlideUp 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        .modal-close {
          position: absolute;
          top: 20px;
          right: 20px;
          background: none;
          border: none;
          color: var(--color-black);
          cursor: pointer;
          transition: var(--transition-fast);
          padding: 5px;
        }

        .modal-close:hover {
          color: var(--color-gold);
          transform: rotate(90deg);
        }

        .modal-subtitle {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: var(--color-gold);
          display: block;
          margin-bottom: 10px;
          text-align: center;
        }

        .modal-content h2 {
          font-size: 2.2rem;
          text-align: center;
          margin-bottom: 15px;
          color: var(--color-black);
        }

        .modal-intro {
          font-size: 0.85rem;
          color: var(--color-charcoal);
          text-align: center;
          margin-bottom: 40px;
          line-height: 1.6;
        }

        .booking-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .form-row.split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-select {
          background-color: transparent;
          border: none;
          border-bottom: 1px solid var(--color-beige-dark);
          padding: 10px 0;
          font-size: 0.95rem;
          font-family: var(--font-sans);
          color: var(--color-black);
          outline: none;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .form-select:focus {
          border-bottom: 1px solid var(--color-gold);
        }

        .btn-submit-booking {
          margin-top: 20px;
          width: 100%;
        }

        /* Success View */
        .booking-success-view {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 30px 0;
        }

        .success-icon-wrapper {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 1px solid var(--color-gold);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 25px;
        }

        .check-icon {
          color: var(--color-gold);
        }

        .booking-success-view p {
          font-size: 0.9rem;
          color: var(--color-charcoal);
          margin-bottom: 15px;
          line-height: 1.8;
          max-width: 450px;
        }

        .booking-details-summary {
          background-color: var(--color-beige-light);
          border: 1px solid var(--color-beige-dark);
          padding: 25px;
          width: 100%;
          max-width: 400px;
          margin: 30px 0;
          text-align: left;
        }

        .booking-details-summary h3 {
          font-size: 1rem;
          margin-bottom: 15px;
          color: var(--color-black);
          border-bottom: 1px solid var(--color-beige-dark);
          padding-bottom: 10px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.85rem;
          color: var(--color-charcoal);
          margin-bottom: 10px;
        }

        .detail-item span {
          font-weight: 400;
        }

        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 576px) {
          .modal-content {
            padding: 30px 20px;
          }
          
          .modal-content h2 {
            font-size: 1.8rem;
          }

          .form-row.split {
            grid-template-columns: 1fr;
            gap: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default BookingModal;

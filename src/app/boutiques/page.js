'use client';
import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Search, Map } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';

const boutiquesList = [
  {
    id: 'btq-paris',
    name: 'Boutique Officielle Paris',
    type: 'Boutique Officielle',
    city: 'Paris',
    country: 'France',
    address: '18 Rue du Faubourg Saint-Honoré, 75008 Paris',
    phone: '+33 (0)1 42 68 53 00',
    email: 'paris@kellydress.com',
    hours: 'Lundi — Samedi : 10h00 - 19h00 (Sur RDV)',
    coordinates: { x: 45, y: 40 }
  },
  {
    id: 'btq-geneve',
    name: 'Boutique Officielle Genève',
    type: 'Boutique Officielle',
    city: 'Genève',
    country: 'Suisse',
    address: '42 Rue du Rhône, 1204 Genève',
    phone: '+41 (0)22 310 44 00',
    email: 'geneve@kellydress.com',
    hours: 'Mardi — Samedi : 10h00 - 18h30 (Sur RDV)',
    coordinates: { x: 55, y: 55 }
  },
  {
    id: 'btq-lyon',
    name: 'Boutique Officielle Lyon',
    type: 'Boutique Officielle',
    city: 'Lyon',
    country: 'France',
    address: '12 Place Bellecour, 69002 Lyon',
    phone: '+33 (0)4 72 40 12 00',
    email: 'lyon@kellydress.com',
    hours: 'Mardi — Samedi : 10h00 - 19h00 (Sur RDV)',
    coordinates: { x: 48, y: 65 }
  },
  {
    id: 'btq-londres',
    name: 'The Bridal Gallery (Revendeur)',
    type: 'Revendeur Agréé',
    city: 'Londres',
    country: 'Royaume-Uni',
    address: '88 New Bond Street, London W1S 1SJ',
    phone: '+44 (0)20 7493 0000',
    email: 'retailers@kellydress.com',
    hours: 'Lundi — Samedi : 10h00 - 18h00',
    coordinates: { x: 38, y: 25 }
  },
  {
    id: 'btq-milan',
    name: 'Spazio Sposa Milano (Revendeur)',
    type: 'Revendeur Agréé',
    city: 'Milan',
    country: 'Italie',
    address: 'Via Montenapoleone 14, 20121 Milano',
    phone: '+39 02 7600 0000',
    email: 'retailers@kellydress.com',
    hours: 'Lundi — Samedi : 10h00 - 19h00',
    coordinates: { x: 65, y: 62 }
  }
];

export default function Boutiques() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedBoutique, setSelectedBoutique] = useState(boutiquesList[0]);

  const countries = ['All', 'France', 'Suisse', 'Italie', 'Royaume-Uni'];

  const filteredBoutiques = boutiquesList.filter(btq => {
    const matchesSearch = btq.city.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          btq.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = selectedCountry === 'All' || btq.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  return (
    <div className="boutiques-wrapper">
      {/* Hero */}
      <section className="boutiques-hero section-padding">
        <div className="container">
          <span className="section-subtitle">{t('boutiques.title')}</span>
          <h1 className="section-title">{t('boutiques.title')}</h1>
          <p className="boutiques-intro">{t('boutiques.intro')}</p>
        </div>
      </section>

      {/* Toolbar Search */}
      <div className="container boutiques-toolbar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder={t('boutiques.rechercher')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="country-tabs">
          {countries.map(country => (
            <button 
              key={country} 
              className={`country-tab-btn ${selectedCountry === country ? 'active' : ''}`}
              onClick={() => setSelectedCountry(country)}
            >
              {country === 'All' ? t('boutiques.tousPays') : country}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Stores + Interactive Map */}
      <section className="boutiques-grid-section container">
        <div className="boutiques-main-layout">
          {/* List */}
          <div className="boutiques-list-column">
            {filteredBoutiques.length > 0 ? (
              filteredBoutiques.map(btq => (
                <div 
                  key={btq.id} 
                  className={`boutique-card ${selectedBoutique.id === btq.id ? 'active' : ''}`}
                  onClick={() => setSelectedBoutique(btq)}
                >
                  <span className="boutique-type">{btq.type}</span>
                  <h3>{btq.name}</h3>
                  <div className="card-detail">
                    <MapPin size={14} /> <span>{btq.address}</span>
                  </div>
                  <div className="card-detail">
                    <Phone size={14} /> <span>{btq.phone}</span>
                  </div>
                  <div className="card-detail">
                    <Mail size={14} /> <span>{btq.email}</span>
                  </div>
                  <div className="card-detail">
                    <Clock size={14} /> <span>{btq.hours}</span>
                  </div>

                  {btq.type === 'Boutique Officielle' && (
                    <a href={`mailto:${btq.email}`} className="btn-gold-card" onClick={(e) => e.stopPropagation()}>
                      Nous Contacter
                    </a>
                  )}
                </div>
              ))
            ) : (
              <div className="no-boutique-results">
                  <p>{t('boutiques.aucunResultat')}</p>
              </div>
            )}
          </div>

          {/* Elegant Custom Map Widget */}
          <div className="boutique-map-column">
            <div className="map-widget-frame">
              <div className="map-decor-grid"></div>
              
              {/* Map Title/Header */}
              <div className="map-widget-header">
                <Map size={16} className="map-icon" />
                <span>Salons & Revendeurs Kelly Dress en Europe</span>
              </div>

              {/* Styled Vector Map background Mockup */}
              <div className="map-canvas-mock">
                {/* Draw continent lines or shapes with CSS elements */}
                <div className="country-outline-mock uk">UK</div>
                <div className="country-outline-mock france">FRANCE</div>
                <div className="country-outline-mock swiss">CH</div>
                <div className="country-outline-mock italy">ITALIA</div>

                {/* Markers */}
                {boutiquesList.map(btq => (
                  <button 
                    key={btq.id}
                    className={`map-marker-pin ${selectedBoutique.id === btq.id ? 'active' : ''} ${btq.type === 'Boutique Officielle' ? 'official' : 'retailer'}`}
                    style={{ left: `${btq.coordinates.x}%`, top: `${btq.coordinates.y}%` }}
                    onClick={() => setSelectedBoutique(btq)}
                    title={btq.name}
                  >
                    <div className="pulse-ring"></div>
                    <div className="dot"></div>
                    <span className="marker-label">{btq.city}</span>
                  </button>
                ))}
              </div>

              {/* Active Marker Summary Overlay */}
              <div className="map-active-overlay">
                <h4>{selectedBoutique.name}</h4>
                <p>{selectedBoutique.address}</p>
                <span className="overlay-hours">{selectedBoutique.hours}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .boutiques-wrapper {
          background-color: var(--color-ivory);
          padding-top: 100px;
          min-height: 100vh;
        }

        .boutiques-hero {
          text-align: center;
          background-color: var(--color-white);
          border-bottom: 1px solid var(--color-beige-light);
          padding-top: 150px;
        }

        .boutiques-intro {
          font-size: 0.95rem;
          color: var(--color-gray-medium);
          max-width: 500px;
          margin: 20px auto 0 auto;
          line-height: 1.6;
        }

        /* Toolbar */
        .boutiques-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 30px 0;
          border-bottom: 1px solid var(--color-beige-light);
          margin-bottom: 50px;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 15px;
          border-bottom: 1px solid var(--color-beige-dark);
          padding: 8px 0;
          width: 320px;
        }

        .search-box input {
          background: transparent;
          border: none;
          outline: none;
          font-family: var(--font-sans);
          font-size: 0.85rem;
          letter-spacing: 0.15em;
          color: var(--color-black);
          width: 100%;
        }

        .search-icon {
          color: var(--color-gold);
        }

        .country-tabs {
          display: flex;
          gap: 20px;
        }

        .country-tab-btn {
          background: none;
          border: none;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--color-gray-medium);
          cursor: pointer;
          padding: 8px 0;
          position: relative;
          transition: var(--transition-fast);
        }

        .country-tab-btn:hover {
          color: var(--color-black);
        }

        .country-tab-btn.active {
          color: var(--color-gold);
          font-weight: 500;
        }

        /* Layout Grid */
        .boutiques-grid-section {
          margin-bottom: 120px;
        }

        .boutiques-main-layout {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: 60px;
          align-items: flex-start;
        }

        /* List Column */
        .boutiques-list-column {
          display: flex;
          flex-direction: column;
          gap: 25px;
          max-height: 700px;
          overflow-y: auto;
          padding-right: 15px;
        }

        .boutique-card {
          background-color: var(--color-white);
          border: 1px solid var(--color-beige-light);
          padding: 40px;
          cursor: pointer;
          transition: var(--transition-medium);
          position: relative;
        }

        .boutique-card:hover {
          border-color: var(--color-gold);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
        }

        .boutique-card.active {
          border-color: var(--color-gold);
          background-color: #fcfaf6;
        }

        .boutique-type {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--color-gold);
          display: block;
          margin-bottom: 15px;
          font-weight: 500;
        }

        .boutique-card h3 {
          font-size: 1.6rem;
          color: var(--color-black);
          margin-bottom: 25px;
        }

        .card-detail {
          display: flex;
          gap: 15px;
          font-size: 0.85rem;
          color: var(--color-charcoal);
          margin-bottom: 12px;
          line-height: 1.6;
        }

        .card-detail svg {
          color: var(--color-gold);
          flex-shrink: 0;
          margin-top: 3px;
        }

        .btn-gold-card {
          margin-top: 25px;
          background-color: var(--color-black);
          color: var(--color-white);
          border: none;
          padding: 10px 24px;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          cursor: pointer;
          transition: var(--transition-fast);
          display: inline-block;
          text-decoration: none;
        }

        .btn-gold-card:hover {
          background-color: var(--color-gold);
        }

        .no-boutique-results {
          text-align: center;
          padding: 50px 0;
          color: var(--color-gray-medium);
        }

        /* Map Canvas */
        .boutique-map-column {
          position: sticky;
          top: 110px;
        }

        .map-widget-frame {
          background-color: var(--color-white);
          border: 1px solid var(--color-beige-dark);
          height: 600px;
          position: relative;
          padding: 30px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .map-widget-header {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--color-black);
          border-bottom: 1px solid var(--color-beige-light);
          padding-bottom: 15px;
          margin-bottom: 20px;
          font-weight: 500;
        }

        .map-icon {
          color: var(--color-gold);
        }

        .map-canvas-mock {
          flex: 1;
          background-color: var(--color-beige-light);
          position: relative;
          border: 1px solid var(--color-beige-dark);
          overflow: hidden;
        }

        .map-decor-grid {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: 20px 20px;
          background-image: linear-gradient(to right, rgba(197, 168, 128, 0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(197, 168, 128, 0.05) 1px, transparent 1px);
          pointer-events: none;
        }

        /* Mock Map Country labels */
        .country-outline-mock {
          position: absolute;
          font-family: var(--font-serif);
          font-size: 1.8rem;
          color: rgba(197, 168, 128, 0.15);
          letter-spacing: 0.3em;
          text-transform: uppercase;
          font-style: italic;
          pointer-events: none;
        }

        .country-outline-mock.uk { left: 25%; top: 18%; }
        .country-outline-mock.france { left: 35%; top: 45%; }
        .country-outline-mock.swiss { left: 62%; top: 48%; }
        .country-outline-mock.italy { left: 68%; top: 72%; }

        /* Map Pin Markers */
        .map-marker-pin {
          position: absolute;
          background: none;
          border: none;
          width: 18px;
          height: 18px;
          cursor: pointer;
          transform: translate(-50%, -50%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }

        .map-marker-pin .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--color-gold);
          transition: var(--transition-fast);
        }

        .map-marker-pin.official .dot {
          background-color: var(--color-black);
          border: 1px solid var(--color-gold);
        }

        .map-marker-pin .pulse-ring {
          position: absolute;
          width: 24px;
          height: 24px;
          border: 1px solid var(--color-gold);
          border-radius: 50%;
          animation: mapPulse 2s infinite ease-out;
          opacity: 0;
        }

        .map-marker-pin.active .dot {
          background-color: var(--color-gold);
          transform: scale(1.4);
        }

        .marker-label {
          position: absolute;
          top: 20px;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--color-black);
          background-color: var(--color-white-overlay);
          padding: 2px 6px;
          border: 1px solid var(--color-beige-dark);
          font-weight: 500;
        }

        @keyframes mapPulse {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        /* Map Bottom Card Overlay */
        .map-active-overlay {
          position: absolute;
          bottom: 30px;
          left: 30px;
          right: 30px;
          background-color: var(--color-white-overlay);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid var(--color-beige-dark);
          padding: 20px;
          animation: overlaySlide 0.4s ease forwards;
        }

        .map-active-overlay h4 {
          font-family: var(--font-serif);
          font-size: 1.1rem;
          color: var(--color-black);
          margin-bottom: 5px;
        }

        .map-active-overlay p {
          font-size: 0.75rem;
          color: var(--color-charcoal);
          margin-bottom: 8px;
        }

        .overlay-hours {
          font-size: 0.7rem;
          color: var(--color-gold);
          display: block;
        }

        @keyframes overlaySlide {
          from { transform: translateY(15px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @media (max-width: 992px) {
          .boutiques-main-layout {
            grid-template-columns: 1fr;
          }

          .boutiques-toolbar {
            flex-direction: column;
            gap: 20px;
            align-items: flex-start;
          }

          .search-box {
            width: 100%;
          }

          .country-tabs {
            flex-wrap: wrap;
          }

          .boutique-map-column {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

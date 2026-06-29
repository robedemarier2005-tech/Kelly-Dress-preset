'use client';
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Heart, SlidersHorizontal, X, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useTranslation } from '../../context/LanguageContext';
import { useEffect } from 'react';

function CatalogContent() {
  const { t } = useTranslation();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const searchParams = useSearchParams();
  const [dressesData, setDressesData] = useState([]);
  const [filteredDresses, setFilteredDresses] = useState([]);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les données (Shopify ou statiques)
  useEffect(() => {
    const loadData = async () => {
      try {
        const { getData } = await import('../../lib/shopify');
        const data = await getData('products');
        
        // Dédupliquer les produits par ID
        const uniqueData = Array.from(new Map(data.map(item => [item.id, item])).values());
        console.log('Loaded products:', data.length, 'Unique products:', uniqueData.length);
        
        setDressesData(uniqueData);
        setFilteredDresses(uniqueData);
      } catch (error) {
        console.error('Error loading products:', error);
        // Fallback sur données statiques
        const { dressesData: staticData } = await import('../../data/dresses');
        setDressesData(staticData);
        setFilteredDresses(staticData);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Reset filters when data loads
  useEffect(() => {
    if (dressesData.length > 0) {
      setFilteredDresses(dressesData);
    }
  }, [dressesData]);

  // Filters State
  const [selectedCollection, setSelectedCollection] = useState('All');
  const [selectedSilhouette, setSelectedSilhouette] = useState('All');
  const [selectedStyle, setSelectedStyle] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [expandedFilters, setExpandedFilters] = useState({ collection: true, silhouette: true, style: true, price: true, size: true });

  // Filter lists derived from data
  const collections = ['All', ...new Set(dressesData.map(d => d.collection))];
  const silhouettes = ['All', ...new Set(dressesData.map(d => d.silhouette))];
  const styles = ['All', ...new Set(dressesData.map(d => d.style))];
  const priceRanges = ['All', 'Moins de 2000€', '2000€ - 4000€', '4000€ - 6000€', 'Plus de 6000€'];
  const sizes = ['All', ...new Set(dressesData.flatMap(d => d.sizes))].sort();

  // Dynamic page title based on collection
  useEffect(() => {
    const colParam = searchParams.get('collection');
    if (colParam) {
      document.title = `${colParam} | Kelly Dress`;
    } else {
      document.title = 'Catalogue | Kelly Dress';
    }
  }, [searchParams]);

  // Read collection from URL query params (e.g. ?collection=Couture)
  useEffect(() => {
    const colParam = searchParams.get('collection');
    if (colParam) {
      setSelectedCollection(colParam);
      // Reset other filters
      setSelectedSilhouette('All');
      setSelectedStyle('All');
      setSelectedPriceRange('All');
      setSelectedSize('All');
    }
  }, [searchParams]);

  // Filter effect
  useEffect(() => {
    let result = dressesData;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(d => 
        d.name.toLowerCase().includes(query) ||
        d.description.toLowerCase().includes(query) ||
        d.collection.toLowerCase().includes(query) ||
        d.reference.toLowerCase().includes(query)
      );
    }

    if (selectedCollection !== 'All') {
      result = result.filter(d => d.collection === selectedCollection);
    }
    if (selectedSilhouette !== 'All') {
      result = result.filter(d => d.silhouette === selectedSilhouette);
    }
    if (selectedStyle !== 'All') {
      result = result.filter(d => d.style === selectedStyle);
    }
    if (selectedSize !== 'All') {
      result = result.filter(d => d.sizes.includes(selectedSize));
    }
    if (selectedPriceRange !== 'All') {
      if (selectedPriceRange === 'Moins de 2000€') {
        result = result.filter(d => d.price < 2000);
      } else if (selectedPriceRange === '2000€ - 4000€') {
        result = result.filter(d => d.price >= 2000 && d.price <= 4000);
      } else if (selectedPriceRange === '4000€ - 6000€') {
        result = result.filter(d => d.price >= 4000 && d.price <= 6000);
      } else if (selectedPriceRange === 'Plus de 6000€') {
        result = result.filter(d => d.price > 6000);
      }
    }

    // Sort
    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name-asc') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
      result = [...result].sort((a, b) => b.name.localeCompare(a.name));
    }

    setFilteredDresses(result);
  }, [selectedCollection, selectedSilhouette, selectedStyle, selectedPriceRange, selectedSize, searchQuery, sortBy]);

  const toggleWishlist = (e, dress) => {
    e.preventDefault(); // Prevent navigations
    e.stopPropagation();
    if (isInWishlist(dress.id)) {
      removeFromWishlist(dress.id);
    } else {
      addToWishlist(dress);
    }
  };

  const clearFilters = () => {
    setSelectedCollection('All');
    setSelectedSilhouette('All');
    setSelectedStyle('All');
    setSelectedPriceRange('All');
    setSelectedSize('All');
    setSearchQuery('');
    setSortBy('default');
  };

  const removeFilter = (filterType) => {
    switch(filterType) {
      case 'collection': setSelectedCollection('All'); break;
      case 'silhouette': setSelectedSilhouette('All'); break;
      case 'style': setSelectedStyle('All'); break;
      case 'price': setSelectedPriceRange('All'); break;
      case 'size': setSelectedSize('All'); break;
      case 'search': setSearchQuery(''); break;
    }
  };

  const toggleFilterSection = (section) => {
    setExpandedFilters(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const getActiveFilters = () => {
    const active = [];
    if (selectedCollection !== 'All') active.push({ type: 'collection', label: selectedCollection });
    if (selectedSilhouette !== 'All') active.push({ type: 'silhouette', label: selectedSilhouette });
    if (selectedStyle !== 'All') active.push({ type: 'style', label: selectedStyle });
    if (selectedPriceRange !== 'All') active.push({ type: 'price', label: selectedPriceRange });
    if (selectedSize !== 'All') active.push({ type: 'size', label: `Taille ${selectedSize}` });
    if (searchQuery) active.push({ type: 'search', label: `"${searchQuery}"` });
    return active;
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', fontFamily: 'var(--font-sans)', fontSize: '0.85rem', letterSpacing: '0.15em', color: 'var(--color-gold)' }} role="status">
        CHARGEMENT...
      </div>
    );
  }

  return (
    <div className="catalog-wrapper">
      {/* Header */}
      <section className="catalog-hero section-padding">
        <div className="container">
          <span className="section-subtitle">{t('catalog.title')}</span>
          <h1 className="section-title">{selectedCollection !== 'All' ? selectedCollection : t('catalog.title')}</h1>
          <p className="catalog-intro">{t('hero.cta')}</p>
          <p className="catalog-intro-sub">Découvrez notre collection de robes de mariée d'exception, chacune conçue pour révéler la beauté et la personnalité de chaque future mariée. Parcourez notre sélection de créations haute couture, des silhouettes princesse aux lignes sirène épurées, en passant par des modèles bohèmes et contemporains. Chaque robe raconte une histoire d'amour et d'élégance intemporelle, façonnée par des artisans d'exception dans notre atelier parisien.</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="catalog-content-section container">
        {/* Toggle Filters Mobile */}
        <div className="catalog-toolbar">
          <div className="toolbar-left">
            <button 
              className="btn-toolbar-filters" 
              onClick={() => setShowFiltersMobile(true)}
            >
              <SlidersHorizontal size={16} /> <span>{t('catalog.filtrer')}</span>
              {getActiveFilters().length > 0 && <span className="filter-badge">{getActiveFilters().length}</span>}
            </button>
            <div className="search-bar">
              <Search size={16} className="search-icon" />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button className="clear-search" onClick={() => setSearchQuery('')}>
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
          <div className="toolbar-right">
            <select 
              className="sort-select" 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Trier par</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="name-asc">Nom A-Z</option>
              <option value="name-desc">Nom Z-A</option>
            </select>
            <div className="results-count">
              {filteredDresses.length} {filteredDresses.length > 1 ? 'modèles' : 'modèle'}
            </div>
          </div>
        </div>

        {/* Active Filters Chips */}
        {getActiveFilters().length > 0 && (
          <div className="active-filters-bar">
            <div className="active-filters-list">
              {getActiveFilters().map((filter, idx) => (
                <button 
                  key={idx} 
                  className="active-filter-chip"
                  onClick={() => removeFilter(filter.type)}
                >
                  <span>{filter.label}</span>
                  <X size={12} />
                </button>
              ))}
            </div>
            <button className="clear-all-filters" onClick={clearFilters}>
              Tout effacer
            </button>
          </div>
        )}

        <div className="catalog-main-layout">
          {/* Sidebar Filters (Desktop) */}
          <aside className="catalog-sidebar">
            <div className="sidebar-header">
              <h3>{t('catalog.filtrer')}</h3>
              {getActiveFilters().length > 0 && (
                <button onClick={clearFilters} className="clear-filters-btn">Tout effacer</button>
              )}
            </div>

            <div className={`filter-group ${expandedFilters.collection ? 'expanded' : ''}`}>
              <button 
                className="filter-section-toggle"
                onClick={() => toggleFilterSection('collection')}
              >
                <h4 className="filter-label">{t('catalog.filtreCollection')}</h4>
                {expandedFilters.collection ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {expandedFilters.collection && (
                <div className="filter-options">
                  {collections.map(col => (
                    <button 
                      key={col} 
                      className={`filter-opt-btn ${selectedCollection === col ? 'active' : ''}`}
                      onClick={() => setSelectedCollection(col)}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className={`filter-group ${expandedFilters.silhouette ? 'expanded' : ''}`}>
              <button 
                className="filter-section-toggle"
                onClick={() => toggleFilterSection('silhouette')}
              >
                <h4 className="filter-label">{t('product.silhouette')}</h4>
                {expandedFilters.silhouette ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {expandedFilters.silhouette && (
                <div className="filter-options">
                  {silhouettes.map(sil => (
                    <button 
                      key={sil} 
                      className={`filter-opt-btn ${selectedSilhouette === sil ? 'active' : ''}`}
                      onClick={() => setSelectedSilhouette(sil)}
                    >
                      {sil}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className={`filter-group ${expandedFilters.style ? 'expanded' : ''}`}>
              <button 
                className="filter-section-toggle"
                onClick={() => toggleFilterSection('style')}
              >
                <h4 className="filter-label">{t('catalog.filtreStyle')}</h4>
                {expandedFilters.style ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {expandedFilters.style && (
                <div className="filter-options">
                  {styles.map(sty => (
                    <button 
                      key={sty} 
                      className={`filter-opt-btn ${selectedStyle === sty ? 'active' : ''}`}
                      onClick={() => setSelectedStyle(sty)}
                    >
                      {sty}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className={`filter-group ${expandedFilters.price ? 'expanded' : ''}`}>
              <button 
                className="filter-section-toggle"
                onClick={() => toggleFilterSection('price')}
              >
                <h4 className="filter-label">{t('catalog.filtrePrix')}</h4>
                {expandedFilters.price ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {expandedFilters.price && (
                <div className="filter-options">
                  {priceRanges.map(pr => (
                    <button 
                      key={pr} 
                      className={`filter-opt-btn ${selectedPriceRange === pr ? 'active' : ''}`}
                      onClick={() => setSelectedPriceRange(pr)}
                    >
                      {pr}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className={`filter-group ${expandedFilters.size ? 'expanded' : ''}`}>
              <button 
                className="filter-section-toggle"
                onClick={() => toggleFilterSection('size')}
              >
                <h4 className="filter-label">{t('catalog.filtreTaille')}</h4>
                {expandedFilters.size ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {expandedFilters.size && (
                <div className="filter-options size-grid">
                  {sizes.map(sz => (
                    <button 
                      key={sz} 
                      className={`filter-opt-btn size-opt ${selectedSize === sz ? 'active' : ''}`}
                      onClick={() => setSelectedSize(sz)}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </aside>

          {/* Catalog Masonry Gallery */}
          <main className="catalog-gallery-container">
            {isLoading ? (
              <div className="catalog-masonry">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="dress-card skeleton-card">
                    <div className="dress-img-container skeleton-img"></div>
                    <div className="dress-details">
                      <div className="dress-header">
                        <div className="skeleton-text skeleton-title"></div>
                        <div className="skeleton-text skeleton-price"></div>
                      </div>
                      <div className="dress-meta">
                        <div className="skeleton-text skeleton-meta"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredDresses.length > 0 ? (
              <div className="catalog-masonry">
                {filteredDresses.map((dress) => (
                  <Link 
                    href={`/catalog/${dress.id}`}
                    key={dress.id} 
                    className="dress-card"
                  >
                    <div className="dress-img-container">
                      <img src={dress.image || '/images/placeholder.jpg'} alt={dress.name} className="main-image" />
                      {dress.alternateImage && <img src={dress.alternateImage} alt={`${dress.name} Alt`} className="hover-image" />}
                      
                      {/* Wishlist Button Overlay */}
                      <button 
                        className="wishlist-btn-overlay"
                        onClick={(e) => toggleWishlist(e, dress)}
                        aria-label={isInWishlist(dress.id) ? t('wishlist.retirer') : t('product.favoris')}
                      >
                        <Heart size={18} className={isInWishlist(dress.id) ? 'filled' : ''} />
                      </button>

                      <div className="view-details-overlay">
                        <span>{t('nav.decouvrir')}</span>
                      </div>
                    </div>

                    <div className="dress-details">
                      <div className="dress-header">
                        <h3>{dress.name}</h3>
                        <span className="dress-price">{dress.price} €</span>
                      </div>
                      <div className="dress-meta">
                        <span>{t('product.reference')}: {dress.reference}</span>
                        <span className="bullet">•</span>
                        <span>{dress.collection}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="no-results-view">
                <h3>{t('catalog.nothing')}</h3>
                <p>{t('catalog.nothing')}</p>
                <button className="btn-gold" onClick={clearFilters}>{t('catalog.reinitialiser')}</button>
              </div>
            )}
          </main>
        </div>
      </section>

      {/* Mobile Filters Drawer */}
      <div className={`mobile-filters-drawer ${showFiltersMobile ? 'open' : ''}`}>
        <div className="drawer-content">
          <div className="drawer-header">
            <h3>{t('catalog.filtrer')}</h3>
            <button className="close-btn" onClick={() => setShowFiltersMobile(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="drawer-body">
            {/* Repeat filters for mobile drawer */}
            <div className="mobile-filter-section">
              <h4>{t('catalog.filtreCollection')}</h4>
              <div className="options-row">
                {collections.map(col => (
                  <button 
                    key={col} 
                    className={`mobile-opt-btn ${selectedCollection === col ? 'active' : ''}`}
                    onClick={() => setSelectedCollection(col)}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>

            <div className="mobile-filter-section">
              <h4>{t('catalog.filtreSilhouette')}</h4>
              <div className="options-row">
                {silhouettes.map(sil => (
                  <button 
                    key={sil} 
                    className={`mobile-opt-btn ${selectedSilhouette === sil ? 'active' : ''}`}
                    onClick={() => setSelectedSilhouette(sil)}
                  >
                    {sil}
                  </button>
                ))}
              </div>
            </div>

            <div className="mobile-filter-section">
              <h4>{t('catalog.filtreStyle')}</h4>
              <div className="options-row">
                {styles.map(sty => (
                  <button 
                    key={sty} 
                    className={`mobile-opt-btn ${selectedStyle === sty ? 'active' : ''}`}
                    onClick={() => setSelectedStyle(sty)}
                  >
                    {sty}
                  </button>
                ))}
              </div>
            </div>

            <div className="mobile-filter-section">
              <h4>{t('catalog.filtrePrix')}</h4>
              <div className="options-row">
                {priceRanges.map(pr => (
                  <button 
                    key={pr} 
                    className={`mobile-opt-btn ${selectedPriceRange === pr ? 'active' : ''}`}
                    onClick={() => setSelectedPriceRange(pr)}
                  >
                    {pr}
                  </button>
                ))}
              </div>
            </div>

            <div className="mobile-filter-section">
              <h4>{t('catalog.filtreTaille')}</h4>
              <div className="options-row">
                {sizes.map(sz => (
                  <button 
                    key={sz} 
                    className={`mobile-opt-btn ${selectedSize === sz ? 'active' : ''}`}
                    onClick={() => setSelectedSize(sz)}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="drawer-footer">
            <button className="btn-gold w-full" onClick={() => setShowFiltersMobile(false)}>
              {t('nav.decouvrir')} {filteredDresses.length} {filteredDresses.length > 1 ? t('catalog.modeles') : t('catalog.modele')}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .catalog-hero {
          background-color: var(--color-white);
          text-align: center;
          border-bottom: 1px solid var(--color-beige-light);
          padding-top: 150px;
        }

        .catalog-intro {
          font-size: 0.95rem;
          color: var(--color-gray-medium);
          max-width: 500px;
          margin: 20px auto 0 auto;
          line-height: 1.6;
        }

        .catalog-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 30px 0;
          border-bottom: 1px solid var(--color-beige-light);
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .toolbar-left {
          display: flex;
          align-items: center;
          gap: 20px;
          flex: 1;
        }

        .toolbar-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .btn-toolbar-filters {
          display: none;
          align-items: center;
          gap: 10px;
          background: none;
          border: 1px solid var(--color-beige-dark);
          padding: 10px 20px;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          cursor: pointer;
          transition: var(--transition-fast);
          position: relative;
        }

        .btn-toolbar-filters:hover {
          background-color: var(--color-beige-light);
        }

        .filter-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background-color: var(--color-gold);
          color: var(--color-white);
          font-size: 0.65rem;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        .search-bar {
          display: flex;
          align-items: center;
          background-color: var(--color-white);
          border: 1px solid var(--color-beige-dark);
          padding: 10px 15px;
          flex: 1;
          max-width: 400px;
          transition: var(--transition-fast);
        }

        .search-bar:focus-within {
          border-color: var(--color-gold);
        }

        .search-icon {
          color: var(--color-gray-medium);
          flex-shrink: 0;
        }

        .search-input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 0.85rem;
          margin-left: 10px;
          background: none;
          color: var(--color-black);
        }

        .search-input::placeholder {
          color: var(--color-gray-medium);
        }

        .clear-search {
          background: none;
          border: none;
          color: var(--color-gray-medium);
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
        }

        .clear-search:hover {
          color: var(--color-black);
        }

        .sort-select {
          background: none;
          border: 1px solid var(--color-beige-dark);
          padding: 10px 15px;
          font-size: 0.8rem;
          color: var(--color-charcoal);
          cursor: pointer;
          outline: none;
          transition: var(--transition-fast);
        }

        .sort-select:hover {
          border-color: var(--color-gold);
        }

        .sort-select:focus {
          border-color: var(--color-gold);
        }

        .results-count {
          font-size: 0.8rem;
          color: var(--color-gray-medium);
          letter-spacing: 0.1em;
        }

        .active-filters-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 0;
          border-bottom: 1px solid var(--color-beige-light);
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .active-filters-list {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .active-filter-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: var(--color-beige-light);
          border: 1px solid var(--color-beige-dark);
          padding: 8px 14px;
          font-size: 0.75rem;
          color: var(--color-charcoal);
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .active-filter-chip:hover {
          background-color: var(--color-gold);
          border-color: var(--color-gold);
          color: var(--color-white);
        }

        .clear-all-filters {
          background: none;
          border: none;
          color: var(--color-gold);
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .clear-all-filters:hover {
          color: var(--color-black);
          text-decoration: underline;
        }

        .catalog-main-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 60px;
          align-items: flex-start;
          margin-bottom: 120px;
        }

        /* Sidebar Filters */
        .catalog-sidebar {
          position: sticky;
          top: 110px;
        }

        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--color-black);
          margin-bottom: 30px;
        }

        .sidebar-header h3 {
          font-family: var(--font-sans);
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-weight: 500;
        }

        .clear-filters-btn {
          background: none;
          border: none;
          color: var(--color-gold);
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          cursor: pointer;
        }

        .clear-filters-btn:hover {
          color: var(--color-black);
        }

        .filter-group {
          margin-bottom: 25px;
        }

        .filter-section-toggle {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          margin-bottom: 15px;
        }

        .filter-section-toggle:hover .filter-label {
          color: var(--color-black);
        }

        .filter-label {
          font-family: var(--font-sans);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--color-gold);
          font-weight: 500;
          margin: 0;
        }

        .filter-options {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .filter-opt-btn {
          background: none;
          border: none;
          text-align: left;
          font-size: 0.85rem;
          color: var(--color-charcoal);
          cursor: pointer;
          padding: 4px 0;
          transition: var(--transition-fast);
        }

        .filter-opt-btn:hover {
          color: var(--color-gold);
          transform: translateX(3px);
        }

        .filter-opt-btn.active {
          color: var(--color-gold);
          font-weight: 500;
          transform: translateX(5px);
        }

        .size-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }

        .size-opt {
          border: 1px solid var(--color-beige-dark);
          text-align: center;
          padding: 8px 0;
          font-size: 0.75rem;
        }

        .size-opt.active {
          border-color: var(--color-gold);
          background-color: var(--color-beige-light);
          transform: none;
        }

        .size-opt:hover {
          border-color: var(--color-gold);
          transform: none;
        }

        /* Gallery Layout (Masonry CSS) */
        .catalog-gallery-container {
          width: 100%;
        }

        .catalog-masonry {
          column-count: 2;
          column-gap: 40px;
        }

        :global(.dress-card) {
          break-inside: avoid;
          margin-bottom: 50px;
          cursor: pointer;
          display: block;
        }

        /* Skeleton Loading */
        .skeleton-card {
          pointer-events: none;
        }

        .skeleton-img {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
        }

        .skeleton-text {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
          border-radius: 4px;
        }

        .skeleton-title {
          height: 24px;
          width: 70%;
          margin-bottom: 10px;
        }

        .skeleton-price {
          height: 20px;
          width: 30%;
        }

        .skeleton-meta {
          height: 16px;
          width: 50%;
        }

        @keyframes skeleton-loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        .dress-img-container {
          position: relative;
          width: 100%;
          overflow: hidden;
          background-color: var(--color-beige-light);
        }

        /* Uniform aspect-ratio for all cards */
        :global(.dress-card) .dress-img-container {
          padding-bottom: 130%;
        }

        .dress-img-container img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 1.2s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .dress-img-container .hover-image {
          opacity: 0;
        }

        :global(.dress-card:hover) .dress-img-container .main-image {
          opacity: 0;
          transform: scale(1.03);
        }

        :global(.dress-card:hover) .dress-img-container .hover-image {
          opacity: 1;
          transform: scale(1.03);
        }

        .wishlist-btn-overlay {
          position: absolute;
          top: 20px;
          right: 20px;
          background-color: rgba(255, 255, 255, 0.9);
          border: none;
          border-radius: 50%;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--color-black);
          z-index: 5;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
          transition: var(--transition-fast);
        }

        .wishlist-btn-overlay:hover {
          transform: scale(1.08);
          color: var(--color-gold);
        }

        .wishlist-btn-overlay :global(svg.filled) {
          fill: var(--color-gold);
          color: var(--color-gold);
        }

        .view-details-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 20px 0;
          background: linear-gradient(0deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0) 100%);
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 0;
          transition: var(--transition-medium);
          transform: translateY(10px);
        }

        .view-details-overlay span {
          color: var(--color-white);
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          border-bottom: 1px solid var(--color-white);
          padding-bottom: 3px;
        }

        :global(.dress-card:hover) .view-details-overlay {
          opacity: 1;
          transform: translateY(0);
        }

        .dress-details {
          margin-top: 20px;
        }

        .dress-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 6px;
        }

        .dress-details h3 {
          font-size: 1.4rem;
          color: var(--color-black);
        }

        .dress-price {
          font-size: 0.95rem;
          font-weight: 400;
          color: var(--color-gold);
        }

        .dress-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.75rem;
          color: var(--color-gray-medium);
        }

        .bullet {
          font-size: 0.5rem;
        }

        .no-results-view {
          text-align: center;
          padding: 100px 0;
        }

        .no-results-view h3 {
          font-size: 1.8rem;
          margin-bottom: 15px;
        }

        .no-results-view p {
          font-size: 0.9rem;
          color: var(--color-gray-medium);
          margin-bottom: 30px;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
        }

        /* Mobile Filters Drawer */
        .mobile-filters-drawer {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0,0,0,0.5);
          z-index: 3000;
          opacity: 0;
          visibility: hidden;
          transition: var(--transition-medium);
        }

        .mobile-filters-drawer.open {
          opacity: 1;
          visibility: visible;
        }

        .drawer-content {
          position: absolute;
          top: 0;
          right: 0;
          width: 85%;
          max-width: 400px;
          height: 100%;
          background-color: var(--color-ivory);
          display: flex;
          flex-direction: column;
          transform: translateX(100%);
          transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .mobile-filters-drawer.open .drawer-content {
          transform: translateX(0);
        }

        .drawer-header {
          padding: 20px;
          border-bottom: 1px solid var(--color-beige-dark);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .drawer-header h3 {
          font-size: 1.1rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
        }

        .close-btn {
          background: none;
          border: none;
          color: var(--color-black);
          cursor: pointer;
        }

        .drawer-body {
          padding: 20px;
          flex: 1;
          overflow-y: auto;
        }

        .mobile-filter-section {
          margin-bottom: 30px;
        }

        .mobile-filter-section h4 {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--color-gold);
          margin-bottom: 12px;
        }

        .options-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .mobile-opt-btn {
          background-color: transparent;
          border: 1px solid var(--color-beige-dark);
          padding: 8px 16px;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .mobile-opt-btn.active {
          border-color: var(--color-gold);
          background-color: var(--color-beige-light);
          color: var(--color-gold);
        }

        .drawer-footer {
          padding: 20px;
          border-top: 1px solid var(--color-beige-dark);
        }

        .w-full {
          width: 100%;
        }

        @media (max-width: 992px) {
          .catalog-main-layout {
            grid-template-columns: 1fr;
          }

          .catalog-sidebar {
            display: none;
          }

          .btn-toolbar-filters {
            display: flex;
          }

          .search-bar {
            max-width: 250px;
          }

          .catalog-masonry {
            column-count: 2;
            column-gap: 25px;
          }
        }

        @media (max-width: 768px) {
          .toolbar-left {
            flex-direction: column;
            align-items: stretch;
            gap: 15px;
          }

          .search-bar {
            max-width: 100%;
          }

          .toolbar-right {
            flex-direction: column;
            align-items: stretch;
            gap: 15px;
          }

          .sort-select {
            width: 100%;
          }

          .active-filters-bar {
            flex-direction: column;
            align-items: stretch;
          }

          .active-filters-list {
            justify-content: flex-start;
          }
        }

        @media (max-width: 576px) {
          .catalog-masonry {
            column-count: 1;
          }
          :global(.dress-card) {
            margin-bottom: 35px;
          }
        }
      `}</style>
    </div>
  );
}

export default function Catalog() {

  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', fontFamily: 'var(--font-sans)', fontSize: '0.85rem', letterSpacing: '0.15em', color: 'var(--color-gold)' }} role="status">
        CHARGEMENT...
      </div>
    }>
      <CatalogContent />
    </Suspense>
  );
}

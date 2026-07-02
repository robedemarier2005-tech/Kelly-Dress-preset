'use client';
import '../catalog.css';
import React, { useState, useEffect, Suspense, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Heart, SlidersHorizontal, X, Search, ChevronDown, Sparkles, Gem, Palette, Ruler, Tag, RotateCcw } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useTranslation } from '../../context/LanguageContext';

const priceRanges = [
  { label: 'Moins de 2 000 €', min: 0, max: 2000 },
  { label: '2 000 € — 4 000 €', min: 2000, max: 4000 },
  { label: '4 000 € — 6 000 €', min: 4000, max: 6000 },
  { label: 'Plus de 6 000 €', min: 6000, max: Infinity },
];

function CatalogContent() {
  const { t } = useTranslation();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const searchParams = useSearchParams();
  const [dressesData, setDressesData] = useState([]);
  const [filteredDresses, setFilteredDresses] = useState([]);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Filters State
  const [selectedCollection, setSelectedCollection] = useState('All');
  const [selectedSilhouette, setSelectedSilhouette] = useState('All');
  const [selectedStyle, setSelectedStyle] = useState('All');
  const [selectedMaterial, setSelectedMaterial] = useState('All');
  const [selectedColor, setSelectedColor] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [expandedFilters, setExpandedFilters] = useState({
    collection: true, silhouette: false, style: false,
    material: false, color: false, price: false, size: false
  });

  // Charger les données
  useEffect(() => {
    const loadData = async () => {
      try {
        const { getData } = await import('../../lib/shopify');
        const data = await getData('products');
        const uniqueData = Array.from(new Map(data.map(item => [item.id, item])).values());
        setDressesData(uniqueData);
        setFilteredDresses(uniqueData);
      } catch (error) {
        const { dressesData: staticData } = await import('../../data/dresses');
        setDressesData(staticData);
        setFilteredDresses(staticData);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (dressesData.length > 0) setFilteredDresses(dressesData);
  }, [dressesData]);

  // Extract unique values from data
  const collections = useMemo(() => [...new Set(dressesData.map(d => d.collection))].sort(), [dressesData]);
  const silhouettes = useMemo(() => [...new Set(dressesData.map(d => d.silhouette))].sort(), [dressesData]);
  const styles = useMemo(() => [...new Set(dressesData.map(d => d.style))].sort(), [dressesData]);
  const allMaterials = useMemo(() => [...new Set(dressesData.flatMap(d => d.materials || []))].sort(), [dressesData]);
  const allColors = useMemo(() => [...new Set(dressesData.flatMap(d => d.colors || []))].sort(), [dressesData]);
  const allSizes = useMemo(() => [...new Set(dressesData.flatMap(d => d.sizes || []))].sort(), [dressesData]);

  // Count how many items match each filter option (considering all OTHER filters active)
  const getCounts = useMemo(() => {
    return (filterType, value) => {
      return dressesData.filter(d => {
        if (filterType !== 'collection' && selectedCollection !== 'All' && d.collection !== selectedCollection) return false;
        if (filterType !== 'silhouette' && selectedSilhouette !== 'All' && d.silhouette !== selectedSilhouette) return false;
        if (filterType !== 'style' && selectedStyle !== 'All' && d.style !== selectedStyle) return false;
        if (filterType !== 'material' && selectedMaterial !== 'All' && !(d.materials || []).includes(selectedMaterial)) return false;
        if (filterType !== 'color' && selectedColor !== 'All' && !(d.colors || []).includes(selectedColor)) return false;
        if (filterType !== 'size' && selectedSize !== 'All' && !(d.sizes || []).includes(selectedSize)) return false;
        if (filterType !== 'price' && selectedPriceRange !== 'All') {
          const range = priceRanges.find(r => r.label === selectedPriceRange);
          if (range && (d.price < range.min || d.price >= range.max)) return false;
        }
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          if (!d.name.toLowerCase().includes(q) && !d.description.toLowerCase().includes(q) && !d.collection.toLowerCase().includes(q) && !d.reference.toLowerCase().includes(q)) return false;
        }
        // Now check if THIS value matches
        switch (filterType) {
          case 'collection': return d.collection === value;
          case 'silhouette': return d.silhouette === value;
          case 'style': return d.style === value;
          case 'material': return (d.materials || []).includes(value);
          case 'color': return (d.colors || []).includes(value);
          case 'size': return (d.sizes || []).includes(value);
          case 'price': {
            const range = priceRanges.find(r => r.label === value);
            return range && d.price >= range.min && d.price < range.max;
          }
          default: return true;
        }
      }).length;
    };
  }, [dressesData, selectedCollection, selectedSilhouette, selectedStyle, selectedMaterial, selectedColor, selectedSize, selectedPriceRange, searchQuery, priceRanges]);

  // Dynamic page title
  useEffect(() => {
    const colParam = searchParams.get('collection');
    document.title = colParam ? `${colParam} | Kelly Dress` : 'Catalogue | Kelly Dress';
  }, [searchParams]);

  useEffect(() => {
    const colParam = searchParams.get('collection');
    if (colParam) {
      setSelectedCollection(colParam);
      setSelectedSilhouette('All');
      setSelectedStyle('All');
      setSelectedMaterial('All');
      setSelectedColor('All');
      setSelectedPriceRange('All');
      setSelectedSize('All');
    }
  }, [searchParams]);

  // Filter effect
  useEffect(() => {
    let result = dressesData;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(d =>
        d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q) ||
        d.collection.toLowerCase().includes(q) || d.reference.toLowerCase().includes(q)
      );
    }
    if (selectedCollection !== 'All') result = result.filter(d => d.collection === selectedCollection);
    if (selectedSilhouette !== 'All') result = result.filter(d => d.silhouette === selectedSilhouette);
    if (selectedStyle !== 'All') result = result.filter(d => d.style === selectedStyle);
    if (selectedMaterial !== 'All') result = result.filter(d => (d.materials || []).includes(selectedMaterial));
    if (selectedColor !== 'All') result = result.filter(d => (d.colors || []).includes(selectedColor));
    if (selectedSize !== 'All') result = result.filter(d => (d.sizes || []).includes(selectedSize));
    if (selectedPriceRange !== 'All') {
      const range = priceRanges.find(r => r.label === selectedPriceRange);
      if (range) result = result.filter(d => d.price >= range.min && d.price < range.max);
    }

    if (sortBy === 'price-asc') result = [...result].sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') result = [...result].sort((a, b) => b.price - a.price);
    else if (sortBy === 'name-asc') result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'name-desc') result = [...result].sort((a, b) => b.name.localeCompare(a.name));

    setFilteredDresses(result);
  }, [selectedCollection, selectedSilhouette, selectedStyle, selectedMaterial, selectedColor, selectedPriceRange, selectedSize, searchQuery, sortBy, dressesData]);

  const toggleWishlist = (e, dress) => {
    e.preventDefault();
    e.stopPropagation();
    isInWishlist(dress.id) ? removeFromWishlist(dress.id) : addToWishlist(dress);
  };

  const clearFilters = () => {
    setSelectedCollection('All');
    setSelectedSilhouette('All');
    setSelectedStyle('All');
    setSelectedMaterial('All');
    setSelectedColor('All');
    setSelectedPriceRange('All');
    setSelectedSize('All');
    setSearchQuery('');
    setSortBy('default');
  };

  const removeFilter = (type) => {
    switch (type) {
      case 'collection': setSelectedCollection('All'); break;
      case 'silhouette': setSelectedSilhouette('All'); break;
      case 'style': setSelectedStyle('All'); break;
      case 'material': setSelectedMaterial('All'); break;
      case 'color': setSelectedColor('All'); break;
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
    if (selectedMaterial !== 'All') active.push({ type: 'material', label: selectedMaterial });
    if (selectedColor !== 'All') active.push({ type: 'color', label: selectedColor });
    if (selectedPriceRange !== 'All') active.push({ type: 'price', label: selectedPriceRange });
    if (selectedSize !== 'All') active.push({ type: 'size', label: `Taille ${selectedSize}` });
    if (searchQuery) active.push({ type: 'search', label: `"${searchQuery}"` });
    return active;
  };

  const hasActiveFilters = getActiveFilters().length > 0;

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <span>CHARGEMENT...</span>
      </div>
    );
  }

  const renderFilterSection = (key, label, icon, options, selected, setter, type) => {
    const totalCount = options.length;
    return (
    <div className={`filter-group ${expandedFilters[key] ? 'expanded' : ''}`}>
      <button className="filter-section-toggle" onClick={() => toggleFilterSection(key)}>
        <div className="filter-label-row">
          <span className="filter-icon">{icon}</span>
          <h4 className="filter-label">{label}</h4>
          <span className="filter-category-count">({totalCount})</span>
          {selected !== 'All' && <span className="filter-active-dot"></span>}
        </div>
        <span className={`filter-chevron ${expandedFilters[key] ? 'open' : ''}`}>
          <ChevronDown size={15} strokeWidth={1.5} />
        </span>
      </button>
      {expandedFilters[key] && (
        <div className={`filter-options ${type === 'color' ? 'color-grid' : type === 'size' ? 'size-grid' : ''}`}>
          {type === 'color' ? (
            options.map(opt => {
              const count = getCounts('color', opt);
              return (
                <button
                  key={opt}
                  className={`color-opt ${selectedColor === opt ? 'active' : ''} ${count === 0 ? 'disabled' : ''}`}
                  onClick={() => count > 0 && setSelectedColor(selectedColor === opt ? 'All' : opt)}
                  title={`${opt} (${count})`}
                >
                  <span className={`color-swatch ${opt.toLowerCase().replace(/\s/g, '-')}`}></span>
                  <span className="color-name">{opt}</span>
                  <span className="color-count">{count}</span>
                </button>
              );
            })
          ) : (
            options.map(opt => {
              const count = getCounts(type, opt);
              return (
                <button
                  key={opt}
                  className={`filter-opt-btn ${selected === opt ? 'active' : ''} ${count === 0 && selected !== opt ? 'disabled' : ''}`}
                  onClick={() => count > 0 && setter(selected === opt ? 'All' : opt)}
                >
                  <span className="filter-opt-text">{opt}</span>
                  <span className="filter-opt-count">{count}</span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
    );
  };

  return (
    <div className="catalog-wrapper">
      {/* Hero */}
      <section className="catalog-hero section-padding">
        <div className="container">
          <span className="section-subtitle">{t('catalog.title')}</span>
          <h1 className="section-title">{selectedCollection !== 'All' ? selectedCollection : t('catalog.title')}</h1>
          <p className="catalog-intro-sub">Découvrez notre collection de robes de mariée d'exception, chacune conçue pour révéler la beauté et la personnalité de chaque future mariée.</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="catalog-content-section container">
        {/* Toolbar */}
        <div className="catalog-toolbar">
          <div className="toolbar-left">
            <button className="btn-toolbar-filters" onClick={() => setShowFiltersMobile(true)}>
              <SlidersHorizontal size={16} />
              <span>{t('catalog.filtrer')}</span>
              {hasActiveFilters && <span className="filter-badge">{getActiveFilters().length}</span>}
            </button>
            <div className="search-bar">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder={t('catalog.rechercher')}
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
            <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="default">Trier par</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="name-asc">Nom A-Z</option>
              <option value="name-desc">Nom Z-A</option>
            </select>
            <div className="results-count">
              <strong>{filteredDresses.length}</strong> {filteredDresses.length > 1 ? t('catalog.modeles') : t('catalog.modele')}
            </div>
          </div>
        </div>

        {/* Active Filters Chips */}
        {hasActiveFilters && (
          <div className="active-filters-bar">
            <div className="active-filters-list">
              {getActiveFilters().map((filter, idx) => (
                <button key={idx} className="active-filter-chip" onClick={() => removeFilter(filter.type)}>
                  <span>{filter.label}</span>
                  <X size={12} />
                </button>
              ))}
            </div>
            <button className="clear-all-filters" onClick={clearFilters}>
              <RotateCcw size={12} /> {t('catalog.toutEffacer')}
            </button>
          </div>
        )}

        <div className="catalog-main-layout">
          {/* Sidebar Filters */}
          <aside className="catalog-sidebar">
            <div className="sidebar-header">
              <h3>{t('catalog.filtrer')}</h3>
            </div>

            <div className="filter-groups-list">
              {renderFilterSection('collection', 'Collection', <Tag size={15} strokeWidth={1.5} />, collections, selectedCollection, setSelectedCollection, 'text')}
              {renderFilterSection('silhouette', 'Silhouette', <Sparkles size={15} strokeWidth={1.5} />, silhouettes, selectedSilhouette, setSelectedSilhouette, 'text')}
              {renderFilterSection('style', 'Style', <Gem size={15} strokeWidth={1.5} />, styles, selectedStyle, setSelectedStyle, 'text')}
              {renderFilterSection('material', 'Matière', <Sparkles size={15} strokeWidth={1.5} />, allMaterials, selectedMaterial, setSelectedMaterial, 'text')}
              {renderFilterSection('color', 'Couleur', <Palette size={15} strokeWidth={1.5} />, allColors, selectedColor, setSelectedColor, 'color')}
              {renderFilterSection('size', 'Taille', <Ruler size={15} strokeWidth={1.5} />, allSizes, selectedSize, setSelectedSize, 'size')}

              {/* Price */}
              <div className={`filter-group ${expandedFilters.price ? 'expanded' : ''}`}>
                <button className="filter-section-toggle" onClick={() => toggleFilterSection('price')}>
                  <div className="filter-label-row">
                    <span className="filter-icon"><Tag size={15} strokeWidth={1.5} /></span>
                    <h4 className="filter-label">{t('catalog.filtrePrix')}</h4>
                    <span className="filter-category-count">({priceRanges.length})</span>
                    {selectedPriceRange !== 'All' && <span className="filter-active-dot"></span>}
                  </div>
                  <span className={`filter-chevron ${expandedFilters.price ? 'open' : ''}`}>
                    <ChevronDown size={15} strokeWidth={1.5} />
                  </span>
                </button>
                {expandedFilters.price && (
                  <div className="filter-options">
                    {priceRanges.map(pr => {
                      const count = getCounts('price', pr.label);
                      return (
                        <button
                          key={pr.label}
                          className={`filter-opt-btn ${selectedPriceRange === pr.label ? 'active' : ''} ${count === 0 && selectedPriceRange !== pr.label ? 'disabled' : ''}`}
                          onClick={() => count > 0 && setSelectedPriceRange(selectedPriceRange === pr.label ? 'All' : pr.label)}
                        >
                          <span className="filter-opt-text">{pr.label}</span>
                          <span className="filter-opt-count">{count}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {hasActiveFilters && (
              <div className="sidebar-footer">
                <button onClick={clearFilters} className="sidebar-reset-btn">
                  <RotateCcw size={13} strokeWidth={1.5} />
                  <span>Réinitialiser les filtres</span>
                </button>
              </div>
            )}
          </aside>

          {/* Gallery */}
          <main className="catalog-gallery-container">
            {filteredDresses.length > 0 ? (
              <div className="catalog-masonry">
                {filteredDresses.map((dress) => (
                  <Link href={`/catalog/${dress.id}`} key={dress.id} className="dress-card">
                    <div className="dress-img-container">
                      <img src={dress.image || '/images/placeholder.jpg'} alt={dress.name} className="main-image" />
                      {dress.alternateImage && <img src={dress.alternateImage} alt={`${dress.name} Alt`} className="hover-image" />}
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
                      <p className="dress-description">{dress.description}</p>
                      <div className="dress-meta">
                        <span>{dress.collection}</span>
                        <span className="bullet">•</span>
                        <span>{dress.silhouette}</span>
                        {dress.materials && dress.materials.length > 0 && (
                          <>
                            <span className="bullet">•</span>
                            <span>{dress.materials[0]}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="no-results-view">
                <div className="no-results-icon">
                  <Search size={48} strokeWidth={1} />
                </div>
                <h3>{t('catalog.aucunResultat')}</h3>
                <p>{t('catalog.aucunResultatDesc')}</p>
                <button className="btn-gold" onClick={clearFilters}>
                  <RotateCcw size={14} /> {t('catalog.reinitialiser')}
                </button>
              </div>
            )}
          </main>
        </div>
      </section>

      {/* Mobile Filters Drawer */}
      <div className={`mobile-filters-drawer ${showFiltersMobile ? 'open' : ''}`}>
        <div className="drawer-overlay" onClick={() => setShowFiltersMobile(false)}></div>
        <div className="drawer-content">
          <div className="drawer-header">
            <h3>{t('catalog.filtrer')}</h3>
            <button className="close-btn" onClick={() => setShowFiltersMobile(false)}>
              <X size={22} />
            </button>
          </div>

          <div className="drawer-body">
            {renderFilterSection('collection', t('catalog.filtreCollection'), <Tag size={15} strokeWidth={1.5} />, collections, selectedCollection, setSelectedCollection, 'text')}
            {renderFilterSection('silhouette', t('catalog.filtreSilhouette'), <Sparkles size={15} strokeWidth={1.5} />, silhouettes, selectedSilhouette, setSelectedSilhouette, 'text')}
            {renderFilterSection('style', t('catalog.filtreStyle'), <Gem size={15} strokeWidth={1.5} />, styles, selectedStyle, setSelectedStyle, 'text')}
            {renderFilterSection('material', t('catalog.filtreMatiere'), <Sparkles size={15} strokeWidth={1.5} />, allMaterials, selectedMaterial, setSelectedMaterial, 'text')}
            {renderFilterSection('color', t('catalog.filtreCouleur'), <Palette size={15} strokeWidth={1.5} />, allColors, selectedColor, setSelectedColor, 'color')}
            {renderFilterSection('size', t('catalog.filtreTaille'), <Ruler size={15} strokeWidth={1.5} />, allSizes, selectedSize, setSelectedSize, 'size')}
            {renderFilterSection('price', t('catalog.filtrePrix'), <Tag size={15} strokeWidth={1.5} />, priceRanges.map(r => r.label), selectedPriceRange, setSelectedPriceRange, 'text')}
          </div>

          <div className="drawer-footer">
            {hasActiveFilters && (
              <button className="btn-clear-mobile" onClick={clearFilters}>
                <RotateCcw size={14} /> {t('catalog.toutEffacer')}
              </button>
            )}
            <button className="btn-gold w-full" onClick={() => setShowFiltersMobile(false)}>
              {t('catalog.voirModeles')} {filteredDresses.length} {filteredDresses.length > 1 ? t('catalog.modeles') : t('catalog.modele')}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

export default function Catalog() {
  return (
    <Suspense fallback={
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <span>CHARGEMENT...</span>
      </div>
    }>
      <CatalogContent />
    </Suspense>
  );
}

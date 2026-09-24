import { useEffect, useState } from 'react';
import { getProperties, getCities } from '../api';
import PropertiesCard from '../cards/PropertiesCard';
import { PROPERTY_TYPES } from '../constants';

function Properties() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Pagination State
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Filter State
  const [selectedType, setSelectedType] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [minCapacity, setMinCapacity] = useState<string>('');
  const [furnished, setFurnished] = useState(false);
  const [parking, setParking] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  // Load properties whenever filters, page, or city changes
  useEffect(() => {
    fetchProperties();
  }, [page, selectedType, minPrice, maxPrice, minCapacity, furnished, parking, sortBy]);

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Get Selected City from LocalStorage
      const cityName = localStorage.getItem('trustspace_selected_city') || 'GWALIOR';
      
      // 2. Fetch all cities to resolve the ID (API doesn't have a direct search-by-name in the wrapper yet)
      const allCities = await getCities();
      const targetCity = allCities.find(c => c.name.toLowerCase() === cityName.toLowerCase());
      
      if (!targetCity) {
        throw new Error(`City "${cityName}" not found. Please select a valid city from the navbar.`);
      }

      // 3. Build Query Parameters
      const query: Record<string, string | number | boolean> = {
        page,
        size: 8,
        sortBy
      };

      if (selectedType) query.propertyType = selectedType;
      if (minPrice) query.minPrice = Number(minPrice);
      if (maxPrice) query.maxPrice = Number(maxPrice);
      if (minCapacity) query.minCapacity = Number(minCapacity);
      if (furnished) query.furnished = true;
      if (parking) query.parkingAvailable = true;

      // 4. Fetch Properties
      const response = await getProperties(targetCity.id, query);
      
      setProperties(response.content || []);
      setTotalPages(response.totalPages || 1);
      setTotalElements(response.totalElements || 0);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load properties');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeToggle = (type: string) => {
    setSelectedType(prev => (prev === type ? '' : type));
    setPage(0); // Reset page on filter change
  };

  const clearFilters = () => {
    setSelectedType('');
    setMinPrice('');
    setMaxPrice('');
    setMinCapacity('');
    setFurnished(false);
    setParking(false);
    setSortBy('newest');
    setPage(0);
  };

  return (
    <div className="properties-layout">
      {/* Mobile Filter Toggle */}
      <div className="mobile-filter-header">
        <h1 className="section-title" style={{ marginBottom: 0 }}>Explore Spaces</h1>
        <button className="btn-outline" onClick={() => setIsMobileFilterOpen(true)}>
          <span style={{ marginRight: '0.5rem' }}>⚙️</span> Filters
        </button>
      </div>

      {/* Sidebar Filters */}
      <aside className={`properties-sidebar ${isMobileFilterOpen ? 'open' : ''}`}>
        <div className="sidebar-header-mobile">
          <h2>Filters</h2>
          <button className="close-icon" onClick={() => setIsMobileFilterOpen(false)}>✕</button>
        </div>

        <div className="filter-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 className="filter-title">Filters</h3>
            <button className="btn-text-clear" onClick={clearFilters}>Clear all</button>
          </div>

          <div className="filter-section">
            <h4>Property Type</h4>
            <div className="checkbox-group">
              {PROPERTY_TYPES.map(type => (
                <label key={type} className="custom-checkbox">
                  <input 
                    type="radio" 
                    name="propertyType"
                    checked={selectedType === type}
                    onChange={() => handleTypeToggle(type)}
                  />
                  <span className="checkmark"></span>
                  <span className="label-text">{type.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h4>Features</h4>
            <label className="custom-checkbox">
              <input type="checkbox" checked={furnished} onChange={(e) => { setFurnished(e.target.checked); setPage(0); }} />
              <span className="checkmark"></span>
              <span className="label-text">Fully Furnished</span>
            </label>
            <label className="custom-checkbox" style={{ marginTop: '0.8rem' }}>
              <input type="checkbox" checked={parking} onChange={(e) => { setParking(e.target.checked); setPage(0); }} />
              <span className="checkmark"></span>
              <span className="label-text">Parking Available</span>
            </label>
          </div>

          <div className="filter-section">
            <h4>Capacity & Price</h4>
            <div className="input-group-small">
              <label>Min Capacity (Guests)</label>
              <input type="number" placeholder="e.g. 50" value={minCapacity} onChange={(e) => { setMinCapacity(e.target.value); setPage(0); }} />
            </div>
            <div className="price-range">
              <div className="input-group-small">
                <label>Min ₹/hr</label>
                <input type="number" placeholder="Min" value={minPrice} onChange={(e) => { setMinPrice(e.target.value); setPage(0); }} />
              </div>
              <span className="range-separator">-</span>
              <div className="input-group-small">
                <label>Max ₹/hr</label>
                <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => { setMaxPrice(e.target.value); setPage(0); }} />
              </div>
            </div>
          </div>

          <div className="filter-section">
            <h4>Sort By</h4>
            <select className="custom-select" value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(0); }}>
              <option value="newest">Newest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </aside>

      {/* Main Content Grid */}
      <main className="properties-main">
        <div className="properties-header-desktop">
          <h1 className="section-title">Explore Spaces</h1>
          <p className="results-count">{totalElements} spaces found</p>
        </div>

        {error && <div className="message-banner error">{error}</div>}

        {loading ? (
          <div className="properties-grid">
            {/* Skeleton Loading Cards */}
            {Array(8).fill(null).map((_, i) => (
              <div key={i} className="property-card-modern skeleton">
                <div className="skeleton-img"></div>
                <div className="skeleton-text title"></div>
                <div className="skeleton-text sub"></div>
                <div className="skeleton-text price"></div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="empty-state-premium">
            <span className="empty-icon">🔍</span>
            <h3>No spaces found</h3>
            <p>Try adjusting your filters or searching in a different city.</p>
            <button className="btn-solid" onClick={clearFilters}>Clear Filters</button>
          </div>
        ) : (
          <>
            <div className="properties-grid">
              {properties.map((property) => (
                <PropertiesCard key={property.id} property={property} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  className="btn-page" 
                  disabled={page === 0}
                  onClick={() => setPage(p => p - 1)}
                >
                  ← Previous
                </button>
                <span className="page-indicator">
                  Page {page + 1} of {totalPages}
                </span>
                <button 
                  className="btn-page" 
                  disabled={page === totalPages - 1}
                  onClick={() => setPage(p => p + 1)}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default Properties;
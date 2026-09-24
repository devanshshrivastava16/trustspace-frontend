import { useState, useEffect, useRef, useMemo } from 'react';
import { getAmenities } from '../api';
import type { Amenity } from '../types';

interface AmenitySelectProps {
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}

function AmenitySelect({ selectedIds, onChange }: AmenitySelectProps) {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch amenities on mount
  useEffect(() => {
    getAmenities()
      .then((data) => {
        setAmenities(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Failed to load amenities:", err))
      .finally(() => setLoading(false));
  }, []);

  // Handle clicking outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleAmenity = (id: number) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const removeAmenity = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Prevent opening the dropdown when clicking the 'x'
    onChange(selectedIds.filter(selectedId => selectedId !== id));
  };

  const filteredAmenities = useMemo(() => {
    return amenities.filter(amenity => 
      amenity.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [amenities, searchQuery]);

  const selectedAmenities = amenities.filter(a => selectedIds.includes(a.id));

  return (
    <div className="amenity-select-container" ref={dropdownRef}>
      {/* Trigger Area (Input Box) */}
      <div 
        className={`amenity-select-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="amenity-chips-container">
          {selectedAmenities.length === 0 && !loading && (
            <span className="placeholder-text">Select amenities...</span>
          )}
          {loading && <span className="placeholder-text">Loading amenities...</span>}
          
          {selectedAmenities.map(amenity => (
            <span key={amenity.id} className="amenity-chip">
              <span className="chip-icon">{amenity.icon || '✨'}</span>
              <span className="chip-label">{amenity.name}</span>
              <button className="chip-remove" onClick={(e) => removeAmenity(e, amenity.id)}>✕</button>
            </span>
          ))}
        </div>
        <div className="dropdown-chevron">{isOpen ? '▲' : '▼'}</div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="amenity-dropdown-menu">
          <div className="amenity-search-wrapper">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              className="amenity-search-input"
              placeholder="Search amenities..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          </div>

          <div className="amenity-options-list">
            {filteredAmenities.length === 0 ? (
              <div className="empty-options">No amenities found matching "{searchQuery}"</div>
            ) : (
              filteredAmenities.map(amenity => (
                <label 
                  key={amenity.id} 
                  className={`amenity-option ${selectedIds.includes(amenity.id) ? 'selected' : ''}`}
                >
                  <div className="amenity-option-left">
                    <div className="custom-checkbox" style={{ marginBottom: 0 }}>
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(amenity.id)}
                        onChange={() => toggleAmenity(amenity.id)}
                      />
                      <span className="checkmark"></span>
                    </div>
                    <span className="amenity-option-icon">{amenity.icon || '✨'}</span>
                    <div className="amenity-option-text">
                      <span className="amenity-option-name">{amenity.name}</span>
                      {amenity.description && <span className="amenity-option-desc">{amenity.description}</span>}
                    </div>
                  </div>
                </label>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AmenitySelect;
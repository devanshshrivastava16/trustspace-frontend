import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProperty, getCities, uploadPropertyImages } from '../api';
import type { City, PropertyCreatePayload } from '../types';
import { PROPERTY_TYPES } from '../constants';
import AmenitySelect from '../components/AmenitySelect';

function CreateProperty() {
  const navigate = useNavigate();
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [propertyType, setPropertyType] = useState(PROPERTY_TYPES[0]);
  const [cityId, setCityId] = useState<number>(0);
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [hourlyPrice, setHourlyPrice] = useState('');
  const [dailyPrice, setDailyPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('1');
  const [bathrooms, setBathrooms] = useState('1');
  const [parkingAvailable, setParkingAvailable] = useState(false);
  const [furnished, setFurnished] = useState(false);
  const [guestCapacity, setGuestCapacity] = useState('1');
  const [size, setSize] = useState('0');
  const [amenityIds, setAmenityIds] = useState<number[]>([]);
  const [images, setImages] = useState<File[]>([]);

  useEffect(() => {
    setLoadingCities(true);
    getCities()
      .then((data) => setCities(Array.isArray(data) ? data : []))
      .catch(() => setError('Failed to load cities.'))
      .finally(() => setLoadingCities(false));
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    setImages(Array.from(files));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const payload: PropertyCreatePayload = {
      title,
      description,
      propertyType,
      cityId,
      address,
      latitude: Number(latitude),
      longitude: Number(longitude),
      hourlyPrice: Number(hourlyPrice),
      dailyPrice: Number(dailyPrice),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      parkingAvailable,
      furnished,
      guestCapacity: Number(guestCapacity),
      size: Number(size),
      amenityIds: amenityIds,
    };

    try {
      const createdProperty = await createProperty(payload);

      if (images.length > 0 && createdProperty?.id) {
        await uploadPropertyImages(createdProperty.id, images);
      }

      navigate('/owner/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create property');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard-layout" style={{ maxWidth: '900px' }}>
      <div className="dashboard-header">
        <div className="dashboard-title-group">
          <h1 className="section-title" style={{ marginBottom: '0.2rem' }}>Post a New Space</h1>
          <p className="text-muted">Create your property listing and upload images so guests can book with confidence.</p>
        </div>
      </div>

      {error && <div className="message-banner error">{error}</div>}

      <form onSubmit={handleSubmit} className="create-property-form">
        
        {/* SECTION 1: Basic Information */}
        <div className="detail-card">
          <h3 className="section-subtitle">1. Basic Information</h3>
          <div className="input-group">
            <label>Title</label>
            <input placeholder="e.g. Luxury Rooftop with City View" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="input-group" style={{ marginTop: '1.25rem' }}>
            <label>Description</label>
            <textarea className="custom-textarea" rows={4} placeholder="Describe what makes your space unique..." value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>

          <div className="form-grid-2" style={{ marginTop: '1.25rem' }}>
            <div className="input-group">
              <label>Property Type</label>
              <select className="custom-select" value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                {PROPERTY_TYPES.map((type) => (
                  <option key={type} value={type}>{type.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            <div className="input-group" style={{ gridColumn: '1 / -1' }}> {/* Span full width */}
              <label>Amenities</label>
              <AmenitySelect 
                selectedIds={amenityIds} 
                onChange={setAmenityIds} 
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Location */}
        <div className="detail-card">
          <h3 className="section-subtitle">2. Location</h3>
          <div className="form-grid-2">
            <div className="input-group">
              <label>City</label>
              <select className="custom-select" value={cityId} onChange={(e) => setCityId(Number(e.target.value))} required>
                <option value={0} disabled>Select city...</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>{city.name}</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label>Address</label>
              <input placeholder="Full street address" value={address} onChange={(e) => setAddress(e.target.value)} required />
            </div>
          </div>

          <div className="form-grid-2" style={{ marginTop: '1.25rem' }}>
            <div className="input-group">
              <label>Latitude</label>
              <input type="number" step="any" placeholder="e.g. 26.2183" value={latitude} onChange={(e) => setLatitude(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>Longitude</label>
              <input type="number" step="any" placeholder="e.g. 78.1828" value={longitude} onChange={(e) => setLongitude(e.target.value)} required />
            </div>
          </div>
        </div>

        {/* SECTION 3: Space Details */}
        <div className="detail-card">
          <h3 className="section-subtitle">3. Space Details</h3>
          <div className="form-grid-3">
            <div className="input-group">
              <label>Max Guests</label>
              <input type="number" min="1" value={guestCapacity} onChange={(e) => setGuestCapacity(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>Size (sq ft)</label>
              <input type="number" min="0" value={size} onChange={(e) => setSize(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>Bedrooms</label>
              <input type="number" min="0" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>Bathrooms</label>
              <input type="number" min="0" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} required />
            </div>
            
            <div className="checkbox-wrapper">
              <label className="custom-checkbox">
                <input type="checkbox" checked={parkingAvailable} onChange={(e) => setParkingAvailable(e.target.checked)} />
                <span className="checkmark"></span>
                <span className="label-text">Parking Available</span>
              </label>
            </div>
            <div className="checkbox-wrapper">
              <label className="custom-checkbox">
                <input type="checkbox" checked={furnished} onChange={(e) => setFurnished(e.target.checked)} />
                <span className="checkmark"></span>
                <span className="label-text">Fully Furnished</span>
              </label>
            </div>
          </div>
        </div>

        {/* SECTION 4: Pricing */}
        <div className="detail-card">
          <h3 className="section-subtitle">4. Pricing</h3>
          <div className="form-grid-2">
            <div className="input-group">
              <label>Hourly Price (₹)</label>
              <div className="price-input-wrapper">
                <span className="currency-symbol">₹</span>
                <input type="number" min="0" placeholder="0" value={hourlyPrice} onChange={(e) => setHourlyPrice(e.target.value)} required style={{ paddingLeft: '2rem' }} />
              </div>
            </div>
            <div className="input-group">
              <label>Daily Price (₹)</label>
              <div className="price-input-wrapper">
                <span className="currency-symbol">₹</span>
                <input type="number" min="0" placeholder="0" value={dailyPrice} onChange={(e) => setDailyPrice(e.target.value)} required style={{ paddingLeft: '2rem' }} />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 5: Media */}
        <div className="detail-card">
          <h3 className="section-subtitle">5. Photos</h3>
          <div className="file-upload-container">
            <div className="file-upload-icon">📸</div>
            <p className="file-upload-text">Drag & drop your property photos here, or click to browse.</p>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>High-quality images increase booking chances.</p>
            <input 
              type="file" 
              accept="image/*" 
              multiple 
              onChange={handleFileChange} 
              className="file-upload-input"
            />
            {images.length > 0 && (
              <div className="selected-files-count">
                ✓ {images.length} file(s) selected
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions-footer">
          <button type="button" className="btn-outline" onClick={() => navigate('/owner/dashboard')} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className="btn-solid btn-large" disabled={submitting}>
            {submitting ? 'Posting Space...' : 'Publish Listing'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateProperty;
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTrendingCities, getProperties } from '../api';
import { StaggerTestimonials } from '../components/ui/stagger-testimonials';
import { TravelCard } from '../components/ui/card-7';
import { DestinationCard } from '../components/ui/card-21';
import GeometricBackground from '../components/ui/geometric';

// Static Data based on Figma Design
const PROPERTY_TYPES = [
  { id: 'HALL', name: 'Hall', image: 'https://thearchitectsdiary.com/wp-content/uploads/2023/03/Andspaces-1.jpg', themeColor: '15 100% 50%', flag: '🏢' },
  { id: 'HOUSE', name: 'House', image: 'https://i.pinimg.com/736x/c4/ee/a4/c4eea4906647b7c01cc0e9f98862f9ce.jpg', themeColor: '15 100% 45%', flag: '🏠' },
  { id: 'BANQUET', name: 'Banquet', image: 'https://www.oyorooms.com/blog/wp-content/uploads/2018/03/fe-34.jpg', themeColor: '15 90% 40%', flag: '🎉' },
  { id: 'FARMHOUSE', name: 'Farmhouse', image: 'https://img.vistarooms.com/gallery/idyllic-farmhouse-a-glasshouse-486fe6.jpg', themeColor: '15 85% 45%', flag: '🌲' },
  { id: 'ROOFTOP', name: 'Rooftop', image: 'https://thumbs.dreamstime.com/b/modern-rooftop-terrace-city-night-view-379207840.jpg', themeColor: '15 95% 55%', flag: '🌃' },
  { id: 'STUDIO', name: 'Studio', image: 'https://5.imimg.com/data5/SELLER/Default/2025/2/492123020/VO/EP/PV/241569586/indoor-studio-rental-services.jpg', themeColor: '15 100% 60%', flag: '🎥' },
  { id: 'MEETING_ROOM', name: 'Meeting', image: 'https://www.wework.com/ideas/wp-content/uploads/sites/4/2021/08/20201008-199WaterSt-2_fb.jpg?fit=1200%2C675', themeColor: '15 100% 40%', flag: '💼' },
  { id: 'CAFE_SPACE', name: 'Cafe', image: 'https://surenspace.com/wp-content/uploads/2024/10/Indoor-Garden-Cafe-Best-Top-10-Coffee-Shop-Designs-that-Suitable-for-Small-Spaces-surenspace.webp', themeColor: '15 90% 50%', flag: '☕' }
];

// Fallback skeleton arrays for loading states
const SKELETON_CITIES = Array(8).fill(null);
const SKELETON_PROPS = Array(3).fill(null);

function Home() {
  const navigate = useNavigate();
  const [cities, setCities] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch API data concurrently
    Promise.all([
      getTrendingCities().catch(() => []),
      // Assuming Gwalior is City ID 4 as per previous setup
      getProperties(4, { page: 0, size: 5 }).catch(() => []) 
    ]).then(([citiesData, propertiesData]: any) => {
      setCities(citiesData);
      setProperties(Array.isArray(propertiesData) ? propertiesData : (propertiesData as any)?.content || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="home-container">
      
      {/* 1. Hero Section */}
      <GeometricBackground className="hero-section">
        <div className="hero-content">
          <h1>Find Trusted Spaces<br/>For Every Occasion</h1>
          <p>Book verified spaces for meetings, events, workspaces, celebrations, shoots, workshops, and stays — all in one platform.</p>
          <button className="btn-hero" onClick={() => navigate('/properties')}>
            Explore Spaces
          </button>
        </div>
      </GeometricBackground>

      {/* 2. Trending Cities */}
      <section>
        <div className="section-header">
          <h2>Trending Cities</h2>
          <span className="arrow-icon">→</span>
        </div>
        <div className="horizontal-scroll">
          {(loading ? SKELETON_CITIES : cities).map((city, idx) => (
            <div key={city?.id || idx} className="circle-card" onClick={() => city && navigate(`/properties?cityId=${city.id}`)}>
              {city?.imageUrl ? (
                <img src={city.imageUrl} alt={city.name} className="circle-avatar" />
              ) : (
                <div className="circle-avatar">✿</div>
              )}
              <span>{city ? city.name : 'Loading'}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Properties Section */}
      <section>
        <div className="section-header">
          <h2>Properties</h2>
          <span className="arrow-icon">→</span>
        </div>
        <div className="horizontal-scroll">
          {(loading ? SKELETON_PROPS : properties).map((prop, idx) => {
            const propertyImage = prop?.images?.find((img: any) => img.isPrimary)?.imageUrl || prop?.images?.[0]?.imageUrl;
            const fallbackImage = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop';
            
            if (!prop) {
              return (
                <div key={idx} className="rect-card skeleton" style={{ minWidth: '200px', height: '250px', backgroundColor: '#e2e8f0', borderRadius: '0.75rem' }}></div>
              );
            }

            return (
              <TravelCard
                key={prop.id}
                className="shrink-0 min-w-[180px] sm:min-w-[200px] h-[250px] cursor-pointer text-left"
                imageUrl={propertyImage || fallbackImage}
                imageAlt={prop.title || 'Property'}
                title={prop.title || 'Property Name'}
                location={prop.address || 'Unknown Location'}
                overview={prop.description || 'Discover this amazing space for your next event or stay. Perfect for your upcoming gatherings.'}
                price={prop.hourlyPrice || 0}
                pricePeriod="/ hr"
                onBookNow={() => navigate(`/properties/${prop.id}`)}
                onClick={() => navigate(`/properties/${prop.id}`)}
              />
            );
          })}
        </div>
      </section>

      {/* 4. Property Type Section */}
      <section>
        <div className="section-header">
          <h2>Property Type</h2>
          <span className="arrow-icon">→</span>
        </div>
        <div className="horizontal-scroll gap-4 py-2">
          {PROPERTY_TYPES.map((type) => (
            <DestinationCard
              key={type.id}
              className="w-[160px] h-[220px]"
              imageUrl={type.image}
              location={type.name}
              flag={type.flag}
              stats="View spaces"
              themeColor={type.themeColor}
              onClick={() => navigate(`/properties?propertyType=${type.id}`)}
            />
          ))}
        </div>
      </section>

      {/* 5. Testimonials Section */}
      <section className="reviews-section">
        <div className="section-header" style={{ justifyContent: 'center', marginBottom: '2rem' }}>
          <h2>What our users say</h2>
        </div>
        <StaggerTestimonials />
      </section>

    </div>
  );
}

export default Home;
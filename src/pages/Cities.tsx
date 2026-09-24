import { useEffect, useState } from 'react';
import { getCities, getTrendingCities } from '../api';

function Cities() {
  const [cities, setCities] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCities()
      .then(setCities)
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load cities'));
    getTrendingCities()
      .then(setTrending)
      .catch(() => undefined);
  }, []);

  return (
    <section className="page-card">
      <h1 className="section-title">Cities</h1>
      {error && <div className="status-message">{error}</div>}
      <div className="grid grid-2">
        {trending.length > 0 && (
          <div className="card">
            <h3>Trending</h3>
            <ul>
              {trending.map((city) => (
                <li key={city.id}>{city.name} · {city.state}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="card">
          <h3>All Cities</h3>
          <ul>
            {cities.map((city) => (
              <li key={city.id}>{city.name}, {city.state} — {city.propertyCount} listings</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default Cities;

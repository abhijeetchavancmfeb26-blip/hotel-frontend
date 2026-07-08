import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const Home = () => {
  const [hotels, setHotels] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCities();
    fetchHotels();
  }, []);

  useEffect(() => {
    if (selectedCity) {
      fetchHotelsByCity(selectedCity);
    } else {
      fetchHotels();
    }
  }, [selectedCity]);

  const fetchCities = async () => {
    try {
      const res = await axios.get(`${API_URL}/cities`);
      setCities(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchHotels = async () => {
    try {
      const res = await axios.get(`${API_URL}/hotels`);
      setHotels(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchHotelsByCity = async (cityId) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/hotels/city/${cityId}`);
      setHotels(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchLocation.trim()) {
      selectedCity ? fetchHotelsByCity(selectedCity) : fetchHotels();
      return;
    }
    try {
      const res = await axios.get(`${API_URL}/hotels/search?location=${searchLocation}`);
      setHotels(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <h1>Find Your Perfect Hotel</h1>
        <p>Browse and book from a wide selection of hotels across major cities.</p>
        <form onSubmit={handleSearch} className="search-bar">
          <select
            className="form-control"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="">All Cities</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <input
            type="text"
            className="form-control"
            placeholder="Search by location..."
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
      </section>

      {/* Hotels */}
      <div className="page">
        <div className="container">
          <div className="page-header">
            <h2>Available Hotels</h2>
            <span className="text-muted text-sm">{hotels.length} hotel{hotels.length !== 1 ? 's' : ''} found</span>
          </div>

          {loading ? (
            <div className="spinner-wrap"><div className="spinner"></div></div>
          ) : hotels.length === 0 ? (
            <div className="alert alert-info">No hotels found. Try adjusting your search.</div>
          ) : (
            <div className="grid grid-auto">
              {hotels.map((hotel) => (
                <div key={hotel.id} className="card">
                  {hotel.imageUrl
                    ? <img className="card-img-top" src={hotel.imageUrl} alt={hotel.name} />
                    : <div className="card-placeholder-img">🏨</div>
                  }
                  <div className="card-body">
                    <div className="card-title">{hotel.name}</div>
                    <p className="card-text">📍 {hotel.location}{hotel.city ? `, ${hotel.city.name}` : ''}</p>
                    <p className="card-text">⭐ {hotel.rating}</p>
                    {hotel.description && (
                      <p className="card-text text-muted text-sm" style={{
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {hotel.description}
                      </p>
                    )}
                    <div className="mt-3">
                      <button
                        className="btn btn-primary btn-block"
                        onClick={() => navigate('/book')}
                      >
                        View Rooms
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

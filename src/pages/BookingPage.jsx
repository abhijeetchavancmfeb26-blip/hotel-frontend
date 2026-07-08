import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const BookingPage = () => {
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCities();
    fetchHotels();
  }, []);

  useEffect(() => {
    setSelectedHotel(null);
    setRooms([]);
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
    } catch (e) { console.error(e); }
  };

  const fetchHotels = async () => {
    try {
      const res = await axios.get(`${API_URL}/hotels`);
      setHotels(res.data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const fetchHotelsByCity = async (cityId) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/hotels/city/${cityId}`);
      setHotels(res.data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const fetchRooms = async (hotelId) => {
    try {
      setError('');
      setRoomsLoading(true);
      const res = await axios.get(`${API_URL}/rooms/hotel/${hotelId}/available`);
      const roomData = Array.isArray(res.data) ? res.data : res.data?.rooms || [];
      setRooms(roomData);
      setSelectedHotel(hotelId);
      if (roomData.length === 0) setError('No available rooms for this hotel.');
    } catch (e) {
      setError('Failed to load rooms.');
    } finally {
      setRoomsLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h2>Book a Room</h2>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {/* City filter */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Filter by City</label>
              <select
                className="form-control"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                style={{ maxWidth: '300px' }}
              >
                <option value="">All Cities</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Hotels */}
        {loading ? (
          <div className="spinner-wrap"><div className="spinner"></div></div>
        ) : hotels.length === 0 ? (
          <div className="alert alert-info">No hotels found. Try a different city.</div>
        ) : (
          <div className="grid grid-auto mb-5">
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
                    <p className="card-text text-muted text-sm">{hotel.description}</p>
                  )}
                  <div className="mt-3">
                    <button
                      className="btn btn-primary btn-block"
                      onClick={() => fetchRooms(hotel.id)}
                      disabled={roomsLoading && selectedHotel === hotel.id}
                    >
                      {roomsLoading && selectedHotel === hotel.id
                        ? 'Loading rooms...'
                        : selectedHotel === hotel.id
                        ? 'Viewing Rooms ↓'
                        : 'View Rooms'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rooms */}
        {selectedHotel && rooms.length > 0 && (
          <div>
            <h3 style={{ marginBottom: '1rem', color: '#1e3a5f' }}>Available Rooms</h3>
            <div className="grid grid-auto">
              {rooms.map((room) => (
                <div key={room.id} className="card">
                  <div className="card-body">
                    <div className="card-title">Room {room.roomNumber}</div>
                    <div className="summary-box mb-3">
                      <div className="summary-row"><span>Type</span><span>{room.roomType}</span></div>
                      <div className="summary-row"><span>AC</span><span>{room.acType}</span></div>
                      <div className="summary-row"><span>Capacity</span><span>{room.capacity} guests</span></div>
                      <div className="summary-total flex justify-between">
                        <span>Price</span><span>₹{room.price}/night</span>
                      </div>
                    </div>
                    {room.description && (
                      <p className="text-muted text-sm mb-3">{room.description}</p>
                    )}
                    <button
                      className="btn btn-success btn-block"
                      onClick={() => navigate(`/booking/${room.id}`)}
                    >
                      Book This Room
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;

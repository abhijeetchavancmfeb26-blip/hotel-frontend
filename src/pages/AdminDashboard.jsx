import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const statusBadge = (status) => {
  const map = { PENDING: 'badge-warning', CONFIRMED: 'badge-success', CANCELLED: 'badge-danger', PAID: 'badge-info' };
  return <span className={`badge ${map[status] || 'badge-gray'}`}>{status}</span>;
};

const Modal = ({ title, show, onClose, onSubmit, children }) => {
  if (!show) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h5>{title}</h5>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="modal-body">{children}</div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [tab, setTab] = useState('cities');
  const [cities, setCities] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showCityModal, setShowCityModal] = useState(false);
  const [showHotelModal, setShowHotelModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingCity, setEditingCity] = useState(null);
  const [editingHotel, setEditingHotel] = useState(null);
  const [editingRoom, setEditingRoom] = useState(null);

  const [cityForm, setCityForm] = useState({ name: '', description: '' });
  const [hotelForm, setHotelForm] = useState({ name: '', location: '', description: '', rating: '', imageUrl: '', cityId: '' });
  const [roomForm, setRoomForm] = useState({ roomNumber: '', roomType: '', acType: '', price: '', capacity: '', description: '', hotelId: '', isAvailable: true });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [c, h, r, b] = await Promise.all([
        axios.get(`${API_URL}/cities`),
        axios.get(`${API_URL}/hotels`),
        axios.get(`${API_URL}/rooms`),
        axios.get(`${API_URL}/admin/bookings`)
      ]);
      setCities(c.data); setHotels(h.data); setRooms(r.data); setBookings(b.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const alert = (type, msg) => {
    if (type === 'success') setSuccess(msg); else setError(msg);
    setTimeout(() => { setSuccess(''); setError(''); }, 4000);
  };

  /* City CRUD */
  const handleCitySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCity) await axios.put(`${API_URL}/admin/cities/${editingCity.id}`, cityForm);
      else await axios.post(`${API_URL}/admin/cities`, cityForm);
      alert('success', `City ${editingCity ? 'updated' : 'created'} successfully!`);
      setShowCityModal(false); setCityForm({ name: '', description: '' }); setEditingCity(null); fetchAll();
    } catch (e) { alert('error', e.response?.data || 'Failed to save city.'); }
  };

  const handleDeleteCity = async (id) => {
    if (!window.confirm('Delete this city?')) return;
    try { await axios.delete(`${API_URL}/admin/cities/${id}`); alert('success', 'City deleted.'); fetchAll(); }
    catch (e) { alert('error', 'Failed to delete city.'); }
  };

  /* Hotel CRUD */
  const handleHotelSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...hotelForm, rating: parseFloat(hotelForm.rating), city: { id: parseInt(hotelForm.cityId) } };
      if (editingHotel) await axios.put(`${API_URL}/admin/hotels/${editingHotel.id}`, data);
      else await axios.post(`${API_URL}/admin/hotels`, data);
      alert('success', `Hotel ${editingHotel ? 'updated' : 'created'} successfully!`);
      setShowHotelModal(false); setHotelForm({ name: '', location: '', description: '', rating: '', imageUrl: '', cityId: '' }); setEditingHotel(null); fetchAll();
    } catch (e) { alert('error', e.response?.data || 'Failed to save hotel.'); }
  };

  const handleDeleteHotel = async (id) => {
    if (!window.confirm('Delete this hotel?')) return;
    try { await axios.delete(`${API_URL}/admin/hotels/${id}`); alert('success', 'Hotel deleted.'); fetchAll(); }
    catch (e) { alert('error', 'Failed to delete hotel.'); }
  };

  /* Room CRUD */
  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...roomForm, price: parseFloat(roomForm.price), capacity: parseInt(roomForm.capacity), hotel: { id: parseInt(roomForm.hotelId) } };
      if (editingRoom) await axios.put(`${API_URL}/admin/rooms/${editingRoom.id}`, data);
      else await axios.post(`${API_URL}/admin/rooms`, data);
      alert('success', `Room ${editingRoom ? 'updated' : 'created'} successfully!`);
      setShowRoomModal(false); setRoomForm({ roomNumber: '', roomType: '', acType: '', price: '', capacity: '', description: '', hotelId: '', isAvailable: true }); setEditingRoom(null); fetchAll();
    } catch (e) { alert('error', e.response?.data || 'Failed to save room.'); }
  };

  const handleDeleteRoom = async (id) => {
    if (!window.confirm('Delete this room?')) return;
    try { await axios.delete(`${API_URL}/admin/rooms/${id}`); alert('success', 'Room deleted.'); fetchAll(); }
    catch (e) { alert('error', 'Failed to delete room.'); }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner"></div></div>;

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h2>Admin Dashboard</h2>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="tabs">
          {['cities', 'hotels', 'rooms', 'bookings'].map((t) => (
            <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Cities Tab */}
        {tab === 'cities' && (
          <div className="card">
            <div className="card-header">
              <h5>Manage Cities</h5>
              <button className="btn btn-primary btn-sm" onClick={() => { setCityForm({ name: '', description: '' }); setEditingCity(null); setShowCityModal(true); }}>
                + Add City
              </button>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>ID</th><th>Name</th><th>Description</th><th>Actions</th></tr></thead>
                <tbody>
                  {cities.map((c) => (
                    <tr key={c.id}>
                      <td>{c.id}</td><td>{c.name}</td><td>{c.description}</td>
                      <td>
                        <button className="btn btn-warning btn-sm" style={{ marginRight: '0.4rem' }}
                          onClick={() => { setEditingCity(c); setCityForm({ name: c.name, description: c.description || '' }); setShowCityModal(true); }}>
                          Edit
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteCity(c.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                  {cities.length === 0 && <tr><td colSpan={4} className="text-center text-muted">No cities yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Hotels Tab */}
        {tab === 'hotels' && (
          <div className="card">
            <div className="card-header">
              <h5>Manage Hotels</h5>
              <button className="btn btn-primary btn-sm" onClick={() => { setHotelForm({ name: '', location: '', description: '', rating: '', imageUrl: '', cityId: '' }); setEditingHotel(null); setShowHotelModal(true); }}>
                + Add Hotel
              </button>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>ID</th><th>Name</th><th>Location</th><th>City</th><th>Rating</th><th>Actions</th></tr></thead>
                <tbody>
                  {hotels.map((h) => (
                    <tr key={h.id}>
                      <td>{h.id}</td><td>{h.name}</td><td>{h.location}</td><td>{h.city?.name}</td><td>⭐ {h.rating}</td>
                      <td>
                        <button className="btn btn-warning btn-sm" style={{ marginRight: '0.4rem' }}
                          onClick={() => { setEditingHotel(h); setHotelForm({ name: h.name, location: h.location, description: h.description, rating: String(h.rating), imageUrl: h.imageUrl || '', cityId: String(h.city?.id || '') }); setShowHotelModal(true); }}>
                          Edit
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteHotel(h.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                  {hotels.length === 0 && <tr><td colSpan={6} className="text-center text-muted">No hotels yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Rooms Tab */}
        {tab === 'rooms' && (
          <div className="card">
            <div className="card-header">
              <h5>Manage Rooms</h5>
              <button className="btn btn-primary btn-sm" onClick={() => { setRoomForm({ roomNumber: '', roomType: '', acType: '', price: '', capacity: '', description: '', hotelId: '', isAvailable: true }); setEditingRoom(null); setShowRoomModal(true); }}>
                + Add Room
              </button>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>ID</th><th>Room#</th><th>Type</th><th>AC</th><th>Hotel</th><th>Price</th><th>Capacity</th><th>Available</th><th>Actions</th></tr></thead>
                <tbody>
                  {rooms.map((r) => (
                    <tr key={r.id}>
                      <td>{r.id}</td><td>{r.roomNumber}</td><td>{r.roomType}</td><td>{r.acType}</td>
                      <td>{r.hotel?.name}</td><td>₹{r.price}</td><td>{r.capacity}</td>
                      <td>{r.isAvailable ? '✅' : '❌'}</td>
                      <td>
                        <button className="btn btn-warning btn-sm" style={{ marginRight: '0.4rem' }}
                          onClick={() => { setEditingRoom(r); setRoomForm({ roomNumber: r.roomNumber, roomType: r.roomType, acType: r.acType, price: String(r.price), capacity: String(r.capacity), description: r.description || '', hotelId: String(r.hotel?.id || ''), isAvailable: r.isAvailable }); setShowRoomModal(true); }}>
                          Edit
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteRoom(r.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                  {rooms.length === 0 && <tr><td colSpan={9} className="text-center text-muted">No rooms yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {tab === 'bookings' && (
          <div className="card">
            <div className="card-header"><h5>All Bookings</h5></div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>ID</th><th>User</th><th>Hotel</th><th>Room</th><th>Check-in</th><th>Check-out</th><th>Guests</th><th>Total</th><th>Status</th></tr></thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id}>
                      <td>{b.id}</td><td>{b.user?.name}</td><td>{b.room?.hotel?.name}</td>
                      <td>{b.room?.roomNumber}</td><td>{b.checkInDate}</td><td>{b.checkOutDate}</td>
                      <td>{b.numberOfGuests}</td><td>₹{b.totalPrice?.toFixed(2)}</td>
                      <td>{statusBadge(b.bookingStatus)}</td>
                    </tr>
                  ))}
                  {bookings.length === 0 && <tr><td colSpan={9} className="text-center text-muted">No bookings yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* City Modal */}
      <Modal title={editingCity ? 'Edit City' : 'Add City'} show={showCityModal} onClose={() => setShowCityModal(false)} onSubmit={handleCitySubmit}>
        <div className="form-group">
          <label className="form-label">City Name</label>
          <input type="text" className="form-control" value={cityForm.name} onChange={(e) => setCityForm({ ...cityForm, name: e.target.value })} required />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-control" value={cityForm.description} onChange={(e) => setCityForm({ ...cityForm, description: e.target.value })} />
        </div>
      </Modal>

      {/* Hotel Modal */}
      <Modal title={editingHotel ? 'Edit Hotel' : 'Add Hotel'} show={showHotelModal} onClose={() => setShowHotelModal(false)} onSubmit={handleHotelSubmit}>
        <div className="form-group">
          <label className="form-label">Hotel Name</label>
          <input type="text" className="form-control" value={hotelForm.name} onChange={(e) => setHotelForm({ ...hotelForm, name: e.target.value })} required />
        </div>
        <div className="form-group">
          <label className="form-label">Location</label>
          <input type="text" className="form-control" value={hotelForm.location} onChange={(e) => setHotelForm({ ...hotelForm, location: e.target.value })} required />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-control" value={hotelForm.description} onChange={(e) => setHotelForm({ ...hotelForm, description: e.target.value })} required />
        </div>
        <div className="form-group">
          <label className="form-label">Rating (0–5)</label>
          <input type="number" step="0.1" min="0" max="5" className="form-control" value={hotelForm.rating} onChange={(e) => setHotelForm({ ...hotelForm, rating: e.target.value })} required />
        </div>
        <div className="form-group">
          <label className="form-label">City</label>
          <select className="form-control" value={hotelForm.cityId} onChange={(e) => setHotelForm({ ...hotelForm, cityId: e.target.value })} required>
            <option value="">Select city</option>
            {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Image URL (optional)</label>
          <input type="url" className="form-control" placeholder="https://example.com/image.jpg" value={hotelForm.imageUrl} onChange={(e) => setHotelForm({ ...hotelForm, imageUrl: e.target.value })} />
        </div>
      </Modal>

      {/* Room Modal */}
      <Modal title={editingRoom ? 'Edit Room' : 'Add Room'} show={showRoomModal} onClose={() => setShowRoomModal(false)} onSubmit={handleRoomSubmit}>
        <div className="form-group">
          <label className="form-label">Room Number</label>
          <input type="text" className="form-control" value={roomForm.roomNumber} onChange={(e) => setRoomForm({ ...roomForm, roomNumber: e.target.value })} required />
        </div>
        <div className="form-group">
          <label className="form-label">Room Type</label>
          <select className="form-control" value={roomForm.roomType} onChange={(e) => setRoomForm({ ...roomForm, roomType: e.target.value })} required>
            <option value="">Select type</option>
            {['Single', 'Double', 'Suite', 'Deluxe'].map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">AC Type</label>
          <select className="form-control" value={roomForm.acType} onChange={(e) => setRoomForm({ ...roomForm, acType: e.target.value })} required>
            <option value="">Select AC type</option>
            <option value="AC">AC</option>
            <option value="Non-AC">Non-AC</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Price per Night (₹)</label>
          <input type="number" step="0.01" min="0" className="form-control" value={roomForm.price} onChange={(e) => setRoomForm({ ...roomForm, price: e.target.value })} required />
        </div>
        <div className="form-group">
          <label className="form-label">Capacity (guests)</label>
          <input type="number" min="1" className="form-control" value={roomForm.capacity} onChange={(e) => setRoomForm({ ...roomForm, capacity: e.target.value })} required />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-control" value={roomForm.description} onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">Hotel</label>
          <select className="form-control" value={roomForm.hotelId} onChange={(e) => setRoomForm({ ...roomForm, hotelId: e.target.value })} required disabled={!!editingRoom}>
            <option value="">Select hotel</option>
            {hotels.map((h) => <option key={h.id} value={h.id}>{h.name} — {h.location}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={roomForm.isAvailable} onChange={(e) => setRoomForm({ ...roomForm, isAvailable: e.target.checked })} />
            Available
          </label>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboard;

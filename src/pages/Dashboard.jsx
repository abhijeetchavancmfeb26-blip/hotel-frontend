import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const statusBadge = (status) => {
  const map = {
    PENDING: 'badge-warning',
    CONFIRMED: 'badge-success',
    CANCELLED: 'badge-danger',
    PAID: 'badge-info',
  };
  return <span className={`badge ${map[status] || 'badge-gray'}`}>{status}</span>;
};

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${API_URL}/bookings`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setBookings(res.data);
    } catch (e) {
      setError('Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await axios.delete(`${API_URL}/bookings/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSuccess('Booking cancelled successfully.');
      fetchBookings();
    } catch (e) {
      setError('Failed to cancel booking.');
    }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner"></div></div>;

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h2>My Bookings</h2>
          <button className="btn btn-primary" onClick={() => navigate('/book')}>+ New Booking</button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {bookings.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏨</div>
            <h3 style={{ marginBottom: '0.5rem' }}>No bookings yet</h3>
            <p className="text-muted mb-4">Start by booking a room.</p>
            <button className="btn btn-primary" onClick={() => navigate('/book')}>Book a Room</button>
          </div>
        ) : (
          <div className="grid grid-2">
            {bookings.map((booking) => (
              <div key={booking.id} className="card">
                <div className="card-body">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <div className="card-title">{booking.room?.hotel?.name || 'N/A'}</div>
                      <div className="text-muted text-sm">📍 {booking.room?.hotel?.city?.name || 'Unknown City'}</div>
                    </div>
                    <span className="badge badge-gray">#{booking.id}</span>
                  </div>

                  <div className="summary-box mb-3">
                    <div className="summary-row">
                      <span>Room</span>
                      <span>{booking.room?.roomNumber} — {booking.room?.roomType} ({booking.room?.acType})</span>
                    </div>
                    <div className="summary-row">
                      <span>Check-in</span>
                      <span>{booking.checkInDate}</span>
                    </div>
                    <div className="summary-row">
                      <span>Check-out</span>
                      <span>{booking.checkOutDate}</span>
                    </div>
                    <div className="summary-row">
                      <span>Guests</span>
                      <span>{booking.numberOfGuests}</span>
                    </div>
                    <div className="summary-total flex justify-between">
                      <span>Total</span>
                      <span>₹{booking.totalPrice?.toFixed(2) || '0.00'}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 items-center justify-between">
                    <div className="flex gap-2">
                      {statusBadge(booking.bookingStatus)}
                      {statusBadge(booking.paymentStatus)}
                    </div>
                    <div className="flex gap-2">
                      {booking.bookingStatus !== 'CANCELLED' && booking.paymentStatus !== 'PAID' && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleCancel(booking.id)}>Cancel</button>
                      )}
                      {booking.paymentStatus === 'PENDING' && booking.bookingStatus === 'PENDING' && (
                        <button className="btn btn-primary btn-sm" onClick={() => navigate(`/booking/${booking.room?.id}`)}>
                          Pay Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

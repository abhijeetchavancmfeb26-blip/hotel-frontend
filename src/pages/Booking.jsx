import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const Booking = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState(1);
  const [booking, setBooking] = useState(null);
  const [days, setDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const [bookingForm, setBookingForm] = useState({
    checkInDate: '', checkOutDate: '', numberOfGuests: 1
  });
  const [guestForm, setGuestForm] = useState({
    guestName: '', guestEmail: '', guestPhone: '', guestAddress: ''
  });
  const [paymentForm, setPaymentForm] = useState({
    paymentMethod: 'CARD', cardNumber: '', cardHolderName: '', expiryDate: '', cvv: ''
  });

  useEffect(() => { fetchRoom(); }, [roomId]);

  useEffect(() => {
    if (bookingForm.checkInDate && bookingForm.checkOutDate && room) {
      const d = Math.ceil((new Date(bookingForm.checkOutDate) - new Date(bookingForm.checkInDate)) / 86400000);
      setDays(d > 0 ? d : 0);
      setTotalPrice(d > 0 ? room.price * d : 0);
    }
  }, [bookingForm.checkInDate, bookingForm.checkOutDate, room]);

  const fetchRoom = async () => {
    try {
      const res = await axios.get(`${API_URL}/rooms/${roomId}`);
      setRoom(res.data);
    } catch (e) {
      setError('Failed to load room details.');
    } finally {
      setLoading(false);
    }
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();
    const checkIn = new Date(bookingForm.checkInDate);
    const checkOut = new Date(bookingForm.checkOutDate);
    if (checkOut <= checkIn) { setError('Check-out must be after check-in.'); return; }
    if (checkIn < new Date().setHours(0,0,0,0)) { setError('Check-in cannot be in the past.'); return; }
    setError('');
    setStep(2);
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setError('');
    setProcessing(true);
    try {
      const res = await axios.post(`${API_URL}/bookings`, {
        checkInDate: bookingForm.checkInDate,
        checkOutDate: bookingForm.checkOutDate,
        numberOfGuests: parseInt(bookingForm.numberOfGuests),
        guestName: guestForm.guestName,
        guestEmail: guestForm.guestEmail,
        guestPhone: guestForm.guestPhone,
        guestAddress: guestForm.guestAddress,
        room: { id: parseInt(roomId) },
        user: { id: null }
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.data?.id) {
        setBooking(res.data);
        setStep(3);
      } else {
        setError('Failed to create booking. Please try again.');
      }
    } catch (e) {
      const msg = e.response?.data;
      setError(typeof msg === 'string' ? msg : msg?.message || 'Failed to create booking.');
    } finally {
      setProcessing(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setProcessing(true);
    try {
      let paymentData = { bookingId: booking.id, paymentMethod: paymentForm.paymentMethod };
      if (paymentForm.paymentMethod === 'CARD') {
        paymentData = { ...paymentData, cardNumber: paymentForm.cardNumber, cardHolderName: paymentForm.cardHolderName, expiryDate: paymentForm.expiryDate, cvv: paymentForm.cvv };
      } else if (paymentForm.paymentMethod === 'UPI') {
        paymentData = { ...paymentData, upiId: paymentForm.cardNumber, amount: totalPrice };
      } else {
        paymentData = { ...paymentData, accountNumber: paymentForm.cardNumber };
      }

      const res = await axios.post(`${API_URL}/payments/process`, paymentData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      let data = res.data;
      if (typeof data === 'string') { try { data = JSON.parse(data); } catch (_) {} }

      if (data?.success === true) {
        setSuccess('Payment successful! Booking confirmed. Redirecting...');
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        setError(data?.message || 'Payment failed. Please try again.');
      }
    } catch (e) {
      const msg = e.response?.data;
      setError(typeof msg === 'string' ? msg : msg?.message || 'Payment processing failed.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner"></div></div>;
  if (!room) return <div className="page container"><div className="alert alert-danger">Room not found.</div></div>;

  return (
    <div className="page">
      <div className="container">
        <h2 style={{ marginBottom: '1.5rem', color: '#1e3a5f' }}>Complete Your Booking</h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* Steps indicator */}
        <div className="steps mb-4">
          <div className={`step ${step >= 1 ? (step > 1 ? 'done' : 'active') : ''}`}>
            <span className="step-num">{step > 1 ? '✓' : '1'}</span> Dates
          </div>
          <div className={`step ${step >= 2 ? (step > 2 ? 'done' : 'active') : ''}`}>
            <span className="step-num">{step > 2 ? '✓' : '2'}</span> Guest Info
          </div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <span className="step-num">3</span> Payment
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'start' }}>
          {/* Main form */}
          <div className="card">
            <div className="card-body">
              {/* Step 1 */}
              {step === 1 && (
                <form onSubmit={handleStep1Submit}>
                  <h5 style={{ marginBottom: '1rem' }}>Select Dates</h5>
                  <div className="form-group">
                    <label className="form-label">Check-in Date</label>
                    <input type="date" name="checkInDate" className="form-control"
                      value={bookingForm.checkInDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setBookingForm({ ...bookingForm, checkInDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Check-out Date</label>
                    <input type="date" name="checkOutDate" className="form-control"
                      value={bookingForm.checkOutDate}
                      min={bookingForm.checkInDate || new Date().toISOString().split('T')[0]}
                      onChange={(e) => setBookingForm({ ...bookingForm, checkOutDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Number of Guests</label>
                    <input type="number" className="form-control"
                      value={bookingForm.numberOfGuests}
                      min={1} max={room.capacity}
                      onChange={(e) => setBookingForm({ ...bookingForm, numberOfGuests: e.target.value })}
                      required
                    />
                    <p className="form-hint">Max capacity: {room.capacity} guests</p>
                  </div>
                  <button type="submit" className="btn btn-primary">Continue to Guest Info →</button>
                </form>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <form onSubmit={handleStep2Submit}>
                  <h5 style={{ marginBottom: '1rem' }}>Guest Information</h5>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-control" value={guestForm.guestName}
                      onChange={(e) => setGuestForm({ ...guestForm, guestName: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={guestForm.guestEmail}
                      onChange={(e) => setGuestForm({ ...guestForm, guestEmail: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input type="tel" className="form-control" value={guestForm.guestPhone}
                      onChange={(e) => setGuestForm({ ...guestForm, guestPhone: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Address</label>
                    <textarea className="form-control" value={guestForm.guestAddress}
                      onChange={(e) => setGuestForm({ ...guestForm, guestAddress: e.target.value })} required />
                  </div>
                  <div className="flex gap-3">
                    <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>← Back</button>
                    <button type="submit" className="btn btn-primary" disabled={processing}>
                      {processing ? 'Processing...' : 'Continue to Payment →'}
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <form onSubmit={handlePaymentSubmit}>
                  <h5 style={{ marginBottom: '1rem' }}>Payment</h5>
                  {booking && (
                    <div className="alert alert-info">
                      Booking #{booking.id} created. Total: ₹{(totalPrice || booking.totalPrice || 0).toFixed(2)}
                    </div>
                  )}
                  <div className="form-group">
                    <label className="form-label">Payment Method</label>
                    <select className="form-control" value={paymentForm.paymentMethod}
                      onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}>
                      <option value="CARD">Credit / Debit Card</option>
                      <option value="UPI">UPI</option>
                      <option value="NETBANKING">Net Banking</option>
                      <option value="WALLET">Wallet</option>
                    </select>
                  </div>

                  {paymentForm.paymentMethod === 'CARD' && (
                    <>
                      <div className="form-group">
                        <label className="form-label">Card Number</label>
                        <input type="text" className="form-control" placeholder="1234 5678 9012 3456"
                          value={paymentForm.cardNumber} minLength={13} maxLength={19}
                          onChange={(e) => setPaymentForm({ ...paymentForm, cardNumber: e.target.value })} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Cardholder Name</label>
                        <input type="text" className="form-control" value={paymentForm.cardHolderName}
                          onChange={(e) => setPaymentForm({ ...paymentForm, cardHolderName: e.target.value })} required />
                      </div>
                      <div className="grid grid-2">
                        <div className="form-group">
                          <label className="form-label">Expiry (MM/YY)</label>
                          <input type="text" className="form-control" placeholder="MM/YY"
                            value={paymentForm.expiryDate}
                            onChange={(e) => setPaymentForm({ ...paymentForm, expiryDate: e.target.value })} required />
                        </div>
                        <div className="form-group">
                          <label className="form-label">CVV</label>
                          <input type="text" className="form-control" placeholder="123"
                            value={paymentForm.cvv} maxLength={3}
                            onChange={(e) => setPaymentForm({ ...paymentForm, cvv: e.target.value })} required />
                        </div>
                      </div>
                    </>
                  )}

                  {paymentForm.paymentMethod === 'UPI' && (
                    <div className="form-group">
                      <label className="form-label">UPI ID</label>
                      <input type="text" className="form-control" placeholder="yourname@paytm"
                        value={paymentForm.cardNumber}
                        onChange={(e) => setPaymentForm({ ...paymentForm, cardNumber: e.target.value })} required />
                      <p className="form-hint">e.g. 9876543210@paytm, user@googlepay</p>
                    </div>
                  )}

                  {paymentForm.paymentMethod === 'NETBANKING' && (
                    <div className="form-group">
                      <label className="form-label">Account Number</label>
                      <input type="text" className="form-control" placeholder="Enter account number"
                        value={paymentForm.cardNumber}
                        onChange={(e) => setPaymentForm({ ...paymentForm, cardNumber: e.target.value })} required />
                    </div>
                  )}

                  {paymentForm.paymentMethod === 'WALLET' && (
                    <div className="form-group">
                      <label className="form-label">Wallet ID</label>
                      <input type="text" className="form-control" placeholder="Enter wallet ID"
                        value={paymentForm.cardNumber}
                        onChange={(e) => setPaymentForm({ ...paymentForm, cardNumber: e.target.value })} required />
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button type="button" className="btn btn-secondary" onClick={() => setStep(2)}>← Back</button>
                    <button type="submit" className="btn btn-success" disabled={processing || !booking}>
                      {processing ? 'Processing...' : `Pay ₹${totalPrice.toFixed(2)}`}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Summary sidebar */}
          <div className="card" style={{ position: 'sticky', top: '80px' }}>
            <div className="card-header"><h5>Booking Summary</h5></div>
            <div className="card-body">
              <div className="summary-box">
                <div className="summary-row"><span>Hotel</span><span>{room.hotel?.name}</span></div>
                <div className="summary-row"><span>Room</span><span>{room.roomNumber} ({room.roomType})</span></div>
                <div className="summary-row"><span>AC</span><span>{room.acType}</span></div>
                <div className="summary-row"><span>Rate</span><span>₹{room.price}/night</span></div>
                {bookingForm.checkInDate && (
                  <>
                    <div className="summary-row"><span>Check-in</span><span>{bookingForm.checkInDate}</span></div>
                    <div className="summary-row"><span>Check-out</span><span>{bookingForm.checkOutDate}</span></div>
                    <div className="summary-row"><span>Nights</span><span>{days}</span></div>
                    <div className="summary-row"><span>Guests</span><span>{bookingForm.numberOfGuests}</span></div>
                    <div className="summary-total flex justify-between">
                      <span>Total</span><span>₹{totalPrice.toFixed(2)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;

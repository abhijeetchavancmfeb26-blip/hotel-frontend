import React from 'react';

const AboutUs = () => {
  const features = [
    { icon: '🏨', title: 'Wide Selection', desc: 'Browse hundreds of hotels across major cities and find the perfect room.' },
    { icon: '💰', title: 'Best Prices', desc: 'Competitive, transparent pricing with no hidden charges.' },
    { icon: '🔒', title: 'Secure Booking', desc: 'Your personal and payment details are protected with industry-standard security.' },
  ];

  const developers = [
    'Abhijeet Popat Chavan',
    'Kiran Santosh Hajare',
    'Vaibhav Pandharinath Shirsath',
    'Lekha Sanjay Dighekar',
    'Swati Subhash Shelke',
  ];

  return (
    <div className="page">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ color: '#1e3a5f', fontSize: '2rem', marginBottom: '0.5rem' }}>About Us</h1>
          <p className="text-muted">Your trusted partner in hotel bookings</p>
        </div>

        {/* Who we are */}
        <div className="card mb-4">
          <div className="card-body" style={{ textAlign: 'center', padding: '2rem' }}>
            <h2 style={{ color: '#1e3a5f', marginBottom: '1rem' }}>Who We Are</h2>
            <p style={{ maxWidth: '700px', margin: '0 auto', color: '#555', lineHeight: '1.7' }}>
              HotelMS is a comprehensive platform designed to simplify hotel discovery and booking.
              We connect travelers with exceptional accommodations while providing administrators
              with efficient management tools.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-3 mb-4">
          {features.map((f) => (
            <div key={f.title} className="card" style={{ textAlign: 'center' }}>
              <div className="card-body" style={{ padding: '1.75rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{f.icon}</div>
                <h5 style={{ color: '#1e3a5f', marginBottom: '0.5rem' }}>{f.title}</h5>
                <p className="text-muted text-sm">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mission / Vision */}
        <div className="grid grid-2 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 style={{ color: '#2563eb', marginBottom: '0.75rem' }}>Our Mission</h5>
              <p className="text-muted" style={{ lineHeight: '1.7' }}>
                To provide a user-friendly platform that connects travelers with exceptional
                accommodations while empowering administrators with efficient management tools.
              </p>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h5 style={{ color: '#2563eb', marginBottom: '0.75rem' }}>Our Vision</h5>
              <p className="text-muted" style={{ lineHeight: '1.7' }}>
                To become the leading hospitality platform known for reliability, excellence,
                and innovative solutions that benefit both guests and hotel owners.
              </p>
            </div>
          </div>
        </div>

        {/* Developers */}
        <div className="card">
          <div className="card-header"><h5>Meet the Developers</h5></div>
          <div className="card-body">
            <div className="grid grid-3">
              {developers.map((name) => (
                <div key={name} style={{
                  padding: '0.75rem 1rem',
                  background: '#f0f4ff',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  color: '#1e3a5f'
                }}>
                  👤 {name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

import React, { useState } from 'react';

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="page">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: '#1e3a5f', fontSize: '2rem', marginBottom: '0.5rem' }}>Contact Us</h1>
          <p className="text-muted">We'd love to hear from you.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* Contact form */}
          <div className="card">
            <div className="card-header"><h5>Send a Message</h5></div>
            <div className="card-body">
              {submitted && <div className="alert alert-success">Thank you! We'll get back to you soon.</div>}
              <form onSubmit={handleSubmit}>
                <div className="grid grid-2">
                  <div className="form-group">
                    <label className="form-label">Your Name</label>
                    <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input type="tel" name="phone" className="form-control" value={formData.phone} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <input type="text" name="subject" className="form-control" value={formData.subject} onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea name="message" className="form-control" rows={5} value={formData.message} onChange={handleChange} required></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Send Message</button>
              </form>
            </div>
          </div>

          {/* Sidebar info */}
          <div>
            <div className="card mb-4">
              <div className="card-body">
                <h5 style={{ color: '#1e3a5f', marginBottom: '0.75rem' }}>Developers</h5>
                <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.88rem', color: '#444' }}>
                  <li style={{ padding: '0.25rem 0' }}>Abhijeet Popat Chavan</li>
                  <li style={{ padding: '0.25rem 0' }}>Kiran Santosh Hajare</li>
                  <li style={{ padding: '0.25rem 0' }}>Vaibhav Pandharinath Shirsath</li>
                  <li style={{ padding: '0.25rem 0' }}>Lekha Sanjay Dighekar</li>
                  <li style={{ padding: '0.25rem 0' }}>Swati Subhash Shelke</li>
                </ul>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h5 style={{ color: '#1e3a5f', marginBottom: '0.75rem' }}>Follow Us</h5>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((s) => (
                    <a key={s} href="#" className="btn btn-outline-primary btn-sm">{s}</a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

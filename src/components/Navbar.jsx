import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link className="navbar-brand" to="/">HMS</Link>

        <div className="nav-links">
          <Link className="nav-link" to="/">Home</Link>
          <Link className="nav-link" to="/about">About</Link>
          <Link className="nav-link" to="/contact">Contact</Link>
          {user && (
            <>
              {user.role === 'ADMIN' ? (
                <Link className="nav-link" to="/admin">Dashboard</Link>
              ) : (
                <>
                  <Link className="nav-link" to="/book">Book Room</Link>
                  <Link className="nav-link" to="/dashboard">My Bookings</Link>
                </>
              )}
            </>
          )}
        </div>

        <div className="nav-actions">
          {user ? (
            <>
              <span className="nav-user">{user.name} ({user.role})</span>
              <button className="btn btn-outline-white btn-sm" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link className="btn btn-outline-white btn-sm" to="/login">Login</Link>
              <Link className="btn btn-primary btn-sm" to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

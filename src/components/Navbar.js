import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{
      backgroundColor: '#222',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'center',
      gap: '2rem',
      flexWrap: 'wrap'
    }}>
      <Link style={{ color: 'white', textDecoration: 'none', fontSize: '1.2rem' }} to="/">Home</Link>
      <Link style={{ color: 'white', textDecoration: 'none', fontSize: '1.2rem' }} to="/dashboard">Dashboard</Link>
    </nav>
  );
}

export default Navbar;

// Home.js aggiornato

import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(to right, #00c6ff, #0072ff)',
      color: 'white',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>Benvenuto su Maxlotto!</h1>
      <p style={{ fontSize: '20px', marginBottom: '30px', maxWidth: '600px', textAlign: 'center' }}>
        Analizza le estrazioni del Lotto dal 2019 al 2025. Scopri i numeri più frequenti, i numeri consigliati e le statistiche per ogni ruota!
      </p>
      <button
        onClick={() => navigate('/dashboard')}
        style={{
          padding: '15px 30px',
          fontSize: '18px',
          fontWeight: 'bold',
          backgroundColor: '#ff4d4f',
          border: 'none',
          borderRadius: '30px',
          cursor: 'pointer',
          color: 'white',
          transition: 'transform 0.2s',
        }}
        onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
        onMouseLeave={e => e.target.style.transform = 'scale(1)'}
      >
        Vai alla Dashboard ➡️
      </button>
    </div>
  );
}

export default Home;

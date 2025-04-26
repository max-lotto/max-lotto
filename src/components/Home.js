import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Benvenuto su Maxlotto 🎯</h1>
      <p>Registrati o accedi per iniziare!</p>
      <Link to="/register">
        <button>Registrati</button>
      </Link>
      <Link to="/login">
        <button>Login</button>
      </Link>
    </div>
  );
}

export default Home;

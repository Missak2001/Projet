import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Bienvenue sur notre plateforme</h1>
      <p>Veuillez vous connecter ou vous inscrire pour continuer.</p>
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => navigate('/login')} 
          style={{ marginRight: '10px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
        >
          Connexion
        </button>
        <button 
          onClick={() => navigate('/register')} 
          style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
        >
          Inscription
        </button>
      </div>
    </div>
  );
}

export default Home;

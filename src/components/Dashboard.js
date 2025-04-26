import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function Dashboard() {
  const [estrazioni, setEstrazioni] = useState([]);
  const [numeriFrequenza, setNumeriFrequenza] = useState([]);
  const [ruotaSelezionata, setRuotaSelezionata] = useState('Tutte le Ruote');
  const [numeriConsigliati, setNumeriConsigliati] = useState([]);

  const ruoteDisponibili = [
    'Tutte le Ruote',
    'Bari', 'Cagliari', 'Firenze', 'Genova', 'Milano', 'Napoli', 'Palermo',
    'Roma', 'Torino', 'Venezia', 'Nazionale'
  ];

  useEffect(() => {
    const anni = [2019, 2020, 2021, 2022, 2023, 2024, 2025];
    Promise.all(anni.map(anno =>
      fetch(`/estrazioni_${anno}.csv`)
        .then(res => res.text())
        .then(csv => Papa.parse(csv, { header: true }).data)
    ))
    .then(dati => setEstrazioni(dati.flat()));
  }, []);

  useEffect(() => {
    if (estrazioni.length === 0) return;

    const conteggio = {};
    estrazioni.forEach(estrazione => {
      if (ruotaSelezionata === 'Tutte le Ruote' || estrazione.Ruota === ruotaSelezionata) {
        for (let i = 1; i <= 5; i++) {
          const num = parseInt(estrazione[`Numero${i}`]);
          if (!isNaN(num)) {
            conteggio[num] = (conteggio[num] || 0) + 1;
          }
        }
      }
    });

    const arrayFrequenze = Object.keys(conteggio).map(numero => ({
      numero,
      frequenza: conteggio[numero]
    })).sort((a, b) => b.frequenza - a.frequenza);

    setNumeriFrequenza(arrayFrequenze.slice(0, 10));
    setNumeriConsigliati(arrayFrequenze.slice(0, 5).map(e => e.numero));
  }, [estrazioni, ruotaSelezionata]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to right, #6a11cb, #2575fc)',
      color: 'white',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '36px', textAlign: 'center', marginBottom: '30px' }}>📊 Dashboard Maxlotto</h1>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <select
          value={ruotaSelezionata}
          onChange={(e) => setRuotaSelezionata(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '10px',
            fontSize: '16px',
            backgroundColor: '#fff',
            color: '#333',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          {ruoteDisponibili.map((ruota, index) => (
            <option key={index} value={ruota}>{ruota}</option>
          ))}
        </select>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2>🎯 Numeri Consigliati:</h2>
        {numeriConsigliati.length > 0 ? (
          <div style={{ fontSize: '24px', marginTop: '10px' }}>
            {numeriConsigliati.join(' - ')}
          </div>
        ) : (
          <p>Caricamento...</p>
        )}
      </div>

      <div style={{ height: 400 }}>
        <h2 style={{ textAlign: 'center' }}>📈 Numeri più estratti:</h2>
        {numeriFrequenza.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={numeriFrequenza}>
              <XAxis dataKey="numero" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Bar dataKey="frequenza" fill="#ff4d4f" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p style={{ textAlign: 'center' }}>Caricamento grafico...</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

// Dashboard.js completo aggiornato

import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Ruote del Lotto
const ruote = ['Tutte le Ruote', 'Bari', 'Cagliari', 'Firenze', 'Genova', 'Milano', 'Napoli', 'Palermo', 'Roma', 'Torino', 'Venezia', 'Nazionale'];

function Dashboard() {
  const [estrazioni, setEstrazioni] = useState([]);
  const [ruotaSelezionata, setRuotaSelezionata] = useState('Tutte le Ruote');
  const [numeriConsigliati, setNumeriConsigliati] = useState([]);
  const [numeriPiuEstratti, setNumeriPiuEstratti] = useState([]);

  useEffect(() => {
    const anni = [2019, 2020, 2021, 2022, 2023, 2024, 2025];
    Promise.all(anni.map(anno => fetch(`/${`estrazioni_${anno}.csv`}`)
      .then(res => res.text())
      .then(text => Papa.parse(text, { header: true }).data)))
      .then(data => {
        const tutteEstrazioni = data.flat();
        setEstrazioni(tutteEstrazioni);
      });
  }, []);

  useEffect(() => {
    if (estrazioni.length > 0) {
      calcolaStatistiche();
    }
  }, [estrazioni, ruotaSelezionata]);

  const calcolaStatistiche = () => {
    let numeri = [];

    estrazioni.forEach(estrazione => {
      Object.keys(estrazione).forEach(ruota => {
        if (ruotaSelezionata === 'Tutte le Ruote' || ruota.toLowerCase() === ruotaSelezionata.toLowerCase()) {
          const nums = estrazione[ruota]?.split(',').map(n => parseInt(n)).filter(n => !isNaN(n));
          numeri = numeri.concat(nums);
        }
      });
    });

    const conteggio = {};
    numeri.forEach(numero => {
      conteggio[numero] = (conteggio[numero] || 0) + 1;
    });

    const piuEstratti = Object.keys(conteggio)
      .map(numero => ({ numero: parseInt(numero), frequenza: conteggio[numero] }))
      .sort((a, b) => b.frequenza - a.frequenza)
      .slice(0, 10);

    setNumeriPiuEstratti(piuEstratti);

    const consigliati = Object.keys(conteggio)
      .sort((a, b) => conteggio[b] - conteggio[a])
      .slice(0, 5)
      .map(n => parseInt(n));

    setNumeriConsigliati(consigliati);
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center', minHeight: '100vh', background: 'linear-gradient(to right, #33001b, #ff0084)', color: 'white' }}>
      <h1 style={{ marginBottom: '20px' }}>📊 Dashboard Maxlotto</h1>
      <select
        value={ruotaSelezionata}
        onChange={e => setRuotaSelezionata(e.target.value)}
        style={{ padding: '10px', fontSize: '16px', borderRadius: '8px', marginBottom: '30px' }}
      >
        {ruote.map(ruota => (
          <option key={ruota} value={ruota}>{ruota}</option>
        ))}
      </select>

      <div style={{ marginBottom: '40px' }}>
        <h2>🎯 Numeri Consigliati:</h2>
        {numeriConsigliati.length > 0 ? (
          <p style={{ fontSize: '24px' }}>{numeriConsigliati.join(' - ')}</p>
        ) : (
          <p>Calcolo in corso...</p>
        )}
      </div>

      <div>
        <h2>📈 Numeri più estratti:</h2>
        {numeriPiuEstratti.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={numeriPiuEstratti}>
              <XAxis dataKey="numero" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Bar dataKey="frequenza" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>Caricamento grafico...</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

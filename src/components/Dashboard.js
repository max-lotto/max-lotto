import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import Papa from 'papaparse';

function Dashboard() {
  const navigate = useNavigate();
  const [estrazioni, setEstrazioni] = useState([]);
  const [classificaNumeri, setClassificaNumeri] = useState([]);
  const [numeriConsigliati, setNumeriConsigliati] = useState([]);
  const [annoSelezionato, setAnnoSelezionato] = useState("Tutti");
  const [numeroRitardatario, setNumeroRitardatario] = useState(null);
  const [caricamento, setCaricamento] = useState(true);

  useEffect(() => {
    const anni = [2019, 2020, 2021, 2022, 2023, 2024, 2025];
    let allData = [];
    let caricati = 0;

    anni.forEach((anno) => {
      Papa.parse(`/estrazioni_${anno}.csv`, {
        download: true,
        header: true,
        complete: (result) => {
          allData = [...allData, ...result.data];
          caricati++;
          if (caricati === anni.length) {
            setEstrazioni(allData);
            processaDati(allData);
            setCaricamento(false);
          }
        }
      });
    });
  }, []);

  const processaDati = (dati) => {
    const contatore = {};
    const ultimoAvvistamento = {};

    dati.forEach(item => {
      [item.Numero1, item.Numero2, item.Numero3, item.Numero4, item.Numero5].forEach(num => {
        const numero = parseInt(num);
        if (!isNaN(numero)) {
          contatore[numero] = (contatore[numero] || 0) + 1;
          ultimoAvvistamento[numero] = item.Data;
        }
      });
    });

    const classifica = Object.entries(contatore)
      .map(([numero, conteggio]) => ({ numero: parseInt(numero), conteggio }))
      .sort((a, b) => b.conteggio - a.conteggio);

    setClassificaNumeri(classifica);

    const oggi = new Date();
    let maxRitardo = -1;
    let numeroMax = null;
    for (const [numero, dataUltima] of Object.entries(ultimoAvvistamento)) {
      const data = new Date(dataUltima.split("/").reverse().join("-"));
      const diff = Math.floor((oggi - data) / (1000 * 60 * 60 * 24));
      if (diff > maxRitardo) {
        maxRitardo = diff;
        numeroMax = numero;
      }
    }

    setNumeroRitardatario({ numero: numeroMax, giorni: maxRitardo });

    generaNumeriConsigliati(classifica);
  };

  const generaNumeriConsigliati = (classifica) => {
    const top20 = classifica.slice(0, 20);
    const scelti = [];
    while (scelti.length < 5) {
      const n = top20[Math.floor(Math.random() * top20.length)]?.numero;
      if (n !== undefined && !scelti.includes(n)) {
        scelti.push(n);
      }
    }
    setNumeriConsigliati(scelti);
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => navigate("/"))
      .catch((error) => console.error(error));
  };

  const dataGrafico = classificaNumeri.slice(0, 10).map(item => ({
    numero: item.numero,
    conteggio: item.conteggio
  }));

  return (
    <div className="dashboard" style={{ padding: "30px", color: "#fff" }}>
      <h1>🎉 Benvenuto nella tua Dashboard Maxlotto!</h1>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "10px" }}>Filtra per anno:</label>
        <select
          value={annoSelezionato}
          onChange={(e) => setAnnoSelezionato(e.target.value)}
          style={{ padding: "8px", borderRadius: "8px", fontSize: "16px" }}
        >
          <option value="Tutti">Tutti</option>
          {[2019, 2020, 2021, 2022, 2023, 2024, 2025].map((anno) => (
            <option key={anno} value={anno}>{anno}</option>
          ))}
        </select>
      </div>

      <h2>📊 Numeri più frequenti (Grafico):</h2>
      {caricamento ? (
        <p>⏳ Caricamento dati in corso...</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={dataGrafico}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="numero" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="conteggio" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      )}

      <h2>Numeri estratti reali:</h2>
      <ul>
        {estrazioni
          .filter(item => annoSelezionato === "Tutti" || item.Data?.includes(annoSelezionato))
          .slice(0, 50)
          .map((item, index) => (
            <li key={index}>
              <strong>{item.Data}</strong> - {item.Ruota}: 
              {item.Numero1}, {item.Numero2}, {item.Numero3}, {item.Numero4}, {item.Numero5}
            </li>
          ))}
      </ul>

      <h2>🔢 Numeri più frequenti:</h2>
      <ol style={{ listStyle: "none", padding: 0 }}>
        {classificaNumeri.slice(0, 10).map((item, index) => {
          let color = "#61dafb";
          if (index === 0) color = "gold";
          else if (index === 1) color = "silver";
          else if (index === 2) color = "#cd7f32";

          return (
            <li key={index} style={{ color, fontWeight: "bold", fontSize: "18px" }}>
              #{index + 1} ➔ Numero {item.numero} ({item.conteggio} volte)
            </li>
          );
        })}
      </ol>

      <h2>🎯 Numeri Consigliati:</h2>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
        {numeriConsigliati.map((num, index) => (
          <div
            key={index}
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              backgroundColor: "#4CAF50",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              fontWeight: "bold",
              color: "#fff"
            }}
          >
            {num}
          </div>
        ))}
      </div>

      <button
        onClick={() => generaNumeriConsigliati(classificaNumeri)}
        style={{
          marginTop: "20px",
          padding: "12px 24px",
          background: "linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "16px",
          border: "none",
          borderRadius: "30px",
          cursor: "pointer"
        }}
      >
        🔄 Rigenera Numeri Consigliati
      </button>

      {numeroRitardatario && (
        <div style={{ marginTop: "30px", padding: "20px", background: "#2c2c2c", borderRadius: "10px" }}>
          <h2>⏳ Numero più ritardatario:</h2>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "gold" }}>
            Numero {numeroRitardatario.numero} - Assente da {numeroRitardatario.giorni} giorni
          </p>
        </div>
      )}

      <button
        onClick={handleLogout}
        style={{
          marginTop: "30px",
          padding: "10px 20px",
          background: "#ff4d4f",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer"
        }}
      >
        Esci
      </button>
    </div>
  );
}

export default Dashboard;


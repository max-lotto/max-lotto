// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCQsP-Ne_mxSX35X1Ehkcbzk3ZsyM2M_Qg",
  authDomain: "max-lotto.firebaseapp.com",
  projectId: "max-lotto",
  storageBucket: "max-lotto.appspot.com",
  messagingSenderId: "285806075654",
  appId: "1:285806075654:web:eb599737438e8c86830887"
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);

// Inizializza Auth
export const auth = getAuth(app);

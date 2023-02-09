import './index.css';

import React from 'react';

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import ReactDOM from 'react-dom/client';

import App from './App';
import { AuthContextProvider } from './context/AuthContext';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3FzZe0JIrAHwC-7wan7toZUxH02PV56M",
  authDomain: "project-app-87349.firebaseapp.com",
  projectId: "project-app-87349",
  storageBucket: "project-app-87349.appspot.com",
  messagingSenderId: "240964036627",
  appId: "1:240964036627:web:e02bbc403b1f94a567b7e6",
};

// Initialize Firebase
initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </React.StrictMode>
);

const { initializeApp } = require('firebase/app');
const { getStorage } = require('firebase/storage');

// Firebase configuration object with your credentials
const firebaseConfig = {
  apiKey: "AIzaSyApbeGh1Re_V_KMLTuVXrbxUnns-P-2zK0",
  authDomain: "dots-e7429.firebaseapp.com",
  projectId: "dots-e7429",
  storageBucket: "dots-e7429.firebasestorage.app",
  messagingSenderId: "777187269108",
  appId: "1:777187269108:web:7edfcdbcae6a19bf79c1a1",
  measurementId: "G-SSXWJV4F6E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

module.exports = storage;
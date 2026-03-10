// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { auth } from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import NavBar from './Components/NavBar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Eventos from './pages/Eventos';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#1a1a2e' }}>
        <p style={{ color: '#00d4ff', fontSize: '1.5rem' }}>Cargando...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      {user && <NavBar />}
      <Routes>
        {/* Ruta para el Login */}
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        
        {/* Rutas del Panel (protegidas) */}
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/eventos" element={user ? <Eventos /> : <Navigate to="/" />} />
        
        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
// ARCHIVO: src/pages/Register.jsx
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Crear el usuario en Firebase
      await createUserWithEmailAndPassword(auth, email, password);
      // Redirigir al login después de registrar
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Error al registrar el usuario');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Registro Coordinadores</h2>
        <form onSubmit={handleRegister} style={styles.form}>
          <input
            type="email"
            placeholder="Correo del colegio"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>Registrar</button>
        </form>
        <button onClick={() => navigate('/')} style={styles.backButton}>Volver al login</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', marginTop: '50px' },
  card: { border: '1px solid #ccc', padding: '20px', borderRadius: '8px', width: '300px', textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  input: { padding: '10px', fontSize: '16px' },
  button: { padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px' },
  backButton: { padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px', marginTop: '10px' }
};

export default Register;
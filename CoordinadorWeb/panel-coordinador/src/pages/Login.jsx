// ARCHIVO: src/pages/Login.jsx
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Evita que se recargue la página
    setError(null);

    try {
      // Intentamos loguear con Firebase
      await signInWithEmailAndPassword(auth, email, password);
      // Si funciona, nos lleva al Dashboard
      navigate('/dashboard');
    } catch (error) {
      // Si falla, mostramos el error
      console.error(error);
      setError("Error: Usuario o contraseña incorrectos");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Acceso Coordinadores</h2>
        <form onSubmit={handleLogin} style={styles.form}>
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
          <button type="submit" style={styles.button}>Entrar</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
};

// Unos estilos básicos para que no se vea feo
const styles = {
  container: { display: 'flex', justifyContent: 'center', marginTop: '50px' },
  card: { border: '1px solid #ccc', padding: '20px', borderRadius: '8px', width: '300px', textAlign: 'center' },
  form: { dislay: 'flex', flexDirection: 'column', gap: '10px' },
  input: { padding: '10px', fontSize: '16px' },
  button: { padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px' }
};

export default Login;
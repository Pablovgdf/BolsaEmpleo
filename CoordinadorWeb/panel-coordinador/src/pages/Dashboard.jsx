// ARCHIVO: src/pages/Dashboard.jsx
import { useState } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';

const Dashboard = () => {
  // 1. Estados para guardar lo que escribe el coordinador
  const [formData, setFormData] = useState({
    titulo: '',
    empresa: '',
    descripcion: '',
    link: '', // Enlace donde se aplica o correo
  });
  
  // Estado especial para los ciclos (Array)
  const [ciclosSeleccionados, setCiclosSeleccionados] = useState([]);
  const [mensaje, setMensaje] = useState(""); // Para decir "Guardado con éxito"

  // Lista de ciclos disponibles
  const listaCiclos = ["DAM", "DAW", "ASIR", "SMR"];

  // 2. Función que maneja los inputs de texto
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 3. Función especial para los Checkbox (añadir/quitar ciclos del array)
  const handleCicloChange = (ciclo) => {
    if (ciclosSeleccionados.includes(ciclo)) {
      // Si ya estaba, lo quitamos
      setCiclosSeleccionados(ciclosSeleccionados.filter(c => c !== ciclo));
    } else {
      // Si no estaba, lo añadimos
      setCiclosSeleccionados([...ciclosSeleccionados, ciclo]);
    }
  };

  // 4. Función FINAL: Guardar en Firebase
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (ciclosSeleccionados.length === 0) {
      alert("Debes seleccionar al menos un ciclo (DAM, DAW...)");
      return;
    }

    try {
      // Aquí ocurre la magia: Escribimos en la colección 'ofertas'
      await addDoc(collection(db, "ofertas"), {
        ...formData,
        target_ciclos: ciclosSeleccionados, // El filtro clave
        fecha: new Date(),
        activa: true
      });

      setMensaje("¡Oferta publicada correctamente! 🚀");
      
      // Limpiamos el formulario
      setFormData({ titulo: '', empresa: '', descripcion: '', link: '' });
      setCiclosSeleccionados([]);
      
      // Borramos el mensaje de éxito a los 3 segundos
      setTimeout(() => setMensaje(""), 3000);

    } catch (error) {
      console.error("Error al guardar: ", error);
      setMensaje("Hubo un error al guardar.");
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2>Panel del Coordinador</h2>
        <button style={styles.logoutBtn} onClick={() => window.location.href='/'}>Salir</button>
      </header>

      <div style={styles.formCard}>
        <h3>Nueva Oferta de Empleo</h3>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <input 
            name="titulo" placeholder="Título de la oferta (ej. Jr Java Developer)" 
            value={formData.titulo} onChange={handleChange} style={styles.input} required 
          />
          
          <input 
            name="empresa" placeholder="Nombre de la Empresa" 
            value={formData.empresa} onChange={handleChange} style={styles.input} required 
          />

          <textarea 
            name="descripcion" placeholder="Descripción de la oferta (Requisitos, salario...)" 
            value={formData.descripcion} onChange={handleChange} style={styles.textarea} required 
          />

          <input 
            name="link" placeholder="Enlace para aplicar o Email de contacto" 
            value={formData.link} onChange={handleChange} style={styles.input} required 
          />

          <div style={styles.checkboxContainer}>
            <p style={{fontWeight: 'bold'}}>¿Para qué alumnos es?</p>
            <div style={styles.checkboxes}>
              {listaCiclos.map(ciclo => (
                <label key={ciclo} style={styles.labelCheckbox}>
                  <input 
                    type="checkbox" 
                    checked={ciclosSeleccionados.includes(ciclo)}
                    onChange={() => handleCicloChange(ciclo)}
                  />
                  {ciclo}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" style={styles.button}>PUBLICAR OFERTA</button>
        </form>

        {mensaje && <p style={styles.success}>{mensaje}</p>}
      </div>
    </div>
  );
};

// Estilos rápidos (CSS en JS)
const styles = {
  container: { padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  logoutBtn: { padding: '5px 10px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px'},
  formCard: { border: '1px solid #ddd', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '12px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '5px' },
  textarea: { padding: '12px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '5px', minHeight: '100px' },
  checkboxContainer: { margin: '10px 0' },
  checkboxes: { display: 'flex', gap: '15px' },
  labelCheckbox: { display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' },
  button: { padding: '15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold' },
  success: { marginTop: '15px', padding: '10px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '5px', textAlign: 'center' }
};

export default Dashboard;
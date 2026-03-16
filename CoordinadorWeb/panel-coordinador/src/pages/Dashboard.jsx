// ARCHIVO: src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, query, orderBy, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';

const Dashboard = () => {
  // 1. Estados para guardar lo que escribe el coordinador
  const [formData, setFormData] = useState({
    titulo: '',
    empresa: '',
    descripcion: '',
    link: '', // Enlace donde se aplica o correo
  });
  const [ofertas, setOfertas] = useState([]);
  const [filtroCiclo, setFiltroCiclo] = useState('TODOS');
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ titulo: '', empresa: '', descripcion: '', link: '' });
  const [editCiclos, setEditCiclos] = useState([]);

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
      setCiclosSeleccionados(ciclosSeleccionados.filter((c) => c !== ciclo));
    } else {
      setCiclosSeleccionados([...ciclosSeleccionados, ciclo]);
    }
  };

  const handleEditStart = (oferta) => {
    setEditId(oferta.id);
    setEditData({
      titulo: oferta.titulo || '',
      empresa: oferta.empresa || '',
      descripcion: oferta.descripcion || '',
      link: oferta.link || '',
    });
    setEditCiclos(Array.isArray(oferta.target_ciclos) ? oferta.target_ciclos : []);
  };

  const handleEditChange = (e) => {
    setEditData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditCicloChange = (ciclo) => {
    setEditCiclos((prev) => (prev.includes(ciclo) ? prev.filter((c) => c !== ciclo) : [...prev, ciclo]));
  };

  const handleEditSave = async (id) => {
    if (!editData.titulo || !editData.empresa || !editData.descripcion || !editData.link) {
      setMensaje('Completa todos los campos en edición.');
      return;
    }
    if (editCiclos.length === 0) {
      setMensaje('Selecciona al menos un ciclo.');
      return;
    }
    try {
      await updateDoc(doc(db, 'ofertas', id), {
        ...editData,
        target_ciclos: editCiclos,
      });
      setEditId(null);
      setMensaje('Oferta actualizada.');
      setTimeout(() => setMensaje(''), 3000);
    } catch (error) {
      console.error('Error actualizando', error);
      setMensaje('Error al actualizar oferta.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta oferta?')) return;
    try {
      await deleteDoc(doc(db, 'ofertas', id));
      setMensaje('Oferta eliminada.');
      setTimeout(() => setMensaje(''), 3000);
    } catch (error) {
      console.error('Error eliminando', error);
      setMensaje('Error al eliminar oferta.');
    }
  };

  // Cargar todas las ofertas en tiempo real
  useEffect(() => {
    const q = query(collection(db, 'ofertas'), orderBy('fecha', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOfertas(data);
    }, (error) => {
      console.error('Error cargando ofertas:', error);
    });

    return unsubscribe;
  }, []);

  const ofertasFiltradas = filtroCiclo === 'TODOS'
    ? ofertas
    : ofertas.filter((oferta) => Array.isArray(oferta.target_ciclos) && oferta.target_ciclos.includes(filtroCiclo));

  const handleFiltroCambio = (e) => {
    setFiltroCiclo(e.target.value);
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
      const msg = error?.message ? error.message : 'Error desconocido al guardar.';
      setMensaje(`❌ ${msg}`);
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

      <div style={{ ...styles.formCard, marginTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h3 style={{ margin: 0, color: '#fff' }}>Ofertas publicadas</h3>
          <select value={filtroCiclo} onChange={handleFiltroCambio} style={styles.select}>
            <option value="TODOS">Todos los ciclos</option>
            <option value="DAM">DAM</option>
            <option value="DAW">DAW</option>
            <option value="ASIR">ASIR</option>
            <option value="SMR">SMR</option>
          </select>
        </div>

        {ofertasFiltradas.length === 0 ? (
          <p style={{ color: '#ddd', textAlign: 'center' }}>No hay ofertas para este filtro.</p>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {ofertasFiltradas.map((oferta) => {
              const esEditando = editId === oferta.id;
              return (
                <article key={oferta.id} style={styles.card}>
                  {esEditando ? (
                    <>
                      <label style={styles.labelCard}>titulo:</label>
                      <input name="titulo" value={editData.titulo} onChange={handleEditChange} style={styles.editInput} />
                      <label style={styles.labelCard}>empresa:</label>
                      <input name="empresa" value={editData.empresa} onChange={handleEditChange} style={styles.editInput} />
                      <label style={styles.labelCard}>descripcion:</label>
                      <textarea name="descripcion" value={editData.descripcion} onChange={handleEditChange} style={styles.editTextarea} />
                      <label style={styles.labelCard}>enlace:</label>
                      <input name="link" value={editData.link} onChange={handleEditChange} style={styles.editInput} />
                      <p style={styles.labelCard}>ciclos:</p>
                      <div style={styles.checkboxes}>
                        {listaCiclos.map((ciclo) => (
                          <label key={ciclo} style={styles.labelCheckbox}>
                            <input type="checkbox" checked={editCiclos.includes(ciclo)} onChange={() => handleEditCicloChange(ciclo)} /> {ciclo}
                          </label>
                        ))}
                      </div>
                      <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
                        <button type="button" style={styles.saveBtn} onClick={() => handleEditSave(oferta.id)}>Guardar</button>
                        <button type="button" style={styles.cancelBtn} onClick={() => setEditId(null)}>Cancelar</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p style={styles.cardText}><strong>titulo:</strong> {oferta.titulo}</p>
                      <p style={styles.cardText}><strong>empresa:</strong> {oferta.empresa}</p>
                      <p style={styles.cardText}><strong>descripcion:</strong> {oferta.descripcion}</p>
                      <p style={styles.cardText}><strong>enlace:</strong> {oferta.link || 'Sin enlace'}</p>
                      <p style={styles.cardText}><strong>ciclos:</strong> {Array.isArray(oferta.target_ciclos) ? oferta.target_ciclos.join(', ') : 'No definido'}</p>
                      <p style={styles.cardText}><strong>fecha:</strong> {oferta.fecha?.toDate ? oferta.fecha.toDate().toLocaleDateString('es-ES') : oferta.fecha ? new Date(oferta.fecha).toLocaleDateString('es-ES') : 'Sin fecha'}</p>
                      <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                        <button type="button" style={styles.editBtn} onClick={() => handleEditStart(oferta)}>Modificar</button>
                        <button type="button" style={styles.deleteBtn} onClick={() => handleDelete(oferta.id)}>Eliminar</button>
                      </div>
                    </>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// Estilos rápidos (CSS en JS)
const styles = {
  container: { padding: '20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Arial, sans-serif', backgroundColor: '#0b1220', minHeight: '100vh', color: '#fff' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', color: '#fff' },
  logoutBtn: { padding: '8px 12px', cursor: 'pointer', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px' },
  formCard: { border: '1px solid #334155', padding: '20px', borderRadius: '10px', backgroundColor: '#111827', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' },
  form: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { color: '#e2e8f0', fontWeight: 600 },
  input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' },
  textarea: { width: '100%', minHeight: '90px', padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' },
  checkboxContainer: { marginTop: '10px' },
  checkboxes: { display: 'flex', flexWrap: 'wrap', gap: '10px' },
  labelCheckbox: { display: 'flex', alignItems: 'center', gap: '4px', color: '#e2e8f0', fontSize: '0.9rem' },
  button: { marginTop: '10px', padding: '12px', border: 'none', borderRadius: '6px', backgroundColor: '#16a34a', color: '#fff', fontWeight: 700, cursor: 'pointer' },
  success: { marginTop: '10px', color: '#d1fae5', fontWeight: 600 },
  select: { padding: '8px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' },
  card: { border: '1px solid #334155', borderRadius: '8px', backgroundColor: '#0f172a', padding: '12px' },
  cardText: { margin: '5px 0', color: '#fff' },
  labelCard: { marginTop: '8px', color: '#e2e8f0', fontWeight: 600 },
  editInput: { width: '100%', padding: '8px', margin: '3px 0 8px 0', borderRadius: '5px', border: '1px solid #334155', backgroundColor: '#111827', color: '#fff' },
  editTextarea: { width: '100%', padding: '8px', margin: '3px 0 8px 0', borderRadius: '5px', border: '1px solid #334155', backgroundColor: '#111827', color: '#fff', minHeight: '70px' },
  saveBtn: { border: 'none', borderRadius: '5px', backgroundColor: '#10b981', color: '#fff', padding: '8px 10px', cursor: 'pointer' },
  cancelBtn: { border: 'none', borderRadius: '5px', backgroundColor: '#6b7280', color: '#fff', padding: '8px 10px', cursor: 'pointer' },
  editBtn: { border: 'none', borderRadius: '5px', backgroundColor: '#3b82f6', color: '#fff', padding: '8px 10px', cursor: 'pointer' },
  deleteBtn: { border: 'none', borderRadius: '5px', backgroundColor: '#ef4444', color: '#fff', padding: '8px 10px', cursor: 'pointer' },
};

export default Dashboard;
import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';

export default function Eventos() {
  const [formData, setFormData] = useState({
    titulo: '',
    ponente: '',
    fecha: '',
    lugar: '',
    descripcion: '',
  });

  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar eventos en tiempo real
  useEffect(() => {
    const q = query(collection(db, 'eventos'), orderBy('fecha', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventosData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEventos(eventosData);
    });
    return unsubscribe;
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.titulo || !formData.ponente || !formData.fecha || !formData.lugar) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'eventos'), {
        ...formData,
        createdAt: new Date(),
      });
      
      // Limpiar formulario
      setFormData({
        titulo: '',
        ponente: '',
        fecha: '',
        lugar: '',
        descripcion: '',
      });
      
      alert('✅ Evento creado exitosamente');
    } catch (error) {
      console.error('Error al crear evento:', error);
      alert('❌ Error al crear el evento');
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
    backgroundColor: '#0f1419',
    minHeight: '100vh',
  };

  const sectionStyle = {
    backgroundColor: '#1a1a2e',
    borderRadius: '8px',
    padding: '2rem',
    marginBottom: '2rem',
    border: '1px solid #0f3460',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
  };

  const titleStyle = {
    color: '#00d4ff',
    fontSize: '1.8rem',
    marginBottom: '1.5rem',
    borderBottom: '2px solid #0f3460',
    paddingBottom: '1rem',
  };

  const formGroupStyle = {
    marginBottom: '1rem',
  };

  const labelStyle = {
    display: 'block',
    color: '#e0e0e0',
    marginBottom: '0.5rem',
    fontWeight: '500',
    fontSize: '0.95rem',
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#0f1419',
    border: '1px solid #0f3460',
    borderRadius: '4px',
    color: '#e0e0e0',
    fontSize: '1rem',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  };

  const inputFocusStyle = {
    ...inputStyle,
    borderColor: '#00d4ff',
    boxShadow: '0 0 8px rgba(0, 212, 255, 0.3)',
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '120px',
    resize: 'vertical',
    fontFamily: 'inherit',
  };

  const buttonStyle = {
    backgroundColor: '#00d4ff',
    color: '#1a1a2e',
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    width: '100%',
    marginTop: '1rem',
  };

  const buttonHoverStyle = {
    ...buttonStyle,
    backgroundColor: '#00a8cc',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 212, 255, 0.3)',
  };

  const eventCardStyle = {
    backgroundColor: '#162035',
    border: '1px solid #0f3460',
    borderRadius: '8px',
    padding: '1.5rem',
    marginBottom: '1rem',
    transition: 'all 0.3s ease',
  };

  const eventCardHoverStyle = {
    ...eventCardStyle,
    borderColor: '#00d4ff',
    boxShadow: '0 4px 12px rgba(0, 212, 255, 0.2)',
    transform: 'translateX(4px)',
  };

  const eventTitleStyle = {
    color: '#00d4ff',
    fontSize: '1.3rem',
    margin: '0 0 0.5rem 0',
  };

  const eventDetailsStyle = {
    color: '#b0b0b0',
    fontSize: '0.95rem',
    lineHeight: '1.6',
    margin: '0.5rem 0',
  };

  const eventDescriptionStyle = {
    color: '#d0d0d0',
    fontSize: '0.9rem',
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid #0f3460',
  };

  const noEventsStyle = {
    textAlign: 'center',
    color: '#808080',
    fontSize: '1.1rem',
    padding: '2rem',
  };

  return (
    <div style={containerStyle}>
      {/* Formulario */}
      <section style={sectionStyle}>
        <h2 style={titleStyle}>➕ Crear Nuevo Evento</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>📌 Título *</label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#00d4ff')}
                onBlur={(e) => (e.target.style.borderColor = '#0f3460')}
                placeholder="Ej: Taller de JavaScript"
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>👤 Ponente *</label>
              <input
                type="text"
                name="ponente"
                value={formData.ponente}
                onChange={handleChange}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#00d4ff')}
                onBlur={(e) => (e.target.style.borderColor = '#0f3460')}
                placeholder="Ej: Juan García"
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>📅 Fecha *</label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#00d4ff')}
                onBlur={(e) => (e.target.style.borderColor = '#0f3460')}
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>📍 Lugar *</label>
              <input
                type="text"
                name="lugar"
                value={formData.lugar}
                onChange={handleChange}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#00d4ff')}
                onBlur={(e) => (e.target.style.borderColor = '#0f3460')}
                placeholder="Ej: Aula 101"
              />
            </div>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>📝 Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              style={textareaStyle}
              onFocus={(e) => (e.target.style.borderColor = '#00d4ff')}
              onBlur={(e) => (e.target.style.borderColor = '#0f3460')}
              placeholder="Describe el evento con más detalle..."
            />
          </div>

          <button
            type="submit"
            style={buttonStyle}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#00a8cc';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(0, 212, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#00d4ff';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
            disabled={loading}
          >
            {loading ? '⏳ Guardando...' : '💾 Guardar Evento'}
          </button>
        </form>
      </section>

      {/* Lista de Eventos */}
      <section style={sectionStyle}>
        <h2 style={titleStyle}>📅 Eventos Programados</h2>
        
        {eventos.length === 0 ? (
          <div style={noEventsStyle}>
            <p>No hay eventos aún. ¡Crea uno para comenzar!</p>
          </div>
        ) : (
          <div>
            {eventos.map((evento) => (
              <div
                key={evento.id}
                style={eventCardStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#00d4ff';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 212, 255, 0.2)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#0f3460';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <h3 style={eventTitleStyle}>🎯 {evento.titulo}</h3>
                <div style={eventDetailsStyle}>
                  <strong>👤 Ponente:</strong> {evento.ponente}
                </div>
                <div style={eventDetailsStyle}>
                  <strong>📅 Fecha:</strong> {new Date(evento.fecha).toLocaleDateString('es-ES')}
                </div>
                <div style={eventDetailsStyle}>
                  <strong>📍 Lugar:</strong> {evento.lugar}
                </div>
                {evento.descripcion && (
                  <div style={eventDescriptionStyle}>
                    <strong>📝 Descripción:</strong>
                    <p>{evento.descripcion}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

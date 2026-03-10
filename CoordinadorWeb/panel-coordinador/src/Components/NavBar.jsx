import { Link, useLocation } from 'react-router-dom';

export default function NavBar() {
  const location = useLocation();

  const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#1a1a2e',
    borderBottom: '2px solid #0f3460',
    marginBottom: '2rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
  };

  const linkStyle = {
    textDecoration: 'none',
    color: '#e0e0e0',
    fontSize: '1.1rem',
    fontWeight: '500',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    transition: 'all 0.3s ease',
    marginLeft: '1rem',
  };

  const activeLinkStyle = {
    ...linkStyle,
    backgroundColor: '#0f3460',
    color: '#00d4ff',
    borderBottom: '3px solid #00d4ff',
  };

  const titleStyle = {
    color: '#00d4ff',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: 0,
  };

  const menuStyle = {
    display: 'flex',
    gap: '1rem',
  };

  return (
    <nav style={navStyle}>
      <h1 style={titleStyle}>Coordinador Panel</h1>
      <div style={menuStyle}>
        <Link
          to="/dashboard"
          style={location.pathname === '/dashboard' ? activeLinkStyle : linkStyle}
        >
          📊 Ofertas
        </Link>
        <Link
          to="/eventos"
          style={location.pathname === '/eventos' ? activeLinkStyle : linkStyle}
        >
          📅 Eventos
        </Link>
      </div>
    </nav>
  );
}

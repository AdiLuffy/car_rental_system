import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    setIsAuthenticated(!!token);
    setIsAdmin(role === 'ADMIN');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    setIsAuthenticated(false);
    setIsAdmin(false);
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav style={styles.nav}>
      <div style={styles.navContainer}>
        <Link to="/home" style={styles.logo}>
          <span style={styles.logoText}>CAR</span>
          <span style={styles.logoNumber}>24</span>
        </Link>
        
        <div style={styles.navLinks}>
          <Link to="/home" style={styles.link}>Buy Used Car</Link>
          <Link to="/sell" style={styles.link}>Sell Car</Link>
          {isAdmin && (
            <Link to="/admin" style={styles.adminLink}>Admin</Link>
          )}
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: '#FFFFFF',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    borderBottom: '1px solid #E5E7EB'
  },
  navContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    fontSize: '24px',
    fontWeight: '800',
    letterSpacing: '-0.5px'
  },
  logoText: {
    color: '#1F2937'
  },
  logoNumber: {
    color: '#FF6B35',
    marginLeft: '2px'
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px'
  },
  link: {
    textDecoration: 'none',
    color: '#6B7280',
    fontSize: '15px',
    fontWeight: '500',
    transition: 'color 0.2s ease',
    padding: '8px 0'
  },
  adminLink: {
    textDecoration: 'none',
    color: '#FF6B35',
    fontSize: '15px',
    fontWeight: '600',
    padding: '8px 16px',
    background: '#FFF5F2',
    borderRadius: '8px',
    transition: 'all 0.2s ease'
  },
  logoutBtn: {
    background: '#FF6B35',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }
};

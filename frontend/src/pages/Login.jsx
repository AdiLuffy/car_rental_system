import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/home');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('email', data.email || email);
        
        if (data.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/home');
        }
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
        setError(errorData.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Network error:', err);
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = () => {
    navigate('/register');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>
            <span style={styles.logoText}>CAR</span>
            <span style={styles.logoNumber}>24</span>
          </div>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Sign in to your account</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
              disabled={loading}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={styles.submitButton}
          >
            {loading ? (
              <>
                <span className="loading-spinner" style={{ width: '20px', height: '20px', marginRight: '8px' }}></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>Don't have an account?</p>
          <button
            type="button"
            onClick={handleCreateAccount}
            className="btn-secondary"
            style={styles.createButton}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)',
    padding: '20px'
  },
  card: {
    background: '#FFFFFF',
    borderRadius: '16px',
    padding: '48px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '440px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  logo: {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '32px',
    fontWeight: '800',
    letterSpacing: '-0.5px',
    marginBottom: '24px'
  },
  logoText: {
    color: '#1F2937'
  },
  logoNumber: {
    color: '#FF6B35',
    marginLeft: '2px'
  },
  title: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#1F2937',
    margin: '0 0 8px 0'
  },
  subtitle: {
    fontSize: '16px',
    color: '#6B7280',
    margin: 0
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151'
  },
  input: {
    padding: '14px 16px',
    fontSize: '16px',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    transition: 'all 0.2s ease'
  },
  submitButton: {
    width: '100%',
    padding: '16px',
    fontSize: '16px',
    fontWeight: '600',
    marginTop: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  footer: {
    marginTop: '32px',
    textAlign: 'center'
  },
  footerText: {
    fontSize: '14px',
    color: '#6B7280',
    marginBottom: '16px'
  },
  createButton: {
    width: '100%',
    padding: '14px',
    fontSize: '16px'
  }
};

export default Login;

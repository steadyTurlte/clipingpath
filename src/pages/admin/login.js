import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Logo from 'public/images/logo.png';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { from } = router.query;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        // Redirect to the admin dashboard or the page they were trying to access
        router.push(from || '/admin');
      } else {
        const data = await response.json();
        setError(data.message || 'Authentication failed');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Login | Photodit</title>
      </Head>
      <div className="admin-login">
        <div className="admin-login__container">
          <div className="admin-login__logo">
            <Image src={Logo} alt="Photodit Logo" width={150} height={50} />
          </div>
          <h1 className="admin-login__title">Admin Login</h1>
          
          {error && <div className="admin-login__error">{error}</div>}
          
          <form onSubmit={handleSubmit} className="admin-login__form">
            <div className="admin-login__form-group">
              <label htmlFor="password" className="admin-login__label">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-login__input"
                placeholder="Enter admin password"
                required
              />
            </div>
            <button 
              type="submit" 
              className="admin-login__button"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
      
      <style jsx>{`
        .admin-login {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: #f5f5f5;
        }
        
        .admin-login__container {
          width: 100%;
          max-width: 400px;
          padding: 40px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .admin-login__logo {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }
        
        .admin-login__title {
          font-size: 24px;
          font-weight: 600;
          text-align: center;
          margin-bottom: 30px;
        }
        
        .admin-login__error {
          background-color: #ffebee;
          color: #d32f2f;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 20px;
          text-align: center;
        }
        
        .admin-login__form-group {
          margin-bottom: 20px;
        }
        
        .admin-login__label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
        }
        
        .admin-login__input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }
        
        .admin-login__button {
          width: 100%;
          padding: 12px;
          background-color: #4569e7;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .admin-login__button:hover {
          background-color: #3a5bc7;
        }
        
        .admin-login__button:disabled {
          background-color: #a0aec0;
          cursor: not-allowed;
        }
      `}</style>
    </>
  );
};

export default AdminLogin;

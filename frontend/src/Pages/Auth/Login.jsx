import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Login = ({ setLogged, setUser, setUserID }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (error) {
      setShowPopup(true);
    }
  }, [error]);

  const onLogin = async (e) => {
    e.preventDefault();
    const formData = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch(`${backendUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      setUser(data['username']);
      setUserID(data['email']);
      console.log(data);
      setLogged(true);
      navigate('/');
    } catch (error) {
      console.error('There was an error!', error);
      setError('Incorrect email or password. Please try again.');
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setError('');
  };

  return (
    <div className="login-form-container">
      <div className="login-form">
        <div className="login-header">
          <h1 className="login-title">Login</h1>
          <p className="login-subtitle">Enter your email below to login to your account</p>
        </div>

        <form className="login-fields" onSubmit={onLogin}>
          <div className="login-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>

          <div className="login-field">
            <div className="password-container">
              <label htmlFor="password">Password</label>
              <a href="/forgot-password" className="forgot-password-link">
                Forgot your password?
              </a>
            </div>
            <input
              id="password"
              type="password"
              required
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <div className="signup-link">
          Don&apos;t have an account?{' '}
          <a href="/signup" className="signup-link-text">
            Sign up
          </a>
        </div>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <button className="popup-close" onClick={closePopup}>
              &times;
            </button>
            <p>{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;

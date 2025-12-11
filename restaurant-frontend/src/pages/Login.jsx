import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import GoogleLoginButton from '../components/GoogleLoginButton';
import './Auth.css';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('/api/auth/login', formData);
      console.log('Login successful:', response.data);
      navigate('/restaurant');
    } catch (err) {
      let errorMessage = 'Login failed. Please try again.';
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (typeof err.response.data === 'object') {
          errorMessage = Object.values(err.response.data).join(', ');
        }
      }
      setError(errorMessage);
      console.error('Login error:', err);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="Enter your username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" className="auth-btn">
          Login
        </button>
      </form>

      <div className="divider">
        <span>OR</span>
      </div>

      <div style={{ textAlign: 'center' }}>
        <GoogleLoginButton />
      </div>

      <div className="auth-footer">
        Don't have an account?{' '}
        <Link to="/register">Register here</Link>
      </div>
    </div>
  );
}

export default Login;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import GoogleLoginButton from '../components/GoogleLoginButton';

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
      setError(err.response?.data || 'Login failed. Please try again.');
      console.error('Login error:', err);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>
            Username:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        {error && (
          <div style={{ color: 'red', marginBottom: '15px' }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Login
        </button>
      </form>

      <div style={{ margin: '20px 0', textAlign: 'center' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '20px 0'
        }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#ccc' }}></div>
          <span style={{ padding: '0 10px', color: '#666' }}>OR</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#ccc' }}></div>
        </div>

        <GoogleLoginButton />
      </div>

      <p style={{ marginTop: '15px', textAlign: 'center' }}>
        Don't have an account?{' '}
        <a href="/register" style={{ color: '#007bff' }}>
          Register here
        </a>
      </p>
    </div>
  );
}

export default Login;

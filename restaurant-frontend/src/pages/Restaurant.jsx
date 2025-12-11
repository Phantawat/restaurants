import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

function Restaurant() {
  const [user, setUser] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfo();
    fetchRestaurants();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      setUser(response.data);
    } catch (err) {
      console.error('Failed to fetch user info:', err);
      setError('Not authenticated. Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  };

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get('/api/restaurants');
      // Handle paginated response (if using Pageable) or direct array
      const restaurantData = response.data.content || response.data;
      setRestaurants(restaurantData);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch restaurants:', err);
      setError('Failed to load restaurants');
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
      // Even if logout fails, redirect to login
      navigate('/login');
    }
  };

  const isAdmin = user?.role === 'ROLE_ADMIN';

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1>Restaurant List</h1>
          {user && (
            <p>
              Welcome, <strong>{user.name}</strong> ({user.username})
              {isAdmin && <span style={{ color: '#dc3545', marginLeft: '10px' }}>[ADMIN]</span>}
            </p>
          )}
        </div>
        <div>
          {isAdmin && (
            <button
              onClick={() => navigate('/restaurant/new')}
              style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '10px',
              }}
            >
              Add Restaurant
            </button>
          )}
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '15px' }}>
          {error}
        </div>
      )}

      {restaurants.length === 0 ? (
        <p>No restaurants found. {isAdmin && 'Click "Add Restaurant" to create one!'}</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Name</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Rating</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Location</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((restaurant) => (
              <tr key={restaurant.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '12px' }}>{restaurant.name}</td>
                <td style={{ padding: '12px' }}>{restaurant.rating}</td>
                <td style={{ padding: '12px' }}>{restaurant.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Restaurant;

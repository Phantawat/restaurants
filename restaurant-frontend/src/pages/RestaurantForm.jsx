import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

function RestaurantForm() {
  const [formData, setFormData] = useState({
    name: '',
    rating: '',
    location: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
    setSuccess('');

    try {
      const response = await axios.post('/api/restaurants', {
        ...formData,
        rating: parseFloat(formData.rating),
      });
      console.log('Restaurant created:', response.data);
      setSuccess('Restaurant created successfully! Redirecting...');
      setTimeout(() => {
        navigate('/restaurant');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create restaurant. Please try again.');
      console.error('Create restaurant error:', err);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Add New Restaurant</h2>
        <button
          onClick={() => navigate('/restaurant')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Back to List
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>
            Restaurant Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="rating" style={{ display: 'block', marginBottom: '5px' }}>
            Rating (0-5):
          </label>
          <input
            type="number"
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            required
            min="0"
            max="5"
            step="0.1"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="location" style={{ display: 'block', marginBottom: '5px' }}>
            Location:
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
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

        {success && (
          <div style={{ color: 'green', marginBottom: '15px' }}>
            {success}
          </div>
        )}

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Create Restaurant
        </button>
      </form>
    </div>
  );
}

export default RestaurantForm;

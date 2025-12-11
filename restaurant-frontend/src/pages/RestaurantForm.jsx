import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import './Restaurant.css';

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
      let errorMessage = 'Failed to create restaurant. Please try again.';
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (typeof err.response.data === 'object') {
           // Check for 'message' property or join values
           errorMessage = err.response.data.message || Object.values(err.response.data).join(', ');
        }
      }
      setError(errorMessage);
      console.error('Create restaurant error:', err);
    }
  };

  return (
    <div className="form-page-container">
      <div className="restaurant-header" style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0 }}>Add New Restaurant</h2>
        <button
          onClick={() => navigate('/restaurant')}
          className="btn btn-secondary"
        >
          Back to List
        </button>
      </div>

      {error && (
        <div className="message message-error">
          {error}
        </div>
      )}

      {success && (
        <div className="message message-success">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Restaurant Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="Enter restaurant name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="rating">Rating (0-5)</label>
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
            className="input-field"
            placeholder="e.g. 4.5"
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="Enter location"
          />
        </div>

        <div style={{ marginTop: '32px' }}>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            Create Restaurant
          </button>
        </div>
      </form>
    </div>
  );
}

export default RestaurantForm;

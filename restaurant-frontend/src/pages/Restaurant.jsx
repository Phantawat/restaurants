import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import './Restaurant.css';

function Restaurant() {
  const [user, setUser] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('name');
  const [totalPages, setTotalPages] = useState(0);

  // Search state
  const [searchName, setSearchName] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchMode, setSearchMode] = useState('all'); // 'all', 'name', 'location'

  // Edit state
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', rating: '', location: '' });

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (searchMode === 'all') {
      fetchRestaurants();
    }
  }, [currentPage, pageSize, sortBy, searchMode]);

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
      setLoading(true);
      const response = await axios.get('/api/restaurants', {
        params: {
          offset: currentPage,
          pageSize: pageSize,
          sortBy: sortBy
        }
      });
      setRestaurants(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch restaurants:', err);
      setError('Failed to load restaurants');
      setLoading(false);
    }
  };

  const searchByName = async () => {
    if (!searchName.trim()) {
      setError('Please enter a restaurant name');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`/api/restaurants/name/${searchName}`);
      setRestaurants([response.data]);
      setSearchMode('name');
      setLoading(false);
    } catch (err) {
      console.error('Failed to search by name:', err);
      setError('Restaurant not found');
      setRestaurants([]);
      setLoading(false);
    }
  };

  const searchByLocation = async () => {
    if (!searchLocation.trim()) {
      setError('Please enter a location');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`/api/restaurants/location/${searchLocation}`);
      setRestaurants(response.data);
      setSearchMode('location');
      setLoading(false);
    } catch (err) {
      console.error('Failed to search by location:', err);
      setError('No restaurants found in this location');
      setRestaurants([]);
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchName('');
    setSearchLocation('');
    setSearchMode('all');
    setCurrentPage(0);
    setError('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this restaurant?')) {
      return;
    }
    try {
      await axios.delete(`/api/restaurants/${id}`);
      setSuccessMessage('Restaurant deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      if (searchMode === 'all') {
        fetchRestaurants();
      } else {
        clearSearch();
      }
    } catch (err) {
      console.error('Failed to delete restaurant:', err);
      setError('Failed to delete restaurant');
    }
  };

  const startEdit = (restaurant) => {
    setEditingRestaurant(restaurant.id);
    setEditForm({
      name: restaurant.name,
      rating: restaurant.rating,
      location: restaurant.location
    });
  };

  const cancelEdit = () => {
    setEditingRestaurant(null);
    setEditForm({ name: '', rating: '', location: '' });
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put('/api/restaurants', {
        id: id,
        name: editForm.name,
        rating: parseFloat(editForm.rating),
        location: editForm.location
      });
      setSuccessMessage('Restaurant updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setEditingRestaurant(null);
      if (searchMode === 'all') {
        fetchRestaurants();
      } else {
        clearSearch();
      }
    } catch (err) {
      console.error('Failed to update restaurant:', err);
      setError('Failed to update restaurant: ' + (err.response?.data?.message || err.message));
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
    return <div className="loading-state">Loading...</div>;
  }

  return (
    <div className="restaurant-container">
      {/* Header */}
      <div className="restaurant-header">
        <div>
          <h1>Restaurant Management</h1>
          {user && (
            <p className="user-info">
              Welcome, <strong>{user.name}</strong> ({user.username})
              {isAdmin && <span className="admin-badge">ADMIN</span>}
            </p>
          )}
        </div>
        <div className="header-actions">
          {isAdmin && (
            <button
              onClick={() => navigate('/restaurant/new')}
              className="btn btn-primary"
            >
              + Add Restaurant
            </button>
          )}
          <button
            onClick={handleLogout}
            className="btn btn-danger"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="message message-error">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="message message-success">
          {successMessage}
        </div>
      )}

      {/* Search Section */}
      <div className="search-section">
        <h3>Search Restaurants</h3>
        <div className="search-controls">
          {/* Search by Name */}
          <div className="search-input-group">
            <input
              type="text"
              placeholder="Search by restaurant name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchByName()}
              className="input-field"
            />
            <button
              onClick={searchByName}
              className="btn btn-primary"
            >
              Search
            </button>
          </div>

          {/* Search by Location */}
          <div className="search-input-group">
            <input
              type="text"
              placeholder="Search by location"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchByLocation()}
              className="input-field"
            />
            <button
              onClick={searchByLocation}
              className="btn btn-primary"
            >
              Search
            </button>
          </div>

          {searchMode !== 'all' && (
            <button
              onClick={clearSearch}
              className="btn btn-secondary"
            >
              Clear Search
            </button>
          )}
        </div>
      </div>

      {/* Pagination and Sorting Controls (only show for 'all' mode) */}
      {searchMode === 'all' && (
        <div className="controls-bar">
          <div className="sort-controls">
            <label>
              Sort by:
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="select-field"
              >
                <option value="name">Name</option>
                <option value="rating">Rating</option>
                <option value="location">Location</option>
              </select>
            </label>
            <label>
              Page size:
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(0);
                }}
                className="select-field"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </label>
          </div>
          <div className="pagination-controls">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="btn btn-secondary"
              style={{ opacity: currentPage === 0 ? 0.5 : 1, cursor: currentPage === 0 ? 'not-allowed' : 'pointer' }}
            >
              Previous
            </button>
            <span className="page-info">Page {currentPage + 1} of {totalPages || 1}</span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage >= totalPages - 1}
              className="btn btn-secondary"
              style={{ opacity: currentPage >= totalPages - 1 ? 0.5 : 1, cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer' }}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Restaurant Table */}
      {loading ? (
        <div className="loading-state">Loading...</div>
      ) : restaurants.length === 0 ? (
        <div className="empty-state">
          <p>No restaurants found. {isAdmin && 'Click "+ Add Restaurant" to create one!'}</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="restaurant-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Rating</th>
                <th>Location</th>
                {isAdmin && <th style={{ textAlign: 'center' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {restaurants.map((restaurant) => (
                <tr key={restaurant.id}>
                  {editingRestaurant === restaurant.id ? (
                    <>
                      <td>
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="input-field"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.1"
                          value={editForm.rating}
                          onChange={(e) => setEditForm({ ...editForm, rating: e.target.value })}
                          className="input-field"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={editForm.location}
                          onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                          className="input-field"
                        />
                      </td>
                      <td className="actions-cell">
                        <button
                          onClick={() => handleUpdate(restaurant.id)}
                          className="btn btn-success"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="btn btn-secondary"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{restaurant.name}</td>
                      <td>{restaurant.rating}</td>
                      <td>{restaurant.location}</td>
                      {isAdmin && (
                        <td className="actions-cell">
                          <button
                            onClick={() => startEdit(restaurant)}
                            className="btn btn-warning"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(restaurant.id)}
                            className="btn btn-danger"
                            style={{ backgroundColor: '#fee2e2', color: '#ef4444', border: 'none' }}
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Restaurant;

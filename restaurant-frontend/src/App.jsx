import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import Login from './pages/Login'
import Register from './pages/Register'
import Restaurant from './pages/Restaurant'
import RestaurantForm from './pages/RestaurantForm'
import './App.css'

const GOOGLE_CLIENT_ID = '563249766228-7h8pf5sovka4q3jpj3ch4i4nq00gmvkq.apps.googleusercontent.com'

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/restaurant" element={<Restaurant />} />
          <Route path="/restaurant/new" element={<RestaurantForm />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  )
}

export default App

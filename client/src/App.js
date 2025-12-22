import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

// Import Pages
import Home from './pages/Home';
import Orders from './pages/Orders'; 
import CustomOrders from './pages/CustomOrders'; 
import Admin from './pages/Admin';
import Login from './pages/Login';
import Signup from './pages/Signup'; 
import MyOrders from './pages/MyOrders';// <--- Import the new page
import ProductDetails from './pages/ProductDetails';

// We create a separate Navigation Component to handle the "useNavigate" hook correctly
const Navigation = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')); // Check if user is logged in

  const handleLogout = () => {
    // 1. Remove data from storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // 2. Alert and redirect
    alert("Logged out successfully");
    navigate('/login');
    window.location.reload(); // Reload to update the navbar UI
  };

  return (
    <nav style={{ padding: '15px 30px', background: '#333', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      
      {/* Left Side: Brand & Links */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: '#fba' }}>Basho by Shivangi</h3>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
        <Link to="/orders" style={{ color: 'white', textDecoration: 'none' }}>Buy Products</Link>
        <Link to="/custom-orders" style={{ color: 'white', textDecoration: 'none' }}>Custom Requests</Link>
        <Link to="/my-orders" style={{ color: 'white', marginRight: '15px' }}>My Orders</Link>
        {/* Only show Admin link if user is admin */}
        {user && user.role === 'admin' && (
          <Link to="/admin" style={{ color: 'yellow', textDecoration: 'none', fontWeight: 'bold' }}>Admin Panel</Link>
        )}
      </div>

      {/* Right Side: Auth Buttons */}
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        {user ? (
          <>
            <span style={{ color: '#ccc' }}>Hello, {user.name}</span>
            <button 
              onClick={handleLogout} 
              style={{ background: 'red', color: 'white', border: 'none', padding: '5px 15px', cursor: 'pointer', borderRadius: '4px' }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'cyan', textDecoration: 'none' }}>Login</Link>
            <Link to="/signup" style={{ background: 'white', color: '#333', padding: '5px 15px', textDecoration: 'none', borderRadius: '4px' }}>
              Sign Up
            </Link>
            
          </>
        )}
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navigation is now inside Router so it can use Links */}
        <Navigation />

        <div style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/custom-orders" element={<CustomOrders />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} /> {/* <--- Add Route */}
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/product/:id" element={<ProductDetails />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
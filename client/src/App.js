import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

// Import Pages
import Home from './pages/Home';
import Orders from './pages/Orders'; 
import CustomOrders from './pages/CustomOrders'; 
import Admin from './pages/Admin';
import Login from './pages/Login';
import Signup from './pages/Signup'; 
import MyOrders from './pages/MyOrders';
import ProductDetails from './pages/ProductDetails';
import Workshops from './pages/Workshops';
import Event from './pages/Event';
import Testimonials from './pages/Testimonials';
// import Studio from './pages/studio';

// --- THEME CONFIGURATION ---
const palette = {
  deep: '#442D1C',
  ember: '#652810',
  copper: '#8E5022',
  flame: '#C85428',
  sand: '#EDD8B4',
  light: '#fff7eb',
  white: '#ffffff'
};

// --- NAVIGATION COMPONENT ---
const Navigation = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    alert("Logged out successfully");
    navigate('/login');
    window.location.reload();
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* CSS Styles for Responsiveness */}
      <style>{`
        .app-nav {
          padding: 15px 30px;
          background: linear-gradient(135deg, ${palette.deep}, ${palette.ember});
          color: ${palette.sand};
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 10px 30px rgba(68,45,28,0.2);
        }

        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1400px;
          margin: 0 auto;
        }

        .brand h3 { margin: 0; color: ${palette.sand}; font-size: 1.5rem; }

        /* Desktop Links */
        .nav-links {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .nav-link {
          color: ${palette.sand};
          text-decoration: none;
          font-size: 0.95rem;
          transition: color 0.3s;
        }
        .nav-link:hover { color: ${palette.flame}; }

        /* Hamburger Icon (Hidden on Desktop) */
        .hamburger {
          display: none;
          background: none;
          border: none;
          color: ${palette.sand};
          font-size: 1.8rem;
          cursor: pointer;
        }

        /* Mobile Responsive Styles */
        @media (max-width: 1024px) {
          .app-nav { padding: 15px 20px; }
          
          .hamburger { display: block; }

          .nav-links {
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: ${palette.deep};
            flex-direction: column;
            align-items: center;
            padding: 20px 0;
            gap: 25px;
            border-top: 1px solid ${palette.copper}40;
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
            
            /* Hidden by default, shown when open */
            display: ${isOpen ? 'flex' : 'none'}; 
          }
        }
      `}</style>

      <nav className="app-nav">
        <div className="nav-container">
          
          {/* Brand */}
          <div className="brand">
            <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
                <img 
                    src="/logo.jpg"  /* ⚠️ Make sure to put your image file in the 'public' folder */
                    alt="Basho by Shivangi" 
                    style={{ 
                        height: '50px',       /* Adjust height to fit your navbar */
                        objectFit: 'contain', 
                        display: 'block' 
                    }} 
                />
            </Link>
          </div>

          {/* Hamburger Button for Mobile */}
          <button className="hamburger" onClick={toggleMenu}>
            ☰
          </button>

          {/* Links Container */}
          <div className="nav-links">
            <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>
            <Link to="/orders" className="nav-link" onClick={closeMenu}>Buy Products</Link>
            <Link to="/custom-orders" className="nav-link" onClick={closeMenu}>Custom Requests</Link>
            <Link to="/my-orders" className="nav-link" onClick={closeMenu}>My Orders</Link>
            <Link to="/workshops" className="nav-link" onClick={closeMenu}>Workshops</Link>
            <Link to="/event" className="nav-link" onClick={closeMenu}>Events</Link>
            <Link to="/testimonials" className="nav-link" onClick={closeMenu}>Testimonials</Link>
            {/* <Link to="/studio" className="nav-link" onClick={closeMenu}>Studio</Link> */}
            
            {/* Admin Link */}
            {user && user.role === 'admin' && (
              <Link to="/admin" className="nav-link" onClick={closeMenu} style={{ color: palette.flame, fontWeight: 'bold' }}>
                Admin Panel
              </Link>
            )}

            {/* Auth Buttons */}
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginTop: isOpen ? '10px' : '0' }}>
              {user ? (
                <>
                  <span style={{ color: palette.sand, fontSize: '0.9rem' }}>Hello, {user.name}</span>
                  <button 
                    onClick={handleLogout} 
                    style={{ 
                      background: palette.flame, 
                      color: 'white', 
                      border: 'none', 
                      padding: '8px 16px', 
                      cursor: 'pointer', 
                      borderRadius: '999px',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="nav-link" onClick={closeMenu}>Login</Link>
                  <Link 
                    to="/signup" 
                    onClick={closeMenu}
                    style={{ 
                      background: palette.sand, 
                      color: palette.deep, 
                      padding: '8px 20px', 
                      textDecoration: 'none', 
                      borderRadius: '999px', 
                      fontWeight: 'bold' 
                    }}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="App" style={{ backgroundColor: palette.light, minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
        
        <Navigation />

        <div style={{ padding: '20px 0' }}> {/* Removed fixed padding to allow full-width heroes */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/custom-orders" element={<CustomOrders />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/workshops" element={<Workshops />} />
            <Route path="/event" element={<Event />} />
            <Route path="/testimonials" element={<Testimonials />} />
            {/* <Route path="/studio" element={<Studio />} /> */}
          </Routes>
        </div>
        
      </div>
    </Router>
  );
}

export default App;
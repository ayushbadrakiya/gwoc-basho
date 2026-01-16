import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate, useLocation } from 'react-router-dom';

// Import Pages
import Home from './pages/Home';
import Orders from './pages/Orders';
import CustomOrders from './pages/CustomOrders';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProductDetails from './pages/ProductDetails';
import Workshops from './pages/Workshops';
import Event from './pages/Event';
import Testimonials from './pages/Testimonials';
import Profile from './pages/Profile';
import Studio from './pages/studio';
import Corporate from './pages/Corporate';

// --- THEME CONFIGURATION ---
const palette = {
    deep: '#442D1C',
    ember: '#652810',
    copper: '#8E5022',
    flame: '#C85428',
    sand: '#EDD8B4',
    light: '#fff7eb',
    white: '#ffffff',
    glass: 'rgba(255, 255, 255, 0.95)' 
};

const theme = {
    ink: '#442D1C',
    bone: '#EDD8B4',
    stone: '#8E5022',
    clay: '#652810',
    accent: '#C85428',
    warm: '#8E5022',
    white: '#fff7eb',
    gold: '#C85428',
    shadow: 'rgba(68, 45, 28, 0.12)'
};

// --- HELPER: SCROLL TO TOP ---
const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

// --- NAVIGATION COMPONENT ---
const Navigation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user'));
    
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert("Logged out successfully");
        navigate('/login');
        window.location.reload();
    };

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);
    
    const isActive = (path) => location.pathname === path;

    const darkTheme = {
        bg: 'rgba(26, 18, 11, 0.85)', 
        bgScrolled: 'rgba(26, 18, 11, 0.98)', 
        text: '#F9F3E9', 
        active: '#C85428', 
        accent: '#EDD8B4', 
        border: 'rgba(237, 216, 180, 0.15)'
    };
    
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Poppins:wght@400;500;600&display=swap');

                .app-nav {
                    padding: ${scrolled ? '15px 30px' : '25px 30px'};
                    background: ${scrolled ? darkTheme.bgScrolled : darkTheme.bg};
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: ${scrolled ? '0 10px 30px rgba(0,0,0,0.3)' : '0 1px 0 rgba(255,255,255,0.05)'};
                    font-family: 'Poppins', sans-serif;
                    width: 100%; /* Ensure full width */
                    box-sizing: border-box; /* Include padding in width */
                }

                .nav-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    max-width: 1400px;
                    margin: 0 auto;
                    width: 100%;
                }

                /* LOGO */
                .brand a {
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                }
                .brand img {
                    height: 45px;
                    transition: transform 0.3s;
                }
                .brand:hover img { transform: scale(1.05); }

                /* DESKTOP LINKS */
                .nav-links {
                    display: flex;
                    gap: 35px;
                    align-items: center;
                }

                .nav-link {
                    color: ${darkTheme.text};
                    text-decoration: none;
                    font-size: 0.9rem;
                    font-weight: 500;
                    position: relative;
                    transition: color 0.3s;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    opacity: 0.85;
                }

                .nav-link.active {
                    color: ${darkTheme.active};
                    font-weight: 600;
                    opacity: 1;
                }

                .nav-link::after {
                    content: '';
                    position: absolute;
                    width: 0;
                    height: 2px;
                    bottom: -6px;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: ${darkTheme.active};
                    transition: width 0.3s ease;
                }

                .nav-link:hover::after { width: 100%; }
                .nav-link:hover { color: ${darkTheme.active}; opacity: 1; }

                /* BUTTONS */
                .nav-btn-primary {
                    background: linear-gradient(135deg, ${palette.flame}, #A04010);
                    color: #fff;
                    padding: 10px 24px;
                    border-radius: 30px;
                    text-decoration: none;
                    font-size: 0.9rem;
                    font-weight: 600;
                    transition: all 0.3s;
                    border: none;
                    cursor: pointer;
                    box-shadow: 0 4px 15px rgba(200, 84, 40, 0.4);
                }
                .nav-btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(200, 84, 40, 0.6);
                    background: linear-gradient(135deg, #A04010, ${palette.flame});
                }

                .nav-btn-outline {
                    border: 1px solid ${darkTheme.accent};
                    color: ${darkTheme.accent};
                    background: transparent;
                    padding: 8px 20px;
                    border-radius: 30px;
                    text-decoration: none;
                    font-size: 0.9rem;
                    font-weight: 500;
                    transition: all 0.3s;
                    letter-spacing: 0.5px;
                }
                .nav-btn-outline:hover {
                    background: ${darkTheme.accent};
                    color: #1A1A1A; 
                    border-color: ${darkTheme.accent};
                }

                /* HAMBURGER */
                .hamburger {
                    display: none;
                    background: none;
                    border: none;
                    font-size: 1.8rem;
                    color: ${darkTheme.text};
                    cursor: pointer;
                    transition: color 0.3s;
                }
                .hamburger:hover { color: ${darkTheme.active}; }

                /* MOBILE MENU */
                @media (max-width: 1024px) {
                    .hamburger { display: block; }
                    
                    .nav-links {
                        position: absolute;
                        top: 100%;
                        left: 0;
                        width: 100%;
                        background: #1A120B; 
                        flex-direction: column;
                        align-items: center;
                        padding: 40px 0;
                        gap: 25px;
                        box-shadow: 0 20px 40px rgba(0,0,0,0.4);
                        border-top: 1px solid rgba(255,255,255,0.1);
                        
                        transform: ${isOpen ? 'translateY(0)' : 'translateY(-20px)'};
                        opacity: ${isOpen ? '1' : '0'};
                        pointer-events: ${isOpen ? 'all' : 'none'};
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    }
                }
            `}</style>

            <nav className="app-nav">
                <div className="nav-container">

                    {/* Brand */}
                    <div className="brand">
                        <Link to="/" onClick={closeMenu}>
                            <img src="https://res.cloudinary.com/dnbplr9pw/image/upload/v1768483654/logo_qp2lvq.jpg" alt="Basho" />
                        </Link>
                    </div>

                    {/* Hamburger Button */}
                    <button className="hamburger" onClick={toggleMenu}>
                        {isOpen ? '✕' : '☰'}
                    </button>

                    {/* Navigation Links */}
                    <div className="nav-links">
                        <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} onClick={closeMenu}>Home</Link>
                        <Link to="/orders" className={`nav-link ${isActive('/orders') ? 'active' : ''}`} onClick={closeMenu}>Shop</Link>
                        <Link to="/custom-orders" className={`nav-link ${isActive('/custom-orders') ? 'active' : ''}`} onClick={closeMenu}>Custom</Link>
                        
                        <Link to="/workshops" className={`nav-link ${isActive('/workshops') ? 'active' : ''}`} onClick={closeMenu}>Workshops</Link>
                        <Link to="/event" className={`nav-link ${isActive('/event') ? 'active' : ''}`} onClick={closeMenu}>Events</Link>
                        <Link to="/testimonials" className={`nav-link ${isActive('/testimonials') ? 'active' : ''}`} onClick={closeMenu}>Stories</Link>
                        <Link to="/studio" className={`nav-link ${isActive('/studio') ? 'active' : ''}`} onClick={closeMenu}>About Us</Link>
                        <Link to="/corporate" className={`nav-link ${isActive('/corporate') ? 'active' : ''}`} onClick={closeMenu}>Collab and Corporate</Link>
                        

                        {/* Admin Link */}
                        {user && user.role === 'admin' && (
                            <Link to="/admin" className="nav-link" onClick={closeMenu} style={{ color: palette.flame }}>
                                Admin Panel
                            </Link>
                        )}

                        {/* Auth Buttons */}
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginLeft: '10px' }}>
                            {user ? (
                                <>
                                    <Link to="/profile" onClick={closeMenu} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '35px', height: '35px', background: palette.copper, color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem', border: '2px solid rgba(255,255,255,0.2)' }}>
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                    </Link>
                                    <button onClick={handleLogout} className="nav-btn-outline">
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="nav-link" onClick={closeMenu} style={{fontSize: '0.9rem'}}>Login</Link>
                                    <Link to="/signup" className="nav-btn-primary" onClick={closeMenu}>
                                        Join
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

const Footer = () => {
    return (
        <footer style={{ backgroundColor: theme.ink, color: theme.bone, padding: '80px 24px', fontFamily: 'Poppins, sans-serif' }}>
            <div style={{ 
                display: 'grid', 
                gap: '50px', 
                maxWidth: '1400px', 
                margin: '0 auto',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' 
            }}>

                {/* Brand Column */}
                <div>
                    <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '3.5rem', margin: 0, lineHeight: 1, color: palette.sand }}>Basho.</h2>
                    <p style={{ opacity: 0.7, marginTop: '20px', lineHeight: '1.6', maxWidth: '300px' }}>
                        Handcrafted pottery inspired by the quiet beauty of Japanese aesthetics. Each piece tells a story of earth and fire.
                    </p>

                    <div style={{ marginTop: '25px' }}>
                        <a 
                            href="https://www.instagram.com/bashobyyshivangi/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                gap: '10px', 
                                color: palette.flame, 
                                textDecoration: 'none', 
                                fontWeight: '600',
                                fontSize: '0.9rem',
                                transition: 'opacity 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
                            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                            <span>Follow on Instagram</span>
                        </a>
                    </div>
                </div>

                {/* Studio Info Column */}
                <div>
                    <h4 style={{ color: theme.bone, opacity: 0.5, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>Visit Us</h4>
                    <p style={{ opacity: 0.9, lineHeight: '1.6' }}>
                        311, Silent Zone, Gavier,  Dumas Road<br />
                        Surat-395007, Gujarat, India<br />
                        <br />
                        <strong>Open Hours:</strong><br />
                        Mon - Sat: 10am - 7pm<br />
                        Sun: By Appointment
                    </p>
                </div>

                {/* Links Column */}
                <div>
                    <h4 style={{ color: theme.bone, opacity: 0.5, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>Explore</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <Link to="/orders" style={{ color: theme.bone, textDecoration: 'none', opacity: 0.8, transition: '0.2s' }}>Shop Collection</Link>
                        <Link to="/workshops" style={{ color: theme.bone, textDecoration: 'none', opacity: 0.8, transition: '0.2s' }}>Workshops & Classes</Link>
                        <Link to="/custom-orders" style={{ color: theme.bone, textDecoration: 'none', opacity: 0.8, transition: '0.2s' }}>Custom Requests</Link>
                        <Link to="/event" style={{ color: theme.bone, textDecoration: 'none', opacity: 0.8, transition: '0.2s' }}>Upcoming Events</Link>
                        <Link to="/testimonials" style={{ color: theme.bone, textDecoration: 'none', opacity: 0.8, transition: '0.2s' }}>Community Stories</Link>
                    </div>
                </div>

            </div>
            
            <div style={{ maxWidth: '1400px', margin: '60px auto 0', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', opacity: 0.6, fontSize: '0.85rem' }}>
                <div>© 2024 Basho byy Shivangi. All rights reserved.</div>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <span>Privacy Policy</span>
                    <span>Terms of Service</span>
                </div>
            </div>
        </footer>
    );
};

const AdminRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }
    return children;
};

function App() {
    return (
        <Router>
            <ScrollToTop /> {/* Ensures pages start at top when navigating */}
            
            {/* GLOBAL STYLES FOR FIXING LAYOUT ISSUES */}
            <style>{`
                body, html {
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    max-width: 100%;
                    overflow-x: hidden; /* Stops horizontal scrolling */
                    box-sizing: border-box;
                }
                * {
                    box-sizing: border-box;
                }
                .App {
                    width: 100%;
                    max-width: 100vw;
                    overflow-x: hidden;
                }
            `}</style>

            <div className="App" style={{ backgroundColor: palette.light, minHeight: '100vh', fontFamily: 'Poppins, sans-serif' }}>
                
                <Navigation />

                <div style={{ minHeight: '80vh' }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/custom-orders" element={<CustomOrders />} />
                        <Route 
                            path="/admin" 
                            element={
                                <AdminRoute>
                                    <Admin />
                                </AdminRoute>
                            } 
                        />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        
                        <Route path="/product/:id" element={<ProductDetails />} />
                        <Route path="/workshops" element={<Workshops />} />
                        <Route path="/event" element={<Event />} />
                        <Route path="/testimonials" element={<Testimonials />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/studio" element={<Studio />} />
                        <Route path="/corporate" element={<Corporate />} />
                    </Routes>
                </div>

                <Footer />
            </div>
        </Router>
    );
}

export default App;
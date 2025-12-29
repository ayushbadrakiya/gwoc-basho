import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

// --- THEME CONFIGURATION ---
const palette = {
    deep: '#442D1C',
    ember: '#652810',
    copper: '#8E5022',
    flame: '#C85428',
    sand: '#EDD8B4',
    lightSand: '#F9F3E9',
    white: '#FFFFFF'
};

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            // Direct POST request with email & password
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });

            if (res.data.success) {
                alert("Logged in Successfully!");

                // Save Token & User Info
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));

                // Redirect to Home/Dashboard
                navigate('/');
                window.location.reload();
            }
        } catch (err) {
            // Handle Errors (Wrong password, User not found, etc.)
            alert("Login Failed: " + (err.response?.data?.msg || "Server Error"));
        }
    };

    // --- STYLES OBJECT ---
    const styles = {
        page: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh', // Centers vertically
            background: `linear-gradient(180deg, ${palette.lightSand}, rgba(237,216,180,0.2))`,
            padding: '20px',
            fontFamily: 'Arial, sans-serif'
        },
        box: {
            width: '100%',
            maxWidth: '400px',
            padding: '30px',
            borderRadius: '14px',
            background: palette.white,
            border: `1px solid ${palette.copper}30`,
            boxShadow: '0 14px 30px rgba(68,45,28,0.08)'
        },
        label: {
            display: 'block',
            marginBottom: '8px',
            color: palette.ember,
            fontWeight: 'bold',
            fontSize: '0.9rem'
        },
        input: {
            width: '100%',
            padding: '12px',
            borderRadius: '10px',
            border: `1px solid ${palette.copper}40`,
            backgroundColor: 'rgba(237,216,180,0.15)',
            fontSize: '1rem',
            boxSizing: 'border-box'
        },
        button: {
            width: '100%',
            padding: '12px',
            background: `linear-gradient(135deg, ${palette.flame}, ${palette.ember})`,
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
            boxShadow: '0 10px 18px rgba(200,84,40,0.22)',
            marginTop: '10px',
            transition: 'transform 0.2s'
        }
    };

    return (
        <div style={styles.page}>
            {/* CSS FOR FOCUS STATES */}
            <style>{`
                input:focus {
                    outline: none;
                    border-color: ${palette.flame} !important;
                    background-color: #fff !important;
                    box-shadow: 0 0 0 3px rgba(200,84,40,0.1);
                }
                button:hover {
                    transform: translateY(-2px);
                    opacity: 0.95;
                }
            `}</style>

            <div style={styles.box} className="auth-box">
                <h2 style={{ textAlign: 'center', color: palette.deep, marginTop: 0, marginBottom: '25px', fontSize: '1.8rem' }}>
                    Welcome Back
                </h2>

                <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={styles.label}>Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            style={styles.input}
                        />
                    </div>

                    <div>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            style={styles.input}
                        />
                    </div>

                    <button type="submit" style={styles.button}>
                        Login
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: '#666' }}>
                    New here? <Link to="/signup" style={{ color: palette.flame, fontWeight: 'bold', textDecoration: 'none' }}>Create an Account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
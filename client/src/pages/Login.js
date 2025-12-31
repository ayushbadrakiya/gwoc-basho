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
    white: '#FFFFFF',
    shadow: 'rgba(68, 45, 28, 0.1)'
};

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Added for animation
    const navigate = useNavigate();

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Start Loading Animation

        try {
            // Direct POST request with email & password
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });

            if (res.data.success) {
                // Short delay to let the user see the success state
                setTimeout(() => {
                    alert("Logged in Successfully!");
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                    navigate('/');
                    window.location.reload();
                }, 500);
            }
        } catch (err) {
            alert("Login Failed: " + (err.response?.data?.msg || "Server Error"));
            setIsLoading(false); // Stop Loading on Error
        }
    };

    return (
        <div className="login-page">
            {/* --- CSS STYLES & ANIMATIONS --- */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

                .login-page {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background: radial-gradient(circle at top left, ${palette.lightSand}, #F2E6D8);
                    font-family: 'Poppins', sans-serif;
                    padding: 20px;
                }

                .auth-card {
                    width: 100%;
                    max-width: 420px;
                    background: ${palette.white};
                    padding: 40px;
                    border-radius: 20px;
                    box-shadow: 0 20px 60px ${palette.shadow}, 0 0 0 1px rgba(142, 80, 34, 0.05);
                    animation: slideUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }

                /* Decorative top border */
                .auth-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0; height: 6px;
                    background: linear-gradient(90deg, ${palette.copper}, ${palette.flame});
                }

                .header-title {
                    text-align: center;
                    color: ${palette.deep};
                    margin: 0 0 10px 0;
                    font-size: 2rem;
                    font-weight: 600;
                    letter-spacing: -0.5px;
                }

                .header-subtitle {
                    text-align: center;
                    color: ${palette.ember};
                    margin: 0 0 30px 0;
                    font-size: 0.95rem;
                    opacity: 0.7;
                }

                .input-group {
                    margin-bottom: 20px;
                }

                .modern-label {
                    display: block;
                    margin-bottom: 8px;
                    color: ${palette.deep};
                    font-weight: 500;
                    font-size: 0.9rem;
                    margin-left: 4px;
                }

                .modern-input {
                    width: 100%;
                    padding: 14px 16px;
                    border: 2px solid #EEE;
                    background-color: #FAFAFA;
                    border-radius: 12px;
                    font-size: 1rem;
                    color: ${palette.deep};
                    transition: all 0.3s ease;
                    box-sizing: border-box;
                }

                .modern-input:focus {
                    outline: none;
                    border-color: ${palette.copper};
                    background-color: ${palette.white};
                    box-shadow: 0 4px 12px rgba(142, 80, 34, 0.1);
                }

                .modern-input::placeholder {
                    color: #CCC;
                }

                .login-btn {
                    width: 100%;
                    padding: 16px;
                    background: linear-gradient(135deg, ${palette.flame}, ${palette.ember});
                    color: white;
                    border: none;
                    border-radius: 12px;
                    cursor: pointer;
                    font-size: 1rem;
                    font-weight: 600;
                    margin-top: 10px;
                    transition: all 0.3s ease;
                    box-shadow: 0 10px 20px rgba(200, 84, 40, 0.2);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: relative;
                }

                .login-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 30px rgba(200, 84, 40, 0.3);
                }

                .login-btn:disabled {
                    background: #DDD;
                    cursor: not-allowed;
                    box-shadow: none;
                    transform: none;
                }

                .footer-text {
                    text-align: center;
                    margin-top: 25px;
                    font-size: 0.9rem;
                    color: #888;
                }

                .link-text {
                    color: ${palette.flame};
                    font-weight: 600;
                    text-decoration: none;
                    transition: color 0.2s;
                }
                
                .link-text:hover {
                    color: ${palette.deep};
                    text-decoration: underline;
                }

                /* --- ANIMATIONS --- */
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .spinner {
                    width: 20px;
                    height: 20px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-radius: 50%;
                    border-top-color: #FFF;
                    animation: spin 0.8s linear infinite;
                }
            `}</style>

            <div className="auth-card">
                <h2 className="header-title">Welcome Back</h2>
                <p className="header-subtitle">Enter your credentials to access your account</p>

                <form onSubmit={handleLoginSubmit}>
                    <div className="input-group">
                        <label className="modern-label">Email Address</label>
                        <input
                            className="modern-input"
                            type="email"
                            placeholder="e.g. hello@example.com"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="input-group">
                        <label className="modern-label">Password</label>
                        <input
                            className="modern-input"
                            type="password"
                            placeholder="••••••••"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <button type="submit" className="login-btn" disabled={isLoading}>
                        {isLoading ? <div className="spinner"></div> : "Login"}
                    </button>
                </form>

                <p className="footer-text">
                    New here? <Link to="/signup" className="link-text">Create an Account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
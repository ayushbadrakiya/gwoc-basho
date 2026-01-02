import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Key, Eye, EyeOff, X, RefreshCw } from 'lucide-react'; // Added RefreshCw icon

// --- THEME ---
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
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // --- FORGOT PASSWORD STATES ---
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [resetStep, setResetStep] = useState(1); // 1: Email, 2: OTP & New Pass
    const [resetEmail, setResetEmail] = useState('');
    const [resetOtp, setResetOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [resetLoading, setResetLoading] = useState(false);

    const navigate = useNavigate();

    // --- NORMAL LOGIN ---
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            
            if (res.data.user.role === 'admin') navigate('/admin');
            else navigate('/');
            
            window.location.reload(); 
        } catch (err) {
            alert(err.response?.data?.msg || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    // --- FORGOT PASSWORD HANDLERS ---
    const handleRequestOtp = async (e) => {
        if(e) e.preventDefault(); // Handle cases where it's called without event (Resend)
        setResetLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/auth/forgot-password-otp', { email: resetEmail });
            if (res.data.success) {
                alert("OTP sent to your email!");
                setResetStep(2);
            }
        } catch (err) {
            alert(err.response?.data?.message || "Failed to send OTP. Check email.");
        } finally {
            setResetLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setResetLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/auth/reset-password', {
                email: resetEmail,
                otp: resetOtp,
                newPassword: newPassword
            });
            if (res.data.success) {
                alert("Password Reset Successfully! Please Login.");
                setShowForgotModal(false);
                setResetStep(1);
                setResetEmail('');
                setResetOtp('');
                setNewPassword('');
            }
        } catch (err) {
            alert(err.response?.data?.message || "Reset failed. Invalid OTP?");
        } finally {
            setResetLoading(false);
        }
    };

    return (
        <div className="login-page">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;1,600&family=Poppins:wght@300;400;500;600&display=swap');

                .login-page {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: radial-gradient(circle at top right, #fff 0%, ${palette.lightSand} 100%);
                    font-family: 'Poppins', sans-serif;
                    padding: 20px;
                }

                .login-card {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    padding: 50px 40px;
                    border-radius: 24px;
                    width: 100%;
                    max-width: 420px;
                    box-shadow: 0 20px 60px rgba(68, 45, 28, 0.08);
                    border: 1px solid rgba(142, 80, 34, 0.1);
                    text-align: center;
                    animation: slideUp 0.6s ease;
                }

                .title {
                    font-family: 'Playfair Display', serif;
                    font-size: 2.5rem;
                    color: ${palette.deep};
                    margin-bottom: 10px;
                }

                .subtitle { color: #888; font-size: 0.95rem; margin-bottom: 30px; }

                .input-group { position: relative; margin-bottom: 20px; text-align: left; }
                .input-icon { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: ${palette.copper}; opacity: 0.7; }
                
                .form-input {
                    width: 100%;
                    padding: 14px 14px 14px 45px;
                    border-radius: 12px;
                    border: 1px solid #e0e0e0;
                    background: #FAFAFA;
                    font-size: 1rem;
                    box-sizing: border-box;
                    transition: 0.3s;
                }
                .form-input:focus { outline: none; border-color: ${palette.flame}; background: #FFF; box-shadow: 0 0 0 4px rgba(200,84,40,0.1); }

                .login-btn {
                    width: 100%;
                    padding: 14px;
                    background: ${palette.flame};
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: 0.3s;
                    margin-top: 10px;
                    box-shadow: 0 4px 15px rgba(200,84,40,0.3);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 10px;
                }
                .login-btn:hover:not(:disabled) { background: ${palette.ember}; transform: translateY(-2px); }
                .login-btn:disabled { background: #CCC; cursor: not-allowed; box-shadow: none; transform: none; }

                /* --- SPINNER ANIMATION --- */
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                .spinner {
                    width: 20px; height: 20px;
                    border: 3px solid rgba(255,255,255,0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }

                .forgot-link {
                    display: block;
                    text-align: right;
                    margin-top: -10px;
                    margin-bottom: 20px;
                    color: ${palette.flame};
                    font-size: 0.85rem;
                    text-decoration: none;
                    cursor: pointer;
                    transition: 0.2s;
                }
                .forgot-link:hover { text-decoration: underline; color: ${palette.deep}; }

                /* --- MODAL STYLES --- */
                .modal-overlay {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(44, 27, 16, 0.6);
                    backdrop-filter: blur(5px);
                    display: flex; justify-content: center; align-items: center;
                    z-index: 1000; animation: fadeIn 0.3s;
                }
                .modal-box {
                    background: white; width: 90%; max-width: 400px;
                    padding: 30px; border-radius: 20px;
                    position: relative;
                    box-shadow: 0 25px 50px rgba(0,0,0,0.2);
                    animation: scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .close-btn {
                    position: absolute; top: 15px; right: 15px;
                    background: none; border: none; cursor: pointer; color: #999;
                }
                .close-btn:hover { color: ${palette.flame}; }

                .resend-btn {
                    background: none; border: none;
                    color: ${palette.copper};
                    font-size: 0.85rem;
                    font-weight: 600;
                    cursor: pointer;
                    margin-top: 15px;
                    text-decoration: underline;
                    display: flex; alignItems: center; justify-content: center; gap: 5px;
                    width: 100%;
                }
                .resend-btn:hover { color: ${palette.flame}; }
                .resend-btn:disabled { color: #ccc; cursor: not-allowed; text-decoration: none; }

                @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            `}</style>

            <div className="login-card">
                <h1 className="title">Welcome Back</h1>
                <p className="subtitle">Enter your details to access your account</p>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <Mail className="input-icon" size={20} />
                        <input 
                            className="form-input" 
                            type="email" 
                            name="email" 
                            placeholder="Email Address" 
                            required 
                            value={formData.email} 
                            onChange={handleChange} 
                        />
                    </div>

                    <div className="input-group">
                        <Lock className="input-icon" size={20} />
                        <input 
                            className="form-input" 
                            type={showPassword ? "text" : "password"} 
                            name="password" 
                            placeholder="Password" 
                            required 
                            value={formData.password} 
                            onChange={handleChange} 
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <span className="forgot-link" onClick={() => setShowForgotModal(true)}>
                        Forgot Password?
                    </span>

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? <div className="spinner"></div> : 'Sign In'}
                    </button>
                </form>

                <p style={{ marginTop: '20px', fontSize: '0.9rem', color: '#666' }}>
                    Don't have an account? <Link to="/signup" style={{ color: palette.flame, fontWeight: '600', textDecoration: 'none' }}>Sign Up</Link>
                </p>
            </div>

            {/* --- FORGOT PASSWORD MODAL --- */}
            {showForgotModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <button className="close-btn" onClick={() => setShowForgotModal(false)}><X size={24} /></button>
                        
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <div style={{ width: '50px', height: '50px', background: palette.lightSand, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', color: palette.flame }}>
                                <Key size={24} />
                            </div>
                            <h3 style={{ fontFamily: 'Playfair Display, serif', margin: 0, color: palette.deep, fontSize: '1.5rem' }}>
                                {resetStep === 1 ? 'Reset Password' : 'Verify & Update'}
                            </h3>
                            <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
                                {resetStep === 1 ? 'Enter your email to receive an OTP' : 'Enter the OTP sent to your email'}
                            </p>
                        </div>

                        {resetStep === 1 ? (
                            <form onSubmit={handleRequestOtp}>
                                <div className="input-group">
                                    <Mail className="input-icon" size={18} />
                                    <input 
                                        className="form-input" 
                                        type="email" 
                                        placeholder="Your Email" 
                                        required 
                                        value={resetEmail}
                                        onChange={(e) => setResetEmail(e.target.value)}
                                    />
                                </div>
                                <button type="submit" className="login-btn" disabled={resetLoading}>
                                    {resetLoading ? <div className="spinner"></div> : 'Send OTP'}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleResetPassword}>
                                <div className="input-group">
                                    <Key className="input-icon" size={18} />
                                    <input 
                                        className="form-input" 
                                        placeholder="Enter 6-digit OTP" 
                                        required 
                                        value={resetOtp}
                                        onChange={(e) => setResetOtp(e.target.value)}
                                        style={{ letterSpacing: '2px', fontWeight: 'bold' }}
                                    />
                                </div>
                                <div className="input-group">
                                    <Lock className="input-icon" size={18} />
                                    <input 
                                        className="form-input" 
                                        type="password"
                                        placeholder="New Password" 
                                        required 
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                                
                                <button type="submit" className="login-btn" disabled={resetLoading}>
                                    {resetLoading ? <div className="spinner"></div> : 'Update Password'}
                                </button>

                                {/* --- RESEND BUTTON --- */}
                                <button 
                                    type="button" 
                                    className="resend-btn"
                                    onClick={() => handleRequestOtp()}
                                    disabled={resetLoading}
                                >
                                    <RefreshCw size={14} className={resetLoading ? "spin-icon" : ""} /> Resend OTP
                                </button>

                                <button 
                                    type="button" 
                                    onClick={() => setResetStep(1)}
                                    style={{ background: 'none', border: 'none', color: '#888', width: '100%', marginTop: '10px', cursor: 'pointer', fontSize: '0.8rem' }}
                                >
                                    Change Email
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
};

export default Login;
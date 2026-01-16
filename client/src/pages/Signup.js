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

const Signup = () => {
    // Added 'step' to track if we are entering details (1) or OTP (2)
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    
    // --- NEW LOADING STATE ---
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // STEP 1: Send Details & Request OTP
    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Start Loading
        try {
            const res = await axios.post('https://gwoc-basho-1.onrender.com/api/auth/register', formData);

            // If backend says OTP sent, switch to Step 2
            if (res.data.step === 'OTP_SENT') {
                setTimeout(() => {
                    setStep(2);
                    setIsLoading(false); // Stop Loading
                }, 500); // Small delay for animation smoothness
                alert("OTP sent to your email! Please check inbox.");
            } else {
                setIsLoading(false);
            }
        } catch (err) {
            alert(err.response?.data?.msg || "Registration Failed");
            setIsLoading(false);
        }
    };

    // STEP 2: Verify OTP & Finalize Registration
    const handleVerify = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Start Loading
        try {
            const res = await axios.post('https://gwoc-basho-1.onrender.com/api/auth/verify-register', {
                email: formData.email,
                otp: otp
            });

            if (res.data.success) {
                alert("Account Verified Successfully! Please Login.");
                navigate('/login');
            }
        } catch (err) {
            alert(err.response?.data?.msg || "Invalid OTP");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="signup-page">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

                .signup-page {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background: radial-gradient(circle at top right, ${palette.lightSand}, #F2E6D8);
                    font-family: 'Poppins', sans-serif;
                    padding: 20px;
                }

                .auth-card {
                    width: 100%;
                    max-width: 450px;
                    background: ${palette.white};
                    padding: 40px;
                    border-radius: 20px;
                    box-shadow: 0 20px 60px ${palette.shadow}, 0 0 0 1px rgba(142, 80, 34, 0.05);
                    position: relative;
                    overflow: hidden;
                    animation: cardEntry 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
                }

                .auth-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0; height: 6px;
                    background: linear-gradient(90deg, ${palette.flame}, ${palette.copper});
                }

                .header-title {
                    text-align: center;
                    color: ${palette.deep};
                    margin: 0 0 10px 0;
                    font-size: 1.8rem;
                    font-weight: 600;
                    letter-spacing: -0.5px;
                }

                .header-subtitle {
                    text-align: center;
                    color: ${palette.ember};
                    margin: 0 0 30px 0;
                    font-size: 0.9rem;
                    opacity: 0.7;
                }

                /* --- PROGRESS BAR --- */
                .progress-container {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 30px;
                    justify-content: center;
                }
                .step-dot {
                    height: 4px;
                    width: 40px;
                    border-radius: 2px;
                    background: #EEE;
                    transition: all 0.3s ease;
                }
                .step-dot.active {
                    background: ${palette.flame};
                }

                /* --- INPUTS --- */
                .input-group {
                    margin-bottom: 20px;
                    animation: slideUp 0.5s ease;
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

                /* --- BUTTONS --- */
                .primary-btn {
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
                }

                .primary-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 30px rgba(200, 84, 40, 0.3);
                }

                .primary-btn:disabled {
                    background: #DDD;
                    cursor: not-allowed;
                    box-shadow: none;
                    transform: none;
                }

                .link-btn {
                    background: none;
                    border: none;
                    color: ${palette.flame};
                    cursor: pointer;
                    font-size: 0.9rem;
                    font-weight: 500;
                    text-decoration: underline;
                    margin-top: 15px;
                    transition: color 0.2s;
                }
                .link-btn:hover { color: ${palette.deep}; }

                /* --- OTP SPECIFIC --- */
                .otp-box {
                    background: #FFF5F0;
                    border: 1px dashed ${palette.flame};
                    padding: 15px;
                    border-radius: 12px;
                    text-align: center;
                    margin-bottom: 20px;
                    color: ${palette.ember};
                    font-size: 0.9rem;
                    animation: fadeIn 0.5s ease;
                }

                /* --- ANIMATIONS --- */
                @keyframes cardEntry {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
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
                <h2 className="header-title">
                    {step === 1 ? 'Create Account' : 'Verify Email'}
                </h2>
                <p className="header-subtitle">
                    {step === 1 ? 'Join us to start your journey' : 'Secure your account'}
                </p>

                {/* Progress Indicators */}
                <div className="progress-container">
                    <div className={`step-dot ${step >= 1 ? 'active' : ''}`}></div>
                    <div className={`step-dot ${step >= 2 ? 'active' : ''}`}></div>
                </div>

                {/* --- STEP 1: USER DETAILS FORM --- */}
                {step === 1 && (
                    <form onSubmit={handleRegister}>
                        <div className="input-group">
                            <input
                                className="modern-input"
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="input-group">
                            <input
                                className="modern-input"
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="input-group">
                            <input
                                className="modern-input"
                                type="password"
                                name="password"
                                placeholder="Create Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <button type="submit" className="primary-btn" disabled={isLoading}>
                            {isLoading ? <div className="spinner"></div> : "Next: Verify Email"}
                        </button>
                    </form>
                )}

                {/* --- STEP 2: OTP VERIFICATION FORM --- */}
                {step === 2 && (
                    <form onSubmit={handleVerify}>
                        <div className="otp-box">
                            We've sent a 6-digit code to <br />
                            <strong>{formData.email}</strong>
                        </div>

                        <div className="input-group">
                            <input
                                className="modern-input"
                                type="text"
                                placeholder="• • • • • •"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                style={{ textAlign: 'center', letterSpacing: '8px', fontWeight: 'bold', fontSize: '1.2rem' }}
                                disabled={isLoading}
                            />
                        </div>

                        <button type="submit" className="primary-btn" disabled={isLoading}>
                            {isLoading ? <div className="spinner"></div> : "Verify & Complete"}
                        </button>

                        <div style={{ textAlign: 'center' }}>
                            <button type="button" onClick={() => setStep(1)} className="link-btn">
                                Wrong Email? Go Back
                            </button>
                        </div>
                    </form>
                )}

                {step === 1 && (
                    <p style={{ textAlign: 'center', marginTop: '25px', fontSize: '0.9rem', color: '#888' }}>
                        Already have an account? <Link to="/login" style={{ color: palette.flame, fontWeight: '600', textDecoration: 'none' }}>Login</Link>
                    </p>
                )}
            </div>
        </div>
    );
};

export default Signup;
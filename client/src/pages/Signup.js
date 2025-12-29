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

const Signup = () => {
    // Added 'step' to track if we are entering details (1) or OTP (2)
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState(''); // Store the OTP input
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // STEP 1: Send Details & Request OTP
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', formData);

            // If backend says OTP sent, switch to Step 2
            if (res.data.step === 'OTP_SENT') {
                setStep(2);
                alert("OTP sent to your email! Please check inbox.");
            }
        } catch (err) {
            alert(err.response?.data?.msg || "Registration Failed");
        }
    };

    // STEP 2: Verify OTP & Finalize Registration
    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/verify-register', {
                email: formData.email,
                otp: otp
            });

            if (res.data.success) {
                alert("Account Verified Successfully! Please Login.");
                navigate('/login');
            }
        } catch (err) {
            alert(err.response?.data?.msg || "Invalid OTP");
        }
    };

    // --- STYLES OBJECT ---
    const styles = {
        page: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '85vh',
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
        header: {
            textAlign: 'center',
            color: palette.deep,
            marginTop: 0,
            marginBottom: '20px',
            fontSize: '1.8rem'
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
            transition: 'transform 0.2s'
        },
        linkBtn: {
            background: 'none',
            border: 'none',
            color: palette.flame,
            cursor: 'pointer',
            textDecoration: 'underline',
            fontSize: '0.9rem',
            marginTop: '10px'
        }
    };

    return (
        <div style={styles.page}>
            {/* CSS FOR FOCUS & HOVER */}
            <style>{`
                input:focus {
                    outline: none;
                    border-color: ${palette.flame} !important;
                    background-color: #fff !important;
                    box-shadow: 0 0 0 3px rgba(200,84,40,0.1);
                }
                button[type="submit"]:hover {
                    transform: translateY(-2px);
                    opacity: 0.95;
                }
            `}</style>

            <div style={styles.box} className="auth-box">
                <h2 style={styles.header}>
                    {step === 1 ? 'Create Account' : 'Verify Email'}
                </h2>

                {/* --- STEP 1: USER DETAILS FORM --- */}
                {step === 1 && (
                    <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />

                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />

                        <button type="submit" style={styles.button}>
                            Next (Send OTP)
                        </button>
                    </form>
                )}

                {/* --- STEP 2: OTP VERIFICATION FORM --- */}
                {step === 2 && (
                    <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ textAlign: 'center', background: '#FFF5F0', padding: '10px', borderRadius: '8px', border: `1px solid ${palette.flame}40` }}>
                            <p style={{ fontSize: '0.9rem', margin: 0, color: palette.ember }}>
                                Enter the code sent to <br /><strong>{formData.email}</strong>
                            </p>
                        </div>

                        <input
                            type="text"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            style={{ ...styles.input, textAlign: 'center', letterSpacing: '3px', fontWeight: 'bold', fontSize: '1.2rem' }}
                        />

                        <button type="submit" style={styles.button}>
                            Verify & Sign Up
                        </button>

                        {/* Option to go back if email was wrong */}
                        <div style={{ textAlign: 'center' }}>
                            <button type="button" onClick={() => setStep(1)} style={styles.linkBtn}>
                                Wrong Email? Go Back
                            </button>
                        </div>
                    </form>
                )}

                {step === 1 && (
                    <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: '#666' }}>
                        Already have an account? <Link to="/login" style={{ color: palette.flame, fontWeight: 'bold', textDecoration: 'none' }}>Login here</Link>
                    </p>
                )}
            </div>
        </div>
    );
};

export default Signup;
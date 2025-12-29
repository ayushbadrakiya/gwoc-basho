import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

const CustomOrders = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const [formData, setFormData] = useState({
        description: '', material: '',
        address: '', city: '', zip: '', phone: ''
    });

    // New State for Images
    const [selectedFiles, setSelectedFiles] = useState([]);

    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // Handle File Selection
    const handleFileChange = (e) => {
        setSelectedFiles(e.target.files);
    };

    // 1. Request OTP
    const handleRequestOtp = async (e) => {
        e.preventDefault();
        if (!user) return navigate('/login');
        try {
            await axios.post('http://localhost:5000/api/auth/req-otp', { email: user.email });
            setOtpSent(true);
            alert(`OTP sent to ${user.email}`);
        } catch (err) { alert("Failed to send OTP"); }
    };

    // 2. Submit with Images (Using FormData)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Create FormData object to handle files
            const data = new FormData();

            // Append Fields
            data.append('email', user.email);
            data.append('otp', otp);
            data.append('customerName', user.name);
            data.append('orderType', 'CUSTOM');
            data.append('amount', 0); // Price TBD

            // Append Custom Details
            data.append('description', formData.description);
            data.append('material', formData.material);
            data.append('address', formData.address);
            data.append('city', formData.city);
            data.append('zip', formData.zip);
            data.append('phone', formData.phone);

            // Append Images (Loop through FileList)
            for (let i = 0; i < selectedFiles.length; i++) {
                data.append('customImages', selectedFiles[i]);
            }

            // Send Multipart Request
            const res = await axios.post('http://localhost:5000/api/buy', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data.success) {
                alert("Custom Request Sent Successfully!");
                navigate('/my-orders');
            }
        } catch (err) {
            alert(err.response?.data?.message || "Submission Failed");
        }
    };

    // --- STYLES OBJECT ---
    const styles = {
        page: {
            padding: '40px 20px',
            minHeight: '100vh',
            background: `linear-gradient(180deg, ${palette.lightSand}, rgba(237,216,180,0.2))`,
            fontFamily: 'Arial, sans-serif',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        container: {
            width: '100%',
            maxWidth: '600px',
            padding: '30px',
            border: `1px solid ${palette.copper}30`,
            borderRadius: '14px',
            background: palette.white,
            boxShadow: '0 14px 30px rgba(68,45,28,0.08)'
        },
        header: {
            textAlign: 'center',
            color: palette.deep,
            marginTop: 0,
            marginBottom: '25px',
            fontSize: '1.8rem'
        },
        label: {
            display: 'block',
            marginBottom: '8px',
            color: palette.ember,
            fontWeight: 'bold',
            fontSize: '0.95rem'
        },
        input: {
            width: '100%',
            padding: '12px',
            borderRadius: '10px',
            border: `1px solid ${palette.copper}40`,
            backgroundColor: 'rgba(237,216,180,0.15)',
            boxSizing: 'border-box',
            fontSize: '1rem',
            color: '#333'
        },
        button: {
            width: '100%',
            padding: '14px',
            background: otpSent ? palette.flame : palette.ember,
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '12px',
            fontWeight: '600',
            fontSize: '1.1rem',
            marginTop: '10px',
            transition: 'background 0.3s'
        }
    };

    return (
        <div style={styles.page}>
            {/* RESPONSIVE CSS */}
            <style>{`
                .form-group { margin-bottom: 15px; }
                .row-group { display: flex; gap: 15px; }
                
                input:focus, textarea:focus {
                    outline: none;
                    border-color: ${palette.flame} !important;
                    background-color: #fff !important;
                    box-shadow: 0 0 0 3px rgba(200,84,40,0.1);
                }

                @media (max-width: 600px) {
                    .row-group { flex-direction: column; gap: 15px; }
                    .custom-form-box { padding: 20px !important; }
                }
            `}</style>

            <div style={styles.container} className="custom-form-box">
                <h2 style={styles.header}>Request Custom Item</h2>

                <form onSubmit={otpSent ? handleSubmit : handleRequestOtp}>

                    {/* DETAILS SECTION */}
                    <div className="form-group">
                        <label style={styles.label}>1. Item Details</label>
                        <textarea
                            name="description"
                            placeholder="Describe what you want to build..."
                            value={formData.description}
                            onChange={handleChange}
                            required
                            disabled={otpSent}
                            style={{ ...styles.input, height: '100px', resize: 'vertical', marginBottom: '10px' }}
                        />
                        <input
                            name="material"
                            placeholder="Preferred Material (e.g., Clay, Ceramic)"
                            value={formData.material}
                            onChange={handleChange}
                            required
                            disabled={otpSent}
                            style={styles.input}
                        />
                    </div>

                    {/* IMAGE UPLOAD SECTION */}
                    <div className="form-group" style={{ background: palette.lightSand, padding: '15px', borderRadius: '10px', border: `1px dashed ${palette.copper}` }}>
                        <label style={{ ...styles.label, marginBottom: '5px' }}>Reference Images (Max 5):</label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={otpSent}
                            style={{ width: '100%', fontSize: '0.9rem' }}
                        />
                    </div>

                    {/* ADDRESS SECTION */}
                    <div className="form-group">
                        <label style={styles.label}>2. Shipping Info</label>
                        <input
                            name="address"
                            placeholder="Street Address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            disabled={otpSent}
                            style={{ ...styles.input, marginBottom: '15px' }}
                        />
                        <div className="row-group">
                            <input
                                name="city"
                                placeholder="City"
                                value={formData.city}
                                onChange={handleChange}
                                required
                                disabled={otpSent}
                                style={styles.input}
                            />
                            <input
                                name="zip"
                                placeholder="Zip Code"
                                value={formData.zip}
                                onChange={handleChange}
                                required
                                disabled={otpSent}
                                style={styles.input}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <input
                            name="phone"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            disabled={otpSent}
                            style={styles.input}
                        />
                    </div>

                    {/* OTP SECTION */}
                    {otpSent && (
                        <div style={{ background: '#FFF5F0', padding: '15px', border: `1px solid ${palette.flame}`, borderRadius: '10px', marginBottom: '15px' }}>
                            <p style={{ margin: '0 0 10px 0', color: palette.ember, fontSize: '0.9rem' }}>
                                Enter OTP sent to <strong>{user.email}</strong>
                            </p>
                            <input
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={e => setOtp(e.target.value)}
                                required
                                style={{ ...styles.input, textAlign: 'center', letterSpacing: '2px', fontWeight: 'bold' }}
                            />
                        </div>
                    )}

                    <button type="submit" style={styles.button}>
                        {otpSent ? "Confirm Custom Order" : "Verify & Next"}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default CustomOrders;
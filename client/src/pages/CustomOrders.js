import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const palette = {
    deep: '#442D1C',
    ember: '#652810',
    copper: '#8E5022',
    flame: '#C85428',
    sand: '#EDD8B4',
    lightSand: '#F9F3E9',
    white: '#FFFFFF',
    overlay: 'rgba(255, 255, 255, 0.9)',
    shadow: 'rgba(68, 45, 28, 0.15)'
};

const CustomOrders = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const [formData, setFormData] = useState({
        description: '', 
        material: '',
        address: '', 
        city: '', 
        zip: '', 
        phone: ''
    });

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);

    // --- LOADING STATES ---
    const [isLoadingAddress, setIsLoadingAddress] = useState(true);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchUserData = async () => {
            setIsLoadingAddress(true); 
            if (user && (user.id || user._id)) {
                try {
                    const userId = user.id || user._id;
                    const res = await axios.get(`https://gwoc-basho-1.onrender.com/api/auth/profile/${userId}`);
                    
                    setFormData(prev => ({
                        ...prev,
                        address: res.data.address || '',
                        city: res.data.city || '',
                        zip: res.data.zip || '',
                        phone: res.data.phone || ''
                    }));
                } catch (err) {
                    console.error("Could not auto-fill address", err);
                } finally {
                    setIsLoadingAddress(false); 
                }
            } else {
                setIsLoadingAddress(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Fix: Convert FileList to Array for easier handling
    const handleFileChange = (e) => {
        setSelectedFiles(Array.from(e.target.files));
    };

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        
        // Basic Validation
        if(!formData.description || !formData.material) {
            alert("Please fill in the Design Description and Material.");
            return;
        }

        setIsSendingOtp(true); 
        try {
            await axios.post('https://gwoc-basho-1.onrender.com/api/auth/req-otp', { email: user.email });
            setOtpSent(true);
            alert(`OTP sent to ${user.email}`);
        } catch (err) { 
            alert("Failed to send OTP. Check console."); 
            console.error(err);
        } finally {
            setIsSendingOtp(false); 
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true); 
        
        try {
            const data = new FormData();
            
            // 1. User & Order Info
            data.append('userId', user.id || user._id); // Ensure ID is sent
            data.append('email', user.email);
            data.append('otp', otp);
            data.append('customerName', user.name);
            data.append('orderType', 'CUSTOM');
            data.append('amount', 0); 
            
            // 2. Custom Specifics (Crucial Fix)
            // We pass these as a JSON string or individual fields depending on backend
            // For now, let's append them individually so Multer/BodyParser picks them up
            data.append('description', formData.description); 
            data.append('material', formData.material);
            
            // 3. Shipping Info
            data.append('address', formData.address);
            data.append('city', formData.city);
            data.append('zip', formData.zip);
            data.append('phone', formData.phone);

            // 4. Images (Crucial Fix: Use 'customImages' key)
            selectedFiles.forEach((file) => {
                data.append('customImages', file); 
            });

            // Debug: Log what we are sending
            for (let [key, value] of data.entries()) {
                console.log(`${key}:`, value);
            }

            const res = await axios.post('https://gwoc-basho-1.onrender.com/api/buy', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data.success) {
                alert("Custom Request Sent Successfully!");
                navigate('/orders');
            }
        } catch (err) {
            console.error("Submit Error:", err.response?.data || err);
            alert(err.response?.data?.message || "Submission Failed");
        } finally {
            setIsSubmitting(false); 
        }
    };

    return (
        <div className="page-wrapper">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

                .page-wrapper {
                    min-height: 100vh;
                    background: radial-gradient(circle at top left, ${palette.lightSand}, #F2E6D8);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 40px 20px;
                    font-family: 'Poppins', sans-serif;
                }

                /* --- CARD & LAYOUT --- */
                .custom-card {
                    width: 100%;
                    max-width: 650px;
                    background: ${palette.white};
                    border-radius: 20px;
                    padding: 40px;
                    box-shadow: 0 20px 60px ${palette.shadow}, 0 0 0 1px rgba(142, 80, 34, 0.05);
                    position: relative;
                    overflow: hidden;
                    animation: slideUp 0.6s ease-out;
                }

                .custom-card::top-border {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0; height: 5px;
                    background: linear-gradient(90deg, ${palette.copper}, ${palette.flame});
                }

                .header-title {
                    text-align: center;
                    color: ${palette.deep};
                    font-size: 1.8rem;
                    font-weight: 600;
                    margin-bottom: 5px;
                }
                
                .header-subtitle {
                    text-align: center;
                    color: ${palette.ember};
                    font-size: 0.9rem;
                    margin-bottom: 30px;
                    opacity: 0.8;
                }

                /* --- FORMS --- */
                .section-label {
                    font-size: 0.85rem;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    color: ${palette.copper};
                    font-weight: 600;
                    margin-bottom: 15px;
                    display: block;
                    border-bottom: 1px solid ${palette.lightSand};
                    padding-bottom: 5px;
                }

                .input-group {
                    margin-bottom: 20px;
                    position: relative;
                }

                .modern-input {
                    width: 100%;
                    padding: 14px 16px;
                    border: 1px solid #E0E0E0;
                    background: #FAFAFA;
                    border-radius: 12px;
                    font-size: 0.95rem;
                    color: ${palette.deep};
                    transition: all 0.3s ease;
                    box-sizing: border-box;
                    font-family: inherit;
                }

                .modern-input:focus {
                    outline: none;
                    border-color: ${palette.copper};
                    background: #FFF;
                    box-shadow: 0 4px 12px rgba(142, 80, 34, 0.1);
                }

                .modern-textarea {
                    min-height: 100px;
                    resize: vertical;
                }

                /* --- FILE UPLOAD --- */
                .file-drop-zone {
                    border: 2px dashed ${palette.sand};
                    border-radius: 12px;
                    background: ${palette.lightSand};
                    padding: 25px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s;
                    position: relative;
                }

                .file-drop-zone:hover {
                    border-color: ${palette.flame};
                    background: #FFF8F2;
                }

                .file-input-hidden {
                    position: absolute;
                    top: 0; left: 0; width: 100%; height: 100%;
                    opacity: 0;
                    cursor: pointer;
                }

                .file-label-text {
                    color: ${palette.ember};
                    font-weight: 500;
                }

                .file-subtext {
                    font-size: 0.8rem;
                    color: #999;
                    margin-top: 5px;
                }

                /* --- BUTTONS --- */
                .action-btn {
                    width: 100%;
                    padding: 16px;
                    background: linear-gradient(135deg, ${palette.ember}, ${palette.deep});
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 10px;
                    margin-top: 10px;
                }
                
                .action-btn.verify {
                    background: linear-gradient(135deg, ${palette.flame}, ${palette.copper});
                }

                .action-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(68, 45, 28, 0.2);
                }

                .action-btn:disabled {
                    background: #CCC;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }

                .text-btn {
                    background: none;
                    border: none;
                    color: ${palette.flame};
                    font-size: 0.85rem;
                    font-weight: 600;
                    cursor: pointer;
                    text-decoration: underline;
                    float: right;
                }

                /* --- ANIMATIONS --- */
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .spinner {
                    width: 20px;
                    height: 20px;
                    border: 3px solid rgba(255,255,255,0.3);
                    border-radius: 50%;
                    border-top-color: white;
                    animation: spin 1s linear infinite;
                }

                .row-group {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                }

                /* OTP Section Animation */
                .otp-section {
                    background: #FFF5F0;
                    border: 1px solid ${palette.sand};
                    padding: 20px;
                    border-radius: 12px;
                    margin-bottom: 20px;
                    animation: slideUp 0.4s ease;
                    text-align: center;
                }

                .otp-input {
                    text-align: center;
                    letter-spacing: 5px;
                    font-weight: bold;
                    font-size: 1.2rem;
                }

                /* Skeleton Loader for inputs */
                .skeleton {
                    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                    color: transparent !important;
                }

                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }

                @media (max-width: 600px) {
                    .row-group { grid-template-columns: 1fr; }
                    .custom-card { padding: 25px; }
                }
            `}</style>

            <div className="custom-card">
                <h2 className="header-title">Create Custom Order</h2>
                <p className="header-subtitle">Bring your unique ideas to life</p>

                <form onSubmit={otpSent ? handleSubmit : handleRequestOtp}>
                    
                    {/* --- SECTION 1 --- */}
                    <div className="input-group">
                        <label className="section-label">1. Design & Details</label>
                        <textarea 
                            name="description" 
                            className="modern-input modern-textarea"
                            placeholder="Describe your vision (shape, size, function)..." 
                            value={formData.description} 
                            onChange={handleChange} 
                            required 
                            disabled={otpSent} 
                        />
                    </div>
                    
                    <div className="input-group">
                        <input 
                            name="material" 
                            className="modern-input"
                            placeholder="Preferred Material (e.g., Clay, Ceramic)" 
                            value={formData.material} 
                            onChange={handleChange} 
                            required 
                            disabled={otpSent} 
                        />
                    </div>

                    <div className="input-group">
                        <div className="file-drop-zone">
                            <input 
                                type="file" 
                                className="file-input-hidden"
                                multiple 
                                accept=".jpg,.png,.jpeg" 
                                onChange={handleFileChange} 
                                disabled={otpSent} 
                            />
                            <div className="file-label-text">
                                {selectedFiles.length > 0 
                                    ? `${selectedFiles.length} files selected` 
                                    : "Click to Upload Reference Images"
                                }
                            </div>
                            <div className="file-subtext">Max 5 images (JPG, PNG)</div>
                        </div>
                    </div>

                    {/* --- SECTION 2 --- */}
                    <div className="input-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <label className="section-label" style={{ marginBottom: 0, border: 'none' }}>2. Shipping Info</label>
                            <button type="button" onClick={() => navigate('/profile')} className="text-btn">Update Address</button>
                        </div>
                        
                        {/* Address Input with Loading State */}
                        <input 
                            name="address" 
                            className={`modern-input ${isLoadingAddress ? 'skeleton' : ''}`}
                            placeholder="Street Address" 
                            value={formData.address} 
                            onChange={handleChange} 
                            required 
                            disabled={otpSent || isLoadingAddress} 
                        />
                    </div>

                    <div className="input-group row-group">
                        <input 
                            name="city" 
                            className={`modern-input ${isLoadingAddress ? 'skeleton' : ''}`}
                            placeholder="City" 
                            value={formData.city} 
                            onChange={handleChange} 
                            required 
                            disabled={otpSent || isLoadingAddress} 
                        />
                        <input 
                            name="zip" 
                            className={`modern-input ${isLoadingAddress ? 'skeleton' : ''}`}
                            placeholder="Zip Code" 
                            value={formData.zip} 
                            onChange={handleChange} 
                            required 
                            disabled={otpSent || isLoadingAddress} 
                        />
                    </div>

                    <div className="input-group">
                        <input 
                            name="phone" 
                            className={`modern-input ${isLoadingAddress ? 'skeleton' : ''}`}
                            placeholder="Phone Number" 
                            value={formData.phone} 
                            onChange={handleChange} 
                            required 
                            disabled={otpSent || isLoadingAddress} 
                        />
                    </div>

                    {/* --- OTP SECTION --- */}
                    {otpSent && (
                        <div className="otp-section">
                            <p style={{ margin: '0 0 10px 0', color: palette.ember, fontSize: '0.9rem' }}>
                                We sent a code to <strong>{user.email}</strong>
                            </p>
                            <input 
                                className="modern-input otp-input"
                                placeholder="1 2 3 4" 
                                value={otp} 
                                onChange={e => setOtp(e.target.value)} 
                                required 
                            />
                        </div>
                    )}

                    {/* --- SUBMIT BUTTON --- */}
                    <button 
                        type="submit" 
                        className={`action-btn ${otpSent ? 'verify' : ''}`}
                        disabled={isSendingOtp || isSubmitting}
                    >
                        {isSendingOtp || isSubmitting ? (
                            <div className="spinner"></div>
                        ) : (
                            otpSent ? "Confirm Custom Order" : "Verify & Continue"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CustomOrders;
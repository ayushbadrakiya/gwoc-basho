import React, { useState } from 'react';
import axios from 'axios';
import { Gift, Users, Briefcase, CheckCircle, AlertCircle } from 'lucide-react'; 

// --- THEME ---
const palette = {
    deep: '#442D1C',
    ember: '#652810',
    copper: '#8E5022',
    flame: '#C85428',
    sand: '#EDD8B4',
    lightSand: '#F9F3E9',
    white: '#FFFFFF',
    glass: 'rgba(255, 255, 255, 0.9)', 
    error: '#D32F2F' // Red for errors
};

const Corporate = () => {
    const [formData, setFormData] = useState({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        serviceType: 'Gifting',
        message: ''
    });
    
    // State for Validation Errors
    const [errors, setErrors] = useState({});
    
    const [status, setStatus] = useState('idle'); 
    const [errorMessage, setErrorMessage] = useState(''); 

    // --- VALIDATION LOGIC ---
    const validateForm = () => {
        let tempErrors = {};
        let isValid = true;

        if (!formData.companyName.trim()) {
            tempErrors.companyName = "Company name is required";
            isValid = false;
        }

        if (!formData.contactPerson.trim()) {
            tempErrors.contactPerson = "Contact person is required";
            isValid = false;
        }

        // Email Regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            tempErrors.email = "Email is required";
            isValid = false;
        } else if (!emailRegex.test(formData.email)) {
            tempErrors.email = "Please enter a valid email address";
            isValid = false;
        }

        // Phone Regex (10 digits)
        const phoneRegex = /^\d{10}$/;
        if (!formData.phone) {
            tempErrors.phone = "Phone number is required";
            isValid = false;
        } else if (!phoneRegex.test(formData.phone)) {
            tempErrors.phone = "Please enter a valid 10-digit number";
            isValid = false;
        }

        if (!formData.message.trim()) {
            tempErrors.message = "Please provide some project details";
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        // Clear error for this specific field as user types
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }

        if (status === 'error') {
            setStatus('idle');
            setErrorMessage('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Run Validation before submitting
        if (!validateForm()) {
            return; // Stop if invalid
        }

        setStatus('submitting');
        setErrorMessage('');

        try {
            const res = await axios.post('https://gwoc-basho-1.onrender.com/api/corporate/inquiry', formData);
            
            if (res.data.success) {
                setStatus('success');
                setFormData({ companyName: '', contactPerson: '', email: '', phone: '', serviceType: 'Gifting', message: '' });
                setErrors({});
            }
        } catch (err) {
            console.error("Submission Error:", err); 
            setStatus('error');
            setErrorMessage(err.response?.data?.message || "Failed to submit. Please check your connection.");
        }
    };

    return (
        <div className="corporate-page">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=Poppins:wght@300;400;500;600&display=swap');

                .corporate-page {
                    font-family: 'Poppins', sans-serif;
                    background: radial-gradient(circle at top right, #fff 0%, ${palette.lightSand} 100%);
                    color: ${palette.deep};
                    overflow-x: hidden;
                }

                /* HERO */
                .corp-hero {
                    padding: 100px 20px 80px;
                    text-align: center;
                    background: linear-gradient(180deg, rgba(255,255,255,0) 0%, ${palette.lightSand} 100%);
                }
                .corp-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 4rem;
                    margin-bottom: 25px;
                    line-height: 1.1;
                    color: ${palette.deep};
                }
                .corp-subtitle {
                    max-width: 750px;
                    margin: 0 auto;
                    font-size: 1.2rem;
                    color: ${palette.ember};
                    line-height: 1.8;
                    opacity: 0.9;
                }

                /* SERVICES GRID */
                .services-section {
                    max-width: 1200px;
                    margin: 0 auto 100px;
                    padding: 0 20px;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                    gap: 40px;
                }

                .service-card {
                    background: ${palette.white};
                    padding: 50px 35px;
                    border-radius: 20px;
                    border: 1px solid rgba(142, 80, 34, 0.08);
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(68, 45, 28, 0.03);
                    text-align: center;
                }
                .service-card:hover {
                    transform: translateY(-12px);
                    box-shadow: 0 25px 50px rgba(68, 45, 28, 0.12);
                    border-color: ${palette.sand};
                }
                .icon-box {
                    width: 70px; height: 70px;
                    background: ${palette.lightSand};
                    border-radius: 50%;
                    display: flex; alignItems: center; justify-content: center;
                    margin: 0 auto 25px;
                    color: ${palette.flame};
                    transition: transform 0.3s;
                }
                .service-card:hover .icon-box { transform: scale(1.1); background: ${palette.sand}; color: ${palette.deep}; }

                .service-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.6rem;
                    margin-bottom: 15px;
                    color: ${palette.deep};
                }
                .service-desc { font-size: 1rem; color: #666; line-height: 1.7; }

                /* FORM SECTION */
                .form-section {
                    background: ${palette.white}; /* Changed from deep to white */
                    color: ${palette.deep}; /* Changed text color for contrast */
                    padding: 100px 20px;
                    position: relative;
                }
                .form-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 80px;
                    align-items: center;
                }
                
                .form-info h3 {
                    font-family: 'Playfair Display', serif;
                    font-size: 3rem;
                    margin-bottom: 25px;
                    color: ${palette.flame}; /* Changed to flame for contrast on white */
                    line-height: 1.2;
                }
                .form-info p { opacity: 0.85; line-height: 1.9; margin-bottom: 40px; font-size: 1.1rem; }
                .check-list { list-style: none; padding: 0; }
                .check-list li { display: flex; gap: 15px; margin-bottom: 20px; align-items: center; opacity: 0.95; font-size: 1.05rem; }

                /* INPUTS */
                .glass-form {
                    background: ${palette.lightSand}; /* Changed to lightSand for contrast */
                    /* backdrop-filter: blur(15px); Removed blur as bg is solid now */
                    padding: 50px;
                    border-radius: 24px;
                    border: 1px solid rgba(142, 80, 34, 0.1); /* Changed border color */
                    box-shadow: 0 20px 60px rgba(0,0,0,0.05); /* Softer shadow */
                    color: ${palette.deep}; 
                }
                .form-group { margin-bottom: 25px; position: relative; }
                .form-label { display: block; margin-bottom: 10px; font-size: 0.95rem; letter-spacing: 0.5px; color: ${palette.ember}; font-weight: 600; }
                
                .form-input, .form-select, .form-textarea {
                    width: 100%;
                    padding: 16px;
                    background: #fff;
                    border: 1px solid #e0e0e0;
                    border-radius: 10px;
                    color: ${palette.deep};
                    font-family: inherit;
                    transition: 0.3s;
                    box-sizing: border-box;
                    font-size: 1rem;
                }
                
                .form-input:focus, .form-textarea:focus, .form-select:focus {
                    outline: none;
                    border-color: ${palette.flame};
                    box-shadow: 0 0 0 4px rgba(200, 84, 40, 0.1);
                }

                /* Validation Error Style */
                .form-input.error, .form-textarea.error {
                    border-color: ${palette.error};
                    background-color: #fff8f8;
                }
                .error-msg {
                    color: ${palette.error};
                    font-size: 0.85rem;
                    margin-top: 5px;
                    display: block;
                    animation: fadeIn 0.3s;
                }

                .form-select option { background: #fff; color: ${palette.deep}; }

                .submit-btn {
                    width: 100%;
                    padding: 18px;
                    background: ${palette.flame};
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-weight: 600;
                    cursor: pointer;
                    letter-spacing: 1px;
                    transition: 0.3s;
                    font-size: 1.1rem;
                    box-shadow: 0 8px 20px rgba(200, 84, 40, 0.3);
                }
                .submit-btn:hover { background: ${palette.ember}; transform: translateY(-3px); box-shadow: 0 12px 25px rgba(200, 84, 40, 0.4); }
                .submit-btn:disabled { background: #ccc; cursor: not-allowed; transform: none; box-shadow: none; }

                /* ERROR BOX */
                .error-box {
                    background: #ffebee;
                    border: 1px solid #ffcdd2;
                    color: #c62828;
                    padding: 15px;
                    border-radius: 10px;
                    margin-bottom: 25px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-size: 0.95rem;
                }

                @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }

                @media (max-width: 1024px) {
                    .form-container { grid-template-columns: 1fr; gap: 40px; }
                    .corp-title { font-size: 3rem; }
                    .form-info h3 { font-size: 2.5rem; }
                }
            `}</style>

            {/* --- HERO --- */}
            <div className="corp-hero">
                <span style={{color: palette.flame, fontWeight: 'bold', letterSpacing: '3px', fontSize: '0.85rem', textTransform: 'uppercase', display:'block', marginBottom:'15px'}}>Business & Partnerships</span>
                <h1 className="corp-title">Elevate with Art</h1>
                <p className="corp-subtitle">
                    Bring the timeless beauty of handcrafted ceramics to your workspace, events, or client relationships. 
                    We tailor our artistry to your corporate identity.
                </p>
            </div>

            {/* --- SERVICES CARDS --- */}
            <div className="services-section">
                <div className="service-card">
                    <div className="icon-box"><Gift size={32} /></div>
                    <h3 className="service-title">Corporate Gifting</h3>
                    <p className="service-desc">
                        Move beyond generic gifts. Offer your clients and employees sustainable, handcrafted pottery pieces 
                        custom-branded with your ethos. Perfect for Diwali, milestones, and client appreciation.
                    </p>
                </div>

                <div className="service-card">
                    <div className="icon-box"><Users size={32} /></div>
                    <h3 className="service-title">Team Workshops</h3>
                    <p className="service-desc">
                        Unwind and bond over clay. Our hands-on pottery workshops are designed to foster creativity, 
                        patience, and collaboration within teams. Hosted at our studio or your office.
                    </p>
                </div>

                <div className="service-card">
                    <div className="icon-box"><Briefcase size={32} /></div>
                    <h3 className="service-title">Brand Collaborations</h3>
                    <p className="service-desc">
                        Let's co-create. From bespoke tableware for restaurants to exclusive merchandise lines 
                        for lifestyle brands, we bring our aesthetic to your product vision.
                    </p>
                </div>
            </div>

            {/* --- INQUIRY FORM SECTION --- */}
            <div className="form-section">
                <div className="form-container">
                    
                    {/* Left: Text Info */}
                    <div className="form-info">
                        <h3>Let's Build Something Beautiful</h3>
                        <p>
                            Whether you need 50 custom mugs or a team-building event for 20 people, 
                            we are excited to hear from you. Fill out the form, and our team will get back to you within 24 hours.
                        </p>
                        <ul className="check-list">
                            <li><CheckCircle size={22} color={palette.copper}/> <span>Bulk pricing & volume discounts</span></li>
                            <li><CheckCircle size={22} color={palette.copper}/> <span>Custom branding & logo integration</span></li>
                            <li><CheckCircle size={22} color={palette.copper}/> <span>GST Invoicing provided</span></li>
                        </ul>
                    </div>

                    {/* Right: The Form */}
                    <div className="glass-form">
                        {status === 'success' ? (
                            <div style={{textAlign: 'center', padding: '60px 0'}}>
                                <div style={{background: palette.sand, width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px', color: palette.deep, boxShadow: '0 10px 25px rgba(0,0,0,0.1)'}}>
                                    <CheckCircle size={40} />
                                </div>
                                <h3 style={{fontSize: '2rem', color: palette.deep, marginBottom: '15px', fontFamily: "'Playfair Display', serif"}}>Request Sent!</h3>
                                <p style={{color: '#666', fontSize:'1.1rem'}}>Thank you for choosing Basho. We will be in touch shortly.</p>
                                <button onClick={() => setStatus('idle')} style={{marginTop: '30px', background: 'transparent', border: `2px solid ${palette.copper}`, color: palette.copper, padding: '12px 25px', borderRadius: '30px', cursor: 'pointer', fontWeight:'bold', transition:'0.3s'}}>Send Another Request</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} noValidate>
                                
                                {/* 🔴 API ERROR MESSAGE */}
                                {status === 'error' && (
                                    <div className="error-box">
                                        <AlertCircle size={20} />
                                        <span>{errorMessage}</span>
                                    </div>
                                )}

                                <div className="form-group">
                                    <label className="form-label">Company Name *</label>
                                    <input 
                                        name="companyName" 
                                        className={`form-input ${errors.companyName ? 'error' : ''}`}
                                        value={formData.companyName} 
                                        onChange={handleChange} 
                                        placeholder="e.g. Acme Corp" 
                                    />
                                    {errors.companyName && <span className="error-msg">{errors.companyName}</span>}
                                </div>

                                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                                    <div className="form-group">
                                        <label className="form-label">Contact Person *</label>
                                        <input 
                                            name="contactPerson" 
                                            className={`form-input ${errors.contactPerson ? 'error' : ''}`}
                                            value={formData.contactPerson} 
                                            onChange={handleChange} 
                                            placeholder="Full Name" 
                                        />
                                        {errors.contactPerson && <span className="error-msg">{errors.contactPerson}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Phone *</label>
                                        <input 
                                            name="phone" 
                                            className={`form-input ${errors.phone ? 'error' : ''}`}
                                            value={formData.phone} 
                                            onChange={handleChange} 
                                            placeholder="10 digit mobile number" 
                                            maxLength={10}
                                        />
                                        {errors.phone && <span className="error-msg">{errors.phone}</span>}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Email Address *</label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        className={`form-input ${errors.email ? 'error' : ''}`}
                                        value={formData.email} 
                                        onChange={handleChange} 
                                        placeholder="work@company.com" 
                                    />
                                    {errors.email && <span className="error-msg">{errors.email}</span>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Interested In</label>
                                    <select name="serviceType" className="form-select" value={formData.serviceType} onChange={handleChange}>
                                        <option value="Gifting">Corporate Gifting</option>
                                        <option value="Workshop">Team Workshop</option>
                                        <option value="Collaboration">Brand Collaboration</option>
                                        <option value="Other">Other / General Inquiry</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Project Details *</label>
                                    <textarea 
                                        name="message" 
                                        className={`form-textarea ${errors.message ? 'error' : ''}`}
                                        rows="4" 
                                        value={formData.message} 
                                        onChange={handleChange} 
                                        placeholder="Tell us about quantity, timeline, or specific requirements..."
                                    ></textarea>
                                    {errors.message && <span className="error-msg">{errors.message}</span>}
                                </div>

                                <button type="submit" className="submit-btn" disabled={status === 'submitting'}>
                                    {status === 'submitting' ? 'Sending Request...' : 'Submit Inquiry'}
                                </button>
                            </form>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Corporate;
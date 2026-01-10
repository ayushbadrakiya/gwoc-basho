import React, { useState, useEffect } from 'react';
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
    white: '#FFFFFF',
    shadow: 'rgba(68, 45, 28, 0.1)',
    error: '#D32F2F'
};

const Workshops = () => {
    const [workshops, setWorkshops] = useState([]);
    const [myBookings, setMyBookings] = useState([]); 
    const [selectedWorkshop, setSelectedWorkshop] = useState(null); 
    const [formDetails, setFormDetails] = useState({ phone: '', experience: 'Beginner' });
    const [phoneError, setPhoneError] = useState('');
    
    // Loading State for Booking Process
    const [isProcessing, setIsProcessing] = useState(false);
    
    // State for Image Preview
    const [previewImage, setPreviewImage] = useState(null);

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchWorkshops();
        if (user) fetchMyRegistrations();
    }, []);

    const fetchWorkshops = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/workshops');
            setWorkshops(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchMyRegistrations = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/workshops/my-registrations/${user.id}`);
            const bookedIds = res.data.map(r => r.workshopId);
            setMyBookings(bookedIds);
        } catch (err) { console.error("Error fetching bookings", err); }
    };

    // --- HELPER: LOAD RAZORPAY SCRIPT ---
    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    // --- ACTIONS ---
    const initiateBooking = (ws) => {
        if (!user) return navigate('/login');
        setSelectedWorkshop(ws); 
        setFormDetails({ phone: '', experience: 'Beginner' });
        setPhoneError('');
    };

    const handlePhoneChange = (e) => {
        const val = e.target.value;
        if (!/^\d*$/.test(val)) return;
        setFormDetails({ ...formDetails, phone: val });
        if (phoneError && val.length === 10) setPhoneError('');
    };

    // --- CORE BOOKING LOGIC ---
    const handleConfirmBooking = async (e) => {
        e.preventDefault();
        
        // 1. Validate Phone
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(formDetails.phone)) {
            setPhoneError('Please enter a valid 10-digit mobile number.');
            return;
        }
        setPhoneError('');
        setIsProcessing(true);

        try {
            // CHECK IF PAID OR FREE
            const isPaid = selectedWorkshop.price && selectedWorkshop.price > 0;

            if (isPaid) {
                // === PAID FLOW (RAZORPAY) ===
                
                // 1. Load Script
                const res = await loadRazorpay();
                if (!res) {
                    alert('Razorpay SDK failed to load. Are you online?');
                    setIsProcessing(false);
                    return;
                }

                // 2. Create Order on Backend
                const orderData = await axios.post('http://localhost:5000/api/payment/create-workshop-order', {
                    amount: selectedWorkshop.price,
                    workshopId: selectedWorkshop._id
                });

                if (!orderData.data.success) {
                    alert("Server error creating payment order");
                    setIsProcessing(false);
                    return;
                }

                const { order } = orderData.data;

                // 3. Open Razorpay Options
                const options = {
                    key: "rzp_test_RxSehrjb5BD4XK", // Use your actual Key
                    amount: order.amount,
                    currency: order.currency,
                    name: "Basho Pottery",
                    description: `Booking: ${selectedWorkshop.title}`,
                    order_id: order.id,
                    
                    // 4. Handler on Success
                    handler: async function (response) {
                        try {
                            await registerUser({
                                ...response, // Passes razorpay_payment_id, etc.
                                paymentStatus: 'PAID'
                            });
                        } catch (err) {
                            alert("Payment successful but registration failed. Contact support.");
                        }
                    },
                    prefill: {
                        name: user.name,
                        email: user.email,
                        contact: formDetails.phone
                    },
                    theme: {
                        color: palette.flame
                    }
                };

                const paymentObject = new window.Razorpay(options);
                paymentObject.open();
                paymentObject.on('payment.failed', function (response){
                    alert("Payment Failed: " + response.error.description);
                    setIsProcessing(false);
                });

            } else {
                // === FREE FLOW ===
                await registerUser({ paymentStatus: 'FREE' });
            }

        } catch (err) {
            console.error(err);
            alert(err.response?.data?.msg || "Error processing request");
            setIsProcessing(false);
        }
    };

    // Shared function to save to DB (called by Free flow OR Razorpay Success)
    const registerUser = async (paymentData) => {
        try {
            const res = await axios.post('http://localhost:5000/api/workshops/register', {
                userId: user.id,
                userName: user.name,
                userEmail: user.email,
                workshopId: selectedWorkshop._id,
                seatsBooked: 1,
                ...formDetails,
                ...paymentData // Contains Razorpay IDs if paid
            });

            if (res.data.success) {
                alert(`Success! Confirmed for ${selectedWorkshop.title}`);
                setSelectedWorkshop(null);
                fetchWorkshops(); 
                fetchMyRegistrations(); 
            }
        } catch (err) {
            alert(err.response?.data?.msg || "Error completing registration");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCancel = async (ws) => {
        if (!window.confirm(`Are you sure you want to cancel your spot for ${ws.title}? Refund policies may apply.`)) return;

        try {
            const res = await axios.post('http://localhost:5000/api/workshops/cancel', {
                userId: user.id,
                workshopId: ws._id
            });

            if (res.data.success) {
                alert("Registration Cancelled.");
                fetchWorkshops();
                fetchMyRegistrations();
            }
        } catch (err) {
            alert(err.response?.data?.msg || "Error cancelling");
        }
    };

    return (
        <div className="workshops-page">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&family=Playfair+Display:wght@600&display=swap');

                .workshops-page {
                    padding: 60px 20px;
                    min-height: 100vh;
                    background: radial-gradient(circle at top, ${palette.lightSand}, #F2E6D8);
                    font-family: 'Poppins', sans-serif;
                }

                .header-container { text-align: center; margin-bottom: 50px; animation: fadeIn 0.8s ease; }
                .main-title { font-family: 'Playfair Display', serif; font-size: 3rem; color: ${palette.deep}; margin: 0; }
                .subtitle { color: ${palette.ember}; font-size: 1.1rem; margin-top: 10px; opacity: 0.8; }

                /* --- LEGEND --- */
                .legend { display: flex; justify-content: center; gap: 15px; margin-top: 20px; flex-wrap: wrap; }
                .legend-item { font-size: 0.9rem; padding: 5px 15px; border-radius: 20px; background: rgba(255,255,255,0.6); border: 1px solid rgba(142, 80, 34, 0.2); display: flex; align-items: center; gap: 8px; }
                .dot { width: 10px; height: 10px; border-radius: 50%; }

                /* --- GRID --- */
                .workshop-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 30px; max-width: 1200px; margin: 0 auto; }

                /* --- CARD --- */
                .ws-card { background: ${palette.white}; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px ${palette.shadow}; transition: all 0.4s ease; border: 1px solid rgba(142, 80, 34, 0.1); display: flex; flex-direction: column; position: relative; animation: slideUp 0.6s ease-out; }
                .ws-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(68, 45, 28, 0.15); }
                .ws-card.one-on-one { border: 2px solid ${palette.copper}; }

                .image-container { 
                    height: 250px; 
                    position: relative; 
                    overflow: hidden; 
                    background-color: #f8f5f2; 
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                }
                .ws-image { 
                    width: 100%; 
                    height: 100%; 
                    object-fit: contain; 
                    transition: transform 0.6s ease; 
                    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.05));
                }
                .ws-card:hover .ws-image { transform: scale(1.05); }

                /* --- BADGES --- */
                .badge { position: absolute; top: 15px; padding: 6px 14px; border-radius: 30px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 10px rgba(0,0,0,0.2); backdrop-filter: blur(4px); z-index: 2; pointer-events: none; }
                .badge-type { left: 15px; background: rgba(255,255,255,0.9); color: ${palette.deep}; }
                .badge-registered { right: 15px; background: ${palette.success || '#2E7D32'}; color: #FFF; } /* Fixed Color Reference */
                
                /* PRICE BADGE */
                .badge-price {
                    position: absolute;
                    bottom: 15px;
                    right: 15px;
                    background: ${palette.white};
                    color: ${palette.deep};
                    padding: 5px 12px;
                    border-radius: 15px;
                    font-weight: bold;
                    font-size: 0.9rem;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                    pointer-events: none;
                }

                .card-content { padding: 25px; flex: 1; display: flex; flex-direction: column; }
                .date-tag { font-size: 0.85rem; color: ${palette.flame}; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
                .ws-title { font-family: 'Playfair Display', serif; font-size: 1.6rem; color: ${palette.deep}; margin: 0 0 10px 0; line-height: 1.2; }
                .ws-desc { font-size: 0.95rem; color: #666; line-height: 1.6; flex: 1; margin-bottom: 20px; }
                
                .seats-info { display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; font-weight: 600; margin-bottom: 20px; padding-top: 15px; border-top: 1px dashed rgba(142, 80, 34, 0.2); }

                /* --- BUTTONS --- */
                .action-btn { width: 100%; padding: 14px; border: none; border-radius: 12px; cursor: pointer; font-weight: 600; font-size: 1rem; transition: all 0.3s; }
                .btn-book { background: ${palette.deep}; color: #FFF; }
                .btn-book:hover:not(:disabled) { background: ${palette.ember}; transform: translateY(-2px); }
                .btn-book:disabled { background: #CCC; cursor: not-allowed; }
                .btn-cancel { background: transparent; border: 2px solid ${palette.flame}; color: ${palette.flame}; }
                .btn-cancel:hover { background: ${palette.flame}; color: #FFF; }

                /* --- MODAL --- */
                .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(68, 45, 28, 0.6); backdrop-filter: blur(5px); display: flex; justify-content: center; align-items: center; z-index: 1000; animation: fadeIn 0.3s; }
                .modal-content { background: ${palette.white}; padding: 40px; border-radius: 20px; width: 90%; max-width: 450px; box-shadow: 0 25px 50px rgba(0,0,0,0.25); animation: scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                
                .modal-input { width: 100%; padding: 12px; margin: 8px 0 20px 0; border: 1px solid #E0E0E0; border-radius: 8px; background: #FAFAFA; font-size: 1rem; box-sizing: border-box; }
                .modal-input:focus { outline: none; border-color: ${palette.copper}; background: #FFF; }
                .input-error { border-color: ${palette.error} !important; background-color: #fff8f8; }
                .error-msg { color: ${palette.error}; font-size: 0.85rem; margin-top: -15px; margin-bottom: 15px; display: block; }

                /* --- PREVIEW MODAL STYLES (Added) --- */
                .preview-overlay {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0, 0, 0, 0.9);
                    display: flex; justify-content: center; align-items: center;
                    z-index: 2000;
                    animation: fadeIn 0.3s;
                    cursor: zoom-out;
                }
                .preview-image-full {
                    max-width: 90%;
                    max-height: 90vh;
                    object-fit: contain;
                    border-radius: 8px;
                    box-shadow: 0 0 50px rgba(255,255,255,0.1);
                    animation: scaleIn 0.3s;
                    cursor: default;
                }
                .close-preview-hint {
                    position: absolute; bottom: 20px; color: white; font-size: 0.9rem; opacity: 0.7;
                }

                /* Processing Spinner */
                .spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #FFF; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto; }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

                /* --- ANIMATIONS --- */
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }

                @media (max-width: 600px) { .workshops-page { padding: 40px 15px; } .workshop-grid { grid-template-columns: 1fr; } .main-title { font-size: 2.2rem; } }
            `}</style>

            <div className="header-container">
                <h1 className="main-title">Artisan Workshops</h1>
                <p className="subtitle">Join us to craft, mold, and create.</p>
                
                <div className="legend">
                    <div className="legend-item"><div className="dot" style={{background: palette.deep}}></div>Group Session</div>
                    <div className="legend-item"><div className="dot" style={{background: palette.copper}}></div>1-on-1 Masterclass</div>
                </div>
            </div>

            <div className="workshop-grid">
                {workshops.map(ws => {
                    const isBooked = myBookings.includes(ws._id);
                    const isFull = ws.seats <= 0;
                    const isOneOnOne = ws.category === 'ONE-ON-ONE';
                    const displayPrice = ws.price && ws.price > 0 ? `₹${ws.price}` : 'Free';

                    return (
                        <div key={ws._id} className={`ws-card ${isOneOnOne ? 'one-on-one' : ''}`}>
                            
                            <div className="image-container" onClick={() => setPreviewImage(ws.image ? `http://localhost:5000/uploads/${ws.image}` : null)}>
                                <span className="badge badge-type">
                                    {isOneOnOne ? '✦ Masterclass' : 'Group Session'}
                                </span>
                                {isBooked && (
                                    <span className="badge badge-registered">Registered ✓</span>
                                )}
                                {/* PRICE BADGE */}
                                <span className="badge-price">{displayPrice}</span>

                                {ws.image ? (
                                    <img 
                                        src={`http://localhost:5000/uploads/${ws.image}`} 
                                        alt={ws.title} 
                                        className="ws-image" 
                                        title="Click to view full screen"
                                    />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', background: '#EEE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                                        No Image
                                    </div>
                                )}
                            </div>

                            <div className="card-content">
                                <div className="date-tag">
                                    {new Date(ws.date).toLocaleString('en-IN', { month: 'short', day: 'numeric' })} • {new Date(ws.date).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                
                                <h3 className="ws-title">{ws.title}</h3>
                                <p className="ws-desc">
                                    {ws.description.length > 100 ? ws.description.substring(0, 100) + '...' : ws.description}
                                </p>
                                
                                <div className="seats-info">
                                    <span style={{color: '#666'}}>Availability</span>
                                    <span style={{ color: isFull ? palette.flame : 'green' }}>
                                        {isFull ? 'Sold Out' : `${ws.seats} Spots Left`}
                                    </span>
                                </div>

                                {isBooked ? (
                                    <button onClick={() => handleCancel(ws)} className="action-btn btn-cancel">
                                        Cancel Registration
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => initiateBooking(ws)}
                                        disabled={isFull}
                                        className="action-btn btn-book"
                                    >
                                        {isFull ? 'Join Waitlist' : 'Book Now'}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* === IMAGE PREVIEW MODAL (Added) === */}
            {previewImage && (
                <div className="preview-overlay" onClick={() => setPreviewImage(null)}>
                    <img src={previewImage} alt="Full Preview" className="preview-image-full" onClick={(e) => e.stopPropagation()} />
                    <span className="close-preview-hint">Click anywhere to close</span>
                </div>
            )}

            {/* === CONFIRMATION MODAL === */}
            {selectedWorkshop && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 style={{ color: palette.deep, marginTop: 0, fontFamily: 'Playfair Display, serif' }}>Confirm Booking</h2>
                        <p style={{color: '#666', marginBottom: '10px'}}>
                            You are registering for <strong>{selectedWorkshop.title}</strong>
                        </p>
                        
                        {/* Show Total Amount in Modal */}
                        <div style={{ background: '#f9f9f9', padding: '10px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', border: '1px dashed #ccc' }}>
                            <span style={{ color: '#555', fontSize: '0.9rem' }}>Total Amount</span><br/>
                            <strong style={{ fontSize: '1.2rem', color: palette.flame }}>
                                {selectedWorkshop.price > 0 ? `₹${selectedWorkshop.price}` : 'Free'}
                            </strong>
                        </div>

                        <form onSubmit={handleConfirmBooking} noValidate>
                            
                            <label style={{ fontSize: '0.9rem', fontWeight: '600', color: palette.deep }}>Phone Number</label>
                            <input 
                                className={`modal-input ${phoneError ? 'input-error' : ''}`}
                                required 
                                type="tel"
                                placeholder="+91 98765 43210"
                                maxLength={10}
                                value={formDetails.phone} 
                                onChange={handlePhoneChange}
                                disabled={isProcessing}
                            />
                            {phoneError && <span className="error-msg">{phoneError}</span>}

                            <label style={{ fontSize: '0.9rem', fontWeight: '600', color: palette.deep }}>Experience Level</label>
                            <select 
                                className="modal-input"
                                value={formDetails.experience} 
                                onChange={e => setFormDetails({...formDetails, experience: e.target.value})}
                                disabled={isProcessing}
                            >
                                <option value="Beginner">🌱 Beginner (First time)</option>
                                <option value="Intermediate">🌿 Intermediate (Some experience)</option>
                                <option value="Advanced">🌳 Advanced (Skilled)</option>
                            </select>

                            <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
                                <button type="button" onClick={() => setSelectedWorkshop(null)} disabled={isProcessing} style={{ flex: 1, padding: '12px', background: 'transparent', border: `1px solid ${palette.deep}`, borderRadius: '10px', cursor: 'pointer' }}>
                                    Cancel
                                </button>
                                <button type="submit" disabled={isProcessing} style={{ flex: 1, padding: '12px', background: palette.flame, color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
                                    {isProcessing ? <div className="spinner"></div> : (selectedWorkshop.price > 0 ? "Pay & Confirm" : "Confirm")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Workshops;
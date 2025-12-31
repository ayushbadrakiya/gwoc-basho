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
    shadow: 'rgba(68, 45, 28, 0.1)'
};

const Workshops = () => {
    const [workshops, setWorkshops] = useState([]);
    const [myBookings, setMyBookings] = useState([]); 
    const [selectedWorkshop, setSelectedWorkshop] = useState(null); 
    const [formDetails, setFormDetails] = useState({ phone: '', experience: 'Beginner' });
    
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

    // --- ACTIONS ---
    const initiateBooking = (ws) => {
        if (!user) return navigate('/login');
        setSelectedWorkshop(ws); 
    };

    const handleConfirmBooking = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/workshops/register', {
                userId: user.id,
                userName: user.name,
                userEmail: user.email,
                workshopId: selectedWorkshop._id,
                seatsBooked: 1,
                ...formDetails 
            });

            if (res.data.success) {
                alert(`Success! Confirmed for ${selectedWorkshop.title}`);
                setSelectedWorkshop(null);
                fetchWorkshops(); 
                fetchMyRegistrations(); 
            }
        } catch (err) {
            alert(err.response?.data?.msg || "Error registering");
        }
    };

    const handleCancel = async (ws) => {
        if (!window.confirm(`Are you sure you want to cancel your spot for ${ws.title}?`)) return;

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

                .header-container {
                    text-align: center;
                    margin-bottom: 50px;
                    animation: fadeIn 0.8s ease;
                }

                .main-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 3rem;
                    color: ${palette.deep};
                    margin: 0;
                }

                .subtitle {
                    color: ${palette.ember};
                    font-size: 1.1rem;
                    margin-top: 10px;
                    opacity: 0.8;
                }

                /* --- LEGEND --- */
                .legend {
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                    margin-top: 20px;
                    flex-wrap: wrap;
                }
                .legend-item {
                    font-size: 0.9rem;
                    padding: 5px 15px;
                    border-radius: 20px;
                    background: rgba(255,255,255,0.6);
                    border: 1px solid rgba(142, 80, 34, 0.2);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .dot { width: 10px; height: 10px; border-radius: 50%; }

                /* --- GRID --- */
                .workshop-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
                    gap: 30px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                /* --- CARD --- */
                .ws-card {
                    background: ${palette.white};
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 10px 30px ${palette.shadow};
                    transition: all 0.4s ease;
                    border: 1px solid rgba(142, 80, 34, 0.1);
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    animation: slideUp 0.6s ease-out;
                }

                .ws-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 20px 40px rgba(68, 45, 28, 0.15);
                }

                .ws-card.one-on-one {
                    border: 2px solid ${palette.copper};
                }

                .image-container {
                    height: 220px;
                    position: relative;
                    overflow: hidden;
                }

                .ws-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.6s ease;
                }
                .ws-card:hover .ws-image { transform: scale(1.05); }

                /* --- BADGES --- */
                .badge {
                    position: absolute;
                    top: 15px;
                    padding: 6px 14px;
                    border-radius: 30px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                    backdrop-filter: blur(4px);
                    z-index: 2;
                }
                .badge-type { left: 15px; background: rgba(255,255,255,0.9); color: ${palette.deep}; }
                .badge-registered { right: 15px; background: ${palette.flame}; color: #FFF; }

                /* --- CARD CONTENT --- */
                .card-content {
                    padding: 25px;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                .date-tag {
                    font-size: 0.85rem;
                    color: ${palette.flame};
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 8px;
                }

                .ws-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.6rem;
                    color: ${palette.deep};
                    margin: 0 0 10px 0;
                    line-height: 1.2;
                }

                .ws-desc {
                    font-size: 0.95rem;
                    color: #666;
                    line-height: 1.6;
                    flex: 1;
                    margin-bottom: 20px;
                }

                .seats-info {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 0.9rem;
                    font-weight: 600;
                    margin-bottom: 20px;
                    padding-top: 15px;
                    border-top: 1px dashed rgba(142, 80, 34, 0.2);
                }

                /* --- BUTTONS --- */
                .action-btn {
                    width: 100%;
                    padding: 14px;
                    border: none;
                    border-radius: 12px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 1rem;
                    transition: all 0.3s;
                }

                .btn-book {
                    background: ${palette.deep};
                    color: #FFF;
                }
                .btn-book:hover:not(:disabled) { background: ${palette.ember}; transform: translateY(-2px); }
                .btn-book:disabled { background: #CCC; cursor: not-allowed; }

                .btn-cancel {
                    background: transparent;
                    border: 2px solid ${palette.flame};
                    color: ${palette.flame};
                }
                .btn-cancel:hover { background: ${palette.flame}; color: #FFF; }

                /* --- MODAL --- */
                .modal-overlay {
                    position: fixed;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(68, 45, 28, 0.6);
                    backdrop-filter: blur(5px);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    animation: fadeIn 0.3s;
                }

                .modal-content {
                    background: ${palette.white};
                    padding: 40px;
                    border-radius: 20px;
                    width: 90%;
                    max-width: 450px;
                    box-shadow: 0 25px 50px rgba(0,0,0,0.25);
                    animation: scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }

                .modal-input {
                    width: 100%;
                    padding: 12px;
                    margin: 8px 0 20px 0;
                    border: 1px solid #E0E0E0;
                    border-radius: 8px;
                    background: #FAFAFA;
                    font-size: 1rem;
                }

                /* --- ANIMATIONS --- */
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }

                /* --- MOBILE RESPONSIVE --- */
                @media (max-width: 600px) {
                    .workshops-page { padding: 40px 15px; }
                    .workshop-grid { grid-template-columns: 1fr; }
                    .main-title { font-size: 2.2rem; }
                }
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

                    return (
                        <div key={ws._id} className={`ws-card ${isOneOnOne ? 'one-on-one' : ''}`}>
                            
                            <div className="image-container">
                                {/* Badges */}
                                <span className="badge badge-type">
                                    {isOneOnOne ? '✦ Masterclass' : 'Group Session'}
                                </span>
                                {isBooked && (
                                    <span className="badge badge-registered">Registered ✓</span>
                                )}

                                {ws.image ? (
                                    <img src={`http://localhost:5000/uploads/${ws.image}`} alt={ws.title} className="ws-image" />
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

            {/* === CONFIRMATION MODAL === */}
            {selectedWorkshop && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 style={{ color: palette.deep, marginTop: 0, fontFamily: 'Playfair Display, serif' }}>Confirm Booking</h2>
                        <p style={{color: '#666', marginBottom: '25px'}}>
                            You are registering for <strong>{selectedWorkshop.title}</strong>
                        </p>
                        
                        <form onSubmit={handleConfirmBooking}>
                            <label style={{ fontSize: '0.9rem', fontWeight: '600', color: palette.deep }}>Phone Number</label>
                            <input 
                                className="modal-input"
                                required 
                                type="tel"
                                placeholder="+91 98765 43210"
                                value={formDetails.phone} 
                                onChange={e => setFormDetails({...formDetails, phone: e.target.value})}
                            />

                            <label style={{ fontSize: '0.9rem', fontWeight: '600', color: palette.deep }}>Experience Level</label>
                            <select 
                                className="modal-input"
                                value={formDetails.experience} 
                                onChange={e => setFormDetails({...formDetails, experience: e.target.value})}
                            >
                                <option value="Beginner">🌱 Beginner (First time)</option>
                                <option value="Intermediate">🌿 Intermediate (Some experience)</option>
                                <option value="Advanced">🌳 Advanced (Skilled)</option>
                            </select>

                            <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
                                <button type="button" onClick={() => setSelectedWorkshop(null)} style={{ flex: 1, padding: '12px', background: 'transparent', border: `1px solid ${palette.deep}`, borderRadius: '10px', cursor: 'pointer' }}>
                                    Cancel
                                </button>
                                <button type="submit" style={{ flex: 1, padding: '12px', background: palette.flame, color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
                                    Confirm
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
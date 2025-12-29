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
    white: '#FFFFFF'
};

const Workshops = () => {
    const [workshops, setWorkshops] = useState([]);
    const [myBookings, setMyBookings] = useState([]); // List of IDs user has booked
    const [selectedWorkshop, setSelectedWorkshop] = useState(null); // For Modal
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
            // Extract just the workshop IDs into a simple array
            const bookedIds = res.data.map(r => r.workshopId);
            setMyBookings(bookedIds);
        } catch (err) { console.error("Error fetching bookings", err); }
    };

    // --- ACTIONS ---

    const initiateBooking = (ws) => {
        if (!user) return navigate('/login');
        setSelectedWorkshop(ws); // Opens Modal
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
                fetchWorkshops(); // Refresh seats
                fetchMyRegistrations(); // Refresh user status
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

    // --- STYLES OBJECT ---
    const styles = {
        page: {
            padding: '60px 20px',
            maxWidth: '1200px',
            margin: '0 auto',
            fontFamily: 'Arial, sans-serif',
            minHeight: '100vh'
        },
        header: {
            textAlign: 'center',
            color: palette.deep,
            fontSize: '2.5rem',
            marginBottom: '40px'
        },
        card: {
            background: palette.white,
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 15px rgba(68,45,28,0.08)',
            border: `1px solid ${palette.sand}`,
            transition: 'transform 0.2s',
            display: 'flex',
            flexDirection: 'column'
        },
        btn: {
            width: '100%',
            padding: '12px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            marginTop: '15px',
            fontSize: '1rem'
        },
        badge: {
            position: 'absolute',
            top: '10px',
            left: '10px',
            padding: '4px 10px',
            borderRadius: '4px',
            color: 'white',
            fontSize: '0.8rem',
            fontWeight: 'bold'
        },
        input: {
            width: '100%',
            padding: '10px',
            margin: '5px 0 15px 0',
            borderRadius: '6px',
            border: `1px solid ${palette.copper}40`,
            boxSizing: 'border-box'
        }
    };

    return (
        <div style={styles.page}>
            {/* CSS FOR RESPONSIVE GRID */}
            <style>{`
                .workshop-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 30px;
                }
                @media (min-width: 600px) {
                    .workshop-grid { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
                }
                .ws-card:hover { transform: translateY(-5px); }
            `}</style>

            <h1 style={styles.header}>Pottery Workshops</h1>

            {/* Legend / Filter Info */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <span style={{ marginRight: '15px', fontWeight: 'bold', color: palette.ember }}>Types:</span>
                <span style={{ padding: '5px 10px', background: '#eee', borderRadius: '4px', margin: '0 5px' }}>Group</span>
                <span style={{ padding: '5px 10px', background: '#d4edda', borderRadius: '4px', margin: '0 5px', border: '1px solid green' }}>One-on-One</span>
            </div>

            <div className="workshop-grid">
                {workshops.map(ws => {
                    const isBooked = myBookings.includes(ws._id);
                    const isFull = ws.seats <= 0;

                    return (
                        <div key={ws._id} className="ws-card" style={{ 
                            ...styles.card,
                            border: ws.category === 'ONE-ON-ONE' ? '2px solid green' : styles.card.border 
                        }}>
                            
                            {/* IMAGE CONTAINER */}
                            <div style={{ position: 'relative', height: '200px' }}>
                                {ws.category === 'ONE-ON-ONE' && (
                                    <div style={{ ...styles.badge, background: 'green' }}>1-on-1 Session</div>
                                )}
                                {isBooked && (
                                    <div style={{ ...styles.badge, background: palette.flame, right: '10px', left: 'auto' }}>Registered ✓</div>
                                )}

                                {ws.image ? (
                                    <img src={`http://localhost:5000/uploads/${ws.image}`} alt={ws.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', background: palette.lightSand, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No Image</div>
                                )}
                            </div>

                            {/* CONTENT */}
                            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ margin: '0 0 10px 0', color: palette.deep }}>{ws.title}</h3>
                                
                                <p style={{ fontWeight: 'bold', color: palette.copper, marginBottom: '5px' }}>
                                    {new Date(ws.date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                                </p>
                                
                                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '10px' }}>
                                    Type: <strong>{ws.category === 'ONE-ON-ONE' ? 'One-on-One' : 'Group'}</strong>
                                </p>

                                <p style={{ color: '#555', lineHeight: '1.5', flex: 1 }}>{ws.description}</p>
                                
                                <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                     <span style={{ color: isFull ? 'red' : 'green', fontWeight: 'bold' }}>
                                        {isFull ? 'Sold Out' : `${ws.seats} Seats Left`}
                                    </span>
                                </div>

                                {/* BUTTON LOGIC */}
                                {isBooked ? (
                                    <button 
                                        onClick={() => handleCancel(ws)}
                                        style={{ ...styles.btn, background: palette.white, border: `2px solid ${palette.flame}`, color: palette.flame }}
                                    >
                                        Cancel Registration
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => initiateBooking(ws)}
                                        disabled={isFull}
                                        style={{ 
                                            ...styles.btn, 
                                            background: isFull ? '#ccc' : palette.deep, 
                                            color: 'white',
                                            cursor: isFull ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        {isFull ? 'Full' : 'Register Now'}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* === POPUP FORM (MODAL) === */}
            {selectedWorkshop && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(68,45,28,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ background: palette.white, padding: '30px', borderRadius: '12px', width: '90%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                        <h2 style={{ color: palette.deep, marginTop: 0 }}>Confirm Registration</h2>
                        <p><strong>Workshop:</strong> {selectedWorkshop.title}</p>
                        
                        <form onSubmit={handleConfirmBooking}>
                            <label style={{ display: 'block', marginTop: '15px', color: palette.ember, fontWeight: 'bold' }}>Phone Number:</label>
                            <input 
                                required 
                                type="tel"
                                value={formDetails.phone} 
                                onChange={e => setFormDetails({...formDetails, phone: e.target.value})}
                                style={styles.input}
                            />

                            <label style={{ display: 'block', marginTop: '10px', color: palette.ember, fontWeight: 'bold' }}>Pottery Experience?</label>
                            <select 
                                value={formDetails.experience} 
                                onChange={e => setFormDetails({...formDetails, experience: e.target.value})}
                                style={styles.input}
                            >
                                <option value="Beginner">I am a Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>

                            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                                <button type="submit" style={{ flex: 1, padding: '12px', background: palette.flame, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Confirm</button>
                                <button type="button" onClick={() => setSelectedWorkshop(null)} style={{ flex: 1, padding: '12px', background: palette.sand, color: palette.deep, border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Workshops;
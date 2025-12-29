import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

const TestimonialsSection = () => {
    const [testimonials, setTestimonials] = useState([]);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/content/testimonials');
                setTestimonials(res.data);
            } catch (err) { console.error("Error fetching testimonials:", err); }
        };
        fetchTestimonials();
    }, []);

    if (testimonials.length === 0) return null;

    return (
        <div style={{ background: palette.lightSand, padding: '60px 20px', marginTop: '40px', fontFamily: 'Arial, sans-serif' }}>
            
            <style>{`
                .test-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 30px;
                    justify-content: center;
                }
                .test-card {
                    width: 100%;
                    max-width: 350px; /* Prevents wide stretching */
                    background: ${palette.white};
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(68,45,28,0.05);
                    border: 1px solid ${palette.sand};
                    overflow: hidden;
                    transition: transform 0.3s ease;
                    display: flex;
                    flex-direction: column;
                }
                .test-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 12px 24px rgba(68,45,28,0.12);
                }
            `}</style>

            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h2 style={{ textAlign: 'center', color: palette.deep, fontSize: '2.5rem', marginBottom: '50px' }}>
                    What People Say
                </h2>

                <div className="test-container">
                    {testimonials.map((t) => (
                        <div key={t._id} className="test-card">

                            {/* MEDIA SECTION */}
                            {t.mediaType === 'image' && (
                                <img
                                    src={`http://localhost:5000/uploads/${t.media}`}
                                    alt="customer"
                                    style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                                />
                            )}

                            {t.mediaType === 'video' && (
                                <video
                                    controls
                                    style={{ width: '100%', height: '220px', objectFit: 'cover', background: '#000' }}
                                >
                                    <source src={`http://localhost:5000/uploads/${t.media}`} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            )}

                            {/* TEXT CONTENT */}
                            <div style={{ padding: '25px', position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                {/* Only show quote icon if there is no media, to keep it clean */}
                                {t.mediaType === 'none' && (
                                    <span style={{ fontSize: '4rem', color: palette.sand, position: 'absolute', top: '10px', left: '20px', fontFamily: 'serif', opacity: 0.5 }}>“</span>
                                )}

                                <p style={{ fontSize: '1.05rem', color: '#555', fontStyle: 'italic', position: 'relative', zIndex: 1, marginTop: t.mediaType === 'none' ? '30px' : '0', flex: 1, lineHeight: '1.6' }}>
                                    "{t.message}"
                                </p>

                                <div style={{ marginTop: '20px', borderTop: `1px solid ${palette.lightSand}`, paddingTop: '15px' }}>
                                    <h4 style={{ margin: '0', color: palette.ember, fontSize: '1.1rem' }}>{t.name}</h4>
                                    <span style={{ fontSize: '0.9rem', color: palette.copper, fontWeight: 'bold' }}>{t.designation}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TestimonialsSection;
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
    const [loading, setLoading] = useState(true); // Added loading state

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/content/testimonials');
                setTestimonials(res.data);
            } catch (err) { 
                console.error("Error fetching testimonials:", err); 
            } finally {
                setLoading(false); // Stop loading
            }
        };
        fetchTestimonials();
    }, []);

    // Helper: Skeleton Loader Component
    const SkeletonCard = () => (
        <div className="test-card skeleton-card">
            <div className="skeleton-media"></div>
            <div style={{ padding: '25px' }}>
                <div className="skeleton-line" style={{ width: '90%' }}></div>
                <div className="skeleton-line" style={{ width: '80%' }}></div>
                <div className="skeleton-line" style={{ width: '40%', marginTop: '20px' }}></div>
            </div>
        </div>
    );

    return (
        <div className="testimonials-section">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;1,500&family=Poppins:wght@300;400;500&display=swap');

                .testimonials-section {
                    background: ${palette.lightSand};
                    padding: 80px 20px;
                    font-family: 'Poppins', sans-serif;
                    position: relative;
                    overflow: hidden;
                }

                /* Background Pattern */
                .testimonials-section::before {
                    content: '“';
                    position: absolute;
                    top: -50px;
                    left: -20px;
                    font-family: 'Playfair Display', serif;
                    font-size: 30rem;
                    color: rgba(142, 80, 34, 0.03);
                    pointer-events: none;
                }

                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    position: relative;
                }

                /* --- HEADER --- */
                .section-header {
                    text-align: center;
                    margin-bottom: 60px;
                    animation: fadeIn 1s ease;
                }

                .section-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 3rem;
                    color: ${palette.deep};
                    margin: 0;
                }

                .section-subtitle {
                    color: ${palette.ember};
                    margin-top: 10px;
                    font-size: 1.1rem;
                    opacity: 0.8;
                }

                /* --- GRID --- */
                .test-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
                    gap: 30px;
                }

                /* --- CARD STYLING --- */
                .test-card {
                    background: ${palette.white};
                    border-radius: 20px;
                    box-shadow: 0 10px 30px rgba(68,45,28,0.05);
                    border: 1px solid rgba(142, 80, 34, 0.1);
                    overflow: hidden;
                    transition: all 0.4s ease;
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    animation: slideUp 0.6s ease backwards;
                }

                /* Stagger Animation */
                .test-card:nth-child(1) { animation-delay: 0.1s; }
                .test-card:nth-child(2) { animation-delay: 0.2s; }
                .test-card:nth-child(3) { animation-delay: 0.3s; }

                .test-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 20px 40px rgba(68,45,28,0.12);
                }

                /* --- MEDIA AREA --- */
                .media-wrapper {
                    height: 240px;
                    overflow: hidden;
                    position: relative;
                    background: #F5F5F5;
                }

                .media-content {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.6s ease;
                }

                .test-card:hover .media-content {
                    transform: scale(1.05);
                }

                /* --- TEXT CONTENT --- */
                .content-wrapper {
                    padding: 30px;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                }

                .quote-icon {
                    position: absolute;
                    top: 20px;
                    left: 20px;
                    font-family: 'Playfair Display', serif;
                    font-size: 4rem;
                    color: ${palette.sand};
                    opacity: 0.4;
                    line-height: 1;
                    pointer-events: none;
                }

                .message-text {
                    font-size: 1.05rem;
                    color: #555;
                    font-style: italic;
                    line-height: 1.7;
                    flex: 1;
                    margin-bottom: 25px;
                    position: relative;
                    z-index: 1;
                }

                .author-block {
                    border-top: 1px solid ${palette.lightSand};
                    padding-top: 15px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }

                .author-avatar {
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    background: ${palette.copper};
                    color: #FFF;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 1.2rem;
                }

                .author-info h4 {
                    margin: 0;
                    color: ${palette.deep};
                    font-size: 1.1rem;
                    font-family: 'Playfair Display', serif;
                }

                .author-info span {
                    font-size: 0.85rem;
                    color: ${palette.flame};
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                /* --- SKELETON LOADER --- */
                .skeleton-card { border: none; }
                .skeleton-media { height: 240px; background: #EEE; }
                .skeleton-line { height: 12px; background: #EEE; margin-bottom: 10px; border-radius: 4px; }
                
                @keyframes shimmer {
                    0% { background-position: -468px 0; }
                    100% { background-position: 468px 0; }
                }
                
                .skeleton-media, .skeleton-line {
                    background: #f6f7f8;
                    background-image: linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%);
                    background-repeat: no-repeat;
                    background-size: 800px 240px; 
                    animation: shimmer 1s linear infinite;
                }

                /* --- ANIMATIONS --- */
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

                /* --- RESPONSIVE --- */
                @media (max-width: 768px) {
                    .test-container { grid-template-columns: 1fr; }
                    .section-title { font-size: 2.2rem; }
                }
            `}</style>

            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Community Voices</h2>
                    <p className="section-subtitle">Hear from the artists and collectors who inspire us.</p>
                </div>

                {loading ? (
                    <div className="test-container">
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                ) : testimonials.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
                        No testimonials yet. Be the first to share your story!
                    </div>
                ) : (
                    <div className="test-container">
                        {testimonials.map((t) => (
                            <div key={t._id} className="test-card">

                                {/* MEDIA SECTION */}
                                {t.mediaType !== 'none' && (
                                    <div className="media-wrapper">
                                        {t.mediaType === 'image' ? (
                                            <img
                                                src={`http://localhost:5000/uploads/${t.media}`}
                                                alt="customer"
                                                className="media-content"
                                            />
                                        ) : (
                                            <video controls className="media-content" style={{background:'#000'}}>
                                                <source src={`http://localhost:5000/uploads/${t.media}`} type="video/mp4" />
                                            </video>
                                        )}
                                    </div>
                                )}

                                {/* TEXT CONTENT */}
                                <div className="content-wrapper">
                                    {/* Quote Icon Background for text-only cards */}
                                    {t.mediaType === 'none' && <div className="quote-icon">“</div>}

                                    <p className="message-text">
                                        "{t.message}"
                                    </p>

                                    <div className="author-block">
                                        {/* Fallback Avatar based on first letter */}
                                        <div className="author-avatar">
                                            {t.name.charAt(0).toUpperCase()}
                                        </div>
                                        
                                        <div className="author-info">
                                            <h4>{t.name}</h4>
                                            <span>{t.designation}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TestimonialsSection;
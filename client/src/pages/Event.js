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

const NewsSection = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. STATE FOR IMAGE LIGHTBOX
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await axios.get('https://gwoc-basho-1.onrender.com/api/content/news');
                setNews(res.data);
            } catch (err) {
                console.error("Error fetching news:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    // Helper to format date nicely
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };
    const CLOUD_NAME = "dnbplr9pw";

    return (
        <div className="news-section">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Poppins:wght@300;400;500&display=swap');

                .news-section {
                    padding: 80px 20px;
                    background: radial-gradient(circle at top right, ${palette.lightSand}, #F2E6D8);
                    min-height: 60vh;
                    font-family: 'Poppins', sans-serif;
                }

                .container {
                    max-width: 1200px;
                    margin: 0 auto;
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
                    position: relative;
                    display: inline-block;
                }

                .section-title::after {
                    content: '';
                    display: block;
                    width: 60px;
                    height: 3px;
                    background: ${palette.flame};
                    margin: 15px auto 0;
                }

                .section-subtitle {
                    color: ${palette.ember};
                    margin-top: 15px;
                    font-size: 1.1rem;
                    opacity: 0.8;
                }

                /* --- GRID LAYOUT --- */
                .news-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                    gap: 40px;
                }

                /* --- CARD STYLING --- */
                .news-card {
                    background: ${palette.white};
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(68, 45, 28, 0.05);
                    transition: all 0.4s ease;
                    border: 1px solid rgba(142, 80, 34, 0.1);
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    animation: slideUp 0.8s ease backwards;
                }

                .news-card:nth-child(1) { animation-delay: 0.1s; }
                .news-card:nth-child(2) { animation-delay: 0.2s; }
                .news-card:nth-child(3) { animation-delay: 0.3s; }
                .news-card:nth-child(4) { animation-delay: 0.4s; }

                .news-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 20px 50px rgba(68, 45, 28, 0.15);
                }

                /* --- IMAGE AREA --- */
                .image-wrapper {
                    height: 240px;
                    overflow: hidden;
                    position: relative;
                    cursor: zoom-in; /* Indicates clickability */
                }

                .news-image {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    transition: transform 0.6s ease;
                }

                .news-card:hover .news-image {
                    transform: scale(1.08);
                }

                .date-badge {
                    position: absolute;
                    top: 15px;
                    left: 15px;
                    background: rgba(255, 255, 255, 0.95);
                    padding: 6px 14px;
                    border-radius: 30px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: ${palette.flame};
                    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                    z-index: 2;
                    pointer-events: none; /* Allows click to pass through to wrapper */
                }

                /* --- CONTENT AREA --- */
                .card-content {
                    padding: 25px;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                .news-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.5rem;
                    color: ${palette.deep};
                    margin: 0 0 15px 0;
                    line-height: 1.3;
                    transition: color 0.3s;
                }

                .news-card:hover .news-title {
                    color: ${palette.flame};
                }

                .news-desc {
                    color: #666;
                    font-size: 0.95rem;
                    line-height: 1.7;
                    flex: 1;
                    margin-bottom: 20px;
                    display: -webkit-box;
                    -webkit-line-clamp: 4;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                /* --- LIGHTBOX (FULL SCREEN) STYLES --- */
                .lightbox-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.9);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 2000;
                    animation: fadeIn 0.3s ease;
                    cursor: zoom-out;
                }

                .lightbox-image {
                    max-width: 90%;
                    max-height: 90vh;
                    object-fit: contain;
                    border-radius: 8px;
                    box-shadow: 0 0 50px rgba(255,255,255,0.1);
                    animation: scaleIn 0.3s ease;
                    cursor: default;
                }

                .close-hint {
                    position: absolute;
                    bottom: 30px;
                    color: white;
                    font-size: 0.9rem;
                    opacity: 0.8;
                    letter-spacing: 1px;
                }

                /* --- ANIMATIONS --- */
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid rgba(142, 80, 34, 0.2);
                    border-top-color: ${palette.flame};
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 50px auto;
                }

                @media (max-width: 768px) {
                    .news-grid { grid-template-columns: 1fr; }
                    .section-title { font-size: 2.2rem; }
                }
            `}</style>

            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Latest Exhibitions</h2>
                    <p className="section-subtitle">Stories from the studio and upcoming events.</p>
                </div>

                {loading ? (
                    <div className="spinner"></div>
                ) : news.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#888', padding: '40px' }}>
                        <h3>No news updates at the moment.</h3>
                    </div>
                ) : (
                    <div className="news-grid">
                        {news.map((item) => (
                            <div key={item._id} className="news-card">

                                {/* 2. CLICK HANDLER ON IMAGE WRAPPER */}
                                {/* Ensure CLOUD_NAME is defined at the top of your file */}
                                <div
                                    className="image-wrapper"
                                    onClick={() => item.image && setSelectedImage(
                                        item.image.startsWith('http')
                                            ? item.image
                                            : `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${item.image}`
                                    )}
                                >
                                    {item.image ? (
                                        <img
                                            src={
                                                item.image.startsWith('http')
                                                    ? item.image
                                                    : `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${item.image}`
                                            }
                                            alt={item.title}
                                            className="news-image"
                                        />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', background: palette.lightSand, display: 'flex', alignItems: 'center', justifyContent: 'center', color: palette.copper }}>
                                            No Image
                                        </div>
                                    )}
                                </div>

                                <div className="card-content">
                                    <h3 className="news-title">{item.title}</h3>
                                    <p className="news-desc">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 3. LIGHTBOX OVERLAY COMPONENT */}
            {selectedImage && (
                <div className="lightbox-overlay" onClick={() => setSelectedImage(null)}>
                    <img
                        src={selectedImage}
                        alt="Full Screen"
                        className="lightbox-image"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
                    />
                    <div className="close-hint">Click outside to close</div>
                </div>
            )}
        </div>
    );
};

export default NewsSection;
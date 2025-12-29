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

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/content/news');
                setNews(res.data);
            } catch (err) { console.error("Error fetching news:", err); }
        };
        fetchNews();
    }, []);

    if (news.length === 0) return null;

    return (
        <div style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
            
            <style>{`
                /* Container for the cards */
                .news-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 30px;
                    justify-content: center; /* Centers items if there are few */
                }

                /* Individual Card Styling */
                .news-card {
                    width: 100%;
                    max-width: 380px; /* FIXED WIDTH: Prevents expanding too much */
                    background: ${palette.white};
                    box-shadow: 0 4px 15px rgba(68,45,28,0.08);
                    border-radius: 12px;
                    overflow: hidden;
                    border: 1px solid ${palette.sand};
                    transition: all 0.3s ease;
                    display: flex;
                    flex-direction: column;
                }

                .news-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 12px 24px rgba(68,45,28,0.15);
                }
            `}</style>

            <h2 style={{ textAlign: 'center', color: palette.deep, fontSize: '2.5rem', marginBottom: '50px' }}>
                Latest News & Exhibitions
            </h2>

            <div className="news-container">
                {news.map((item) => (
                    <div key={item._id} className="news-card">
                        
                        {item.image ? (
                            <img
                                src={`http://localhost:5000/uploads/${item.image}`}
                                alt={item.title}
                                style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                            />
                        ) : (
                            <div style={{ width: '100%', height: '220px', background: palette.lightSand, display: 'flex', alignItems: 'center', justifyContent: 'center', color: palette.copper }}>
                                No Image Available
                            </div>
                        )}

                        <div style={{ padding: '25px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <p style={{ color: palette.copper, fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '8px' }}>
                                {new Date(item.date).toLocaleDateString()}
                            </p>
                            <h3 style={{ margin: '0 0 15px 0', color: palette.ember, fontSize: '1.4rem' }}>
                                {item.title}
                            </h3>
                            <p style={{ color: '#555', lineHeight: '1.6', fontSize: '1rem', flex: 1 }}>
                                {item.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NewsSection;
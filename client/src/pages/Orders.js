import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react'; 

const palette = {
    deep: '#442D1C',
    ember: '#652810',
    copper: '#8E5022',
    flame: '#C85428',
    sand: '#EDD8B4',
    lightSand: '#F9F3E9',
    white: '#FFFFFF',
    shadow: 'rgba(68, 45, 28, 0.08)'
};

const Orders = () => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); 
    const [selectedProduct, setSelectedProduct] = useState(null); 
    const [addressForm, setAddressForm] = useState({ address: '', phone: '', city: '', zip: '' }); 
    const user = JSON.parse(localStorage.getItem('user')); 

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/products');
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="orders-page">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Poppins:wght@300;400;500;600&display=swap');

                .orders-page {
                    padding: 40px 20px;
                    background: radial-gradient(circle at top left, ${palette.lightSand}, #F2E6D8);
                    min-height: 100vh;
                    font-family: 'Poppins', sans-serif;
                }

                .page-header {
                    text-align: center;
                    margin-bottom: 50px;
                    animation: fadeIn 0.8s ease;
                    padding: 0 10px; /* Prevent text touching edges on mobile */
                }

                .page-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 2.8rem;
                    color: ${palette.deep};
                    margin-bottom: 10px;
                    line-height: 1.2;
                }

                .page-subtitle {
                    color: ${palette.ember};
                    font-size: 1.1rem;
                    opacity: 0.8;
                    margin-bottom: 30px;
                }

                /* --- RESPONSIVE SEARCH BAR --- */
                .search-container {
                    max-width: 500px; /* Maximum width on desktop */
                    width: 100%;      /* Full width on smaller screens */
                    margin: 0 auto;
                    position: relative;
                    box-sizing: border-box;
                }

                .search-input {
                    width: 100%;
                    padding: 15px 20px 15px 50px; /* Left padding space for icon */
                    border-radius: 30px;
                    border: 1px solid rgba(142, 80, 34, 0.2);
                    font-size: 1rem;
                    outline: none;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                    transition: all 0.3s;
                    background: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(5px);
                    box-sizing: border-box; /* Ensures padding doesn't overflow width */
                }

                .search-input:focus {
                    background: #fff;
                    box-shadow: 0 8px 25px rgba(142, 80, 34, 0.15);
                    border-color: ${palette.copper};
                }

                .search-icon {
                    position: absolute;
                    left: 20px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: ${palette.ember};
                    opacity: 0.6;
                    pointer-events: none; /* Allows clicking through the icon */
                }

                /* --- GRID LAYOUT --- */
                .orders-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 30px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                /* --- CARD STYLING --- */
                .orders-card {
                    background: ${palette.white};
                    border-radius: 16px;
                    overflow: hidden;
                    border: 1px solid rgba(142, 80, 34, 0.1);
                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                    box-shadow: 0 10px 30px ${palette.shadow};
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    position: relative;
                    animation: slideUp 0.6s ease backwards;
                }

                .orders-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 20px 40px rgba(68, 45, 28, 0.15);
                }

                .card-image-wrapper {
                    height: 240px;
                    overflow: hidden;
                    position: relative;
                    background: #F5F5F5;
                }

                .card-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s ease;
                }

                .orders-card:hover .card-image {
                    transform: scale(1.08);
                }

                .card-content {
                    padding: 20px;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                .product-name {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.4rem;
                    color: ${palette.deep};
                    margin: 0 0 8px 0;
                    line-height: 1.2;
                    text-decoration: none;
                }

                .product-desc {
                    font-size: 0.9rem;
                    color: #666;
                    line-height: 1.5;
                    margin-bottom: 20px;
                    flex: 1;
                }

                .card-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: auto;
                    padding-top: 15px;
                    border-top: 1px dashed rgba(142, 80, 34, 0.15);
                }

                .price-tag {
                    font-size: 1.3rem;
                    font-weight: 600;
                    color: ${palette.flame};
                }

                /* --- MOBILE BREAKPOINTS --- */
                @media (max-width: 600px) {
                    .orders-page {
                        padding: 20px 15px; /* Reduce page padding */
                    }
                    .page-title {
                        font-size: 2.2rem; /* Smaller title */
                    }
                    .search-container {
                        max-width: 100%; /* Ensure full width usage */
                    }
                    .search-input {
                        font-size: 0.95rem;
                        padding: 12px 15px 12px 45px; /* Slightly tighter padding */
                    }
                    .search-icon {
                        left: 15px;
                        width: 18px;
                        height: 18px;
                    }
                    .orders-grid {
                        grid-template-columns: 1fr; /* Single column on mobile */
                        gap: 20px;
                    }
                }

                /* ANIMATIONS */
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>

            <div className="page-header">
                <h2 className="page-title">Available Collections</h2>
                <p className="page-subtitle">Unique, handcrafted pieces ready for your home.</p>
                
                {/* --- RESPONSIVE SEARCH BAR --- */}
                <div className="search-container">
                    <Search className="search-icon" size={22} />
                    <input 
                        type="text" 
                        className="search-input" 
                        placeholder="Search for pottery..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {filteredProducts.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#999', padding: '60px' }}>
                    {searchQuery ? 
                        <h3>No products found matching "{searchQuery}"</h3> : 
                        <h3>No products available at the moment.</h3>
                    }
                </div>
            ) : (
                <div className="orders-grid">
                    {filteredProducts.map((p, index) => (
                        <div 
                            key={p._id} 
                            className="orders-card"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            
                            {/* --- IMAGE AREA --- */}
                            <div className="card-image-wrapper">
                                <Link to={`/product/${p._id}`}>
                                    <img
                                        src={p.images && p.images.length > 0 
                                            ? `http://localhost:5000/uploads/${p.images[0]}` 
                                            : (p.image || 'https://via.placeholder.com/300x300?text=No+Image')} 
                                        alt={p.name} 
                                        className="card-image"
                                    />
                                </Link>
                            </div>
                            
                            {/* --- CONTENT AREA --- */}
                            <div className="card-content">
                                <Link to={`/product/${p._id}`} style={{ textDecoration: 'none' }}>
                                    <h3 className="product-name">{p.name}</h3>
                                </Link>
                                
                                <p className="product-desc">
                                    {p.description ? (
                                        p.description.length > 80 ? p.description.substring(0, 80) + "..." : p.description
                                    ) : "A beautiful handcrafted piece."}
                                </p>
                                
                                <div className="card-footer">
                                    <h4 className="price-tag">₹{p.price}</h4>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
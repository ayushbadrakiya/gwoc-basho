import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

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
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sortOrder, setSortOrder] = useState('default');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('https://gwoc-basho-1.onrender.com/api/products');
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const filteredProducts = products
        .filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
            const price = parseFloat(product.price);
            const min = minPrice ? parseFloat(minPrice) : 0;
            const max = maxPrice ? parseFloat(maxPrice) : Infinity;
            const matchesPrice = price >= min && price <= max;
            return matchesSearch && matchesPrice;
        })
        .sort((a, b) => {
            if (sortOrder === 'asc') return a.price - b.price;
            if (sortOrder === 'desc') return b.price - a.price;
            return 0;
        });

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
                    margin-bottom: 40px;
                    animation: fadeIn 0.8s ease;
                    padding: 0 10px;
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

                /* --- CONTROLS --- */
                .controls-container {
                    max-width: 900px;
                    margin: 0 auto 50px;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    align-items: center;
                }

                .search-wrapper {
                    position: relative;
                    width: 100%;
                    max-width: 500px;
                }

                .search-input {
                    width: 100%;
                    padding: 15px 20px 15px 50px;
                    border-radius: 30px;
                    border: 1px solid rgba(142, 80, 34, 0.2);
                    font-size: 1rem;
                    outline: none;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                    transition: all 0.3s;
                    background: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(5px);
                    box-sizing: border-box;
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
                    pointer-events: none;
                }

                .filter-bar {
                    display: flex;
                    gap: 15px;
                    align-items: center;
                    flex-wrap: wrap;
                    justify-content: center;
                    background: rgba(255, 255, 255, 0.6);
                    padding: 15px 25px;
                    border-radius: 20px;
                    border: 1px solid rgba(142, 80, 34, 0.1);
                }

                .filter-group {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .filter-input {
                    padding: 10px 15px;
                    border-radius: 12px;
                    border: 1px solid #ddd;
                    background: #fff;
                    width: 100px;
                    font-size: 0.9rem;
                    outline: none;
                    transition: border 0.3s;
                }

                .filter-input:focus {
                    border-color: ${palette.copper};
                }

                .filter-select {
                    padding: 10px 15px;
                    border-radius: 12px;
                    border: 1px solid #ddd;
                    background: #fff;
                    font-size: 0.9rem;
                    outline: none;
                    cursor: pointer;
                    min-width: 160px;
                }

                .filter-label {
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: ${palette.deep};
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }

                /* --- GRID --- */
                .orders-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 30px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                /* --- CARD --- */
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
                    height: 240px; /* Default desktop height */
                    overflow: hidden;
                    position: relative;
                    background: #f0ebe5; /* Added color to see area if image is transparent/white */
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
                    margin: 0;
                }

                /* --- MOBILE BREAKPOINTS (FIXED GAPS) --- */
                @media (max-width: 600px) {
                    .orders-page {
                        padding: 20px 15px;
                    }
                    .page-title {
                        font-size: 2.2rem;
                    }
                    
                    /* --- FIX 1: Reduce Image Height --- */
                    .card-image-wrapper {
                        height: 180px; /* Reduced from 240px to close gap */
                    }

                    /* --- FIX 2: Reduce Padding & Margins --- */
                    .card-content {
                        padding: 15px; /* Reduced from 20px */
                    }
                    
                    .product-desc {
                        margin-bottom: 10px; /* Reduced from 20px */
                    }

                    .card-footer {
                        padding-top: 10px;
                    }

                    /* Stack Filters */
                    .filter-bar {
                        flex-direction: column;
                        width: 100%;
                        align-items: stretch;
                        padding: 15px;
                        gap: 15px;
                    }
                    
                    .filter-group {
                        justify-content: space-between;
                    }
                    
                    .filter-input {
                        width: 48%; 
                    }
                    
                    .filter-select {
                        width: 100%;
                    }

                    .search-wrapper {
                        max-width: 100%;
                    }

                    .orders-grid {
                        grid-template-columns: 1fr;
                        gap: 20px;
                    }
                }

                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>

            <div className="page-header">
                <h2 className="page-title">Available Collections</h2>
                <p className="page-subtitle">Unique, handcrafted pieces ready for your home.</p>

                {/* --- CONTROLS CONTAINER --- */}
                <div className="controls-container">

                    {/* Search Bar */}
                    <div className="search-wrapper">
                        <Search className="search-icon" size={22} />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search for pottery..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Filter Bar */}
                    <div className="filter-bar">
                        <div className="filter-group">
                            <span className="filter-label"><Filter size={16} /> Price:</span>
                            <input
                                type="number"
                                className="filter-input"
                                placeholder="Min ₹"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                            />
                            <input
                                type="number"
                                className="filter-input"
                                placeholder="Max ₹"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                            />
                        </div>

                        <div className="filter-group" style={{ flex: 1, justifyContent: 'flex-end' }}>
                            <span className="filter-label"><ArrowUpDown size={16} /> Sort By:</span>
                            <select
                                className="filter-select"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                            >
                                <option value="default">Newest Arrivals</option>
                                <option value="asc">Price: Low to High</option>
                                <option value="desc">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {filteredProducts.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#999', padding: '60px' }}>
                    {searchQuery || minPrice || maxPrice ?
                        <h3>No products found matching your filters.</h3> :
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
                            {/* const CLOUD_NAME = "dnbplr9pw"; */}
                            <div className="card-image-wrapper">
                                <Link to={`/product/${p._id}`}>
                                    <img
                                        src={
                                            p.images && p.images.length > 0
                                                ? (p.images[0].startsWith('http')
                                                    ? p.images[0]
                                                    : `https://res.cloudinary.com/dnbplr9pw/image/upload/${p.images[0]}`)
                                                : (p.image || 'https://via.placeholder.com/300x300?text=No+Image')
                                        }
                                        alt={p.name}
                                        className="card-image"
                                    />
                                </Link>
                            </div>

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
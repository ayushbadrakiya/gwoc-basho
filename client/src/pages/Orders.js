import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

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
    const [selectedProduct, setSelectedProduct] = useState(null); // Track which product is being bought
    const [addressForm, setAddressForm] = useState({ address: '', phone: '', city: '', zip: '' }); // Form Data
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

    // 1. User Clicks "Buy Now" -> Open Form
    const initiateBuy = (product) => {
        if (!user) {
            alert("Please Login first!");
            window.location.href = '/login';
            return;
        }
        setSelectedProduct(product); // Show modal
    };

    // 2. User Submits Address -> Process Order
    const confirmOrder = async (e) => {
        e.preventDefault();
        if(!selectedProduct) return;

        try {
            const payload = {
                customerName: user.name,
                email: user.email, 
                amount: selectedProduct.price,
                orderType: 'STANDARD',
                productId: selectedProduct._id,
                productName: selectedProduct.name,
                ...addressForm // Spread address fields
            };

            const res = await axios.post('http://localhost:5000/api/buy', payload);
            
            if (res.data.success) {
                alert(`Order Placed! We will ship to ${addressForm.city}.`);
                setProducts(products.filter(p => p._id !== selectedProduct._id)); // Remove from screen
                setSelectedProduct(null); // Close modal
                setAddressForm({ address: '', phone: '', city: '', zip: '' }); // Reset form
            }
        } catch (error) {
            alert("Order failed.");
        }
    };

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
                }

                .page-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 2.8rem;
                    color: ${palette.deep};
                    margin-bottom: 10px;
                }

                .page-subtitle {
                    color: ${palette.ember};
                    font-size: 1.1rem;
                    opacity: 0.8;
                }

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

                .buy-btn {
                    background: ${palette.deep};
                    color: white;
                    border: none;
                    padding: 8px 20px;
                    border-radius: 20px;
                    cursor: pointer;
                    font-size: 0.9rem;
                    font-weight: 500;
                    transition: all 0.2s;
                }

                .buy-btn:hover {
                    background: ${palette.ember};
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(68, 45, 28, 0.2);
                }

                /* --- MODAL STYLES --- */
                .modal-overlay {
                    position: fixed;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(68, 45, 28, 0.7);
                    backdrop-filter: blur(4px);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    animation: fadeIn 0.3s ease;
                }

                .modal-box {
                    background: ${palette.white};
                    padding: 35px;
                    border-radius: 16px;
                    width: 90%;
                    max-width: 420px;
                    box-shadow: 0 25px 50px rgba(0,0,0,0.25);
                    border: 1px solid rgba(142, 80, 34, 0.1);
                    animation: scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }

                .modal-title {
                    margin-top: 0;
                    color: ${palette.deep};
                    font-family: 'Playfair Display', serif;
                    font-size: 1.5rem;
                    text-align: center;
                    margin-bottom: 20px;
                }

                .modal-input {
                    width: 100%;
                    padding: 12px 15px;
                    margin-bottom: 15px;
                    border: 1px solid #E0E0E0;
                    border-radius: 8px;
                    background: #FAFAFA;
                    font-size: 0.95rem;
                    box-sizing: border-box;
                    transition: 0.3s;
                }

                .modal-input:focus {
                    outline: none;
                    border-color: ${palette.copper};
                    background: #FFF;
                    box-shadow: 0 0 0 3px rgba(142, 80, 34, 0.1);
                }

                .row-inputs {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                }

                .modal-btn-primary {
                    width: 100%;
                    padding: 12px;
                    background: ${palette.flame};
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 1rem;
                    font-weight: 600;
                    margin-top: 10px;
                    transition: 0.2s;
                }
                .modal-btn-primary:hover { background: ${palette.ember}; }

                .modal-btn-secondary {
                    width: 100%;
                    padding: 12px;
                    background: transparent;
                    color: #888;
                    border: none;
                    cursor: pointer;
                    font-size: 0.9rem;
                    margin-top: 10px;
                    text-decoration: underline;
                }
                .modal-btn-secondary:hover { color: ${palette.deep}; }

                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            `}</style>

            <div className="page-header">
                <h2 className="page-title">Available Collections</h2>
                <p className="page-subtitle">Unique, handcrafted pieces ready for your home.</p>
            </div>

            {products.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#999', padding: '60px' }}>
                    <h3>No products available at the moment.</h3>
                </div>
            ) : (
                <div className="orders-grid">
                    {products.map((p, index) => (
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

            {/* --- SHIPPING ADDRESS MODAL --- */}
            {selectedProduct && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3 className="modal-title">Shipping Details</h3>
                        <p style={{textAlign:'center', fontSize:'0.9rem', color:'#666', marginBottom:'20px'}}>
                            For <strong>{selectedProduct.name}</strong>
                        </p>
                        
                        <form onSubmit={confirmOrder}>
                            <input 
                                className="modal-input"
                                required 
                                placeholder="Street Address" 
                                value={addressForm.address} 
                                onChange={e=>setAddressForm({...addressForm, address: e.target.value})} 
                            />
                            
                            <div className="row-inputs">
                                <input 
                                    className="modal-input"
                                    required 
                                    placeholder="City" 
                                    value={addressForm.city} 
                                    onChange={e=>setAddressForm({...addressForm, city: e.target.value})} 
                                />
                                <input 
                                    className="modal-input"
                                    required 
                                    placeholder="Zip Code" 
                                    value={addressForm.zip} 
                                    onChange={e=>setAddressForm({...addressForm, zip: e.target.value})} 
                                />
                            </div>

                            <input 
                                className="modal-input"
                                required 
                                placeholder="Phone Number" 
                                value={addressForm.phone} 
                                onChange={e=>setAddressForm({...addressForm, phone: e.target.value})} 
                            />
                            
                            <button type="submit" className="modal-btn-primary">
                                Confirm Purchase - ₹{selectedProduct.price}
                            </button>
                            
                            <button type="button" onClick={() => setSelectedProduct(null)} className="modal-btn-secondary">
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;
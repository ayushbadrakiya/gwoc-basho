import React, { useState, useEffect, useRef } from 'react';

const theme = {
  ink: '#442D1C',
  bone: '#EDD8B4',
  stone: '#8E5022',
  clay: '#652810',
  accent: '#C85428',
  warm: '#8E5022',
  white: '#fff7eb',
  gold: '#C85428',
  shadow: 'rgba(68, 45, 28, 0.12)'
};

const App = () => {
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const philosophyRef = useRef(null);
  
  // Scroll handling
  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollY(position);
      
      const sections = ['hero', 'story', 'philosophy', 'products', 'craft'];
      const current = sections.find(section => {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };
    
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div style={{ 
      backgroundColor: theme.bone, 
      color: theme.ink, 
      fontFamily: "'Inter', sans-serif",
      overflowX: 'hidden',
      width: '100%'
    }}>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap');
        
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        
        .serif { font-family: 'Cormorant Garamond', serif; }
        .organic-shape { border-radius: 60% 40% 70% 30% / 30% 60% 40% 70%; overflow: hidden; }
        .collection-shape { border-radius: 40% 60% 50% 50% / 30% 40% 60% 70%; overflow: hidden; }
        
        .hover-lift { 
          transition: all 0.6s cubic-bezier(0.2, 1, 0.3, 1);
          cursor: pointer;
        }
        .hover-lift:hover { 
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 20px 40px ${theme.shadow};
        }
        
        .label { 
          font-size: 11px; 
          letter-spacing: 4px; 
          text-transform: uppercase; 
          color: ${theme.warm}; 
          display: block; 
          margin-bottom: 20px;
          font-weight: 500;
        }
        
        .fade-in { animation: fadeIn 1.2s ease-out; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .texture-overlay {
          background-image: url('data:image/svg+xml,<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noise)" opacity="0.03"/></svg>');
          pointer-events: none;
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        /* --- RESPONSIVE & NO-OVERLAP LOGIC --- */

        /* Desktop Grid Defaults */
        .products-grid { grid-template-columns: repeat(3, 1fr); }
        .pillars-grid { grid-template-columns: repeat(4, 1fr); }
        .story-grid { grid-template-columns: 1.2fr 1fr; }
        .craft-grid { grid-template-columns: 1fr 1fr; }
        .footer-grid { grid-template-columns: 1.5fr 1fr 1fr; }

        /* Tablet (Max 900px) - Switch to Stacking */
        @media (max-width: 900px) {
          .hero-section {
            flex-direction: column;
            justify-content: center;
            height: auto !important;
            padding-top: 120px !important;
            padding-bottom: 60px !important;
          }

          /* CRITICAL FIX: Change Absolute to Relative to prevent overlap */
          .hero-visual {
            position: relative !important;
            width: 100% !important;
            height: 400px !important;
            right: auto !important;
            top: auto !important;
            margin-top: 40px;
          }

          .hero-copy {
            padding-left: 20px !important;
            max-width: 100% !important;
            text-align: center;
            align-items: center;
            display: flex;
            flex-direction: column;
          }

          .hero-copy h1 {
            font-size: 60px !important;
          }

          /* Grids to Single Column */
          .story-grid, .craft-grid { 
            grid-template-columns: 1fr !important; 
            gap: 60px !important;
          }
          
          .products-grid { 
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
          }
          
          .pillars-grid { 
            grid-template-columns: repeat(2, 1fr); 
          }
        }

        /* Mobile (Max 600px) */
        @media (max-width: 600px) {
          .pillars-grid { grid-template-columns: 1fr; }
          .footer-grid { grid-template-columns: 1fr; gap: 40px !important; }
          
          .hero-copy h1 { font-size: 48px !important; }
          
          section { padding: 80px 20px !important; }
          
          .organic-shape { border-radius: 20px !important; }
        }
      `}</style>

      {/* Navigation */}
   

      {/* Hero Section */}
      <section id="hero" className="hero-section" style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        position: 'relative',
        overflow: 'hidden',
        padding: '0 5%'
      }}>
        <div className="texture-overlay" />
        
        {/* Text Content */}
        <div className="hero-copy" style={{ 
          zIndex: 10, 
          maxWidth: '650px',
          position: 'relative'
        }}>
          <span className="label fade-in" style={{ animationDelay: '0.2s' }}>Handcrafted Pottery & Tableware</span>
          <h1 className="serif fade-in" style={{ 
            fontSize: 'clamp(60px, 7vw, 110px)', 
            lineHeight: '0.9', 
            fontWeight: 300, 
            marginBottom: '30px',
            animationDelay: '0.4s'
          }}>
            Where Clay <br />
            Becomes <span style={{ 
              fontStyle: 'italic',
              background: `linear-gradient(135deg, ${theme.accent}, ${theme.warm})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Poetry</span>
          </h1>
          <p className="fade-in" style={{ 
            fontSize: '18px', 
            color: theme.warm, 
            maxWidth: '500px',
            lineHeight: '1.6',
            marginBottom: '40px',
            animationDelay: '0.6s'
          }}>
            Each piece is a haiku in clay—simple, profound, and filled with the quiet beauty of Japanese aesthetics.
          </p>
          
        </div>
        
        {/* Visual Content - Position logic handled in CSS for responsiveness */}
        <div className="hero-visual" style={{
          position: 'absolute',
          right: '5%',
          top: '15%',
          width: '45vw',
          height: '70vh',
          zIndex: 5
        }}>
          <div className="organic-shape" style={{
            width: '100%',
            height: '100%',
            background: `linear-gradient(45deg, ${theme.bone}, ${theme.clay})`,
            transform: `translateY(${scrollY * -0.05}px)`, // Parallax
            boxShadow: '0 40px 80px rgba(68, 45, 28, 0.15)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <img 
              src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80" 
              alt="Pottery"
              style={{ width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'multiply' }}
            />
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section id="story" style={{ padding: '100px 24px', maxWidth: '1400px', margin: '0 auto', position: 'relative' }}>
        <div className="story-grid" style={{ display: 'grid', gap: '80px', alignItems: 'center' }}>
          
          {/* Image */}
          <div style={{ position: 'relative' }}>
            <div className="organic-shape" style={{
              width: '100%',
              aspectRatio: '1/1',
              boxShadow: '0 30px 60px rgba(142, 127, 113, 0.15)'
            }}>
              <img 
                src="https://images.unsplash.com/photo-1565191999001-551c187427bb?auto=format&fit=crop&w=1000&q=80" 
                alt="Founder"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
          
          {/* Text */}
          <div>
            <span className="label">The Origin Story</span>
            <h2 className="serif" style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 300, marginBottom: '20px' }}>
              From Haiku to Handmade
            </h2>
            <p style={{ fontSize: '18px', marginBottom: '20px', lineHeight: '1.7' }}>
              Basho was born from a single moment of clarity—reading Matsuo Bashō's poetry while feeling clay between fingers. 
            </p>
            <blockquote style={{ borderLeft: `3px solid ${theme.gold}`, paddingLeft: '20px', fontStyle: 'italic', fontSize: '18px', color: theme.accent }}>
              "In the quiet of the studio, I listen to what the clay wants to become."
            </blockquote>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="philosophy" ref={philosophyRef} style={{ padding: '100px 24px', background: `linear-gradient(135deg, ${theme.stone}20, ${theme.bone})`, position: 'relative' }}>
        <div className="texture-overlay" />
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span className="label">Philosophical Foundations</span>
            <h2 className="serif" style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 300 }}>The Four Pillars</h2>
          </div>
          
          <div className="pillars-grid" style={{ display: 'grid', gap: '20px' }}>
            {[
              { title: 'Wabi-Sabi', desc: 'Beauty in imperfection.', color: theme.clay },
              { title: 'Ma (間)', desc: 'The conscious use of space.', color: theme.stone },
              { title: 'Shizen', desc: 'Naturalness without artifice.', color: theme.warm },
              { title: 'Kanso', desc: 'Simplicity via elimination.', color: theme.accent }
            ].map((pillar, index) => (
              <div key={pillar.title} className="hover-lift" style={{
                padding: '30px',
                backgroundColor: theme.white,
                borderRadius: '16px',
                border: `1px solid ${theme.stone}`,
                textAlign: 'center'
              }}>
                <h3 className="serif" style={{ fontSize: '24px', color: pillar.color, marginBottom: '10px' }}>{pillar.title}</h3>
                <p style={{ fontSize: '14px' }}>{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" style={{ padding: '100px 24px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span className="label">Artisanal Collections</span>
          <h2 className="serif" style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 300 }}>Functional Art</h2>
        </div>
        
        <div className="products-grid" style={{ display: 'grid', gap: '30px' }}>
          {[
            { title: 'Tea Ceremony', img: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800', desc: 'Chawan & Yunomi' },
            { title: 'Daily Tableware', img: 'https://plus.unsplash.com/premium_photo-1763369799249-8ff9473f0289?w=800&auto=format&fit=crop', desc: 'Plates & Bowls' },
            { title: 'Custom Works', img: 'https://images.unsplash.com/photo-1719464453353-abffa00097ab?w=800&auto=format&fit=crop', desc: 'Bespoke Pieces' }
          ].map((product) => (
            <div key={product.title} className="hover-lift">
              <div className="collection-shape" style={{ width: '100%', aspectRatio: '4/5', marginBottom: '20px' }}>
                <img src={product.img} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3 className="serif" style={{ fontSize: '24px', marginBottom: '5px' }}>{product.title}</h3>
              <p style={{ fontSize: '14px', color: theme.warm }}>{product.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Craft Section */}
      <section id="craft" style={{ padding: '100px 24px', backgroundColor: theme.white, position: 'relative' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="craft-grid" style={{ display: 'grid', gap: '60px' }}>
            <div>
              <span className="label">The Process</span>
              <h2 className="serif" style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 300, marginBottom: '20px' }}>From Earth to Art</h2>
              <p style={{ fontSize: '18px', lineHeight: '1.7' }}>Each piece undergoes 14 distinct stages over 3-4 weeks, honoring ancient techniques.</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {['Clay Preparation', 'Hand-throwing', 'Trimming', 'Bisque Firing', 'Glazing', 'High Fire'].map((step, index) => (
                <div key={step} style={{ padding: '15px', borderBottom: `1px solid ${theme.stone}`, display: 'flex', alignItems: 'center' }}>
                  <span style={{ 
                    width: '30px', height: '30px', borderRadius: '50%', background: theme.bone, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px', color: theme.clay, fontWeight: 'bold' 
                  }}>{index + 1}</span>
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: theme.ink, color: theme.bone, padding: '80px 24px' }}>
        <div className="footer-grid" style={{ display: 'grid', gap: '40px', maxWidth: '1400px', margin: '0 auto' }}>
          <div>
            <h2 className="serif" style={{ fontSize: '60px', margin: 0, lineHeight: 1 }}>Basho</h2>
            <p style={{ opacity: 0.7, marginTop: '20px' }}>Handcrafted pottery inspired by Japanese aesthetics.</p>
          </div>
          <div>
            <h4 className="label" style={{ color: theme.bone, opacity: 0.5 }}>Studio</h4>
            <p style={{ opacity: 0.8 }}>Surat, India<br/>By Appointment Only</p>
          </div>
          <div>
            <h4 className="label" style={{ color: theme.bone, opacity: 0.5 }}>Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['Workshops', 'Shop', 'Contact'].map(link => (
                <span key={link} style={{ cursor: 'pointer', opacity: 0.8 }}>{link}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
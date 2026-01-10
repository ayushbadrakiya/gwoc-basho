import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const theme = {
  ink: '#442D1C',
  bone: '#F4EHE4', // Slightly lighter for better contrast
  stone: '#8E5022',
  clay: '#652810',
  accent: '#C85428',
  warm: '#8E5022',
  white: '#FFFFFF',
  gold: '#C85428',
  shadow: 'rgba(68, 45, 28, 0.08)',
  glass: 'rgba(255, 255, 255, 0.6)'
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
          return rect.top <= 200 && rect.bottom >= 200;
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
    <div className="app-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Inter:wght@300;400;500&display=swap');
        
        :root {
          --ink: ${theme.ink};
          --bone: ${theme.bone};
          --stone: ${theme.stone};
        }

        * { box-sizing: border-box; }
        
        body { 
          margin: 0; 
          background-color: #F9F3E9;
        }

        .app-container {
          background-color: #F9F3E9;
          color: ${theme.ink};
          font-family: 'Inter', sans-serif;
          overflow-x: hidden;
          width: 100%;
          position: relative;
        }

        /* --- TYPOGRAPHY --- */
        .serif { font-family: 'Cormorant Garamond', serif; }
        
        h1, h2, h3 { margin: 0; }
        
        .label { 
          font-size: 10px; 
          letter-spacing: 0.25em; 
          text-transform: uppercase; 
          color: ${theme.stone}; 
          display: block; 
          margin-bottom: 24px;
          font-weight: 600;
          opacity: 0.8;
        }

        /* --- VISUAL EFFECTS --- */
        .noise-overlay {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          pointer-events: none;
          z-index: 999;
          opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        .organic-shape { 
          border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; 
          overflow: hidden; 
          transition: border-radius 3s ease;
          position: relative;
        }

        .collection-shape { 
          border-radius: 200px 200px 0 0; 
          overflow: hidden; 
          position: relative;
        }
        
        .hover-lift { 
          transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
          cursor: pointer;
        }
        .hover-lift:hover { 
          transform: translateY(-10px);
        }
        
        .fade-in { 
          animation: fadeInUp 1s ease-out forwards; 
          opacity: 0;
          transform: translateY(20px);
        }

        @keyframes fadeInUp {
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }

        .floating { animation: float 6s ease-in-out infinite; }

        /* --- GRID SYSTEMS --- */
        .products-grid { 
          display: grid; 
          grid-template-columns: repeat(3, 1fr); 
          gap: 40px; 
        }
        
        .pillars-grid { 
          display: grid; 
          grid-template-columns: repeat(4, 1fr); 
          gap: 20px; 
        }
        
        .story-grid { 
          display: grid; 
          grid-template-columns: 1fr 1fr; 
          gap: 80px; 
          align-items: center; 
        }
        
        .craft-grid { 
          display: grid; 
          grid-template-columns: 1fr 1fr; 
          gap: 80px; 
        }

        /* --- SECTIONS --- */
        .glass-card {
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          border-radius: 16px;
          padding: 40px 30px;
          text-align: center;
          transition: all 0.4s ease;
        }

        .glass-card:hover {
          background: rgba(255, 255, 255, 0.7);
          box-shadow: 0 15px 35px rgba(142, 80, 34, 0.1);
          border-color: ${theme.accent};
        }

        .step-item {
          padding: 25px;
          border-bottom: 1px solid rgba(142, 80, 34, 0.15);
          display: flex;
          align-items: center;
          transition: all 0.3s;
        }

        .step-item:hover {
          padding-left: 35px;
          background: rgba(255,255,255,0.3);
          border-bottom-color: ${theme.accent};
        }

        .step-number {
          width: 32px; height: 32px;
          border-radius: 50%;
          background: ${theme.ink};
          color: #FFF;
          display: flex; align-items: center; justifyContent: center;
          margin-right: 20px;
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          align-item:center;
          justify-content:center;
        }

        /* --- RESPONSIVE --- */
        @media (max-width: 1024px) {
          .hero-copy h1 { font-size: 80px !important; }
          .pillars-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .hero-section {
            flex-direction: column-reverse;
            padding-top: 100px !important;
            height: auto !important;
            text-align: center;
          }
          
          .hero-copy {
            max-width: 100% !important;
            margin-top: 40px;
            align-items: center;
            display: flex;
            flex-direction: column;
          }
          
          .hero-copy h1 { font-size: 56px !important; }
          
          .hero-visual {
            position: relative !important;
            width: 100% !important;
            height: 400px !important;
            right: auto !important;
            top: auto !important;
          }

          .story-grid, .craft-grid, .products-grid { 
            grid-template-columns: 1fr; 
            gap: 50px; 
          }
          
          .pillars-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="noise-overlay" />

      {/* Navigation (Placeholder Structure) */}
      <nav style={{ position: 'fixed', top: 0, width: '100%', padding: '20px 40px', zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center', mixBlendMode: 'multiply' }}>
        <div className="serif" style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '-1px' }}>BASHO</div>
        <div style={{ display: 'flex', gap: '30px', fontSize: '14px', fontWeight: '500' }}>
            {/* Nav items would go here */}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="hero-section" style={{
        height: '100vh',
        minHeight: '700px',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        padding: '0 8%',
        background: `radial-gradient(circle at 80% 20%, #fff7eb, #F9F3E9)`
      }}>
        
        {/* Text Content */}
        <div className="hero-copy" style={{
          zIndex: 10,
          maxWidth: '55%',
          position: 'relative'
        }}>
          <span className="label fade-in" style={{ animationDelay: '0.2s' }}>Handcrafted Pottery & Tableware</span>
          
          <h1 className="serif fade-in" style={{
            fontSize: '110px',
            lineHeight: '0.85',
            fontWeight: 300,
            marginBottom: '30px',
            animationDelay: '0.4s',
            color: theme.ink
          }}>
            Where Clay <br />
            Becomes <span style={{
              fontStyle: 'italic',
              background: `linear-gradient(90deg, ${theme.accent}, ${theme.warm})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              paddingRight: '10px' // Fix for italic clip
            }}>Poetry</span>
          </h1>

          <p className="fade-in" style={{
            fontSize: '1.1rem',
            color: theme.stone,
            maxWidth: '480px',
            lineHeight: '1.8',
            marginBottom: '50px',
            animationDelay: '0.6s'
          }}>
            Each piece is a haiku in clay—simple, profound, and filled with the quiet beauty of Japanese aesthetics.
          </p>
        </div>

        {/* Visual Content */}
        <div className="hero-visual floating" style={{
          position: 'absolute',
          right: '5%',
          top: '12%',
          width: '40vw',
          height: '75vh',
          zIndex: 5
        }}>
          <div className="organic-shape" style={{
            width: '100%',
            height: '100%',
            background: `url('https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80') center/cover`,
            boxShadow: '20px 40px 80px rgba(68, 45, 28, 0.12)',
            transform: `translateY(${scrollY * -0.05}px)`, // Parallax
            filter: 'sepia(20%)'
          }} />
          
          {/* Decorative Circle */}
          <div style={{
            position: 'absolute',
            bottom: '-40px',
            left: '-40px',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: theme.accent,
            zIndex: -1,
            opacity: 0.8
          }} />
        </div>
      </section>

      {/* Story Section */}
      <section id="story" style={{ padding: '140px 8%', maxWidth: '1600px', margin: '0 auto', position: 'relative' }}>
        <div className="story-grid">

          {/* Image */}
          <div style={{ position: 'relative', padding: '20px' }}>
             <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: `1px solid ${theme.stone}`, opacity: 0.2, borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%', transform: 'rotate(-5deg)' }}></div>
            <div className="organic-shape" style={{
              width: '100%',
              aspectRatio: '1/1',
              boxShadow: '0 30px 60px rgba(142, 127, 113, 0.2)'
            }}>
              <img
                src="https://images.unsplash.com/photo-1565191999001-551c187427bb?auto=format&fit=crop&w=1000&q=80"
                alt="Founder"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* Text */}
          <div style={{ paddingLeft: '20px' }}>
            <span className="label">The Origin Story</span>
            <h2 className="serif" style={{ fontSize: 'clamp(40px, 4vw, 64px)', lineHeight: 1.1, fontWeight: 300, marginBottom: '30px' }}>
              From Haiku <br/>to Handmade
            </h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '30px', lineHeight: '1.8', color: '#5A4A3E' }}>
              Basho was born from a single moment of clarity—reading Matsuo Bashō's poetry while feeling clay between fingers.
            </p>
            <blockquote style={{ 
                borderLeft: `2px solid ${theme.accent}`, 
                paddingLeft: '30px', 
                fontFamily: 'Cormorant Garamond',
                fontStyle: 'italic', 
                fontSize: '1.5rem', 
                color: theme.ink,
                margin: 0
            }}>
              "In the quiet of the studio, I listen to what the clay wants to become."
            </blockquote>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="philosophy" ref={philosophyRef} style={{ padding: '120px 8%', background: `linear-gradient(180deg, transparent, rgba(142,80,34,0.05))`, position: 'relative' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <span className="label">Philosophical Foundations</span>
            <h2 className="serif" style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 300 }}>The Four Pillars</h2>
          </div>

          <div className="pillars-grid">
            {[
              { title: 'Wabi-Sabi', desc: 'Beauty in imperfection.', color: theme.clay },
              { title: 'Ma (間)', desc: 'The conscious use of space.', color: theme.stone },
              { title: 'Shizen', desc: 'Naturalness without artifice.', color: theme.warm },
              { title: 'Kanso', desc: 'Simplicity via elimination.', color: theme.accent }
            ].map((pillar, index) => (
              <div key={pillar.title} className="glass-card hover-lift">
                <h3 className="serif" style={{ fontSize: '2rem', color: pillar.color, marginBottom: '15px' }}>{pillar.title}</h3>
                <div style={{ width: '40px', height: '1px', background: pillar.color, margin: '0 auto 15px auto', opacity: 0.5 }}></div>
                <p style={{ fontSize: '0.95rem', color: theme.ink, opacity: 0.8 }}>{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" style={{ padding: '120px 8%', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '60px' }}>
          <div>
            <span className="label">Artisanal Collections</span>
            <h2 className="serif" style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 300, lineHeight: 1 }}>Functional Art</h2>
          </div>
          <div style={{ display: 'none', borderBottom: `1px solid ${theme.ink}` }}>View All</div>
        </div>

        <div className="products-grid">
          {[
            { title: 'Tea Ceremony', img: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800', desc: 'Chawan & Yunomi' },
            { title: 'Daily Tableware', img: 'https://plus.unsplash.com/premium_photo-1763369799249-8ff9473f0289?w=800&auto=format&fit=crop', desc: 'Plates & Bowls' },
            { title: 'Custom Works', img: 'https://images.unsplash.com/photo-1719464453353-abffa00097ab?w=800&auto=format&fit=crop', desc: 'Bespoke Pieces' }
          ].map((product) => (
            <div key={product.title} className="hover-lift" style={{ position: 'relative' }}>
              <div className="collection-shape" style={{ width: '100%', aspectRatio: '3/4', marginBottom: '25px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.03)', zIndex: 1 }}></div>
                <img src={product.img} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3 className="serif" style={{ fontSize: '1.8rem', marginBottom: '8px', fontWeight: 400 }}>{product.title}</h3>
              <p style={{ fontSize: '0.9rem', color: theme.warm, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{product.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Craft Section */}
      <section id="craft" style={{ padding: '120px 8%', backgroundColor: '#F2ECE4', position: 'relative', marginTop: '80px' }}>
         <div className="organic-shape" style={{ position: 'absolute', top: '-50px', left: 0, width: '100%', height: '100px', background: '#F2ECE4', borderRadius: '50% 50% 0 0', zIndex: 0 }}></div>
        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="craft-grid">
            <div style={{ position: 'sticky', top: '40px', height: 'fit-content' }}>
              <span className="label">The Process</span>
              <h2 className="serif" style={{ fontSize: 'clamp(40px, 4vw, 64px)', fontWeight: 300, marginBottom: '30px' }}>From Earth<br/>to Art</h2>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', maxWidth: '400px' }}>Each piece undergoes 14 distinct stages over 3-4 weeks, honoring ancient techniques that celebrate the raw nature of the material.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {['Clay Preparation', 'Hand-throwing', 'Trimming', 'Bisque Firing', 'Glazing', 'High Fire'].map((step, index) => (
                <div key={step} className="step-item">
                  <span className="step-number">{index + 1}</span>
                  <span className="serif" style={{ fontSize: '1.5rem', color: theme.ink }}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer Placeholder (Structure only) */}

      
    </div>
  );
};

export default App;
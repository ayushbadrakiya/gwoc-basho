import React, { useState, useEffect, useRef } from 'react';

const theme = {
  ink: '#1A1A1A',
  bone: '#F9F8F6',
  stone: '#E2DFDA',
  clay: '#C5BAAF',
  accent: '#5E5248',
  warm: '#8E7F71',
  white: '#FFFFFF',
  gold: '#BFAF8F',
  shadow: 'rgba(26, 26, 26, 0.08)'
};

const App = () => {
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const philosophyRef = useRef(null);
  
  // Enhanced scroll handling with parallax
  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollY(position);
      
      // Update active section for navigation
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

  // Mouse parallax effect
  const parallaxStyle = (intensity = 0.02) => ({
    transform: `translate(${mousePos.x * intensity}px, ${mousePos.y * intensity}px)`,
    transition: 'transform 0.3s ease-out'
  });

  const sectionVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.2, 1, 0.3, 1]
      }
    }
  };

  return (
    <div style={{ 
      backgroundColor: theme.bone, 
      color: theme.ink, 
      fontFamily: "'Inter', sans-serif",
      overflowX: 'hidden'
    }}>
      
      {/* Enhanced Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap');
        
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
        p { 
          line-height: 1.8; 
          font-weight: 300;
          font-size: 16px;
        }
        .quote-line {
          width: 60px;
          height: 1px;
          background: ${theme.warm};
          margin: 30px auto;
          opacity: 0.3;
        }
        .fade-in {
          animation: fadeIn 1.2s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .texture-overlay {
          background-image: url('data:image/svg+xml,<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noise)" opacity="0.03"/></svg>');
          pointer-events: none;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1;
        }
      `}</style>

      {/* Navigation with active states */}
      <nav style={{ 
        position: 'fixed', 
        top: 0, 
        width: '100%', 
        zIndex: 1000,
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '30px 60px',
        backgroundColor: 'rgba(249, 248, 246, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${theme.stone}`,
        marginTop:`40px`
      }}>
        <div className="serif" style={{ fontSize: '28px', letterSpacing: '3px' }}>BASHO</div>
        <div style={{ display: 'flex', gap: '50px', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase' }}>
          {['Story', 'Philosophy', 'Collections', 'Craft', 'Workshops'].map((item) => (
            <a 
              key={item}
              href={`#${item.toLowerCase()}`}
              style={{ 
                textDecoration: 'none',
                color: activeSection === item.toLowerCase() ? theme.accent : theme.ink,
                paddingBottom: '5px',
                borderBottom: activeSection === item.toLowerCase() ? `1px solid ${theme.accent}` : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              {item}
            </a>
          ))}
        </div>
      </nav>

      {/* Enhanced Hero Section with Parallax */}
      <section id="hero" style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="texture-overlay" />
        <div style={{ 
          paddingLeft: '10%', 
          zIndex: 2, 
          maxWidth: '700px',
          position: 'relative'
        }}>
          <span className="label fade-in" style={{ animationDelay: '0.2s' }}>Handcrafted Pottery & Tableware</span>
          <h1 className="serif fade-in" style={{ 
            fontSize: 'clamp(60px, 8vw, 120px)', 
            lineHeight: '0.7', 
            fontWeight: 300, 
            marginBottom: '40px',
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
            fontSize: '20px', 
            color: theme.warm, 
            maxWidth: '500px',
            marginBottom: '50px',
            animationDelay: '0.6s'
          }}>
            Each piece is a haiku in clay—simple, profound, and filled with the quiet beauty of Japanese aesthetics.
          </p>
          <div style={{ marginTop: '50px', display: 'flex', gap: '20px' }}>
            <button style={{ 
              padding: '18px 40px', 
              borderRadius: '100px', 
              border: `1px solid ${theme.ink}`, 
              backgroundColor: theme.ink, 
              color: theme.bone, 
              cursor: 'pointer',
              fontSize: '14px',
              letterSpacing: '1px',
              transition: 'all 0.3s ease'
            }}>Explore Collections</button>
            <button style={{ 
              padding: '18px 40px', 
              borderRadius: '100px', 
              border: `1px solid ${theme.ink}`, 
              backgroundColor: 'transparent', 
              color: theme.ink, 
              cursor: 'pointer',
              fontSize: '14px',
              letterSpacing: '1px',
              transition: 'all 0.3s ease'
            }}>Book a Workshop</button>
          </div>
        </div>
        
        {/* Multiple floating pottery elements */}
        <div style={{
          position: 'absolute',
          right: '5%',
          top: '15%',
          width: '40vw',
          height: '70vh'
        }}>
          <div className="organic-shape" style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(45deg, #E2DFDA, #C5BAAF)',
            transform: `translateY(${scrollY * -0.05}px)`,
            boxShadow: '0 40px 80px rgba(142, 127, 113, 0.2)'
          }}>
            <img 
              src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80" 
              alt="Basho pottery collection - handmade ceramic bowls and plates"
              style={{ width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'multiply' }}
            />
          </div>
          
          {/* Floating decorative elements */}
          <div style={{
            position: 'absolute',
            left: '-50px',
            bottom: '100px',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${theme.gold}20, transparent 70%)`,
            animation: 'float 6s ease-in-out infinite'
          }} />
        </div>
      </section>

      {/* Enhanced About Section with Founder Story */}
      <section id="story" style={{
        padding: '140px 24px',
        maxWidth: '1400px',
        margin: '0 auto',
        position: 'relative'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '80px',
          alignItems: 'center'
        }}>
          <div style={{ position: 'relative' }}>
            <div className="organic-shape" style={{
              width: '100%',
              aspectRatio: '1/1',
              background: `linear-gradient(135deg, ${theme.stone}, ${theme.clay})`,
              boxShadow: '0 30px 60px rgba(142, 127, 113, 0.15)'
            }}>
              <img 
                src="https://images.unsplash.com/photo-1565191999001-551c187427bb?auto=format&fit=crop&w=1000&q=80" 
                alt="Shivangi, founder of Basho pottery, at work in her studio"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{
              position: 'absolute',
              bottom: '-40px',
              right: '-40px',
              width: '200px',
              height: '200px',
              border: `1px solid ${theme.warm}30`,
              borderRadius: '40% 60% 60% 40% / 50% 30% 70% 50%',
              zIndex: -1
            }} />
          </div>
          
          <div>
            <span className="label">The Origin Story</span>
            <h2 className="serif" style={{ 
              fontSize: 'clamp(40px, 5vw, 64px)', 
              fontWeight: 300, 
              marginBottom: '30px',
              lineHeight: '1.1'
            }}>
              From Haiku to Handmade
            </h2>
            <p style={{ fontSize: '18px', marginBottom: '25px' }}>
              Basho was born from a single moment of clarity—reading Matsuo Bashō's poetry while feeling clay between fingers. 
              Founder Shivangi realized that pottery, like haiku, finds beauty in simplicity and truth in imperfection.
            </p>
            <p style={{ marginBottom: '25px' }}>
              With a background in Japanese literature and years of ceramic apprenticeship in Kyoto, Shivangi combines 
              traditional techniques with contemporary design. Each piece tells a story of cultural dialogue between 
              Indian craftsmanship and Japanese minimalism.
            </p>
            <blockquote style={{
              borderLeft: `3px solid ${theme.gold}`,
              paddingLeft: '25px',
              margin: '40px 0',
              fontStyle: 'italic',
              fontSize: '20px',
              color: theme.accent
            }}>
              "In the quiet of the studio, I listen to what the clay wants to become. 
              It's not about forcing form, but discovering it."
            </blockquote>
          </div>
        </div>
      </section>

      {/* Japanese Philosophy Deep Dive */}
      <section id="philosophy" ref={philosophyRef} style={{
        padding: '140px 24px',
        background: `linear-gradient(135deg, ${theme.stone}20, ${theme.bone})`,
        position: 'relative'
      }}>
        <div className="texture-overlay" />
        <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <span className="label">Philosophical Foundations</span>
            <h2 className="serif" style={{ 
              fontSize: 'clamp(40px, 5vw, 64px)', 
              fontWeight: 300, 
              marginBottom: '20px'
            }}>
              The Four Pillars of Our Craft
            </h2>
            <p style={{ 
              fontSize: '18px', 
              maxWidth: '700px', 
              margin: '0 auto',
              color: theme.warm 
            }}>
              Inspired by Japanese aesthetics that find perfection in imperfection, 
              and beauty in natural simplicity.
            </p>
          </div>
          
          <div style={{
            display: 'flex',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '10px',
            marginTop: '60px'
          }}>
            {[
              {
                title: 'Wabi-Sabi',
                desc: 'The art of finding beauty in imperfection, asymmetry, and natural patina.',
                color: theme.clay
              },
              {
                title: 'Ma (間)',
                desc: 'The conscious use of space and silence—the pause that gives meaning to form.',
                color: theme.stone
              },
              {
                title: 'Shizen (自然)',
                desc: 'Naturalness—letting materials speak for themselves without artifice.',
                color: theme.warm
              },
              {
                title: 'Kanso (簡素)',
                desc: 'Simplicity achieved through elimination of the non-essential.',
                color: theme.accent
              }
            ].map((pillar, index) => (
              <div key={pillar.title} className="hover-lift" style={{
                padding: '20px',
                backgroundColor: theme.white,
                borderRadius: '20px',
                border: `1px solid ${theme.stone}`,
                transitionDelay: `${index * 0.1}s`
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: `${pillar.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '25px'
                }}>
                  <span className="serif" style={{ fontSize: '24px', color: pillar.color }}>
                    {index + 1}
                  </span>
                </div>
                <h3 className="serif" style={{ fontSize: '28px', marginBottom: '15px' }}>
                  {pillar.title}
                </h3>
                <p style={{ fontSize: '15px', lineHeight: '1.7' }}>{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Products Gallery */}
      <section id="products" style={{
        padding: '140px 24px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <span className="label">Artisanal Collections</span>
          <h2 className="serif" style={{ 
            fontSize: 'clamp(40px, 5vw, 64px)', 
            fontWeight: 300,
            marginBottom: '20px'
          }}>
            Functional Art for Daily Rituals
          </h2>
          <p style={{ 
            fontSize: '18px', 
            maxWidth: '600px', 
            margin: '0 auto',
            color: theme.warm
          }}>
            Each collection is designed to transform ordinary moments into mindful experiences.
          </p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '50px',
          marginBottom: '80px'
        }}>
          {[
            {
              title: 'Tea Ceremony Series',
              desc: 'Chawan, yunomi, and hōhin for the perfect pour',
              img: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800',
              features: ['Hand-thrown', 'Celadon Glaze', 'Set of 3']
            },
            {
              title: 'Daily Tableware',
              desc: 'Bowls, plates, and mugs for everyday nourishment',
              img: 'https://plus.unsplash.com/premium_photo-1763369799249-8ff9473f0289?w=800&auto=format&fit=crop',
              features: ['Microwave Safe', 'Dishwasher Safe', 'Stackable']
            },
            {
              title: 'Custom Commissions',
              desc: 'Bespoke pieces for your unique space',
              img: 'https://images.unsplash.com/photo-1719464453353-abffa00097ab?w=800&auto=format&fit=crop',
              features: ['Personalized', 'Collaborative', 'Heirloom Quality']
            }
          ].map((product, index) => (
            <div key={product.title} className="hover-lift" style={{
              position: 'relative'
            }}>
              <div className="collection-shape" style={{
                width: '100%',
                aspectRatio: '4/5',
                marginBottom: '30px',
                overflow: 'hidden'
              }}>
                <img 
                  src={product.img} 
                  alt={`${product.title} - ${product.desc}`}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    transition: 'transform 0.8s ease'
                  }}
                />
              </div>
              <div style={{ textAlign: 'center' }}>
                <h3 className="serif" style={{ 
                  fontSize: '28px', 
                  marginBottom: '10px',
                  position: 'relative',
                  display: 'inline-block'
                }}>
                  {product.title}
                  <span style={{
                    position: 'absolute',
                    bottom: '-5px',
                    left: '0',
                    width: '40px',
                    height: '1px',
                    backgroundColor: theme.gold,
                    transition: 'width 0.3s ease'
                  }} />
                </h3>
                <p style={{ 
                  fontSize: '14px', 
                  color: theme.warm,
                  marginBottom: '20px'
                }}>
                  {product.desc}
                </p>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center',
                  gap: '15px',
                  fontSize: '12px'
                }}>
                  {product.features.map(feature => (
                    <span key={feature} style={{
                      padding: '5px 12px',
                      border: `1px solid ${theme.stone}`,
                      borderRadius: '20px',
                      color: theme.warm
                    }}>
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed Artisanship & Care Section */}
      <section id="craft" style={{
        padding: '140px 24px',
        backgroundColor: theme.white,
        position: 'relative'
      }}>
        <div className="texture-overlay" style={{ opacity: 0.02 }} />
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '80px',
            alignItems: 'start'
          }}>
            <div>
              <span className="label">The Making Of</span>
              <h2 className="serif" style={{ 
                fontSize: 'clamp(40px, 5vw, 56px)', 
                fontWeight: 300,
                marginBottom: '30px'
              }}>
                From Earth to Art
              </h2>
              <p style={{ fontSize: '18px', marginBottom: '25px' }}>
                Our process honors both ancient techniques and modern material science. 
                Each piece undergoes 14 distinct stages over 3-4 weeks.
              </p>
              
              <div style={{ marginTop: '50px' }}>
                <h3 className="serif" style={{ fontSize: '22px', marginBottom: '20px' }}>
                  The Process
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {[
                    'Clay Preparation & Wedging',
                    'Hand-throwing or Slab Building',
                    'Leather-hard Trimming',
                    'Bisque Firing (900°C)',
                    'Glaze Application',
                    'High Fire (1280°C)',
                    'Slow Cooling & Inspection'
                  ].map((step, index) => (
                    <div key={step} style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '15px 0',
                      borderBottom: `1px solid ${theme.stone}`,
                      opacity: 0.8 + (index * 0.05)
                    }}>
                      <span style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: theme.stone,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '15px',
                        fontSize: '12px',
                        color: theme.accent
                      }}>
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <div style={{
                padding: '50px',
                backgroundColor: theme.bone,
                borderRadius: '20px',
                border: `1px solid ${theme.stone}`
              }}>
                <h3 className="serif" style={{ 
                  fontSize: '32px', 
                  marginBottom: '40px',
                  textAlign: 'center'
                }}>
                  Care & Longevity
                </h3>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '30px'
                }}>
                  {[
                    {
                      icon: '🥣',
                      title: 'Food Safe',
                      desc: 'All glazes are lead-free, cadmium-free, and non-toxic. Certified for food contact.'
                    },
                    {
                      icon: '🔥',
                      title: 'Thermal Safe',
                      desc: 'Withstands temperatures from -10°C to 300°C. Avoid extreme thermal shocks.'
                    },
                    {
                      icon: '🧽',
                      title: 'Dishwasher Safe',
                      desc: 'Top-rack recommended. Hand washing preserves glaze luster longer.'
                    },
                    {
                      icon: '⏳',
                      title: 'Longevity',
                      desc: 'Properly cared for, our stoneware can last generations. Avoid abrasive cleaners.'
                    }
                  ].map((item) => (
                    <div key={item.title} style={{ textAlign: 'center' }}>
                      <div style={{
                        fontSize: '32px',
                        marginBottom: '15px',
                        opacity: 0.7
                      }}>
                        {item.icon}
                      </div>
                      <h4 className="serif" style={{ 
                        fontSize: '18px', 
                        marginBottom: '10px',
                        color: theme.accent
                      }}>
                        {item.title}
                      </h4>
                      <p style={{ 
                        fontSize: '13px', 
                        lineHeight: '1.6',
                        color: theme.warm
                      }}>
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
                
                <div style={{ 
                  marginTop: '40px', 
                  padding: '25px',
                  backgroundColor: `${theme.gold}10`,
                  borderRadius: '12px',
                  border: `1px solid ${theme.gold}20`
                }}>
                  <h4 className="serif" style={{ 
                    fontSize: '16px', 
                    marginBottom: '10px',
                    color: theme.accent
                  }}>
                    Pro Tip
                  </h4>
                  <p style={{ fontSize: '14px', margin: 0 }}>
                    For stubborn stains, soak in warm water with baking soda overnight. 
                    Avoid metal utensils to preserve the glaze surface.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer style={{ 
        backgroundColor: theme.ink, 
        color: theme.bone, 
        padding: '120px 60px 60px',
        position: 'relative'
      }}>
        <div className="texture-overlay" style={{ opacity: 0.05 }} />
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr 1fr',
          gap: '60px',
          maxWidth: '1400px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 2
        }}>
          <div>
            <h2 className="serif" style={{ 
              fontSize: '72px', 
              fontWeight: 300, 
              margin: '0 0 20px 0',
              lineHeight: '0.9'
            }}>
              Basho
            </h2>
            <p style={{ 
              opacity: 0.6, 
              fontSize: '16px',
              maxWidth: '400px'
            }}>
              Handcrafted pottery inspired by Japanese aesthetics. 
              Creating objects that honor both function and poetry.
            </p>
          </div>
          
          <div>
            <h4 className="label" style={{ color: theme.bone, opacity: 0.4 }}>Studio</h4>
            <p style={{ margin: '15px 0', opacity: 0.7 }}>Mumbai, India</p>
            <p style={{ margin: '15px 0', opacity: 0.7 }}>By appointment only</p>
            <a href="https://instagram.com/bashobyyshivangi" style={{
              color: theme.gold,
              textDecoration: 'none',
              fontSize: '14px',
              display: 'inline-block',
              marginTop: '20px'
            }}>
              @bashobyyshivangi →
            </a>
          </div>
          
          <div>
            <h4 className="label" style={{ color: theme.bone, opacity: 0.4 }}>Explore</h4>
            {['Workshops', 'Corporate Gifting', 'Collaborations', 'Visit Us'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                style={{
                  display: 'block',
                  color: theme.bone,
                  textDecoration: 'none',
                  padding: '8px 0',
                  opacity: 0.7,
                  transition: 'all 0.3s ease',
                  fontSize: '15px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.opacity = 1;
                  e.target.style.paddingLeft = '10px';
                }}
                onMouseLeave={(e) => {
                  e.target.style.opacity = 0.7;
                  e.target.style.paddingLeft = '0';
                }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
        
        <div style={{ 
          marginTop: '80px', 
          paddingTop: '40px', 
          borderTop: `1px solid ${theme.accent}20`,
          textAlign: 'center',
          opacity: 0.4,
          fontSize: '13px'
        }}>
          <p>© {new Date().getFullYear()} Basho by Shivangi. All pieces are handmade, therefore unique.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
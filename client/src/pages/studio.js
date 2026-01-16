import React from 'react';
import {
  MapPin, Clock, Users, Award, Heart, PenTool
} from 'lucide-react';

// --- THEME CONFIGURATION ---
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

// --- IMAGE CONFIGURATION ---
const SHIVANGI_IMAGE_URL = "/shivangi.png";

// --- REUSABLE COMPONENTS ---
const SectionHeading = ({ title, subtitle }) => (
  <div className="section-header">
    <span className="section-subtitle">{subtitle}</span>
    <h2 className="section-title">{title}</h2>
    <div className="title-underline"></div>
  </div>
);

const FeatureCard = ({ icon, title, description, index }) => (
  <div className="feature-card" style={{ animationDelay: `${index * 0.1}s` }}>
    <div className="icon-wrapper">{icon}</div>
    <h3 className="card-title">{title}</h3>
    <p className="card-desc">{description}</p>
  </div>
);

// --- MAIN COMPONENT ---
const StudioPage = () => {

  // Founder Information
  const founderInfo = {
    name: "Shivangi Patel",
    title: "Founder & Ceramic Artist",
    story: [
      "OUR STORY",
      "Hi, I'm Shivangi — the hands and heart behind Basho.",
      "Basho, a Japanese word that means A Place. But for me, it's my happy place, where every moment with clay is cherished. Each piece at Basho is crafted with love and individuality, making it truly one of a kind.",
      "Basho was also the name of a legendary Japanese poet known for haiku. Haiku are short, flowing verses that capture life's moments.",
      "Like poetry, pottery at Basho flows with rhythm and soul. So come, discover Basho and create your own poetry in clay."
    ]
  };

  // Studio Facilities
  const facilities = [
    { icon: "⚙️", title: "Professional Wheels", description: "10 Shimpo Whisper wheels for smooth, silent throwing sessions. Perfect for beginners and experts alike." },
    { icon: "🔥", title: "Studio Kilns", description: "Electric and gas kilns for bisque and glaze firing. Temperature control up to 1300°C." },
    { icon: "🎨", title: "Glazing Studio", description: "50+ glaze options, mixing station, and spray booth for custom finishes and effects." },
    { icon: "🖐️", title: "Hand-Building Area", description: "Large tables, slab rollers, and extruders for sculptural and functional pottery." },
    { icon: "📚", title: "Learning Library", description: "Collection of books, technique guides, and inspirational resources for all skill levels." },
    { icon: "☕", title: "Community Space", description: "Comfortable lounge area with tea station for breaks, conversations, and creative exchanges." }
  ];

  // Studio Hours
  const hours = [
    { day: "Monday - Thursday", time: "10:00 AM - 8:00 PM" },
    { day: "Friday - Saturday", time: "10:00 AM - 9:00 PM" },
    { day: "Sunday", time: "11:00 AM - 6:00 PM" }
  ];

  return (
    <div className="studio-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Poppins:wght@300;400;500;600&display=swap');

        .studio-page {
          background-color: ${palette.lightSand};
          color: ${palette.deep};
          font-family: 'Poppins', sans-serif;
          padding-bottom: 80px;
        }

        /* --- TYPOGRAPHY --- */
        h1, h2, h3 { font-family: 'Playfair Display', serif; }
        
        .section-header { text-align: center; margin-bottom: 60px; animation: fadeIn 1s ease; }
        .section-subtitle {
            font-size: 0.85rem; letter-spacing: 2px; text-transform: uppercase;
            color: ${palette.flame}; font-weight: 600; display: block; margin-bottom: 10px;
        }
        .section-title { font-size: 2.8rem; margin: 0; color: ${palette.deep}; }
        .title-underline { width: 60px; height: 3px; background: ${palette.copper}; margin: 20px auto 0; }

        /* --- HERO SECTION --- */
        .hero-section {
            padding: 100px 20px 80px;
            text-align: center;
            background: radial-gradient(circle at center, #FFF 0%, ${palette.lightSand} 100%);
            margin-bottom: 60px;
        }
        .hero-title { font-size: 4.5rem; margin-bottom: 20px; line-height: 1; }
        .hero-desc { font-size: 1.2rem; color: ${palette.ember}; max-width: 600px; margin: 0 auto 40px; opacity: 0.8; }
        
        .hero-tags { display: flex; justify-content: center; gap: 25px; flex-wrap: wrap; }
        .tag { display: flex; alignItems: center; gap: 8px; font-size: 0.95rem; color: ${palette.copper}; font-weight: 500; }

        /* --- GRID LAYOUTS --- */
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        
        .grid-split { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; margin-bottom: 100px; }
        .grid-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 30px; }

        /* --- CARDS & BOXES --- */
        .info-box {
            background: ${palette.white};
            padding: 30px;
            border-radius: 16px;
            border: 1px solid rgba(142, 80, 34, 0.1);
            box-shadow: 0 10px 30px rgba(68, 45, 28, 0.05);
            margin-bottom: 20px;
            transition: transform 0.3s;
        }
        .info-box:hover { transform: translateY(-5px); }

        .feature-card {
            background: ${palette.white};
            padding: 30px;
            border-radius: 16px;
            border: 1px solid rgba(142, 80, 34, 0.1);
            transition: all 0.3s ease;
            box-shadow: 0 5px 15px rgba(68, 45, 28, 0.03);
            animation: slideUp 0.8s ease backwards;
        }
        .feature-card:hover { transform: translateY(-8px); box-shadow: 0 15px 35px rgba(68, 45, 28, 0.1); border-color: ${palette.sand}; }
        
        .icon-wrapper { font-size: 2rem; margin-bottom: 15px; }
        .card-title { font-size: 1.3rem; margin-bottom: 10px; color: ${palette.deep}; }
        .card-desc { font-size: 0.95rem; line-height: 1.6; color: #666; }

        /* --- FOUNDER STYLING (VERTICAL RECTANGLE) --- */
        .founder-img-container {
            position: relative;
            width: 300px; /* Changed width */
            height: 450px; /* Changed height for vertical rectangle */
            margin: 0 auto;
        }
        .founder-img {
            width: 100%; height: 100%; object-fit: cover;
            border-radius: 24px; /* Changed from 50% to rounded corners */
            border: 8px solid ${palette.white};
            box-shadow: 0 20px 50px rgba(68, 45, 28, 0.15);
            position: relative; z-index: 2;
        }
        // .founder-rect-bg { /* Renamed from founder-circle-bg */
        //     position: absolute; top: -20px; right: -20px;
        //     width: 100%; height: 100%; 
        //     border-radius: 28px; /* Matched radius */
        //     border: 2px solid ${palette.copper}; opacity: 0.3; z-index: 1;
        // }

        .story-para { margin-bottom: 15px; line-height: 1.8; color: #555; }
        .story-highlight { font-size: 1.4rem; color: ${palette.flame}; font-family: 'Playfair Display', serif; margin-bottom: 15px; display: block; }

        /* --- MAP CONTAINER --- */
        .map-wrapper {
            height: 500px;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            border: 4px solid ${palette.white};
        }

        /* --- BUTTONS --- */
        .cta-box {
            background: linear-gradient(135deg, ${palette.flame}, ${palette.ember});
            border-radius: 20px;
            padding: 50px;
            text-align: center;
            color: white;
            margin-top: 60px;
            box-shadow: 0 20px 40px rgba(200, 84, 40, 0.2);
        }
        .btn-white {
            background: white; color: ${palette.flame};
            padding: 12px 30px; border-radius: 30px; font-weight: 700;
            text-decoration: none; display: inline-block; margin: 10px;
            transition: transform 0.2s;
        }
        .btn-white:hover { transform: scale(1.05); }
        
        .btn-outline {
            border: 2px solid white; color: white;
            padding: 10px 28px; border-radius: 30px; font-weight: 600;
            text-decoration: none; display: inline-block; margin: 10px;
            transition: background 0.2s;
        }
        .btn-outline:hover { background: rgba(255,255,255,0.1); }

        /* --- ANIMATIONS --- */
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

        /* --- RESPONSIVE --- */
        @media (max-width: 900px) {
            .grid-split { grid-template-columns: 1fr; gap: 40px; }
            .hero-title { font-size: 3rem; }
            .map-wrapper { height: 350px; }
        }
      `}</style>

      {/* --- HERO --- */}
      <section className="hero-section">
        <div className="container">
          <h1 className="hero-title">Basho<span style={{color: palette.flame}}>.</span> Studio</h1>
          <p className="hero-desc">Where clay meets poetry. A place for mindful creation in Surat.</p>
          
          <div className="hero-tags">
            <div className="tag"><Heart size={18} /> Handmade with love</div>
            <div className="tag"><PenTool size={18} /> One-of-a-kind pieces</div>
            <div className="tag"><Users size={18} /> Welcoming community</div>
          </div>
        </div>
      </section>

      <div className="container">
        
        {/* --- LOCATION SECTION --- */}
        <section id="location">
          <SectionHeading title="Visit Our Studio" subtitle="Location" />
          
          <div className="grid-split">
            <div className="space-y-6">
              
              {/* Address */}
              <div className="info-box" style={{borderLeft: `4px solid ${palette.flame}`}}>
                <h3 className="card-title flex items-center gap-2">
                  <MapPin size={24} color={palette.flame} style={{marginRight:'10px'}}/> Studio Address
                </h3>
                <div style={{color: '#666', lineHeight: '1.6'}}>
                  <p className="font-bold" style={{color: palette.deep, fontSize:'1.1rem'}}>Basho Studio</p>
                  <p>311, Silent Zone, Gavier,  Dumas Road,</p>
                  <p>Surat, Gujarat 395007</p>
                  
                  <p>🚗 Ample parking available</p>
                </div>
              </div>

              {/* Hours */}
              <div className="info-box">
                <h3 className="card-title flex items-center gap-2">
                  <Clock size={24} color={palette.flame} style={{marginRight:'10px'}}/> Opening Hours
                </h3>
                <div>
                  {hours.map((hour, index) => (
                    <div key={index} style={{display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom: index < 2 ? `1px solid ${palette.sand}` : 'none'}}>
                      <span style={{fontWeight:'500'}}>{hour.day}</span>
                      <span style={{color: palette.flame}}>{hour.time}</span>
                    </div>
                  ))}
                </div>
                <p style={{fontSize:'0.85rem', color:'#999', marginTop:'15px', fontStyle:'italic'}}>
                  * Private sessions available by appointment
                </p>
              </div>
            </div>

            {/* Map */}
            <div className="map-wrapper">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3721.5628755582397!2d72.72141457525935!3d21.12998658054482!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjHCsDA3JzQ4LjAiTiA3MsKwNDMnMjYuNCJF!5e0!3m2!1sen!2sin!4v1767188687433!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Basho Studio Location"
              />
            </div>
          </div>
        </section>

        {/* --- FOUNDER SECTION --- */}
        <section id="founder" style={{marginTop: '120px'}}>
          <SectionHeading title="Our Story" subtitle="The Artist" />
          
          <div className="grid-split">
            {/* Text Side */}
            <div style={{ order: 1 }}>
                <h3 style={{ fontSize: '2rem', marginBottom: '5px', color: palette.deep }}>{founderInfo.name}</h3>
                <p style={{ color: palette.copper, fontWeight: '600', marginBottom: '30px', letterSpacing: '1px' }}>{founderInfo.title}</p>
                
                {founderInfo.story.map((para, index) => {
                    if (index === 0) return null;
                    return (
                        <p key={index} className={index === 3 ? "story-highlight" : "story-para"}>
                            {para}
                        </p>
                    )
                })}

                <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
                    <div className="tag"><Award size={20} /> Japanese Techniques</div>
                    <div className="tag"><Users size={20} /> 100+ Students</div>
                </div>
            </div>

            {/* Image Side (Vertical Rectangle) */}
            <div style={{ order: 0 }}>
                <div className="founder-img-container">
                    <div className="founder-rect-bg"></div>
                    <img 
                        src={"https://res.cloudinary.com/dnbplr9pw/image/upload/v1768483667/shivangi_bkqdeb.png"} 
                        alt="Shivangi Patel" 
                        className="founder-img"
                    />
                </div>
            </div>
          </div>
        </section>

        {/* --- FACILITIES SECTION --- */}
        <section id="facilities" style={{marginTop: '120px'}}>
          <SectionHeading title="Studio Facilities" subtitle="Equipment" />
          
          <div className="grid-cards">
            {facilities.map((facility, index) => (
              <FeatureCard key={index} index={index} {...facility} />
            ))}
          </div>

          <div className="cta-box">
            <h3 style={{ fontSize: '2rem', marginBottom: '15px' }}>Experience Basho for Yourself</h3>
            <p style={{ opacity: 0.9, fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 30px' }}>
              Join us for a studio tour and see where poetry takes form in clay.
            </p>
            <div>
              <a href="mailto:hello@basho.in" className="btn-white">Schedule a Visit</a>
              <a href="tel:+919876543210" className="btn-outline">Call: +91 98765 43210</a>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default StudioPage;
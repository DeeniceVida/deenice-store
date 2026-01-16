import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, Sparkles, Monitor, Cpu, Globe, Zap, CircuitBoard } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      // Calculate mouse position relative to center of screen (-1 to 1)
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });

      // Update CSS variables for high-performance animation
      heroRef.current.style.setProperty('--mouse-x', x.toString());
      heroRef.current.style.setProperty('--mouse-y', y.toString());
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  const parallaxStyle = (depth: number) => ({
    transform: `translate(${mousePos.x * depth * 20}px, ${mousePos.y * depth * 20}px)`,
    transition: 'transform 0.1s ease-out'
  });

  return (
    <section
      ref={heroRef}
      className="hero-container"
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: 'var(--spacing-3xl) var(--spacing-lg)',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        background: 'radial-gradient(circle at 50% 50%, #fff, var(--color-background))'
      }}
    >
      {/* Animated Background Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle at 1px 1px, var(--color-primary-dark) 1px, transparent 0)',
          backgroundSize: '40px 40px',
          opacity: 0.1,
          transform: `translate(${mousePos.x * -10}px, ${mousePos.y * -10}px)`,
          zIndex: 0
        }}
      />

      {/* Dynamic Blobs */}
      <div
        className="hero-blob"
        style={{
          position: 'absolute',
          top: '10%',
          right: '-5%',
          width: '600px',
          height: '600px',
          backgroundColor: 'rgba(179, 200, 239, 0.3)',
          filter: 'blur(80px)',
          zIndex: 0,
          animation: 'float 8s ease-in-out infinite alternate',
          ...parallaxStyle(-2)
        }}
      />
      <div
        className="hero-blob"
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '-5%',
          width: '500px',
          height: '500px',
          backgroundColor: 'rgba(227, 247, 126, 0.3)',
          filter: 'blur(80px)',
          zIndex: 0,
          animation: 'float 10s ease-in-out infinite alternate-reverse',
          ...parallaxStyle(2)
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 10, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-3xl)', alignItems: 'center' }}>

        {/* Left Content */}
        <div style={{ maxWidth: '600px' }}>
          <div className="badge-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '50px', marginBottom: '2rem', background: 'white' }}>
            <Sparkles size={16} color="var(--color-accent-hover)" fill="var(--color-accent-hover)" />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', color: 'var(--color-text-secondary)' }}>VERIFIED TECH CURATION HUB</span>
          </div>

          <h1 style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: 900, lineHeight: 1, marginBottom: '2rem', letterSpacing: '-0.02em', color: 'var(--color-text-primary)' }}>
            Curated <span style={{ fontFamily: 'serif', fontStyle: 'italic', color: 'var(--color-primary-dark)' }}>Desk</span> <br />
            Essentials <span style={{ position: 'relative', display: 'inline-block' }}>
              <span style={{ position: 'relative', zIndex: 2 }}>Only</span>
              <span style={{ position: 'absolute', bottom: '10px', left: 0, width: '100%', height: '15px', background: 'var(--color-accent)', zIndex: 1, transform: 'rotate(-2deg)' }} />
            </span>
          </h1>

          <p style={{ fontSize: '1.125rem', color: 'var(--color-text-secondary)', marginBottom: '3rem', maxWidth: '480px', lineHeight: 1.6 }}>
            Elevating workspaces since 2021. Direct access to gear featured on our socials and the fastest imports in Kenya.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/shop" className="btn btn-primary">
              Explore Shop <ArrowUpRight size={18} />
            </Link>
            <Link to="/buy-for-me" className="btn btn-outline" style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(4px)' }}>
              US Imports <Zap size={18} style={{ fill: 'var(--color-accent)' }} />
            </Link>
          </div>

          <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div>
              <span style={{ display: 'block', fontSize: '2rem', fontWeight: 900, fontStyle: 'italic' }}>1.2k+</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-light)', letterSpacing: '0.1em' }}>HAPPY DESKIES</span>
            </div>
            <div style={{ width: '1px', height: '40px', background: 'rgba(0,0,0,0.1)' }} />
            <div style={{ display: 'flex' }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '4px solid white', background: '#eee', marginLeft: '-12px', overflow: 'hidden' }}>
                  <img src={`https://i.pravatar.cc/100?u=tech${i}`} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '4px solid white', background: 'var(--color-accent)', marginLeft: '-12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 900 }}>
                +800
              </div>
            </div>
          </div>
        </div>

        {/* Right Interactive Visual */}
        <div style={{ position: 'relative', height: '600px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', ...parallaxStyle(0.5) }}>

          {/* Floating Tech Elements */}
          <div style={{ position: 'absolute', top: -50, right: 50, zIndex: 0, opacity: 0.2 }}>
            <CircuitBoard size={300} color="var(--color-primary)" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '4rem' }}>
            <div
              className="glass-panel"
              style={{
                padding: '1.5rem',
                borderRadius: '32px',
                transition: 'transform 0.3s ease',
                transform: `translateY(${mousePos.y * -10}px)`
              }}
            >
              <div style={{ aspectRatio: '1/1', background: '#f0f0f0', borderRadius: '24px', overflow: 'hidden', marginBottom: '1.5rem', position: 'relative' }}>
                <img src="https://picsum.photos/seed/desksetup/600/600" alt="Setup" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: 10, right: 10, background: 'white', padding: 8, borderRadius: '50%' }}>
                  <Monitor size={16} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, fontStyle: 'italic', fontSize: '0.875rem' }}>CURATED</span>
                <div className="badge-outline">PREMIUM</div>
              </div>
            </div>

            <Link
              to="/deals"
              className="glass-panel"
              style={{
                background: 'var(--color-accent)',
                padding: '2rem',
                borderRadius: '40px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '220px',
                textDecoration: 'none',
                color: 'var(--color-text-primary)',
                position: 'relative',
                overflow: 'hidden',
                ...parallaxStyle(1)
              }}
            >
              <div style={{ position: 'absolute', top: -20, right: -20, width: '100px', height: '100px', background: 'rgba(255,255,255,0.4)', borderRadius: '50%', filter: 'blur(20px)' }} />
              <Zap size={32} strokeWidth={2.5} />
              <div>
                <span style={{ display: 'block', fontSize: '2rem', fontWeight: 900, fontStyle: 'italic', lineHeight: 1 }}>HOT<br />DEALS</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.7 }}>Daily Drops</span>
              </div>
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div
              className="glass-panel"
              style={{
                background: 'var(--color-text-primary)',
                color: 'white',
                padding: '2rem',
                borderRadius: '40px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '220px',
                position: 'relative',
                overflow: 'hidden',
                ...parallaxStyle(-0.5)
              }}
            >
              <Globe size={32} style={{ color: 'var(--color-primary)' }} />
              <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              <div>
                <span style={{ display: 'block', fontSize: '1.75rem', fontWeight: 900, fontStyle: 'italic', lineHeight: 1.1 }}>GLOBAL<br />LOGISTICS</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-primary)' }}>USA • KENYA</span>
              </div>
            </div>

            <div
              className="glass-panel"
              style={{
                padding: '1.5rem',
                borderRadius: '32px',
                transform: `translateY(${mousePos.y * 10}px)`
              }}
            >
              <div style={{ aspectRatio: '1/1', background: '#f0f0f0', borderRadius: '24px', overflow: 'hidden', marginBottom: '1.5rem', position: 'relative' }}>
                <img src="https://picsum.photos/seed/curation/600/600" alt="Setup" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, fontStyle: 'italic', fontSize: '0.875rem' }}>TECH</span>
                <div style={{ background: 'var(--color-primary)', padding: '6px', borderRadius: '12px', color: 'white' }}>
                  <Cpu size={18} />
                </div>
              </div>
            </div>
          </div>

          {/* Orbiting Elements */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: `translate(-50%, -50%)`, width: '120%', height: '120%', border: '1px solid rgba(179, 200, 239, 0.2)', borderRadius: '50%', zIndex: -1, animation: 'spin-slow 20s linear infinite' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: `translate(-50%, -50%)`, width: '140%', height: '140%', border: '1px dashed rgba(227, 247, 126, 0.3)', borderRadius: '50%', zIndex: -1, animation: 'spin-reverse 30s linear infinite' }} />

        </div>
      </div>
    </section>
  );
};

export default Hero;

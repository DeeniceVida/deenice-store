import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, Sparkles, Monitor, Cpu, Globe, Zap, CircuitBoard } from 'lucide-react';
import { Link } from 'react-router-dom';

import HeroIllustration from './FulfillmentAnimation';

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

        {/* Right Interactive Visual - Animation Component */}
        <div style={{ ...parallaxStyle(0.5), width: '100%' }}>
          <HeroIllustration />
        </div>
      </div>
    </section>
  );
};

export default Hero;

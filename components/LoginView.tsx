
import React, { useState, useRef } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import { User } from '../types';
import * as gemini from '../services/gemini';
import * as db from '../services/supabase';
import { DELIVERY_ZONES, NAIROBI_DISTANCES, ADMIN_EMAIL, ADMIN_PASSWORD } from '../constants';

interface LoginViewProps {
  onLogin: (user: User) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [hometown, setHometown] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isPeeking, setIsPeeking] = useState(false);
  const [isHoveringLogin, setIsHoveringLogin] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [focusField, setFocusField] = useState<string | null>(null);
  const [loginError, setLoginError] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [townSearch, setTownSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const submittedEmail = email.trim().toLowerCase();
      const submittedPassword = password.trim();

      if (isRegistering) {
        // Register via Supabase Auth
        const { data: authData, error: authError } = await db.supabase.auth.signUp({
          email: submittedEmail,
          password: submittedPassword,
          options: {
            data: {
              full_name: name,
              hometown: hometown
            }
          }
        });

        if (authError) throw authError;

        if (authData.user) {
          const newUser: User = {
            id: authData.user.id,
            name: name || 'User',
            email: submittedEmail,
            role: 'USER', // Default role. Admin status should be handled via database roles/claims.
            hometown: hometown || 'Westlands'
          };
          await db.upsertUser(newUser);
          onLogin(newUser);
        }
      } else {
        // --- HARDCODED ADMIN BYPASS ---
        // If credentials match the constants exactly, we allow login even if Supabase has issues
        if (submittedEmail === ADMIN_EMAIL.toLowerCase() && submittedPassword === ADMIN_PASSWORD && ADMIN_EMAIL !== "") {
          console.log("Admin credentials matched. Checking Supabase Auth...");
          // We still try to sign them in to Supabase for a session
          try {
            const { data: authData, error: authError } = await db.supabase.auth.signInWithPassword({
              email: submittedEmail,
              password: submittedPassword
            });

            if (!authError && authData.user) {
              const userProfile = await db.getUserByEmail(submittedEmail);
              onLogin({
                ...(userProfile || {
                  id: authData.user.id,
                  name: authData.user.user_metadata?.full_name || 'Store Owner',
                  email: submittedEmail,
                  hometown: authData.user.user_metadata?.hometown || 'Nairobi'
                }),
                role: 'ADMIN'
              });
              setIsLoading(false);
              return;
            }
          } catch (e) {
            console.warn("Supabase auth failed during admin bypass, proceeding with local session", e);
          }

          // If Supabase fails but credentials are correct, log in as local admin
          onLogin({
            id: 'local-admin',
            name: 'Store Owner',
            email: submittedEmail,
            role: 'ADMIN',
            hometown: 'Nairobi'
          });
          setIsLoading(false);
          return;
        }

        // Login via Supabase Auth (Normal Flow)
        const { data: authData, error: authError } = await db.supabase.auth.signInWithPassword({
          email: submittedEmail,
          password: submittedPassword
        });

        if (authError) throw authError;

        if (authData.user) {
          const userProfile = await db.getUserByEmail(submittedEmail);
          if (userProfile) {
            onLogin(userProfile);
          } else {
            // Fallback user object if profile not found
            const fallbackUser: User = {
              id: authData.user.id,
              name: authData.user.user_metadata?.full_name || 'Member',
              email: submittedEmail,
              role: submittedEmail === ADMIN_EMAIL.toLowerCase() ? 'ADMIN' : 'USER',
              hometown: authData.user.user_metadata?.hometown || 'Westlands'
            };
            // Ensure this user exists in DB so RLS works
            await db.upsertUser(fallbackUser);
            onLogin(fallbackUser);
          }
        }
      }
    } catch (err: any) {
      console.error('Auth Error:', err);
      setLoginError(true);
      // Optional: show specific error message to user
    } finally {
      setIsLoading(false);
    }
  };

  const towns = [...NAIROBI_DISTANCES.map(t => t.name), ...DELIVERY_ZONES.map(t => t.name)].sort();

  const handleTownSearch = async (val: string) => {
    setTownSearch(val);
    setHometown(val);
    if (val.length >= 2) {
      const filteredLocal = towns.filter(t => t.toLowerCase().includes(val.toLowerCase())).slice(0, 3);
      const aiSuggestions = await gemini.getTownSuggestions(val);
      const combined = Array.from(new Set([...filteredLocal, ...aiSuggestions]));
      setSuggestions(combined);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectTown = (town: string) => {
    setHometown(town);
    setTownSearch(town);
    setShowSuggestions(false);
  };

  const Character = ({ color, style, children, delay = "0ms" }: any) => {
    const isNodding = focusField === 'email';
    const isShaking = loginError;
    const isLeaning = isHoveringLogin;

    return (
      <div
        style={{
          position: 'absolute',
          transition: 'all 0.7s ease-out',
          animation: 'fadeIn 0.5s ease-out forwards',
          animationDelay: delay,
          ...style,
          transform: `
            translateY(${isNodding ? '12px' : '0px'}) 
            translateX(${isShaking ? (Math.sin(Date.now() / 30) * 8) + 'px' : '0px'})
            scale(${isLeaning ? 1.05 : 1})
          `,
        }}
      >
        {children}
      </div>
    );
  };

  const Pupil = ({ size = 2, range = 8 }: { size?: number, range?: number }) => (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: 'black',
        borderRadius: '50%',
        transition: 'transform 0.1s ease-out',
        transform: isPeeking ? `translateY(-${range}px) scale(0)` : `translate(${mousePos.x * range}px, ${mousePos.y * range}px)`
      }}
    />
  );

  return (
    <div className="login-container" ref={containerRef} onMouseMove={handleMouseMove}>
      <div className="login-card">

        <div className="login-visual">
          <div style={{ position: 'relative', width: '100%', height: '320px', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>

            <Character delay="100ms" style={{ bottom: 0, left: '15%', width: '110px', height: '280px', backgroundColor: '#6210CC', zIndex: 1, borderRadius: '4px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '2.5rem', gap: '4px' }}>
                <div style={{ display: 'flex', gap: '2rem' }}>
                  <div style={{ width: '1.25rem', height: '1.25rem', backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <Pupil size={6} range={10} />
                  </div>
                  <div style={{ width: '1.25rem', height: '1.25rem', backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <Pupil size={6} range={10} />
                  </div>
                </div>
                <div style={{ width: focusField === 'email' ? '2.5rem' : '2rem', height: focusField === 'email' ? '8px' : '4px', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: '999px', marginTop: '2rem', transition: 'all 0.2s', transform: focusField === 'email' ? 'scaleX(1.25)' : 'none' }} />
              </div>
            </Character>

            <Character delay="200ms" style={{ bottom: 0, left: '48%', width: '90px', height: '200px', backgroundColor: '#1A1C23', zIndex: 2, borderRadius: '4px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: '2.5rem', height: '2.5rem', backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', transform: isPeeking ? 'scaleY(0) opacity(0)' : 'scaleY(1)' }}>
                    <Pupil size={5} range={12} />
                  </div>
                  <div style={{ width: '2.5rem', height: '2.5rem', backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', transform: isPeeking ? 'scaleY(0) opacity(0)' : 'scaleY(1)' }}>
                    <Pupil size={5} range={12} />
                  </div>
                </div>
              </div>
            </Character>

            <Character delay="300ms" style={{ bottom: 0, left: '0%', width: '260px', height: '140px', backgroundColor: '#D46328', zIndex: 3, borderTopLeftRadius: '130px', borderTopRightRadius: '130px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '2.5rem' }}>
                <div style={{ display: 'flex', gap: '4rem' }}>
                  <div style={{ width: '1.25rem', height: '1.25rem', backgroundColor: 'black', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <div style={{ width: '6px', height: '6px', backgroundColor: 'white', borderRadius: '50%', transform: isPeeking ? 'scale(0)' : `translate(${mousePos.x * 8}px, ${mousePos.y * 8}px)` }} />
                  </div>
                  <div style={{ width: '1.25rem', height: '1.25rem', backgroundColor: 'black', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <div style={{ width: '6px', height: '6px', backgroundColor: 'white', borderRadius: '50%', transform: isPeeking ? 'scale(0)' : `translate(${mousePos.x * 8}px, ${mousePos.y * 8}px)` }} />
                  </div>
                </div>
                <div style={{ marginTop: '2rem', width: '4rem', height: '2rem', backgroundColor: isPeeking ? 'transparent' : 'rgba(0,0,0,0.3)', borderRadius: '0 0 999px 999px', transition: 'all 0.2s', borderTop: isPeeking ? '4px solid rgba(0,0,0,0.4)' : 'none', transform: isPeeking ? 'scaleX(0.5)' : 'none' }} />
              </div>
            </Character>

            <Character delay="400ms" style={{ bottom: 0, right: '0%', width: '120px', height: '180px', backgroundColor: '#A5921E', zIndex: 4, borderTopLeftRadius: '60px', borderTopRightRadius: '60px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '3rem' }}>
                <div style={{ display: 'flex', gap: '2.5rem', marginBottom: '1.5rem' }}>
                  <div style={{ width: '1rem', height: '1rem', backgroundColor: 'black', borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isPeeking ? 0 : 1, transition: 'opacity 0.2s' }}>
                    <div style={{ width: '6px', height: '6px', backgroundColor: 'white', borderRadius: '50%', transform: `translate(${mousePos.x * 6}px, ${mousePos.y * 6}px)` }} />
                  </div>
                  <div style={{ width: '1rem', height: '1rem', backgroundColor: 'black', borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isPeeking ? 0 : 1, transition: 'opacity 0.2s' }}>
                    <div style={{ width: '6px', height: '6px', backgroundColor: 'white', borderRadius: '50%', transform: `translate(${mousePos.x * 6}px, ${mousePos.y * 6}px)` }} />
                  </div>
                </div>
                <div style={{ width: isPeeking ? '1rem' : '4rem', height: '4px', backgroundColor: 'rgba(0,0,0,0.4)', transition: 'all 0.2s', transform: isPeeking ? 'translateY(12px)' : 'none', opacity: isPeeking ? 0.2 : 1 }} />
              </div>
            </Character>
          </div>

          <div style={{ marginTop: '4rem', textAlign: 'center', color: 'rgba(255,255,255,0.9)', position: 'relative', zIndex: 50 }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, fontStyle: 'italic', letterSpacing: '-0.05em' }}>THE DEENICE SQUAD</h2>
            <p style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3em', marginTop: '0.75rem', opacity: 0.5 }}>Curation Oversight Division</p>
          </div>
        </div>

        <div className="login-form-section">
          <div style={{ marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 900, fontStyle: 'italic', marginBottom: '0.75rem', letterSpacing: '-0.05em' }}>
              {isForgotMode ? 'Recover' : (isRegistering ? 'Join Us' : 'Login')}
            </h1>
            <p style={{ color: '#9ca3af', fontWeight: 500 }}>
              {isForgotMode ? 'Enter your email to reset access.' : 'Your personal vault of curated tech gear.'}
            </p>
          </div>

          {resetSuccess ? (
            <div style={{ background: '#ecfdf5', padding: '2rem', borderRadius: '24px', border: '1.5px solid #059669', textAlign: 'center' }}>
              <CheckCircle style={{ color: '#059669', marginBottom: '1rem' }} size={48} />
              <h3 style={{ fontWeight: 900, color: '#065f46', marginBottom: '0.5rem' }}>RESET LINK SENT</h3>
              <p style={{ fontSize: '0.875rem', color: '#065f46', opacity: 0.8 }}>Check your inbox for instructions to recover your account.</p>
              <button
                onClick={() => { setResetSuccess(false); setIsForgotMode(false); }}
                style={{ marginTop: '1.5rem', background: '#059669', color: '#fff', border: 'none', padding: '1rem 2rem', borderRadius: '12px', fontWeight: 900, cursor: 'pointer' }}
              >
                BACK TO LOGIN
              </button>
            </div>
          ) : (
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (isForgotMode) {
                setIsLoading(true);
                // Simulate reset
                setTimeout(() => {
                  setIsLoading(false);
                  setResetSuccess(true);
                }, 1500);
                return;
              }
              await handleSubmit(e);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {isRegistering && !isForgotMode && (
                <div className="form-input-group">
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    onFocus={() => setFocusField('name')}
                    onBlur={() => setFocusField(null)}
                    className="form-input"
                    style={{ paddingLeft: '2rem' }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}

              <div className="form-input-group">
                <Mail className="form-icon" size={20} />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  onFocus={() => setFocusField('email')}
                  onBlur={() => setFocusField(null)}
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {!isForgotMode && (
                <div className="form-input-group">
                  <Lock className="form-icon" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    required
                    onFocus={() => setFocusField('password')}
                    onBlur={() => setFocusField(null)}
                    className="form-input"
                    style={{ paddingRight: '4rem', borderColor: loginError ? '#f87171' : 'transparent' }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    style={{ position: 'absolute', right: '2rem', top: '50%', transform: 'translateY(-50%)', color: '#d1d5db', background: 'none', border: 'none', cursor: 'pointer' }}
                    onMouseEnter={() => setIsPeeking(true)}
                    onMouseLeave={() => setIsPeeking(false)}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              )}

              {isRegistering && !isForgotMode && (
                <div className="form-input-group" style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Delivery Town (e.g. Westlands, Nakuru...)"
                    required
                    className="form-input"
                    style={{ paddingLeft: '2rem' }}
                    value={hometown}
                    onChange={(e) => handleTownSearch(e.target.value)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  />
                  {showSuggestions && suggestions.length > 0 && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1.5px solid #000', borderRadius: '12px', marginTop: '4px', zIndex: 100, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', overflow: 'hidden' }}>
                      {suggestions.map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => selectTown(s)}
                          style={{ width: '100%', padding: '0.75rem 1rem', textAlign: 'left', border: 'none', background: 'none', fontSize: '0.875rem', cursor: 'pointer', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                          <Sparkles size={12} style={{ color: '#6210CC' }} /> {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                onMouseEnter={() => setIsHoveringLogin(true)}
                onMouseLeave={() => setIsHoveringLogin(false)}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '1.5rem', borderRadius: '28px', opacity: isLoading ? 0.7 : 1 }}
              >
                {isLoading ? 'Processing...' : (isForgotMode ? 'Send Reset Link' : (isRegistering ? 'Sign Up' : 'Continue'))} {!isLoading && <ArrowRight size={22} style={{ marginLeft: '1rem' }} />}
              </button>
            </form>
          )}

          <div style={{ marginTop: '2.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {!isForgotMode && (
              <button
                onClick={() => setIsRegistering(!isRegistering)}
                style={{ fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {isRegistering ? 'Already have an account?' : "New here? Create Account"}
              </button>
            )}

            <button
              onClick={() => { setIsForgotMode(!isForgotMode); setIsRegistering(false); }}
              style={{ fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: isForgotMode ? '#000' : '#4f46e5', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {isForgotMode ? 'Back to Login' : 'Forgot Password?'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;

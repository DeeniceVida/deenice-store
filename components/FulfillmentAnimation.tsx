import React, { useState, useEffect } from 'react';

const FulfillmentAnimation: React.FC = () => {
    const [stage, setStage] = useState(0); // 0: Placement, 1: Fulfillment, 2: Transit, 3: Storage, 4: Delivery

    useEffect(() => {
        const timer = setInterval(() => {
            setStage((prev) => (prev + 1) % 5);
        }, 4000); // 4 seconds per stage
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="fulfillment-animation-container" style={{
            width: '100%',
            height: '100%',
            minHeight: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#F5F7FA',
            borderRadius: '40px',
            overflow: 'hidden',
            position: 'relative'
        }}>
            <style>{`
        @keyframes fadeInOut {
          0%, 100% { opacity: 0; transform: translateY(10px); }
          10%, 90% { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatSide {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(10px); }
        }
        @keyframes dash {
          to { stroke-dashoffset: 0; }
        }
        @keyframes buttonPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(0.95); opacity: 0.8; }
        }
        @keyframes boxSlide {
          from { transform: translateX(-100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes planeFly {
          from { offset-distance: 0%; }
          to { offset-distance: 100%; }
        }
        .stage-content {
          animation: fadeInOut 4s infinite;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          height: 100%;
          justify-content: center;
        }
        .status-badge {
          background: #0FB9B1;
          color: white;
          padding: 6px 16px;
          border-radius: 20px;
          font-weight: 800;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 24px;
        }
      `}</style>

            {/* STAGE 1: ORDER PLACEMENT */}
            {stage === 0 && (
                <div className="stage-content">
                    <div className="status-badge" style={{ background: '#F47A20' }}>Order Placement</div>
                    <svg width="240" height="320" viewBox="0 0 240 320" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="20" y="20" width="200" height="280" rx="24" fill="white" stroke="#E2E8F0" strokeWidth="4" />
                        <rect x="40" y="50" width="160" height="120" rx="12" fill="#F8FAFC" />
                        <rect x="40" y="190" width="100" height="12" rx="6" fill="#E2E8F0" />
                        <rect x="40" y="210" width="60" height="12" rx="6" fill="#F1F5F9" />
                        <g style={{ animation: 'buttonPulse 1s infinite' }}>
                            <rect x="40" y="244" width="160" height="40" rx="20" fill="#F47A20" />
                            <text x="120" y="269" textAnchor="middle" fill="white" style={{ fontWeight: 800, fontSize: '14px' }}>BUY NOW</text>
                        </g>
                        <circle cx="120" cy="110" r="30" fill="#F47A20" opacity="0.1" />
                        <path d="M105 110L115 120L135 100" stroke="#F47A20" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            )}

            {/* STAGE 2: FULFILLMENT */}
            {stage === 1 && (
                <div className="stage-content">
                    <div className="status-badge">Preparation</div>
                    <svg width="280" height="200" viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M40 160L80 180H200L240 160V60L200 40H80L40 60V160Z" fill="white" stroke="#0FB9B1" strokeWidth="4" />
                        <path d="M80 40L140 70L200 40" stroke="#0FB9B1" strokeWidth="4" />
                        <path d="M140 70V180" stroke="#0FB9B1" strokeWidth="4" strokeDasharray="8 8" />
                        <rect x="60" y="100" width="160" height="8" rx="4" fill="#0FB9B1" style={{ animation: ' dash 2s linear' }}>
                            <animate attributeName="width" from="0" to="160" dur="2s" fill="freeze" />
                        </rect>
                        <text x="140" y="140" textAnchor="middle" fill="#0FB9B1" style={{ fontWeight: 900, fontSize: '12px' }}>PACKING...</text>
                    </svg>
                </div>
            )}

            {/* STAGE 3: TRANSIT */}
            {stage === 2 && (
                <div className="stage-content">
                    <div className="status-badge" style={{ background: '#0EA5E9' }}>In Transit</div>
                    <svg width="320" height="180" viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M40 120C100 60 220 60 280 120" stroke="#CBD5E1" strokeWidth="3" strokeDasharray="6 6" />
                        <g style={{ offsetPath: "path('M40 120C100 60 220 60 280 120')", animation: 'planeFly 4s linear infinite' }}>
                            <rect x="-15" y="-10" width="30" height="20" rx="4" fill="#0EA5E9" />
                            <path d="M-5 0L5 0M0 -5L0 5" stroke="white" strokeWidth="2" />
                        </g>
                        <circle cx="40" cy="120" r="4" fill="#0EA5E9" />
                        <circle cx="280" cy="120" r="4" fill="#0EA5E9" />
                    </svg>
                    <div style={{ display: 'flex', gap: '32px', marginTop: '20px' }}>
                        <div style={{ fontSize: '10px', fontWeight: 700, opacity: 0.5 }}>GLOBAL CORE</div>
                        <div style={{ fontSize: '10px', fontWeight: 700, color: '#0EA5E9' }}>DESTINATION</div>
                    </div>
                </div>
            )}

            {/* STAGE 4: LOCAL STORAGE */}
            {stage === 3 && (
                <div className="stage-content">
                    <div className="status-badge">Verifying</div>
                    <svg width="240" height="200" viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="40" y="40" width="160" height="120" rx="8" fill="white" stroke="#0FB9B1" strokeWidth="4" />
                        <rect x="60" y="60" width="40" height="40" rx="4" fill="#F1F5F9" />
                        <rect x="110" y="60" width="70" height="8" rx="4" fill="#E2E8F0" />
                        <rect x="110" y="75" width="50" height="8" rx="4" fill="#E2E8F0" />
                        <line x1="40" y1="100" x2="200" y2="100" stroke="#0FB9B1" strokeWidth="2" strokeDasharray="4 4" />
                        <g style={{ animation: 'floatSide 2s ease-in-out infinite' }}>
                            <rect x="80" y="120" width="80" height="24" rx="12" fill="#0FB9B1" opacity="0.2" />
                            <text x="120" y="136" textAnchor="middle" fill="#0FB9B1" style={{ fontWeight: 800, fontSize: '10px' }}>SCANNING</text>
                        </g>
                    </svg>
                </div>
            )}

            {/* STAGE 5: LAST MILE */}
            {stage === 4 && (
                <div className="stage-content">
                    <div className="status-badge" style={{ background: '#F47A20' }}>Delivered</div>
                    <svg width="280" height="200" viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="100" y="40" width="80" height="120" rx="8" fill="white" stroke="#000" strokeWidth="4" />
                        <circle cx="115" cy="100" r="4" fill="#000" />
                        <g style={{ transform: 'translate(40px, 120px)' }}>
                            <rect width="40" height="30" rx="4" fill="#F47A20" />
                            <path d="M10 10V20M30 10V20M10 15H30" stroke="white" strokeWidth="2" />
                        </g>
                        <path d="M220 100L235 115L260 90" stroke="#0FB9B1" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'dash 1s forwards' }} />
                    </svg>
                    <p style={{ marginTop: '20px', fontWeight: 900, color: '#F47A20', letterSpacing: '1px' }}>HAPPY DESKIE SECURED!</p>
                </div>
            )}

            {/* Navigation Indicators */}
            <div style={{
                position: 'absolute',
                bottom: '30px',
                display: 'flex',
                gap: '8px'
            }}>
                {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} style={{
                        width: stage === i ? '24px' : '8px',
                        height: '8px',
                        borderRadius: '4px',
                        background: stage === i ? '#F47A20' : '#E2E8F0',
                        transition: 'all 0.3s ease'
                    }} />
                ))}
            </div>
        </div>
    );
};

export default FulfillmentAnimation;

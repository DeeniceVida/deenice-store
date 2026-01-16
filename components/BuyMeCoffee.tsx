
import React, { useState } from 'react';
import { Copy, Check, X, Heart, Star, Zap } from 'lucide-react';
import { MPESA_TILL_NUMBER } from '../constants';

interface BuyMeCoffeeProps {
    isOpen: boolean;
    onClose: () => void;
}

const BuyMeCoffee: React.FC<BuyMeCoffeeProps> = ({ isOpen, onClose }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(MPESA_TILL_NUMBER);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="admin-modal-overlay" style={{ backdropFilter: 'blur(4px)', backgroundColor: 'rgba(255,221,0, 0.4)', zIndex: 1000 }}>
            <div className="admin-modal-backdrop" onClick={onClose} />

            <div className="neo-modal-content">
                <button onClick={onClose} style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 20 }}>
                    <X size={32} strokeWidth={3} />
                </button>

                <div className="neo-header">
                    <h2 className="neo-title">KEEP THE <br />CONTENT <span style={{ color: 'white', textShadow: '4px 4px 0px #000' }}>ALIVE</span></h2>
                    <p className="neo-subtitle">Support the daily tech drops on TikTok & YouTube!</p>
                </div>

                <div className="neo-body">
                    <div className="neo-input-box">
                        <div>
                            <label style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', display: 'block' }}>M-PESA BUY GOODS</label>
                            <span style={{ fontSize: '2rem', fontWeight: 900 }}>{MPESA_TILL_NUMBER}</span>
                        </div>
                        <button onClick={handleCopy} className="icon-btn" style={{ border: '2px solid black', borderRadius: '8px', background: isCopied ? '#4ADE80' : 'white', width: '48px', height: '48px' }}>
                            {isCopied ? <Check size={24} strokeWidth={3} /> : <Copy size={24} strokeWidth={3} />}
                        </button>
                    </div>

                    <div className="neo-card-row">
                        <div className="neo-card-item neo-card-purple">
                            <Heart size={32} fill="white" color="black" strokeWidth={3} style={{ marginBottom: '10px' }} />
                            <h4 style={{ fontWeight: 900, fontSize: '0.9rem' }}>FAN LOVE</h4>
                            <p style={{ fontSize: '0.7rem', fontWeight: 700 }}>"Best tech reviews!"</p>
                        </div>
                        <div className="neo-card-item neo-card-yellow">
                            <Zap size={32} fill="black" color="black" style={{ marginBottom: '10px' }} />
                            <h4 style={{ fontWeight: 900, fontSize: '0.9rem' }}>FAST DROPS</h4>
                            <p style={{ fontSize: '0.7rem', fontWeight: 700 }}>More content coming.</p>
                        </div>
                    </div>

                    <button className="neo-btn" onClick={onClose}>
                        Lipa na M-PESA & Return
                    </button>
                </div>

                {/* Decorative Elements mimicking the image */}
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', zIndex: 15 }}>
                    <Star size={80} fill="#4ADE80" stroke="#000" strokeWidth={2} style={{ transform: 'rotate(15deg)' }} />
                </div>
            </div>
        </div>
    );
};

export default BuyMeCoffee;

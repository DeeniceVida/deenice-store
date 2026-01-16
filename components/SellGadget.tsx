
import React, { useState } from 'react';
import { Camera, DollarSign, Loader, Upload, AlertCircle, Sparkles, Send } from 'lucide-react';
import { User, GadgetListing } from '../types';
import { Link } from 'react-router-dom';
import { STORE_EMAIL } from '../constants';

interface SellGadgetProps {
    user: User | null;
    onSubmit: (listing: Omit<GadgetListing, 'id' | 'createdAt' | 'sellerId' | 'sellerName' | 'status'>) => void;
}

const SellGadget: React.FC<SellGadgetProps> = ({ user, onSubmit }) => {
    const [formData, setFormData] = useState({
        deviceName: '',
        condition: 'Like New',
        durationUsed: '',
        rfs: '',
        price: '',
        location: '',
        phoneNumber: '',
    });
    const [images, setImages] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    if (!user) {
        return (
            <div className="confera-page flex items-center justify-center">
                <div className="confera-form-container text-center max-w-md">
                    <AlertCircle size={48} className="mx-auto mb-4" />
                    <h2 className="text-3xl font-black mb-4 uppercase">Login Required</h2>
                    <p className="mb-6 font-bold">You need to have a verified account to list your gadgets.</p>
                    <Link to="/login" className="confera-btn inline-block text-center no-underline">Login Now &raquo;</Link>
                </div>
            </div>
        );
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const url = URL.createObjectURL(e.target.files[0]);
            setImages([...images, url]);
        }
    };

    const calculateFees = (price: number) => {
        const fee = price * 0.07;
        return {
            fee: Math.round(fee),
            payout: Math.round(price - fee)
        };
    };

    const { fee, payout } = calculateFees(Number(formData.price) || 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // 1. Submit to internal system (Admin Dashboard)
        setTimeout(() => {
            onSubmit({
                deviceName: formData.deviceName,
                condition: formData.condition as any,
                durationUsed: formData.durationUsed,
                rfs: formData.rfs,
                price: Number(formData.price),
                location: formData.location,
                phoneNumber: formData.phoneNumber,
                images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80'],
            });

            // 2. Trigger Email (Dual Submission)
            const subject = `Gadget Listing Request: ${formData.deviceName} - ${user.name}`;
            const body = `Hello Admin,\n\nI would like to list my ${formData.deviceName} for sale.\n\nDetails:\n- Price: KES ${formData.price}\n- Condition: ${formData.condition}\n- Duration Used: ${formData.durationUsed}\n- Reason for Selling: ${formData.rfs}\n- Location: ${formData.location}\n- Phone: ${formData.phoneNumber}\n\nPlease review my listing in the dashboard.\n\nThanks,\n${user.name}`;

            // Open mail client
            window.location.href = `mailto:${STORE_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            setIsSubmitting(false);
            setShowSuccess(true);
        }, 1500);
    };

    if (showSuccess) {
        return (
            <div className="confera-page flex items-center justify-center p-4">
                <div className="confera-form-container text-center max-w-lg animate-bounce-in">
                    <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white">
                        <DollarSign size={40} className="text-white" />
                    </div>
                    <h2 className="text-4xl font-black mb-4 uppercase">Listing Pending!</h2>
                    <div className="bg-white border-2 border-black p-4 mb-6 font-bold text-left">
                        <p className="mb-2">1. Your listing is now in the <span className="text-red-500">Admin Dashboard</span>.</p>
                        <p>2. We opened your email client to send a notificaton too!</p>
                    </div>
                    <div className="flex gap-4">
                        <Link to="/shop" className="confera-btn bg-white text-black border-2 border-black hover:bg-gray-100">Back to Shop</Link>
                        <Link to="/market" className="confera-btn">Go to Market</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="confera-page">
            {/* Header Strip */}
            <div className="confera-header-strip">
                <Link to="/" className="font-black text-black text-xl tracking-tighter uppercase">Deenice.Store</Link>
                <div className="flex gap-4 text-sm font-bold text-black uppercase">
                    <span className="hidden md:inline">Sell Fast</span>
                    <span>•</span>
                    <span className="hidden md:inline">Get Paid</span>
                </div>
            </div>

            {/* Hero Section */}
            <div className="confera-hero">
                <h1 className="confera-title">SELL YOUR<br />GADGET</h1>
                <div className="confera-subtitle-box">
                    Get Cash for Your Stash
                </div>
            </div>

            {/* Main Form */}
            <div className="px-4">
                <div className="confera-form-container mb-20">
                    {/* Sticker */}
                    <div className="confera-sticker">
                        <span>SERVICE FEE</span>
                        <strong>7%</strong>
                        <span>ONLY</span>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-8 border-b-4 border-black pb-4">
                            <h2 className="text-2xl font-black uppercase flex items-center gap-2">
                                <span className="bg-black text-white w-8 h-8 flex items-center justify-center rounded-full text-sm">1</span>
                                Device Intel
                            </h2>
                        </div>

                        <div className="confera-grid">
                            <div className="confera-input-group">
                                <label className="confera-label">Device Name</label>
                                <input
                                    required
                                    className="confera-input"
                                    placeholder="iPhone 13 Pro..."
                                    value={formData.deviceName}
                                    onChange={(e) => setFormData({ ...formData, deviceName: e.target.value })}
                                />
                            </div>
                            <div className="confera-input-group">
                                <label className="confera-label">Duration Used</label>
                                <input
                                    required
                                    className="confera-input"
                                    placeholder="e.g. 6 months"
                                    value={formData.durationUsed}
                                    onChange={(e) => setFormData({ ...formData, durationUsed: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="confera-grid">
                            <div className="confera-input-group">
                                <label className="confera-label">Condition</label>
                                <select
                                    className="confera-input"
                                    value={formData.condition}
                                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                                >
                                    <option>New</option>
                                    <option>Like New</option>
                                    <option>Good</option>
                                    <option>Fair</option>
                                </select>
                            </div>
                            <div className="confera-input-group">
                                <label className="confera-label">Asking Price (KES)</label>
                                <input
                                    required
                                    type="number"
                                    className="confera-input"
                                    placeholder="000"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                                {Number(formData.price) > 0 && (
                                    <div className="mt-2 bg-black text-white p-2 text-sm font-bold flex justify-between">
                                        <span>Payout: KES {payout.toLocaleString()}</span>
                                        <span className="text-gray-400"> (Fee: {fee.toLocaleString()})</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="confera-input-group">
                            <label className="confera-label">Reason for Selling</label>
                            <textarea
                                required
                                rows={2}
                                className="confera-input"
                                placeholder="Upgrade? Cash?"
                                value={formData.rfs}
                                onChange={(e) => setFormData({ ...formData, rfs: e.target.value })}
                            />
                        </div>

                        <div className="mb-8 border-b-4 border-black pb-4 mt-8">
                            <h2 className="text-2xl font-black uppercase flex items-center gap-2">
                                <span className="bg-black text-white w-8 h-8 flex items-center justify-center rounded-full text-sm">2</span>
                                Proof & Contact
                            </h2>
                        </div>

                        <div className="confera-grid">
                            <div className="confera-input-group">
                                <label className="confera-label">Your Location</label>
                                <input
                                    required
                                    className="confera-input"
                                    placeholder="City, Area"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>
                            <div className="confera-input-group">
                                <label className="confera-label">Phone Number</label>
                                <input
                                    required
                                    type="tel"
                                    className="confera-input"
                                    placeholder="07..."
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="confera-input-group">
                            <label className="confera-label">Photos of Device</label>
                            <div className="border-4 border-dashed border-black bg-white p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors relative">
                                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
                                <Upload className="mx-auto mb-2" />
                                <span className="font-bold uppercase">Click to Upload Evidence</span>
                            </div>
                            {images.length > 0 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
                                    {images.map((img, i) => (
                                        <div key={i} style={{ position: 'relative', width: '48px', height: '48px', border: '1px solid black', overflow: 'hidden' }}>
                                            <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            <button
                                                type="button"
                                                onClick={() => setImages(images.filter((_, index) => index !== i))}
                                                style={{
                                                    position: 'absolute',
                                                    top: '-4px',
                                                    right: '-4px',
                                                    background: 'black',
                                                    color: 'white',
                                                    width: '16px',
                                                    height: '16px',
                                                    display: 'flex',
                                                    itemsCenter: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: '50%',
                                                    fontSize: '10px',
                                                    cursor: 'pointer',
                                                    border: 'none'
                                                }}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button disabled={isSubmitting} className="confera-btn w-full mt-4">
                            {isSubmitting ? <Loader className="animate-spin" /> : <>Send for Verification <ArrowRightIcon /></>}
                        </button>
                    </form>
                </div>
            </div>

            <div className="confera-footer">
                <p>Deenice.Store • Verified Marketplace • 2025</p>
            </div>
        </div>
    );
};

// Simple Arrow Right Icon Component for internal use to avoid huge imports if needed, 
// or just use typicallucide import which we have at top.
const ArrowRightIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default SellGadget;



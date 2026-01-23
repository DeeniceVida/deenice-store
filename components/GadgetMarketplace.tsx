import React from 'react';
import { GadgetListing, Offer, User } from '../types';
import { MapPin, Smartphone, Mail, CheckCircle, ArrowRight, AlertCircle } from 'lucide-react';
import { STORE_EMAIL } from '../constants';
import { Link } from 'react-router-dom';

interface GadgetMarketplaceProps {
    user: User | null;
    gadgets: GadgetListing[];
    onOffer: (offer: Omit<Offer, 'id' | 'createdAt' | 'status'>) => void;
}

const GadgetMarketplace: React.FC<GadgetMarketplaceProps> = ({ user, gadgets, onOffer }) => {
    const approvedGadgets = gadgets.filter(g => g.status === 'APPROVED');

    if (!user) {
        return (
            <div className="confera-page flex items-center justify-center">
                <div className="confera-form-container text-center max-w-md">
                    <AlertCircle size={48} className="mx-auto mb-4" />
                    <h2 className="text-3xl font-black mb-4 uppercase">Login Required</h2>
                    <p className="mb-6 font-bold">You need to have a verified account to access the community market.</p>
                    <Link to="/login" className="confera-btn inline-block text-center no-underline">Login Now &raquo;</Link>
                </div>
            </div>
        );
    }

    const handleBuyRequest = (gadget: GadgetListing) => {
        const subject = `I want to buy: ${gadget.deviceName}`;
        const body = `Hi,\n\nI'm interested in the ${gadget.deviceName} (ID: ${gadget.id}) listed for KES ${gadget.price.toLocaleString()}.\n\nWhen can I view it?\n\n- Buyer Interested via Market`;

        // Internal state update
        onOffer({
            gadgetId: gadget.id,
            gadgetName: gadget.deviceName,
            buyerName: 'Community Buyer',
            buyerEmail: 'interested@deenice.market',
            offerAmount: gadget.price
        });

        window.location.href = `mailto:${STORE_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    return (
        <div className="confera-page">
            {/* Header Strip */}
            <div className="confera-header-strip">
                <div className="font-black text-black text-xl tracking-tighter uppercase">COMMUNITY MARKET</div>
                <div className="flex gap-4 text-sm font-bold text-black uppercase">
                    <span>• 100% Verified •</span>
                </div>
            </div>

            {/* Hero Section */}
            <div className="confera-hero" style={{ background: '#E3F77E' }}>
                <h1 className="confera-title">GET THE<br />GOODS</h1>
                <div className="confera-subtitle-box" style={{ background: '#000', color: '#fff' }}>
                    Verified P2P Tech Marketplace
                </div>
            </div>

            <div className="container py-8 md:py-20 px-2 md:px-4">
                {approvedGadgets.length === 0 ? (
                    <div className="border-4 border-dashed border-black bg-white p-12 md:p-20 text-center">
                        <Smartphone size={64} className="mx-auto text-black mb-6" />
                        <h3 className="text-xl md:text-3xl font-black uppercase mb-4">Market is Empty</h3>
                        <p className="font-bold text-gray-500 mb-8">Be the first to list your gear for sale.</p>
                        <a href="#/sell-gadget" className="confera-btn inline-flex text-xs md:text-base">Start Selling Now &raquo;</a>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
                        {approvedGadgets.map(gadget => (
                            <div key={gadget.id} className="border-[1.5px] md:border-2 border-black bg-white group transition-all hover:-translate-y-1 md:hover:-translate-y-2 hover:shadow-[4px_4px_0_#000] md:hover:shadow-[8px_8px_0_#000]">
                                <div className="relative aspect-square border-b-[1.5px] md:border-b-2 border-black overflow-hidden bg-gray-100">
                                    <img
                                        src={gadget.images[0]}
                                        alt={gadget.deviceName}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-black text-[#E3F77E] px-2 py-0.5 md:px-3 md:py-1 text-[8px] md:text-xs font-black uppercase tracking-widest">
                                        {gadget.condition}
                                    </div>
                                    <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 bg-white border-[1.5px] md:border-2 border-black px-2 py-0.5 md:px-3 md:py-1 text-[10px] md:text-xs font-black uppercase">
                                        KES {gadget.price.toLocaleString()}
                                    </div>
                                </div>

                                <div className="p-3 md:p-6 space-y-2 md:space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-black text-sm md:text-2xl uppercase leading-tight mb-1">{gadget.deviceName}</h3>
                                            <div className="flex items-center gap-1 text-[8px] md:text-xs font-bold text-gray-400 uppercase">
                                                <MapPin size={10} /> {gadget.location}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-l-2 md:border-l-4 border-[#FF69B4] pl-2 md:pl-4 py-1 md:py-2 font-bold text-[10px] md:text-sm italic bg-gray-50 line-clamp-2">
                                        "{gadget.rfs}"
                                    </div>

                                    <div className="flex items-center gap-1 md:gap-2 text-[8px] md:text-xs font-black uppercase tracking-tighter text-gray-400">
                                        <span>{gadget.sellerName}</span>
                                        <span>•</span>
                                        <span>{gadget.durationUsed}</span>
                                    </div>

                                    <button
                                        onClick={() => handleBuyRequest(gadget)}
                                        className="confera-btn w-full text-[10px] md:text-sm py-2 md:py-4 px-2 md:px-4"
                                    >
                                        <Mail size={14} className="flex-shrink-0" />
                                        <span>BUY</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            阻
            <div className="confera-footer">
                <p>Deenice.Store • Peer-to-Peer Verified • 2025</p>
            </div>
        </div>
    );
};

export default GadgetMarketplace;

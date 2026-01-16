import React from 'react';
import { GadgetListing, Offer } from '../types';
import { MapPin, Smartphone, User, Mail, CheckCircle, ArrowRight } from 'lucide-react';
import { STORE_EMAIL } from '../constants';

interface GadgetMarketplaceProps {
    gadgets: GadgetListing[];
    onOffer: (offer: Omit<Offer, 'id' | 'createdAt' | 'status'>) => void;
}

const GadgetMarketplace: React.FC<GadgetMarketplaceProps> = ({ gadgets, onOffer }) => {
    const approvedGadgets = gadgets.filter(g => g.status === 'APPROVED');

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

            <div className="container py-20">
                {approvedGadgets.length === 0 ? (
                    <div className="border-4 border-dashed border-black bg-white p-20 text-center">
                        <Smartphone size={64} className="mx-auto text-black mb-6" />
                        <h3 className="text-3xl font-black uppercase mb-4">Market is Empty</h3>
                        <p className="font-bold text-gray-500 mb-8">Be the first to list your gear for sale.</p>
                        <a href="#/sell-gadget" className="confera-btn inline-flex">Start Selling Now &raquo;</a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                        {approvedGadgets.map(gadget => (
                            <div key={gadget.id} className="border-2 border-black bg-white group transition-all hover:-translate-y-2 hover:shadow-[8px_8px_0_#000]">
                                <div className="relative aspect-square border-b-2 border-black overflow-hidden bg-gray-100">
                                    <img
                                        src={gadget.images[0]}
                                        alt={gadget.deviceName}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 right-4 bg-black text-[#E3F77E] px-3 py-1 text-xs font-black uppercase tracking-widest">
                                        {gadget.condition}
                                    </div>
                                    <div className="absolute bottom-4 left-4 bg-white border-2 border-black px-3 py-1 text-xs font-black uppercase">
                                        KES {gadget.price.toLocaleString()}
                                    </div>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-black text-2xl uppercase leading-none mb-2">{gadget.deviceName}</h3>
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase">
                                                <MapPin size={12} /> {gadget.location}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-l-4 border-[#FF69B4] pl-4 py-2 font-bold text-sm italic bg-gray-50">
                                        "{gadget.rfs}"
                                    </div>

                                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-tighter text-gray-400">
                                        <span>Seller: {gadget.sellerName}</span>
                                        <span>•</span>
                                        <span>Used: {gadget.durationUsed}</span>
                                    </div>

                                    <button
                                        onClick={() => handleBuyRequest(gadget)}
                                        className="confera-btn w-full text-sm py-4"
                                    >
                                        <Mail size={16} />
                                        Interested to Buy
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="confera-footer">
                <p>Deenice.Store • Peer-to-Peer Verified • 2025</p>
            </div>
        </div>
    );
};

export default GadgetMarketplace;

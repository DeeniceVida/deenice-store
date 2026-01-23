import React, { useState } from 'react';
import { Mail, Instagram, ArrowRight, CheckCircle, Handshake, Users, Zap } from 'lucide-react';
import { STORE_EMAIL, SOCIAL_LINKS } from '../constants';

const WorkWithMe: React.FC = () => {
    return (
        <div className="confera-page">
            {/* Header Strip */}
            <div className="confera-header-strip">
                <div className="font-black text-black text-xl tracking-tighter uppercase">COLLABORATE</div>
                <div className="flex gap-4 text-sm font-bold text-black uppercase">
                    <span>• BRAND PARTNERSHIPS •</span>
                </div>
            </div>

            {/* Hero Section */}
            <div className="confera-hero" style={{ background: '#000', color: '#fff' }}>
                <h1 className="confera-title" style={{ color: '#fff' }}>WORK<br /><span style={{ color: '#E3F77E' }}>WITH ME</span></h1>
                <div className="confera-subtitle-box" style={{ background: '#fff', color: '#000' }}>
                    Let's Build Something Awesome
                </div>
            </div>

            <div className="container py-20 px-4">
                <div className="max-w-4xl mx-auto space-y-12">
                    {/* Intro */}
                    <div className="text-center space-y-6">
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Why Partner With Us?</h2>
                        <p className="text-xl md:text-2xl font-bold text-gray-500 max-w-2xl mx-auto">
                            Deenice Store is the premier destination for tech enthusiasts in Kenya. We curate the best gear and create content that resonates with a growing community of creators and professionals.
                        </p>
                    </div>

                    {/* Stats / Benefits Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { icon: Users, title: "Engaged Community", desc: "Access a loyal audience of tech-savvy buyers and early adopters." },
                            { icon: Zap, title: "High-Impact Content", desc: "We create premium, aesthetic content that showcases your product's best features." },
                            { icon: Handshake, title: "Trusted Authority", desc: "Our reviews and recommendations are trusted by thousands of Kenyan shoppers." }
                        ].map((stat, i) => (
                            <div key={i} className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
                                <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center text-white mb-6">
                                    <stat.icon size={24} />
                                </div>
                                <h3 className="text-xl font-black uppercase mb-3 tracking-tight">{stat.title}</h3>
                                <p className="font-medium text-gray-500 leading-relaxed">{stat.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Contact Section */}
                    <div className="bg-[#E3F77E] rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4 text-blackish">Ready to Talk?</h3>
                                    <p className="font-medium text-xl opacity-80 leading-relaxed text-blackish">Do you have a product that needs the Deenice touch? Send us a pitch or just say hello.</p>
                                </div>
                                <div className="space-y-4">
                                    <a href={`mailto:${STORE_EMAIL}?subject=Partnership Inquiry`} className="flex items-center gap-3 text-blackish font-bold hover:opacity-70 transition-opacity">
                                        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-[#E3F77E]">
                                            <Mail size={18} />
                                        </div>
                                        {STORE_EMAIL}
                                    </a>
                                    <a href={SOCIAL_LINKS.instagram} target="_blank" className="flex items-center gap-3 text-blackish font-bold hover:opacity-70 transition-opacity">
                                        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-[#E3F77E]">
                                            <Instagram size={18} />
                                        </div>
                                        @Deenice.Store
                                    </a>
                                </div>
                            </div>

                            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/50">
                                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Message sent! I will get back to you soon.'); }}>
                                    <div>
                                        <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Brand Name</label>
                                        <input type="text" placeholder="e.g. Acme Corp" required className="w-full p-4 bg-gray-50 rounded-xl font-bold outline-none focus:ring-2 focus:ring-black/10 transition-all border-none" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Contact Email</label>
                                        <input type="email" placeholder="you@company.com" required className="w-full p-4 bg-gray-50 rounded-xl font-bold outline-none focus:ring-2 focus:ring-black/10 transition-all border-none" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Project Details</label>
                                        <textarea placeholder="Tell me about your vision..." required rows={4} className="w-full p-4 bg-gray-50 rounded-xl font-bold outline-none focus:ring-2 focus:ring-black/10 transition-all border-none resize-none"></textarea>
                                    </div>
                                    <button type="submit" className="w-full bg-black text-white p-4 rounded-xl font-black uppercase tracking-widest hover:scale-[1.02] transition-transform shadow-lg flex items-center justify-center gap-2">
                                        Submit Pitch <ArrowRight size={18} />
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Decorative Background Pattern */}
                        <div className="absolute -bottom-20 -right-20 opacity-10 pointer-events-none">
                            <Handshake size={300} strokeWidth={1} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="confera-footer">
                <p>Deenice.Store • Partnerships • 2025</p>
            </div>
        </div>
    );
};

export default WorkWithMe;

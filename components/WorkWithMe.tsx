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
                            <div key={i} className="border-2 border-black bg-white p-8 group hover:-translate-y-2 transition-transform shadow-[4px_4px_0_#000]">
                                <stat.icon size={48} className="mb-6 group-hover:scale-110 transition-transform" />
                                <h3 className="text-xl font-black uppercase mb-2">{stat.title}</h3>
                                <p className="font-bold text-gray-500 text-sm">{stat.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Contact Section */}
                    <div className="bg-[#E3F77E] border-2 border-black p-8 md:p-12 relative overflow-hidden">
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                            <div>
                                <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-2">Ready to Talk?</h3>
                                <p className="font-bold text-lg opacity-80">Send us a pitch or just say hello.</p>
                            </div>
                            <div className="flex flex-col gap-6 w-full md:w-1/2">
                                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Message sent! I will get back to you soon.'); }}>
                                    <input type="text" placeholder="Brand Name" required className="w-full p-4 border-2 border-black font-bold outline-none" />
                                    <input type="email" placeholder="Your Email" required className="w-full p-4 border-2 border-black font-bold outline-none" />
                                    <textarea placeholder="Tell me about your project..." required rows={4} className="w-full p-4 border-2 border-black font-bold outline-none resize-none"></textarea>
                                    <button type="submit" className="w-full bg-black text-white p-4 font-black uppercase tracking-widest hover:bg-white hover:text-black border-2 border-black transition-all">Submit Pitch</button>
                                </form>
                                <div className="flex flex-col gap-2">
                                    <a
                                        href={`mailto:${STORE_EMAIL}?subject=Partnership Inquiry`}
                                        className="text-black font-black text-sm uppercase flex items-center gap-2 hover:opacity-70 transition-opacity"
                                    >
                                        <Mail size={16} /> Or direct email
                                    </a>
                                    <a
                                        href={SOCIAL_LINKS.instagram}
                                        target="_blank"
                                        className="text-black font-black text-sm uppercase flex items-center gap-2 hover:opacity-70 transition-opacity"
                                    >
                                        <Instagram size={16} /> DM on Instagram
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Background Pattern */}
                        <div className="absolute top-0 right-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
                            <Handshake size={400} />
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

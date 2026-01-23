import React, { useState } from 'react';
import { Mail, Instagram, ArrowRight, CheckCircle, Handshake, Users, Zap, Heart, ShieldCheck, Youtube, Smartphone, Monitor, Music, Tool, MessageSquareText } from 'lucide-react';
import { STORE_EMAIL, SOCIAL_LINKS } from '../constants';

const WorkWithMe: React.FC = () => {
    return (
        <div className="confera-page" style={{ backgroundColor: '#fff' }}>
            {/* Header Strip */}
            <div className="confera-header-strip">
                <div className="font-black text-black text-xl tracking-tighter uppercase">COLLABORATION HUB</div>
                <div className="flex gap-4 text-sm font-bold text-black uppercase overflow-hidden whitespace-nowrap">
                    <span className="animate-marquee">BRAND PARTNERSHIPS • SPONSORED REVIEWS • AFFILIATE PROGRAMS • BRAND PARTNERSHIPS • SPONSORED REVIEWS • AFFILIATE PROGRAMS</span>
                </div>
            </div>

            {/* Hero Section */}
            <div className="confera-hero" style={{ background: '#000', color: '#fff', padding: '6rem 2rem 4rem 2rem' }}>
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="confera-title" style={{ color: '#fff', fontSize: 'clamp(2.5rem, 8vw, 6rem)', lineHeight: 1, marginBottom: '2rem' }}>
                        COLLABORATION<br /><span style={{ color: '#E3F77E' }}>HUB</span>
                    </h1>
                    <div className="inline-block px-6 py-2 bg-[#E3F77E] text-black font-black uppercase text-lg mb-8">
                        WELCOME TO DEENICE STORE
                    </div>
                    <p className="text-xl font-medium opacity-80 leading-relaxed max-w-3xl mx-auto">
                        Welcome to my collaboration hub! I'm Deenice, your trusted tech reviewer from East Africa, bringing honest, comedic, and lifestyle-integrated reviews to a growing, engaged community of youth—both tech-savvy and everyday users.
                    </p>
                </div>
            </div>

            <div className="container py-20 px-4">
                <div className="max-w-5xl mx-auto space-y-24">

                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { label: "TikTok Followers", value: "3K+", subtext: "In just 4 months", icon: Users },
                            { label: "Total Likes", value: "130K+", subtext: "Highly engaged", icon: Heart },
                            { label: "Key Categories", value: "Tech & Lifestyle", subtext: "Smartphones, Audio, Creator Tools", icon: Zap }
                        ].map((stat, i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-shadow text-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-black text-[#E3F77E] rounded-full mb-4">
                                    <stat.icon size={24} />
                                </div>
                                <div className="text-4xl font-black mb-2 tracking-tight text-black">{stat.value}</div>
                                <div className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-1">{stat.label}</div>
                                <div className="text-xs font-medium text-gray-400">{stat.subtext}</div>
                            </div>
                        ))}
                    </div>

                    {/* Mission Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                        <div className="space-y-6">
                            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-tight">
                                Passion for <span className="text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-500">Tech Exploration</span>
                            </h2>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                My passion is exploring all things tech, from mobile phones to everyday essentials. While my presence is blossoming, fueled by popular reviews on iPhones, laptops, and soundbars, my commitment to authenticity remains unchanged.
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                I partner with brands through sponsored reviews, affiliate partnerships, product integrations, and giveaways—but <strong>only for products I genuinely believe in and have tested myself.</strong>
                            </p>
                        </div>
                        <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                            <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
                                <ShieldCheck className="text-[#E3F77E] fill-black" /> Non-Negotiables
                            </h3>
                            <ul className="space-y-4">
                                {[
                                    "Products must be tested by me personally.",
                                    "I maintain full creative control to ensure authenticity.",
                                    "Alignment with my content's style is non-negotiable.",
                                    "No engagement with crypto/NFT projects.",
                                    "No reviews of untested products."
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <CheckCircle size={20} className="text-black shrink-0 mt-1" />
                                        <span className="font-medium text-gray-700">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Partnership Details */}
                    <div className="bg-black text-white rounded-3xl p-10 md:p-16 relative overflow-hidden">
                        <div className="relative z-10 max-w-3xl">
                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-6">Partnership Value</h2>
                            <p className="text-xl font-medium opacity-90 mb-8 leading-relaxed">
                                Successful partnerships may lead to featuring the product in my curated store, <strong>Deenice.store</strong>, where I list items I'm personally connected to and affiliated with long-term. I can also utilize exclusive affiliate codes or direct sales through my store.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                                <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                                    <div className="font-bold text-[#E3F77E] mb-1 uppercase text-sm">Store Integration</div>
                                    <div className="text-sm opacity-80">Direct sales or exclusive affiliate codes through my platform.</div>
                                </div>
                                <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                                    <div className="font-bold text-[#E3F77E] mb-1 uppercase text-sm">Tailored Packages</div>
                                    <div className="text-sm opacity-80">Custom deals with clear workflows and turnaround times.</div>
                                </div>
                            </div>
                            <a href="#contact" className="inline-flex items-center gap-2 bg-[#E3F77E] text-black px-8 py-4 rounded-full font-black uppercase tracking-wider hover:bg-white transition-colors">
                                Let's Discuss Rates <ArrowRight size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div id="contact" className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-4xl font-black uppercase tracking-tight mb-4">Let's Create Together</h2>
                                <p className="text-lg text-gray-600">
                                    Ready to drive value? Please reach out with your brand, product details, campaign vision, timeline, and budget considerations.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <a href="mailto:deenicevida@gmail.com" className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-black transition-colors">
                                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center">
                                        <Mail size={18} />
                                    </div>
                                    <div className="font-bold text-lg">deenicevida@gmail.com</div>
                                </a>
                                <a href={SOCIAL_LINKS.instagram} target="_blank" className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-black transition-colors">
                                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center">
                                        <Instagram size={18} />
                                    </div>
                                    <div className="font-bold text-lg">@Deenice.Store</div>
                                </a>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl">
                            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Campaign details received! Deenice will reach out soon.'); }}>
                                <div className="space-y-4">
                                    <input type="text" placeholder="Brand Name" required className="w-full p-4 bg-gray-50 rounded-xl font-medium outline-none focus:ring-2 focus:ring-black" />
                                    <input type="email" placeholder="Contact Email" required className="w-full p-4 bg-gray-50 rounded-xl font-medium outline-none focus:ring-2 focus:ring-black" />
                                    <input type="text" placeholder="Budget & Timeline" className="w-full p-4 bg-gray-50 rounded-xl font-medium outline-none focus:ring-2 focus:ring-black" />
                                    <textarea placeholder="Tell me about your vision..." required rows={4} className="w-full p-4 bg-gray-50 rounded-xl font-medium outline-none focus:ring-2 focus:ring-black resize-none"></textarea>
                                </div>
                                <button type="submit" className="w-full bg-black text-white p-5 rounded-xl font-black uppercase tracking-wider hover:scale-[1.02] transition-transform">
                                    Submit Pitch
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div className="confera-footer" style={{ borderTop: '2px solid black', paddingTop: '2rem' }}>
                <div className="container px-4 text-center space-y-4">
                    <p className="font-black text-2xl uppercase tracking-tighter">LET'S CREATE AUTHENTIC CONTENT THAT RESONATES</p>
                    <p className="font-bold text-gray-500 text-sm uppercase tracking-widest leading-relaxed max-w-md mx-auto">
                        Deenice.Store • Authentic Tech Reviews • {new Date().getFullYear()}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WorkWithMe;

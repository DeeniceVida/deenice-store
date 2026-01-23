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
                    <h1 className="confera-title" style={{ color: '#fff', fontSize: 'clamp(3rem, 10vw, 8rem)', lineHeight: 0.9, marginBottom: '2rem' }}>
                        WORK<br /><span style={{ color: '#E3F77E' }}>WITH DEENICE</span>
                    </h1>
                    <div className="inline-block px-6 py-2 bg-[#E3F77E] text-black font-black uppercase text-xl mb-8 transform -rotate-1">
                        AUTHENTIC TECH STORYTELLING
                    </div>
                    <p className="text-xl md:text-2xl font-bold opacity-80 leading-relaxed max-w-2xl mx-auto">
                        Honest, comedic, and lifestyle-integrated reviews for the modern creator. Based in East Africa, reaching a global community.
                    </p>
                </div>
            </div>

            <div className="container py-20 px-4">
                <div className="max-w-6xl mx-auto space-y-24">

                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { label: "TikTok Followers", value: "3,000+", subtext: "Grown in 4 months", icon: Users },
                            { label: "Content Likes", value: "130,000+", subtext: "Engaged & active", icon: Heart },
                            { label: "Target Audience", value: "Youth & Tech", subtext: "East & Central Africa", icon: Zap }
                        ].map((stat, i) => (
                            <div key={i} className="bg-black text-white p-10 rounded-[2rem] border-2 border-transparent hover:border-[#E3F77E] transition-all group">
                                <stat.icon size={32} className="text-[#E3F77E] mb-6 group-hover:scale-110 transition-transform" />
                                <div className="text-5xl font-black mb-2 tracking-tighter">{stat.value}</div>
                                <div className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-1">{stat.label}</div>
                                <div className="text-xs font-bold text-[#E3F77E] opacity-60 italic">{stat.subtext}</div>
                            </div>
                        ))}
                    </div>

                    {/* About Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                                THE <span style={{ WebkitTextStroke: '1px black', color: 'transparent' }}>DEENICE</span> TOUCH
                            </h2>
                            <p className="text-xl font-bold text-gray-600 leading-relaxed">
                                I'm your trusted tech reviewer from East Africa. I bring honest, comedic, and lifestyle-integrated reviews to a growing community of youth—both tech-savvy and everyday users.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#E3F77E] rounded-2xl flex items-center justify-center text-black shadow-lg">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <span className="font-black uppercase tracking-tight">Authenticity Over Everything</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#E3F77E] rounded-2xl flex items-center justify-center text-black shadow-lg">
                                        <MessageSquareText size={24} />
                                    </div>
                                    <span className="font-black uppercase tracking-tight">Comedic Lifestyle Integration</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-100 rounded-[3rem] p-12 space-y-8">
                            <h3 className="text-2xl font-black uppercase">What We Review</h3>
                            <div className="flex flex-wrap gap-3">
                                {['iPhones', 'Laptops', 'Soundbars', 'Creator Tools', 'Everyday Tech', 'Essentials'].map((item, i) => (
                                    <span key={i} className="px-5 py-3 bg-white border-2 border-black rounded-full font-black text-sm uppercase transition-colors hover:bg-black hover:text-white cursor-default">
                                        {item}
                                    </span>
                                ))}
                            </div>
                            <p className="text-sm font-bold text-gray-500 italic">
                                "Successful partnerships may lead to featuring the product in my curated store, Deenice.store, where I list items I'm personally connected to."
                            </p>
                        </div>
                    </div>

                    {/* Partnerships Grid */}
                    <div className="space-y-12">
                        <div className="text-center">
                            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">How We Partner</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { title: "Sponsored Reviews", icon: Smartphone, desc: "In-depth, honest reviews with my signature comedic style." },
                                { title: "Affiliate Programs", icon: ArrowRight, desc: "Long-term partnerships with exclusive codes or store listings." },
                                { title: "Product Integrations", icon: Monitor, desc: "Subtle but effective lifestyle integration in routine content." },
                                { title: "Giveaways", icon: Zap, desc: "Driving massive engagement while rewarding our loyal community." }
                            ].map((service, i) => (
                                <div key={i} className="p-8 border-2 border-black rounded-3xl hover:bg-[#E3F77E] transition-colors group">
                                    <service.icon size={32} className="mb-6 group-hover:scale-110 transition-transform" />
                                    <h3 className="text-xl font-black uppercase mb-3 leading-tight">{service.title}</h3>
                                    <p className="font-bold text-gray-500 text-sm leading-relaxed group-hover:text-black">{service.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* The Non-Negotiables */}
                    <div className="bg-black text-white rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
                        <div className="relative z-10 max-w-3xl">
                            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 text-[#E3F77E]">The Non-Negotiables</h2>
                            <ul className="space-y-ptr font-black text-lg md:text-xl uppercase space-y-6">
                                <li className="flex gap-4">
                                    <CheckCircle className="text-[#E3F77E] shrink-0" size={28} />
                                    <span>Products must be personally tested by me</span>
                                </li>
                                <li className="flex gap-4">
                                    <CheckCircle className="text-[#E3F77E] shrink-0" size={28} />
                                    <span>Full creative control maintains my authenticity</span>
                                </li>
                                <li className="flex gap-4">
                                    <CheckCircle className="text-[#E3F77E] shrink-0" size={28} />
                                    <span>No engagement with Crypto or NFT projects</span>
                                </li>
                                <li className="flex gap-4">
                                    <CheckCircle className="text-[#E3F77E] shrink-0" size={28} />
                                    <span>Alignment with content style is non-negotiable</span>
                                </li>
                            </ul>
                        </div>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none hidden lg:block">
                            <ShieldCheck size={400} />
                        </div>
                    </div>

                    {/* Enhanced Contact Section */}
                    <div className="bg-[#E3F77E] rounded-[3rem] p-8 md:p-16 relative shadow-2xl overflow-hidden">
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
                            <div className="space-y-8">
                                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-blackish">Pitch Your Vision</h2>
                                <p className="text-xl font-bold text-blackish opacity-80 leading-relaxed">
                                    Interested in collaborating? Please include your brand, product details, campaign vision, timeline, and budget considerations.
                                </p>
                                <div className="space-y-4">
                                    <a href={`mailto:deenicevida@gmail.com?subject=Brand Collaboration`} className="flex items-center gap-4 p-6 bg-black text-white rounded-3xl hover:-translate-y-1 transition-all group">
                                        <div className="w-12 h-12 bg-[#E3F77E] rounded-2xl flex items-center justify-center text-black">
                                            <Mail size={24} />
                                        </div>
                                        <div>
                                            <div className="text-xs font-black uppercase text-[#E3F77E]">Email Outreach</div>
                                            <div className="text-xl font-black uppercase">deenicevida@gmail.com</div>
                                        </div>
                                    </a>
                                    <a href={SOCIAL_LINKS.instagram} target="_blank" className="flex items-center gap-4 p-6 bg-white border-2 border-black text-black rounded-3xl hover:-translate-y-1 transition-all">
                                        <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-[#E3F77E]">
                                            <Instagram size={24} />
                                        </div>
                                        <div>
                                            <div className="text-xs font-black uppercase opacity-50">Social Handle</div>
                                            <div className="text-xl font-black uppercase">@Deenice.Store</div>
                                        </div>
                                    </a>
                                </div>
                            </div>

                            <div className="bg-white p-10 rounded-[2.5rem] border-2 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
                                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Campaign details received! Deenice will reach out soon.'); }}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Brand & Product</label>
                                            <input type="text" placeholder="e.g. Acme Tech" required className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl font-bold outline-none transition-all" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Campaign Type</label>
                                            <select required className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl font-bold outline-none transition-all">
                                                <option>Sponsored Review</option>
                                                <option>Affiliate Program</option>
                                                <option>Product Integration</option>
                                                <option>Giveaway</option>
                                                <option>Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Available Budget</label>
                                            <input type="text" placeholder="USD / KES" className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl font-bold outline-none transition-all" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Preferred Timeline</label>
                                            <input type="text" placeholder="e.g. Next Month" required className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl font-bold outline-none transition-all" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Campaign Vision</label>
                                        <textarea placeholder="Detail your creative goals..." required rows={4} className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl font-bold outline-none transition-all resize-none"></textarea>
                                    </div>
                                    <button type="submit" className="w-full bg-black text-white p-6 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-900 transition-colors flex items-center justify-center gap-3 text-lg">
                                        LAUNCH CAMPAIGN <ArrowRight size={24} />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="confera-footer" style={{ borderTop: '2px solid black', paddingTop: '2rem' }}>
                <div className="container px-4 text-center space-y-4">
                    <p className="font-black text-2xl uppercase tracking-tighter">LET'S CREATE SOMETHING VALUABLE TOGETHER</p>
                    <p className="font-bold text-gray-500 text-sm uppercase tracking-widest leading-relaxed max-w-md mx-auto">
                        Deenice.Store • Authentic Tech Reviews • {new Date().getFullYear()}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WorkWithMe;

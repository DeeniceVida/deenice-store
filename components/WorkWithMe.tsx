import React from 'react';
import { Mail, Instagram, ArrowRight, CheckCircle, Users, Zap, Heart, ShieldCheck, Smartphone, Monitor, MessageSquareText } from 'lucide-react';
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
                <div className="max-w-5xl mx-auto text-center">
                    <h1 className="confera-title" style={{ color: '#fff', fontSize: 'clamp(3rem, 10vw, 7rem)', lineHeight: 0.9, marginBottom: '2rem' }}>
                        WORK<br /><span style={{ color: '#E3F77E' }}>WITH DEENICE</span>
                    </h1>
                    <p className="text-xl md:text-3xl font-black uppercase tracking-tight leading-tight max-w-3xl mx-auto mb-8">
                        "Welcome to my collaboration hub! I'm Deenice, your trusted tech reviewer from East Africa."
                    </p>
                    <div className="inline-block px-8 py-3 bg-[#E3F77E] text-black font-black uppercase text-lg transform -rotate-1 rounded-full">
                        Honest • Comedic • Lifestyle-Integrated
                    </div>
                </div>
            </div>

            <div className="container py-20 px-4">
                <div className="max-w-6xl mx-auto space-y-24">

                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { label: "TikTok Followers", value: "3,000+", subtext: "Grown in 4 months", icon: Users },
                            { label: "Content Likes", value: "130,000+", subtext: "Video engagement", icon: Heart },
                            { label: "Core Topics", value: "Tech & Lifestyle", subtext: "iPhones, Laptops, Audio", icon: Zap }
                        ].map((stat, i) => (
                            <div key={i} className="bg-black text-white p-10 rounded-[2rem] border-2 border-transparent hover:border-[#E3F77E] transition-all group">
                                <stat.icon size={32} className="text-[#E3F77E] mb-6 group-hover:scale-110 transition-transform" />
                                <div className="text-5xl font-black mb-2 tracking-tighter">{stat.value}</div>
                                <div className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-1">{stat.label}</div>
                                <div className="text-xs font-bold text-[#E3F77E] opacity-60 italic">{stat.subtext}</div>
                            </div>
                        ))}
                    </div>

                    {/* Personal Statement / Bio */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                        <div className="space-y-8">
                            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                                The <span className="text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-500" style={{ WebkitTextStroke: '1px black' }}>Mission</span>
                            </h2>
                            <div className="prose prose-lg text-black font-medium space-y-6 leading-relaxed">
                                <p>
                                    My passion is exploring all things tech, from mobile phones to everyday essentials. I bring honest, comedic, and lifestyle-integrated reviews to a growing, engaged community of youth—both tech-savvy and everyday users.
                                </p>
                                <p>
                                    While my presence is blossoming (fueled by popular reviews on iPhones, laptops, soundbars, and creator tools), I maintain full creative control to ensure authenticity. Alignment with my content's style and usefulness to my audience is non-negotiable.
                                </p>
                            </div>
                            <div className="flex gap-4 flex-wrap">
                                <div className="px-6 py-3 bg-gray-100 rounded-xl font-bold uppercase text-xs tracking-wider flex items-center gap-2">
                                    <ShieldCheck size={16} /> Authenticity First
                                </div>
                                <div className="px-6 py-3 bg-gray-100 rounded-xl font-bold uppercase text-xs tracking-wider flex items-center gap-2">
                                    <MessageSquareText size={16} /> Creative Control
                                </div>
                            </div>
                        </div>
                        <div className="bg-[#f0f0f0] p-10 rounded-[3rem] space-y-8">
                            <h3 className="text-3xl font-black uppercase">Partnership Model</h3>
                            <p className="font-bold text-gray-600">
                                I partner with brands through sponsored reviews, affiliate partnerships, product integrations, and giveaways—but only for products I genuinely believe in and have tested myself.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
                                    <div className="bg-black text-white p-2 rounded-lg"><Smartphone size={20} /></div>
                                    <span className="font-black uppercase text-sm">Sponsored Reviews</span>
                                </li>
                                <li className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
                                    <div className="bg-black text-white p-2 rounded-lg"><ArrowRight size={20} /></div>
                                    <span className="font-black uppercase text-sm">Affiliate Partnerships</span>
                                </li>
                                <li className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
                                    <div className="bg-black text-white p-2 rounded-lg"><Monitor size={20} /></div>
                                    <span className="font-black uppercase text-sm">Product Integrations</span>
                                </li>
                                <li className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
                                    <div className="bg-black text-white p-2 rounded-lg"><Zap size={20} /></div>
                                    <span className="font-black uppercase text-sm">Giveaways</span>
                                </li>
                            </ul>
                            <p className="text-xs font-bold text-gray-500 italic mt-4">
                                *Successful partnerships may lead to featuring the product in my curated store, Deenice.store.
                            </p>
                        </div>
                    </div>

                    {/* Terms & Conditions */}
                    <div className="bg-black text-white rounded-[3rem] p-12 relative overflow-hidden">
                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-4xl font-black uppercase tracking-tighter mb-6 text-[#E3F77E]">Collaboration Terms</h2>
                                <p className="font-bold text-gray-300 mb-6">
                                    I welcome discussions on tailored package deals and can advise on ideal workflows and turnaround times. Rates and detailed processes are available upon request.
                                </p>
                                <div className="space-y-3">
                                    <div className="flex gap-3 items-center text-sm font-bold uppercase text-[#E3F77E]">
                                        <CheckCircle size={16} /> Brands must provide product & key contacts
                                    </div>
                                    <div className="flex gap-3 items-center text-sm font-bold uppercase text-[#E3F77E]">
                                        <CheckCircle size={16} /> No Crypto/NFT Projects
                                    </div>
                                    <div className="flex gap-3 items-center text-sm font-bold uppercase text-[#E3F77E]">
                                        <CheckCircle size={16} /> No Untested Products
                                    </div>
                                </div>
                            </div>
                            <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-gray-800">
                                <h3 className="text-xl font-black uppercase mb-4">Let's create authentic content that resonates and drives value together!</h3>
                                <p className="text-sm text-gray-400 font-medium">
                                    For collaborations, please reach out via email with your brand, product details, campaign vision, timeline, and budget considerations.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Pitch Form */}
                    <div className="bg-[#E3F77E] rounded-[3rem] p-8 md:p-16 relative shadow-2xl overflow-hidden">
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
                            <div className="space-y-8">
                                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-blackish">Start The Conversation</h2>
                                <div className="space-y-4">
                                    <a href={`mailto:deenicevida@gmail.com?subject=Brand Collaboration`} className="flex items-center gap-4 p-6 bg-black text-white rounded-3xl hover:-translate-y-1 transition-all group">
                                        <div className="w-12 h-12 bg-[#E3F77E] rounded-2xl flex items-center justify-center text-black">
                                            <Mail size={24} />
                                        </div>
                                        <div>
                                            <div className="text-xs font-black uppercase text-[#E3F77E]">Direct Email</div>
                                            <div className="text-xl font-black uppercase">deenicevida@gmail.com</div>
                                        </div>
                                    </a>
                                    <a href={SOCIAL_LINKS.instagram} target="_blank" className="flex items-center gap-4 p-6 bg-white border-2 border-black text-black rounded-3xl hover:-translate-y-1 transition-all">
                                        <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-[#E3F77E]">
                                            <Instagram size={24} />
                                        </div>
                                        <div>
                                            <div className="text-xs font-black uppercase opacity-50">Social Media</div>
                                            <div className="text-xl font-black uppercase">@Deenice.Store</div>
                                        </div>
                                    </a>
                                </div>
                            </div>

                            <div className="bg-white p-10 rounded-[2.5rem] border-2 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
                                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Campaign details received! Deenice will reach out soon.'); }}>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Brand & Product Details</label>
                                        <input type="text" placeholder="e.g. Acme Tech - Smart Home Hub" required className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl font-bold outline-none transition-all" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Budget Considerations</label>
                                            <input type="text" placeholder="USD / KES" className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl font-bold outline-none transition-all" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Timeline</label>
                                            <input type="text" placeholder="e.g. Late Feb" required className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl font-bold outline-none transition-all" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Campaign Vision</label>
                                        <textarea placeholder="Tell me about your vision..." required rows={4} className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl font-bold outline-none transition-all resize-none"></textarea>
                                    </div>
                                    <button type="submit" className="w-full bg-black text-white p-6 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-900 transition-colors flex items-center justify-center gap-3 text-lg">
                                        SEND PROPOSAL <ArrowRight size={24} />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="confera-footer" style={{ borderTop: '2px solid black', paddingTop: '2rem' }}>
                <div className="container px-4 text-center space-y-4">
                    <p className="font-bold text-gray-500 text-sm uppercase tracking-widest leading-relaxed max-w-md mx-auto">
                        Deenice.Store • Authentic Tech Reviews • {new Date().getFullYear()}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WorkWithMe;

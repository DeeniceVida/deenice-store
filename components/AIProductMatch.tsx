import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, Sparkles, ArrowRight, MessageCircle, RefreshCw } from 'lucide-react';
import { Product } from '../types';
import { MOCK_PRODUCTS, WHATSAPP_NUMBER } from '../constants';
import { useNavigate } from 'react-router-dom';
import { getSmartRecommendations } from '../services/gemini';

interface Message {
    id: string;
    sender: 'ai' | 'user';
    text: string;
    options?: string[];
    type?: 'question' | 'recommendation' | 'final';
}

type Step = 'INTRO' | 'CATEGORY' | 'BRAND' | 'USAGE' | 'BUDGET' | 'FINISHED';

const AIProductMatch: React.FC = () => {
    const navigate = useNavigate();
    const chatEndRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [currentStep, setCurrentStep] = useState<Step>('INTRO');

    // User Choices
    const [prefs, setPrefs] = useState({
        category: '',
        brand: '',
        usage: '',
        budget: ''
    });

    const [recommendations, setRecommendations] = useState<Product[]>([]);

    useEffect(() => {
        // Initial Greeting
        addBotMessage("Hi! I'm Deenice AI. I can help you find the perfect tech gear. Ready to start?", ["Let's go!", "Just browsing"]);
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const addBotMessage = (text: string, options?: string[], type: Message['type'] = 'question') => {
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                sender: 'ai',
                text,
                options,
                type
            }]);
        }, 800); // Slight delay for realism
    };

    const addUserMessage = (text: string) => {
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            sender: 'user',
            text
        }]);
    };

    const handleOptionSelect = (option: string) => {
        if (isTyping) return; // Prevent double clicks while bot is "thinking"

        addUserMessage(option);

        // State Machine Logic
        switch (currentStep) {
            case 'INTRO':
                if (option === "Just browsing") {
                    addBotMessage("No problem! Feel free to explore the shop.", [], 'final');
                    setCurrentStep('FINISHED');
                } else {
                    addBotMessage("Great! First, what are you looking to upgrade?", ["Phones", "Laptops", "PC Parts"]);
                    setCurrentStep('CATEGORY');
                }
                break;

            case 'CATEGORY':
                setPrefs(prev => ({ ...prev, category: option }));

                // Determine next step based on choice
                if (option === "Phones") {
                    addBotMessage("Nice choice. Which brand do you prefer?", ["iPhone", "Samsung", "Google Pixel"]);
                    setCurrentStep('BRAND');
                } else if (option === "Laptops") {
                    addBotMessage("Solid. Any specific brand in mind?", ["Dell", "HP", "Macbook"]);
                    setCurrentStep('BRAND');
                } else {
                    addBotMessage("Building a beast? Which component?", ["GPU", "CPU", "RAM", "Monitor"]);
                    setCurrentStep('BRAND');
                }
                break;

            case 'BRAND':
                setPrefs(prev => ({ ...prev, brand: option }));
                addBotMessage("Got it. What will you use it for mainly?", ["Gaming", "Business/Work", "Content Creation", "General Use"]);
                setCurrentStep('USAGE');
                break;

            case 'USAGE':
                setPrefs(prev => ({ ...prev, usage: option }));
                addBotMessage("Last question: What's your budget range?", ["Economy", "Mid-Range", "High-End / Pro"]);
                setCurrentStep('BUDGET');
                break;

            case 'BUDGET':
                const finalPrefs = { ...prefs, budget: option };
                setPrefs(finalPrefs);
                setCurrentStep('FINISHED');
                fetchRecommendations(finalPrefs);
                break;
        }
    };

    const fetchRecommendations = async (finalPrefs: typeof prefs) => {
        const msg = "Analyzing our inventory for " + finalPrefs.brand + " " + finalPrefs.category + " suited for " + finalPrefs.usage + "...";
        addBotMessage(msg, undefined, 'question');

        try {
            const productIds = await getSmartRecommendations({ ...finalPrefs, vibe: 'Modern' }, MOCK_PRODUCTS);
            const foundProducts = MOCK_PRODUCTS.filter(p => productIds.includes(p.id));
            const finalRecs = foundProducts.length > 0 ? foundProducts : MOCK_PRODUCTS.slice(0, 3);

            setRecommendations(finalRecs);

            setTimeout(() => {
                addBotMessage("Here are my top picks for your setup!", undefined, 'recommendation');
            }, 1500);

        } catch (error) {
            console.error(error);
            addBotMessage("I had trouble connecting to the brain, but here are some popular choices!", undefined, 'recommendation');
            setRecommendations(MOCK_PRODUCTS.slice(0, 3));
        }
    };

    const handleContact = () => {
        const productNames = recommendations.map(p => p.name).join(', ');
        const message = "Hi! I got an AI recommendation for: " + productNames + ".";
        window.open("https://wa.me/" + WHATSAPP_NUMBER.replace('+', '') + "?text=" + encodeURIComponent(message), '_blank');
    };

    const reset = () => {
        setMessages([]);
        setRecommendations([]);
        setCurrentStep('INTRO');
        addBotMessage("Hi! I'm Deenice AI. I can help you find the perfect tech gear. Ready to start?", ["Let's go!", "Just browsing"]);
    };

    return (
        <div className="min-h-screen bg-gray-50/50 pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col" style={{ height: '80vh' }}>

                <div className="bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10 sticky top-0">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary animate-pulse">
                            <Bot size={24} />
                        </div>
                        <div>
                            <h1 className="font-black text-xl tracking-tight">Deenice <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">AI Genius</span></h1>
                            <p className="text-xs text-gray-400 font-medium">Powered by Gemini • Personal Shopper</p>
                        </div>
                    </div>
                    <button onClick={reset} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors" title="Restart Chat">
                        <RefreshCw size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-dots-pattern">
                    {messages.map((msg) => (
                        <div key={msg.id} className={"flex " + (msg.sender === 'user' ? 'justify-end' : 'justify-start')}>

                            {msg.sender === 'ai' && (
                                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0 mr-3 mt-1 shadow-lg">
                                    <Sparkles size={14} />
                                </div>
                            )}

                            <div className={"max-w-[85%] rounded-2xl p-4 shadow-sm " + (msg.sender === 'user' ? 'bg-black text-white rounded-br-none' : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none')}>
                                <p className="leading-relaxed">{msg.text}</p>

                                {msg.options && msg.options.length > 0 && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                                        {msg.options.map(opt => (
                                            <button
                                                key={opt}
                                                onClick={() => handleOptionSelect(opt)}
                                                className="px-4 py-3 bg-gray-50 hover:bg-primary/5 hover:border-primary border border-gray-200 rounded-xl text-left text-sm font-semibold transition-all duration-200 flex justify-between items-center group"
                                            >
                                                {opt}
                                                <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {msg.sender === 'user' && (
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 ml-3 mt-1">
                                    <User size={14} className="text-gray-500" />
                                </div>
                            )}
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0 mr-3 mt-1">
                                <Sparkles size={14} />
                            </div>
                            <div className="bg-gray-100 rounded-2xl rounded-bl-none p-4 flex gap-1 items-center h-12">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                            </div>
                        </div>
                    )}

                    {recommendations.length > 0 && (
                        <div className="space-y-6 mt-8 border-t border-gray-100 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="text-center space-y-2">
                                <h3 className="text-2xl font-black">Your Perfect Match</h3>
                                <p className="text-gray-500">Based on your preferences, these are the best fits.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {recommendations.map(product => (
                                    <div
                                        key={product.id}
                                        className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 relative"
                                        onClick={() => navigate('/shop')}
                                    >
                                        <div className="absolute top-3 right-3 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded-full backdrop-blur-md z-10">
                                            {Math.floor(85 + Math.random() * 10)}% Match
                                        </div>
                                        <div className="aspect-square overflow-hidden bg-gray-50">
                                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="p-4">
                                            <div className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">{product.category}</div>
                                            <h4 className="font-bold text-lg mb-2 leading-tight">{product.name}</h4>
                                            <div className="flex justify-between items-center">
                                                <span className="font-black text-lg">{product.currency} {product.price.toLocaleString()}</span>
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                                    <ArrowRight size={16} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-center pt-6 pb-2">
                                <button
                                    onClick={handleContact}
                                    className="btn-primary flex items-center gap-3 px-8 py-4 text-lg rounded-full shadow-lg shadow-primary/20 hover:scale-105 hover:shadow-primary/40 transition-all"
                                >
                                    <MessageCircle size={22} />
                                    <span>Buy Now via WhatsApp</span>
                                </button>
                            </div>
                        </div>
                    )}

                    <div ref={chatEndRef} />
                </div>
            </div>
        </div>
    );
};

export default AIProductMatch;

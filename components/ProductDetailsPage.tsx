import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product, ProductVariation } from '../types';
import {
    ChevronLeft,
    Minus,
    Plus,
    ShoppingCart,
    Star,
    Truck,
    Clock,
    Package,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    Shield,
    Heart,
    Zap,
    Coffee
} from 'lucide-react';

interface ProductDetailsPageProps {
    products: Product[];
    onAddToCart: (product: Product, color: string, quantity: number, variation?: ProductVariation) => void;
}

const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ products, onAddToCart }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [selectedQty, setSelectedQty] = useState(1);
    const [curVar, setCurVar] = useState<ProductVariation | undefined>(undefined);

    // Ref for mobile auto-scroll
    const topRef = useRef<HTMLDivElement>(null);

    // Collapsible states
    const [isDescOpen, setIsDescOpen] = useState(true);
    const [isShippingOpen, setIsShippingOpen] = useState(true);

    useEffect(() => {
        const found = products.find(p => p.id === id);
        if (found) {
            setProduct(found);
            setSelectedImage(found.images?.[0] || found.image || ''); // Use images array as primary
            if (found.colors && found.colors.length > 0) {
                setSelectedColor(found.colors[0]);
            }
            if (found.variations && found.variations.length > 0) {
                setCurVar(found.variations[0]);
            }
        }
    }, [id, products]);

    // Update image when selected variation changes
    useEffect(() => {
        if (curVar?.image) {
            setSelectedImage(curVar.image);
        }
    }, [curVar]);

    // Auto-scroll on image change (mobile only)
    useEffect(() => {
        const isMobile = window.innerWidth <= 768;
        if (isMobile && topRef.current && selectedImage) {
            // Only scroll if the image container header is not fully in view
            const rect = topRef.current.getBoundingClientRect();
            if (rect.top < 0) {
                topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }, [selectedImage]);

    if (!product) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-background)' }}>
                <div style={{ width: '40px', height: '40px', border: '4px solid #eee', borderTopColor: 'var(--color-primary-dark)', borderRadius: '50%', animation: 'spin-slow 1s linear infinite' }}></div>
            </div>
        );
    }

    const currentPrice = curVar?.price || product.price;
    const allImages = Array.from(new Set([product.image, ...(product.images || [])])).filter(Boolean);

    const getBadges = () => {
        const cat = product.category?.toLowerCase() || '';

        // Food / Consumables (matching the reference image)
        if (cat.includes('christmas') || cat.includes('cooking') || cat.includes('food')) {
            return [
                { icon: <Star size={18} />, text: "Insanely delicious", color: '#f5f3ff', iconColor: '#7c3aed' },
                { icon: <Truck size={18} />, text: "Shipped right to your door", color: '#eff6ff', iconColor: '#2563eb' },
                { icon: <CheckCircle size={18} />, text: "100% organic, non-GMO", color: '#f0fdf4', iconColor: '#16a34a' }
            ];
        }

        // Tech / Gadgets
        if (cat.includes('phone') || cat.includes('laptop') || cat.includes('pc') || cat.includes('tech') || cat.includes('setup') || cat.includes('gadget') || cat.includes('accessories')) {
            return [
                { icon: <Shield size={18} />, text: "Guaranteed Authentic", color: '#f5f3ff', iconColor: '#7c3aed' },
                { icon: <Truck size={18} />, text: "Fast Nationwide Delivery", color: '#eff6ff', iconColor: '#2563eb' },
                { icon: <CheckCircle size={18} />, text: "Secure and Fast Payment", color: '#f0fdf4', iconColor: '#16a34a' }
            ];
        }

        // Default
        return [
            { icon: <Star size={18} />, text: "Premium Quality", color: '#f5f3ff', iconColor: '#7c3aed' },
            { icon: <Truck size={18} />, text: "Secure Shipping", color: '#eff6ff', iconColor: '#2563eb' },
            { icon: <Shield size={18} />, text: "Verified Store", color: '#f0fdf4', iconColor: '#16a34a' }
        ];
    };

    const badges = getBadges();

    const handleAddToCart = () => {
        onAddToCart(product, selectedColor || 'Original', selectedQty, curVar);
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--color-background)', paddingTop: '100px', paddingBottom: '60px' }}>
            <div className="container">
                {/* Breadcrumbs */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-light)', marginBottom: '32px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    <button onClick={() => navigate('/')} style={{ color: 'inherit' }}>Home</button>
                    <span>/</span>
                    <button onClick={() => navigate('/shop')} style={{ color: 'inherit' }}>Shop</button>
                    <span>/</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-light)' }}>{product.category}</span>
                    <span>/</span>
                    <span style={{ color: 'var(--color-text-primary)' }}>{product.name}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '64px' }}>
                    {/* Left Side: Images */}
                    <div ref={topRef} style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
                        <div style={{ background: '#f0f2f5', borderRadius: '32px', overflow: 'hidden', position: 'relative', marginBottom: '24px', aspectRatio: '1/1', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
                            <img
                                src={selectedImage}
                                alt={product.name}
                                style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }}
                            />
                            {product.stock <= 0 && (
                                <div style={{ position: 'absolute', top: '24px', right: '24px', background: '#ef4444', color: 'white', padding: '8px 16px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase' }}>
                                    Sold Out
                                </div>
                            )}
                            <div style={{ position: 'absolute', top: '24px', left: '24px', background: 'white', color: 'black', padding: '8px 16px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                                SALE
                            </div>
                        </div>

                        {/* Gallery Thumbnails */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                            {allImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(img)}
                                    style={{
                                        aspectRatio: '1/1',
                                        borderRadius: '16px',
                                        overflow: 'hidden',
                                        background: 'white',
                                        border: selectedImage === img ? '2px solid black' : '2px solid transparent',
                                        transition: 'all 0.2s',
                                        padding: '4px'
                                    }}
                                >
                                    <img src={img} alt={`View ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Product Info */}
                    <div style={{ paddingRight: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--color-text-light)' }}>{product.category}</span>
                        </div>
                        <h1 style={{ marginBottom: '12px', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, letterSpacing: '-0.02em' }}>{product.name}</h1>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', gap: '2px', color: 'var(--color-accent)' }}>
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill={i < 4 ? 'currentColor' : 'none'} stroke="currentColor" />
                                ))}
                            </div>
                            <span style={{ fontSize: '0.875rem', fontWeight: 800 }}>4.9</span>
                            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', fontWeight: 600 }}> (36 Reviews)</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '32px' }}>
                            <span style={{ fontSize: '3rem', fontWeight: 900 }}>{product.currency} {currentPrice.toLocaleString()}</span>
                            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', fontWeight: 700 }}>shipping excl.</span>
                        </div>

                        <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', lineHeight: '1.7', marginBottom: '40px', fontWeight: 500 }}>
                            {product.description}
                        </p>

                        {/* Variants Section */}
                        {product.variations && product.variations.length > 0 && (
                            <div style={{ marginBottom: '32px' }}>
                                <label style={{ display: 'block', fontSize: '1rem', fontWeight: 800, marginBottom: '16px' }}>
                                    Choose your option
                                </label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                    {product.variations.map((v) => (
                                        <button
                                            key={v.id}
                                            onClick={() => setCurVar(v)}
                                            style={{
                                                padding: '14px 28px',
                                                borderRadius: '12px',
                                                fontSize: '0.875rem',
                                                fontWeight: 800,
                                                border: curVar?.id === v.id ? 'none' : '2px solid transparent',
                                                background: curVar?.id === v.id ? 'var(--color-accent)' : '#f0f2f5',
                                                color: 'var(--color-text-primary)',
                                                transition: 'all 0.2s',
                                                boxShadow: curVar?.id === v.id ? '0 4px 12px rgba(227, 247, 126, 0.3)' : 'none'
                                            }}
                                        >
                                            {v.value}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Colors Section (if applicable) */}
                        {product.colors && product.colors.length > 1 && (
                            <div style={{ marginBottom: '32px' }}>
                                <label style={{ display: 'block', fontSize: '1rem', fontWeight: 800, marginBottom: '16px' }}>
                                    Color
                                </label>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    {product.colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                background: color.toLowerCase(),
                                                border: selectedColor === color ? '2px solid black' : '1px solid #eee',
                                                padding: '2px',
                                                backgroundClip: 'content-box',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                transform: selectedColor === color ? 'scale(1.1)' : 'scale(1)'
                                            }}
                                            title={color}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity & Actions */}
                        <div style={{ marginBottom: '40px' }}>
                            <label style={{ display: 'block', fontSize: '1rem', fontWeight: 800, marginBottom: '16px' }}>
                                Quantity
                            </label>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', background: '#f0f2f5', borderRadius: '16px', padding: '6px' }}>
                                    <button
                                        onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}
                                        style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black', background: 'var(--color-accent)', borderRadius: '12px' }}
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <span style={{ width: '60px', textAlign: 'center', fontWeight: 900, fontSize: '1.25rem' }}>{selectedQty}</span>
                                    <button
                                        onClick={() => setSelectedQty(selectedQty + 1)}
                                        style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black', background: 'var(--color-accent)', borderRadius: '12px' }}
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className="confera-btn"
                            style={{ width: '100%', height: '72px', borderRadius: '36px', fontSize: '1.125rem', marginBottom: '24px' }}
                        >
                            add to cart
                        </button>

                        {/* Social Proof */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
                            <div style={{ display: 'flex', marginLeft: '8px' }}>
                                {[1, 2, 3].map(i => (
                                    <img
                                        key={i}
                                        src={`https://i.pravatar.cc/100?img=${i + 15}`}
                                        style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid white', marginLeft: '-8px' }}
                                        alt="Buyer"
                                    />
                                ))}
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e0e7ff', border: '2px solid white', marginLeft: '-8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 800 }}>+10</div>
                            </div>
                            <p style={{ fontSize: '0.875rem', fontWeight: 700, margin: 0 }}>
                                <span style={{ fontWeight: 900 }}>{(product.salesCount || 13) % 40} other people</span> purchased it today
                            </p>
                        </div>

                        {/* Badges */}
                        <div style={{ display: 'grid', gap: '16px', marginBottom: '48px' }}>
                            {badges.map((badge, i) => (
                                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: badge.color, color: badge.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {badge.icon}
                                    </div>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{badge.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Collapsibles */}
                        <div style={{ borderTop: '1px solid #eee' }}>
                            <div>
                                <button
                                    onClick={() => setIsDescOpen(!isDescOpen)}
                                    style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0', fontSize: '1rem', fontWeight: 800 }}
                                >
                                    Description {isDescOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </button>
                                {isDescOpen && (
                                    <div style={{ paddingBottom: '24px', fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                                        {product.description}
                                    </div>
                                )}
                            </div>

                            <div style={{ borderTop: '1px solid #eee' }}>
                                <button
                                    onClick={() => setIsShippingOpen(!isShippingOpen)}
                                    style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0', fontSize: '1rem', fontWeight: 800 }}
                                >
                                    Shipping & Delivery {isShippingOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </button>
                                {isShippingOpen && (
                                    <div style={{ paddingBottom: '24px', fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                                        We offer nationwide delivery across Kenya. Standard shipping takes 2-4 business days. Express shipping options available at checkout.
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product, ProductVariation, CartItem } from '../types';
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
    ChevronUp
} from 'lucide-react';
import { STORE_NAME } from '../constants';

interface ProductDetailsPageProps {
    products: Product[];
    onAddToCart: (product: Product, color: string | null, quantity: number, variation?: ProductVariation) => void;
}

const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ products, onAddToCart }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedQty, setSelectedQty] = useState(1);
    const [curVar, setCurVar] = useState<ProductVariation | undefined>(undefined);

    // Collapsible states
    const [isDescOpen, setIsDescOpen] = useState(true);
    const [isShippingOpen, setIsShippingOpen] = useState(true);

    useEffect(() => {
        const found = products.find(p => p.id === id);
        if (found) {
            setProduct(found);
            setSelectedImage(found.image);
            if (found.colors && found.colors.length > 0) {
                setSelectedColor(found.colors[0]);
            }
        } else {
            // Handle product not found, maybe redirect or show error?
        }
    }, [id, products]);

    // Update variation based on color
    useEffect(() => {
        if (product?.variations && selectedColor) {
            const v = product.variations.find(v => v.color === selectedColor);
            setCurVar(v);
        } else {
            setCurVar(undefined);
        }
    }, [product, selectedColor]);

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    // Calculate pricing
    const currentPrice = curVar?.price || product.price;
    const originalPrice = product.originalPrice; //Assuming we might have this property or logic
    const discount = originalPrice && originalPrice > currentPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;

    const handleBuyNow = () => {
        onAddToCart(product, selectedColor, selectedQty, curVar);
        navigate('/checkout'); // Or open cart drawer? Assuming standard flow opens cart
        // If you want immediate checkout navigate to checkout logic or rely on onAddToCart to open drawer
    };

    const images = [product.image];
    if (product.gallery && product.gallery.length > 0) {
        images.push(...product.gallery.slice(0, 3)); // Limit to 3 thumbnails + main
    }
    // Ensure we have at least duplicates if no gallery for UI demo purposes based on reference
    // But for real app, just use what we have.

    // Mock data for social proof if not real
    const recentPurchases = 13 + Math.floor(Math.random() * 10);

    return (
        <div className="min-h-screen bg-[#FDFBF7] pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 font-medium">
                    <button onClick={() => navigate('/')} className="hover:text-black transition-colors">Home</button>
                    <span>/</span>
                    <button onClick={() => navigate('/shop')} className="hover:text-black transition-colors">Products</button>
                    <span>/</span>
                    <span className="text-black">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                    {/* Left Column: Images */}
                    <div className="flex flex-col gap-6">
                        <div className="aspect-square w-full rounded-3xl overflow-hidden bg-[#f3f4f6] relative border border-gray-100 shadow-sm">
                            <img
                                src={selectedImage}
                                alt={product.name}
                                className="w-full h-full object-cover object-center mix-blend-multiply"
                            />
                            {product.isNew && (
                                <div className="absolute top-4 left-4 bg-white text-black text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-sm">
                                    New
                                </div>
                            )}
                            {discount > 0 && (
                                <div className="absolute top-4 left-20 bg-white text-black text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-sm">
                                    SALE
                                </div>
                            )}
                            {product.stock <= 0 && (
                                <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    Sold Out
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        <div className="grid grid-cols-3 gap-4">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(img)}
                                    className={`aspect-square rounded-2xl overflow-hidden bg-white border-2 transition-all ${selectedImage === img ? 'border-black' : 'border-transparent hover:border-gray-200'}`}
                                >
                                    <img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover mix-blend-multiply" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Details */}
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">{product.category || 'Collection'}</span>
                        <h1 className="text-4xl md:text-5xl font-black text-black mb-4 tracking-tight leading-none">{product.name}</h1>

                        <div className="flex items-center gap-2 mb-6">
                            <div className="flex text-yellow-500 text-sm">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} fill="currentColor" size={16} />)}
                            </div>
                            <span className="text-sm font-bold text-gray-900">4.9</span>
                            <span className="text-sm text-gray-500">(36 reviews)</span>
                        </div>

                        <div className="flex items-baseline gap-4 mb-8">
                            <span className="text-4xl font-black">{product.currency} {currentPrice.toLocaleString()}</span>
                            {originalPrice && (
                                <span className="text-lg text-gray-400 line-through font-medium opacity-50">{product.currency} {originalPrice.toLocaleString()}</span>
                            )}
                            <span className="text-sm text-gray-500 font-medium">shipping excl.</span>
                        </div>

                        <p className="text-gray-600 leading-relaxed mb-8 font-medium">
                            {product.description}
                        </p>

                        {/* Options: Variations (Pills) */}
                        {product.variations && product.variations.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Choose your option</h3>
                                <div className="flex flex-wrap gap-3">
                                    {product.variations.map((v) => (
                                        <button
                                            key={v.id}
                                            onClick={() => setCurVar(v)}
                                            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all border-2 ${curVar?.id === v.id
                                                    ? 'bg-[#EAD4A8] border-[#EAD4A8] text-black shadow-sm'
                                                    : 'bg-[#F2EFE9] border-transparent text-gray-600 hover:bg-[#ebe7e0]'
                                                }`}
                                        >
                                            {v.storage || v.color || 'Standard'} {v.ram && `+ ${v.ram}`}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Color Selection (if colors exist and no variations covering it) */}
                        {product.colors && product.colors.length > 0 && !product.variations?.some(v => v.color) && (
                            <div className="mb-8">
                                <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Color</h3>
                                <div className="flex gap-3">
                                    {product.colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${selectedColor === color ? 'border-black scale-110 shadow-md' : 'border-transparent hover:scale-110'}`}
                                            style={{ backgroundColor: color.toLowerCase() }}
                                            title={color}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity Selector */}
                        <div className="mb-8">
                            <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Quantity</h3>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center bg-[#F2EFE9] rounded-xl px-2 py-1">
                                    <button
                                        onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}
                                        className="w-10 h-10 flex items-center justify-center hover:bg-black/5 rounded-lg transition-colors"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="w-12 text-center font-bold text-lg">{selectedQty}</span>
                                    <button
                                        onClick={() => setSelectedQty(selectedQty + 1)}
                                        className="w-10 h-10 flex items-center justify-center hover:bg-black/5 rounded-lg transition-colors"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <button
                            onClick={() => onAddToCart(product, selectedColor, selectedQty, curVar)}
                            className="w-full py-5 rounded-2xl bg-[#1A1A1A] text-white font-bold text-lg hover:bg-black transition-all uppercase tracking-wider shadow-xl shadow-black/10 mb-6 flex items-center justify-center gap-2"
                        >
                            add to cart
                        </button>

                        {/* Social Proof */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#FDFBF7] bg-gray-200 overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Buyer" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                                <div className="w-8 h-8 rounded-full border-2 border-[#FDFBF7] bg-[#E3F77E] flex items-center justify-center text-[10px] font-bold text-black">
                                    +10
                                </div>
                            </div>
                            <p className="text-sm font-medium text-gray-900">
                                <span className="font-bold">{recentPurchases} other people</span> purchased it today
                            </p>
                        </div>

                        <div className="h-px bg-gray-200 w-full mb-8"></div>

                        {/* Trust Badges */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full border border-purple-200 text-purple-600 flex items-center justify-center">
                                    <span className="block w-3 h-3 text-[10px] leading-none">😊</span> {/* Replaced with emoji for simplicity/icon consistency */}
                                </div>
                                <span className="text-sm font-medium text-gray-700">Insanely delicious</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full border border-blue-200 text-blue-600 flex items-center justify-center">
                                    <Package size={14} />
                                </div>
                                <span className="text-sm font-medium text-gray-700">Shipped right to your door</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full border border-green-200 text-green-600 flex items-center justify-center">
                                    <CheckCircle size={14} />
                                </div>
                                <span className="text-sm font-medium text-gray-700">100% organic, non-GMO</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;

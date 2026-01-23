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
                            {/* If fewer than 3 images, maybe specific placeholders or just empty space? Keeping it dynamic */}
                        </div>
                    </div>

                    {/* Right Column: Details */}
                    <div className="flex flex-col">
                        <h1 className="text-4xl md:text-5xl font-black text-black mb-2 tracking-tight leading-none">{product.name}</h1>
                        <div className="flex items-baseline gap-4 mb-8">
                            <span className="text-3xl font-bold">{product.currency} {currentPrice.toLocaleString()}</span>
                            {originalPrice && (
                                <span className="text-lg text-gray-400 line-through decoration-red-500 decoration-2">{product.currency} {originalPrice.toLocaleString()}</span>
                            )}
                        </div>

                        {/* Description Disclosure */}
                        <div className="border rounded-2xl p-6 bg-white shadow-sm mb-6 transition-all duration-300">
                            <div
                                className="flex justify-between items-center cursor-pointer"
                                onClick={() => setIsDescOpen(!isDescOpen)}
                            >
                                <h3 className="font-bold text-lg">Description</h3>
                                {isDescOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>
                            {isDescOpen && (
                                <div className="mt-4 text-gray-600 leading-relaxed text-sm animate-fadeIn">
                                    {product.description}
                                </div>
                            )}
                        </div>

                        {/* Color Selection */}
                        {product.colors && product.colors.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Color</h3>
                                <div className="flex gap-3">
                                    {product.colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${selectedColor === color ? 'border-black scale-110 shadow-md' : 'border-transparent hover:scale-110'}`}
                                            style={{ backgroundColor: color.toLowerCase() }} // Assuming color name is valid css color
                                            title={color}
                                        >
                                            {/* Checkmark for lighter colors if needed, but border is good indicator */}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity Selector */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex items-center border-2 border-gray-200 rounded-xl px-2 py-1 bg-white">
                                <button
                                    onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="w-12 text-center font-bold text-lg">{selectedQty}</span>
                                <button
                                    onClick={() => setSelectedQty(selectedQty + 1)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <button
                                onClick={() => onAddToCart(product, selectedColor, selectedQty, curVar)}
                                className="py-4 rounded-xl border-2 border-gray-200 font-bold text-black hover:border-black hover:bg-gray-50 transition-all uppercase tracking-wider flex items-center justify-center gap-2"
                            >
                                Add to Cart
                            </button>
                            <button
                                onClick={handleBuyNow}
                                className="py-4 rounded-xl bg-black text-white font-bold hover:bg-gray-800 transition-all uppercase tracking-wider shadow-lg shadow-black/20"
                            >
                                Buy Now
                            </button>
                        </div>

                        {/* Shipping Info Disclosure */}
                        <div className="border rounded-2xl p-6 bg-white shadow-sm mb-8">
                            <div
                                className="flex justify-between items-center cursor-pointer mb-2"
                                onClick={() => setIsShippingOpen(!isShippingOpen)}
                            >
                                <h3 className="font-bold text-lg">Shipping</h3>
                                {isShippingOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>

                            {isShippingOpen && (
                                <div className="grid grid-cols-2 gap-y-6 gap-x-4 mt-6">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-gray-100 rounded-full"><Zap size={16} /></div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase">Discount</p>
                                            <p className="text-sm font-semibold">Reg</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-gray-100 rounded-full"><Package size={16} /></div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase">Package</p>
                                            <p className="text-sm font-semibold">Secure</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-gray-100 rounded-full"><Clock size={16} /></div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase">Delivery Time</p>
                                            <p className="text-sm font-semibold">1-3 Working Days</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-gray-100 rounded-full"><Truck size={16} /></div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase">Arrive</p>
                                            <p className="text-sm font-semibold">Standard Shipping</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Rating & Reviews Section */}
                        <div className="mt-4">
                            <h2 className="text-2xl font-bold mb-6">Rating & Reviews</h2>
                            <div className="flex items-end gap-4 mb-4">
                                <span className="text-6xl font-black">4.5</span>
                                <span className="text-xl text-gray-400 font-medium mb-2">/5</span>
                                <div className="flex mb-3 ml-2 text-yellow-400">
                                    {[1, 2, 3, 4].map(i => <Star key={i} fill="currentColor" size={20} />)}
                                    <Star fill="currentColor" size={20} className="text-yellow-400 opacity-50" />
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 mb-8">(50 Reviews)</p>

                            {/* Mock Review Card */}
                            <div className="border border-gray-100 rounded-2xl p-6 bg-white">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="font-bold">Obayedul</div>
                                    </div>
                                    <span className="text-xs text-gray-400">13 Oct 2024</span>
                                </div>
                                <div className="flex text-black mb-3 text-xs">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} fill="currentColor" size={14} />)}
                                </div>
                                <p className="text-sm text-gray-600 italic">
                                    "Loose-fit sweatshirt hoodie in medium weight cotton-blend fabric with a generous, but not oversized silhouette."
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;

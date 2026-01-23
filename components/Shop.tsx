
import React, { useState } from 'react';
import { ShoppingCart, Star, CheckCircle2, Search, Truck, ChevronDown } from 'lucide-react';
import { Product, ProductVariation } from '../types';

interface ShopProps {
  onAddToCart: (p: Product, color: string, qty: number, variation?: ProductVariation) => void;
  products: Product[];
  searchQuery?: string;
  categories: any[];
}

const Shop: React.FC<ShopProps> = ({ onAddToCart, products, searchQuery = '', categories: dynamicCategories }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const categoriesList = ['All', ...dynamicCategories.map(c => c.name)];

  const [selectedColors, setSelectedColors] = useState<{ [id: string]: string }>({});
  const [selectedVariations, setSelectedVariations] = useState<{ [id: string]: ProductVariation }>({});
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedQty, setSelectedQty] = useState<number>(1);

  let filteredProducts = products;

  if (activeCategory !== 'All') {
    filteredProducts = filteredProducts.filter(p => p.category === activeCategory);
  }

  if (searchQuery) {
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return (
    <>
      <section className="shop-section" id="shop">
        <div className="container">
          <div className="shop-header">
            <div className="shop-title">
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', fontStyle: 'italic' }}>
                The <span>Collection</span>
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>Curated essentials for your workspace.</p>
            </div>

            <div className="filter-group">
              {categoriesList.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`filter-btn ${activeCategory === cat ? 'active' : 'inactive'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="product-grid">
            {filteredProducts.map(product => {
              const currentColor = selectedColors[product.id] || product.colors[0] || 'Original';
              const currentVariation = selectedVariations[product.id] || (product.variations && product.variations[0]);

              return (
                <div key={product.id} className="product-card">
                  <div className="product-image-wrapper">
                    <img
                      src={currentVariation?.image || product.images[0] || 'https://via.placeholder.com/400'}
                      alt={product.name}
                      className="product-img"
                      onClick={() => setSelectedProductId(product.id)}
                      style={{ cursor: 'pointer' }}
                    />
                    <div className="stock-badge">
                      <CheckCircle2 size={10} style={{ color: '#22c55e' }} />
                      {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </div>

                    <div className="product-overlay">
                      <button
                        onClick={() => onAddToCart(product, currentColor, 1, currentVariation)}
                        className="add-cart-btn"
                      >
                        <ShoppingCart size={18} /> Add to Cart
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 style={{ fontWeight: 700, fontSize: '1.125rem', cursor: 'pointer' }} onClick={() => setSelectedProductId(product.id)}>{product.name}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                        <Star size={12} style={{ fill: 'var(--color-accent)', color: 'var(--color-accent)' }} /> 4.9
                      </div>
                    </div>

                    {/* Selectors */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                      {product.variations && product.variations.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {product.variations.map(v => (
                            <button
                              key={v.id}
                              onClick={() => setSelectedVariations(prev => ({ ...prev, [product.id]: v }))}
                              style={{
                                fontSize: '0.65rem',
                                fontWeight: 800,
                                padding: '2px 8px',
                                borderRadius: '4px',
                                border: '1px solid',
                                borderColor: currentVariation?.id === v.id ? 'black' : '#eee',
                                backgroundColor: currentVariation?.id === v.id ? 'black' : 'transparent',
                                color: currentVariation?.id === v.id ? 'white' : 'black'
                              }}
                            >
                              {v.value} {v.price ? `(+ KES ${v.price - product.price})` : ''}
                            </button>
                          ))}
                        </div>
                      )}

                      {product.colors.length > 1 && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {product.colors.map(c => (
                            <button
                              key={c}
                              onClick={() => setSelectedColors(prev => ({ ...prev, [product.id]: c }))}
                              style={{
                                width: '16px',
                                height: '16px',
                                borderRadius: '50%',
                                backgroundColor: c.toLowerCase() === 'white' ? '#fff' : c.toLowerCase(),
                                border: currentColor === c ? '2px solid var(--color-primary)' : '1px solid #ddd',
                                cursor: 'pointer'
                              }}
                              title={c}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <div style={{ marginTop: '0.5rem' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 900 }}>
                        {product.currency} {(currentVariation?.price || product.price).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredProducts.length === 0 && (
              <div style={{ gridColumn: '1 / -1', padding: '4rem 0', textAlign: 'center' }}>
                <Search size={48} style={{ margin: '0 auto', color: 'var(--color-text-light)', marginBottom: '1rem' }} />
                <p style={{ color: 'var(--color-text-secondary)', fontWeight: 700 }}>No products found for "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Product Detail Modal */}
      {selectedProductId && (() => {
        const prod = products.find(p => p.id === selectedProductId);
        if (!prod) return null;
        const curColor = selectedColors[prod.id] || prod.colors[0] || 'Original';
        const curVar = selectedVariations[prod.id] || (prod.variations && prod.variations[0]);
        const mainImage = curVar?.image || prod.images[0];
        // Combine all images
        const allImages = Array.from(new Set([mainImage, ...prod.images]));

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setSelectedProductId(null)} />
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl w-full max-w-4xl relative z-10 flex flex-col md:flex-row max-h-[90vh]">
              {/* Close Button */}
              <button
                onClick={() => setSelectedProductId(null)}
                className="absolute top-4 right-4 z-20 bg-white/50 hover:bg-white rounded-full p-2 transition-colors"
              >
                <Search className="rotate-45" color="black" size={24} />
              </button>

              {/* Image Section */}
              <div className="w-full md:w-1/2 bg-gray-100 p-8 flex flex-col items-center justify-center relative">
                <img
                  src={mainImage}
                  alt={prod.name}
                  className="w-full h-auto max-h-[50vh] object-contain mix-blend-multiply transition-all duration-300"
                />

                {/* Thumbnails */}
                {allImages.length > 1 && (
                  <div className="flex gap-2 mt-6 overflow-x-auto w-full px-2 justify-center">
                    {allImages.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        className={`w-16 h-16 rounded-lg object-cover cursor-pointer border-2 transition-all ${img === mainImage ? 'border-black opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                        onMouseEnter={() => {
                          // This is a simple implementation, ideally we'd have state for 'activeImage' in the modal
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Details Section */}
              <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto flex flex-col">
                <div className="mb-auto">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-black text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                      {prod.category}
                    </span>
                    {prod.stock > 0 ? (
                      <span className="text-green-600 text-xs font-bold flex items-center gap-1"><CheckCircle2 size={12} /> In Stock</span>
                    ) : (
                      <span className="text-red-500 text-xs font-bold">Out of Stock</span>
                    )}
                  </div>

                  <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight">{prod.name}</h2>
                  <p className="text-gray-600 font-medium leading-relaxed mb-8">{prod.description}</p>

                  {/* Variations & Options */}
                  <div className="space-y-6 mb-8">
                    {prod.variations && prod.variations.length > 0 && (
                      <div>
                        <span className="text-xs font-bold uppercase text-gray-400 block mb-2">Select Option</span>
                        <div className="flex flex-wrap gap-2">
                          {prod.variations.map(v => (
                            <button
                              key={v.id}
                              onClick={() => setSelectedVariations(prev => ({ ...prev, [prod.id]: v }))}
                              className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${curVar?.id === v.id ? 'border-black bg-black text-white' : 'border-gray-100 hover:border-black'}`}
                            >
                              {v.value}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quantity */}
                    <div>
                      <span className="text-xs font-bold uppercase text-gray-400 block mb-2">Quantity</span>
                      <div className="flex items-center gap-4 bg-gray-50 inline-flex p-2 rounded-xl border border-gray-100">
                        <input
                          type="number"
                          min={1}
                          value={selectedQty}
                          onChange={e => setSelectedQty(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-12 text-center bg-transparent font-black outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="pt-8 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-400 font-bold text-sm">Total Price</span>
                    <span className="text-3xl font-black">{prod.currency} {(curVar?.price || prod.price).toLocaleString()}</span>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => { onAddToCart(prod, curColor, selectedQty, curVar); setSelectedProductId(null); setSelectedQty(1); }}
                      className="flex-1 bg-white border-2 border-black text-black py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => { onAddToCart(prod, curColor, selectedQty, curVar); setSelectedProductId(null); setSelectedQty(1); }}
                      className="flex-1 bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors shadow-xl"
                    >
                      Buy Now
                    </button>
                  </div>

                  {/* Shipping & Returns Placeholder */}
                  <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded-full"><Truck size={16} /></div>
                      <div>
                        <p className="text-xs font-bold uppercase text-gray-400">Delivery</p>
                        <p className="text-sm font-bold">2-3 Working Days</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded-full"><CheckCircle2 size={16} /></div>
                      <div>
                        <p className="text-xs font-bold uppercase text-gray-400">Warranty</p>
                        <p className="text-sm font-bold">1 Year Official</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
};

export default Shop;

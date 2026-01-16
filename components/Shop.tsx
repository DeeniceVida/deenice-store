
import React, { useState } from 'react';
import { ShoppingCart, Star, CheckCircle2, Search } from 'lucide-react';
import { Product, ProductVariation } from '../types';

interface ShopProps {
  onAddToCart: (p: Product, color: string, qty: number, variation?: ProductVariation) => void;
  products: Product[];
  searchQuery?: string;
}

const Shop: React.FC<ShopProps> = ({ onAddToCart, products, searchQuery = '' }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Desk Setup', 'Lighting', 'Accessories', 'Streaming'];

  const [selectedColors, setSelectedColors] = useState<{ [id: string]: string }>({});
  const [selectedVariations, setSelectedVariations] = useState<{ [id: string]: ProductVariation }>({});

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
            {categories.map(cat => (
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
                    <h3 style={{ fontWeight: 700, fontSize: '1.125rem' }}>{product.name}</h3>
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
  );
};

export default Shop;

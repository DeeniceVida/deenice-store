
import React from 'react';
import { Zap, ShoppingCart, Clock } from 'lucide-react';
import { Deal, Product } from '../types';

interface HotDealsProps {
  products: Product[];
  deals: Deal[];
  onAddToCart: (product: Product, color: string) => void;
}

const HotDeals: React.FC<HotDealsProps> = ({ products, deals, onAddToCart }) => {
  // Filter active deals if needed, or assume passed deals are active
  // For now, let's show all passed deals

  if (!deals || deals.length === 0) return null;

  return (
    <div className="hot-deals-section">
      <div className="hot-deals-container">
        <div className="hot-deals-header">
          <div className="flash-badge">
            <Zap size={18} className="text-textPrimary fill-accent" />
            <span>Weekly Flash Deals</span>
          </div>
          <h1 className="section-title">Hot <span className="text-primary">Tech Drops</span></h1>
          <p className="section-subtitle">Limited-time offers on our most curated gear. Snag them before they disappear.</p>
        </div>

        <div className="deals-grid">
          {deals.map((deal) => {
            const product = deal.standaloneProduct || products.find(p => p.id === deal.productId);
            if (!product) return null;

            return (
              <div key={deal.id} className="deal-card group">
                <div className="deal-image-wrapper">
                  <img src={product.images[0]} alt={product.name} className="deal-img" />
                  <div className="flash-badge">
                    <Zap size={12} fill="currentColor" /> FLASH SALE
                  </div>
                </div>

                <div className="deal-content">
                  <div>
                    <h3 className="deal-title">{product.name}</h3>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span className="deal-price">KES {deal.discountPrice.toLocaleString()}</span>
                      <span className="deal-old-price">KES {product.price.toLocaleString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onAddToCart(product, product.colors[0])}
                    className="btn-icon-large"
                  >
                    <ShoppingCart size={24} />
                  </button>
                </div>
                <div className="deal-footer">
                  <div className="time-left">
                    <Clock size={14} /> Ends {new Date(deal.endsAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HotDeals;

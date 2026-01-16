
import React, { useState, useEffect } from 'react';
import { Link2, DollarSign, ArrowRight, Info, Apple, Smartphone, InfoIcon } from 'lucide-react';
import { USD_TO_KES_RATE, WHATSAPP_NUMBER } from '../constants';

const BuyForMe: React.FC = () => {
  const [url, setUrl] = useState('');
  const [usdPrice, setUsdPrice] = useState<number | string>('');
  const [results, setResults] = useState<{
    kesBase: number;
    shippingFee: number;
    serviceFee: number;
    appleFee: number;
    total: number;
  } | null>(null);

  useEffect(() => {
    const price = Number(usdPrice);
    if (!price || price <= 0 || !url.trim()) {
      setResults(null);
      return;
    }

    const kesBase = price * USD_TO_KES_RATE;

    // Fee Logic:
    // $20 (2,700 KES) + 3.5% of cost
    let shippingFee = 2700 + (kesBase * 0.035);

    // Updated Service Fee: $30 for items < $750 or 4.5% for items > $750
    let serviceFee = 0;
    if (price < 750) {
      serviceFee = 30 * USD_TO_KES_RATE;
    } else {
      serviceFee = kesBase * 0.045;
    }

    // Apple Surcharge
    let appleFee = url.toLowerCase().includes('apple.com') ? (65 * USD_TO_KES_RATE) : 0;

    setResults({
      kesBase,
      shippingFee,
      serviceFee,
      appleFee,
      total: kesBase + shippingFee + serviceFee + appleFee
    });
  }, [url, usdPrice]);

  const handleWhatsApp = () => {
    if (!results) return;
    const msg = `Hi Deenice Store! I want to import this item:
URL: ${url}
Price: $${usdPrice}
Total Quote: KES ${results.total.toLocaleString()}
Please help me proceed!`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <section className="bfm-section" id="buy-for-me">
      <div className="container">
        <div className="bfm-grid">
          <div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1.5rem', fontStyle: 'italic', lineHeight: 1.1 }}>
              Buy For Me <span style={{ background: 'var(--color-accent)', padding: '0 8px', borderRadius: '8px', fontSize: '0.7em', verticalAlign: 'middle', display: 'inline-block' }}>USA Service</span>
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem', lineHeight: 1.6, fontSize: '1.125rem' }}>
              Found something on Amazon, eBay, or Apple US? We'll buy and ship it for you to your doorstep in Kenya within 3 weeks.
            </p>

            <div className="step-list">
              {[
                { step: 1, text: "Browse any US website & find your product." },
                { step: 2, text: "Copy the link & enter the USD price below." },
                { step: 3, text: "Get an instant real-time quote in KES." },
                { step: 4, text: "Order via WhatsApp & receive in 3 weeks!" }
              ].map((item) => (
                <div key={item.step} className="step-item">
                  <div className="step-circle">
                    {item.step}
                  </div>
                  <p style={{ fontWeight: 600 }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="cost-card">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link2 size={24} style={{ color: 'var(--color-primary)' }} /> Cost Accumulator
            </h3>

            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>Item Link (Required)</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="https://amazon.com/product..."
                    className="custom-input"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  {url.toLowerCase().includes('apple.com') && (
                    <Apple size={18} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                  )}
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>Price in USD</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="custom-input"
                    style={{ paddingLeft: '3rem', fontWeight: 700, fontSize: '1.25rem' }}
                    value={usdPrice}
                    onChange={(e) => setUsdPrice(e.target.value)}
                  />
                  <DollarSign size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                </div>
              </div>

              {results && (
                <div className="quote-result">
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                    <span style={{ color: '#6b7280' }}>Base Cost (KES)</span>
                    <span style={{ fontWeight: 700 }}>KES {results.kesBase.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.75rem', alignItems: 'center' }}>
                    <span style={{ color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>Shipping Fee ($20 + 3.5%) <Info size={12} /></span>
                    <span style={{ fontWeight: 700, color: '#16a34a' }}>KES {results.shippingFee.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                    <span style={{ color: '#6b7280' }}>Service Fee</span>
                    <span style={{ fontWeight: 700, color: '#ea580c' }}>KES {results.serviceFee.toLocaleString()}</span>
                  </div>
                  {results.appleFee > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.75rem', fontWeight: 700, color: '#2563eb' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Apple Special Handling</span>
                      <span>KES {results.appleFee.toLocaleString()}</span>
                    </div>
                  )}
                  <div style={{ paddingTop: '1rem', borderTop: '1px solid #e5e7eb', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <span style={{ fontSize: '1.125rem', fontWeight: 800, fontStyle: 'italic' }}>Total Estimate</span>
                    <span style={{ fontSize: '1.875rem', fontWeight: 900, lineHeight: 1 }}>KES {results.total.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={handleWhatsApp}
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center' }}
                  >
                    Place Order via WhatsApp <ArrowRight size={20} style={{ marginLeft: '4px' }} />
                  </button>
                </div>
              )}

              {!results && (
                <div style={{ border: '2px dashed #e5e7eb', borderRadius: '1.5rem', padding: '2.5rem', textAlign: 'center' }}>
                  <InfoIcon size={32} style={{ margin: '0 auto', color: '#d1d5db', marginBottom: '1rem' }} />
                  <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Enter link and price to get quote.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BuyForMe;

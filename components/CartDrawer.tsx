import React, { useState } from 'react';
import React, { useState } from 'react';
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight, Smartphone, MapPin, Edit2, Copy, Check, Sparkles, Truck } from 'lucide-react';
import { CartItem, User, Order } from '../types';
import { WHATSAPP_NUMBER, MPESA_TILL_NUMBER, DELIVERY_ZONES, NAIROBI_DISTANCES } from '../constants';
import * as gemini from '../services/gemini';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  user: User | null;
  onRemove: (id: string, color: string, variationId?: string) => void;
  onUpdateQty: (id: string, color: string, variationId: string | undefined, qty: number) => void;
  onCreateOrder: (order: Partial<Order>) => Order;
  onUpdateUser: (data: Partial<User>) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, user, onRemove, onUpdateQty, onCreateOrder, onUpdateUser }) => {
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'payment' | 'success'>('cart');
  const [deliveryType, setDeliveryType] = useState<'PICKUP' | 'DELIVERY'>('DELIVERY');
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [townSearch, setTownSearch] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [guestHometown, setGuestHometown] = useState('');

  const getDeliveryFee = () => {
    if (deliveryType === 'PICKUP') return 0;
    const town = user?.hometown || guestHometown;

    if (!town) return 500;

    const nairobiTown = NAIROBI_DISTANCES.find(t => t.name === town);
    if (nairobiTown) {
      return Math.max(360, nairobiTown.distance * 60);
    }

    const zone = DELIVERY_ZONES.find(z => z.name === town);
    return zone ? zone.fee : 500;
  };

  const subtotal = items.reduce((sum, i) => sum + (Number(i.selectedVariation?.price || i.price) * Number(i.quantity)), 0);
  const deliveryFee = Number(getDeliveryFee() || 0);
  const total = Number(subtotal) + Number(deliveryFee);

  const handleCopyTill = () => {
    navigator.clipboard.writeText(MPESA_TILL_NUMBER);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleMpesaClick = () => {
    const currentTown = user?.hometown || guestHometown;
    const order = onCreateOrder({ totalAmount: total, deliveryType, deliveryFee, hometown: currentTown });
    const msg = `Hi Deenice Store! I'd like to place an order:
Code: ${order.specialCode}
Town: ${currentTown}
Items:
${items.map(i => `- ${i.name} (${i.selectedColor}${i.selectedVariation ? `, ${i.selectedVariation.value}` : ''}) x${i.quantity}`).join('\n')}
Total: KES ${total.toLocaleString()}
Order ID: ${order.id}
Payment: M-PESA Till ${MPESA_TILL_NUMBER}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');

    if (user) {
      onClose();
    } else {
      setCheckoutStep('success');
    }
  };

  const towns = [...NAIROBI_DISTANCES.map(t => t.name), ...DELIVERY_ZONES.map(t => t.name)].sort();

  const handleTownSearch = async (val: string) => {
    setTownSearch(val);
    if (val.length >= 2) {
      const filteredLocal = towns.filter(t => t.toLowerCase().includes(val.toLowerCase())).slice(0, 3);
      const aiSuggestions = await gemini.getTownSuggestions(val);
      const combined = Array.from(new Set([...filteredLocal, ...aiSuggestions]));
      setSuggestions(combined);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectTown = (town: string) => {
    if (user) {
      onUpdateUser({ hometown: town });
    } else {
      setGuestHometown(town);
    }
    setIsEditingLocation(false);
    setShowSuggestions(false);
    setTownSearch('');
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer-panel">
        <div className="cart-header">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, fontStyle: 'italic' }}>Your <span style={{ color: 'var(--color-primary-dark)' }}>Bag</span></h2>
          <button onClick={onClose} className="icon-btn"><X /></button>
        </div>

        <div className="cart-body">
          {items.length === 0 ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', textAlign: 'center' }}>
              <div style={{ padding: '1.5rem', background: 'var(--color-background)', borderRadius: '50%' }}><ShoppingBag size={48} style={{ color: '#d1d5db' }} /></div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Bag is empty</h3>
              <button onClick={onClose} className="confera-btn" style={{ padding: '0.75rem 2rem' }}>Start Shopping</button>
            </div>
          ) : (
            <>
              {checkoutStep === 'cart' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {items.map((item) => (
                    <div key={`${item.id}-${item.selectedColor}-${item.selectedVariation?.id}`} className="cart-item">
                      <img src={item.selectedVariation?.image || item.images[0]} alt={item.name} className="cart-item-img" />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                          <h4 style={{ fontWeight: 800, fontSize: '0.875rem' }}>{item.name}</h4>
                          <span style={{ fontWeight: 900, fontSize: '0.875rem' }}>KES {((item.selectedVariation?.price || item.price) * item.quantity).toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.65rem', padding: '2px 6px', backgroundColor: '#f3f4f6', borderRadius: '4px', fontWeight: 700 }}>{item.selectedColor}</span>
                          {item.selectedVariation && (
                            <span style={{ fontSize: '0.65rem', padding: '2px 6px', backgroundColor: 'var(--color-primary-light)', borderRadius: '4px', fontWeight: 800 }}>{item.selectedVariation.value}</span>
                          )}
                        </div>
                        <div className="qty-controls">
                          <button onClick={() => onUpdateQty(item.id, item.selectedColor, item.selectedVariation?.id, item.quantity - 1)} className="icon-btn" style={{ padding: '2px' }}><Minus size={14} /></button>
                          <span style={{ fontSize: '0.875rem', fontWeight: 700, width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                          <button onClick={() => onUpdateQty(item.id, item.selectedColor, item.selectedVariation?.id, item.quantity + 1)} className="icon-btn" style={{ padding: '2px' }}><Plus size={14} /></button>
                          <button onClick={() => onRemove(item.id, item.selectedColor, item.selectedVariation?.id)} style={{ marginLeft: 'auto', color: '#9ca3af' }}><Trash2 size={14} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {checkoutStep === 'checkout' && (
                <div style={{ animation: 'fadeIn 0.3s ease' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <button onClick={() => setCheckoutStep('cart')} className="icon-btn" style={{ background: '#f3f4f6' }}>
                      <ArrowRight className="rotate-180" size={20} />
                    </button>
                    <h3 style={{ fontWeight: 900, fontSize: '1.5rem' }}>Delivery Details</h3>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button
                      onClick={() => setDeliveryType('DELIVERY')}
                      className={`delivery-option ${deliveryType === 'DELIVERY' ? 'selected' : ''}`}
                    >
                      <div>
                        <p style={{ fontWeight: 700 }}>Delivery to {user?.hometown || 'Home'}</p>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Fee auto-calculated for your town</p>
                      </div>
                      <span style={{ fontWeight: 900 }}>KES {getDeliveryFee().toLocaleString()}</span>
                    </button>

                    {deliveryType === 'DELIVERY' && (
                      <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '16px' }}>
                        {isEditingLocation ? (
                          <div style={{ position: 'relative' }}>
                            <input
                              autoFocus
                              type="text"
                              placeholder="Type your town (e.g. Westlands, Nakuru...)"
                              style={{ width: '100%', background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '0.75rem', fontSize: '0.875rem', outline: 'none' }}
                              value={townSearch}
                              onChange={(e) => handleTownSearch(e.target.value)}
                              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            />
                            {showSuggestions && suggestions.length > 0 && (
                              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', marginTop: '4px', zIndex: 10, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', overflow: 'hidden' }}>
                                {suggestions.map(s => (
                                  <button
                                    key={s}
                                    onClick={() => selectTown(s)}
                                    style={{ width: '100%', padding: '0.75rem 1rem', textAlign: 'left', border: 'none', background: 'none', fontSize: '0.875rem', cursor: 'pointer', borderBottom: '1px solid #f3f4f6' }}
                                    className="hover-bg-gray"
                                  >
                                    <Sparkles size={12} style={{ marginRight: '8px', color: 'var(--color-primary)' }} /> {s}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                              <MapPin size={14} style={{ color: 'var(--color-primary)' }} />
                              <span>Shipping to <span style={{ fontWeight: 700 }}>{user?.hometown || guestHometown || 'Select Town'}</span></span>
                            </div>
                            <button onClick={() => setIsEditingLocation(true)} style={{ padding: '0.5rem', color: 'var(--color-primary)' }}>
                              <Edit2 size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    <button
                      onClick={() => setDeliveryType('PICKUP')}
                      className={`delivery-option ${deliveryType === 'PICKUP' ? 'selected' : ''}`}
                    >
                      <div>
                        <p style={{ fontWeight: 700 }}>Store Pickup</p>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Pick from our Shop in Nairobi</p>
                      </div>
                      <span style={{ fontWeight: 900, color: '#16a34a' }}>FREE</span>
                    </button>
                  </div>
                </div>
              )}

              {checkoutStep === 'payment' && (
                <div style={{ animation: 'fadeIn 0.3s ease' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <button onClick={() => setCheckoutStep('checkout')} className="icon-btn" style={{ background: '#f3f4f6' }}>
                      <ArrowRight className="rotate-180" size={20} />
                    </button>
                    <h3 style={{ fontWeight: 900, fontSize: '1.5rem' }}>Payment</h3>
                  </div>
                  <div style={{ background: 'rgba(38, 185, 0, 0.05)', borderRadius: '32px', padding: '2rem', border: '2px solid rgba(38, 185, 0, 0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div style={{ background: '#26B900', padding: '0.75rem', borderRadius: '16px', color: 'white' }}>
                        <Smartphone size={24} />
                      </div>
                      <div>
                        <p style={{ fontWeight: 900, fontSize: '1.125rem' }}>Lipa na M-PESA</p>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Instant Verification</p>
                      </div>
                    </div>

                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(38, 185, 0, 0.1)', marginBottom: '1.5rem' }}>
                      <div>
                        <p style={{ fontSize: '0.625rem', fontWeight: 900, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>Buy Goods Till</p>
                        <p style={{ fontSize: '1.875rem', fontWeight: 900, letterSpacing: '-0.025em', color: '#26B900' }}>{MPESA_TILL_NUMBER}</p>
                      </div>
                      <button
                        onClick={handleCopyTill}
                        style={{ padding: '1rem', borderRadius: '16px', transition: 'all 0.2s', background: isCopied ? '#26B900' : '#f9fafb', color: isCopied ? 'white' : '#9ca3af' }}
                      >
                        {isCopied ? <Check size={20} /> : <Copy size={20} />}
                      </button>
                    </div>

                    <ul style={{ fontSize: '0.75rem', color: '#4b5563', paddingLeft: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <li style={{ display: 'flex', gap: '0.5rem' }}><span>1.</span> Copy the Till Number above.</li>
                      <li style={{ display: 'flex', gap: '0.5rem' }}><span>2.</span> Dial *334# or use M-PESA App.</li>
                      <li style={{ display: 'flex', gap: '0.5rem' }}><span>3.</span> Choose 'Lipa na M-PESA' & 'Buy Goods'.</li>
                      <li style={{ display: 'flex', gap: '0.5rem' }}><span>4.</span> Pay <b>KES {total.toLocaleString()}</b>.</li>
                    </ul>

                    <button
                      onClick={handleMpesaClick}
                      className="confera-btn"
                      style={{ width: '100%', background: '#26B900', color: 'white', borderColor: '#26B900', padding: '1.25rem', marginTop: '2rem' }}
                    >
                      Confirm Order via WhatsApp
                    </button>
                  </div>
                </div>
              )}

              {checkoutStep === 'success' && (
                <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'center', paddingTop: '2rem' }}>
                  <div style={{ background: '#ecfccb', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <Check size={40} style={{ color: '#65a30d' }} />
                  </div>
                  <h3 style={{ fontWeight: 900, fontSize: '1.5rem', marginBottom: '0.5rem' }}>Order Placed!</h3>
                  <p style={{ color: '#6b7280', marginBottom: '2rem' }}>We've opened WhatsApp to confirm your order.</p>

                  <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '32px', border: '1.5px solid #000', boxShadow: '4px 4px 0 #000' }}>
                    <h4 style={{ fontWeight: 900, fontSize: '1.25rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Track Your Order?</h4>
                    <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem', fontWeight: 700 }}>As a guest, you'll receive updates via WhatsApp. Create an account to track delivery status live and save details for next time.</p>

                    <button
                      onClick={() => {
                        window.location.hash = '#/login';
                        onClose();
                      }}
                      className="confera-btn"
                      style={{ width: '100%', justifyContent: 'center', marginBottom: '1rem', background: '#000', color: '#fff' }}
                    >
                      <Sparkles size={18} /> Create Account
                    </button>

                    <button
                      onClick={onClose}
                      style={{ background: 'transparent', border: 'none', color: '#9ca3af', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px' }}
                    >
                      No thanks, I'll stay as guest
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {items.length > 0 && checkoutStep !== 'success' && (
          <div className="cart-footer">
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                <span style={{ color: '#6b7280', fontWeight: 600 }}>Subtotal</span>
                <span style={{ fontWeight: 700 }}>KES {subtotal.toLocaleString()}</span>
              </div>
              {checkoutStep !== 'cart' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#6b7280', fontWeight: 600 }}>Shipping</span>
                  <span style={{ fontWeight: 700 }}>KES {deliveryFee.toLocaleString()}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f3f4f6', marginTop: '0.5rem' }}>
                <span style={{ fontWeight: 900, fontStyle: 'italic' }}>TOTAL</span>
                <span style={{ fontWeight: 900 }}>KES {total.toLocaleString()}</span>
              </div>

              {checkoutStep === 'cart' && (
                <button
                  onClick={() => setCheckoutStep('checkout')}
                  className="confera-btn"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Proceed to Delivery <ArrowRight size={20} />
                </button>
              )}
              {checkoutStep === 'checkout' && (
                <button
                  onClick={() => setCheckoutStep('payment')}
                  className="confera-btn"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Pay & Complete <ArrowRight size={20} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;

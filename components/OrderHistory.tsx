
import React, { useState } from 'react';
import {
  Package,
  Download,
  MapPin,
  Hash,
  User as UserIcon,
  Edit2,
  Check,
  X as CloseIcon,
  FileText,
  CreditCard,
  Zap,
  ShieldCheck,
  Clock,
  Send,
  Printer
} from 'lucide-react';
import { User, Order, OrderStatus, PaymentStatus } from '../types';
import { DELIVERY_ZONES, NAIROBI_DISTANCES, STORE_NAME, LOGO_URL, MPESA_TILL_NUMBER, WHATSAPP_NUMBER } from '../constants';

interface OrderHistoryProps {
  user: User | null;
  orders: Order[];
  onUpdateUser?: (data: Partial<User>) => void;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ user, orders, onUpdateUser }) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempTown, setTempTown] = useState(user?.hometown || '');
  const [showInvoice, setShowInvoice] = useState<string | null>(null);

  const towns = [...NAIROBI_DISTANCES.map(t => t.name), ...DELIVERY_ZONES.map(t => t.name)].sort();

  const handleSaveProfile = () => {
    if (onUpdateUser) {
      onUpdateUser({ hometown: tempTown });
    }
    setIsEditingProfile(false);
  };

  const getStatusIndex = (status: OrderStatus) => {
    const sequence = [OrderStatus.ORDERED, OrderStatus.PREPARING, OrderStatus.SHIPPED, OrderStatus.DELIVERED];
    return sequence.indexOf(status);
  };

  const shareInvoiceWhatsApp = (order: Order) => {
    const msg = `Deenice Store Order Invoice
Order ID: ${order.id}
Special Code: ${order.specialCode}
Items: ${order.items.map(i => i.name).join(', ')}
Total: KES ${order.totalAmount.toLocaleString()}
Status: ${order.status}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const printInvoice = () => {
    window.print();
  };

  const StatusTimeline = ({ currentStatus }: { currentStatus: OrderStatus }) => {
    const steps = [
      { label: 'Ordered', status: OrderStatus.ORDERED },
      { label: 'Preparing', status: OrderStatus.PREPARING },
      { label: 'Shipped', status: OrderStatus.SHIPPED },
      { label: 'Delivered', status: OrderStatus.DELIVERED }
    ];
    const currentIndex = getStatusIndex(currentStatus);

    return (
      <div className="timeline-container">
        <div className="timeline-wrapper">
          <div className="timeline-bg-line" />
          <div
            className="timeline-progress-line"
            style={{
              width: `${(currentIndex / (steps.length - 1)) * 100}%`
            }}
          />
          {steps.map((step, idx) => (
            <div key={step.label} className="timeline-step">
              <div
                className={`timeline-dot ${idx <= currentIndex ? 'active' : 'inactive'}`}
              />
              <div className={`timeline-label ${idx === currentIndex ? 'active' : 'inactive'}`}>
                <p>{step.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!user) {
    return (
      <div style={{ padding: '10rem 1rem', textAlign: 'center', maxWidth: '32rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
        <div style={{ width: '5rem', height: '5rem', backgroundColor: 'rgba(179, 200, 239, 0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Package size={32} style={{ color: 'var(--color-text-primary)' }} />
        </div>
        <h2 style={{ fontSize: '1.875rem', fontWeight: 900, fontStyle: 'italic' }}>Sign In to <span style={{ color: 'var(--color-primary)' }}>Track</span></h2>
        <p style={{ color: '#6b7280' }}>Log in to view your orders and track deliveries.</p>
        <button onClick={() => window.location.hash = '#/login'} className="btn-primary" style={{ padding: '1rem 2.5rem', borderRadius: '999px', fontSize: '1rem' }}>Login to Account</button>
      </div>
    );
  }

  const selectedOrder = orders.find(o => o.id === showInvoice);

  return (
    <div className="order-history-section">
      <div className="container">
        <div className="order-history-grid">
          <div className="oh-sidebar">
            <div className="dashboard-card user-profile-widget">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div className="user-avatar-circle">
                  <UserIcon size={48} />
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 900 }}>{user.name}</h2>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '1.5rem' }}>{user.email}</p>
                <div style={{ width: '100%', paddingTop: '1.5rem', borderTop: '1px solid #f3f4f6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <p style={{ fontSize: '0.625rem', color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Delivery Town</p>
                    <button onClick={() => setIsEditingProfile(!isEditingProfile)} style={{ padding: '0.25rem', color: 'var(--color-primary)' }}><Edit2 size={12} /></button>
                  </div>
                  {isEditingProfile ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <select style={{ width: '100%', backgroundColor: '#f9fafb', borderRadius: '0.75rem', padding: '0.5rem', fontSize: '0.75rem' }} value={tempTown} onChange={(e) => setTempTown(e.target.value)}>
                        {towns.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <button onClick={handleSaveProfile} className="btn-primary" style={{ width: '100%', padding: '0.5rem', borderRadius: '0.75rem', fontSize: '0.75rem' }}>Save</button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 700 }}><MapPin size={14} style={{ color: 'var(--color-primary)' }} /> {user.hometown}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="oh-main">
            <h1 style={{ fontSize: '2.25rem', fontWeight: 900, fontStyle: 'italic' }}>Order <span style={{ color: 'var(--color-primary)' }}>Vault</span></h1>
            {orders.length === 0 ? (
              <div className="dashboard-card" style={{ padding: '6rem', textAlign: 'center' }}>
                <p style={{ color: '#9ca3af', fontWeight: 700 }}>No orders placed yet.</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="dashboard-card" style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginBottom: '2rem' }} className="md:flex-row">
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Order {order.id}</h3>
                        <span style={{ backgroundColor: 'rgba(227, 247, 126, 0.2)', padding: '0.25rem 0.75rem', borderRadius: '0.75rem', fontSize: '0.625rem', fontWeight: 900 }}>{order.specialCode}</span>
                      </div>
                      <p style={{ fontSize: '0.625rem', color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', marginTop: '0.25rem' }}>{order.createdAt}</p>
                    </div>
                    <div className="text-right">
                      <p style={{ fontSize: '1.5rem', fontWeight: 900 }}>KES {(order.totalAmount || 0).toLocaleString()}</p>
                      <p style={{ fontSize: '0.625rem', color: '#16a34a', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{order.paymentStatus}</p>
                    </div>
                  </div>
                  <StatusTimeline currentStatus={order.status} />
                  <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button onClick={() => setShowInvoice(order.id)} className="btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '1rem', fontSize: '0.625rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FileText size={14} /> View Invoice
                    </button>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontStyle: 'italic' }}>Syncing live...</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {selectedOrder && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-backdrop" onClick={() => setShowInvoice(null)} />
          <div className="admin-modal-content invoice-modal-content">
            <div className="invoice-modal-inner">
              <div className="print:hidden absolute top-8 right-8">
                <button onClick={() => setShowInvoice(null)} className="icon-btn"><CloseIcon size={20} /></button>
              </div>
              <div className="invoice-header">
                <div>
                  <img src={LOGO_URL} style={{ height: '4rem', marginBottom: '1rem' }} />
                  <h2 style={{ fontSize: '1.875rem', fontWeight: 900, fontStyle: 'italic', letterSpacing: '-0.05em', textTransform: 'uppercase' }}>{STORE_NAME}</h2>
                  <p style={{ fontSize: '0.625rem', color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.25rem' }}>Direct Import Specialists</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(227, 247, 126, 0.2)', padding: '0.5rem 1rem', borderRadius: '1rem', marginBottom: '1rem', border: '1px solid rgba(227, 247, 126, 0.3)' }} className="print:border-black print:bg-transparent">
                    <ShieldCheck size={14} style={{ color: 'var(--color-text-primary)' }} />
                    <span style={{ fontSize: '0.5rem', fontWeight: 900, textTransform: 'uppercase' }}>Verified Invoice</span>
                  </div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 900, textTransform: 'uppercase' }}>#{selectedOrder.id}-{selectedOrder.specialCode}</p>
                  <p style={{ fontSize: '0.625rem', color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase' }}>{selectedOrder.createdAt}</p>
                </div>
              </div>
              <div className="invoice-section">
                <div>
                  <p style={{ fontSize: '0.625rem', color: '#9ca3af', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.75rem' }}>Ship To</p>
                  <p style={{ fontWeight: 700 }}>{user.name}</p>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{user.email}</p>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 700 }}>{selectedOrder.hometown}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.625rem', color: '#9ca3af', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.75rem' }}>Payment</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: 700 }}>M-PESA Till {MPESA_TILL_NUMBER}</p>
                  <p style={{ fontSize: '0.625rem', color: '#16a34a', fontWeight: 900, textTransform: 'uppercase', marginTop: '0.25rem' }}>{selectedOrder.paymentStatus}</p>
                </div>
              </div>
              <div className="invoice-table">
                <table style={{ width: '100%' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid rgba(179, 200, 239, 0.1)', fontSize: '0.625rem', fontWeight: 900, color: '#9ca3af', textTransform: 'uppercase' }}>
                      <th style={{ textAlign: 'left', padding: '1rem 0' }}>Product Description</th>
                      <th style={{ textAlign: 'right', padding: '1rem 0' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody style={{ borderTop: '1px solid #f9fafb' }}>
                    {selectedOrder.items.map((item, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f9fafb' }}>
                        <td style={{ padding: '1rem 0', fontWeight: 700, fontSize: '0.875rem' }}>
                          {item.name}
                          {item.selectedVariation && <span style={{ fontSize: '0.7rem', color: '#9ca3af', display: 'block' }}>{item.selectedVariation.value}</span>}
                          x{item.quantity}
                        </td>
                        <td style={{ padding: '1rem 0', textAlign: 'right', fontWeight: 900, fontSize: '0.875rem' }}>
                          KES {((item.selectedVariation?.price || item.price) * item.quantity).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    <tr style={{ borderTop: '2px solid rgba(179, 200, 239, 0.1)' }}>
                      <td style={{ padding: '1rem 0', fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', color: '#9ca3af' }}>Shipping ({selectedOrder.deliveryType})</td>
                      <td style={{ padding: '1rem 0', textAlign: 'right', fontWeight: 900, fontSize: '0.875rem' }}>KES {selectedOrder.deliveryFee.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="invoice-total-bar">
                <div>
                  <p style={{ fontSize: '0.55rem', fontWeight: 900, textTransform: 'uppercase', opacity: 0.6, marginBottom: '0.25rem' }}>Final Amount Due</p>
                  <p style={{ fontSize: '2.25rem', fontWeight: 900, fontStyle: 'italic' }}>KES {selectedOrder.totalAmount.toLocaleString()}</p>
                </div>
                <div style={{ textAlign: 'right', opacity: 0.4, fontSize: '0.5rem', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '0.1em', maxWidth: '150px' }}>
                  Generated by Deenice AI. This serves as a valid receipt for collection.
                </div>
              </div>
              <div className="print:hidden" style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                <button onClick={() => shareInvoiceWhatsApp(selectedOrder)} className="btn-primary" style={{ flexGrow: 1, backgroundColor: '#25D366', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase' }}>
                  <Send size={16} /> Share on WhatsApp
                </button>
                <button onClick={printInvoice} className="btn-primary" style={{ flexGrow: 1, backgroundColor: '#f3f4f6', color: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase' }}>
                  <Printer size={16} /> Print / Save PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;

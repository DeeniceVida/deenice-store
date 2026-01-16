import React, { useState } from 'react';
import { Package, ShoppingBag, Users, DollarSign, ArrowUpRight, ArrowDownRight, Search, Bell, Settings, LayoutDashboard, Zap, Plus, Trash2, Camera, ChevronRight, Share2, Download, Printer, LayoutGrid, Image as ImageIcon, MoreHorizontal, X, Smartphone, ArrowRight, Edit2 } from 'lucide-react';
import {
   BarChart,
   Bar,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   ResponsiveContainer,
   PieChart,
   Pie,
   Cell
} from 'recharts';
import { Product, Order, User, Deal, OrderStatus, PaymentStatus, GadgetListing, Offer, ProductVariation } from '../types';
import { LOGO_URL } from '../constants';

interface AdminDashboardProps {
   products: Product[];
   orders: Order[];
   users: User[];
   deals: Deal[];
   gadgets: GadgetListing[];
   onUpdateOrderStatus: (id: string, status: OrderStatus) => void;
   onUpdatePaymentStatus: (id: string, status: PaymentStatus) => void;
   onUpdateDeals: (deals: Deal[]) => void;
   onUpdateGadgetStatus: (id: string, status: 'APPROVED' | 'REJECTED' | 'PENDING') => void;
   onUpdateOfferStatus: (id: string, status: 'PENDING' | 'ACCEPTED' | 'REJECTED') => void;
   onAddProduct: (product: Product) => void;
   onUpdateProduct: (product: Product) => void;
   offers: Offer[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
   orders,
   products,
   deals,
   gadgets,
   onUpdateOrderStatus,
   onUpdatePaymentStatus,
   onAddProduct,
   onUpdateProduct,
   onUpdateDeals,
   onUpdateGadgetStatus,
   onUpdateOfferStatus,
   offers
}) => {
   const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'settings' | 'deals' | 'gadgets' | 'offers'>('dashboard');
   const [showProductForm, setShowProductForm] = useState(false);
   const [selectedOrderForLabel, setSelectedOrderForLabel] = useState<Order | null>(null);

   const [isAddingDeal, setIsAddingDeal] = useState(false);
   const [dealForm, setDealForm] = useState({ product: '', discountPrice: '', endDate: '' });
   const [editingProductId, setEditingProductId] = useState<string | null>(null);

   // Admin Profile State
   const [adminName, setAdminName] = useState('Andriano Darwin');
   const [adminAvatar, setAdminAvatar] = useState('https://i.pravatar.cc/150?u=admin');

   // Product Form State
   const [newProduct, setNewProduct] = useState<Partial<Product>>({
      name: '',
      description: '',
      price: 0,
      category: 'Desk Setup',
      images: [''],
      colors: [''],
      stock: 0,
      currency: 'KES',
      variations: []
   });

   const chartData = [
      { name: 'Jan', revenue: 4200, profit: 2400 },
      { name: 'Feb', revenue: 3000, profit: 1398 },
      { name: 'Mar', revenue: 6500, profit: 4800 },
      { name: 'May', revenue: 2780, profit: 1908 },
      { name: 'Apr', revenue: 4890, profit: 2800 },
   ];

   const pieData = [
      { name: 'Desk Setup', value: 89532 },
      { name: 'Accessories', value: 188500 },
      { name: 'Lighting', value: 90231 },
      { name: 'Streaming', value: 88865 },
   ];

   const COLORS = ['#CBD5E1', '#0E1016', '#E2E8F0', '#F1F5F9'];

   const exportOrdersCSV = () => {
      const headers = ['Order ID', 'Client', 'Date', 'Status', 'Payment', 'Total', 'Town'];
      const rows = orders.map(o => [
         o.id,
         o.userId,
         o.createdAt,
         o.status,
         o.paymentStatus,
         o.totalAmount,
         o.hometown
      ]);
      const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `deenice_report_${new Date().toISOString().split('T')[0]}.csv`);
      link.click();
   };

   const handleProductSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const product: Product = {
         ...newProduct as Product,
         id: editingProductId || Math.random().toString(36).substr(2, 9),
         salesCount: newProduct.salesCount || 0,
         images: newProduct.images?.filter(img => img.trim() !== '') || [],
         colors: newProduct.colors?.filter(c => c.trim() !== ''),
         variations: newProduct.variations?.filter(v => v.value.trim() !== '') || []
      };
      if (editingProductId) {
         onUpdateProduct(product);
      } else {
         onAddProduct(product);
      }
      setShowProductForm(false);
      setEditingProductId(null);
      setNewProduct({
         name: '',
         description: '',
         price: 0,
         category: 'Desk Setup',
         images: [''],
         colors: [''],
         stock: 0,
         currency: 'KES',
         variations: []
      });
   };

   const handleEditProduct = (product: Product) => {
      setNewProduct(product);
      setEditingProductId(product.id);
      setShowProductForm(true);
   };

   const addVariationField = () => {
      const v: ProductVariation = {
         id: Math.random().toString(36).substr(2, 9),
         type: 'Size',
         value: '',
         price: 0
      };
      setNewProduct({ ...newProduct, variations: [...(newProduct.variations || []), v] });
   };

   const addDeal = () => {
      if (dealForm.product && dealForm.discountPrice && dealForm.endDate) {
         const newDeal: Deal = {
            id: Math.random().toString(36).substr(2, 9),
            productId: dealForm.product,
            discountPrice: parseFloat(dealForm.discountPrice),
            endsAt: new Date(dealForm.endDate).toISOString(),
            isActive: true
         };
         onUpdateDeals([...deals, newDeal]);
         setDealForm({ product: '', discountPrice: '', endDate: '' });
         setIsAddingDeal(false);
      }
   };

   const deleteDeal = (dealId: string) => {
      const updatedDeals = deals.filter(d => d.id !== dealId);
      onUpdateDeals(updatedDeals);
   };

   return (
      <div className="admin-layout">
         {/* Top Navbar */}
         <header className="admin-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <img src={LOGO_URL} style={{ height: '2rem', width: '2rem' }} alt="Logo" />
                  <span style={{ fontWeight: 800, fontSize: '1.125rem', letterSpacing: '-0.025em', textTransform: 'uppercase' }}>DEENICE<span style={{ color: 'var(--color-primary)' }}>.ADMIN</span></span>
               </div>
               <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <button onClick={() => setActiveTab('dashboard')} className={`admin-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}>
                     <LayoutGrid size={18} /> Dashboard
                  </button>
                  <button onClick={() => setActiveTab('products')} className={`admin-nav-btn ${activeTab === 'products' ? 'active' : ''}`}>
                     <Package size={18} /> Products
                  </button>
                  <button onClick={() => setActiveTab('orders')} className={`admin-nav-btn ${activeTab === 'orders' ? 'active' : ''}`}>
                     <ShoppingBag size={18} /> Purchases
                  </button>
                  <button onClick={() => setActiveTab('deals')} className={`admin-nav-btn ${activeTab === 'deals' ? 'active' : ''}`}>
                     <Zap size={18} /> Hot Deals
                  </button>
                  <button onClick={() => setActiveTab('gadgets')} className={`admin-nav-btn ${activeTab === 'gadgets' ? 'active' : ''}`}>
                     <Smartphone size={18} /> Gadget Approvals
                  </button>
                  <button onClick={() => setActiveTab('offers')} className={`admin-nav-btn ${activeTab === 'offers' ? 'active' : ''}`}>
                     <Bell size={18} /> Offers
                  </button>
                  <button onClick={() => setActiveTab('settings')} className={`admin-nav-btn ${activeTab === 'settings' ? 'active' : ''}`}>
                     <Settings size={18} /> Settings
                  </button>
               </nav>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem', borderRadius: '999px', border: '1px solid rgba(0,0,0,0.05)', backgroundColor: '#f9fafb' }}>
                  <img src={adminAvatar} style={{ height: '2rem', width: '2rem', borderRadius: '50%', objectFit: 'cover' }} alt="Admin" />
                  <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>{adminName}</span>
                  <ChevronRight size={14} style={{ transform: 'rotate(90deg)', color: '#9ca3af' }} />
               </div>
            </div>
         </header>

         <main className="admin-main">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
               <h1 style={{ fontSize: '1.5rem', fontWeight: 700, textTransform: 'capitalize' }}>{activeTab}</h1>
               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ position: 'relative' }}>
                     <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                     <input type="text" placeholder="Search..." style={{ padding: '0.625rem 1rem 0.625rem 2.5rem', borderRadius: '999px', border: '1px solid #e5e7eb', width: '16rem', outline: 'none' }} />
                  </div>
                  <button onClick={exportOrdersCSV} className="btn-secondary" style={{ padding: '0.625rem 1.25rem', borderRadius: '999px', fontSize: '0.875rem' }}>
                     <Share2 size={16} style={{ marginRight: '0.5rem' }} /> Export CSV
                  </button>
               </div>
            </div>

            {activeTab === 'dashboard' && (
               <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
                     <div style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="dashboard-card group">
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af' }}>Total Products Sales</p>
                              <div style={{ padding: '0.5rem', borderRadius: '0.75rem', backgroundColor: '#f9fafb' }}><ImageIcon size={18} style={{ color: '#9ca3af' }} /></div>
                           </div>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                              <p style={{ fontSize: '1.875rem', fontWeight: 900 }}>{orders.length.toLocaleString()}</p>
                              <span style={{ backgroundColor: '#E3F77E', fontSize: '0.625rem', fontWeight: 900, padding: '0.25rem 0.5rem', borderRadius: '999px' }}>+10%</span>
                           </div>
                           <button onClick={() => setActiveTab('orders')} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', fontWeight: 700, paddingTop: '1rem', borderTop: '1px solid #f9fafb', color: '#9ca3af', background: 'none', borderLeft: 'none', borderRight: 'none', borderBottom: 'none', cursor: 'pointer' }}>
                              View Sales Details <ArrowRight size={14} />
                           </button>
                        </div>

                        <div className="dashboard-card group">
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af' }}>Total Stock Value</p>
                              <div style={{ padding: '0.5rem', borderRadius: '0.75rem', backgroundColor: '#f9fafb' }}><ShoppingBag size={18} style={{ color: '#9ca3af' }} /></div>
                           </div>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                              <p style={{ fontSize: '1.875rem', fontWeight: 900 }}>{products.reduce((s, p) => s + p.stock, 0).toLocaleString()}</p>
                              <span style={{ backgroundColor: '#FCA5A5', fontSize: '0.625rem', fontWeight: 900, padding: '0.25rem 0.5rem', borderRadius: '999px', color: '#dc2626' }}>-12%</span>
                           </div>
                           <button onClick={() => setActiveTab('products')} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', fontWeight: 700, paddingTop: '1rem', borderTop: '1px solid #f9fafb', color: '#9ca3af', background: 'none', borderLeft: 'none', borderRight: 'none', borderBottom: 'none', cursor: 'pointer' }}>
                              View All Products <ArrowRight size={14} />
                           </button>
                        </div>
                     </div>

                     <div className="dashboard-card" style={{ gridColumn: 'span 5' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                           <h3 style={{ fontWeight: 700 }}>Revenue Growth</h3>
                        </div>
                        <div style={{ height: '16rem' }}>
                           <p style={{ fontSize: '1.875rem', fontWeight: 900, marginBottom: '1.5rem' }}>KES {orders.reduce((s, o) => s + o.totalAmount, 0).toLocaleString()} <span style={{ fontSize: '0.75rem', backgroundColor: '#E3F77E', padding: '0.25rem 0.5rem', borderRadius: '999px', marginLeft: '0.5rem' }}>+45%</span></p>
                           <ResponsiveContainer width="100%" height="80%">
                              <BarChart data={chartData}>
                                 <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#F1F5F9" />
                                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8' }} />
                                 <YAxis hide />
                                 <Tooltip />
                                 <Bar dataKey="revenue" fill="#000" radius={[4, 4, 0, 0]} barSize={32} />
                                 <Bar dataKey="profit" fill="#E2E8F0" radius={[4, 4, 0, 0]} barSize={32} />
                              </BarChart>
                           </ResponsiveContainer>
                        </div>
                     </div>

                     <div className="dashboard-card" style={{ gridColumn: 'span 4' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                           <h3 style={{ fontWeight: 700 }}>Sales Statistics</h3>
                        </div>
                        <div style={{ position: 'relative', height: '16rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                 <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                 </Pie>
                              </PieChart>
                           </ResponsiveContainer>
                        </div>
                     </div>
                  </div>
               </>
            )}

            {activeTab === 'orders' && (
               <div className="dashboard-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                     <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Store Purchases Ledger</h2>
                        <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Manage order statuses and track live shop inventory.</p>
                     </div>
                  </div>
                  <table className="data-table">
                     <thead>
                        <tr>
                           <th>ID</th>
                           <th>Customer</th>
                           <th>Amount</th>
                           <th>Progress</th>
                           <th>Payment</th>
                           <th style={{ textAlign: 'right' }}>Label</th>
                        </tr>
                     </thead>
                     <tbody>
                        {orders.map(order => (
                           <tr key={order.id}>
                              <td style={{ fontWeight: 700 }}>{order.id}</td>
                              <td style={{ fontWeight: 700 }}>{order.userId}</td>
                              <td style={{ fontWeight: 900 }}>KES {order.totalAmount.toLocaleString()}</td>
                              <td>
                                 <select
                                    value={order.status}
                                    onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                                    style={{ backgroundColor: '#f9fafb', border: 'none', borderRadius: '0.5rem', padding: '0.25rem 0.5rem', fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', outline: 'none' }}
                                 >
                                    {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                 </select>
                              </td>
                              <td>
                                 <select
                                    value={order.paymentStatus}
                                    onChange={(e) => onUpdatePaymentStatus(order.id, e.target.value as PaymentStatus)}
                                    style={{ backgroundColor: '#f9fafb', border: 'none', borderRadius: '0.5rem', padding: '0.25rem 0.5rem', fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', outline: 'none' }}
                                 >
                                    {Object.values(PaymentStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                 </select>
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                 <button onClick={() => setSelectedOrderForLabel(order)} className="icon-btn" style={{ marginLeft: 'auto' }}><Printer size={16} /></button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            )}

            {activeTab === 'settings' && (
               <div className="dashboard-card" style={{ maxWidth: '42rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, fontStyle: 'italic', marginBottom: '2.5rem' }}>Admin Profile Identity</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                     <div style={{ position: 'relative' }} className="group">
                        <img src={adminAvatar} style={{ width: '6rem', height: '6rem', borderRadius: '50%', objectFit: 'cover', border: '4px solid rgba(179, 200, 239, 0.2)', boxShadow: 'var(--shadow-xl)' }} />
                        <label style={{ position: 'absolute', bottom: 0, right: 0, background: 'black', color: 'white', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer' }}>
                           <Camera size={16} />
                           <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                 const reader = new FileReader();
                                 reader.onload = (re) => setAdminAvatar(re.target?.result as string);
                                 reader.readAsDataURL(file);
                              }
                           }} />
                        </label>
                     </div>
                     <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                           <label style={{ display: 'block', fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', color: '#9ca3af', marginBottom: '0.5rem' }}>Public Admin Name</label>
                           <div style={{ display: 'flex', gap: '1rem' }}>
                              <input
                                 type="text"
                                 style={{ flexGrow: 1, backgroundColor: '#f9fafb', borderRadius: '1rem', padding: '1rem', fontSize: '0.875rem', fontWeight: 700, border: 'none', outline: 'none' }}
                                 value={adminName}
                                 onChange={(e) => setAdminName(e.target.value)}
                              />
                              <button className="confera-btn" style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem' }}>
                                 Update Identity
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'products' && (
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                  {products.map(p => (
                     <div key={p.id} className="dashboard-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', position: 'relative' }}>
                        <img src={p.images[0]} style={{ width: '5rem', height: '5rem', borderRadius: '1rem', objectFit: 'cover' }} />
                        <div style={{ flexGrow: 1 }}>
                           <h4 style={{ fontWeight: 700 }}>{p.name}</h4>
                           <p style={{ fontSize: '0.875rem', fontWeight: 900, marginTop: '0.5rem' }}>KES {p.price.toLocaleString()}</p>
                        </div>
                        <button onClick={() => handleEditProduct(p)} className="icon-btn" style={{ padding: '0.5rem', backgroundColor: '#f9fafb' }}>
                           <Edit2 size={16} />
                        </button>
                     </div>
                  ))}
                  <button
                     onClick={() => setShowProductForm(true)}
                     style={{ border: '4px dashed #f3f4f6', borderRadius: '2rem', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: '#d1d5db', cursor: 'pointer', background: 'transparent' }}
                     className="hover-text-primary"
                  >
                     <Plus size={32} />
                     <span style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>New Tech Item</span>
                  </button>
               </div>
            )}

            {activeTab === 'deals' && (
               <div style={{ animation: 'fadeIn 0.3s ease' }}>
                  {/* ... (Existing deals code) ... */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                     <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Active Hot Deals</h2>
                     <button onClick={() => setIsAddingDeal(true)} className="btn-primary">
                        <Plus size={20} /> Create Deal
                     </button>
                  </div>

                  {isAddingDeal && (
                     <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', borderRadius: '24px' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>New Flash Sale</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                           <div>
                              <label className="input-label">Select Product</label>
                              <select
                                 className="admin-input"
                                 value={dealForm.product}
                                 onChange={(e) => setDealForm({ ...dealForm, product: e.target.value })}
                                 style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                              >
                                 <option value="">-- Choose Product --</option>
                                 {products.map(p => (
                                    <option key={p.id} value={p.id}>{p.name} (KES {p.price.toLocaleString()})</option>
                                 ))}
                              </select>
                           </div>
                           <div>
                              <label className="input-label">Discount Price (KES)</label>
                              <input
                                 type="number"
                                 className="admin-input"
                                 style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                                 value={dealForm.discountPrice}
                                 onChange={(e) => setDealForm({ ...dealForm, discountPrice: e.target.value })}
                              />
                           </div>
                           <div>
                              <label className="input-label">End Date</label>
                              <input
                                 type="datetime-local"
                                 className="admin-input"
                                 style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                                 value={dealForm.endDate}
                                 onChange={(e) => setDealForm({ ...dealForm, endDate: e.target.value })}
                              />
                           </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                           <button onClick={() => setIsAddingDeal(false)} className="btn-outline">Cancel</button>
                           <button onClick={addDeal} className="btn-primary">Publish Deal</button>
                        </div>
                     </div>
                  )}

                  <div className="orders-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                     {deals.map(deal => {
                        const product = products.find(p => p.id === deal.productId);
                        if (!product) return null;
                        return (
                           <div key={deal.id} className="stat-card" style={{ position: 'relative', background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                              <button onClick={() => deleteDeal(deal.id)} style={{ position: 'absolute', top: '1rem', right: '1rem', color: '#ef4444' }}>
                                 <Trash2 size={18} />
                              </button>
                              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                                 <img src={product.images[0]} style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }} />
                                 <div>
                                    <h4 style={{ fontWeight: 700 }}>{product.name}</h4>
                                    <span className="badge" style={{ background: '#FECACA', color: '#EF4444', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>Ends: {new Date(deal.endsAt).toLocaleDateString()}</span>
                                 </div>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #f3f4f6' }}>
                                 <div>
                                    <span style={{ textDecoration: 'line-through', color: '#9ca3af', fontSize: '0.875rem' }}>KES {product.price.toLocaleString()}</span>
                                    <div style={{ fontWeight: 900, fontSize: '1.25rem', color: 'var(--color-primary-dark)' }}>KES {deal.discountPrice.toLocaleString()}</div>
                                 </div>
                                 <div className="badge" style={{ background: '#D1FAE5', color: '#059669', padding: '4px 8px', borderRadius: '4px' }}>ACTIVE</div>
                              </div>
                           </div>
                        );
                     })}
                  </div>
               </div>
            )}

            {activeTab === 'gadgets' && (
               <div style={{ animation: 'fadeIn 0.3s ease' }}>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '2rem' }}>Gadget Approvals</h2>

                  <div className="orders-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                     {gadgets.length === 0 && <p className="text-gray-400">No gadgets pending approval.</p>}
                     {gadgets.map(gadget => (
                        <div key={gadget.id} className="stat-card" style={{ display: 'grid', gridTemplateColumns: 'min-content 1fr min-content', gap: '2rem', alignItems: 'center', background: 'white', padding: '20px', borderRadius: '16px' }}>
                           <img src={gadget.images[0]} style={{ width: '100px', height: '100px', borderRadius: '12px', objectFit: 'cover' }} />

                           <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                 <h4 style={{ fontWeight: 700, fontSize: '1.25rem' }}>{gadget.deviceName}</h4>
                                 <span className={`badge ${gadget.status === 'APPROVED' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`} style={{ padding: '4px 12px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700 }}>
                                    {gadget.status}
                                 </span>
                              </div>
                              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
                                 Seller: <span style={{ fontWeight: 700, color: 'black' }}>{gadget.sellerName}</span> • Loc: {gadget.location} • Price: <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>KES {gadget.price.toLocaleString()}</span>
                              </p>

                              <div style={{ display: 'flex', gap: '2rem', fontSize: '0.875rem', color: '#4b5563', background: '#f9fafb', padding: '1rem', borderRadius: '12px' }}>
                                 <div>
                                    <span style={{ display: 'block', fontSize: '0.625rem', textTransform: 'uppercase', fontWeight: 900, color: '#9ca3af' }}>Condition</span>
                                    {gadget.condition}
                                 </div>
                                 <div>
                                    <span style={{ display: 'block', fontSize: '0.625rem', textTransform: 'uppercase', fontWeight: 900, color: '#9ca3af' }}>Duration</span>
                                    {gadget.durationUsed}
                                 </div>
                                 <div>
                                    <span style={{ display: 'block', fontSize: '0.625rem', textTransform: 'uppercase', fontWeight: 900, color: '#9ca3af' }}>RFS</span>
                                    {gadget.rfs}
                                 </div>
                              </div>
                           </div>

                           <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              {gadget.status === 'PENDING' && (
                                 <>
                                    <button
                                       onClick={() => onUpdateGadgetStatus(gadget.id, 'APPROVED')}
                                       className="btn-primary"
                                       style={{ justifyContent: 'center', backgroundColor: '#10B981', borderColor: '#10B981' }}
                                    >
                                       Approve Listing
                                    </button>
                                    <button
                                       onClick={() => onUpdateGadgetStatus(gadget.id, 'REJECTED')}
                                       className="btn-outline"
                                       style={{ justifyContent: 'center', color: '#EF4444', borderColor: '#FECACA', background: '#FEF2F2' }}
                                    >
                                       Reject
                                    </button>
                                 </>
                              )}
                              {gadget.status !== 'PENDING' && (
                                 <button onClick={() => onUpdateGadgetStatus(gadget.id, 'PENDING')} style={{ fontSize: '0.75rem', textDecoration: 'underline', color: '#9ca3af' }}>Reset Status</button>
                              )}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}
         </main>


         {/* ArrowRight Icon Component (Simulated if missing, but we imported it from lucide-react above) */}

         {/* Product Form Modal */}
         {showProductForm && (
            <div className="admin-modal-overlay">
               <div className="admin-modal-backdrop" onClick={() => { setShowProductForm(false); setEditingProductId(null); }} />
               <div className="admin-modal-content">
                  <h2 style={{ fontSize: '1.875rem', fontWeight: 900, fontStyle: 'italic', marginBottom: '2rem' }}>{editingProductId ? 'Edit' : 'Add New'} <span style={{ color: 'var(--color-primary)' }}>Curated Tech</span></h2>
                  <form onSubmit={handleProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                     {/* ... Form inputs ... */}
                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <input required placeholder="Item Name" type="text" style={{ width: '100%', backgroundColor: '#f9fafb', border: 'none', borderRadius: '0.75rem', padding: '1rem', fontSize: '0.875rem' }} value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                        <select style={{ width: '100%', backgroundColor: '#f9fafb', border: 'none', borderRadius: '0.75rem', padding: '1rem', fontSize: '0.875rem' }} value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}>
                           <option>Desk Setup</option><option>Lighting</option><option>Accessories</option><option>Streaming</option>
                        </select>
                     </div>
                     <textarea required placeholder="Premium Description" rows={3} style={{ width: '100%', backgroundColor: '#f9fafb', border: 'none', borderRadius: '0.75rem', padding: '1rem', fontSize: '0.875rem' }} value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <input required placeholder="Price (KES)" type="number" style={{ width: '100%', backgroundColor: '#f9fafb', border: 'none', borderRadius: '0.75rem', padding: '1rem', fontSize: '0.875rem' }} value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })} />
                        <input required placeholder="Initial Stock" type="number" style={{ width: '100%', backgroundColor: '#f9fafb', border: 'none', borderRadius: '0.75rem', padding: '1rem', fontSize: '0.875rem' }} value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: Number(e.target.value) })} />
                     </div>

                     <div style={{ border: '1px solid #f3f4f6', padding: '1.5rem', borderRadius: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase' }}>Product Images (URLs)</h4>
                           <button type="button" onClick={() => setNewProduct({ ...newProduct, images: [...(newProduct.images || []), ''] })} className="icon-btn" style={{ backgroundColor: '#f9fafb' }}><Plus size={16} /></button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                           {newProduct.images?.map((img, idx) => (
                              <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                 <input
                                    placeholder="https://example.com/image.jpg"
                                    style={{ flex: 1, padding: '0.5rem', borderRadius: '0.5rem', fontSize: '0.75rem', border: '1px solid #eee' }}
                                    value={img}
                                    onChange={(e) => {
                                       const updated = [...(newProduct.images || [])];
                                       updated[idx] = e.target.value;
                                       setNewProduct({ ...newProduct, images: updated });
                                    }}
                                 />
                                 <button type="button" onClick={() => setNewProduct({ ...newProduct, images: newProduct.images?.filter((_, i) => i !== idx) })} style={{ color: '#ef4444' }}><X size={14} /></button>
                              </div>
                           ))}
                        </div>
                     </div>

                     <div style={{ border: '1px solid #f3f4f6', padding: '1.5rem', borderRadius: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase' }}>Variations (Sizes / Designs)</h4>
                           <button type="button" onClick={addVariationField} className="icon-btn" style={{ backgroundColor: '#f9fafb' }}><Plus size={16} /></button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                           {newProduct.variations?.map((v, idx) => (
                              <div key={v.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 2fr auto', gap: '0.5rem', alignItems: 'center' }}>
                                 <select
                                    style={{ padding: '0.5rem', borderRadius: '0.5rem', fontSize: '0.75rem', border: '1px solid #eee' }}
                                    value={v.type}
                                    onChange={(e) => {
                                       const updated = [...(newProduct.variations || [])];
                                       updated[idx].type = e.target.value as any;
                                       setNewProduct({ ...newProduct, variations: updated });
                                    }}
                                 >
                                    <option>Size</option><option>Design</option><option>Color</option>
                                 </select>
                                 <input
                                    placeholder="Value"
                                    style={{ padding: '0.5rem', borderRadius: '0.5rem', fontSize: '0.75rem', border: '1px solid #eee' }}
                                    value={v.value}
                                    onChange={(e) => {
                                       const updated = [...(newProduct.variations || [])];
                                       updated[idx].value = e.target.value;
                                       setNewProduct({ ...newProduct, variations: updated });
                                    }}
                                 />
                                 <input
                                    placeholder="Price"
                                    type="number"
                                    style={{ padding: '0.5rem', borderRadius: '0.5rem', fontSize: '0.75rem', border: '1px solid #eee' }}
                                    value={v.price}
                                    onChange={(e) => {
                                       const updated = [...(newProduct.variations || [])];
                                       updated[idx].price = Number(e.target.value);
                                       setNewProduct({ ...newProduct, variations: updated });
                                    }}
                                 />
                                 <input
                                    placeholder="Image URL (optional)"
                                    style={{ padding: '0.5rem', borderRadius: '0.5rem', fontSize: '0.75rem', border: '1px solid #eee' }}
                                    value={v.image || ''}
                                    onChange={(e) => {
                                       const updated = [...(newProduct.variations || [])];
                                       updated[idx].image = e.target.value;
                                       setNewProduct({ ...newProduct, variations: updated });
                                    }}
                                 />
                                 <button type="button" onClick={() => setNewProduct({ ...newProduct, variations: newProduct.variations?.filter((_, i) => i !== idx) })} style={{ color: '#ef4444' }}><X size={14} /></button>
                              </div>
                           ))}
                        </div>
                     </div>
                     <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem' }}>
                        <button type="submit" className="btn-primary" style={{ flexGrow: 1, borderRadius: '1rem', padding: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem' }}>
                           {editingProductId ? 'Save Changes' : 'Publish to Store'}
                        </button>
                        <button type="button" onClick={() => { setShowProductForm(false); setEditingProductId(null); }} style={{ padding: '0 2rem', borderRadius: '1rem', fontWeight: 700, backgroundColor: '#f3f4f6' }}>Cancel</button>
                     </div>
                  </form>
               </div>
            </div>
         )}
      </div>
   );
};

export default AdminDashboard;

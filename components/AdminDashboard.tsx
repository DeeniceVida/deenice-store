
import React, { useState, useMemo } from 'react';
import {
   Package, ShoppingBag, Users, DollarSign, ArrowUpRight, ArrowDownRight,
   Search, Bell, Settings, LayoutDashboard, Zap, Plus, Trash2, Camera,
   ChevronRight, Share2, Download, Printer, LayoutGrid, Image as ImageIcon,
   MoreHorizontal, X, Smartphone, ArrowRight, Edit2, TrendingUp, TrendingDown,
   Briefcase, Clock, MapPin, CheckCircle, XCircle
} from 'lucide-react';
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
   Cell,
   AreaChart,
   Area
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
   onDeleteDeal: (id: string) => void;
   onUpdateGadgetStatus: (id: string, status: 'APPROVED' | 'REJECTED' | 'PENDING') => void;
   onUpdateOfferStatus: (id: string, status: 'PENDING' | 'ACCEPTED' | 'REJECTED') => void;
   onAddProduct: (product: Product) => void;
   onUpdateProduct: (product: Product) => void;
   offers: Offer[];
   adminName: string;
   adminAvatar: string;
   onUpdateAdminProfile: (name: string, avatar: string) => void;
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
   onDeleteDeal,
   onUpdateGadgetStatus,
   onUpdateOfferStatus,
   adminName,
   adminAvatar,
   onUpdateAdminProfile,
   offers
}) => {
   const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'settings' | 'deals' | 'gadgets' | 'offers'>('dashboard');
   const [showProductForm, setShowProductForm] = useState(false);
   const [selectedOrderForLabel, setSelectedOrderForLabel] = useState<Order | null>(null);

   const [isAddingDeal, setIsAddingDeal] = useState(false);
   const [dealForm, setDealForm] = useState({ product: '', discountPrice: '', endDate: '' });
   const [editingProductId, setEditingProductId] = useState<string | null>(null);

   const [tempAdminName, setTempAdminName] = useState(adminName);
   const [tempAdminAvatar, setTempAdminAvatar] = useState(adminAvatar);

   React.useEffect(() => {
      setTempAdminName(adminName);
      setTempAdminAvatar(adminAvatar);
   }, [adminName, adminAvatar]);

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

   // --- DATA ENGINE: Analytics & Reporting ---
   const stats = useMemo(() => {
      const paidOrders = orders.filter(o => o.paymentStatus === 'Paid');
      const totalRevenue = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);
      const totalSales = orders.length;
      const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
      const avgOrder = totalSales > 0 ? totalRevenue / totalSales : 0;

      // Group Revenue by Month for Chart
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthlyData = months.map(month => {
         const revenue = orders
            .filter(o => {
               const d = new Date(o.createdAt);
               return months[d.getMonth()] === month;
            })
            .reduce((sum, o) => sum + o.totalAmount, 0);
         return { name: month, revenue };
      }).filter(d => d.revenue > 0 || months.indexOf(d.name) <= new Date().getMonth());

      // Category Distribution
      const categories = ['Desk Setup', 'Lighting', 'Accessories', 'Streaming'];
      const categoryData = categories.map(cat => ({
         name: cat,
         value: products.filter(p => p.category === cat).reduce((sum, p) => sum + (p.price * p.stock), 0)
      }));

      return { totalRevenue, totalSales, totalStock, avgOrder, monthlyData, categoryData };
   }, [orders, products]);

   const COLORS = ['#000000', '#475569', '#94A3B8', '#CBD5E1'];

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
      link.setAttribute("download", `deenice_revenue_report_${new Date().toISOString().split('T')[0]}.csv`);
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
      onDeleteDeal(dealId);
   };

   return (
      <div className="admin-layout" style={{ backgroundColor: '#fcfcfc' }}>
         {/* Premium Top Navbar */}
         <header className="admin-header" style={{ borderBottom: '1.5px solid #000', padding: '1rem 2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img src={LOGO_URL} style={{ height: '2.5rem', width: '2.5rem', filter: 'grayscale(1)' }} alt="Logo" />
                  <span style={{ fontWeight: 900, fontSize: '1.25rem', letterSpacing: '-0.05em', textTransform: 'uppercase' }}>DEENICE<span style={{ opacity: 0.3 }}>.ADMIN</span></span>
               </div>
               <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {[
                     { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
                     { id: 'products', label: 'Inventory', icon: Package },
                     { id: 'orders', label: 'Purchases', icon: ShoppingBag },
                     { id: 'deals', label: 'Flash Sales', icon: Zap },
                     { id: 'gadgets', label: 'Approvals', icon: Smartphone },
                     { id: 'offers', label: 'Offers', icon: Bell },
                     { id: 'settings', label: 'Identity', icon: Settings },
                  ].map(tab => (
                     <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`admin-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                        style={{
                           display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1rem',
                           borderRadius: '8px', border: 'none', background: activeTab === tab.id ? '#000' : 'transparent',
                           color: activeTab === tab.id ? '#fff' : '#64748b', fontSize: '0.8125rem', fontWeight: 700,
                           transition: 'all 0.2s', cursor: 'pointer'
                        }}
                     >
                        <tab.icon size={16} /> {tab.label}
                     </button>
                  ))}
               </nav>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', borderRadius: '12px', background: '#fff', border: '1.5px solid #000' }}>
                  <img src={adminAvatar} style={{ height: '2rem', width: '2rem', borderRadius: '8px', objectFit: 'cover' }} alt="Admin" />
                  <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                     <span style={{ fontSize: '0.75rem', fontWeight: 900 }}>{adminName}</span>
                     <span style={{ fontSize: '0.625rem', fontWeight: 700, opacity: 0.5 }}>STORE OWNER</span>
                  </div>
               </div>
            </div>
         </header>

         <main className="admin-main" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
               <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.4, marginBottom: '0.5rem' }}>Store Diagnostics</div>
                  <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em', textTransform: 'capitalize' }}>{activeTab}</h1>
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ position: 'relative' }}>
                     <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
                     <input type="text" placeholder="Search orders, gadgets..." style={{ padding: '0.875rem 1rem 0.875rem 3rem', borderRadius: '12px', border: '1.5px solid #000', width: '20rem', outline: 'none', fontWeight: 700 }} />
                  </div>
                  <button onClick={exportOrdersCSV} style={{ padding: '0.875rem 1.5rem', borderRadius: '12px', background: '#000', color: '#fff', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none', cursor: 'pointer' }}>
                     <Download size={18} /> REPORT
                  </button>
               </div>
            </div>

            {activeTab === 'dashboard' && (
               <>
                  {/* Stats Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                     {[
                        { label: 'Total Revenue', value: `KES ${stats.totalRevenue.toLocaleString()}`, change: '+24.5%', icon: DollarSign, positive: true },
                        { label: 'Product Sales', value: stats.totalSales, change: '+12%', icon: ShoppingBag, positive: true },
                        { label: 'Volume Sold', value: stats.totalStock, change: '-4%', icon: Package, positive: false },
                        { label: 'Avg Order', value: `KES ${Math.round(stats.avgOrder).toLocaleString()}`, change: '+8%', icon: Zap, positive: true },
                     ].map((stat, i) => (
                        <div key={i} style={{ background: '#fff', border: '1.5px solid #000', padding: '1.5rem', borderRadius: '16px', boxShadow: '4px 4px 0 #000' }}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                              <div style={{ padding: '0.5rem', background: '#000', borderRadius: '8px', color: '#fff' }}><stat.icon size={20} /></div>
                              <div style={{ fontSize: '0.75rem', fontWeight: 900, color: stat.positive ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', gap: '2px' }}>
                                 {stat.positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />} {stat.change}
                              </div>
                           </div>
                           <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.4, marginBottom: '0.25rem' }}>{stat.label}</div>
                           <div style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.02em' }}>{stat.value}</div>
                        </div>
                     ))}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
                     {/* Revenue Chart */}
                     <div style={{ gridColumn: 'span 8', background: '#fff', border: '1.5px solid #000', padding: '2rem', borderRadius: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                           <h3 style={{ fontWeight: 900, fontSize: '1.25rem' }}>Revenue Analytics</h3>
                           <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: '#000', color: '#fff', fontSize: '0.75rem', fontWeight: 900, border: 'none' }}>MONTHLY</button>
                              <button style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: 'transparent', color: '#000', fontSize: '0.75rem', fontWeight: 900, border: '1.5px solid #000' }}>ANNUAL</button>
                           </div>
                        </div>
                        <div style={{ height: '20rem' }}>
                           <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={stats.monthlyData}>
                                 <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                       <stop offset="5%" stopColor="#000" stopOpacity={0.1} />
                                       <stop offset="95%" stopColor="#000" stopOpacity={0} />
                                    </linearGradient>
                                 </defs>
                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }} />
                                 <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }} />
                                 <Tooltip contentStyle={{ borderRadius: '12px', border: '2px solid #000', fontWeight: 700 }} />
                                 <Area type="monotone" dataKey="revenue" stroke="#000" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                              </AreaChart>
                           </ResponsiveContainer>
                        </div>
                     </div>

                     {/* Pie Chart */}
                     <div style={{ gridColumn: 'span 4', background: '#fff', border: '1.5px solid #000', padding: '2rem', borderRadius: '20px' }}>
                        <h3 style={{ fontWeight: 900, fontSize: '1.25rem', marginBottom: '2rem' }}>Category Mix</h3>
                        <div style={{ height: '20rem', position: 'relative' }}>
                           <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                 <Pie data={stats.categoryData} innerRadius={70} outerRadius={90} paddingAngle={2} dataKey="value">
                                    {stats.categoryData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                 </Pie>
                                 <Tooltip />
                              </PieChart>
                           </ResponsiveContainer>
                           <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                              {stats.categoryData.map((cat, i) => (
                                 <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                       <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: COLORS[i % COLORS.length] }}></div>
                                       <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{cat.name}</span>
                                    </div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 900 }}>KES {cat.value.toLocaleString()}</span>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Top Products Table */}
                  <div style={{ marginTop: '2.5rem', background: '#fff', border: '1.5px solid #000', borderRadius: '20px', overflow: 'hidden' }}>
                     <div style={{ padding: '1.5rem 2rem', borderBottom: '1.5px solid #000', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontWeight: 900, fontSize: '1.25rem' }}>Top Selling Gear</h3>
                        <button onClick={() => setActiveTab('products')} style={{ fontSize: '0.75rem', fontWeight: 900, color: '#000', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>VIEW FULL INVENTORY <ChevronRight size={14} /></button>
                     </div>
                     <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#fafafa', borderBottom: '1.5px solid #000' }}>
                           <tr>
                              <th style={{ textAlign: 'left', padding: '1rem 2rem', fontSize: '0.75rem', fontWeight: 900, opacity: 0.4 }}>PRODUCT</th>
                              <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.75rem', fontWeight: 900, opacity: 0.4 }}>CATEGORY</th>
                              <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.75rem', fontWeight: 900, opacity: 0.4 }}>STOCK</th>
                              <th style={{ textAlign: 'right', padding: '1rem 2rem', fontSize: '0.75rem', fontWeight: 900, opacity: 0.4 }}>REVENUE</th>
                           </tr>
                        </thead>
                        <tbody>
                           {products.slice(0, 5).map((p, i) => (
                              <tr key={i} style={{ borderBottom: i === 4 ? 'none' : '1px solid #f1f5f9' }}>
                                 <td style={{ padding: '1rem 2rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                       <img src={p.images[0]} style={{ width: '3rem', height: '3rem', borderRadius: '8px', objectFit: 'cover', border: '1px solid #eee' }} />
                                       <div style={{ fontWeight: 800, fontSize: '0.875rem' }}>{p.name}</div>
                                    </div>
                                 </td>
                                 <td style={{ padding: '1rem' }}><span style={{ fontSize: '0.75rem', fontWeight: 700, background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px' }}>{p.category}</span></td>
                                 <td style={{ padding: '1rem' }}><span style={{ fontSize: '0.875rem', fontWeight: 800 }}>{p.stock} units</span></td>
                                 <td style={{ padding: '1rem 2rem', textAlign: 'right', fontWeight: 900 }}>KES {(p.price * (p.salesCount || 0)).toLocaleString()}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </>
            )}

            {activeTab === 'orders' && (
               <div style={{ background: '#fff', border: '1.5px solid #000', borderRadius: '20px', overflow: 'hidden' }}>
                  <div style={{ padding: '2rem', borderBottom: '1.5px solid #000' }}>
                     <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Purchase Ledger</h2>
                     <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Real-time order tracking and financial logs.</p>
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                     <thead style={{ background: '#fafafa', borderBottom: '1.5px solid #000' }}>
                        <tr>
                           <th style={{ textAlign: 'left', padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: 900, opacity: 0.4 }}>ORDER ID</th>
                           <th style={{ textAlign: 'left', padding: '1.25rem', fontSize: '0.75rem', fontWeight: 900, opacity: 0.4 }}>CUSTOMER</th>
                           <th style={{ textAlign: 'left', padding: '1.25rem', fontSize: '0.75rem', fontWeight: 900, opacity: 0.4 }}>AMOUNT</th>
                           <th style={{ textAlign: 'left', padding: '1.25rem', fontSize: '0.75rem', fontWeight: 900, opacity: 0.4 }}>STATUS</th>
                           <th style={{ textAlign: 'left', padding: '1.25rem', fontSize: '0.75rem', fontWeight: 900, opacity: 0.4 }}>PAYMENT</th>
                           <th style={{ textAlign: 'right', padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: 900, opacity: 0.4 }}>ACTIONS</th>
                        </tr>
                     </thead>
                     <tbody>
                        {orders.map(order => (
                           <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '1.25rem 2rem', fontWeight: 900 }}>{order.id}</td>
                              <td style={{ padding: '1.25rem' }}>
                                 <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{order.userId}</div>
                                 <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                              </td>
                              <td style={{ padding: '1.25rem', fontWeight: 900 }}>KES {order.totalAmount.toLocaleString()}</td>
                              <td style={{ padding: '1.25rem' }}>
                                 <select
                                    value={order.status}
                                    onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                                    style={{ padding: '6px 12px', borderRadius: '8px', border: '1.5px solid #000', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', outline: 'none' }}
                                 >
                                    {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                 </select>
                              </td>
                              <td style={{ padding: '1.25rem' }}>
                                 <select
                                    value={order.paymentStatus}
                                    onChange={(e) => onUpdatePaymentStatus(order.id, e.target.value as PaymentStatus)}
                                    style={{ padding: '6px 12px', borderRadius: '8px', border: '1.5px solid #000', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', outline: 'none', background: order.paymentStatus === 'Paid' ? '#E3F77E' : '#fff' }}
                                 >
                                    {Object.values(PaymentStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                 </select>
                              </td>
                              <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
                                 <button onClick={() => setSelectedOrderForLabel(order)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#000' }}><Printer size={20} /></button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            )}

            {activeTab === 'settings' && (
               <div style={{ background: '#fff', border: '1.5px solid #000', borderRadius: '24px', padding: '3rem', maxWidth: '50rem' }}>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '2.5rem' }}>Store Identity</h2>
                  <div style={{ display: 'flex', gap: '3rem' }}>
                     <div style={{ position: 'relative' }}>
                        <img src={tempAdminAvatar} style={{ width: '8rem', height: '8rem', borderRadius: '24px', objectFit: 'cover', border: '3px solid #000' }} />
                        <label style={{ position: 'absolute', bottom: '-0.75rem', right: '-0.75rem', background: '#000', color: '#fff', padding: '0.75rem', borderRadius: '12px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                           <Camera size={20} />
                           <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                 const reader = new FileReader();
                                 reader.onload = (re) => setTempAdminAvatar(re.target?.result as string);
                                 reader.readAsDataURL(file);
                              }
                           }} />
                        </label>
                     </div>
                     <div style={{ flexGrow: 1 }}>
                        <div style={{ marginBottom: '2rem' }}>
                           <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', color: '#64748b', marginBottom: '0.75rem' }}>Admin Handle</label>
                           <input
                              type="text"
                              style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '2px solid #000', fontSize: '1rem', fontWeight: 700, outline: 'none' }}
                              value={tempAdminName}
                              onChange={(e) => setTempAdminName(e.target.value)}
                           />
                        </div>
                        <button
                           onClick={() => onUpdateAdminProfile(tempAdminName, tempAdminAvatar)}
                           style={{ width: '100%', padding: '1.25rem', borderRadius: '12px', background: '#000', color: '#fcfcfc', fontWeight: 900, border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                        >
                           UPDATE IDENTITY
                        </button>
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'products' && (
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                  <button
                     onClick={() => { setShowProductForm(true); setEditingProductId(null); }}
                     style={{ border: '2px dashed #000', borderRadius: '24px', padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', background: 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}
                     className="hover-bg-black"
                  >
                     <Plus size={40} />
                     <span style={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>New Product</span>
                  </button>
                  {products.map(p => (
                     <div key={p.id} style={{ background: '#fff', border: '1.5px solid #000', padding: '1.5rem', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '1.5rem', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#E3F77E', padding: '4px 10px', borderRadius: '99px', fontSize: '0.625rem', fontWeight: 900 }}>{p.category}</div>
                        <img src={p.images[0]} style={{ width: '6rem', height: '6rem', borderRadius: '16px', objectFit: 'cover', border: '1px solid #eee' }} />
                        <div style={{ flexGrow: 1 }}>
                           <h4 style={{ fontWeight: 900, fontSize: '1.125rem' }}>{p.name}</h4>
                           <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ fontWeight: 900, color: '#000' }}>KES {p.price.toLocaleString()}</span>
                              <span style={{ fontSize: '0.75rem', opacity: 0.4 }}>•</span>
                              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: p.stock < 5 ? '#ef4444' : '#64748b' }}>Stock: {p.stock}</span>
                           </div>
                           <button onClick={() => handleEditProduct(p)} style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#000', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 900, cursor: 'pointer' }}>
                              <Edit2 size={12} /> EDIT GEAR
                           </button>
                        </div>
                     </div>
                  ))}
               </div>
            )}

            {activeTab === 'deals' && (
               <div style={{ animation: 'fadeIn 0.3s ease' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                     <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.4, marginBottom: '0.5rem' }}>Flash Management</div>
                        <h2 style={{ fontSize: '2rem', fontWeight: 900 }}>Active Sale Events</h2>
                     </div>
                     <button onClick={() => setIsAddingDeal(true)} style={{ padding: '1rem 2rem', borderRadius: '16px', background: '#000', color: '#fff', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none', cursor: 'pointer' }}>
                        <Zap size={20} /> CREATE EVENT
                     </button>
                  </div>

                  {isAddingDeal && (
                     <div style={{ background: '#000', color: '#fff', padding: '2.5rem', marginBottom: '3rem', borderRadius: '32px' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '2rem' }}>Configure Flash Event</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                           <div>
                              <label style={{ display: 'block', fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', opacity: 0.5, marginBottom: '0.75rem' }}>TARGET PRODUCT</label>
                              <select
                                 style={{ width: '100%', padding: '1.25rem', borderRadius: '12px', background: '#1a1a1a', border: 'none', color: '#fff', fontWeight: 700, outline: 'none' }}
                                 value={dealForm.product}
                                 onChange={(e) => setDealForm({ ...dealForm, product: e.target.value })}
                              >
                                 <option value="">-- Choose Item --</option>
                                 {products.map(p => (
                                    <option key={p.id} value={p.id}>{p.name} (KES {p.price.toLocaleString()})</option>
                                 ))}
                              </select>
                           </div>
                           <div>
                              <label style={{ display: 'block', fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', opacity: 0.5, marginBottom: '0.75rem' }}>FESTIVAL PRICE (KES)</label>
                              <input
                                 type="number"
                                 style={{ width: '100%', padding: '1.25rem', borderRadius: '12px', background: '#1a1a1a', border: 'none', color: '#fff', fontWeight: 700, outline: 'none' }}
                                 value={dealForm.discountPrice}
                                 onChange={(e) => setDealForm({ ...dealForm, discountPrice: e.target.value })}
                              />
                           </div>
                           <div>
                              <label style={{ display: 'block', fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', opacity: 0.5, marginBottom: '0.75rem' }}>EXPIRY TIMESTAMP</label>
                              <input
                                 type="datetime-local"
                                 style={{ width: '100%', padding: '1.25rem', borderRadius: '12px', background: '#1a1a1a', border: 'none', color: '#fff', fontWeight: 700, outline: 'none' }}
                                 value={dealForm.endDate}
                                 onChange={(e) => setDealForm({ ...dealForm, endDate: e.target.value })}
                              />
                           </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                           <button onClick={() => setIsAddingDeal(false)} style={{ background: 'transparent', color: '#fff', border: 'none', fontWeight: 900, cursor: 'pointer' }}>CANCEL</button>
                           <button onClick={addDeal} style={{ padding: '1.25rem 3rem', borderRadius: '12px', background: '#E3F77E', color: '#000', fontWeight: 900, border: 'none', cursor: 'pointer' }}>PUBLISH SALE</button>
                        </div>
                     </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
                     {deals.map(deal => {
                        const product = products.find(p => p.id === deal.productId);
                        if (!product) return null;
                        return (
                           <div key={deal.id} style={{ background: '#fff', border: '1.5px solid #000', padding: '1.5rem', borderRadius: '24px', position: 'relative' }}>
                              <button onClick={() => deleteDeal(deal.id)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}>
                                 <Trash2 size={20} />
                              </button>
                              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                                 <img src={product.images[0]} style={{ width: '5rem', height: '5rem', borderRadius: '16px', objectFit: 'cover' }} />
                                 <div>
                                    <h4 style={{ fontWeight: 900, fontSize: '1.125rem' }}>{product.name}</h4>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '0.25rem' }}>
                                       <Clock size={12} style={{ color: '#ef4444' }} />
                                       <span style={{ color: '#ef4444', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase' }}>ENDS: {new Date(deal.endsAt).toLocaleDateString()}</span>
                                    </div>
                                 </div>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '1.5rem', borderTop: '1.5px solid #000' }}>
                                 <div>
                                    <div style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '0.875rem', fontWeight: 700 }}>KES {product.price.toLocaleString()}</div>
                                    <div style={{ fontWeight: 900, fontSize: '1.5rem' }}>KES {deal.discountPrice.toLocaleString()}</div>
                                 </div>
                                 <div style={{ background: '#E3F77E', color: '#000', padding: '6px 12px', borderRadius: '8px', fontSize: '0.625rem', fontWeight: 900 }}>LIVE EVENT</div>
                              </div>
                           </div>
                        );
                     })}
                  </div>
               </div>
            )}

            {activeTab === 'gadgets' && (
               <div style={{ animation: 'fadeIn 0.3s ease' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                     <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.4, marginBottom: '0.5rem' }}>Marketplace Queue</div>
                        <h2 style={{ fontSize: '2rem', fontWeight: 900 }}>Gadget Listing Requests</h2>
                     </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                     {gadgets.length === 0 && <div style={{ border: '2px dashed #000', padding: '4rem', borderRadius: '32px', textAlign: 'center', fontWeight: 900, opacity: 0.3 }}>NO PENDING REQUESTS</div>}
                     {gadgets.map(gadget => (
                        <div key={gadget.id} style={{ background: '#fff', border: '1.5px solid #000', padding: '2rem', borderRadius: '32px', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem' }}>
                           <div>
                              <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', marginBottom: '1rem', paddingBottom: '0.5rem' }}>
                                 {gadget.images.map((img, idx) => (
                                    <a key={idx} href={img} target="_blank" rel="noopener noreferrer" style={{ flexShrink: 0 }}>
                                       <img src={img} style={{ width: '8rem', height: '8rem', borderRadius: '16px', objectFit: 'cover', border: '1.5px solid #000' }} />
                                    </a>
                                 ))}
                              </div>
                              {gadget.proofOfPurchase && (
                                 <div style={{ background: '#000', color: '#fff', padding: '1.5rem', borderRadius: '16px' }}>
                                    <div style={{ fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', opacity: 0.5, marginBottom: '0.75rem' }}>Ownership Certificate</div>
                                    <a href={gadget.proofOfPurchase} target="_blank" rel="noopener noreferrer">
                                       <img src={gadget.proofOfPurchase} style={{ width: '100%', borderRadius: '12px', border: '2px solid #fff' }} />
                                    </a>
                                 </div>
                              )}
                           </div>

                           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                 <div>
                                    <h3 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.03em' }}>{gadget.deviceName}</h3>
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                       <div style={{ fontSize: '0.875rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {gadget.location}</div>
                                       <div style={{ fontSize: '0.875rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {gadget.durationUsed}</div>
                                    </div>
                                 </div>
                                 <div style={{ fontSize: '2rem', fontWeight: 900 }}>KES {gadget.price.toLocaleString()}</div>
                              </div>

                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                                 {[
                                    { label: 'Condition', value: gadget.condition },
                                    { label: 'Storage', value: gadget.storage },
                                    { label: 'RAM', value: gadget.ram },
                                    { label: 'Color', value: gadget.color },
                                 ].map((spec, s) => (
                                    <div key={s} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                                       <div style={{ fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', opacity: 0.4, marginBottom: '0.25rem' }}>{spec.label}</div>
                                       <div style={{ fontSize: '0.875rem', fontWeight: 900 }}>{spec.value}</div>
                                    </div>
                                 ))}
                              </div>

                              {gadget.batteryHealth && (
                                 <div style={{ background: '#FEF2F2', border: '1.5px solid #FCA5A5', padding: '1rem', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 900, color: '#dc2626', fontSize: '0.75rem' }}>BATTERY CAPACITY REPORT</span>
                                    <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#dc2626' }}>{gadget.batteryHealth}%</span>
                                 </div>
                              )}

                              <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px' }}>
                                 <div style={{ fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', opacity: 0.4, marginBottom: '0.5rem' }}>Seller's Note</div>
                                 <p style={{ fontWeight: 700, lineHeight: 1.5 }}>{gadget.rfs}</p>
                              </div>

                              <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                                 <a
                                    href={`https://wa.me/${gadget.phoneNumber}`}
                                    className="btn-outline"
                                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '1.25rem', borderRadius: '16px', border: '1.5px solid #000', fontWeight: 900, textDecoration: 'none', color: '#000' }}
                                 >
                                    <Smartphone size={18} /> CONTACT SELLER
                                 </a>

                                 {gadget.status === 'PENDING' ? (
                                    <div style={{ display: 'flex', gap: '1rem', flex: 1.5 }}>
                                       <button onClick={() => onUpdateGadgetStatus(gadget.id, 'APPROVED')} style={{ flex: 1, background: '#000', color: '#fff', border: 'none', borderRadius: '16px', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                          <CheckCircle size={18} /> APPROVE
                                       </button>
                                       <button onClick={() => onUpdateGadgetStatus(gadget.id, 'REJECTED')} style={{ flex: 1, background: '#FEF2F2', color: '#ef4444', border: '1.5px solid #FCA5A5', borderRadius: '16px', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                          <XCircle size={18} /> REJECT
                                       </button>
                                    </div>
                                 ) : (
                                    <button onClick={() => onUpdateGadgetStatus(gadget.id, 'PENDING')} style={{ flex: 1.5, background: 'transparent', border: '1.5px solid #e2e8f0', borderRadius: '16px', fontWeight: 900, color: '#64748b', cursor: 'pointer' }}>
                                       RESET STATUS TO PENDING
                                    </button>
                                 )}
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}
         </main>

         {/* Product Form Modal */}
         {showProductForm && (
            <div className="admin-modal-overlay" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
               <div className="admin-modal-backdrop" onClick={() => { setShowProductForm(false); setEditingProductId(null); }} />
               <div className="admin-modal-content" style={{ borderRadius: '32px', padding: '3rem', border: '2px solid #000' }}>
                  <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '2.5rem' }}>{editingProductId ? 'EDIT' : 'ADD'} <span style={{ opacity: 0.3 }}>ITEM</span></h2>
                  <form onSubmit={handleProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                           <label style={{ display: 'block', fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.75rem' }}>Item Identity</label>
                           <input required placeholder="e.g. Keychron K2" type="text" style={{ width: '100%', padding: '1.25rem', borderRadius: '12px', border: '1.5px solid #000', fontWeight: 700, outline: 'none' }} value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                        </div>
                        <div>
                           <label style={{ display: 'block', fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.75rem' }}>Curation Category</label>
                           <select style={{ width: '100%', padding: '1.25rem', borderRadius: '12px', border: '1.5px solid #000', fontWeight: 700, outline: 'none' }} value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}>
                              <option>Desk Setup</option><option>Lighting</option><option>Accessories</option><option>Streaming</option>
                           </select>
                        </div>
                     </div>

                     <div>
                        <label style={{ display: 'block', fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.75rem' }}>Product Narrative</label>
                        <textarea required placeholder="Detailed premium description..." rows={4} style={{ width: '100%', padding: '1.25rem', borderRadius: '12px', border: '1.5px solid #000', fontWeight: 700, outline: 'none', resize: 'none' }} value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
                     </div>

                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                           <label style={{ display: 'block', fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.75rem' }}>Price (KES)</label>
                           <input required placeholder="000" type="number" style={{ width: '100%', padding: '1.25rem', borderRadius: '12px', border: '1.5px solid #000', fontWeight: 900, outline: 'none' }} value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })} />
                        </div>
                        <div>
                           <label style={{ display: 'block', fontSize: '0.625rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.75rem' }}>Starting Batch Size</label>
                           <input required placeholder="0" type="number" style={{ width: '100%', padding: '1.25rem', borderRadius: '12px', border: '1.5px solid #000', fontWeight: 900, outline: 'none' }} value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: Number(e.target.value) })} />
                        </div>
                     </div>

                     <div style={{ display: 'flex', gap: '1rem', paddingTop: '2rem' }}>
                        <button type="submit" style={{ flexGrow: 1, padding: '1.5rem', borderRadius: '16px', background: '#000', color: '#fff', fontWeight: 900, textTransform: 'uppercase', border: 'none', cursor: 'pointer', letterSpacing: '0.1em' }}>
                           {editingProductId ? 'SYNC CHANGES' : 'PUBLISH TO STORE'}
                        </button>
                        <button type="button" onClick={() => { setShowProductForm(false); setEditingProductId(null); }} style={{ padding: '0 3rem', borderRadius: '16px', border: '1.5px solid #000', background: 'transparent', fontWeight: 900, cursor: 'pointer' }}>CANCEL</button>
                     </div>
                  </form>
               </div>
            </div>
         )}

         {/* Shipping Label Modal */}
         {selectedOrderForLabel && (
            <div className="admin-modal-overlay" style={{ background: 'rgba(0,0,0,0.9)' }}>
               <div className="admin-modal-backdrop" onClick={() => setSelectedOrderForLabel(null)} />
               <div className="admin-modal-content" style={{ maxWidth: '440px', background: '#fff', padding: '0', borderRadius: '0', border: 'none' }}>
                  <div id="shipping-label" style={{ padding: '40px', background: '#fff' }}>
                     <div style={{ border: '4px solid #000', padding: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                           <span style={{ fontWeight: 900, fontSize: '2rem', letterSpacing: '-0.05em' }}>DEENICE</span>
                           <span style={{ fontWeight: 900, fontSize: '0.875rem' }}>ORD {selectedOrderForLabel.id.toUpperCase()}</span>
                        </div>

                        <div style={{ marginBottom: '40px' }}>
                           <div style={{ fontSize: '0.75rem', fontWeight: 900, opacity: 0.4, textTransform: 'uppercase', marginBottom: '8px' }}>Recipient Account</div>
                           <div style={{ fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1 }}>{selectedOrderForLabel.userId}</div>
                        </div>

                        <div style={{ marginBottom: '40px' }}>
                           <div style={{ fontSize: '0.75rem', fontWeight: 900, opacity: 0.4, textTransform: 'uppercase', marginBottom: '8px' }}>Destination Cluster</div>
                           <div style={{ fontSize: '1.25rem', fontWeight: 900 }}>{selectedOrderForLabel.hometown}</div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px', padding: '24px', background: '#000', color: '#fff' }}>
                           <div>
                              <div style={{ fontSize: '0.625rem', fontWeight: 900, opacity: 0.6, textTransform: 'uppercase' }}>Amount Duel</div>
                              <div style={{ fontSize: '1.25rem', fontWeight: 900 }}>{selectedOrderForLabel.totalAmount.toLocaleString()}</div>
                           </div>
                           <div>
                              <div style={{ fontSize: '0.625rem', fontWeight: 900, opacity: 0.6, textTransform: 'uppercase' }}>Payment Mode</div>
                              <div style={{ fontSize: '1.25rem', fontWeight: 900 }}>{selectedOrderForLabel.paymentStatus}</div>
                           </div>
                        </div>

                        <div style={{ height: '80px', width: '100%', background: 'repeating-linear-gradient(90deg, #000, #000 4px, #fff 4px, #fff 8px)' }} />
                        <div style={{ textAlign: 'center', marginTop: '1rem', fontWeight: 900, fontSize: '0.75rem' }}>VERIFIED BY DEENICE LABS</div>
                     </div>
                  </div>
                  <div style={{ background: '#fafafa', padding: '1.5rem 40px', display: 'flex', gap: '1rem' }}>
                     <button onClick={() => window.print()} style={{ flexGrow: 1, padding: '1rem', background: '#000', color: '#fff', borderRadius: '12px', fontWeight: 900, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <Printer size={18} /> PRINT IDENTITY TAG
                     </button>
                     <button onClick={() => setSelectedOrderForLabel(null)} style={{ padding: '1rem 2rem', border: '1.5px solid #000', background: 'transparent', borderRadius: '12px', fontWeight: 900, cursor: 'pointer' }}>CLOSE</button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default AdminDashboard;


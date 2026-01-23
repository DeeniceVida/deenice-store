
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  User as UserIcon,
  Menu,
  X,
  ArrowRight,
  LayoutDashboard,
  History,
  Zap,
  Sparkles,
  Coffee,
  Smartphone,
  Globe,
  Activity,
} from 'lucide-react';
import Hero from './components/Hero';
import Shop from './components/Shop';
import BuyForMe from './components/BuyForMe';
import CartDrawer from './components/CartDrawer';
import AdminDashboard from './components/AdminDashboard';
import OrderHistory from './components/OrderHistory';
import BlogSection from './components/BlogSection';
import ReviewSection from './components/ReviewSection';
import LoginView from './components/LoginView';
import HotDeals from './components/HotDeals';
import BuyMeCoffee from './components/BuyMeCoffee';
import SellGadget from './components/SellGadget';
import WorkWithMe from './components/WorkWithMe';
import GadgetMarketplace from './components/GadgetMarketplace';
import ProductDetailsPage from './components/ProductDetailsPage';
import { CartItem, Product, ProductVariation, User, Order, OrderStatus, PaymentStatus, Deal, GadgetListing, Offer } from './types';


import { STORE_NAME, WHATSAPP_NUMBER, SOCIAL_LINKS, STORE_EMAIL, LOGO_URL, LOGO_ICON_URL, ADMIN_EMAIL } from './constants';
import * as db from './services/supabase';

const App: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBuyCoffeeOpen, setIsBuyCoffeeOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('deenice_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuLinkStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    fontSize: '1.5rem',
    fontWeight: 900,
    color: 'white',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px'
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [adminProfile, setAdminProfile] = useState({ adminName: 'Andriano Darwin', adminAvatar: 'https://i.pravatar.cc/150?u=admin' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await Promise.allSettled([
          db.getProducts(),
          db.getOrders(),
          db.getGadgetListings(),
          db.getOffers(),
          db.getStoreConfig(),
          db.getDeals(),
          db.getUsers(),
          db.getCategories()
        ]);

        if (results[0].status === 'fulfilled') setProducts(results[0].value);
        else console.error('Error fetching products:', results[0].reason);

        if (results[1].status === 'fulfilled') setOrders(results[1].value);
        else console.error('Error fetching orders:', results[1].reason);

        if (results[2].status === 'fulfilled') setGadgets(results[2].value);
        else console.error('Error fetching gadgets:', results[2].reason);

        if (results[3].status === 'fulfilled') setOffers(results[3].value);
        else console.error('Error fetching offers:', results[3].reason);

        if (results[4].status === 'fulfilled') {
          const configData = results[4].value;
          if (configData) {
            setAdminProfile({ adminName: configData.adminName, adminAvatar: configData.adminAvatar });
          }
        } else {
          console.error('Error fetching store config:', results[4].reason);
        }

        if (results[5].status === 'fulfilled') setDeals(results[5].value || []);
        else {
          console.error('Error fetching deals:', results[5].reason);
          setDeals([]);
        }

        if (results[6].status === 'fulfilled') setUsers(results[6].value || []);
        else console.error('Error fetching users:', results[6].reason);

        if (results[7].status === 'fulfilled') setCategories(results[7].value || []);
        else console.error('Error fetching categories:', results[7].reason);

      } catch (err) {
        console.error('Unexpected error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  // Persist user session
  useEffect(() => {
    if (user) {
      localStorage.setItem('deenice_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('deenice_user');
    }
  }, [user]);

  const handleUpdateAdminProfile = async (name: string, avatar: string) => {
    try {
      await db.updateStoreConfig({ adminName: name, adminAvatar: avatar });
      setAdminProfile({ adminName: name, adminAvatar: avatar });
    } catch (err) {
      console.error('Error updating admin profile:', err);
    }
  };

  const addToCart = (product: Product, color: string, qty: number, variation?: ProductVariation) => {
    setCart(prev => {
      const existing = prev.find(item =>
        item.id === product.id &&
        item.selectedColor === color &&
        item.selectedVariation?.id === variation?.id
      );
      if (existing) {
        return prev.map(item =>
          (item.id === product.id &&
            item.selectedColor === color &&
            item.selectedVariation?.id === variation?.id)
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { ...product, quantity: qty, selectedColor: color, selectedVariation: variation }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string, color: string, variationId?: string) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.selectedColor === color && item.selectedVariation?.id === variationId)));
  };

  const updateCartQty = (id: string, color: string, variationId: string | undefined, qty: number) => {
    setCart(prev => prev.map(item =>
      (item.id === id && item.selectedColor === color && item.selectedVariation?.id === variationId)
        ? { ...item, quantity: Math.max(1, qty) }
        : item
    ));
  };

  const handleUpdateUser = (updatedData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updatedData });
    }
  };

  const handleCreateOrder = async (orderData: Partial<Order>) => {
    const newOrder: Order = {
      id: `#${Math.floor(1000 + Math.random() * 9000)}`,
      userId: user?.id || 'guest',
      items: [...cart],
      totalAmount: orderData.totalAmount || 0,
      status: OrderStatus.ORDERED,
      paymentStatus: PaymentStatus.PENDING,
      createdAt: new Date().toISOString(), // Use ISO for database consistency
      deliveryType: orderData.deliveryType || 'DELIVERY',
      specialCode: Math.floor(1000 + Math.random() * 9000).toString(),
      hometown: orderData.hometown || user?.hometown || 'Nairobi',
      deliveryFee: orderData.deliveryFee || 0,
    };

    try {
      await db.createOrder(newOrder);
      setOrders([newOrder, ...orders]);
      setCart([]);
      setIsCartOpen(false);
      return newOrder;
    } catch (err) {
      console.error('Error creating order:', err);
    }
  };

  const handleUpdateOrderStatus = async (id: string, status: OrderStatus) => {
    try {
      await db.updateOrderStatus(id, status, 'order');
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  const handleUpdatePaymentStatus = async (id: string, status: PaymentStatus) => {
    try {
      await db.updateOrderStatus(id, status, 'payment');
      setOrders(prev => prev.map(o => o.id === id ? { ...o, paymentStatus: status } : o));
    } catch (err) {
      console.error('Error updating payment status:', err);
    }
  };

  const handleUpdateDeals = async (updatedDeals: Deal[]) => {
    try {
      // Find new or changed deals and save them
      const existingIds = deals.map(d => d.id);
      const changedOrNew = updatedDeals.filter(d => !existingIds.includes(d.id) || JSON.stringify(d) !== JSON.stringify(deals.find(ex => ex.id === d.id)));

      for (const deal of changedOrNew) {
        await db.saveDeal(deal);
      }
      setDeals(updatedDeals);
    } catch (err) {
      console.error('Error updating deals:', err);
    }
  };

  const handleDeleteDeal = async (id: string) => {
    try {
      await db.deleteDeal(id);
      setDeals(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      console.error('Error deleting deal:', err);
    }
  };

  const handleAddProduct = async (newProduct: Product) => {
    try {
      await db.upsertProduct(newProduct);
      setProducts([newProduct, ...products]);
    } catch (err) {
      console.error('Error adding product:', err);
    }
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      await db.upsertProduct(updatedProduct);
      setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    } catch (err) {
      console.error('Error updating product:', err);
    }
  };

  const [gadgets, setGadgets] = useState<GadgetListing[]>([]);

  const handleSellGadget = async (listingData: Omit<GadgetListing, 'id' | 'createdAt' | 'sellerId' | 'sellerName' | 'status'>) => {
    if (!user) return;
    const newGadget: GadgetListing = {
      ...listingData,
      id: Math.random().toString(36).substr(2, 9),
      sellerId: user.id,
      sellerName: user.name,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    try {
      await db.upsertGadgetListing(newGadget);
      setGadgets([newGadget, ...gadgets]);
    } catch (err) {
      console.error('Error listing gadget:', err);
    }
  };

  const handleUpdateGadgetStatus = async (id: string, status: 'APPROVED' | 'REJECTED' | 'PENDING') => {
    try {
      await db.updateGadgetStatus(id, status);
      setGadgets(prev => prev.map(g => g.id === id ? { ...g, status } : g));
    } catch (err) {
      console.error('Error updating gadget status:', err);
    }
  };

  const [offers, setOffers] = useState<Offer[]>([]);

  const handleCreateOffer = async (offerData: Omit<Offer, 'id' | 'createdAt' | 'status'>) => {
    const newOffer: Offer = {
      ...offerData,
      id: Math.random().toString(36).substr(2, 9),
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    try {
      await db.createOffer(newOffer);
      setOffers([newOffer, ...offers]);
    } catch (err) {
      console.error('Error creating offer:', err);
    }
  };

  const handleUpdateOfferStatus = async (id: string, status: 'PENDING' | 'ACCEPTED' | 'REJECTED') => {
    try {
      await db.updateOfferStatus(id, status);
      setOffers(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    } catch (err) {
      console.error('Error updating offer status:', err);
    }
  };

  const handleAddCategory = async (name: string) => {
    try {
      const newCat = await db.createCategory({ name });
      setCategories([...categories, newCat]);
    } catch (err) {
      console.error('Error adding category:', err);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await db.deleteCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  };

  const Header = () => (
    <nav className="nav-wrapper glass-header">
      <div className="nav-content">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src={LOGO_ICON_URL} alt="Logo" style={{ height: '32px', width: '32px', objectFit: 'contain' }} />
          <span style={{ fontWeight: '800', fontSize: '1.25rem' }}>{STORE_NAME}</span>
        </Link>

        {/* Desktop Menu */}
        <div className="nav-links" style={{ display: isMobileMenuOpen ? 'none' : 'flex', alignItems: 'center' }}>
          <Link to="/shop">Shop</Link>
          <Link to="/deals" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Zap size={14} style={{ color: 'var(--color-accent)', fill: 'var(--color-accent)' }} /> Hot Deals
          </Link>
          <Link to="/buy-for-me">Buy For Me</Link>
          <Link to="/sell-gadget">Sell Your Gadget</Link>
          <Link to="/market" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Smartphone size={14} /> Market
          </Link>
          <Link to="/guides">Guides</Link>
          {(user?.role === 'ADMIN' || user?.email === ADMIN_EMAIL) && (
            <Link to="/admin" className="badge-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 12px 4px 4px', borderRadius: '999px', border: '1px solid rgba(0,0,0,0.1)', background: 'white' }}>
              <img src={adminProfile.adminAvatar} style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text)' }}>{adminProfile.adminName}</span>
            </Link>
          )}
        </div>

        {/* Actions */}
        <div className="nav-actions">
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="icon-btn"
            >
              <Search size={20} />
            </button>
            {isSearchOpen && (
              <div className="glass-panel" style={{ position: 'absolute', top: '50px', right: 0, width: '250px', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <input
                  autoFocus
                  type="text"
                  placeholder="Search products..."
                  className="newsletter-input"
                  style={{ background: 'white', color: 'black', border: '1px solid #eee' }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}
          </div>

          <Link to={user ? "/orders" : "/login"} className="icon-btn">
            {user ? <History size={20} /> : <UserIcon size={20} />}
          </Link>

          {user && (
            <button
              onClick={() => {
                setUser(null);
                window.location.hash = '#/';
              }}
              className="icon-btn"
              title="Logout"
            >
              <X size={20} />
            </button>
          )}

          <button
            onClick={() => setIsCartOpen(true)}
            className="icon-btn"
          >
            <ShoppingBag size={20} />
            {cart.length > 0 && (
              <span className="cart-badge">
                {cart.reduce((sum, i) => sum + i.quantity, 0)}
              </span>
            )}
          </button>

          <button
            className="icon-btn mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );

  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />

        <main style={{ flexGrow: 1, paddingTop: '64px' }}>
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <Shop onAddToCart={addToCart} products={products} searchQuery={searchQuery} categories={categories} />
                <BuyForMe />
                <ReviewSection />
                <BlogSection />
              </>
            } />
            <Route path="/shop" element={<Shop onAddToCart={addToCart} products={products} searchQuery={searchQuery} categories={categories} />} />
            <Route path="/deals" element={<HotDeals products={products} deals={deals} onAddToCart={addToCart} />} />
            <Route path="/buy-for-me" element={<BuyForMe />} />
            <Route path="/product/:id" element={<ProductDetailsPage products={products} onAddToCart={addToCart} />} />
            <Route path="/sell-gadget" element={<SellGadget user={user} onSubmit={handleSellGadget} />} />
            <Route path="/market" element={<GadgetMarketplace gadgets={gadgets} onOffer={handleCreateOffer} />} />
            <Route path="/work-with-me" element={<WorkWithMe />} />
            <Route path="/login" element={<LoginView onLogin={(u) => {
              setUser(u);
              window.location.hash = u.role === 'ADMIN' ? '#/admin' : '#/';
            }} />} />
            <Route path="/admin/*" element={
              <AdminDashboard
                products={products}
                orders={orders}
                users={users}
                deals={deals}
                gadgets={gadgets}
                offers={offers}
                adminName={adminProfile.adminName}
                adminAvatar={adminProfile.adminAvatar}
                onUpdateAdminProfile={handleUpdateAdminProfile}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                onUpdatePaymentStatus={handleUpdatePaymentStatus}
                onAddProduct={handleAddProduct}
                onUpdateProduct={handleUpdateProduct}
                onUpdateDeals={handleUpdateDeals}
                onDeleteDeal={handleDeleteDeal}
                onUpdateGadgetStatus={handleUpdateGadgetStatus}
                onUpdateOfferStatus={handleUpdateOfferStatus}
                categories={categories}
                onAddCategory={handleAddCategory}
                onDeleteCategory={handleDeleteCategory}
              />
            } />
            <Route path="/orders" element={<OrderHistory user={user} orders={orders} onUpdateUser={handleUpdateUser} />} />
            <Route path="/guides" element={<BlogSection />} />
            <Route path="/reviews" element={<ReviewSection />} />
          </Routes>
        </main>

        {isMobileMenuOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 10000, background: '#000', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
              <img src={LOGO_URL} alt="Logo" style={{ height: '32px', filter: 'brightness(0) invert(1)' }} />
              <button onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'white' }}><X size={32} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} style={mobileMenuLinkStyle}>
                <ShoppingBag size={24} color="var(--color-accent)" />
                <span>Shop</span>
              </Link>
              <Link to="/deals" onClick={() => setIsMobileMenuOpen(false)} style={mobileMenuLinkStyle}>
                <Zap size={24} color="var(--color-accent)" fill="var(--color-accent)" />
                <span>Hot Deals</span>
              </Link>
              <Link to="/sell-gadget" onClick={() => setIsMobileMenuOpen(false)} style={mobileMenuLinkStyle}>
                <Smartphone size={24} color="var(--color-accent)" />
                <span>Sell Gadget</span>
              </Link>
              <Link to="/market" onClick={() => setIsMobileMenuOpen(false)} style={mobileMenuLinkStyle}>
                <Globe size={24} color="var(--color-accent)" />
                <span>Market</span>
              </Link>
              <Link to="/buy-for-me" onClick={() => setIsMobileMenuOpen(false)} style={mobileMenuLinkStyle}>
                <Activity size={24} color="var(--color-accent)" />
                <span>Buy For Me</span>
              </Link>
              <Link to="/guides" onClick={() => setIsMobileMenuOpen(false)} style={mobileMenuLinkStyle}>
                <ArrowRight size={24} color="var(--color-accent)" />
                <span>Guides</span>
              </Link>
            </div>

            <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem' }}>Support</p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} style={{ color: 'white', fontWeight: 800 }}>WHATSAPP</a>
                <a href={`mailto:${STORE_EMAIL}`} style={{ color: 'white', fontWeight: 800 }}>EMAIL</a>
              </div>
            </div>
          </div>
        )}

        <footer className="main-footer">
          <div className="footer-grid">
            <div className="footer-col">
              <img src={LOGO_URL} alt="Logo" style={{ height: '40px', marginBottom: '1rem', filter: 'brightness(0) invert(1)' }} />
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>The best reviewed tech curation shop in Kenya.</p>
              <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                <p>{STORE_EMAIL}</p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <a href={SOCIAL_LINKS.tiktok} target="_blank">TikTok</a>
                  <a href={SOCIAL_LINKS.instagram} target="_blank">Instagram</a>
                  <a href={SOCIAL_LINKS.youtube} target="_blank">YouTube</a>
                </div>
              </div>
            </div>
            <div className="footer-col">
              <h4>Shop</h4>
              <ul>
                <li><Link to="/shop">All Products</Link></li>
                <li><Link to="/deals">Hot Deals</Link></li>
                <li><Link to="/work-with-me">Work With Me</Link></li>
                <li><Link to="/buy-for-me">Import from US</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Support</h4>
              <ul>
                <li><a href={`https://wa.me/${WHATSAPP_NUMBER}`}>WhatsApp Support</a></li>
                <li><a href={SOCIAL_LINKS.googleReviews} target="_blank">Google Reviews</a></li>
                <li style={{ marginTop: '1rem' }}>
                  <button onClick={() => setIsBuyCoffeeOpen(true)} className="btn-outline" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.75rem', padding: '0.5rem 1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
                    <Coffee size={14} /> Buy us a Coffee
                  </button>
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Newsletter</h4>
              <div className="newsletter-input-group">
                <input type="email" placeholder="Email" className="newsletter-input" />
                <button className="btn-accent" style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </footer>

        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cart}
          user={user}
          onRemove={removeFromCart}
          onUpdateQty={updateCartQty}
          onCreateOrder={handleCreateOrder}
          onUpdateUser={handleUpdateUser}
        />

        <BuyMeCoffee isOpen={isBuyCoffeeOpen} onClose={() => setIsBuyCoffeeOpen(false)} />
      </div>
    </Router>
  );
};

export default App;

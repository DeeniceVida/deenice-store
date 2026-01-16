
export enum OrderStatus {
  ORDERED = 'Ordered',
  PREPARING = 'Preparing',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered'
}

export enum PaymentStatus {
  UNPAID = 'Unpaid',
  PENDING = 'Pending Verification',
  RECEIVED = 'Received'
}

export interface ProductVariation {
  id: string;
  type: 'Size' | 'Design' | 'Bundle' | 'Color';
  value: string;
  price?: number; // Optional: price override for this variation
  image?: string; // Optional: image specific to this variation
  stock?: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  colors: string[];
  stock: number;
  category: string;
  salesCount?: number;
  variations?: ProductVariation[];
}

export interface Deal {
  id: string;
  productId: string;
  discountPrice: number;
  endsAt: string;
  isActive: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  selectedColor: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  deliveryType: 'PICKUP' | 'DELIVERY';
  specialCode: string;
  hometown: string;
  deliveryFee: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  hometown: string;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}


export interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  videoUrl?: string;
  date: string;
}

export interface GadgetListing {
  id: string;
  sellerId: string;
  sellerName: string;
  deviceName: string;
  condition: 'New' | 'Like New' | 'Good' | 'Fair';
  durationUsed: string;
  rfs: string;
  price: number;
  location: string;
  phoneNumber: string;
  images: string[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface Offer {
  id: string;
  gadgetId: string;
  gadgetName: string;
  buyerName: string;
  buyerEmail: string;
  offerAmount: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}

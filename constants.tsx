
import React from 'react';
import { Product, Review, BlogArticle, OrderStatus, PaymentStatus } from './types';

export const STORE_NAME = "Deenice.store";
export const STORE_EMAIL = "deenicevida@gmail.com";
export const WHATSAPP_NUMBER = "+254791873538";
export const MPESA_TILL_NUMBER = "8537538";
export const USD_TO_KES_RATE = 135;
export const LOGO_URL = "/assets/logo-full.png";
export const LOGO_ICON_URL = "/assets/logo-icon.png";

export const SOCIAL_LINKS = {
  tiktok: "https://www.tiktok.com/@deenicepcs",
  instagram: "https://www.instagram.com/deenicepcs/",
  youtube: "https://www.youtube.com/@deenicepcs",
  googleReviews: "https://share.google/l7N715NxD35951CIN"
};

export const MOCK_PRODUCTS: Product[] = [
  // Desk Setup
  {
    id: '1',
    name: 'RGB Hexagon Peg Board',
    description: 'Minimalist tech setup organizer with integrated smart RGB lighting.',
    price: 4500,
    currency: 'KES',
    images: ['https://images.unsplash.com/photo-1598550874175-4d0fe427c731?q=80&w=1000&auto=format&fit=crop'],
    colors: ['White', 'Black'],
    stock: 12,
    category: 'Desk Setup',
    salesCount: 45
  },
  {
    id: '2',
    name: 'Premium Desk Mat Pro',
    description: 'High-density felt desk mat for ultimate mouse precision and desk protection.',
    price: 2800,
    currency: 'KES',
    images: ['https://images.unsplash.com/photo-1616412411311-594dd1897d2c?q=80&w=1000&auto=format&fit=crop'],
    colors: ['Deep Gray', 'Midnight Blue', 'Black'],
    stock: 25,
    category: 'Accessories',
    salesCount: 89
  },

  // Phones - Apple
  {
    id: 'p1',
    name: 'iPhone 15 Pro Max',
    description: 'Titanium design, A17 Pro chip, 48MP Main camera. The ultimate iPhone experience.',
    price: 210000,
    currency: 'KES',
    images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1000&auto=format&fit=crop'],
    colors: ['Natural Titanium', 'Blue Titanium', 'Black Titanium'],
    stock: 5,
    category: 'Phones',
    salesCount: 15
  },
  {
    id: 'p2',
    name: 'iPhone 14',
    description: 'A15 Bionic chip, pro-level camera system, and all-day battery life.',
    price: 115000,
    currency: 'KES',
    images: ['https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?q=80&w=1000&auto=format&fit=crop'],
    colors: ['Midnight', 'Starlight', 'Blue'],
    stock: 8,
    category: 'Phones',
    salesCount: 32
  },

  // Phones - Samsung
  {
    id: 'p3',
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Galaxy AI is here. Titanium frame, 200MP camera, and built-in S Pen.',
    price: 195000,
    currency: 'KES',
    images: ['https://images.unsplash.com/photo-1706606992161-0d32112443ba?q=80&w=1000&auto=format&fit=crop'],
    colors: ['Titanium Gray', 'Titanium Black'],
    stock: 6,
    category: 'Phones',
    salesCount: 10
  },
  {
    id: 'p4',
    name: 'Samsung Galaxy Z Flip 5',
    description: 'Pocket-sized innovation with a massive new Flex Window.',
    price: 130000,
    currency: 'KES',
    images: ['https://images.unsplash.com/photo-1692131495944-7f61c0d84384?q=80&w=1000&auto=format&fit=crop'],
    colors: ['Mint', 'Lavender'],
    stock: 4,
    category: 'Phones',
    salesCount: 8
  },

  // Phones - Pixel
  {
    id: 'p5',
    name: 'Google Pixel 8 Pro',
    description: 'Google AI, pro-level cameras, and 7 years of updates.',
    price: 145000,
    currency: 'KES',
    images: ['https://images.unsplash.com/photo-1696446702302-6e279313a778?q=80&w=1000&auto=format&fit=crop'],
    colors: ['Bay', 'Obsidian'],
    stock: 7,
    category: 'Phones',
    salesCount: 5
  },

  // Laptops
  {
    id: 'l1',
    name: 'MacBook Pro 14 M3',
    description: 'Mind-blowing performance with the M3 Pro chip. The best laptop for creatives.',
    price: 265000,
    currency: 'KES',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca4?q=80&w=1000&auto=format&fit=crop'],
    colors: ['Space Black', 'Silver'],
    stock: 3,
    category: 'Laptops',
    salesCount: 12
  },
  {
    id: 'l2',
    name: 'Dell XPS 15',
    description: 'Stunning OLED display and powerful performance for creators.',
    price: 220000,
    currency: 'KES',
    images: ['https://images.unsplash.com/photo-1593642632823-8f78536788c6?q=80&w=1000&auto=format&fit=crop'],
    colors: ['Silver'],
    stock: 4,
    category: 'Laptops',
    salesCount: 7
  },
  {
    id: 'l3',
    name: 'HP Spectre x360',
    description: 'Beautiful 2-in-1 design with power and versatility.',
    price: 185000,
    currency: 'KES',
    images: ['https://images.unsplash.com/photo-1544731612-de7f96afe55f?q=80&w=1000&auto=format&fit=crop'],
    colors: ['Nightfall Black'],
    stock: 5,
    category: 'Laptops',
    salesCount: 9
  },

  // PC Parts
  {
    id: 'c1',
    name: 'NVIDIA RTX 4090',
    description: 'The ultimate GeForce GPU. A huge leap in performance, efficiency, and AI graphics.',
    price: 320000,
    currency: 'KES',
    images: ['https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=1000&auto=format&fit=crop'],
    colors: ['Black'],
    stock: 2,
    category: 'PC Parts',
    salesCount: 45
  },
  {
    id: 'c2',
    name: 'AMD Ryzen 9 7950X',
    description: '16 cores of pure gaming and creator dominance.',
    price: 85000,
    currency: 'KES',
    images: ['https://images.unsplash.com/photo-1555616635-640960031843?q=80&w=1000&auto=format&fit=crop'],
    colors: [],
    stock: 10,
    category: 'PC Parts',
    salesCount: 20
  },
  {
    id: 'c3',
    name: 'Samsung 49" Odyssey G9',
    description: 'The ultimate immersive gaming experience with 240Hz refresh rate.',
    price: 180000,
    currency: 'KES',
    images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=1000&auto=format&fit=crop'],
    colors: ['White'],
    stock: 3,
    category: 'PC Parts',
    salesCount: 8
  },
  {
    id: 'c4',
    name: 'Corsair Vengeance RGB 32GB',
    description: 'DDR5 RAM with dynamic multi-zone RGB lighting.',
    price: 22000,
    currency: 'KES',
    images: ['https://images.unsplash.com/photo-1562976540-1502c2145186?q=80&w=1000&auto=format&fit=crop'],
    colors: ['Black'],
    stock: 20,
    category: 'PC Parts',
    salesCount: 55
  }
];

export const DELIVERY_ZONES = [
  { name: "Baraton", fee: 700 }, { name: "Bungoma", fee: 600 }, { name: "Burnt Forest", fee: 520 },
  { name: "Chewele", fee: 600 }, { name: "Eldama Ravine", fee: 470 }, { name: "Eldoret", fee: 450 },
  { name: "Engineer", fee: 400 }, { name: "Gilgil", fee: 350 }, { name: "Iten", fee: 450 },
  { name: "Kabarnet", fee: 580 }, { name: "Kapenguria", fee: 780 }, { name: "Kapsabet", fee: 620 },
  { name: "Kijabe", fee: 350 }, { name: "Kimilili", fee: 600 }, { name: "Kitale", fee: 520 },
  { name: "Limuru", fee: 350 }, { name: "Lodwar", fee: 2050 }, { name: "Lokichogio", fee: 2850 },
  { name: "Lugari", fee: 600 }, { name: "Malaba", fee: 600 }, { name: "Maralal", fee: 1100 },
  { name: "Moi's Bridge", fee: 530 }, { name: "Molo", fee: 480 }, { name: "Mumias", fee: 600 },
  { name: "Naivasha", fee: 350 }, { name: "Nakuru", fee: 360 }, { name: "Nandi Hills", fee: 400 },
  { name: "Narok", fee: 420 }, { name: "Njro", fee: 480 }, { name: "Nyahururu", fee: 480 },
  { name: "Nzoia", fee: 710 }, { name: "Olkalau", fee: 480 }, { name: "Rumuruti", fee: 500 },
  { name: "Salgaa", fee: 680 }, { name: "Turbo", fee: 450 }, { name: "Webuye", fee: 600 },
  { name: "Ahero", fee: 640 }, { name: "Awendo", fee: 600 }, { name: "Bomet", fee: 500 },
  { name: "Bondo", fee: 640 }, { name: "Busia", fee: 590 }, { name: "Homa Bay", fee: 700 },
  { name: "Isebania", fee: 740 }, { name: "Kakamega", fee: 480 }, { name: "Kericho", fee: 480 },
  { name: "Keroka", fee: 600 }, { name: "Kisii", fee: 500 }, { name: "Kisumu", fee: 500 },
  { name: "Litein", fee: 500 }, { name: "Londiani", fee: 500 }, { name: "Luanda", fee: 660 },
  { name: "Maseno", fee: 500 }, { name: "Mbale", fee: 480 }, { name: "Mbita", fee: 720 },
  { name: "Migori", fee: 600 }, { name: "Siaya", fee: 650 }, { name: "Sotik", fee: 500 },
  { name: "Chogoria", fee: 480 }, { name: "Chuka", fee: 420 }, { name: "Embu", fee: 420 },
  { name: "Isiolo", fee: 650 }, { name: "Juja", fee: 380 }, { name: "Karatina", fee: 400 },
  { name: "Meru", fee: 480 }, { name: "Nanyuki", fee: 520 }, { name: "Nyeri", fee: 420 },
  { name: "Thika", fee: 360 }, { name: "Diani", fee: 770 }, { name: "Kilifi", fee: 800 },
  { name: "Malindi", fee: 840 }, { name: "Mombasa", fee: 640 }, { name: "Voi", fee: 600 },
  { name: "Athi River", fee: 360 }, { name: "Kitengela", fee: 360 }, { name: "Machakos", fee: 420 }
];

export const NAIROBI_DISTANCES = [
  { name: "Westlands", distance: 5 }, { name: "Upper Hill", distance: 4 }, { name: "Kilimani", distance: 7 },
  { name: "Lavington", distance: 10 }, { name: "Karen", distance: 18 }, { name: "Lang'ata", distance: 11 },
  { name: "Embakasi", distance: 15 }, { name: "Roysambu", distance: 11 }, { name: "Kasarani", distance: 14 },
  { name: "Rongai", distance: 20 }, { name: "Syokimau", distance: 22 }, { name: "Mlolongo", distance: 25 },
  { name: "South C", distance: 6 }, { name: "South B", distance: 5 }, { name: "Donholm", distance: 9 },
  { name: "Buruburu", distance: 8 }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    userName: 'John Kamau',
    userAvatar: 'https://i.pravatar.cc/150?u=john',
    rating: 5,
    comment: 'The desk mat is premium! Delivery was fast and the WhatsApp support is top-notch.',
    date: '2024-03-15'
  },
  {
    id: '2',
    userName: 'Sarah Wambui',
    userAvatar: 'https://i.pravatar.cc/150?u=sarah',
    rating: 5,
    comment: 'Used the "Buy For Me" service for my iPhone 15 Pro. Smooth process and totally worth it.',
    date: '2024-03-10'
  }
];

export const MOCK_BLOGS: BlogArticle[] = [
  {
    id: '1',
    title: '5 Desk Setup Must-Haves in 2025',
    excerpt: 'Elevate your workspace with these essential tech items.',
    content: 'Full content here...',
    image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1000&auto=format&fit=crop',
    date: 'March 20, 2024'
  }
];

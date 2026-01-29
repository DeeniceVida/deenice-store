import { createClient } from '@supabase/supabase-js';
import { Product, Order, GadgetListing, Offer, Deal, User } from '../types';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- Products ---
export const getProducts = async (): Promise<Product[]> => {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('createdAt', { ascending: false });

    if (error) throw error;
    return data as Product[];
};

export const upsertProduct = async (product: Product) => {
    const { data, error } = await supabase
        .from('products')
        .upsert([product])
        .select();

    if (error) throw error;
    return data[0];
};

export const deleteProduct = async (id: string) => {
    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

    if (error) throw error;
};

// --- Categories ---
export const getCategories = async (): Promise<any[]> => {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

    if (error) {
        console.warn('Categories table might not exist, returning empty.', error);
        return [];
    }
    return data;
};

export const createCategory = async (category: { name: string }) => {
    const { data, error } = await supabase
        .from('categories')
        .insert([category])
        .select();

    if (error) throw error;
    return data[0];
};

export const deleteCategory = async (id: string) => {
    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

    if (error) throw error;
};

// --- Orders ---
export const getOrders = async (): Promise<Order[]> => {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('createdAt', { ascending: false });

    if (error) throw error;
    return data as Order[];
};

export const createOrder = async (order: Order) => {
    const { data, error } = await supabase
        .from('orders')
        .insert([order])
        .select();

    if (error) throw error;
    return data[0];
};

export const updateOrderStatus = async (id: string, status: string, type: 'order' | 'payment') => {
    const updateField = type === 'order' ? { status } : { paymentStatus: status };
    const { error } = await supabase
        .from('orders')
        .update(updateField)
        .eq('id', id);

    if (error) throw error;
};

// --- Store Config ---
export const getStoreConfig = async () => {
    const { data, error } = await supabase
        .from('store_config')
        .select('*')
        .eq('id', 'main_config')
        .single();

    if (error) throw error;
    return data;
};

export const updateStoreConfig = async (config: { adminName: string, adminAvatar: string }) => {
    const { error } = await supabase
        .from('store_config')
        .update(config)
        .eq('id', 'main_config');

    if (error) throw error;
};

// --- Gadget Marketplace ---
export const getGadgetListings = async (): Promise<GadgetListing[]> => {
    const { data, error } = await supabase
        .from('gadget_listings')
        .select('*')
        .order('createdAt', { ascending: false });

    if (error) throw error;
    return data as GadgetListing[];
};

export const upsertGadgetListing = async (listing: GadgetListing) => {
    const { data, error } = await supabase
        .from('gadget_listings')
        .upsert([listing])
        .select();

    if (error) throw error;
    return data[0];
};

export const updateGadgetStatus = async (id: string, status: string) => {
    const { error } = await supabase
        .from('gadget_listings')
        .update({ status })
        .eq('id', id);

    if (error) throw error;
};

// --- Offers ---
export const getOffers = async (): Promise<Offer[]> => {
    const { data, error } = await supabase
        .from('offers')
        .select('*')
        .order('createdAt', { ascending: false });

    if (error) throw error;
    return data as Offer[];
};

export const createOffer = async (offer: Offer) => {
    const { data, error } = await supabase
        .from('offers')
        .insert([offer])
        .select();

    if (error) throw error;
    return data[0];
};

export const updateOfferStatus = async (id: string, status: string) => {
    const { error } = await supabase
        .from('offers')
        .update({ status })
        .eq('id', id);

    if (error) throw error;
};

// --- Deals ---
export const getDeals = async (): Promise<Deal[]> => {
    const { data, error } = await supabase
        .from('deals')
        .select('*')
        .order('createdAt', { ascending: false });

    if (error) throw error;
    return data as Deal[];
};

export const saveDeal = async (deal: Deal) => {
    const { data, error } = await supabase
        .from('deals')
        .upsert([deal])
        .select();

    if (error) throw error;
    return data[0];
};

export const deleteDeal = async (id: string) => {
    const { error } = await supabase
        .from('deals')
        .delete()
        .eq('id', id);

    if (error) throw error;
};

// --- Users ---
export const getUsers = async (): Promise<User[]> => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('createdAt', { ascending: false });

    if (error) throw error;
    return data as User[];
};

export const upsertUser = async (user: User) => {
    const { data, error } = await supabase
        .from('users')
        .upsert([user], { onConflict: 'email' })
        .select();

    if (error) throw error;
    return data[0];
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
    return data as User | null;
};

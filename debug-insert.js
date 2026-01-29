
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bahgezvofvukyqhvhfag.supabase.co';
const supabaseAnonKey = 'sb_publishable_F8AmgwA4Dk9aQIECbZ-dDQ_DIeWiVQ-';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInsert() {
    console.log("Attempting to sign in...");
    let { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'deenicevida@gmail.com',
        password: 'dmcxstn7'
    });

    if (authError) {
        console.log("Sign in failed:", authError.message);
        if (authError.message === 'Invalid login credentials') {
            console.log("Attempting to REGISTER user instead...");
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email: 'deenicevida@gmail.com',
                password: 'dmcxstn7',
                options: {
                    data: {
                        full_name: 'Store Owner',
                        hometown: 'Nairobi'
                    }
                }
            });

            if (signUpError) {
                console.error("Sign up failed:", signUpError);
                return;
            }

            if (signUpData.user) {
                console.log("Sign up successful! User created with ID:", signUpData.user.id);
                // Check if session is established
                if (signUpData.session) {
                    console.log("Session established immediately.");
                    authData = signUpData;
                } else {
                    console.log("User created but confirmation email sent. Cannot proceed without confirmation.");
                    return;
                }
            }
        } else {
            return;
        }
    }
    console.log("Sign in successful as:", authData.user.email);

    console.log("Attempting to insert debug product as authenticated user...");

    // Create a dummy product
    const product = {
        id: `debug-auth-${Date.now()}`,
        name: 'Debug Product Auth',
        description: 'Testing database connection with auth',
        price: 150,
        currency: 'KES',
        images: ['https://example.com/image.png'],
        colors: ['White'],
        stock: 50,
        category: 'Accessories',
        salesCount: 0,
        createdAt: new Date().toISOString()
    };

    const { data: insertData, error: insertError } = await supabase
        .from('products')
        .insert([product])
        .select();

    if (insertError) {
        console.error("Insert failed:", insertError);
    } else {
        console.log("Insert successful:", insertData);
    }
}

testInsert();

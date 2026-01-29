
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bahgezvofvukyqhvhfag.supabase.co';
const supabaseAnonKey = 'sb_publishable_F8AmgwA4Dk9aQIECbZ-dDQ_DIeWiVQ-';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkLogin() {
    console.log("Checking login status for deenicevida@gmail.com...");

    const { data, error } = await supabase.auth.signInWithPassword({
        email: 'deenicevida@gmail.com',
        password: 'dmcxstn7'
    });

    if (error) {
        console.log("Login FAILED:", error.message);
        console.log("Error Code:", error.name);
    } else {
        console.log("Login SUCCESSFUL!");
        console.log("User ID:", data.user.id);
        console.log("Session Active:", !!data.session);
    }
}

checkLogin();

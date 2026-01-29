
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bahgezvofvukyqhvhfag.supabase.co';
const supabaseAnonKey = 'sb_publishable_F8AmgwA4Dk9aQIECbZ-dDQ_DIeWiVQ-';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function listUsers() {
    console.log("Fetching users from public.users table...");

    const { data: users, error } = await supabase
        .from('users')
        .select('*');

    if (error) {
        console.log("Error fetching users:", error.message);
    } else {
        console.log("Found " + users.length + " users in public profile table:");
        users.forEach(u => {
            console.log(`- ${u.email} [Role: ${u.role}] (ID: ${u.id})`);
        });
    }
}

listUsers();

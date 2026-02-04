import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Read .env file manually
const envFile = readFileSync('.env', 'utf-8');
const envVars = {};
envFile.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) envVars[key.trim()] = value.trim();
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseAnonKey = envVars.VITE_SUPABASE_ANON_KEY;
const adminEmail = envVars.VITE_ADMIN_EMAIL;
const adminPassword = envVars.VITE_ADMIN_PASSWORD;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('🔍 Testing Admin Login...');
console.log('Email:', adminEmail);
console.log('Password:', adminPassword);
console.log('Password length:', adminPassword?.length, 'chars');

async function testAdminLogin() {
    try {
        // First, sign out any existing session
        await supabase.auth.signOut();
        console.log('✅ Cleared any existing session');

        // Try to login
        const { data, error } = await supabase.auth.signInWithPassword({
            email: adminEmail,
            password: adminPassword
        });

        if (error) {
            console.error('❌ Login failed:', error.message);
            console.log('\n🔧 Possible fixes:');
            console.log('1. Check if user exists in Supabase Auth dashboard');
            console.log('2. Verify email is confirmed');
            console.log('3. Check if password is correct');
            console.log('\n💡 Try resetting password in Supabase dashboard:');
            console.log('   Auth → Users → Click user → Reset Password');
            process.exit(1);
        }

        console.log('✅ Login SUCCESS!');
        console.log('User ID:', data.user?.id);
        console.log('Email:', data.user?.email);
        console.log('Email confirmed:', data.user?.email_confirmed_at ? 'YES' : 'NO');
        console.log('\n🎉 Admin credentials are working correctly!');

    } catch (err) {
        console.error('💥 Unexpected error:', err);
        process.exit(1);
    }
}

testAdminLogin();

// ============================================================
// SUPABASE CLIENT INITIALIZATION
// ============================================================
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn('\n⚠️  WARNING: Missing SUPABASE_URL or SUPABASE_KEY environment variables!');
  console.warn('Please define them in your backend/.env file for local development or Vercel dashboard for production.\n');
}

const supabase = createClient(
  SUPABASE_URL || 'https://placeholder-project.supabase.co',
  SUPABASE_KEY || 'placeholder-anon-key'
);

console.log('Supabase client initialized!');

module.exports = supabase;

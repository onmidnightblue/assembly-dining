import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_PUBLIC_URL!;
const supabaseAnonKey = process.env.SUPABASE_SECRET_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
});

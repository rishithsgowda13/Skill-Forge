import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    if (typeof window !== "undefined") console.error("Supabase credentials missing");
    return null;
  }
  
  if (typeof window === "undefined") {
    // Return a dummy object for the server that won't crash on property access
    return new Proxy({}, {
      get: () => () => ({ data: null, error: null }),
    });
  }

  return createBrowserClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: true,
    }
  });
};

export const supabase = createClient();

import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function proxy(request) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error("Supabase environment variables are missing in middleware!");
    return response; // Skip auth check if config is missing
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      get: (name) => request.cookies.get(name)?.value,
      set: (name, value, options) => {
        request.cookies.set({ name, value, ...options });
        response.cookies.set({ name, value, ...options });
      },
      remove: (name, options) => {
        request.cookies.set({ name, value: "", ...options });
        response.cookies.set({ name, value: "", ...options });
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  const mockSession = request.cookies.get("mock_session")?.value;
  const isMockUser = mockSession === "user";
  const isMockAdmin = mockSession === "admin";
  const isAuthenticated = !!user || isMockUser || isMockAdmin;

  const path = request.nextUrl.pathname;

  // Skip middleware for static assets
  if (
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    path.startsWith("/favicon.ico") ||
    path.includes(".svg") ||
    path.includes(".png") ||
    path.includes(".jpg") ||
    path.includes(".jpeg")
  ) {
    return response;
  }

  // Auth/Redirect logic
  // The root path '/' is now the login page
  const isAdminRoute = path.startsWith("/admin") || path.startsWith("/quiz/admin");

  // Redirect legacy /login to root
  if (path === "/login") {
     return NextResponse.redirect(new URL("/", request.url));
  }

  // Admin access control (Strict)
  if (isAdminRoute) {
    if (!isAuthenticated) {
       return NextResponse.redirect(new URL("/", request.url));
    }
    
    if (!isMockAdmin) {
       const { data: { user } } = await supabase.auth.getUser();
       if (user) {
         const { data: profile } = await supabase
           .from("profiles")
           .select("role")
           .eq("id", user.id)
           .single();
   
         if (profile?.role !== "admin" && profile?.role !== "evaluator") {
           return NextResponse.redirect(new URL("/dashboard", request.url));
         }
       } else {
         return NextResponse.redirect(new URL("/", request.url));
       }
    }
  }

  return response;
}

export const config = {
  matcher: "/:path*",
};

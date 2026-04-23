"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Set a mock session and redirect
    document.cookie = "mock_session=candidate; path=/";
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">Initializing Direct Node Sync...</p>
      </div>
    </div>
  );
}

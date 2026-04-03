import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';
import ivcLogo from '../../assets/ivc_logo.jpg';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setError('SUPABASE_NOT_CONFIGURED');
      return;
    }
    setError('');
    
    if (!email || !password) {
      setError('ALL_FIELDS_REQUIRED');
      return;
    }

    setLoading(true);

    try {
      const { data, error: sbErr } = await (supabase as any).auth.signInWithPassword({ email, password });
      if (sbErr) throw sbErr;

      const { data: profile } = await (supabase as any)
        .from('profiles')
        .select('role')
        .eq('id', data.user?.id)
        .single();

      router.push(profile?.role === 'admin' ? '/admin' : '/quiz-hub');
    } catch (err: any) {
      setError(err.message || 'AUTHENTICATION_FAILED');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!supabase) return;
    setLoading(true);
    const { error } = await (supabase as any).auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/quiz-hub'
      }
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#f8fafc] font-body">
      
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.4] pointer-events-none"
           style={{ 
             backgroundImage: `radial-gradient(#e2e8f0 1px, transparent 1px)`, 
             backgroundSize: '24px 24px' 
           }} />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg px-6 py-12"
      >
        <div className="bg-white border border-[#e2e8f0] rounded-[24px] p-10 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex flex-col items-center">
          
          <div className="relative mb-10 group">
              <img
                src={ivcLogo}
                alt="IVC Logo"
                className="w-32 h-32 object-contain relative z-10 grayscale hover:grayscale-0 transition-all duration-500"
                style={{ borderRadius: '24px', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}
              />
          </div>

          <div className="w-full flex flex-col items-center gap-4 mb-14 text-center">
              <h1 className="font-display text-4xl font-extrabold tracking-tight text-[#0f172a] uppercase">IVC HUB</h1>
              <div className="flex items-center gap-6">
                  <div className="h-[2px] w-20 bg-gradient-to-l from-[#2563eb] to-transparent rounded-full" />
                  <span className="font-display text-[10px] tracking-[0.5em] text-[#64748b] font-bold uppercase">SECURE PORTAL</span>
                  <div className="h-[2px] w-20 bg-gradient-to-r from-[#2563eb] to-transparent rounded-full" />
              </div>
          </div>

          <form onSubmit={handleAuth} className="w-full flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] tracking-[0.3em] text-[#64748b] uppercase font-bold pl-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]"></span>
                Identity
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] px-6 py-4 text-sm text-[#0f172a] font-medium tracking-wide rounded-xl outline-none focus:border-[#3b82f6]/40 focus:bg-white transition-all placeholder:text-[#94a3b8]"
                placeholder="Email address"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] tracking-[0.3em] text-[#64748b] uppercase font-bold pl-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
                Encryption
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] px-6 py-4 text-sm text-[#0f172a] font-medium tracking-wide rounded-xl outline-none focus:border-[#10b981]/40 focus:bg-white transition-all placeholder:text-[#94a3b8]"
                placeholder="Secret Key"
              />
            </div>

            {error && (
              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-[#ef4444] font-display text-[11px] tracking-[0.1em] uppercase font-bold text-center py-2 bg-red-50 rounded-lg">
                ⚠ Access Denied: {error}
              </motion.p>
            )}

            <div className="flex flex-col gap-5 mt-10 w-full px-4">
              <button type="submit" disabled={loading} className="w-full py-6 bg-[#0f172a] text-white font-display text-base tracking-[0.2em] font-extrabold uppercase rounded-2xl hover:bg-[#1e293b] hover:shadow-[0_20px_40px_rgba(15,23,42,0.15)] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center">
                {loading ? 'Processing...' : 'Authorize Session'}
              </button>
              <button onClick={handleGoogleLogin} type="button" disabled={loading} className="w-full py-6 bg-white border border-[#e2e8f0] rounded-2xl flex items-center justify-center gap-5 hover:bg-[#f8fafc] hover:border-[#cbd5e1] active:scale-[0.98] transition-all cursor-pointer group shadow-sm">
                <img src="https://www.google.com/favicon.ico" alt="" className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-[#64748b] group-hover:text-[#0f172a] font-display text-sm tracking-[0.1em] font-bold uppercase transition-colors">Sign in with Google</span>
              </button>
            </div>
          </form>

          <footer className="mt-12 pt-8 border-t border-[#f1f5f9] w-full text-center">
             <p className="text-[10px] tracking-[0.2em] text-[#94a3b8] uppercase font-medium">Innovators & Visionaries Club</p>
          </footer>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;

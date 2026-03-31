import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { mockLogin, supabase } from '../supabase';
import { motion, AnimatePresence } from 'framer-motion';
import ivcLogo from '../assets/ivc_logo.jpg';
import bgImage from '../assets/futuristic_bg.png';

const LandingPage: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { user, error: mockErr } = await mockLogin(email, password);
    if (!mockErr && user) {
      localStorage.setItem('ivc_user', JSON.stringify(user));
      navigate(user.role === 'admin' ? '/admin' : '/quiz-hub');
      return;
    }
    const { error: sbErr } = await supabase.auth.signInWithPassword({ email, password });
    if (sbErr) setError(sbErr.message);
    else navigate('/quiz-hub');
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const { error: sbErr } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/quiz-hub' }
    });
    if (sbErr) setError(sbErr.message);
  };

  return (
    <div className="min-h-screen flex flex-col relative scanline-overlay"
         style={{ background: `linear-gradient(180deg, #080c14 0%, #0c1a2a 50%, #080c14 100%)` }}>
      {/* Circuit BG overlay */}
      <div className="fixed inset-0 opacity-15 pointer-events-none z-0"
           style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        {/* Main Hero - matching Image 3 exactly */}
        <main className="flex-1 flex flex-col items-center justify-center px-8 relative">
          {/* Gear Logo - small, centered, slightly transparent like Image 3 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="mb-8"
          >
            <img
              src={ivcLogo}
              alt="IVC Logo"
              className="w-52 h-52 object-contain rounded-full"
              style={{ filter: 'drop-shadow(0 0 40px rgba(0, 247, 255, 0.15))' }}
            />
          </motion.div>

          {/* Title - large glowing cyan, Orbitron font, widely spaced */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-black tracking-[0.2em] glow-text text-center mb-6 uppercase"
          >
            INNOVATORS & VISIONARIES CLUB
          </motion.h1>

          {/* Subtitle: IDEATE • VISUALIZE • CREATE */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex items-center gap-8 mb-16"
          >
            <span className="font-display text-sm tracking-[0.4em] text-cyan-glow/60 font-bold uppercase">IDEATE</span>
            <div className="w-1.5 h-1.5 bg-cyan-glow rounded-full shadow-[0_0_8px_rgba(0,247,255,0.8)]" />
            <span className="font-display text-sm tracking-[0.4em] text-cyan-glow/60 font-bold uppercase">VISUALIZE</span>
            <div className="w-1.5 h-1.5 bg-cyan-glow rounded-full shadow-[0_0_8px_rgba(0,247,255,0.8)]" />
            <span className="font-display text-sm tracking-[0.4em] text-cyan-glow/60 font-bold uppercase">CREATE</span>
          </motion.div>

          {/* Access button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            onClick={() => setShowLogin(true)}
            className="px-14 py-4 bg-cyan-glow/10 border border-cyan-glow/40 text-cyan-glow font-display text-xs tracking-[0.5em] font-bold uppercase rounded-sm hover:bg-cyan-glow hover:text-black transition-all duration-300 cursor-pointer"
          >
            ACCESS PORTAL
          </motion.button>

          {/* Decorative side dots like Image 3 */}
          <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === 3
                    ? 'bg-cyan-glow shadow-[0_0_10px_rgba(0,247,255,0.8)] rotate-45 scale-125'
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </main>
      </div>

      {/* Login Modal */}
      <AnimatePresence>
        {showLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm glass-card p-10 relative border border-cyan-glow/15"
            >
              <button
                onClick={() => setShowLogin(false)}
                className="absolute top-4 right-5 text-gray-500 hover:text-white text-xl cursor-pointer"
              >
                ✕
              </button>

              <div className="flex flex-col items-center mb-8">
                <img src={ivcLogo} className="w-16 h-16 rounded-full mb-4 border border-cyan-glow/20" alt="logo" />
                <h3 className="font-display text-cyan-glow text-xs tracking-[0.3em] font-bold uppercase">SYSTEM AUTH</h3>
                <p className="text-white/20 text-[8px] tracking-[0.3em] uppercase mt-1">V.4.2.0-STABLE</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-3 mb-6">
                <input
                  type="text"
                  placeholder="TERMINAL ID"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 p-3.5 rounded text-white tracking-[0.2em] text-xs outline-none focus:border-cyan-glow/40 transition-colors placeholder:text-white/15"
                />
                <input
                  type="password"
                  placeholder="ACCESS KEY"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 p-3.5 rounded text-white tracking-[0.2em] text-xs outline-none focus:border-cyan-glow/40 transition-colors placeholder:text-white/15"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-cyan-glow/10 border border-cyan-glow/30 text-cyan-glow font-display text-[10px] tracking-[0.4em] font-bold uppercase hover:bg-cyan-glow hover:text-black transition-all duration-300 rounded cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'INITIATING...' : 'LOGIN'}
                </button>
              </form>

              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-white/5" />
                <span className="text-[9px] text-gray-600 tracking-widest uppercase font-bold">OR</span>
                <div className="h-px flex-1 bg-white/5" />
              </div>

              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 py-3 bg-white/5 border border-white/10 rounded text-[10px] text-white/70 tracking-widest uppercase font-bold hover:bg-white/10 transition-colors cursor-pointer"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="G" />
                Sign in with Google
              </button>

              {error && (
                <p className="text-red-400 text-[9px] mt-4 text-center tracking-widest uppercase font-bold">{error}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;

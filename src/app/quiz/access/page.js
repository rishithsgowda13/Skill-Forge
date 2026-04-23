"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import Sidebar from "@/components/layout/Sidebar";
import { 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  Lock,
  Loader2,
  Fingerprint,
  Users,
  LayoutDashboard,
  FileText,
  User,
  Hash,
  School,
  Mail,
  Phone,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ProtocolAccessPage() {
  const supabase = createClient();
  const router = useRouter();
  
  const [accessCode, setAccessCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [quizData, setQuizData] = useState(null);

  // Participant Details
  const [details, setDetails] = useState({
    fullName: "",
    usn: "",
    branch: "",
    section: "",
    email: "",
    phone: ""
  });

  const handleAccess = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: quiz, error: fetchError } = await supabase
      .from("quizzes")
      .select("*")
      .eq("access_code", accessCode.toUpperCase())
      .single();

    if (fetchError || !quiz) {
      setError("Invalid Protocol Access Key");
      setLoading(false);
    } else if (quiz.status !== 'lobby') {
      setError("AUTHENTICATION DENIED: Protocol cluster is currently in active assessment.");
      setLoading(false);
    } else {
      setQuizData(quiz);
      setShowDetailsForm(true);
      setLoading(false);
    }
  };

  const handleFinalEntry = (e) => {
    e.preventDefault();
    // Store details in localStorage to be used in the quiz play page
    localStorage.setItem("participant_details", JSON.stringify(details));
    router.push(`/quiz/play/${quizData.access_code}`);
  };

  const inputClasses = "w-full bg-[#f8fafc] border-2 border-[#e2e8f0] rounded-[24px] py-4 pl-14 pr-6 text-sm font-bold text-[#0f172a] focus:outline-none focus:border-primary-blue focus:ring-8 focus:ring-blue-100/40 transition-all placeholder:text-[#cbd5e1]";

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative bg-[#f8fafc]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(37,99,235,0.03)_0%,_transparent_50%)] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[800px] bg-white rounded-[48px] shadow-[0_60px_120px_-20px_rgba(37,99,235,0.1)] border border-[#f1f5f9] p-10 md:p-16 relative overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {!showDetailsForm ? (
            <motion.div
              key="access-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-blue-50 rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <Lock className="text-primary-blue w-10 h-10" />
                </div>
                <h1 className="text-4xl font-black tracking-tighter text-[#0f172a]">Protocol <span className="text-primary-blue">Lockdown</span></h1>
                <p className="text-[12px] font-black text-[#94a3b8] uppercase tracking-[0.5em]">Enter Access Key to Synchronize</p>
              </div>

              <form onSubmit={handleAccess} className="space-y-8">
                <div className="space-y-3">
                  <div className="relative group">
                    <Fingerprint className="absolute left-8 top-1/2 -translate-y-1/2 text-[#cbd5e1] group-focus-within:text-primary-blue transition-colors" size={24} />
                    <input
                      type="text"
                      required
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value)}
                      placeholder="EX: NEXUS-AURORA"
                      className="w-full bg-[#f8fafc] border-2 border-[#e2e8f0] rounded-[32px] py-8 pl-20 pr-10 text-lg font-black text-[#0f172a] tracking-[0.2em] focus:outline-none focus:border-primary-blue focus:ring-[12px] focus:ring-blue-100/40 transition-all"
                    />
                  </div>
                </div>

                <button
                  disabled={loading}
                  className="w-full bg-[#0f172a] text-white py-6 rounded-[32px] font-black text-[13px] tracking-[0.5em] uppercase shadow-xl hover:bg-primary-blue transition-all disabled:opacity-50 flex items-center justify-center gap-5"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <><span>Establish Link</span><Zap size={22} className="text-primary-blue" /></>}
                </button>

                {error && (
                  <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-center justify-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{error}</p>
                  </div>
                )}
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="details-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-emerald-50 rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <ShieldCheck className="text-emerald-500 w-10 h-10" />
                </div>
                <h1 className="text-4xl font-black tracking-tighter text-[#0f172a]">Identify <span className="text-emerald-500">Signature</span></h1>
                <p className="text-[12px] font-black text-[#94a3b8] uppercase tracking-[0.5em]">Complete Neural Identity Matrix</p>
              </div>

              <form onSubmit={handleFinalEntry} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative group">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 text-[#cbd5e1] group-focus-within:text-primary-blue transition-colors" size={18} />
                  <input
                    type="text"
                    required
                    placeholder="FULL NAME"
                    value={details.fullName}
                    onChange={(e) => setDetails({...details, fullName: e.target.value})}
                    className={inputClasses}
                  />
                </div>

                <div className="relative group">
                  <Hash className="absolute left-6 top-1/2 -translate-y-1/2 text-[#cbd5e1] group-focus-within:text-primary-blue transition-colors" size={18} />
                  <input
                    type="text"
                    required
                    placeholder="USN / ROLL NUMBER"
                    value={details.usn}
                    onChange={(e) => setDetails({...details, usn: e.target.value})}
                    className={inputClasses}
                  />
                </div>

                <div className="relative group">
                  <School className="absolute left-6 top-1/2 -translate-y-1/2 text-[#cbd5e1] group-focus-within:text-primary-blue transition-colors" size={18} />
                  <input
                    type="text"
                    required
                    placeholder="BRANCH"
                    value={details.branch}
                    onChange={(e) => setDetails({...details, branch: e.target.value})}
                    className={inputClasses}
                  />
                </div>

                <div className="relative group">
                  <BookOpen className="absolute left-6 top-1/2 -translate-y-1/2 text-[#cbd5e1] group-focus-within:text-primary-blue transition-colors" size={18} />
                  <input
                    type="text"
                    required
                    placeholder="SECTION"
                    value={details.section}
                    onChange={(e) => setDetails({...details, section: e.target.value})}
                    className={inputClasses}
                  />
                </div>

                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-[#cbd5e1] group-focus-within:text-primary-blue transition-colors" size={18} />
                  <input
                    type="email"
                    required
                    placeholder="EMAIL ID"
                    value={details.email}
                    onChange={(e) => setDetails({...details, email: e.target.value})}
                    className={inputClasses}
                  />
                </div>

                <div className="relative group">
                  <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-[#cbd5e1] group-focus-within:text-primary-blue transition-colors" size={18} />
                  <input
                    type="tel"
                    required
                    placeholder="PHONE NUMBER"
                    value={details.phone}
                    onChange={(e) => setDetails({...details, phone: e.target.value})}
                    className={inputClasses}
                  />
                </div>

                <div className="md:col-span-2 pt-4">
                  <button
                    type="submit"
                    className="w-full bg-[#0f172a] text-white py-6 rounded-[32px] font-black text-[13px] tracking-[0.5em] uppercase shadow-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-5 group"
                  >
                    <span>Initialize Session</span>
                    <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

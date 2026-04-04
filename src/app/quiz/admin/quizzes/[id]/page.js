"use client";

import { useEffect, useState, use } from "react";
import { createClient } from "@/lib/supabase";
import Sidebar from "@/components/layout/Sidebar";
import { 
  Plus, 
  Trash2, 
  ChevronLeft, 
  BookText, 
  Zap, 
  AlertCircle,
  Settings,
  Target,
  Hash,
  CheckCircle2,
  ArrowRight,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function QuizConfigurePage({ params }) {
  const { id } = use(params);
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ 
    content: "", 
    correct_answer: "A",
    options: ["", "", "", ""]
  });
  
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    // Fetch Quiz Details
    const { data: quizData } = await supabase
      .from("quizzes")
      .select("*")
      .eq("id", id)
      .single();
    setQuiz(quizData);

    // Fetch Questions
    const { data: questionData } = await supabase
      .from("questions")
      .select("*")
      .eq("quiz_id", id)
      .order("order_index", { ascending: true });
    setQuestions(questionData || []);
    setLoading(false);
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.content.trim()) return;

    setSubmitting(true);
      const { error } = await supabase
        .from("questions")
        .insert([
          { 
            quiz_id: id, 
            content: newQuestion.content, 
            options: newQuestion.options,
            correct_answer: newQuestion.correct_answer,
            order_index: questions.length 
          }
        ]);

    if (!error) {
      setNewQuestion({ content: "", correct_answer: "A", options: ["", "", "", ""] });
      loadData();
    }
    setSubmitting(false);
  };

  const handleDeleteQuestion = async (qId) => {
    const { error } = await supabase
      .from("questions")
      .delete()
      .eq("id", qId);
    
    if (!error) loadData();
  };

  if (loading) return null;

  return (
    <div className="p-6 md:p-14 space-y-10 flex flex-col min-h-full">
         {/* Breadcrumbs */}
         <button 
           onClick={() => router.push("/quiz/admin/quizzes")}
           className="flex items-center gap-2 text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.3em] hover:text-[#2563EB] transition-colors w-fit"
         >
            <ChevronLeft size={14} />
            <span>Back to Protocols</span>
         </button>

         <div className="flex justify-between items-center mb-16">
             <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 bg-white px-8 py-4 rounded-[24px] border border-[#E2E8F0] shadow-sm">
                   <Hash size={18} className="text-[#2563EB]" />
                   <span className="text-sm font-black text-[#0F172A] uppercase tracking-widest leading-none">
                      {questions.length} Nodes Registered
                   </span>
                </div>
                <button 
                  onClick={() => {
                    setNewQuestion({ content: "", options: ["", "", "", ""], correct_answer: "A" });
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className="bg-[#2563EB] text-white px-8 py-4 rounded-[24px] flex items-center gap-3 shadow-xl shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all text-sm font-black uppercase tracking-widest"
                >
                  <Plus size={18} />
                  Add Intelligence Node
                </button>
             </div>

             <header className="text-right">
                <h1 className="text-5xl font-extrabold text-[#0F172A] tracking-tighter uppercase leading-none">
                   Configure <span className="text-[#2563EB]">Intelligence</span>
                </h1>
                <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.3em] mt-2">
                   {quiz?.title} • Session Protocol Analysis
                </p>
             </header>
          </div>

         <div className="flex justify-center w-full px-4 md:px-8">
            {/* Question Entry Form */}
            <div className="w-full max-w-[1800px] space-y-12">
               <div className="bg-white rounded-[40px] border border-[#E2E8F0] shadow-sm p-8 space-y-8">
                  <form onSubmit={handleCreateQuestion} className="space-y-8">
                     <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 items-stretch">
                        {/* Left Side: Question */}
                        <div className="flex flex-col h-full space-y-4">
                           <label className="text-[11px] font-black text-[#94A3B8] uppercase tracking-[0.4em] ml-6">Challenge Content Matrix</label>
                           <textarea 
                             required
                             value={newQuestion.content}
                             onChange={(e) => setNewQuestion({...newQuestion, content: e.target.value})}
                             placeholder="Enter the technical challenge or question protocol..."
                             className="w-full bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-[32px] p-8 text-xl font-bold text-[#0F172A] focus:outline-none focus:border-[#2563EB] flex-1 resize-none"
                           />

                           <div className="flex flex-col gap-4 pt-2">
                              <button
                                type="submit"
                                disabled={submitting || !newQuestion.content || newQuestion.options.some(opt => !opt) || !newQuestion.time_limit || !newQuestion.points}
                                className={`w-full py-6 rounded-[28px] font-black text-xl uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center justify-center gap-4 group ${
                                  (submitting || !newQuestion.content || newQuestion.options.some(opt => !opt) || !newQuestion.time_limit || !newQuestion.points)
                                    ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                                    : "bg-[#0F172A] text-white hover:scale-[1.02] active:scale-95"
                                }`}
                              >
                                 <span>{submitting ? "Authorizing..." : "Authorize Node"}</span>
                                 <Zap className={`${(submitting || !newQuestion.content || newQuestion.options.some(opt => !opt) || !newQuestion.time_limit || !newQuestion.points) ? "text-slate-300" : "text-blue-500 fill-blue-500"} w-8 h-8 group-hover:animate-pulse`} />
                              </button>

                              <button
                                type="button"
                                onClick={() => router.push('/quiz/admin/quizzes')}
                                className="w-full py-6 rounded-[28px] border-2 border-[#0F172A] font-black text-xs uppercase tracking-[0.4em] text-[#0F172A] hover:bg-slate-50 transition-all flex items-center justify-center gap-4 group"
                              >
                                 <span>Finish Protocol</span>
                                 <ArrowRight size={18} className="group-hover:translate-x-1 transition-all" />
                              </button>
                           </div>
                        </div>

                        {/* Right Side: Options & Correct Answer */}
                        <div className="flex flex-col h-full space-y-8">
                           <div className="grid grid-cols-1 gap-6">
                              {['A', 'B', 'C', 'D'].map((label, idx) => (
                                 <div key={label} className="space-y-3">
                                    <label className="text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.4em] ml-6">Option Node {label}</label>
                                    <div className="relative group">
                                       <div className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white border-2 border-[#E2E8F0] rounded-2xl flex items-center justify-center text-sm font-black text-[#2563EB] shadow-sm">
                                          {label}
                                       </div>
                                       <input 
                                         required
                                         value={newQuestion.options[idx]}
                                         onChange={(e) => {
                                            const newOpts = [...newQuestion.options];
                                            newOpts[idx] = e.target.value;
                                            setNewQuestion({...newQuestion, options: newOpts});
                                         }}
                                         placeholder={`Define protocol ${label}...`}
                                         className="w-full bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-[32px] py-7 pl-24 pr-8 text-lg font-bold text-[#0F172A] focus:outline-none focus:border-[#2563EB] transition-all"
                                       />
                                    </div>
                                 </div>
                              ))}
                           </div>

                           <div className="space-y-6 pt-4">
                              <label className="text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.4em] ml-6">Correct Response Signature</label>
                              <div className="flex gap-4">
                                 {['A', 'B', 'C', 'D'].map((label) => (
                                    <button
                                      key={label}
                                      type="button"
                                      onClick={() => setNewQuestion({...newQuestion, correct_answer: label})}
                                      className={`flex-1 py-7 rounded-[28px] font-black text-base transition-all border-2 ${
                                        newQuestion.correct_answer === label 
                                          ? "bg-[#2563EB] text-white border-[#2563EB] shadow-2xl shadow-blue-200 scale-[1.05]" 
                                          : "bg-white text-[#94A3B8] border-[#E2E8F0] hover:border-[#2563EB]/40"
                                      }`}
                                    >
                                       {label}
                                    </button>
                                 ))}
                              </div>
                           </div>

                           <div className="grid grid-cols-2 gap-6 pt-6 border-t border-[#F1F5F9]">
                              <div className="space-y-3">
                                 <label className="text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.4em] ml-6">Response Timer (Sec)</label>
                                 <div className="relative">
                                    <Clock className="absolute left-6 top-1/2 -translate-y-1/2 text-[#2563EB] w-5 h-5" />
                                    <input 
                                      type="text"
                                      value={newQuestion.time_limit || ""}
                                      onChange={(e) => {
                                        const val = e.target.value.replace(/[^0-9]/g, '');
                                        setNewQuestion({...newQuestion, time_limit: val ? parseInt(val) : ""})
                                      }}
                                      placeholder="00"
                                      className="w-full bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-[28px] py-6 pl-16 pr-8 text-lg font-black text-[#0F172A] focus:outline-none focus:border-[#2563EB] transition-all"
                                    />
                                 </div>
                              </div>
                              <div className="space-y-3">
                                 <label className="text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.4em] ml-6">Node Magnitude (Pts)</label>
                                 <div className="relative">
                                    <Target className="absolute left-6 top-1/2 -translate-y-1/2 text-amber-500 w-5 h-5" />
                                    <input 
                                      type="text"
                                      value={newQuestion.points || ""}
                                      onChange={(e) => {
                                        const val = e.target.value.replace(/[^0-9]/g, '');
                                        setNewQuestion({...newQuestion, points: val ? parseInt(val) : ""})
                                      }}
                                      placeholder="0"
                                      className="w-full bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-[28px] py-6 pl-16 pr-8 text-lg font-black text-[#0F172A] focus:outline-none focus:border-[#2563EB] transition-all"
                                    />
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </form>
               </div>

               {/* Protocol Navigation Matrix */}
               <div className="pt-8 border-t border-[#F1F5F9] bg-slate-50/30 rounded-b-[40px] p-10">
                  <div className="flex flex-col items-center gap-6">
                     <div className="flex items-center gap-3">
                        <div className="px-4 py-2 bg-white rounded-xl border border-[#E2E8F0] shadow-sm">
                           <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest text-center">Registered Nodes</p>
                           <p className="text-xl font-black text-[#0F172A] text-center">{questions.length}</p>
                        </div>
                        <div className="w-px h-10 bg-[#E2E8F0]" />
                        <div className="px-4 py-2 bg-white rounded-xl border border-[#E2E8F0] shadow-sm">
                           <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest text-center">Current Sync Point</p>
                           <p className="text-xl font-black text-[#2563EB] text-center">{String(questions.length + 1).padStart(2, '0')}</p>
                        </div>
                     </div>

                     <div className="flex flex-wrap justify-center gap-3">
                        {questions.map((q, idx) => (
                           <button
                             key={q.id}
                             type="button"
                             onClick={() => {
                               // Logic to load question q for editing
                               setNewQuestion({
                                 content: q.content,
                                 options: q.options,
                                 correct_answer: q.correct_answer,
                                 time_limit: q.time_limit,
                                 points: q.points
                               });
                               window.scrollTo({ top: 300, behavior: 'smooth' });
                             }}
                             className="w-12 h-12 rounded-2xl bg-white border-2 border-[#E2E8F0] flex items-center justify-center text-sm font-black text-[#0F172A] hover:border-[#2563EB] hover:text-[#2563EB] transition-all shadow-sm group relative"
                           >
                              {idx + 1}
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
                           </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            setNewQuestion({ content: "", options: ["", "", "", ""], correct_answer: "A", time_limit: 30, points: 100 });
                            window.scrollTo({ top: 300, behavior: 'smooth' });
                          }}
                          className="w-12 h-12 rounded-2xl bg-blue-50 border-2 border-[#2563EB] flex items-center justify-center text-sm font-black text-[#2563EB] shadow-md shadow-blue-100 animate-pulse"
                        >
                           <Plus size={18} />
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
    </div>
  );
}

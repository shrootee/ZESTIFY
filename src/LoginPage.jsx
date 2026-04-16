import React from 'react';
import { Sparkles } from 'lucide-react';

const LoginPage = ({ onLogin, onClose, sunsetRed }) => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end">
      {/* Background Blur */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      {/* The Sheet */}
      <div className="relative bg-white p-10 rounded-t-[3.5rem] text-center shadow-2xl animate-in slide-in-from-bottom duration-500">
        <div className="w-12 h-1.5 bg-zinc-100 rounded-full mx-auto mb-8" />
        
        <div className="w-16 h-16 rounded-3xl bg-orange-50 flex items-center justify-center mx-auto mb-6" style={{ color: sunsetRed }}>
            <Sparkles size={32} />
        </div>

        <h2 className="text-2xl font-[1000] uppercase tracking-tighter mb-2" style={{ color: sunsetRed }}>
          Hungry for more?
        </h2>
        <p className="text-[11px] font-bold opacity-40 uppercase tracking-widest mb-10">
          Login to post reels and join the community.
        </p>

        <button 
          onClick={onLogin}
          className="w-full py-5 rounded-3xl bg-zinc-900 text-white font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl"
        >
          <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="G" />
          Continue with Google
        </button>

        <button onClick={onClose} className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-20">
          Maybe Later
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
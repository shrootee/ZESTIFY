import React, { useState, useEffect } from 'react';

import { auth, googleProvider } from './firebase'; 
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import LoginPage from './LoginPage'; // Agar file assets folder mein hai toh path sahi karna

import { 
  Plus, Home, Film, Heart, User, MapPin, 
  Search, Video, UtensilsCrossed, Sparkles
} from 'lucide-react';

const CravyardEmptyHome = () => {
  const goldenYellow = "#FFC300";   
  const sunsetRed = "#FF4500"; 
  const location = "Basmat, MH";  

  // --- LOGIC STATES ---
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  // --- AUTH LISTENER ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const handleLoginLogic = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setShowLogin(false);
    } catch (e) { 
      alert("Login Error: " + e.message); 
    }
  };

  // Function to handle "Plus" or "Post" click
  const handleAction = () => {
    if (!user) {
      setShowLogin(true);
    } else {
      alert("Ready to Post! Opening Camera...");
    }
  };

  return (
    <div className="bg-white min-h-screen w-full pb-32 font-sans tracking-tight relative">
      
      {/* --- HEADER --- */}
      <header className="
    /* 1. Solid Color & Placement */
    sticky top-0 z-50 
    bg-white           /* Ab ye transparent nahi, solid white hai */
    w-full 
    
    /* 2. Layout */
    px-6 pt-6 pb-6 
    flex justify-between items-center 
    
    /* 3. The 'Good' Part: Shadow instead of just a border */
    shadow-sm          /* Ye depth dega jab reels niche se guzrengi */
    border-b border-orange-100/50
">
        <div className="flex flex-col">
          <h1 className="text-3xl font-[1000] tracking-tighter leading-none uppercase italic">
            <span style={{ color: goldenYellow }}>ZEST</span>
            <span style={{ color: sunsetRed }}>IFY</span>
          </h1>
          <div className="flex items-center gap-1 mt-1.5 opacity-40">
            <MapPin size={10} style={{ color: sunsetRed }} />
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">{location}</span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-orange-200 flex items-center justify-center border border-orange-100 overflow-hidden">
           {user ? (
             <img src={user.photoURL} alt="profile" className="w-full h-full object-cover" />
           ) : (
             <User size={20} style={{ color: sunsetRed }} />
           )}
        </div>
      </header>

      {/* --- EMPTY REELS SECTION --- */}
      <section className="px-2 mt-1">
        
        
        <div className="
    /* 1. Layout & Width: Dono devices par poori width */
    w-full 
    px-0 /* Mobile par side gaps khatam */
    relative
    
    /* 2. Aspect Ratios: Jo tumne manga tha */
    aspect-[11/5]    /* Mobile default */
    md:aspect-[4/1]  
    
    /* 3. Design & Styling */
    rounded-[1.2rem] 
    border border-orange-300 
    bg-orange-50/30 
    overflow-hidden /* Rounded corners ke liye zaroori */
    
    /* 4. Center Content & Interactivity */
    flex flex-col items-center justify-center 
    text-center 
    group cursor-pointer 
    active:scale-[0.98] 
    transition-all duration-300
">

  <video 
    autoPlay loop muted playsInline
    className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700 z-0"
    src="foodvideo.mp4"
  />

      
    {/* Your Content (Icon, Text, or Video) */}
    {/* <span className="text-orange-500 font-bold group-hover:scale-110 transition-transform">
    Explore Trending Cravings
    </span> */}
    </div>
      </section>

      {/* --- HOTELS SECTION --- */}
      {/* <div className="flex justify-between items-center mt-4 mb-3">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] opacity-30 pl-4" style={{ color: sunsetRed }}></h3>
        </div> */}
      <section className="px-6 mt-16">
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] opacity-30 mb-8" style={{ color: sunsetRed }}>The Yard Feed</h3>
        <div className="flex flex-col items-center py-12 border-t border-orange-50">
            <div className="p-5 rounded-full bg-yellow-50 mb-6" style={{ color: goldenYellow }}>
                <UtensilsCrossed size={32} />
            </div>
            <h4 className="font-black text-lg uppercase tracking-tighter" style={{ color: sunsetRed }}>Reels will be displayed here</h4>
        </div>
      </section>

      {/* --- NAV BAR --- */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[92%] h-20 bg-white/95 backdrop-blur-3xl rounded-[2.8rem] flex justify-around items-center px-4 z-50 shadow-xl border border-orange-50">
        <button className="flex flex-col items-center gap-1.5" style={{ color: goldenYellow }}>
          <div className="p-2.5 rounded-2xl" style={{ backgroundColor: `${goldenYellow}15` }}>
             <Home size={22} fill="currentColor" />
          </div>
        </button>
        <button className="text-zinc-400"><Film size={22} /></button>

        {/* The Action Center (Plus Button) */}
        <button 
          onClick={handleAction}
          className="w-14 h-14 rounded-3xl flex items-center justify-center text-white shadow-xl active:scale-90 transition-all border-[6px] border-white relative shadow-orange-500/40"
          style={{ backgroundColor: sunsetRed }}
        >
          <Plus size={32} strokeWidth={4} />
        </button>

        <button className="text-zinc-400"><Search size={22} /></button>
        <button className="text-zinc-400" >
           {user ? <img src={user.photoURL} className="w-6 h-6 rounded-full" /> : <Heart size={22} />}
        </button>
      </nav>

      {/* --- LOGIN PANEL --- */}
      {showLogin && (
        <LoginPage 
          onLogin={handleLoginLogic} 
          onClose={() => setShowLogin(false)} 
          sunsetRed={sunsetRed} 
        />
      )}

    </div>
  );
};

export default CravyardEmptyHome;
import React from 'react';
import { Heart, MessageCircle, Send, Bookmark, MapPin, Search, ArrowLeft } from 'lucide-react';

const ReelPage = () => {
  return (
    <div className="relative h-[100dvh] w-full bg-black text-white overflow-hidden font-sans">
      
      {/* 1. Background Video Placeholder */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=1000" 
          alt="Delicious Burger" 
          className="h-full w-full object-cover"
        />
        {/* Dark Gradient Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
      </div>

      {/* 2. Top Navigation */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20">
        <ArrowLeft className="w-6 h-6" />
        <h2 className="text-lg font-bold tracking-widest uppercase">Reels</h2>
        <Search className="w-6 h-6" />
      </div>

      {/* 3. Right Sidebar (Interaction Buttons) */}
      <div className="absolute right-4 bottom-32 flex flex-col items-center gap-6 z-20">
        <div className="relative">
          <img src="https://i.pravatar.cc/100?img=12" className="w-12 h-12 rounded-full border-2 border-white" alt="Restaurant" />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-red-500 rounded-full px-1 text-[10px]">LIVE</div>
        </div>
        <div className="flex flex-col items-center"><Heart className="w-7 h-7" /> <span className="text-xs">1.2k</span></div>
        <div className="flex flex-col items-center"><MessageCircle className="w-7 h-7" /> <span className="text-xs">348</span></div>
        <div className="flex flex-col items-center"><Send className="w-7 h-7" /> <span className="text-xs">512</span></div>
        <Bookmark className="w-7 h-7" />
      </div>

      {/* 4. Bottom Information & CTA */}
      <div className="absolute bottom-16 left-0 right-0 p-5 z-20">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-white/20 backdrop-blur-md px-2 py-1 rounded text-xs font-semibold italic">The Burger House</span>
          <span className="text-blue-400 text-xs">✔</span>
        </div>
        
        <h1 className="text-2xl font-bold mb-1">SMOKY BBQ CHEESEBURGER</h1>
        
        <div className="flex items-center gap-3 text-sm text-gray-300 mb-4">
          <span className="flex items-center gap-1 text-yellow-400">★ 4.8 <span className="text-gray-400">(914)</span></span>
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> 4.5 km away</span>
        </div>

        {/* Action Button */}
        <button className="w-full py-4 bg-orange-500 hover:bg-orange-600 transition-colors rounded-xl font-bold text-lg flex justify-between px-6 items-center shadow-lg">
          <span>ADD TO CART</span>
          <span>$14.99</span>
        </button>
      </div>

      {/* 5. Mobile Bottom Nav Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-black flex justify-around items-center border-t border-white/10 z-30">
        <div className="flex flex-col items-center text-orange-500"><div className="w-1 h-1 bg-orange-500 mb-1 rounded-full"/>Feed</div>
        <div className="text-gray-500 text-sm">Explore</div>
        <div className="text-gray-500 text-sm">Map</div>
        <div className="text-gray-500 text-sm">Orders</div>
        <div className="text-gray-500 text-sm">Profile</div>
      </div>
    </div>
  );
};

export default ReelPage;
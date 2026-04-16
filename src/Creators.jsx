import React from 'react';
import { X, Video, Music, MapPin, Tag, Share2, ChevronRight } from 'lucide-react';

const CreatorUpload = () => {
  const goldenYellow = "#FFC300";
  const sunsetRed = "#FF4500";

  return (
    <div className="bg-black min-h-screen w-full text-white font-sans overflow-hidden">
      
      {/* --- TOP BAR --- */}
      <div className="px-6 pt-12 pb-4 flex justify-between items-center">
        <X size={28} className="text-zinc-500" />
        <h2 className="text-sm font-black uppercase tracking-[0.3em]">New Reel</h2>
        <button className="px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest" style={{ backgroundColor: sunsetRed }}>
          Post
        </button>
      </div>

      {/* --- VIDEO PREVIEW AREA --- */}
      <div className="px-4 mt-4">
        <div className="relative aspect-[9/16] w-full rounded-[3rem] bg-zinc-900 overflow-hidden border border-zinc-800 shadow-2xl">
          {/* Imagine the recorded video playing here */}
          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20">
             <Video size={64} />
             <p className="mt-4 font-bold uppercase tracking-widest text-[10px]">Preview Area</p>
          </div>
          
          {/* Side Editing Tools */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-8">
             <div className="flex flex-col items-center gap-1">
                <Music size={24} style={{ color: goldenYellow }} />
                <span className="text-[8px] font-black uppercase">Audio</span>
             </div>
             <div className="flex flex-col items-center gap-1">
                <Tag size={24} />
                <span className="text-[8px] font-black uppercase">Tags</span>
             </div>
          </div>
        </div>
      </div>

      {/* --- SETTINGS AREA --- */}
      <div className="px-8 mt-10 space-y-6">
        <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-4">
            <MapPin size={20} style={{ color: sunsetRed }} />
            <span className="text-sm font-bold opacity-60">Tag Restaurant</span>
          </div>
          <ChevronRight size={18} className="opacity-20" />
        </div>
        
        <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-4">
            <Share2 size={20} style={{ color: goldenYellow }} />
            <span className="text-sm font-bold opacity-60">Add Affiliate Link</span>
          </div>
          <ChevronRight size={18} className="opacity-20" />
        </div>
      </div>

      {/* --- CAPTION INPUT --- */}
      <div className="fixed bottom-10 left-0 w-full px-8">
        <textarea 
          placeholder="Describe the craving..." 
          className="w-full bg-transparent border-none focus:ring-0 text-lg font-bold placeholder:opacity-20"
          rows="2"
        ></textarea>
      </div>

    </div>
  );
};

export default CreatorUpload;
import React, { useEffect, useRef } from "react";
import {
  Play,
  Volume2,
  VolumeX,
  MessageCircle,
  Share2,
  ShoppingBag,
} from "lucide-react";
import { IoMdHeart } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const goldenYellow = "#FFC300";
const sunsetRed = "#FF4500";

function Card({ 
  reel, 
  muted, 
  setMuted, 
  playingId, 
  setPlayingId, 
  handleLikeClick, 
  user,
  className = "",
  hideUserInfo
}) {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  useEffect(() => {
    if (playingId === reel?.id && videoRef.current) {
      videoRef.current.play().catch(err => console.log("Auto-play failed:", err));
    } else if (playingId !== reel?.id && videoRef.current) {
      videoRef.current.pause();
    }
  }, [playingId, reel?.id]);

  if (!reel) return null;

  const handleVideoClick = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (playingId === reel.id) {
      video.pause();
      setPlayingId(null);
    } else {
      if (playingId) {
        const prevVideo = document.getElementById(`vid-${playingId}`);
        if (prevVideo) prevVideo.pause();
      }
      video.play();
      setPlayingId(reel.id);
    }
  };

  const handleCardClick = () => {
    console.log("clicked");
    navigate("/reels");
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`cursor-pointer ${className}`}
    >
      <div className="relative w-full h-full bg-black overflow-hidden rounded-xl shadow-lg">
        
        <div className="relative w-full h-full bg-black">
          <video
            ref={videoRef}
            id={`vid-${reel.id}`}
            src={reel.videoUrl}
            className="w-full h-full object-contain"
            muted={muted[reel.id] !== false}
            loop
            playsInline
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={handleVideoClick}
            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition group"
          >
            {playingId !== reel?.id && (
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center group-hover:scale-110 transition">
                <Play size={24} className="text-white ml-1" />
              </div>
            )}
          </button>

          {/* MUTE BUTTON - RIGHT SIDE TOP */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMuted((prev) => ({
                ...prev,
                [reel.id]: !prev[reel.id],
              }));
            }}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/50 backdrop-blur flex items-center justify-center z-10 hover:bg-black/70 transition"
          >
            {muted[reel.id] === false ? (
              <Volume2 size={14} className="text-white" />
            ) : (
              <VolumeX size={14} className="text-white" />
            )}
          </button>

          {/* RIGHT SIDE ACTION BUTTONS (like, comment, share) */}
          <div className="absolute bottom-40 right-2 sm:right-3 flex flex-col gap-3 sm:gap-4 z-10 pr-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLikeClick(reel);
              }}
              className="flex flex-col items-center gap-1"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center hover:bg-red-500/50 transition">
                <IoMdHeart
                  size={18}
                  className={`transition ${reel.likedBy?.includes(user?.uid) ? "text-red-500 scale-110" : "text-white"}`}
                />
              </div>
              <span className="text-white text-[10px] sm:text-[11px] font-semibold">
                {reel.likes || 0}
              </span>
            </button>

            <button 
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col items-center gap-1"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center">
                <MessageCircle size={16} className="text-white" />
              </div>
              <span className="text-white text-[10px] sm:text-[11px] font-semibold">0</span>
            </button>

            <button 
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col items-center gap-1"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center">
                <Share2 size={16} className="text-white" />
              </div>
              <span className="text-white text-[10px] sm:text-[11px] font-semibold">Share</span>
            </button>
          </div>

          {/* BOTTOM OVERLAY */}
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            {/* Food Name */}
            <h4 className="font-bold text-white text-base sm:text-lg mb-0.5 sm:mb-1">
              {reel.foodName}
            </h4>

            {/* Caption - REDUCED WIDTH */}
            <p className="text-white/80 text-xs sm:text-sm mb-3 line-clamp-1 sm:line-clamp-2 max-w-[65%] sm:max-w-[55%]">
              {reel.caption || "No caption"}
            </p>

            {/* User Info Row (LEFT) + ORDER NOW BUTTON (RIGHT SIDE) */}
            <div className="flex items-center justify-between gap-2 mt-2">
              {/* User Info - LEFT SIDE */}
              {!hideUserInfo && (
  <div className="flex items-center gap-2 flex-shrink-0">
    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 backdrop-blur overflow-hidden">
      {reel.userPhoto ? (
        <img src={reel.userPhoto} className="w-full h-full object-cover" alt="user" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-xs sm:text-sm font-bold text-white">
            {reel.userName?.charAt(0) || "?"}
          </span>
        </div>
      )}
    </div>
    <div className="min-w-0">
      <p className="text-white text-xs sm:text-sm font-semibold truncate max-w-[120px] sm:max-w-[160px]">
        {reel.userName || "Foodie"}
      </p>
      <p className="text-white/40 text-[10px] sm:text-xs truncate max-w-[120px] sm:max-w-[160px]">
        {reel.restaurantName ? reel.restaurantName.substring(0, 15) : "Food Lover"}
      </p>
    </div>
  </div>
)}

              {/* ORDER NOW BUTTON - RIGHT SIDE WITH YELLOW COLOR */}
              {reel.orderLink ? (
                <a
                  href={reel.orderLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm sm:px-4 sm:py-2 sm:text-xs rounded-full text-white font-bold transition hover:scale-105 active:scale-95 shadow-lg whitespace-nowrap flex-shrink-0 mb-4"
                  style={{
                    background: goldenYellow,
                    // boxShadow: `0 4px 12px ${goldenYellow}60`,
                  }}
                >
                  <ShoppingBag size={12} />
                  ORDER NOW
                </a>
              ) : (
                <button
                  disabled
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gray-500/50 text-white/50 text-[10px] sm:text-xs font-bold cursor-not-allowed whitespace-nowrap flex-shrink-0"
                >
                  <ShoppingBag size={12} />
                  NA
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
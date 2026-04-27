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
      className={`relative w-full h-full ${className}`}
    >
      <div className="relative w-full h-full bg-black overflow-hidden">
        
        {/* Video Container - fills entire space */}
        <div className="relative w-full h-full bg-black">
          <video
            ref={videoRef}
            id={`vid-${reel.id}`}
            src={reel.videoUrl}
            className="w-full h-full object-cover"
            muted={muted[reel.id] !== false}
            loop
            playsInline
            onClick={(e) => e.stopPropagation()}
          />

          {/* Gradient Overlays for better visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-transparent pointer-events-none" />

          {/* Play/Pause Overlay */}
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

          {/* MUTE BUTTON - TOP RIGHT */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMuted((prev) => ({
                ...prev,
                [reel.id]: !prev[reel.id],
              }));
            }}
            className="absolute top-4 right-4 w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center z-20 hover:bg-black/70 transition"
          >
            {muted[reel.id] === false ? (
              <Volume2 size={16} className="text-white md:w-5 md:h-5" />
            ) : (
              <VolumeX size={16} className="text-white md:w-5 md:h-5" />
            )}
          </button>

          {/* RIGHT SIDE ACTION BUTTONS */}
          <div className="absolute right-3 md:right-5 bottom-24 md:bottom-28 flex flex-col gap-3 md:gap-4 z-20">
            {/* Like Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLikeClick(reel);
              }}
              className="flex flex-col items-center gap-1 group"
            >
              <div className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-black/50 backdrop-blur flex items-center justify-center hover:bg-red-500/50 transition">
                <IoMdHeart size={18} className={`md:w-5 md:h-5 transition ${reel.likedBy?.includes(user?.uid) ? "text-red-500 scale-110" : "text-white"}`} />
              </div>
              <span className="text-white text-[10px] md:text-xs font-semibold">
                {reel.likes || 0}
              </span>
            </button>

            {/* Comment Button */}
            <button 
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col items-center gap-1 group"
            >
              <div className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-black/50 backdrop-blur flex items-center justify-center hover:bg-white/20 transition">
                <MessageCircle size={16} className="text-white md:w-5 md:h-5" />
              </div>
              <span className="text-white text-[10px] md:text-xs font-semibold">0</span>
            </button>

            {/* Share Button */}
            <button 
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col items-center gap-1 group"
            >
              <div className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-black/50 backdrop-blur flex items-center justify-center hover:bg-white/20 transition">
                <Share2 size={16} className="text-white md:w-5 md:h-5" />
              </div>
              <span className="text-white text-[10px] md:text-xs font-semibold">Share</span>
            </button>
          </div>

          {/* BOTTOM OVERLAY */}
          <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-20">
            {/* Food Name */}
            <h4 className="font-bold text-white text-sm md:text-lg mb-1 pr-16 md:pr-20">
              {reel.foodName}
            </h4>

            {/* Caption */}
            <p className="text-white/80 text-xs md:text-sm mb-2 line-clamp-2 max-w-[65%] md:max-w-[60%]">
              {reel.caption || "No caption"}
            </p>

            {/* User Info + Order Button Row */}
            <div className="flex items-center justify-between gap-2">
              {/* User Info - LEFT SIDE */}
              {!hideUserInfo && (
                <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 p-0.5">
                    <div className="w-full h-full rounded-full bg-black/80 overflow-hidden">
                      {reel.userPhoto ? (
                        <img src={reel.userPhoto} className="w-full h-full object-cover" alt="user" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-xs md:text-sm font-bold text-white">
                            {reel.userName?.charAt(0) || "?"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-xs md:text-sm font-semibold truncate max-w-[120px] md:max-w-[200px]">
                      {reel.userName || "Foodie"}
                    </p>
                    <p className="text-white/60 text-[10px] md:text-xs truncate max-w-[120px] md:max-w-[200px]">
                      {reel.restaurantName ? reel.restaurantName.substring(0, 20) : "Food Lover"}
                    </p>
                  </div>
                </div>
              )}

              {/* ORDER NOW BUTTON */}
              <div className="flex-shrink-0">
                {reel.orderLink ? (
                  <a
                    href={reel.orderLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm rounded-full text-white font-bold transition hover:scale-105 active:scale-95 shadow-lg whitespace-nowrap"
                    style={{
                      background: goldenYellow,
                    }}
                  >
                    <ShoppingBag size={14} className="md:w-4 md:h-4" />
                    ORDER NOW
                  </a>
                ) : (
                  <button
                    disabled
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-gray-500/50 text-white/50 text-xs md:text-sm font-bold cursor-not-allowed whitespace-nowrap"
                  >
                    <ShoppingBag size={14} className="md:w-4 md:h-4" />
                    NA
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
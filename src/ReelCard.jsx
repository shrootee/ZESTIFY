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
  hideUserInfo,
  isHomepage = false
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
      className={`relative w-full h-full ${className} ${isHomepage ? 'rounded-lg overflow-hidden' : ''}`}
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
            className={`absolute top-4 right-4 w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center z-20 hover:bg-black/70 transition${isHomepage ? 'scale-75' : ''}`}
          >
            {muted[reel.id] === false ? (
              <Volume2 size={16} className={`text-white md:w-5 md:h-5 ${isHomepage ? 'scale-75' : ''}`} />
            ) : (
              <VolumeX size={16} className={`text-white md:w-5 md:h-5 ${isHomepage ? 'scale-75' : ''}`} />
            )}
          </button>

          {/* RIGHT SIDE ACTION BUTTONS */}
          <div className={`absolute flex flex-col z-20 ${
        isHomepage
          ? "right-1 bottom-1 md:right-5 md:bottom-28 scale-70 gap-1"
          : "right-7 bottom-40 md:right-5 md:bottom-28 scale-110"
      } gap-3 md:gap-4`}>
            {/* Like Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLikeClick(reel);
              }}
              className="flex flex-col items-center gap-1 group"
            >
              <div
  className={`w-10 h-10 md:w-11 md:h-11 ${
    isHomepage ? "scale-75" : ""
  } rounded-full bg-black/50 backdrop-blur flex items-center justify-center hover:bg-red-500/50 transition`}
>
                <IoMdHeart 
                  size={20} 
                  className={`md:w-5 md:h-5 transition ${
                    reel.likedBy?.includes(user?.uid)
                      ? "text-red-500 scale-110"
                      : "text-white"
                  }`} 
                />
              </div>
              <span className={`text-white font-semibold ${
  isHomepage ? "text-xs" : "text-[10px]"
} md:text-xs`}>
                {reel.likes || 0}
              </span>
            </button>

            {/* Comment Button */}
            <button 
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col items-center gap-1 group"
            >
              <div
  className={`w-10 h-10 md:w-11 md:h-11 ${
    isHomepage ? "scale-75" : "scale-100"
  } rounded-full bg-black/50 backdrop-blur flex items-center justify-center hover:bg-red-500/50 transition`}
>
                <MessageCircle size={18} className="text-white md:w-5 md:h-5" />
              </div>
              <span className={`text-white font-semibold ${
  isHomepage ? "text-xs" : "text-[10px]"
} md:text-xs`}>0</span>
            </button>

            {/* Share Button */}
            <button 
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col items-center gap-1 group"
            >
              <div
  className={`w-10 h-10 md:w-11 md:h-11 ${
    isHomepage ? "scale-75" : ""
  } rounded-full bg-black/50 backdrop-blur flex items-center justify-center hover:bg-red-500/50 transition`}
>
                <Share2 size={18} className="text-white md:w-5 md:h-5" />
              </div>
              <span className={`text-white font-semibold ${
  isHomepage ? "text-xs" : "text-[10px]"
} md:text-xs`}>Share</span>
            </button>
          </div>

          {/* BOTTOM OVERLAY */}
          <div
  className={`absolute bottom-0 left-0 right-0 p-4 z-20 pt-10 ${
    isHomepage
      ? "bg-transparent"
      : "bg-gradient-to-t from-black/90 via-black/60 to-transparent pb-8"
  }`}
>
            {/* Food Name */}
           <h4 className="font-semibold text-white text-base md:text-lg mb-1 pr-14 md:pr-16">
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
               <div className="flex items-center gap-2 flex-shrink-0">
  <div
    className={`rounded-full bg-gradient-to-br from-orange-500 to-red-500 p-0.5 ${
      isHomepage
        ? "w-9 h-9 md:w-8 md:h-8"
        : "w-10 h-10 md:w-9 md:h-9"
    }`}
  >
    <div className="w-full h-full rounded-full bg-black/80 overflow-hidden">
      {reel.userPhoto ? (
        <img src={reel.userPhoto} className="w-full h-full object-cover" alt="user" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span
            className={`font-bold text-white ${
              isHomepage
                ? "text-xs md:text-xs"
                : "text-sm md:text-sm"
            }`}
          >
            {reel.userName?.charAt(0) || "?"}
          </span>
        </div>
      )}
    </div>
  </div>

  <div className="min-w-0">
    <p
      className={`text-white font-semibold truncate ${
        isHomepage
          ? "text-xs md:text-xs max-w-[120px]"
          : "text-sm md:text-sm max-w-[140px]"
      }`}
    >
      {reel.userName || "Foodie"}
    </p>

    <p
      className={`text-white/60 truncate ${
        isHomepage
          ? "text-[10px] md:text-[10px] max-w-[120px]"
          : "text-xs md:text-xs max-w-[140px]"
      }`}
    >
      {reel.restaurantName ? reel.restaurantName.substring(0, 20) : "Food Lover"}
    </p>
  </div>
</div>     )}

              {/* ORDER NOW BUTTON */}
              <div className="flex-shrink-0">
                {reel.orderLink ? (
                  <a
  href={reel.orderLink}
  target="_blank"
  rel="noopener noreferrer"
  onClick={(e) => e.stopPropagation()}
  className={`flex items-center gap-2 rounded-full text-white font-bold transition hover:scale-105 active:scale-95 shadow-md whitespace-nowrap ${
    isHomepage
      ? "px-4 py-2 text-sm md:px-3 md:py-1.5 md:text-xs"
      : "px-5 py-2.5 text-base md:px-5 md:py-2 md:text-sm"
  }`}
  style={{
    background: goldenYellow,
  }}
>
  <ShoppingBag
    size={isHomepage ? 16 : 18}
    className="md:w-5 md:h-5"
  />
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
// Card.jsx - Full screen height ke liye
import React from "react";
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

function Card({ reel, muted, setMuted, playingId, setPlayingId, handleLikeClick, user }) {
  const navigate = useNavigate();

  if (!reel) return null;

  return (
    <div 
      onClick={() => {
        console.log("clicked");
        navigate("/reels");
      }}
      className="cursor-pointer w-full h-full"  // 👈 FULL WIDTH + FULL HEIGHT
    >
      {/* CARD - FULL HEIGHT */}
      <div className="relative w-full h-full bg-black overflow-hidden">
        
        {/* VIDEO - FULL HEIGHT */}
        <div className="relative w-full h-full bg-black">
          <video
            id={`vid-${reel.id}`}
            src={reel.videoUrl}
            className="w-full h-full object-contain"  // object-cover se object-contain kiya
            muted={muted[reel.id] !== false}
            loop
            playsInline
          />

          {/* CENTER PLAY/PAUSE BUTTON */}
          <button
            onClick={() => {
              const vid = document.getElementById(`vid-${reel.id}`);
              if (playingId === reel.id) {
                vid.pause();
                setPlayingId(null);
              } else {
                if (playingId) {
                  const prev = document.getElementById(`vid-${playingId}`);
                  if (prev) prev.pause();
                }
                vid.play();
                setPlayingId(reel.id);
              }
            }}
            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition"
          >
            {playingId !== reel?.id && (
  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
    <Play size={20} className="text-white ml-1" />
  </div>
)}
          </button>

          {/* Mute Button - Top Left */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMuted((prev) => ({
                ...prev,
                [reel.id]: !prev[reel.id],
              }));
            }}
            className="absolute top-4 left-4 w-8 h-8 rounded-full bg-black/50 backdrop-blur flex items-center justify-center z-10 hover:bg-black/70 transition"
          >
            {muted[reel.id] === false ? (
              <Volume2 size={14} className="text-white" />
            ) : (
              <VolumeX size={14} className="text-white" />
            )}
          </button>

          {/* RIGHT SIDE BUTTONS (Like, Comment, Share) */}
          <div className="absolute bottom-28 right-3 flex flex-col gap-4 z-10">
            {/* Like Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLikeClick(reel);
              }}
              className="flex flex-col items-center gap-1"
            >
              <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center hover:bg-red-500/50 transition">
                <IoMdHeart
                  size={20}
                  className={reel.likedBy?.includes(user?.uid) ? "text-red-500" : "text-white"}
                />
              </div>
              <span className="text-white text-[11px] font-semibold">
                {reel.likes || 0}
              </span>
            </button>

            {/* Comment Button */}
            <button className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center">
                <MessageCircle size={18} className="text-white" />
              </div>
              <span className="text-white text-[11px] font-semibold">0</span>
            </button>

            {/* Share Button */}
            <button className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center">
                <Share2 size={18} className="text-white" />
              </div>
              <span className="text-white text-[11px] font-semibold">Share</span>
            </button>
          </div>

          {/* BOTTOM OVERLAY - INFO + ORDER BUTTON */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {/* Food Name */}
            <h4 className="font-bold text-white text-lg mb-1">
              {reel.foodName}
            </h4>

            {/* Caption */}
            {reel.caption && (
              <p className="text-white/80 text-sm mb-2 line-clamp-2">
                {reel.caption}
              </p>
            )}

            {/* User Info + Order Button Row */}
            <div className="flex items-center justify-between mt-2">
              {/* User Info */}
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur overflow-hidden">
                  {reel.userPhoto ? (
                    <img src={reel.userPhoto} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-sm font-bold text-white">
                        {reel.userName?.charAt(0) || "?"}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">
                    {reel.userName || "Foodie"}
                  </p>
                  <p className="text-white/40 text-xs">
                    {reel.restaurantName ? reel.restaurantName.substring(0, 15) : "Food Lover"}
                  </p>
                </div>
              </div>

              {/* ORDER NOW BUTTON */}
              {reel.orderLink ? (
                <a
                  href={reel.orderLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-xs font-bold transition hover:scale-105 active:scale-95 shadow-lg"
                  style={{
                    background: sunsetRed,
                    boxShadow: `0 4px 12px ${sunsetRed}40`,
                  }}
                >
                  <ShoppingBag size={14} />
                  ORDER
                </a>
              ) : (
                <button
                  disabled
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-500/50 text-white/50 text-xs font-bold cursor-not-allowed"
                >
                  <ShoppingBag size={14} />
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
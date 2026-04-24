// Homepage.jsx - With your original colors and styling
import React, {
  useState,
  useEffect,
  useRef,
} from "react";
import {
  auth,
  googleProvider,
  db,
} from "./firebase";
import {
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import {
  collection,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";
import LoginPage from "./LoginPage";
import CreateReelPage from "./create";
import {
  Plus,
  Home,
  Film,
  Heart,
  User,
  MapPin,
  Search,
  UtensilsCrossed,
  Play,
  Volume2,
  VolumeX,
  MessageCircle,
  Share2,
  ShoppingBag,
} from "lucide-react";

const Homepage = ({ goToSearch }) => {
  const goldenYellow = "#FFC300";
  const sunsetRed = "#FF4500";
  const location = "Basmat, MH";

  const [user, setUser] =
    useState(null);
  const [showLogin, setShowLogin] =
    useState(false);
  const [
    showCreateReel,
    setShowCreateReel,
  ] = useState(false);
  const [reels, setReels] = useState(
    [],
  );
  const [loading, setLoading] =
    useState(true);
  const [playingId, setPlayingId] =
    useState(null);
  const [muted, setMuted] = useState(
    {},
  );

  const scrollRef = useRef(null);

  // Auth
  useEffect(() => {
    const unsub = onAuthStateChanged(
      auth,
      (u) => {
        setUser(u);
      },
    );
    return () => unsub();
  }, []);

  // Fetch reels
  useEffect(() => {
    fetchReels();
  }, []);

  const fetchReels = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, "reels"),
        orderBy("createdAt", "desc"),
      );
      const snap = await getDocs(q);
      const data = [];
      snap.forEach((doc) =>
        data.push({
          id: doc.id,
          ...doc.data(),
        }),
      );
      setReels(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(
        auth,
        googleProvider,
      );
      setShowLogin(false);
    } catch (e) {
      alert(e.message);
    }
  };

  const handlePlusClick = () => {
    if (!user) {
      setShowLogin(true);
    } else {
      setShowCreateReel(true);
    }
  };

  const togglePlay = (id, videoEl) => {
    if (playingId === id) {
      videoEl.pause();
      setPlayingId(null);
    } else {
      if (playingId) {
        const prev =
          document.getElementById(
            `vid-${playingId}`,
          );
        if (prev) prev.pause();
      }
      videoEl.play();
      setPlayingId(id);
    }
  };

  const handlePost = () => {
    if (!user) {
      openLogin();   // 👈 panel open karega
      return;
    }
  };

  const toggleMute = (id) => {
    setMuted((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (showCreateReel) {
    return (
      <CreateReelPage
        onClose={() =>
          setShowCreateReel(false)
        }
        user={user}
        goldenYellow={goldenYellow}
        sunsetRed={sunsetRed}
      />
    );
  }

  return (
    <div className="bg-white min-h-screen w-full pb-32 font-sans tracking-tight">
      {/* HEADER - TERA ORIGINAL */}
      <header className="sticky top-0 z-50 bg-white w-full px-6 pt-6 pb-6 flex justify-between items-center shadow-sm border-b border-orange-100/50">
        <div className="flex flex-col">
          <h1 className="text-3xl font-[1000] tracking-tighter leading-none uppercase italic">
            <span
              style={{
                color: goldenYellow,
              }}
            >
              ZEST
            </span>
            <span
              style={{
                color: sunsetRed,
              }}
            >
              IFY
            </span>
          </h1>
          <div className="flex items-center gap-1 mt-1.5 opacity-40">
            <MapPin
              size={10}
              style={{
                color: sunsetRed,
              }}
            />
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">
              {location}
            </span>
          </div>
        </div>
       
        <div className="w-12 h-12 rounded-2xl bg-orange-200 flex items-center justify-center border border-orange-100 overflow-hidden">
          {user ? (
            <img
              src={user.photoURL}
              alt="profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <User
              size={20}
              style={{
                color: sunsetRed,
              }}
            />
          )}
        </div>
      </header>

      

      {/* HERO IMAGE - TERA ORIGINAL */}
      <section className="px-2 mt-1">
        <div className="w-full px-0 relative aspect-[11/5] md:aspect-[4/1] rounded-[1.2rem] border border-orange-300 bg-orange-50/30 overflow-hidden">
          <img
            className="object-cover w-full h-full"
            src="https://plus.unsplash.com/premium_photo-1726776054429-a359040d2f9c?q=80&w=1170&auto=format&fit=crop"
            alt="foodimg"
          />
        </div>
      </section>

      {/* REELS SECTION - HORIZONTAL SCROLL */}
      <section className="px-4 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3
            className="text-[11px] font-black uppercase tracking-[0.2em] opacity-70"
            style={{ color: sunsetRed }}
          >
            🎬 The Yard Feed
          </h3>
          <span className="text-[10px] opacity-40">
            {reels.length} reels
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
          </div>
        ) : reels.length === 0 ? (
          <div className="flex flex-col items-center py-12 border-t border-orange-50 bg-orange-50/20 rounded-2xl">
            <div
              className="p-5 rounded-full bg-yellow-50 mb-6"
              style={{
                color: goldenYellow,
              }}
            >
              <UtensilsCrossed
                size={32}
              />
            </div>
            <h4
              className="font-black text-lg uppercase tracking-tighter text-center"
              style={{
                color: sunsetRed,
              }}
            >
              No Reels Yet
            </h4>
            <p className="text-xs opacity-50 mt-2 text-center px-8">
              Be the first to upload a
              reel!
            </p>
            <button
              onClick={handlePlusClick}
              className="mt-4 px-6 py-2 rounded-full text-white text-sm font-bold flex items-center gap-2"
              style={{
                backgroundColor:
                  sunsetRed,
              }}
            >
              <Plus size={16} />
              Create First Reel
            </button>
          </div>
        ) : (
          // HORIZONTAL SCROLL CONTAINER
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 scroll-smooth"
            style={{
              scrollbarWidth: "thin",
            }}
          >
            <div className="flex gap-4 overflow-x-auto pb-4">
              {reels.map((reel) => (
                <div
                  key={reel.id}
                  className="relative flex-shrink-0 w-72 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  {/* VIDEO - 9:16 VERTICAL */}
                  <div
                    className="relative bg-black"
                    style={{
                      aspectRatio:
                        "9/16",
                    }}
                  >
                    <video
                      id={`vid-${reel.id}`}
                      src={
                        reel.videoUrl
                      }
                      className="w-full h-full object-cover"
                      muted={
                        muted[
                          reel.id
                        ] !== false
                      }
                      loop
                      playsInline
                    />

                    {/* CENTER PLAY/PAUSE BUTTON */}
                    <button
                      onClick={() => {
                        const vid =
                          document.getElementById(
                            `vid-${reel.id}`,
                          );
                        if (
                          playingId ===
                          reel.id
                        ) {
                          vid.pause();
                          setPlayingId(
                            null,
                          );
                        } else {
                          if (
                            playingId
                          ) {
                            const prev =
                              document.getElementById(
                                `vid-${playingId}`,
                              );
                            if (prev)
                              prev.pause();
                          }
                          vid.play();
                          setPlayingId(
                            reel.id,
                          );
                        }
                      }}
                      className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition"
                    >
                      {playingId ===
                      reel.id ? (
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                          <div className="w-4 h-4 bg-white rounded-sm"></div>
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                          <Play
                            size={20}
                            className="text-white ml-1"
                          />
                        </div>
                      )}
                    </button>

                    {/* ========== TOP BUTTONS ========== */}
                    {/* Mute Button - Top Left */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMuted(
                          (prev) => ({
                            ...prev,
                            [reel.id]:
                              !prev[
                                reel.id
                              ],
                          }),
                        );
                      }}
                      className="absolute top-3 left-3 w-7 h-7 rounded-full bg-black/50 backdrop-blur flex items-center justify-center z-10 hover:bg-black/70 transition"
                    >
                      {muted[
                        reel.id
                      ] === false ? (
                        <Volume2
                          size={12}
                          className="text-white"
                        />
                      ) : (
                        <VolumeX
                          size={12}
                          className="text-white"
                        />
                      )}
                    </button>

                    {/* Like/Share Button - Top Right (Optional) */}
                    <div className="absolute top-3 right-3 flex gap-2 z-10">
                      <button className="w-7 h-7 rounded-full bg-black/50 backdrop-blur flex items-center justify-center hover:bg-red-500/50 transition">
                        <Heart
                          size={12}
                          className="text-white"
                        />
                      </button>
                    </div>

                    {/* ========== MIDDLE BOTTOM BUTTONS (Vertical) ========== */}
                    <div className="absolute bottom-20 right-3 flex flex-col gap-3 z-10">
                      {/* Like Button with Count */}
                      <button
                        onClick={(
                          e,
                        ) => {
                          e.stopPropagation();
                          // Like logic
                        }}
                        className="flex flex-col items-center gap-0.5"
                      >
                        <div onClick={handlePost} className="w-9 h-9 rounded-full bg-black/50 backdrop-blur flex items-center justify-center hover:bg-red-500/50 transition">
                          <Heart
                            size={16}
                            className="text-white"
                          />
                        </div>
                        <span className="text-white text-[10px] font-semibold">
                          {reel.likes ||
                            0}
                        </span>
                      </button>

                      {/* Comment Button */}
                      <button className="flex flex-col items-center gap-0.5">
                        <div className="w-9 h-9 rounded-full bg-black/50 backdrop-blur flex items-center justify-center">
                          <MessageCircle
                            size={16}
                            className="text-white"
                          />
                        </div>
                        <span className="text-white text-[10px] font-semibold">
                          0
                        </span>
                      </button>

                      {/* Share Button */}
                      <button className="flex flex-col items-center gap-0.5">
                        <div className="w-9 h-9 rounded-full bg-black/50 backdrop-blur flex items-center justify-center">
                          <Share2
                            size={16}
                            className="text-white"
                          />
                        </div>
                        <span className="text-white text-[10px] font-semibold">
                          Share
                        </span>
                      </button>
                    </div>

                    {/* ========== BOTTOM OVERLAY - INFO + ORDER BUTTON ========== */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-3">
                      {/* Food Name */}
                      <h4 className="font-bold text-white text-base mb-1">
                        {reel.foodName}
                      </h4>

                      {/* Caption */}
                      {reel.caption && (
                        <p className="text-white/80 text-xs mb-2 line-clamp-2">
                          {reel.caption}
                        </p>
                      )}

                      {/* User Info + Order Button Row */}
                      <div className="flex items-center justify-between mt-2">
                        {/* User Info */}
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur overflow-hidden">
                            {reel.userPhoto ? (
                              <img
                                src={
                                  reel.userPhoto
                                }
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-xs font-bold text-white">
                                  {reel.userName?.charAt(
                                    0,
                                  ) ||
                                    "?"}
                                </span>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-white text-xs font-semibold">
                              {reel.userName ||
                                "Foodie"}
                            </p>
                            <p className="text-white/40 text-[9px]">
                              {reel.restaurantName
                                ? reel.restaurantName.substring(
                                    0,
                                    12,
                                  )
                                : "Food Lover"}
                            </p>
                          </div>
                        </div>

                        {/* ORDER NOW BUTTON - HIGHLY VISIBLE */}
                        {reel.orderLink ? (
                          <a
                            href={
                              reel.orderLink
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(
                              e,
                            ) =>
                              e.stopPropagation()
                            }
                            className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-xs font-bold transition hover:scale-105 active:scale-95 shadow-lg"
                            style={{
                              background: `${sunsetRed}`,
                              boxShadow: `0 4px 12px ${sunsetRed}40`,
                            }}
                          >
                            <ShoppingBag
                              size={14}
                            />
                            ORDER NOW
                          </a>
                        ) : (
                          <button
                            disabled
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-500/50 text-white/50 text-xs font-bold cursor-not-allowed"
                          >
                            <ShoppingBag
                              size={14}
                            />
                            NOT
                            AVAILABLE
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* BOTTOM NAVIGATION BAR - TERA ORIGINAL STYLE */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[92%] h-20 bg-white/95 backdrop-blur-3xl rounded-[2.8rem] flex justify-around items-center px-4 z-50 shadow-xl border border-orange-50">
        <button
          className="flex flex-col items-center gap-1.5"
          style={{
            color: goldenYellow,
          }}
        >
          <div
            className="p-2.5 rounded-2xl"
            style={{
              backgroundColor: `${goldenYellow}15`,
            }}
          >
            <Home
              size={22}
              fill="currentColor"
            />
          </div>
        </button>
        <button className="text-zinc-400">
          <Film size={22} />
        </button>

        {/* PLUS BUTTON */}
        <button
          onClick={handlePlusClick}
          className="w-14 h-14 rounded-3xl flex items-center justify-center text-white shadow-xl active:scale-90 transition-all border-[6px] border-white relative shadow-orange-500/40"
          style={{
            backgroundColor: sunsetRed,
          }}
        >
          <Plus
            size={32}
            strokeWidth={4}
          />
        </button>

        <button className="text-zinc-400" onClick={goToSearch}>
  <Search size={22} />
</button>
        <button className="text-zinc-400">
          {user ? (
            <img
              src={user.photoURL}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <Heart size={22} />
          )}
        </button>
      </nav>

      {/* LOGIN MODAL */}
      {showLogin && (
        <LoginPage
          onLogin={handleLogin}
          onClose={() =>
            setShowLogin(false)
          }
          sunsetRed={sunsetRed}
        />
      )}
    </div>
  );
};

export default Homepage;

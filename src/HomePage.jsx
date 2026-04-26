// Homepage.jsx - With your original colors and styling
import React, {
  useState,
  useEffect,
  useRef,
} from "react";
import { IoMdHeart } from "react-icons/io";
import Card from './ReelCard'
import {
  auth,
  googleProvider,
  db,
} from "./firebase";
import { useNavigate } from "react-router-dom";
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
 import { 
  
  arrayUnion, arrayRemove 
} from "firebase/firestore";
import CreateReelPage from "./create";
import {
  Plus,
  Home,
  Film,
  
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
import { doc, updateDoc, increment } from "firebase/firestore";

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

  useEffect(() => {
  if (user) {
    setShowLogin(false);
  }
}, [user]);

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
  

 

const handleLikeClick = async (reel) => {
  if (!user) {
    setShowLogin(true);
    return;
  }

  try {
    const reelRef = doc(db, "reels", reel.id);

    const alreadyLiked = reel.likedBy?.includes(user.uid);

    if (alreadyLiked) {
      // ❌ UNLIKE
      await updateDoc(reelRef, {
        likes: increment(-1),
        likedBy: arrayRemove(user.uid),
      });

      setReels((prev) =>
        prev.map((r) =>
          r.id === reel.id
            ? {
                ...r,
                likes: Math.max((r.likes || 0) - 1, 0),
                likedBy: r.likedBy.filter(id => id !== user.uid),
              }
            : r
        )
      );

    } else {
      // ❤️ LIKE
      await updateDoc(reelRef, {
        likes: increment(1),
        likedBy: arrayUnion(user.uid),
      });

      setReels((prev) =>
        prev.map((r) =>
          r.id === reel.id
            ? {
                ...r,
                likes: (r.likes || 0) + 1,
                likedBy: [...(r.likedBy || []), user.uid],
              }
            : r
        )
      );
    }

  } catch (e) {
    console.error(e);
  }
};

  const toggleMute = (id) => {
    setMuted((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  const navigate = useNavigate();
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
  style={{ scrollbarWidth: "thin" }}
>
  {reels.map((reel) => (
    <div key={reel.id} className="w-[200px] sm:w-[230px] lg:w-[300px] flex-shrink-0">
      <Card
        reel={reel}
        muted={muted}
        setMuted={setMuted}
        playingId={playingId}
        setPlayingId={setPlayingId}
        handleLikeClick={handleLikeClick}
        user={user}
        hideUserInfo={true} 
        className="w-full"  // 👈 NO FIXED HEIGHT
      />
    </div>
  ))}
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
        
        <button onClick={() => navigate("/reels")} className="text-zinc-400">
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
            <IoMdHeart size={22} />
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

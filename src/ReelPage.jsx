import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { db, auth } from './firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Card from './ReelCard';
import LoginPage from "./LoginPage";
import { 
  doc, 
  updateDoc, 
  increment, 
  arrayUnion, 
  arrayRemove 
} from "firebase/firestore";

const ReelsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { goldenYellow, sunsetRed } = location.state || {};
  
  const [user, setUser] = useState(null);
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playingId, setPlayingId] = useState(null);
  const [muted, setMuted] = useState({});
  const [showLogin, setShowLogin] = useState(false);
  
  const scrollRef = useRef(null);
  const isScrolling = useRef(false);
  const scrollTimeout = useRef(null);
  const containerRef = useRef(null);

  // Listen to auth state changes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    fetchReels();
  }, []);

  const fetchReels = async () => {
    try {
      const q = query(collection(db, 'reels'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReels(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (reels.length > 0) {
      const m = {};
      reels.forEach(r => (m[r.id] = true));
      setMuted(m);
    }
  }, [reels]);

  useEffect(() => {
    if (!loading && reels.length > 0) {
      const current = reels[currentIndex];
      if (!current) return;

      const video = document.getElementById(`vid-${current.id}`);
      if (video) {
        reels.forEach(r => {
          const v = document.getElementById(`vid-${r.id}`);
          if (v && v !== video) v.pause();
        });

        video.play().catch(() => {});
        setPlayingId(current.id);

        setTimeout(() => {
          setMuted(prev => ({ ...prev, [current.id]: false }));
        }, 400);
      }
    }
  }, [currentIndex, reels, loading]);

  // Scroll to a specific reel index
  const scrollToIndex = useCallback((index) => {
    if (!containerRef.current || isScrolling.current) return;
    
    isScrolling.current = true;
    const targetElement = containerRef.current.children[index];
    
    if (targetElement) {
      targetElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start'
      });
    }
    
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    
    scrollTimeout.current = setTimeout(() => {
      isScrolling.current = false;
    }, 500);
  }, []);

  // Handle scroll events
  const handleScroll = useCallback(() => {
    if (!containerRef.current || isScrolling.current) return;
    
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    
    const scrollPosition = containerRef.current.scrollTop;
    const viewportHeight = window.innerHeight;
    const targetIndex = Math.round(scrollPosition / viewportHeight);
    
    if (targetIndex !== currentIndex && targetIndex >= 0 && targetIndex < reels.length) {
      setCurrentIndex(targetIndex);
    }
    
    scrollTimeout.current = setTimeout(() => {
      isScrolling.current = false;
    }, 100);
  }, [currentIndex, reels.length]);

  // Handle wheel events for smooth scrolling
  const handleWheel = useCallback((e) => {
    if (isScrolling.current) {
      e.preventDefault();
      return;
    }
    
    const delta = e.deltaY;
    let newIndex = currentIndex;
    
    // Only scroll if delta is significant (prevents tiny scrolls)
    if (Math.abs(delta) < 30) return;
    
    if (delta > 0 && currentIndex < reels.length - 1) {
      newIndex = currentIndex + 1;
    } else if (delta < 0 && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else {
      return;
    }
    
    e.preventDefault();
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
  }, [currentIndex, reels.length, scrollToIndex]);

  const handleLikeClick = async (reel) => {
    if (!user) {
      setShowLogin(true);
      return;
    }
  
    try {
      const reelRef = doc(db, "reels", reel.id);
      const alreadyLiked = reel.likedBy?.includes(user.uid);
  
      if (alreadyLiked) {
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

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <p className="text-white">No reels found</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50">
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-50 w-10 h-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center hover:bg-black/70 transition-all"
      >
        <ArrowLeft size={22} className="text-white" />
      </button>

      <div
       ref={containerRef}
        onScroll={handleScroll}
        onWheel={handleWheel}
        className="h-screen w-full overflow-y-scroll"
        style={{
          scrollSnapType: 'y mandatory',
          
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {reels.map((reel, idx) => (
          <div
            key={reel.id}
            className="w-full h-screen snap-start snap-always bg-black"
            style={{ 
              scrollSnapAlign: 'start',
              height: '100vh'
            }}
          >
            <div className="h-full w-full md:w-auto md:max-w-[330px] mx-auto relative">
              <Card
                reel={reel}
                muted={muted}
                setMuted={setMuted}
                playingId={playingId}
                setPlayingId={setPlayingId}
                handleLikeClick={handleLikeClick}
                user={user}
                className="w-full h-full"
              />
            </div>
          </div>
        ))}
      </div>

      {showLogin && (
        <LoginPage
          onLogin={async () => {
            setShowLogin(false);
          }}
          onClose={() => setShowLogin(false)}
          sunsetRed={sunsetRed || "#FF4500"}
        />
      )}
    </div>
  );
};

export default ReelsPage;
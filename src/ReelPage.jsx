// ReelsPage.jsx - Updated to match your Card props
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import Card from './ReelCard'; // Tera existing Card component

const ReelsPage = ({ user }) => {
  const navigate = useNavigate();
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playingId, setPlayingId] = useState(null);
  const [muted, setMuted] = useState({});
  const scrollContainerRef = useRef(null);

  // Fetch reels
  useEffect(() => {
    fetchReels();
  }, []);

  const fetchReels = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'reels'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const data = [];
      snap.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
      setReels(data);
      console.log("Fetched reels:", data); // Debug
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-play current reel
  useEffect(() => {
    if (!loading && reels.length > 0) {
      const currentReel = reels[currentIndex];
      if (currentReel && playingId !== currentReel.id) {
        // Auto play current video
        const video = document.getElementById(`vid-${currentReel.id}`);
        if (video) {
          // Pause all others
          reels.forEach(r => {
            const otherVideo = document.getElementById(`vid-${r.id}`);
            if (otherVideo && otherVideo !== video) {
              otherVideo.pause();
            }
          });
          video.play().catch(e => console.log("Auto-play error:", e));
          setPlayingId(currentReel.id);
        }
      }
    }
  }, [currentIndex, loading, reels]);

  // Handle scroll snap
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollTop = scrollContainerRef.current.scrollTop;
      const windowHeight = window.innerHeight;
      const index = Math.round(scrollTop / windowHeight);
      
      if (index !== currentIndex && index >= 0 && index < reels.length) {
        setCurrentIndex(index);
      }
    }
  };

  const handleLikeClick = (reel) => {
    console.log("Like clicked for:", reel.id);
    // Your like logic here
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
        <div className="text-center">
          <p className="text-white mb-4">No reels found</p>
          <button onClick={() => navigate(-1)} className="text-orange-500">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50">
      
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-50 w-10 h-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center hover:bg-black/70 transition"
      >
        <ArrowLeft size={22} className="text-white" />
      </button>

      {/* CURRENT REEL INDEX */}
      <div className="fixed top-4 right-4 z-50 bg-black/50 backdrop-blur px-3 py-1 rounded-full">
        <span className="text-white text-xs">
          {currentIndex + 1} / {reels.length}
        </span>
      </div>

      {/* VERTICAL SCROLL CONTAINER */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          scrollSnapType: 'y mandatory'
        }}
      >
        {reels.map((reel, index) => (
          <div
            key={reel.id}
            className="relative h-screen w-full snap-start snap-always flex items-center justify-center bg-black"
            style={{
              scrollSnapAlign: 'start',
              height: '100vh',
              width: '100%'
            }}
          >
            {/* PASS PROPS EXACTLY AS YOUR CARD EXPECTS */}
            <Card
              reel={reel}
              muted={muted}
              setMuted={setMuted}
              playingId={playingId}
              setPlayingId={setPlayingId}
              handleLikeClick={handleLikeClick}
              user={user}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReelsPage;
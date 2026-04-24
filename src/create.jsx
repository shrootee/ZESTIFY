import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, User, X, Play, Pause, Volume2, VolumeX, 
  CheckCircle, AlertCircle, Video, Send
} from 'lucide-react';
import { auth, db } from './firebase'; // Import your firebase config
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import axios from 'axios';

const CreateReelPage = ({ onClose, user, goldenYellow, sunsetRed }) => {
  const themeGoldenYellow = goldenYellow || "#FFC300";
  const themeSunsetRed = sunsetRed || "#FF4500";
  const currentUser = user || null;

  // Form state
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [foodName, setFoodName] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [orderLink, setOrderLink] = useState("");
  const [caption, setCaption] = useState("");
  
  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Video player state
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const fileInputRef = useRef(null);

  // Cloudinary config - REPLACE WITH YOUR CLOUDINARY CREDENTIALS
  const CLOUDINARY_CLOUD_NAME = "dqs8iee0t"; // Get from cloudinary.com
  const CLOUDINARY_UPLOAD_PRESET = "food_reels_preset"; // Create in Cloudinary settings

  const handleVideoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('video/')) {
      setUploadError("Please select a valid video file");
      return;
    }
    
    if (file.size > 100 * 1024 * 1024) {
      setUploadError("Video must be less than 100MB");
      return;
    }
    
    setUploadError(null);
    setUploadSuccess(false);
    
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
    }
    
    setSelectedVideo(file);
    const previewUrl = URL.createObjectURL(file);
    setVideoPreviewUrl(previewUrl);
    setIsPlaying(false);
    setIsMuted(true);
  };
  
  const handleRemoveVideo = () => {
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
    }
    setSelectedVideo(null);
    setVideoPreviewUrl(null);
    setFoodName("");
    setRestaurantName("");
    setOrderLink("");
    setCaption("");
    setUploadError(null);
    setUploadSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };
  
  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Upload video to Cloudinary
  const uploadVideoToCloudinary = async (videoFile) => {
    const formData = new FormData();
    formData.append('file', videoFile);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('resource_type', 'video');
    
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          },
        }
      );
      
      return response.data.secure_url; // Returns Cloudinary video URL
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw new Error("Failed to upload video to Cloudinary");
    }
  };

  // Save reel data to Firestore
  const saveReelToFirestore = async (videoUrl, reelData) => {
    try {
      const reelsCollection = collection(db, 'reels');
      const docRef = await addDoc(reelsCollection, {
        videoUrl: videoUrl,
        foodName: reelData.foodName,
        restaurantName: reelData.restaurantName,
        orderLink: reelData.orderLink,
        caption: reelData.caption,
        userId: currentUser?.uid || 'anonymous',
        userName: currentUser?.displayName || 'Anonymous User',
        userPhoto: currentUser?.photoURL || '',
        likes: 0,
        comments: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return docRef.id;
    } catch (error) {
      console.error("Firestore save error:", error);
      throw new Error("Failed to save reel data");
    }
  };
  
  // Main upload handler
  const handleUploadReel = async () => {
    if (!selectedVideo) {
      setUploadError("Please select a video first");
      return;
    }
    
    if (!foodName.trim()) {
      setUploadError("Please add a food name");
      return;
    }
    
    if (!currentUser) {
      setUploadError("Please login to upload reels");
      return;
    }
    
    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(0);
    
    try {
      // Step 1: Upload video to Cloudinary
      setUploadProgress(10);
      const videoUrl = await uploadVideoToCloudinary(selectedVideo);
      setUploadProgress(70);
      
      // Step 2: Save text data to Firestore
      const reelData = {
        foodName: foodName.trim(),
        restaurantName: restaurantName.trim(),
        orderLink: orderLink.trim(),
        caption: caption.trim(),
      };
      
      const reelId = await saveReelToFirestore(videoUrl, reelData);
      setUploadProgress(100);
      
      console.log("Reel uploaded successfully! ID:", reelId);
      setUploadSuccess(true);
      setIsUploading(false);
      
      // Reset form after 2 seconds and close
      setTimeout(() => {
        handleRemoveVideo();
        setUploadSuccess(false);
        if (onClose) onClose();
      }, 2000);
      
    } catch (err) {
      console.error("Upload error:", err);
      setUploadError(err.message || "Upload failed. Please try again.");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  
  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="min-h-screen bg-gray-50">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <button 
            onClick={onClose}
            disabled={isUploading}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition disabled:opacity-50"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          
          <h1 className="text-xl font-bold">
            <span style={{ color: themeGoldenYellow }}>Create</span>
            <span style={{ color: themeSunsetRed }}> Reel</span>
          </h1>
          
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
            {currentUser ? (
              <img src={currentUser.photoURL} alt="profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User size={18} className="text-gray-500" />
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto px-6 py-8">
          
          {/* Video Upload Area */}
          {!videoPreviewUrl ? (
            <div 
              onClick={triggerFileSelect}
              className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-8 text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50/20 transition-all"
            >
              <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-4">
                <Video size={28} style={{ color: themeSunsetRed }} />
              </div>
              <h3 className="text-lg font-semibold mb-1" style={{ color: themeSunsetRed }}>Select Video</h3>
              <p className="text-gray-500 text-sm">Tap to choose a video for your reel</p>
              <p className="text-xs text-gray-400 mt-3">MP4, MOV • Max 100MB</p>
            </div>
          ) : (
            // Video Preview
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
              <div className="relative bg-black aspect-video max-h-[400px]">
                <video
                  ref={videoRef}
                  src={videoPreviewUrl}
                  className="w-full h-full object-contain"
                  loop
                  muted={isMuted}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <div className="flex justify-center gap-3">
                    <button 
                      onClick={togglePlayPause}
                      className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30"
                    >
                      {isPlaying ? <Pause size={20} className="text-white" /> : <Play size={20} className="text-white" />}
                    </button>
                    <button 
                      onClick={toggleMute}
                      className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30"
                    >
                      {isMuted ? <VolumeX size={20} className="text-white" /> : <Volume2 size={20} className="text-white" />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-gray-50 flex justify-between items-center">
                <p className="text-xs text-gray-500 truncate flex-1">{selectedVideo?.name}</p>
                <button 
                  onClick={handleRemoveVideo}
                  disabled={isUploading}
                  className="text-red-500 hover:text-red-600 text-sm font-medium disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          {/* Form Fields */}
          <div className="mt-6 space-y-4">
            
            {/* Food Name */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <label className="block text-sm font-semibold mb-2" style={{ color: themeSunsetRed }}>
                🍔 Food Name {videoPreviewUrl && <span className="text-red-500 text-xs">*</span>}
              </label>
              <input
                type="text"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                placeholder="e.g., Butter Chicken, Margherita Pizza"
                className={`w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400 focus:bg-white transition ${
                  !videoPreviewUrl || isUploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isUploading || !videoPreviewUrl}
              />
              {!videoPreviewUrl && (
                <p className="text-xs text-gray-400 mt-1">Select a video first</p>
              )}
            </div>
            
            {/* Restaurant Name */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <label className="block text-sm font-semibold mb-2" style={{ color: themeSunsetRed }}>
                🏪 Restaurant Name
              </label>
              <input
                type="text"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                placeholder="e.g., The Grand Kitchen, Food Hub"
                className={`w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400 focus:bg-white transition ${
                  !videoPreviewUrl || isUploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isUploading || !videoPreviewUrl}
              />
            </div>
            
            {/* Order Link */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <label className="block text-sm font-semibold mb-2" style={{ color: themeSunsetRed }}>
                🔗 Order Link
              </label>
              <input
                type="url"
                value={orderLink}
                onChange={(e) => setOrderLink(e.target.value)}
                placeholder="https://swiggy.com/restaurant/..."
                className={`w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400 focus:bg-white transition ${
                  !videoPreviewUrl || isUploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isUploading || !videoPreviewUrl}
              />
              <p className="text-xs text-gray-400 mt-1">Optional: Add Swiggy/Zomato link</p>
            </div>
            
            {/* Caption */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <label className="block text-sm font-semibold mb-2" style={{ color: themeSunsetRed }}>
                ✏️ Caption
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={3}
                placeholder="Share your food story..."
                className={`w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400 focus:bg-white transition resize-none ${
                  !videoPreviewUrl || isUploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isUploading || !videoPreviewUrl}
              />
              <div className="text-right text-xs text-gray-400 mt-1">{caption.length}/200</div>
            </div>
          </div>
          
          {/* Error Message */}
          {uploadError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle size={16} className="text-red-500" />
              <span className="text-red-700 text-sm">{uploadError}</span>
            </div>
          )}
          
          {/* Success Message */}
          {uploadSuccess && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <CheckCircle size={16} className="text-green-600" />
              <span className="text-green-800 text-sm">Reel uploaded successfully! 🎉</span>
            </div>
          )}
          
          {/* Progress Bar */}
          {isUploading && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span style={{ color: themeSunsetRed }}>
                  {uploadProgress < 30 && "Uploading to Cloudinary..."}
                  {uploadProgress >= 30 && uploadProgress < 70 && "Processing video..."}
                  {uploadProgress >= 70 && "Saving to database..."}
                </span>
                <span className="font-semibold">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-200"
                  style={{ width: `${uploadProgress}%`, backgroundColor: themeSunsetRed }}
                />
              </div>
            </div>
          )}
          
          {/* Publish Button */}
          {videoPreviewUrl && (
            <div className="mt-8">
              <button
                onClick={handleUploadReel}
                disabled={isUploading || !foodName.trim()}
                className={`w-full py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all ${
                  isUploading || !foodName.trim() ? 'opacity-50 cursor-not-allowed bg-gray-400' : ''
                }`}
                style={videoPreviewUrl && foodName.trim() && !isUploading ? 
                  { background: `linear-gradient(135deg, ${themeGoldenYellow}, ${themeSunsetRed})` } : 
                  {}}
              >
                {isUploading ? (
                  "Publishing..."
                ) : (
                  <>
                    <Send size={18} />
                    Publish Reel
                  </>
                )}
              </button>
            </div>
          )}
        </div>
        
        <input 
          ref={fileInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleVideoSelect}
        />
      </div>
    </div>
  );
};

export default CreateReelPage;
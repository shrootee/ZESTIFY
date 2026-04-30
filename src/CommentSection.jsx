import React, { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  deleteDoc, 
  doc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase'; // Update with your path
import { X } from 'lucide-react';

const CommentSection = ({ reelId, currentUser, isOpen, onClose }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch comments
  useEffect(() => {
    if (!reelId || !isOpen) return;

    const commentsRef = collection(db, 'reels', reelId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedComments = [];
      snapshot.forEach((doc) => {
        fetchedComments.push({ id: doc.id, ...doc.data() });
      });
      setComments(fetchedComments);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [reelId, isOpen]);

  // Add comment
  const handleAddComment = async () => {
    if (comment.trim() === '') return;
    if (!currentUser) {
      alert('Please login to comment');
      return;
    }

    try {
      const commentsRef = collection(db, 'reels', reelId, 'comments');
      await addDoc(commentsRef, {
        text: comment.trim(),
        userName: currentUser.displayName || 'Anonymous User',
        userId: currentUser.uid,
        userPhoto: currentUser.photoURL || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const reelRef = doc(db, 'reels', reelId);
      await updateDoc(reelRef, {
        commentsCount: comments.length + 1
      });

      setComment('');
    } catch (error) {
      console.error("Error adding comment:", error);
      alert('Failed to add comment');
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId, userId) => {
    if (currentUser?.uid !== userId) {
      alert('You can only delete your own comments');
      return;
    }

    if (!window.confirm('Delete this comment?')) return;

    try {
      const commentRef = doc(db, 'reels', reelId, 'comments', commentId);
      await deleteDoc(commentRef);

      const reelRef = doc(db, 'reels', reelId);
      await updateDoc(reelRef, {
        commentsCount: comments.length - 1
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert('Failed to delete comment');
    }
  };

  // Edit comment
  const handleEditComment = (commentId, userId, currentText) => {
    if (currentUser?.uid !== userId) {
      alert('You can only edit your own comments');
      return;
    }
    setEditingId(commentId);
    setEditText(currentText);
  };

  // Save edit
  const handleSaveEdit = async (commentId) => {
    if (editText.trim() === '') return;

    try {
      const commentRef = doc(db, 'reels', reelId, 'comments', commentId);
      await updateDoc(commentRef, {
        text: editText.trim(),
        updatedAt: serverTimestamp(),
        isEdited: true
      });
      setEditingId(null);
      setEditText('');
    } catch (error) {
      console.error("Error editing comment:", error);
      alert('Failed to edit comment');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 z-50 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 animate-slide-up max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Comments ({comments.length})
          </h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-3">💬</div>
              <p className="text-gray-400 text-sm">No comments yet. Be the first!</p>
            </div>
          ) : (
            comments.map((commentItem) => (
              <div key={commentItem.id} className="flex gap-3">
                {/* Avatar */}
                {commentItem.userPhoto ? (
                  <img 
                    src={commentItem.userPhoto} 
                    alt={commentItem.userName}
                    className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {commentItem.userName?.charAt(0) || 'A'}
                  </div>
                )}

                {/* Comment Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-sm text-gray-800">
                      {commentItem.userName}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatTime(commentItem.createdAt)}
                    </span>
                    {commentItem.isEdited && (
                      <span className="text-xs text-gray-400">(edited)</span>
                    )}
                  </div>

                  {editingId === commentItem.id ? (
                    <div>
                      <textarea
                        className="w-full p-2 border-2 border-blue-500 rounded-md text-sm resize-none focus:outline-none"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows="2"
                        autoFocus
                      />
                      <div className="flex gap-2 mt-2">
                        <button 
                          className="bg-green-500 text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-green-600 transition"
                          onClick={() => handleSaveEdit(commentItem.id)}
                        >
                          Save
                        </button>
                        <button 
                          className="bg-gray-400 text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-gray-500 transition"
                          onClick={() => {
                            setEditingId(null);
                            setEditText('');
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-700 text-sm leading-relaxed mb-2">
                        {commentItem.text}
                      </p>
                      {currentUser?.uid === commentItem.userId && (
                        <div className="flex gap-3">
                          <button 
                            className="text-yellow-600 text-xs hover:text-yellow-700 transition"
                            onClick={() => handleEditComment(commentItem.id, commentItem.userId, commentItem.text)}
                          >
                            Edit
                          </button>
                          <button 
                            className="text-red-500 text-xs hover:text-red-600 transition"
                            onClick={() => handleDeleteComment(commentItem.id, commentItem.userId)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Comment Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex gap-3">
            {currentUser?.photoURL ? (
              <img 
                src={currentUser.photoURL} 
                alt={currentUser.displayName}
                className="w-9 h-9 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {currentUser?.displayName?.charAt(0) || '?'}
              </div>
            )}
            <div className="flex-1 flex gap-2">
              <textarea
                className="flex-1 p-2 border-2 border-gray-200 rounded-lg text-sm resize-none focus:border-blue-500 focus:outline-none transition"
                placeholder={currentUser ? "Write a comment..." : "Please login to comment"}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={!currentUser}
                rows="1"
              />
              <button 
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  comment.trim() && currentUser
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                onClick={handleAddComment}
                disabled={!comment.trim() || !currentUser}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animation */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default CommentSection;
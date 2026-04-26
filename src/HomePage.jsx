import React, { useState, useEffect } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase'; // Adjust path to your firebase config

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!postId) return;

    // Real-time listener for comments array
    const postRef = doc(db, 'posts', postId); // Assuming collection name is 'posts'
    
    const unsubscribe = onSnapshot(postRef, 
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const postData = docSnapshot.data();
          const commentsArray = postData.comments || [];
          // Sort comments by createdAt (newest first)
          const sortedComments = [...commentsArray].sort((a, b) => {
            if (a.createdAt && b.createdAt) {
              return b.createdAt.seconds - a.createdAt.seconds;
            }
            return 0;
          });
          setComments(sortedComments);
          setError(null);
        } else {
          setComments([]);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching comments:", err);
        setError("Failed to load comments");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [postId]);

  // Format timestamp
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    
    // Handle Firestore Timestamp
    let date;
    if (timestamp?.toDate) {
      date = timestamp.toDate();
    } else if (timestamp?.seconds) {
      date = new Date(timestamp.seconds * 1000);
    } else {
      date = new Date(timestamp);
    }
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Comment Count */}
      <div className="border-b border-gray-200 pb-3">
        <h3 className="text-lg font-semibold text-gray-900">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-4 transition hover:shadow-md">
              <div className="flex items-start space-x-3">
                {/* User Avatar */}
                <div className="flex-shrink-0">
                  {comment.userPhoto ? (
                    <img 
                      src={comment.userPhoto} 
                      alt={comment.userName}
                      className="h-10 w-10 rounded-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${comment.userName}&background=random`;
                      }}
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {comment.userName?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Comment Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <span className="font-semibold text-gray-900">
                        {comment.userName || 'Anonymous User'}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    
                    {/* Like button for comment (if you have comment likes) */}
                    {comment.likes !== undefined && (
                      <button className="text-xs text-gray-500 hover:text-red-500 transition flex items-center space-x-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>{comment.likes}</span>
                      </button>
                    )}
                  </div>
                  
                  <p className="text-gray-700 mt-1.5 leading-relaxed">
                    {comment.text || comment.content}
                  </p>
                  
                  {/* Reply button */}
                  <button className="mt-2 text-xs text-gray-500 hover:text-orange-500 transition">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comments;
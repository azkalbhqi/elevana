"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { motion } from "framer-motion";

interface Story {
  id: string;
  author: string;
  content: string;
  createdAt: any;
  title?: string;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: any;
}

export default function StoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params); // ✅ unwrap params

  const [story, setStory] = useState<Story | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  // Ambil detail story
  useEffect(() => {
    const fetchStory = async () => {
      const docRef = doc(db, "stories", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setStory({ id: docSnap.id, ...docSnap.data() } as Story);
      }
    };
    fetchStory();
  }, [id]);

  // Ambil comments realtime
  useEffect(() => {
    const commentsRef = collection(db, "stories", id, "comments");
    const unsubscribe = onSnapshot(commentsRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Comment[];
      setComments(
        data.sort((a, b) => {
          const dateA = (a.createdAt as Timestamp)?.toMillis?.() || 0;
          const dateB = (b.createdAt as Timestamp)?.toMillis?.() || 0;
          return dateB - dateA;
        })
      );
    });
    return () => unsubscribe();
  }, [id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    const commentsRef = collection(db, "stories", id, "comments");
    await addDoc(commentsRef, {
      author: "Anonymous",
      content: newComment,
      createdAt: serverTimestamp(),
    });
    setNewComment("");
  };

  const formatDate = (date: any) => {
    if (!date) return "";
    const ts = date as Timestamp;
    return ts.toDate().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (!story)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading story...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-8"
      >
        {/* Story Header */}
        <div className="flex items-center gap-4 border-b pb-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-teal-400 flex items-center justify-center text-white font-bold text-xl">
            {story.author ? story.author[0].toUpperCase() : "U"}
          </div>
          <div>
            <h2 className="font-semibold text-lg text-gray-800">
              {story.author}
            </h2>
            <p className="text-sm text-gray-500">
              {formatDate(story.createdAt)}
            </p>
          </div>
        </div>

        {/* Story Content */}
        <div className="space-y-3">
          {story.title && (
            <h1 className="text-2xl font-bold text-gray-900">{story.title}</h1>
          )}
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {story.content}
          </p>
        </div>

        {/* Comments Section */}
        <div className="mt-10 border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Comments ({comments.length})
          </h3>

          {/* Add Comment Box */}
          <div className="mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Write a comment..."
              rows={3}
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleAddComment}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition"
              >
                Post Comment
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-sm text-gray-500">No comments yet.</p>
            ) : (
              comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-800">
                      {comment.author}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.content}</p>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

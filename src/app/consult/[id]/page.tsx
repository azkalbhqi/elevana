"use client";

import { use, useEffect, useState } from "react";
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

interface Story {
  id: string;
  author: string;
  content: string;
  createdAt: any;
  title: string;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: any;
}

export default function StoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // ✅ unwrap params
  const { id } = use(params);

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
      setComments(data);
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
      month: "long",
      year: "numeric",
    });
  };

  if (!story) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Story Detail */}
      <div className="border-b border-gray-200 pb-4 flex gap-3">
        <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0"></div>
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <span className="font-semibold">{story.author}</span>
            <span className="text-xs text-gray-500">
              {formatDate(story.createdAt)}
            </span>
          </div>
          <p className="text-sm mt-1 break-words">{story.content}</p>
        </div>
      </div>

      {/* Comments */}
      <div className="mt-6">
        <h2 className="font-bold mb-3">Comments</h2>
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-200 pb-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold">{comment.author}</span>
                <span className="text-xs text-gray-400">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p className="text-sm">{comment.content}</p>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-sm text-gray-500">No comments yet.</p>
          )}
        </div>

        {/* Add Comment */}
        <div className="mt-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full border rounded p-2 text-sm"
            placeholder="Write a comment..."
          />
          <button
            onClick={handleAddComment}
            className="mt-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Post Comment
          </button>
        </div>
      </div>
    </div>
  );
}

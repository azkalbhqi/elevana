"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import { PenLine } from "lucide-react";

interface Story {
  id: string;
  author: string;
  content: string;
  createdAt: any;
  title?: string;
}

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      const querySnapshot = await getDocs(collection(db, "stories"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Story[];

      // Sort by date descending
      data.sort((a, b) => {
        const dateA = (a.createdAt as Timestamp)?.toMillis?.() || 0;
        const dateB = (b.createdAt as Timestamp)?.toMillis?.() || 0;
        return dateB - dateA;
      });

      setStories(data);
      setLoading(false);
    };

    fetchStories();
  }, []);

  const formatDate = (date: any) => {
    if (!date) return "";
    const ts = date as Timestamp;
    return ts.toDate().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center sm:text-left">
          Stories
        </h1>

        {/* FLoating add story button */}
        <Link
      href="/story/create"
      className="fixed bottom-15 right-15 bg-teal-600 hover:bg-teal-700 text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2 transition-all duration-300 hover:scale-105"
        >
          <PenLine size={20} />
          <span className="font-medium">Tell us your story!</span>
        </Link>

        {/* Loading skeletons */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-white p-5 rounded-2xl shadow-sm border border-gray-100"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full" />
                  <div className="space-y-2 w-full">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/4" />
                  </div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            layout
            className="space-y-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {stories.length === 0 ? (
              <p className="text-gray-500 text-center text-sm">
                No stories yet. Be the first to share!
              </p>
            ) : (
              stories.map((story, i) => (
                <motion.div
                  key={story.id}
                  whileHover={{ y: -3, scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href={`/story/${story.id}`}>
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition p-6 cursor-pointer">
                      {/* Header */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-teal-400 flex items-center justify-center text-white font-bold text-lg">
                          {story.author ? story.author[0].toUpperCase() : "U"}
                        </div>
                        <div>
                          <h2 className="font-semibold text-gray-800">
                            {story.author}
                          </h2>
                          <p className="text-sm text-gray-500">
                            {formatDate(story.createdAt)}
                          </p>
                        </div>
                      </div>

                      {/* Content */}
                      <div>
                        {story.title && (
                          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                            {story.title}
                          </h3>
                        )}
                        <p className="text-gray-700 text-sm sm:text-base leading-relaxed line-clamp-3">
                          {story.content}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-6 mt-4 text-gray-500 text-sm">
                        <button className="hover:text-blue-500 transition flex items-center gap-1 font-semibold">
                          💬 Comment
                        </button>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

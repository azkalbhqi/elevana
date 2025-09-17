// app/stories/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

interface Story {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  title: string;
}

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    const fetchStories = async () => {
      const querySnapshot = await getDocs(collection(db, "stories"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Story[];
      setStories(data);
    };
    fetchStories();
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">
        Stories
      </h1>

      <div className="space-y-6">
        {stories.map((story) => (
          <Link href={`/story/${story.id}`} key={story.id}>
            <div className="border-b border-gray-200 pb-4 flex gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition">
              {/* Avatar */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-300 flex-shrink-0"></div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <span className="font-semibold text-sm sm:text-base truncate">
                    {story.author}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500">
                    {new Date(story.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-xs sm:text-sm mt-1 break-words">
                  {story.content}
                </p>

                <div className="flex gap-4 sm:gap-6 mt-3 text-gray-500 text-xs sm:text-sm flex-wrap">
                  <button className="hover:text-blue-500 transition">💬 Reply</button>
                  <button className="hover:text-pink-500 transition">❤️ Like</button>
                  <button className="hover:text-green-500 transition">🔗 Share</button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

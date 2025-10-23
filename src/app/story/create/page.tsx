'use client'

import React, { useState, useEffect } from 'react';
import { collection, addDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const CreateStoryPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setFullName(userData.fullName || firebaseUser.displayName || 'Unknown User');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    if (!user) {
      alert('You must be logged in to post a story.');
      return;
    }

    try {
      const storiesCollection = collection(db, 'stories');
      await addDoc(storiesCollection, {
        title,
        content,
        author: isAnonymous ? 'Anonymous' : fullName || 'Unknown User',
        authorId: user.uid,
        isAnonymous,
        createdAt: serverTimestamp(),
      });

      setMessage('🎉 Story created successfully!');
      setTitle('');
      setContent('');
      setIsAnonymous(false);

      setTimeout(() => {
        setMessage(null);
        router.push('/stories');
      }, 1800);
    } catch (error) {
      console.error('Error adding story: ', error);
      setMessage('❌ Failed to create story.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        Loading your profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex items-center justify-center py-12 px-6">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl p-8 md:p-10 relative">
        <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-teal-600 to-emerald-500 text-transparent bg-clip-text mb-6 text-center">
          Share Your Story
        </h1>

        {!user ? (
          <p className="text-center text-red-500 font-medium text-lg">
            🚫 You must be logged in to create a story.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Story Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g., My Journey into Coding"
                className="w-full border border-gray-300 focus:ring-2 focus:ring-teal-400 rounded-lg px-4 py-3 transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Your Story
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                placeholder="Write your experience or story here..."
                className="w-full border border-gray-300 focus:ring-2 focus:ring-teal-400 rounded-lg px-4 py-3 h-40 transition-all outline-none"
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 accent-teal-600 cursor-pointer"
              />
              <label htmlFor="anonymous" className="text-gray-700 cursor-pointer">
                Post as Anonymous
              </label>
            </div>

            {message && (
              <p
                className={`text-center text-sm font-medium mt-2 transition-all ${
                  message.startsWith('🎉') ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white font-semibold py-3 rounded-lg shadow-md transition-all transform hover:scale-[1.02]"
            >
              Post My Story
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateStoryPage;

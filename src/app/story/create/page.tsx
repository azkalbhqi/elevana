'use client'

import React, { useState, useEffect } from 'react';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

const CreateStoryPage: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [fullName, setFullName] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Ambil user dari Firebase Auth
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                // ambil data dari Firestore users/{uid}
                const userDocRef = doc(db, 'users', firebaseUser.uid);
                const userSnap = await getDoc(userDocRef);

                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    setFullName(userData.fullName || null);
                }
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content) return;

        // stop kalau user tidak login
        if (!user) {
            alert("You must be logged in to post a story.");
            return;
        }

        try {
            const storiesCollection = collection(db, 'stories');
            await addDoc(storiesCollection, {
                title,
                content,
                author: isAnonymous ? "Anonymous" : fullName || "Unknown User",
                createdAt: new Date(),
            });

            alert('Story created successfully!');
            setTitle('');
            setContent('');
            setIsAnonymous(false);
        } catch (error) {
            console.error('Error adding story: ', error);
            alert('Failed to create story.');
        }
    };

    if (loading) {
        return <p className="text-center text-gray-500">Loading...</p>;
    }

    return (
        <div className="max-w-lg mx-auto align-middle p-6 mt-40 bg-white shadow rounded">
            <h1 className="text-2xl font-bold mb-4">Create a Story</h1>

            {!user ? (
                <p className="text-red-500 font-medium">
                    🚫 You must be logged in to create a story.
                </p>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-medium">
                            Title:
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="w-full border rounded px-3 py-2 mt-1"
                            />
                        </label>
                    </div>
                    <div>
                        <label className="block font-medium">
                            Content:
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                className="w-full border rounded px-3 py-2 mt-1 h-32"
                            />
                        </label>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="anonymous"
                            checked={isAnonymous}
                            onChange={(e) => setIsAnonymous(e.target.checked)}
                            className="mr-2"
                        />
                        <label htmlFor="anonymous">Post as Anonymous</label>
                    </div>

                    <button
                        type="submit"
                        className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
                    >
                        Post Story
                    </button>
                </form>
            )}
        </div>
    );
};

export default CreateStoryPage;

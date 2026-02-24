"use client";
import Link from "next/link";

export default function BlogClient({ posts }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-red-700 mb-6">🔴 पार्टी समाचार</h1>
      {posts.length === 0 && <p className="text-gray-500">अभी कोई पोस्ट नहीं है</p>}
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow overflow-hidden">
            {post.cover_image && (
              <img src={post.cover_image} alt={post.title}
                className="w-full h-48 object-top" />
            )}
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h2>
              <p className="text-gray-600 text-sm mb-3">
                {post.author_name} — {new Date(post.created_at).toLocaleDateString("hi-IN")}
              </p>
              <p className="text-gray-700 line-clamp-3">{post.content}</p>
              <Link href={`/blog/${post.id}`}
                className="mt-3 inline-block text-red-700 font-bold hover:underline">
                पूरा पढ़ें →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
"use client";
import { useState } from "react";

export default function BlogPostClient({ post, comments }) {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleComment() {
    if (!content) return;
    setLoading(true);
    await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post_id: post.id, name, content }),
    });
    setSent(true);
    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{post.title}</h1>
        <p className="text-gray-500 text-sm mb-4">
          {post.author_name} — {new Date(post.created_at).toLocaleDateString("hi-IN")}
        </p>

        {post.video_url && (
          <div className="mb-4 aspect-video">
            <iframe src={post.video_url.replace("watch?v=", "embed/")}
              className="w-full h-full rounded" allowFullScreen />
          </div>
        )}

        <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">{post.content}</div>

        {post.pdf_url && (
          <a href={post.pdf_url} target="_blank"
            className="mt-4 inline-block bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800">
            📄 परचा डाउनलोड करें
          </a>
        )}
      </div>

      {/* टिप्पणी */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold text-red-700 mb-4">अपनी बात कहें</h2>
        {sent
          ? <p className="text-green-600 font-bold">✅ आपकी टिप्पणी भेज दी गई — जल्द प्रकाशित होगी</p>
          : <>
              <input value={name} onChange={(e) => setName(e.target.value)}
                placeholder="आपका नाम (वैकल्पिक)"
                className="w-full border rounded px-3 py-2 mb-3 focus:outline-none focus:border-red-700" />
              <textarea value={content} onChange={(e) => setContent(e.target.value)}
                placeholder="अपनी समस्या, अपने हालात यहाँ लिखें..."
                rows={4}
                className="w-full border rounded px-3 py-2 mb-3 focus:outline-none focus:border-red-700" />
              <button onClick={handleComment} disabled={loading}
                className="bg-red-700 text-white px-6 py-2 rounded font-bold hover:bg-red-800 disabled:opacity-50">
                {loading ? "भेजा जा रहा है..." : "भेजें"}
              </button>
            </>
        }
      </div>

      {/* प्रकाशित टिप्पणियाँ */}
      {comments.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-red-700 mb-4">टिप्पणियाँ</h2>
          <div className="space-y-4">
            {comments.map((c) => (
              <div key={c.id} className="border-b pb-4">
                <p className="font-bold text-gray-800">{c.name}</p>
                <p className="text-gray-600 text-sm">{new Date(c.created_at).toLocaleDateString("hi-IN")}</p>
                <p className="text-gray-700 mt-1">{c.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
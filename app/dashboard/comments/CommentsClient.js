"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CommentsClient({ comments }) {
  const router = useRouter();
  const [loading, setLoading] = useState(null);

  async function handleAction(id, approved) {
    setLoading(id);
    await fetch("/api/comments", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, approved }),
    });
    setLoading(null);
    router.refresh();
  }

  const pending = comments.filter((c) => c.approved === 0);
  const approved = comments.filter((c) => c.approved === 1);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-red-700 mb-6">टिप्पणी मॉडरेशन</h1>

      <div className="mb-8">
        <h2 className="text-lg font-bold text-orange-600 mb-4">
          ⏳ प्रतीक्षारत ({pending.length})
        </h2>
        {pending.length === 0 && <p className="text-gray-500">कोई नहीं</p>}
        <div className="space-y-4">
          {pending.map((c) => (
            <div key={c.id} className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-400">
              <p className="text-sm text-gray-500 mb-1">
                <span className="font-bold">{c.name}</span> — {c.post_title} — {new Date(c.created_at).toLocaleDateString("hi-IN")}
              </p>
              <p className="text-gray-700 mb-3">{c.content}</p>
              <div className="flex gap-3">
                <button onClick={() => handleAction(c.id, 1)}
                  disabled={loading === c.id}
                  className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 disabled:opacity-50 text-sm font-bold">
                  ✅ प्रकाशित करें
                </button>
                <button onClick={() => handleAction(c.id, -1)}
                  disabled={loading === c.id}
                  className="bg-red-700 text-white px-4 py-1 rounded hover:bg-red-800 disabled:opacity-50 text-sm font-bold">
                  ❌ अस्वीकार करें
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-green-600 mb-4">
          ✅ प्रकाशित ({approved.length})
        </h2>
        {approved.length === 0 && <p className="text-gray-500">कोई नहीं</p>}
        <div className="space-y-3">
          {approved.map((c) => (
            <div key={c.id} className="bg-white rounded-lg shadow p-4 border-l-4 border-green-400">
              <p className="text-sm text-gray-500 mb-1">
                <span className="font-bold">{c.name}</span> — {c.post_title} — {new Date(c.created_at).toLocaleDateString("hi-IN")}
              </p>
              <p className="text-gray-700 mb-2">{c.content}</p>
              <button onClick={() => handleAction(c.id, 0)}
                disabled={loading === c.id}
                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 text-sm">
                वापस लें
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
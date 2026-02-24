"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewBlogClient() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", content: "", video_url: "", pdf_url: "" });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit() {
    if (!form.title || !form.content) return;
    setLoading(true);
    const res = await fetch("/api/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) router.push("/blog");
    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-red-700 mb-6">नई पोस्ट लिखें</h1>
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block font-bold mb-1">शीर्षक *</label>
          <input name="title" value={form.title} onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:border-red-700" />
        </div>
        <div>
          <label className="block font-bold mb-1">सामग्री *</label>
          <textarea name="content" value={form.content} onChange={handleChange} rows={8}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:border-red-700" />
        </div>
        <div>
          <label className="block font-bold mb-1">YouTube वीडियो URL (वैकल्पिक)</label>
          <input name="video_url" value={form.video_url} onChange={handleChange}
            placeholder="https://youtube.com/watch?v=..."
            className="w-full border rounded px-3 py-2 focus:outline-none focus:border-red-700" />
        </div>
        <div>
          <label className="block font-bold mb-1">परचा PDF URL (वैकल्पिक)</label>
          <input name="pdf_url" value={form.pdf_url} onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:border-red-700" />
        </div>
        <button onClick={handleSubmit} disabled={loading}
          className="w-full bg-red-700 text-white py-3 rounded font-bold hover:bg-red-800 disabled:opacity-50">
          {loading ? "प्रकाशित हो रहा है..." : "प्रकाशित करें"}
        </button>
      </div>
    </div>
  );
}
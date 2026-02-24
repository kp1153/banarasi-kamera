"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";

export default function NewBlogClient() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", content: "", video_url: "", pdf_url: "" });
  const [coverImage, setCoverImage] = useState("");
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleGalleryUpload(result) {
    setGallery((prev) => [...prev, result.info.secure_url]);
  }

  function removeGalleryImage(url) {
    setGallery((prev) => prev.filter((u) => u !== url));
  }

  async function handleSubmit() {
    if (!form.title || !form.content) return;
    setLoading(true);
    const res = await fetch("/api/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        cover_image: coverImage,
        gallery: JSON.stringify(gallery),
      }),
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

        {/* मुख्य तस्वीर */}
        <div>
          <label className="block font-bold mb-2">मुख्य तस्वीर</label>
          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            onSuccess={(result) => setCoverImage(result.info.secure_url)}
          >
            {({ open }) => (
              <div>
                <button type="button" onClick={open}
                  className="bg-gray-100 border rounded px-4 py-2 hover:bg-gray-200 text-sm">
                  📷 तस्वीर चुनें
                </button>
                {coverImage && (
                  <div className="mt-3 relative inline-block">
                    <img src={coverImage} alt="मुख्य तस्वीर"
                      className="w-48 h-32 object-cover rounded border" />
                    <button onClick={() => setCoverImage("")}
                      className="absolute top-1 right-1 bg-red-700 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                      ✕
                    </button>
                  </div>
                )}
              </div>
            )}
          </CldUploadWidget>
        </div>

        {/* गैलरी */}
        <div>
          <label className="block font-bold mb-2">गैलरी (एक से ज्यादा तस्वीरें)</label>
          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            onSuccess={handleGalleryUpload}
          >
            {({ open }) => (
              <button type="button" onClick={open}
                className="bg-gray-100 border rounded px-4 py-2 hover:bg-gray-200 text-sm">
                🖼️ गैलरी में जोड़ें
              </button>
            )}
          </CldUploadWidget>
          {gallery.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {gallery.map((url) => (
                <div key={url} className="relative">
                  <img src={url} alt="गैलरी" className="w-24 h-24 object-cover rounded border" />
                  <button onClick={() => removeGalleryImage(url)}
                    className="absolute top-1 right-1 bg-red-700 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
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
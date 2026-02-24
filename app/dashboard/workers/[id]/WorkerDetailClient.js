"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";

const SKILLS = ["राजमिस्त्री", "खेत मजदूर", "निर्माण मजदूर"];
const ADDICTIONS = ["शराब", "तंबाकू", "गुटखा", "बीड़ी", "ड्रग"];

export default function WorkerDetailClient({ worker, addictions, blocks, role }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(worker.photo_url || "");
  const [selectedAddictions, setSelectedAddictions] = useState(addictions);
  const [form, setForm] = useState({ ...worker });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  function toggleAddiction(a) {
    setSelectedAddictions((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  }

  async function handleSave() {
    setLoading(true);
    const res = await fetch(`/api/workers/${worker.mobile}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, photo_url: photoUrl, addictions: selectedAddictions }),
    });
    if (res.ok) {
      setEditing(false);
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-red-700">श्रमिक विवरण</h1>
        {!editing && (
          <button onClick={() => setEditing(true)}
            className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800">
            संपादित करें
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {/* फोटो */}
        <div className="flex items-center gap-6 mb-6">
          {photoUrl
            ? <img src={photoUrl} alt="फोटो" className="w-24 h-24 rounded-full object-cover border-4 border-red-700" />
            : <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl">👤</div>
          }
          {editing && (
            <CldUploadWidget uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              onSuccess={(result) => setPhotoUrl(result.info.secure_url)}>
              {({ open }) => (
                <button type="button" onClick={open}
                  className="bg-gray-100 border rounded px-3 py-2 hover:bg-gray-200 text-sm">
                  📷 फोटो बदलें
                </button>
              )}
            </CldUploadWidget>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ["mobile", "मोबाइल", false],
            ["name", "नाम", editing],
            ["age", "उम्र", editing],
            ["caste", "जाति", editing],
            ["religion", "धर्म", editing],
            ["village", "गाँव/मोहल्ला", editing],
            ["monthly_income", "मासिक आय", editing],
            ["dependents", "आश्रित सदस्य", editing],
            ["children", "बच्चे", editing],
            ["children_in_school", "स्कूल जाने वाले बच्चे", editing],
            ["wife_work", "पत्नी का काम", editing],
            ["disease", "बीमारी", editing],
          ].map(([key, label, editable]) => (
            <div key={key}>
              <p className="text-sm text-gray-500">{label}</p>
              {editable
                ? <input name={key} value={form[key] || ""} onChange={handleChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:border-red-700" />
                : <p className="font-bold">{worker[key] || "—"}</p>
              }
            </div>
          ))}

          {/* ब्लॉक */}
          <div>
            <p className="text-sm text-gray-500">ब्लॉक</p>
            {editing
              ? <select name="block_id" value={form.block_id} onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:border-red-700">
                  {blocks.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              : <p className="font-bold">{worker.block_name || "—"}</p>
            }
          </div>

          {/* लिंग */}
          <div>
            <p className="text-sm text-gray-500">लिंग</p>
            {editing
              ? <select name="gender" value={form.gender} onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:border-red-700">
                  <option>पुरुष</option><option>महिला</option><option>अन्य</option>
                </select>
              : <p className="font-bold">{worker.gender || "—"}</p>
            }
          </div>
        </div>

        {/* चेकबॉक्स */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
          {[
            ["is_agricultural", "कृषि से जुड़ा"],
            ["is_migrant", "प्रवासी"],
            ["has_aadhar", "आधार"],
            ["has_labour_card", "श्रमिक कार्ड"],
            ["has_ration_card", "राशन कार्ड"],
            ["has_ayushman", "आयुष्मान"],
            ["has_bank_account", "बैंक खाता"],
            ["has_jan_dhan", "जन धन"],
          ].map(([key, label]) => (
            <div key={key} className="flex items-center gap-2">
              {editing
                ? <input type="checkbox" name={key} checked={!!form[key]} onChange={handleChange} className="w-4 h-4" />
                : <span>{worker[key] ? "✅" : "❌"}</span>
              }
              <label className="text-sm">{label}</label>
            </div>
          ))}
        </div>

        {/* प्रवास */}
        {(form.is_migrant || worker.is_migrant) && (
          <div className="mt-4 bg-orange-50 rounded p-4">
            <p className="font-bold text-orange-700 mb-2">प्रवास जानकारी</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["migrant_city", "शहर"],
                ["migrant_months", "महीने"],
                ["migrant_season", "मौसम"],
                ["migrant_work", "काम"],
              ].map(([key, label]) => (
                <div key={key}>
                  <p className="text-sm text-gray-500">{label}</p>
                  {editing
                    ? <input name={key} value={form[key] || ""} onChange={handleChange}
                        className="w-full border rounded px-2 py-1 focus:outline-none focus:border-red-700" />
                    : <p className="font-bold">{worker[key] || "—"}</p>
                  }
                </div>
              ))}
            </div>
          </div>
        )}

        {/* नशा */}
        <div className="mt-4">
          <p className="font-bold mb-2">नशे की स्थिति</p>
          {editing
            ? <div className="flex flex-wrap gap-2">
                {ADDICTIONS.map((a) => (
                  <button key={a} type="button" onClick={() => toggleAddiction(a)}
                    className={`px-3 py-1 rounded-full border text-sm font-bold ${
                      selectedAddictions.includes(a)
                        ? "bg-red-700 text-white border-red-700"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}>{a}</button>
                ))}
              </div>
            : selectedAddictions.length === 0
              ? <p className="text-green-600 font-bold">✅ नशामुक्त</p>
              : <div className="flex flex-wrap gap-2">
                  {selectedAddictions.map((a) => (
                    <span key={a} className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">{a}</span>
                  ))}
                </div>
          }
        </div>

        {editing && (
          <div className="mt-6 flex gap-3">
            <button onClick={handleSave} disabled={loading}
              className="bg-red-700 text-white px-6 py-2 rounded font-bold hover:bg-red-800 disabled:opacity-50">
              {loading ? "सहेजा जा रहा है..." : "सहेजें"}
            </button>
            <button onClick={() => setEditing(false)}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded font-bold hover:bg-gray-300">
              रद्द करें
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
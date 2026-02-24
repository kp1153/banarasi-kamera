"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";

const SKILLS = const SKILLS = ["राजमिस्त्री", "खेत मजदूर", "निर्माण मजदूर"];

const ADDICTIONS = ["शराब", "तंबाकू", "गुटखा", "बीड़ी", "ड्रग"];

export default function NewWorkerClient({ blocks, activistId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [selectedAddictions, setSelectedAddictions] = useState([]);
  const [form, setForm] = useState({
    mobile: "", name: "", age: "", gender: "पुरुष",
    caste: "", religion: "", block_id: "", village: "",
    skill: "", custom_skill: "", is_agricultural: false,
    monthly_income: "", land_bigha: "", dependents: "",
    children: "", children_in_school: "", wife_work: "",
    disease: "", is_migrant: false, migrant_city: "",
    migrant_months: "", migrant_season: "", migrant_work: "",
    has_aadhar: false, has_labour_card: false,
    has_ration_card: false, has_ayushman: false,
    has_bank_account: false, has_jan_dhan: false,
    registration_source: "activist",
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  function toggleAddiction(a) {
    setSelectedAddictions((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  }

  async function handleSubmit() {
    if (!form.mobile || !form.name || !form.block_id) {
      setError("मोबाइल, नाम और ब्लॉक अनिवार्य है");
      return;
    }
    setLoading(true);
    setError("");
    const res = await fetch("/api/workers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        photo_url: photoUrl,
        addictions: selectedAddictions,
        activist_id: activistId,
      }),
    });
    if (res.ok) {
      router.push("/dashboard/workers");
    } else {
      const data = await res.json();
      setError(data.error || "कुछ गड़बड़ हुई");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-red-700 mb-6">नया श्रमिक पंजीकरण</h1>

      {error && <p className="text-red-500 mb-4 bg-red-50 p-3 rounded">{error}</p>}

      <div className="bg-white rounded-lg shadow p-6 space-y-6">

        {/* फोटो */}
        <div>
          <label className="block font-bold mb-2">फोटो</label>
          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            onSuccess={(result) => setPhotoUrl(result.info.secure_url)}
          >
            {({ open }) => (
              <div>
                <button type="button" onClick={open}
                  className="bg-gray-100 border rounded px-4 py-2 hover:bg-gray-200">
                  📷 फोटो अपलोड करें
                </button>
                {photoUrl && <img src={photoUrl} alt="फोटो" className="mt-3 w-24 h-24 rounded-full object-cover" />}
              </div>
            )}
          </CldUploadWidget>
        </div>

        {/* बुनियादी जानकारी */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold mb-1">मोबाइल नंबर *</label>
            <input name="mobile" value={form.mobile} onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:border-red-700"
              placeholder="10 अंक" maxLength={10} />
          </div>
          <div>
            <label className="block font-bold mb-1">नाम *</label>
            <input name="name" value={form.name} onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:border-red-700" />
          </div>
          <div>
            <label className="block font-bold mb-1">उम्र</label>
            <input name="age" type="number" value={form.age} onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:border-red-700" />
          </div>
          <div>
            <label className="block font-bold mb-1">लिंग</label>
            <select name="gender" value={form.gender} onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:border-red-700">
              <option>पुरुष</option>
              <option>महिला</option>
              <option>अन्य</option>
            </select>
          </div>
          <div>
            <label className="block font-bold mb-1">जाति</label>
            <input name="caste" value={form.caste} onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:border-red-700" />
          </div>
          <div>
            <label className="block font-bold mb-1">धर्म</label>
            <input name="religion" value={form.religion} onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:border-red-700" />
          </div>
          <div>
            <label className="block font-bold mb-1">ब्लॉक *</label>
            <select name="block_id" value={form.block_id} onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:border-red-700">
              <option value="">चुनें</option>
              {blocks.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-bold mb-1">गाँव/मोहल्ला</label>
            <input name="village" value={form.village} onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:border-red-700" />
          </div>
        </div>

        {/* महारत */}
        <div>
          <label className="block font-bold mb-2">काम में महारत</label>
          <select name="skill" value={form.skill} onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:border-red-700 mb-2">
            <option value="">सूची में से चुनें</option>
            {SKILLS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <input name="custom_skill" value={form.custom_skill} onChange={handleChange}
            placeholder="या खुद लिखें"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:border-red-700" />
        </div>

        {/* आर्थिक स्थिति */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold mb-1">मासिक आय (रुपये)</label>
            <input name="monthly_income" type="number" value={form.monthly_income} onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:border-red-700" />
          </div>
          <div>
            <label className="block font-bold mb-1">कृषि भूमि (बीघा)</label>
            <input name="land_bigha" type="number" value={form.land_bigha} onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:border-red-700" />
          </div>
          <div>
            <label className="block font-bold mb-1">आश्रित सदस्य</label>
            <input name="dependents" type="number" value={form.dependents} onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:border-red-700" />
          </div>
          <div>
            <label className="block font-bold mb-1">बच्चों की संख्या</label>
            <input name="children" type="number" value={form.children} onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:border-red-700" />
          </div>
          <div>
            <label className="block font-bold mb-1">स्कूल जाने वाले बच्चे</label>
            <input name="children_in_school" type="number" value={form.children_in_school} onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:border-red-700" />
          </div>
          <div>
            <label className="block font-bold mb-1">पत्नी का काम</label>
            <input name="wife_work" value={form.wife_work} onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:border-red-700" />
          </div>
        </div>

        {/* कृषि */}
        <div className="flex items-center gap-2">
          <input type="checkbox" name="is_agricultural" checked={form.is_agricultural} onChange={handleChange}
            className="w-4 h-4" />
          <label className="font-bold">कृषि से भी जुड़ा है</label>
        </div>

        {/* बीमारी */}
        <div>
          <label className="block font-bold mb-1">बीमारी (यदि हो)</label>
          <input name="disease" value={form.disease} onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:border-red-700" />
        </div>

        {/* नशा */}
        <div>
          <label className="block font-bold mb-2">नशे की स्थिति (जो लागू हो सब चुनें)</label>
          <div className="flex flex-wrap gap-3">
            {ADDICTIONS.map((a) => (
              <button key={a} type="button" onClick={() => toggleAddiction(a)}
                className={`px-4 py-2 rounded-full border font-bold text-sm ${
                  selectedAddictions.includes(a)
                    ? "bg-red-700 text-white border-red-700"
                    : "bg-white text-gray-700 border-gray-300 hover:border-red-700"
                }`}>
                {a}
              </button>
            ))}
          </div>
          {selectedAddictions.length === 0 && (
            <p className="text-green-600 text-sm mt-2">✅ नशामुक्त</p>
          )}
        </div>

        {/* प्रवास */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <input type="checkbox" name="is_migrant" checked={form.is_migrant} onChange={handleChange}
              className="w-4 h-4" />
            <label className="font-bold">प्रवासी श्रमिक है</label>
          </div>
          {form.is_migrant && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
              <div>
                <label className="block font-bold mb-1">कहाँ जाता है</label>
                <input name="migrant_city" value={form.migrant_city} onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:border-red-700" />
              </div>
              <div>
                <label className="block font-bold mb-1">कितने महीने</label>
                <input name="migrant_months" type="number" value={form.migrant_months} onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:border-red-700" />
              </div>
              <div>
                <label className="block font-bold mb-1">कौन सा मौसम</label>
                <input name="migrant_season" value={form.migrant_season} onChange={handleChange}
                  placeholder="गर्मी / सर्दी / बरसात"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:border-red-700" />
              </div>
              <div>
                <label className="block font-bold mb-1">वहाँ कौन सा काम</label>
                <input name="migrant_work" value={form.migrant_work} onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:border-red-700" />
              </div>
            </div>
          )}
        </div>

        {/* दस्तावेज़ */}
        <div>
          <label className="block font-bold mb-3">दस्तावेज़ की स्थिति</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              ["has_aadhar", "आधार कार्ड"],
              ["has_labour_card", "श्रमिक कार्ड"],
              ["has_ration_card", "राशन कार्ड"],
              ["has_ayushman", "आयुष्मान कार्ड"],
              ["has_bank_account", "बैंक खाता"],
              ["has_jan_dhan", "जन धन खाता"],
            ].map(([key, label]) => (
              <div key={key} className="flex items-center gap-2">
                <input type="checkbox" name={key} checked={form[key]} onChange={handleChange}
                  className="w-4 h-4" />
                <label>{label}</label>
              </div>
            ))}
          </div>
        </div>

        <button onClick={handleSubmit} disabled={loading}
          className="w-full bg-red-700 text-white py-3 rounded font-bold hover:bg-red-800 disabled:opacity-50">
          {loading ? "सहेजा जा रहा है..." : "पंजीकरण करें"}
        </button>
      </div>
    </div>
  );
}
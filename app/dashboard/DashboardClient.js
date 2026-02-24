"use client";
import Link from "next/link";

export default function DashboardClient({ total, blocks, addictions, migrants, role }) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-red-700 mb-6">डैशबोर्ड</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 text-center border-l-4 border-red-700">
          <p className="text-3xl font-bold text-red-700">{total}</p>
          <p className="text-sm text-gray-600">कुल श्रमिक</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center border-l-4 border-orange-500">
          <p className="text-3xl font-bold text-orange-500">{migrants}</p>
          <p className="text-sm text-gray-600">प्रवासी श्रमिक</p>
        </div>
        <Link href="/dashboard/workers/new" className="bg-white rounded-lg shadow p-4 text-center border-l-4 border-green-600 hover:shadow-md">
          <p className="text-3xl">➕</p>
          <p className="text-sm text-gray-600">नया श्रमिक जोड़ें</p>
        </Link>
        <Link href="/dashboard/workers" className="bg-white rounded-lg shadow p-4 text-center border-l-4 border-blue-600 hover:shadow-md">
          <p className="text-3xl">👥</p>
          <p className="text-sm text-gray-600">सभी श्रमिक</p>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-red-700 mb-4">ब्लॉक-वार श्रमिक</h2>
          {blocks.map((b) => (
            <div key={b.name} className="flex justify-between py-2 border-b">
              <span>{b.name}</span>
              <span className="font-bold text-red-700">{b.count}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-red-700 mb-4">नशे की स्थिति</h2>
          {addictions.length === 0 && <p className="text-gray-500">कोई डेटा नहीं</p>}
          {addictions.map((a) => (
            <div key={a.addiction_type} className="flex justify-between py-2 border-b">
              <span>{a.addiction_type}</span>
              <span className="font-bold text-red-700">{a.count}</span>
            </div>
          ))}
        </div>
      </div>

      {role === "admin" && (
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-red-700 mb-4">एडमिन</h2>
          <div className="flex gap-4">
            <Link href="/dashboard/blog/new" className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800">
              नई पोस्ट लिखें
            </Link>
            <Link href="/dashboard/activists/new" className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800">
              नया कार्यकर्ता जोड़ें
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
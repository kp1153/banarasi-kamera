"use client";
import { useState } from "react";
import Link from "next/link";

export default function WorkersClient({ workers, blocks }) {
  const [search, setSearch] = useState("");
  const [block, setBlock] = useState("");

  const filtered = workers.filter((w) => {
    const matchSearch = w.name.includes(search) || w.mobile.includes(search);
    const matchBlock = block ? w.block_id == block : true;
    return matchSearch && matchBlock;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-red-700">श्रमिक सूची</h1>
        <Link href="/dashboard/workers/new" className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800">
          ➕ नया श्रमिक
        </Link>
      </div>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="नाम या मोबाइल खोजें"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 flex-1 focus:outline-none focus:border-red-700"
        />
        <select
          value={block}
          onChange={(e) => setBlock(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:border-red-700"
        >
          <option value="">सभी ब्लॉक</option>
          {blocks.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-red-700 text-white">
            <tr>
              <th className="px-4 py-3 text-left">नाम</th>
              <th className="px-4 py-3 text-left">मोबाइल</th>
              <th className="px-4 py-3 text-left">ब्लॉक</th>
              <th className="px-4 py-3 text-left">काम</th>
              <th className="px-4 py-3 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((w) => (
              <tr key={w.mobile} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{w.name}</td>
                <td className="px-4 py-3">{w.mobile}</td>
                <td className="px-4 py-3">{w.block_name}</td>
                <td className="px-4 py-3">{w.skill || w.custom_skill || "—"}</td>
                <td className="px-4 py-3">
                  <Link href={`/dashboard/workers/${w.mobile}`} className="text-red-700 hover:underline">
                    देखें
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">कोई श्रमिक नहीं मिला</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
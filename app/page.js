import Navbar from "@/components/Navbar";
import Link from "next/link";
import { initDB } from "@/lib/db";
import db from "@/lib/db";

export default async function Home() {
  await initDB();

  const result = await db.execute("SELECT COUNT(*) as total FROM workers");
  const total = result.rows[0].total;

  const blockResult = await db.execute(`
    SELECT b.name, COUNT(w.mobile) as count 
    FROM blocks b 
    LEFT JOIN workers w ON w.block_id = b.id 
    GROUP BY b.id, b.name
  `);

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-red-700 mb-2">🔴 बनारसी कमेरा</h1>
          <p className="text-gray-600">भारतीय कम्युनिस्ट पार्टी — वाराणसी जिला</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-lg shadow p-6 text-center border-l-4 border-red-700">
            <p className="text-4xl font-bold text-red-700">{total}</p>
            <p className="text-gray-600 mt-1">कुल पंजीकृत श्रमिक</p>
          </div>
          <Link href="/register" className="bg-white rounded-lg shadow p-6 text-center border-l-4 border-green-600 hover:shadow-md">
            <p className="text-4xl">📝</p>
            <p className="text-gray-600 mt-1">पंजीकरण करें</p>
          </Link>
          <Link href="/blog" className="bg-white rounded-lg shadow p-6 text-center border-l-4 border-blue-600 hover:shadow-md">
            <p className="text-4xl">📰</p>
            <p className="text-gray-600 mt-1">पार्टी समाचार</p>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-red-700 mb-4">ब्लॉक-वार श्रमिक</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {blockResult.rows.map((block) => (
              <div key={block.name} className="bg-gray-50 rounded p-3 text-center">
                <p className="font-bold text-red-700">{block.count}</p>
                <p className="text-sm text-gray-600">{block.name}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-red-700 text-white px-4 py-3 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">
        🔴 बनारसी कमेरा
      </Link>
      <div className="flex gap-4 items-center">
        <Link href="/blog" className="hover:underline">ब्लॉग</Link>
        {session ? (
          <>
            <Link href="/dashboard" className="hover:underline">डैशबोर्ड</Link>
            <span className="text-sm opacity-80">{session.user.name}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="bg-white text-red-700 px-3 py-1 rounded text-sm font-bold hover:bg-red-100"
            >
              लॉगआउट
            </button>
          </>
        ) : (
          <Link href="/login" className="bg-white text-red-700 px-3 py-1 rounded text-sm font-bold hover:bg-red-100">
            लॉगिन
          </Link>
        )}
      </div>
    </nav>
  );
}
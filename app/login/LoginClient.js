"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginClient() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin() {
    const res = await signIn("credentials", {
      mobile,
      password,
      redirect: false,
    });
    if (res.ok) {
      router.push("/dashboard");
    } else {
      setError("मोबाइल या पासवर्ड गलत है");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow max-w-sm w-full">
        <h1 className="text-2xl font-bold text-red-700 mb-6 text-center">🔴 लॉगिन</h1>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <input
          type="text"
          placeholder="मोबाइल नंबर"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:border-red-700"
        />
        <div className="relative mb-6">
          <input
            type={show ? "text" : "password"}
            placeholder="पासवर्ड"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:border-red-700 pr-10"
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-2 text-gray-500 hover:text-red-700"
          >
            {show ? "🙈" : "👁️"}
          </button>
        </div>
        <button
          onClick={handleLogin}
          className="w-full bg-red-700 text-white py-2 rounded font-bold hover:bg-red-800"
        >
          लॉगिन करें
        </button>
      </div>
    </div>
  );
}
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "बनारसी कमेरा — सीपीआई वाराणसी",
  description: "भारतीय कम्युनिस्ट पार्टी, वाराणसी — श्रमिक पोर्टल",
};

export default function RootLayout({ children }) {
  return (
    <html lang="hi">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
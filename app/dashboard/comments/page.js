import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import db, { initDB } from "@/lib/db";
import CommentsClient from "./CommentsClient";

export default async function CommentsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  await initDB();

  const result = await db.execute(`
    SELECT c.*, p.title as post_title
    FROM comments c
    LEFT JOIN blog_posts p ON c.post_id = p.id
    ORDER BY c.created_at DESC
  `);

  return (
    <>
      <Navbar />
      <CommentsClient comments={result.rows} />
    </>
  );
}
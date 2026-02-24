import Navbar from "@/components/Navbar";
import db, { initDB } from "@/lib/db";
import { redirect } from "next/navigation";
import BlogPostClient from "./BlogPostClient";

export default async function BlogPostPage({ params }) {
  await initDB();
  const { id } = await params;

  const result = await db.execute({
    sql: `SELECT p.*, a.name as author_name FROM blog_posts p LEFT JOIN activists a ON p.author_id = a.id WHERE p.id = ?`,
    args: [id],
  });

  if (result.rows.length === 0) redirect("/blog");

  const comments = await db.execute({
    sql: "SELECT * FROM comments WHERE post_id = ? AND approved = 1 ORDER BY created_at DESC",
    args: [id],
  });

  return (
    <>
      <Navbar />
      <BlogPostClient post={result.rows[0]} comments={comments.rows} />
    </>
  );
}
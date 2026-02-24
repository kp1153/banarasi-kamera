import Navbar from "@/components/Navbar";
import db, { initDB } from "@/lib/db";
import BlogClient from "./BlogClient";

export default async function BlogPage() {
  await initDB();
  const result = await db.execute(`
    SELECT p.*, a.name as author_name
    FROM blog_posts p
    LEFT JOIN activists a ON p.author_id = a.id
    ORDER BY p.created_at DESC
  `);
  return (
    <>
      <Navbar />
      <BlogClient posts={result.rows} />
    </>
  );
}
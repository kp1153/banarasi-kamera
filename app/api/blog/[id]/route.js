import db, { initDB } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    await initDB();
    const { id } = await params;
    const result = await db.execute({
      sql: `SELECT p.*, a.name as author_name FROM blog_posts p LEFT JOIN activists a ON p.author_id = a.id WHERE p.id = ?`,
      args: [id],
    });
    if (result.rows.length === 0) return Response.json({ error: "नहीं मिला" }, { status: 404 });
    const comments = await db.execute({
      sql: "SELECT * FROM comments WHERE post_id = ? AND approved = 1 ORDER BY created_at DESC",
      args: [id],
    });
    return Response.json({ ...result.rows[0], comments: comments.rows });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
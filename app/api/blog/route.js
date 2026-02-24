import db, { initDB } from "@/lib/db";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    await initDB();
    const result = await db.execute(`
      SELECT p.*, a.name as author_name
      FROM blog_posts p
      LEFT JOIN activists a ON p.author_id = a.id
      ORDER BY p.created_at DESC
    `);
    return Response.json(result.rows);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await initDB();
    const session = await getServerSession();
    if (!session) return Response.json({ error: "अनधिकृत" }, { status: 401 });
    const { title, content, video_url, pdf_url } = await req.json();
    await db.execute({
      sql: "INSERT INTO blog_posts (title, content, video_url, pdf_url, author_id) VALUES (?, ?, ?, ?, ?)",
      args: [title, content, video_url || null, pdf_url || null, session.user.id],
    });
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
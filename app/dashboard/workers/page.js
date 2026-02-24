import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import db, { initDB } from "@/lib/db";
import WorkersClient from "./WorkersClient";

export default async function WorkersPage() {
  const session = await getServerSession();
  if (!session) redirect("/login");

  await initDB();

  const result = await db.execute(`
    SELECT w.*, b.name as block_name
    FROM workers w
    LEFT JOIN blocks b ON w.block_id = b.id
    ORDER BY w.created_at DESC
  `);

  const blocks = await db.execute("SELECT * FROM blocks");

  return (
    <>
      <Navbar />
      <WorkersClient workers={result.rows} blocks={blocks.rows} />
    </>
  );
}
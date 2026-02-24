import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import db, { initDB } from "@/lib/db";
import WorkerDetailClient from "./WorkerDetailClient";

export default async function WorkerDetailPage({ params }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  await initDB();
  const { id } = await params;

  const result = await db.execute({
    sql: `SELECT w.*, b.name as block_name FROM workers w LEFT JOIN blocks b ON w.block_id = b.id WHERE w.mobile = ?`,
    args: [id],
  });

  if (result.rows.length === 0) redirect("/dashboard/workers");

  const addictions = await db.execute({
    sql: "SELECT addiction_type FROM worker_addictions WHERE worker_mobile = ?",
    args: [id],
  });

  const blocks = await db.execute("SELECT * FROM blocks");

  return (
    <>
      <Navbar />
      <WorkerDetailClient
        worker={result.rows[0]}
        addictions={addictions.rows.map((a) => a.addiction_type)}
        blocks={blocks.rows}
        role={session.user.role}
      />
    </>
  );
}
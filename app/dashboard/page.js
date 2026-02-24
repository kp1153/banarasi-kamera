import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import db, { initDB } from "@/lib/db";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  await initDB();

  const totalResult = await db.execute("SELECT COUNT(*) as total FROM workers");
  const total = totalResult.rows[0].total;

  const blockResult = await db.execute(`
    SELECT b.name, COUNT(w.mobile) as count
    FROM blocks b
    LEFT JOIN workers w ON w.block_id = b.id
    GROUP BY b.id, b.name
  `);

  const addictionResult = await db.execute(`
    SELECT addiction_type, COUNT(*) as count
    FROM worker_addictions
    GROUP BY addiction_type
  `);

  const migrantResult = await db.execute(
    "SELECT COUNT(*) as total FROM workers WHERE is_migrant = 1"
  );

  return (
    <>
      <Navbar />
      <DashboardClient
        total={total}
        blocks={blockResult.rows}
        addictions={addictionResult.rows}
        migrants={migrantResult.rows[0].total}
        role={session.user.role}
      />
    </>
  );
}
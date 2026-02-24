import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import db, { initDB } from "@/lib/db";
import NewWorkerClient from "./NewWorkerClient";

export default async function NewWorkerPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  await initDB();

  const blocks = await db.execute("SELECT * FROM blocks");

  return (
    <>
      <Navbar />
      <NewWorkerClient
        blocks={blocks.rows}
        activistId={session.user.id}
      />
    </>
  );
}
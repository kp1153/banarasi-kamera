import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import NewBlogClient from "./NewBlogClient";

export default async function NewBlogPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  return (
    <>
      <Navbar />
      <NewBlogClient />
    </>
  );
}
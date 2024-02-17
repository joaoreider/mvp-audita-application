import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import paths from "@/paths";
import HomePage from "./home/home";

export default async function LoginPage() {
  const session = await getServerSession();
  return <HomePage session={session} />;
}

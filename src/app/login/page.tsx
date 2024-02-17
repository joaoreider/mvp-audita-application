import { getServerSession } from "next-auth";
import ClientLogin from "./client-login";
import { redirect } from "next/navigation";
import paths from "@/paths";

export default async function LoginPage() {
  const session = await getServerSession();
  if (session) {
    redirect(paths.home);
  }
  return <ClientLogin />;
}

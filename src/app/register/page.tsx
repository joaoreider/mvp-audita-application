import { getServerSession } from "next-auth";
import ClientRegister from "./client-register";
import { redirect } from "next/navigation";
import paths from "@/paths";

export default async function RegisterPage() {
  const session = await getServerSession();
  if (session) {
    redirect(paths.home);
  }
  return <ClientRegister />;
}

import paths from "@/paths";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// export async function logout() {
//   // Destroy the session
//   cookies().set("session", "");
//   redirect(paths.login);
// }

export async function navigate(path: string) {
  return redirect(path);
}

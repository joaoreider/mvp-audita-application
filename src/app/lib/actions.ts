"use server";

import { createUser } from "@/auth";
import { RegisterData } from "./types";
import { ActionReturn } from "@/auth/types";
import { redirect } from "next/navigation";
import paths from "@/paths";

// export async function authenticate(formData: FormData) {
//   try {
//     await signIn(formData);
//   } catch (error) {
//     throw error;
//   }
// }

export async function register(data: RegisterData): Promise<ActionReturn> {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const result = await createUser(data);
  if (result.error) {
    return result;
  }
  redirect(paths.login);
}

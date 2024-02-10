"use server";

import { createUser } from "@/auth";
import { RegisterData } from "./types";
import { redirect } from "next/navigation";
import paths from "@/paths";

// export async function authenticate(formData: FormData) {
//   try {
//     await signIn(formData);
//   } catch (error) {
//     throw error;
//   }
// }

export async function register(data: RegisterData) {
  const result = await createUser(data);
  if (result) {
    console.log("createUser error", result);
    return result;
  }
  redirect(paths.login);
}

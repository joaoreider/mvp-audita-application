"use server";
import { SignJWT, jwtVerify } from "jose";
import { authenticate, createUser } from "@/auth";
import { RegisterData } from "./types";
import { ActionReturn } from "@/auth/types";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import paths from "@/paths";

const secretKey = process.env.JWT_SECRET;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1 day from now")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function getSession() {
  const session = cookies().get("session")?.value;
  if (!session) {
    redirect(paths.login);
  }
  const data = await decrypt(session);
  if (data.expires < new Date()) {
    redirect(paths.login);
  }
  return data;
}

export async function updateSession(request: NextRequest) {
  console.log("updateSession");
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 60 * 60 * 24 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}

export async function login(email: string, password: string) {
  console.log(secretKey);
  await new Promise((resolve) => setTimeout(resolve, 200));
  const result = await authenticate(email, password);
  if (result.error) {
    return result;
  }

  // Create the session
  const expires = new Date(Date.now() + 60 * 60 * 24 * 1000);
  const session = await encrypt({ data: result.data, expires });

  // Save the session in a cookie
  cookies().set("session", session, { expires, httpOnly: true });

  redirect(paths.home);
}

export async function logout() {
  // Destroy the session
  cookies().set("session", "", { expires: new Date(0) });
  redirect(paths.login);
}

export async function register(data: RegisterData): Promise<ActionReturn> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const result = await createUser(data);
  if (result.error) {
    return result;
  }
  redirect(paths.login);
}

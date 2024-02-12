"use client";
import Navbar from "@/components/navbar";
import { getSession } from "./lib/actions";
import { useEffect, useState } from "react";
import { ClimbingBoxLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import Uploader from "@/components/uploader";
import SubmitButton from "@/components/submit-button";
import { SessionData } from "./lib/types";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<SessionData | null>(null);
  useEffect(() => {
    setLoading(true);
    const fetchSession = async () => {
      try {
        const session = await getSession();
        setSession(session);
        if (!session) {
          router.push("/login");
        }
      } catch (error) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [router]);
  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-screen text-center">
        <ClimbingBoxLoader color="#3B82F6" speedMultiplier={2} />
      </div>
    );
  } else {
    return (
      <main className="flex min-h-screen flex-col items-center m-0">
        <Navbar />
        <div className="w-full sm:w-1/2 md:w-1/3 flex flex-col items-center justify-center rounded-md border m-12 p-2  shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)]">
          <Uploader />
        </div>
        <SubmitButton />
      </main>
    );
  }
}
{
}

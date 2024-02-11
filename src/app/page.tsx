"use client";
import Navbar from "@/components/navbar";
import { getSession } from "./lib/actions";
import { useEffect, useState } from "react";
import { ClimbingBoxLoader } from "react-spinners";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
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
        <ClimbingBoxLoader color="#3B82F6" />
      </div>
    );
  } else {
    return (
      <main className="flex min-h-screen flex-col items-center m-0">
        <Navbar />
        <div className="border m-8 p-4">
          <pre>{JSON.stringify(session, null, 2)}</pre>
        </div>
      </main>
    );
  }
}

"use client";
import Navbar from "@/components/navbar";
import { getSession } from "./lib/actions";
import { useEffect, useState } from "react";
import { ClimbingBoxLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import Uploader from "@/components/uploader";
import SubmitButton from "@/components/submit-button";
import { SessionData } from "./lib/types";
import { v4 as uuidv4 } from "uuid";

const formatDate = (date: Date) => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Os meses começam do 0 em JavaScript
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const min = date.getMinutes().toString().padStart(2, "0");

  return `${day}-${month}-${year}T${hours}:${min}`;
};

export default function Home() {
  const router = useRouter();
  const UPLOAD_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/files/upload";
  // código da análise: data-hora-uuid  (ex: 01/01/2022-12:00|1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed)
  const [analysisCode, setAnalysisCode] = useState<string>(
    formatDate(new Date()) + "|" + uuidv4()
  );

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

  const handleStartAnalysis = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 200));
    console.log("Analisar propostas com código: ", analysisCode);
    setAnalysisCode(formatDate(new Date()) + "|" + uuidv4());
    setLoading(false);
  };

  const handleResetAnalysis = () => {
    setAnalysisCode(formatDate(new Date()) + "|" + uuidv4());
  };

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
          <Uploader
            url={UPLOAD_URL}
            analysisCode={analysisCode}
            resetAnalysis={handleResetAnalysis}
          />
        </div>
        <div className="flex flex-col">
          <SubmitButton
            onClick={handleStartAnalysis}
            className="shadow-xl text-white font-semibold rounded-md px-4  py-6 w-48 m-2"
            text="COMEÇAR ANÁLISE"
          />
        </div>
      </main>
    );
  }
}
{
}

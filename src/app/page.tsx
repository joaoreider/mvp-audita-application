import Navbar from "@/components/navbar";
import { getSession, logout } from "./lib/actions";

export default async function Home() {
  const session = await getSession();

  return (
    <main className="flex min-h-screen flex-col items-center m-0">
      <Navbar />
      <div className="border m-8 p-4">
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </div>
    </main>
  );
}

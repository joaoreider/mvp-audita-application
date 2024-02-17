import Logo from "/home/jp/Documentos/Projects/mvp-audita/mvp-audita-application/public/logo.svg";
import Image from "next/image";
import { navigate } from "@/app/lib/actions";
import { Button } from "./ui/button";
import { useState } from "react";
import { LoadingSpinner } from "./spinner";
import { signOut } from "next-auth/react";
import paths from "@/paths";
export default function Navbar() {
  const [isLoading, setIsLoading] = useState(false);
  const handleLogoutClick = () => {
    setIsLoading(true);
    signOut();
    setIsLoading(false);
  };
  return (
    // border-b rounded-xl
    <nav className="flex justify-between items-center py-6 px-8 w-full ">
      <div className="flex-shrink-0">
        <a href="/">
          <Image src={Logo} width={80} height={80} alt="logo" />
        </a>
      </div>
      <div className="mx-auto">
        <h1 className="mb-4 text-4xl sm:text-3xl md:text-2xl lg:text-1xl font-extrabold leading-none tracking-tight text-gray-900  lg:text-5xl dark:text-white">
          Inovação em{" "}
          <span className="italic underline underline-offset-8 decoration-2 decoration-custom-blue">
            Auditoria
          </span>
        </h1>
      </div>
      <div className="flex-shrink-0">
        <Button onClick={handleLogoutClick} variant={"outline"}>
          {isLoading ? <LoadingSpinner /> : "Sair"}
        </Button>
      </div>
    </nav>
  );
}

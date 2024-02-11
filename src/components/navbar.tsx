import Logo from "/home/jp/Documentos/Projects/mvp-audita/mvp-audita-application/public/logo.svg";
import Image from "next/image";
import { logout } from "@/app/lib/actions";
import { Button } from "./ui/button";
export default function Navbar() {
  return (
    <nav className="flex justify-between items-center py-6 px-8 w-full border-b rounded-xl">
      <div className="flex-shrink-0">
        <a href="/">
          <Image src={Logo} width={80} height={80} alt="logo" />
        </a>
      </div>
      <div className="mx-auto">
        <p className="text-xl text-white ">Transparência e responsabilidade</p>
      </div>
      <div className="flex-shrink-0">
        <form
          action={async () => {
            "use server";
            await logout();
          }}
        >
          <Button type="submit" variant={"secondary"}>
            Sair
          </Button>
        </form>
      </div>
    </nav>
  );
}

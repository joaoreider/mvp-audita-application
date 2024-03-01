"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/spinner";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import Logo from "/home/jp/Documentos/Projects/mvp-audita/mvp-audita-application/public/logo.svg";
import { signIn } from "next-auth/react";
import { navigate } from "../lib/actions";
import paths from "@/paths";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(1, { message: "Senha não pode ser vazia" }),
});

export default function ClientLogin() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const { email, password } = values;
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result?.error) {
      setIsLoading(false);
      toast({
        variant: "destructive",
        description: result.error,
        duration: 2500,
      });
      return;
    }
    if (result?.ok) {
      toast({
        title: "Login efetuado!",
        description: "Redirecionando para a página inicial",
      });
      setIsLoading(false);
      router.push(paths.home);
      router.refresh();
    }
    setIsLoading(false);
  };
  return (
    <div className="flex min-h-screen max-h-screen flex-col items-center justify-center p-24">
      <div className="flex flex-col items-center border rounded-xl px-2">
        <div className="flex w-full flex-col justify-center space-y-6 sm:w-[350px]  p-10 m-auto">
          <div className="flex flex-col space-y-2 text-center items-center">
            <div className="mb-2">
              <Image src={Logo} width={100} height={100} alt="logo" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Entre na sua conta
            </h1>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="max-w-md w-full flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="joao@exemplo.com"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input placeholder="Senha" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <LoadingSpinner /> : "Entrar"}
              </Button>
            </form>
          </Form>
          <div className="flex flex-col space-y-2 text-center items-center mb-10">
            <p className="px-8 text-center text-sm text-muted-foreground">
              ​ Não tem conta?{" "}
              <a
                className="underline underline-offset-4 hover:text-primary text-custom-blue"
                href="/register"
              >
                Cadastre-se
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

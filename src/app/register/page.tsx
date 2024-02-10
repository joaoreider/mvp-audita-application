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
import { register } from "../lib/actions";
import { LoadingSpinner } from "@/components/spinner";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import Logo from "/home/jp/Documentos/Projects/mvp-audita/mvp-audita-application/public/logo.svg";
import { Metadata } from "next";

const formSchema = z
  .object({
    name: z.string().min(1, { message: "Nome não pode ser vazio" }),
    email: z.string().email({ message: "Email inválido" }),
    password: z
      .string()
      .min(5, { message: "Senha deve ter no mínimo 5 caracteres" }),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Senhas não conferem",
    path: ["passwordConfirm"],
  });

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const { passwordConfirm, ...data } = values;
    const result = await register(data);
    setIsLoading(false);
    if (result?.error) {
      if (result.error === "Usuário já cadastrado") {
        form.setError("email", {
          type: "manual",
          message: "Email já cadastrado",
        });
        return;
      } else {
        toast({
          variant: "destructive",
          title: "Algo deu errado.",
          description: "Tente novamente mais tarde.",
        });
        return;
      }
    }
    toast({
      description: "Usuário cadastrado com sucesso",
    });
  };
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col items-center border rounded-xl px-20">
        <div className="flex w-full flex-col justify-center space-y-6 sm:w-[350px]  p-10 m-auto">
          <div className="flex flex-col space-y-2 text-center items-center">
            <div className="mb-2">
              <Image src={Logo} width={50} height={50} alt="logo" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Criar uma conta
            </h1>
            <p className="text-sm text-muted-foreground">
              Preencha os campos abaixo
            </p>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="max-w-md w-full flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="João Paulo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
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
              <FormField
                control={form.control}
                name="passwordConfirm"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Confirme a senha</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Confirme a senha"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <LoadingSpinner /> : "Cadastrar"}
              </Button>
            </form>
          </Form>
          <div className="flex flex-col space-y-2 text-center items-center mb-10">
            <p className="px-8 text-center text-sm text-muted-foreground">
              ​ Já possui uma conta?{" "}
              <a
                className="underline underline-offset-4 hover:text-primary text-custom-blue"
                href="/login"
              >
                Entrar
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

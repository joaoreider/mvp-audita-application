import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider, signOut } from "next-auth/react";
import { getServerSession } from "next-auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Logout from "./api/auth/logout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Audita",
  description: "Audita - Auditoria de licitações públicas",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}

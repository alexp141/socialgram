import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex justify-center items-center min-h-screen bg-[url(/background.jpg)] bg-cover bg-bottom`}
    >
      {children}
    </div>
  );
}

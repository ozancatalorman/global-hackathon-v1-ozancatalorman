"use client";

import Header from "@/components/header";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/components/lib/authentication/auth";
import { useEffect, useState } from "react";

export default function Home() {
  const { isLoggedIn } = useAuth();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const href = mounted && isLoggedIn ? "/dashboard" : "/login";
  const hoverText =
    mounted && isLoggedIn
      ? "Go To Your Dashboard"
      : "Log-in and Start Storming";

  return (
    <div className="min-h-screen text-white bg-black">
      <Header />

      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4">
        <h1 className="mb-10 text-2xl md:text-3xl font-semibold text-center bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-x">
          Welcome to Storma
        </h1>

        <p className="mb-10 text-xl md:text-xl text-center bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-x">
          You bring the idea, we’ll bring the dream team full of agents.
        </p>

        <Link
          href={href}
          className="relative transition-transform group hover:scale-105"
        >
          <div className="relative w-48 h-48 overflow-hidden rounded-full md:w-64 md:h-64">
            <Image
              src="/main-brain.png"
              alt="AI Brain Core"
              fill
              priority
              className="object-cover scale-125"
            />
          </div>

          {/* Hover overlay */}
          {mounted && (
            <div className="absolute inset-0 flex items-center justify-center transition opacity-0 group-hover:opacity-100">
              <span
                className="px-4 py-1 text-sm text-white border rounded-full bg-black/60 backdrop-blur-md border-white/10"
                suppressHydrationWarning
              >
                {hoverText}
              </span>
            </div>
          )}
        </Link>
      </main>
    </div>
  );
}

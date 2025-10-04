"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import { useAuth } from "@/components/lib/authentication/auth";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <>
      <Header />
      <main className="mx-auto flex min-h-[calc(100vh-56px)] max-w-sm items-center justify-center px-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const ok = login(email, password);
            if (ok) router.push("/");
            else setError("Invalid credentials");
          }}
          className="w-full space-y-4 rounded-2xl border border-white/10 bg-neutral-950 p-6"
        >
          <h1 className="text-xl font-medium">Log in</h1>

          <div className="space-y-2">
            <label className="text-sm text-white/70" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-lg border border-white/10 bg-neutral-900 p-3 text-sm outline-none focus:ring-2 focus:ring-white/20"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white/70" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded-lg border border-white/10 bg-neutral-900 p-3 text-sm outline-none focus:ring-2 focus:ring-white/20"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            className="mt-2 w-full rounded-lg bg-white px-3 py-2 text-sm font-medium text-black hover:bg-white/90"
          >
            Continue
          </button>

          <p className="pt-2 text-center text-xs text-white/50">
            Uses <code>NEXT_PUBLIC_LOGIN_EMAIL</code> &{" "}
            <code>NEXT_PUBLIC_LOGIN_PASSWORD</code>.
          </p>
        </form>
      </main>
    </>
  );
}
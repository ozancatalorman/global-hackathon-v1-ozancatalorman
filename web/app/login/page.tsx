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
          className="w-full p-6 space-y-4 border rounded-2xl border-white/10 bg-neutral-950"
        >
          <h1 className="text-xl font-medium">Log in</h1>

          <div className="space-y-2">
            <label className="text-sm text-white/70" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full p-3 text-sm border rounded-lg outline-none border-white/10 bg-neutral-900 focus:ring-2 focus:ring-white/20"
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
              className="w-full p-3 text-sm border rounded-lg outline-none border-white/10 bg-neutral-900 focus:ring-2 focus:ring-white/20"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            className="w-full px-3 py-2 mt-2 text-sm font-medium text-black bg-white rounded-lg hover:bg-white/90"
          >
            Continue
          </button>

          <p className="pt-2 text-xs text-center text-white/50">
            Uses <code>NEXT_PUBLIC_LOGIN_EMAIL</code> &{" "}
            <code>NEXT_PUBLIC_LOGIN_PASSWORD</code>.
          </p>
        </form>
      </main>
    </>
  );
}

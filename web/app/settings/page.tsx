"use client";

import Header from "@/components/header";

export default function SettingsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto flex min-h-[calc(100vh-56px)] max-w-2xl flex-col gap-6 px-6 py-10">
        <section className="p-6 border rounded-2xl border-white/10 bg-neutral-950">
          <h1 className="text-xl font-medium">Settings</h1>
          <p className="mt-3 text-white/70">
            Pretty much nothing for the Demo version :D
          </p>
        </section>
      </main>
    </>
  );
}

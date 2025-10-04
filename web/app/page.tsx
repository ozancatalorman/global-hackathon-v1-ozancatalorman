// web/app/page.tsx
"use client";

import Header from "@/components/header";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex items-center justify-center h-[calc(100vh-64px)]">
        <main className="flex flex-col items-center justify-center h-[calc(100vh-64px)] space-y-4">
          <h1 className="text-3xl font-bold text-blue-400">
            Welcome to Storma ⚡︎
          </h1>
        </main>
      </main>
    </div>
  );
}

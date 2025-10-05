"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { ChevronDown, X, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/components/lib/authentication/auth";

export default function Header({
  onCreateProject = () => {},
}: {
  onCreateProject?: () => void;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();

  const pathname = usePathname();
  const hideGuide = pathname?.startsWith("/dashboard");

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-neutral-950/70 backdrop-blur">
        <div className="flex items-center justify-between px-8 mx-auto h-14 max-w-8xl">
          {/* Hamburger / Guide — only when logged in */}
          {mounted && isLoggedIn && !hideGuide ? (
            <button
              aria-label="Guide"
              onClick={() => setSidebarOpen((v) => !v)}
              className="relative grid border rounded-full group size-9 place-items-center border-white/10 bg-neutral-900/70 hover:bg-neutral-800"
            >
              <span className="sr-only">Toggle Guide</span>
              <div className="flex flex-col items-center gap-[5px]">
                <span className="h-[2px] w-5 rounded bg-white/85 transition group-hover:w-6" />
                <span className="h-[2px] w-5 rounded bg-white/70 transition group-hover:w-6" />
                <span className="h-[2px] w-5 rounded bg-white/85 transition group-hover:w-6" />
              </div>
            </button>
          ) : (
            <div className="size-9" /> 
          )}

          {/* Center brand: logo + wordmark from /public */}
          <div className="absolute -translate-x-1/2 left-1/2">
            <Link
              href="/"
              className="flex items-center gap-0 transition-opacity hover:opacity-90"
            >
              {/* Logo */}
              <Image
                src="/main-brain-wb.png"
                alt="Storma logo"
                width={42}
                height={42}
                className="object-contain drop-shadow-[0_0_16px_rgba(56,189,248,0.25)] shrink-0"
                priority
              />
              {/* negative margin to tighten spacing, could not find any other solution lol */}
              <div className="-ml-[16px]">
                <Image
                  src="/storma_text.png"
                  alt="storma"
                  width={110}
                  height={43}
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Profile menu */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-neutral-900/70 px-2 py-1 pr-2.5 hover:bg-neutral-800"
            >
              <div className="rounded-full size-6 bg-gradient-to-br from-sky-400 to-fuchsia-500" />
              <ChevronDown size={16} className="opacity-70" />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 overflow-hidden border shadow-xl w-44 rounded-xl border-white/10 bg-neutral-900/95 backdrop-blur"
                >
                  
                  {!isLoggedIn ? (
                    <>
                      <MenuItem
                        label="Log-in"
                        href="/login"
                        onAfter={() => setProfileOpen(false)}
                      />
                      <MenuItem
                        label="Settings"
                        href="/settings"
                        onAfter={() => setProfileOpen(false)}
                      />
                    </>
                  ) : (
                    <>
                      <MenuItem
                        label="Settings"
                        href="/settings"
                        onAfter={() => setProfileOpen(false)}
                      />
                      <MenuItem
                        label="Log out"
                        onClick={() => {
                          logout();
                          setProfileOpen(false);
                          // close sidebar if open
                          setSidebarOpen(false);
                          router.push("/");
                        }}
                      />
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* SIDEBAR (Guide) — only when logged in */}
      <AnimatePresence>
        {isLoggedIn && sidebarOpen && (
          <>
            {/* Backdrop toggles closed on click */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />

            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="fixed left-0 top-0 z-50 h-full w-[320px] border-r border-white/10 bg-neutral-950/95 backdrop-blur"
            >
              <div className="flex items-center justify-between px-2 py-3">
                <div className="flex items-center px-4 py-3">
                  <span
                    className="text-[25px] font-semibold text-blue-500 tracking-tight select-none drop-shadow-[0_0_6px_rgba(56,189,248,0.4)]"
                    style={{ fontFamily: "var(--font-brand)" }}
                  >
                    Storma
                  </span>
                </div>

                <button
                  onClick={() => setSidebarOpen(false)}
                  className="rounded-md p-1.5 hover:bg-white/10 -ml-[10px]"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>

              <div className="px-4">
                <Link
                  href="/dashboard"
                  onClick={() => setSidebarOpen(false)}
                  className="inline-flex items-center justify-center w-full gap-2 px-3 py-2 mt-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-500"
                >
                  Go To Your Dashboard
                </Link>

                <p className="mt-4 text-xs text-white/50">
                  Start a fresh storm from your dashboard or pick up where you
                  left with an existing one.
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function MenuItem({
  label,
  href,
  onClick,
  onAfter,
}: {
  label: string;
  href?: string;
  onClick?: () => void;
  onAfter?: () => void;
}) {
  const className =
    "flex items-center w-full gap-2 px-3 py-2 text-sm text-left hover:bg-white/10";

  if (href) {
    return (
      <Link href={href} className={className} onClick={onAfter}>
        {label}
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={() => {
        onClick?.();
        onAfter?.();
      }}
      className={className}
    >
      {label}
    </button>
  );
}

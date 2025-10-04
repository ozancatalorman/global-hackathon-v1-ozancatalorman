// web/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import { useAuth } from "@/components/lib/authentication/auth";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";

const PROJECTS_KEY = "storma_projects";

type Project = {
  id: string;
  name: string;
  summary: string;
  createdAt: number;
};

export default function DashboardPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) router.replace("/login");
  }, [isLoggedIn, router]);

  const [projects, setProjects] = useState<Project[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [summary, setSummary] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(PROJECTS_KEY);
    if (!raw) return;
    try {
      setProjects(JSON.parse(raw) as Project[]);
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  }, [projects]);

  const hasProjects = projects.length > 0;

  function handleCreate() {
    const trimmedName = name.trim();
    const trimmedSummary = summary.trim();
    if (!trimmedName || !trimmedSummary) return;

    const newProject: Project = {
      id: crypto.randomUUID(),
      name: trimmedName,
      summary: trimmedSummary,
      createdAt: Date.now(),
    };
    setProjects((p) => [newProject, ...p]);
    setModalOpen(false);
    setName("");
    setSummary("");
    // router.push(`/projects/${newProject.id}`)
  }

  const openModalFromHeader = () => setModalOpen(true);

  const gradientText =
    "bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-x";

  return (
    <div className="min-h-screen bg-black text-neutral-100">
      <Header onCreateProject={openModalFromHeader} />

      <main className="max-w-6xl px-4 pt-10 pb-24 mx-auto">
        {/* Left header with animated gradient */}
        <div className="mb-8">
          <h1 className={`text-2xl md:text-3xl font-semibold ${gradientText}`}>
            Your Storms
          </h1>
          <p className={`mt-2 text-base md:text-lg ${gradientText}`}>
            Spin up a project and let the dream team go to work.
          </p>
        </div>

        {/* Projects / Empty state */}
        {hasProjects ? (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <button
                key={p.id}
                className="relative p-4 text-left transition border group rounded-2xl border-white/10 bg-neutral-900/60 hover:border-white/20 hover:bg-neutral-900/80"
                onClick={() => {
                  // router.push(`/projects/${p.id}`)
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white">{p.name}</h3>
                  <span className="text-[10px] text-white/50">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm line-clamp-3 text-white/70">{p.summary}</p>
                <div className="absolute inset-0 transition opacity-0 pointer-events-none rounded-2xl group-hover:opacity-20 bg-gradient-to-br from-blue-500 to-transparent" />
              </button>
            ))}
          </section>
        ) : (
          <EmptyState onNew={() => setModalOpen(true)} />
        )}
      </main>

      {/* Centered modal */}
      <CreateProjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        name={name}
        summary={summary}
        setName={setName}
        setSummary={setSummary}
        onCreate={handleCreate}
      />
    </div>
  );
}

/* ---------- Components ---------- */

function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/10 rounded-2xl bg-neutral-900/40">
      <p className="mb-4 text-white/70">No storms yet.</p>
      <button
        onClick={onNew}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-400"
      >
        <Plus size={16} />
        New Storm
      </button>
      <p className="mt-3 text-xs text-white/50">
        We’ll ask for a project name and a short idea summary.
      </p>
    </div>
  );
}

function CreateProjectModal({
  open,
  onClose,
  name,
  summary,
  setName,
  setSummary,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  name: string;
  summary: string;
  setName: (v: string) => void;
  setSummary: (v: string) => void;
  onCreate: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Grid wrapper to center perfectly */}
          <div className="fixed inset-0 z-50 grid pointer-events-none place-items-center">
            <motion.div
              className="pointer-events-auto w-[90%] max-w-md overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 p-4 shadow-2xl"
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">New Storm</h4>
                <button
                  onClick={onClose}
                  className="rounded-md p-1.5 hover:bg-white/10"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-4 space-y-3">
                <label className="block text-sm">
                  Project Name
                  <input
                    className="w-full px-3 py-2 mt-1 border rounded-lg outline-none border-white/10 bg-neutral-900 focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Storma GTM"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>

                <label className="block text-sm">
                  Idea Summary
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 mt-1 border rounded-lg outline-none border-white/10 bg-neutral-900 focus:ring-2 focus:ring-blue-500"
                    placeholder="One or two sentences about the idea…"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                  />
                </label>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={onClose}
                  className="px-3 py-2 text-sm border rounded-lg border-white/10 bg-neutral-900 hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  onClick={onCreate}
                  className="px-3 py-2 text-sm font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-400"
                >
                  Create
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
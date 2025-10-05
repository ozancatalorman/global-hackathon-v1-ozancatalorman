"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import { useAuth } from "@/components/lib/authentication/auth";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Edit2, Trash2 } from "lucide-react";

const PROJECTS_KEY = "storma:demo:projects:v1";

type Project = {
  id: string;
  name: string;
  idea: string;
  createdAt: number;
};

export default function DashboardPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) router.replace("/login");
  }, [isLoggedIn, router]);

  const [projects, setProjects] = useState<Project[]>([]);
  const [initialized, setInitialized] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [idea, setIdea] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROJECTS_KEY);
      if (raw) setProjects(JSON.parse(raw));
    } catch {}
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) return;
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  }, [initialized, projects]);

  const gradientText =
    "bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-x";

  function openCreate() {
    setName("");
    setIdea("");
    setCreateOpen(true);
  }
  function handleCreate() {
    const n = name.trim();
    const i = idea.trim();
    if (!n || !i) return;

    const newProject: Project = {
      id: crypto.randomUUID(),
      name: n,
      idea: i,
      createdAt: Date.now(),
    };
    const next = [newProject, ...projects];
    setProjects(next);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(next));
    setCreateOpen(false);

    router.push(`/projects/${newProject.id}`);
  }

  function openEdit(p: Project) {
    setEditingId(p.id);
    setEditName(p.name);
    setEditOpen(true);
  }
  function saveEdit() {
    if (!editingId) return;
    const n = editName.trim();
    if (!n) return;
    const next = projects.map((p) =>
      p.id === editingId ? { ...p, name: n } : p
    );
    setProjects(next);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(next));
    setEditOpen(false);
  }

  function removeProject(id: string) {
    if (
      !confirm(
        "Are you sure you want to delete this project and its local chats?"
      )
    )
      return;
    const next = projects.filter((p) => p.id !== id);
    setProjects(next);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(next));
    ["core", "finance", "sales", "tech"].forEach((agent) =>
      localStorage.removeItem(`storma:${id}:${agent}:history`)
    );
  }

  return (
    <div className="min-h-screen bg-black text-neutral-100">
      <Header onCreateProject={openCreate} />

      <main className="max-w-6xl px-4 pt-10 pb-24 mx-auto">
        {/* header row with right-aligned New button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className={`text-2xl md:text-3xl font-semibold ${gradientText}`}
            >
              Your Storms
            </h1>
            <p className={`mt-2 text-base md:text-lg ${gradientText}`}>
              Spin up a project and let the dream team go to work.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-400"
          >
            <Plus size={16} />
            New Storm
          </button>
        </div>

        {/* 3-up card grid; whole card navigates; controls stop propagation */}
        {projects.length ? (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <div
                key={p.id}
                role="button"
                tabIndex={0}
                onClick={() => router.push(`/projects/${p.id}`)}
                onKeyDown={(e) =>
                  e.key === "Enter" && router.push(`/projects/${p.id}`)
                }
                className="relative p-4 text-left transition border cursor-pointer rounded-2xl border-white/10 bg-neutral-900/60 hover:border-white/20 hover:bg-neutral-900/80"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white">{p.name}</h3>
                </div>
                <p className="text-sm line-clamp-3 text-white/70">{p.idea}</p>

                <div className="absolute flex gap-2 top-3 right-3">
                  <button
                    className="rounded-md p-1.5 hover:bg-white/10"
                    aria-label="Edit name"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEdit(p);
                    }}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="rounded-md p-1.5 hover:bg-white/10"
                    aria-label="Delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeProject(p.id);
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </section>
        ) : (
          <EmptyState onNew={openCreate} />
        )}
      </main>

      {/* CREATE modal (name + idea) */}
      <ProjectCreateModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        name={name}
        idea={idea}
        setName={setName}
        setIdea={setIdea}
        onCreate={handleCreate}
      />

      {/* EDIT modal (name only) */}
      <NameEditModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        name={editName}
        setName={setEditName}
        onSave={saveEdit}
      />
    </div>
  );
}

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
        We’ll ask for a project name and the core idea.
      </p>
    </div>
  );
}

/* ---------- Modals ---------- */
function ProjectCreateModal({
  open,
  onClose,
  name,
  idea,
  setName,
  setIdea,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  name: string;
  idea: string;
  setName: (v: string) => void;
  setIdea: (v: string) => void;
  onCreate: () => void;
}) {
  const disabled = !name.trim() || !idea.trim();
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
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
                  Core Idea
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 mt-1 border rounded-lg outline-none border-white/10 bg-neutral-900 focus:ring-2 focus:ring-blue-500"
                    placeholder="One or two sentences about the idea…"
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
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
                  disabled={disabled}
                  className={`px-3 py-2 text-sm font-medium rounded-lg ${
                    disabled
                      ? "bg-white/10 text-white/50 cursor-not-allowed"
                      : "text-white bg-indigo-500 hover:bg-indigo-400"
                  }`}
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

function NameEditModal({
  open,
  onClose,
  name,
  setName,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  name: string;
  setName: (v: string) => void;
  onSave: () => void;
}) {
  const disabled = !name.trim();
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 grid pointer-events-none place-items-center">
            <motion.div
              className="pointer-events-auto w-[90%] max-w-md overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 p-4 shadow-2xl"
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Rename Project</h4>
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
                  Name
                  <input
                    className="w-full px-3 py-2 mt-1 border rounded-lg outline-none border-white/10 bg-neutral-900 focus:ring-2 focus:ring-blue-500"
                    placeholder="Project name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                  onClick={onSave}
                  disabled={disabled}
                  className={`px-3 py-2 text-sm font-medium rounded-lg ${
                    disabled
                      ? "bg-white/10 text-white/50 cursor-not-allowed"
                      : "text-white bg-indigo-500 hover:bg-indigo-400"
                  }`}
                >
                  Save
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/header";
import { X, Maximize2, Minimize2, Sparkles } from "lucide-react";

type Role = "user" | "assistant";
type Msg = { role: Role; content: string };
type AgentId = "core" | "finance" | "sales" | "tech";

type Prompts = { finance: string; sales: string; tech: string };
type Raw = { finance: string; sales: string; tech: string };

const USER_NS = "demo";
const PROJECTS_KEY = `storma:${USER_NS}:projects:v1`;
const histKey = (pid: string, agent: AgentId) =>
  `storma:${pid}:${agent}:history`;

/* ---------- storage helpers ---------- */
function loadProjects() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(PROJECTS_KEY) || "[]");
  } catch {
    return [];
  }
}
function saveProjects(list: any[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(list));
  }
}
function loadHistory(projectId: string, agent: AgentId): Msg[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(histKey(projectId, agent)) || "[]");
  } catch {
    return [];
  }
}
function saveHistory(projectId: string, agent: AgentId, arr: Msg[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(histKey(projectId, agent), JSON.stringify(arr));
  }
}

function loadPrompts(pid: string) {
  try {
    return JSON.parse(localStorage.getItem(`storma:${pid}:prompts`) || "{}");
  } catch {
    return {};
  }
}

/* ---------- notifications ---------- */
function Toast({ text, show }: { text: string; show: boolean }) {
  return (
    <div
      className={[
        "fixed z-[60] top-4 right-4 transition-all duration-200",
        show
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-2 pointer-events-none",
      ].join(" ")}
    >
      <div className="px-4 py-2 text-sm border rounded-lg shadow-lg border-white/10 bg-neutral-900/90 backdrop-blur">
        {text}
      </div>
    </div>
  );
}

/* ---------- chat sidebar ---------- */
function Drawer({
  open,
  onClose,
  full,
  onToggleFull,
  agent,
  title,
  history,
  input,
  setInput,
  onSend,
  placeholder,
}: {
  open: boolean;
  onClose: () => void;
  full: boolean;
  onToggleFull: () => void;
  agent: AgentId;
  title: string;
  history: Msg[];
  input: string;
  setInput: (v: string) => void;
  onSend: () => void;
  placeholder: string;
}) {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />
      <aside
        className={[
          "fixed z-50 top-0 h-full bg-neutral-950 border-l border-white/10 backdrop-blur",
          full ? "right-0 w-full" : "right-0 w-[40vw] min-w-[340px]",
        ].join(" ")}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[11px] rounded-full bg-white/5 border border-white/10">
              {agent.toUpperCase()}
            </span>
            <span className="font-medium">{title}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleFull}
              className="rounded p-1.5 hover:bg-white/10"
            >
              {full ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button
              onClick={onClose}
              className="rounded p-1.5 hover:bg-white/10"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="flex flex-col h-[calc(100vh-48px)]">
          <div className="flex-1 p-4 overflow-auto">
            {history.length === 0 ? (
              <p className="text-white/50">No messages yet.</p>
            ) : (
              <div className="space-y-4">
                {history.map((m, i) => (
                  <div key={i} className="leading-relaxed">
                    <div className="mb-1 text-xs tracking-wide uppercase text-white/40">
                      {m.role === "user" ? "You" : agent}
                    </div>
                    <div className="prose prose-invert max-w-none text-[15px] leading-relaxed">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: (p) => (
                            <h3
                              className="mt-4 mb-2 text-base font-semibold"
                              {...p}
                            />
                          ),
                          h2: (p) => (
                            <h3
                              className="mt-4 mb-2 text-base font-semibold"
                              {...p}
                            />
                          ),
                          h3: (p) => (
                            <h4
                              className="mt-4 mb-2 text-sm font-semibold"
                              {...p}
                            />
                          ),
                          ul: (p) => (
                            <ul
                              className="my-2 ml-5 space-y-1 list-disc"
                              {...p}
                            />
                          ),
                          ol: (p) => (
                            <ol
                              className="my-2 ml-5 space-y-1 list-decimal"
                              {...p}
                            />
                          ),
                          li: (p) => <li className="[&>p]:m-0" {...p} />,
                          p: (p) => <p className="my-2" {...p} />,
                          code: (p) => (
                            <code
                              className="px-1 py-0.5 rounded bg-white/10"
                              {...p}
                            />
                          ),
                          pre: (p) => (
                            <pre
                              className="p-3 overflow-auto rounded bg-white/10"
                              {...p}
                            />
                          ),
                          table: (p) => (
                            <table
                              className="my-3 border border-collapse border-white/10"
                              {...p}
                            />
                          ),
                          th: (p) => (
                            <th
                              className="px-2 py-1 border border-white/10"
                              {...p}
                            />
                          ),
                          td: (p) => (
                            <td
                              className="px-2 py-1 border border-white/10"
                              {...p}
                            />
                          ),
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 p-3 border-t border-white/10">
            <input
              className="flex-1 px-3 py-2 border rounded bg-neutral-900 border-white/10"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              onKeyDown={(e) => (e.key === "Enter" ? onSend() : null)}
            />
            <button
              onClick={onSend}
              className="px-3 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-500"
            >
              Send
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

/* ---------- project Page ---------- */
export default function ProjectPage() {
  const params = useParams<{ id: string }>();
  const projectId = params?.id ?? "unknown";
  const router = useRouter();

  const [projects, setProjects] = useState<any[]>([]);

  const [toast, setToast] = useState<{ text: string; show: boolean }>({
    text: "",
    show: false,
  });
  const showToast = (text: string, ms = 2200) => {
    setToast({ text, show: true });
    window.setTimeout(() => setToast({ text: "", show: false }), ms);
  };

  const [loaded, setLoaded] = useState(false); // <- wait for localStorage

  const project = useMemo(
    () => projects.find((p: any) => p.id === projectId),
    [projects, projectId]
  );

  useEffect(() => {
    setProjects(loadProjects());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    if (!project) router.replace("/dashboard");
  }, [loaded, project, router]);

  const [ceoPreview, setCeoPreview] = useState<string>("");

  useEffect(() => {
    try {
      const s = localStorage.getItem(`storma:${projectId}:ceo_preview`);
      if (s) setCeoPreview(JSON.parse(s));
    } catch {}
  }, [projectId]);

  const [core, setCore] = useState<Msg[]>([]);
  const [finance, setFinance] = useState<Msg[]>([]);
  const [sales, setSales] = useState<Msg[]>([]);
  const [tech, setTech] = useState<Msg[]>([]);

  // hydrate chat histories after load
  useEffect(() => {
    if (!loaded) return;
    setCore(loadHistory(projectId, "core"));
    setFinance(loadHistory(projectId, "finance"));
    setSales(loadHistory(projectId, "sales"));
    setTech(loadHistory(projectId, "tech"));
  }, [loaded, projectId]);

  // first visit → generate overview from stored idea
  useEffect(() => {
    if (!loaded || !project) return;
    if (core.length === 0 && project.idea?.trim()) {
      runOrchestrate(project.idea.trim(), { appendUserToCore: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, project?.id]);

  // inputs
  const [drawer, setDrawer] = useState<AgentId | null>(null);
  const [drawerFull, setDrawerFull] = useState(false);
  const [agentInput, setAgentInput] = useState("");

  // edit root idea modal
  const [rootModal, setRootModal] = useState(false);
  const [rootDraft, setRootDraft] = useState("");

  const openDrawer = (id: AgentId) => {
    setDrawer(id);
    setDrawerFull(false);
    setAgentInput("");
  };

  const setHistory = (id: AgentId, arr: Msg[]) => {
    if (id === "core") setCore(arr);
    if (id === "finance") setFinance(arr);
    if (id === "sales") setSales(arr);
    if (id === "tech") setTech(arr);
    saveHistory(projectId, id, arr);
  };

  /** Orchestrate (CEO) → generate prompts → run specialists, append to histories. */
  async function runOrchestrate(
    text: string,
    opts: { appendUserToCore?: boolean } = {}
  ) {
    const idea = text.trim();
    if (!idea) return;

    showToast("Generating…");

    if (opts.appendUserToCore) {
      setHistory("core", [...core, { role: "user", content: idea }]);
    }

    const recentCoreInputs = core
      .filter((m) => m.role === "user")
      .slice(-2) // last two user messages
      .map((m) => m.content);

    const res = await fetch("/api/agents/orchestrate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        projectId,
        idea,
        userInputs: recentCoreInputs, // << add this
        histories: { finance, sales, tech },
      }),
    });

    const json: {
      prompts: Prompts;
      raw: Raw;
      summary?: { comments?: { ceo?: string } };
    } = await res.json();

    if (json?.raw?.finance) {
      setHistory("finance", [
        ...finance,
        { role: "assistant", content: json.raw.finance },
      ]);
    }
    if (json?.raw?.sales) {
      setHistory("sales", [
        ...sales,
        { role: "assistant", content: json.raw.sales },
      ]);
    }
    if (json?.raw?.tech) {
      setHistory("tech", [
        ...tech,
        { role: "assistant", content: json.raw.tech },
      ]);
    }

    if (json?.summary?.comments?.ceo) {
      setHistory("core", [
        ...loadHistory(projectId, "core"),
        { role: "assistant", content: json.summary.comments.ceo },
      ]);
    }

    (window as any).__stormaTest = json;

    localStorage.setItem(
      `storma:${projectId}:prompts`,
      JSON.stringify(json.prompts)
    );

    if (json?.summary?.comments?.ceo) {
      setHistory("core", [
        ...loadHistory(projectId, "core"),
        { role: "assistant", content: json.summary.comments.ceo },
      ]);

      // store preview for the panel
      localStorage.setItem(
        `storma:${projectId}:ceo_preview`,
        JSON.stringify(json.summary.comments.ceo)
      );
    }

    showToast("Done! You can view and chat with models by clicking.");
  }

  // per-agent chat (only specialists hit /api/agents/chat)
  async function sendTo(agent: AgentId) {
    if (agent === "core") {
      const q = agentInput.trim();
      if (!q) return;
      await runOrchestrate(q, { appendUserToCore: true });
      setAgentInput("");
      return;
    }

    const input = agentInput.trim();
    if (!input) return;

    const current =
      agent === "finance" ? finance : agent === "sales" ? sales : tech;
    const next = [...current, { role: "user" as Role, content: input }];
    setHistory(agent, next);

    const prompts = loadPrompts(projectId);
    const corePrompt = (prompts as any)?.[agent] || "";
    const lastCore = core.length ? core[core.length - 1].content : "";
    const projectIdea = project?.idea || "";

    const res = await fetch("/api/agents/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        agentId: agent,
        corePrompt, // from Core
        history: next, // full per-agent transcript
        projectIdea, // context
        coreOverview: lastCore, // latest CEO comment
      }),
    });
    const data = await res.json();

    if (data?.text) {
      const final = [
        ...next,
        { role: "assistant" as Role, content: data.text },
      ];
      setHistory(agent, final);
      setAgentInput("");
    }
  }

  function renameProject() {
    if (!project) return;
    const val = prompt("Rename project", project.name);
    if (!val || !val.trim()) return;
    const next = projects.map((p) =>
      p.id === project.id ? { ...p, name: val.trim() } : p
    );
    setProjects(next);
    saveProjects(next);
  }

  function saveRootIdea() {
    const txt = rootDraft.trim();
    if (!txt || !project) return;

    const nextList = projects.map((p) =>
      p.id === project.id ? { ...p, idea: txt } : p
    );
    setProjects(nextList);
    saveProjects(nextList);

    runOrchestrate(txt, { appendUserToCore: false });
    setRootModal(false);
  }

  if (!loaded || !project) {
    return (
      <div className="min-h-screen bg-black text-neutral-100">
        <Header onCreateProject={() => router.push("/dashboard")} />
        <Toast text={toast.text} show={toast.show} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-neutral-100">
      <Header onCreateProject={() => router.push("/dashboard")} />

      <Toast text={toast.text} show={toast.show} />

      <main className="px-6 pt-8 pb-20 mx-auto max-w-7xl">
        {/* Title & rename */}
        <div>
          <h1 className="text-2xl font-semibold text-transparent md:text-3xl bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 bg-clip-text">
            {project.name}
          </h1>
          <div className="mt-2">
            <button
              onClick={renameProject}
              className="px-2 py-1 text-xs border rounded border-white/10 hover:bg-white/10"
            >
              Edit name
            </button>
          </div>
        </div>

        {/* Agent board */}
        <section className="relative p-6 mt-6 border rounded-2xl border-white/10 bg-neutral-950/70 md:p-8">
          {/* Root of the storm (edit idea) */}
          <button
            onClick={() => {
              setRootDraft(project.idea || "");
              setRootModal(true);
            }}
            className="absolute top-4 right-4 inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-sm bg-neutral-900/70 hover:bg-neutral-800"
          >
            <Sparkles size={14} />
            Root of the storm
          </button>

          <div className="relative max-w-5xl mx-auto">
            {/* MAIN NODE */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => openDrawer("core")}
                className="grid place-items-center size-24 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 shadow-[0_0_30px_rgba(59,130,246,0.35)]"
                aria-label="Open CEO chat"
              />
              <div className="mt-2 text-sm opacity-85">Dream Team CEO</div>

              {/* CEO output panel — bigger & scrollable */}
              {ceoPreview ? (
                <div className="w-full p-3 mt-4 overflow-auto text-sm border rounded-lg border-white/10 bg-neutral-900/70 max-h-72">
                  <div className="prose prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {ceoPreview}
                    </ReactMarkdown>
                  </div>
                </div>
              ) : (
                <div className="w-full p-3 mt-4 text-sm border rounded-lg text-white/60 border-white/10 bg-neutral-900/40">
                  Generating the overview… you can open any agent chat while it
                  runs.
                </div>
              )}
            </div>

            {/* Connectors */}
            <svg
              className="absolute left-0 right-0 w-full h-56 mx-auto pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              style={{ top: "112px" }}
            >
              <defs>
                <linearGradient
                  id="g"
                  x1="0"
                  y1="0"
                  x2="100"
                  y2="0"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#a78bfa" />
                  <stop offset="0.5" stopColor="#60a5fa" />
                  <stop offset="1" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
              {/* main circle center (50,10) → card centers (20,92) (50,92) (80,92) */}
              <line
                x1="50"
                y1="10"
                x2="20"
                y2="92"
                stroke="url(#g)"
                strokeWidth="1.2"
                strokeOpacity="0.45"
              />
              <line
                x1="50"
                y1="10"
                x2="50"
                y2="92"
                stroke="url(#g)"
                strokeWidth="1.2"
                strokeOpacity="0.45"
              />
              <line
                x1="50"
                y1="10"
                x2="80"
                y2="92"
                stroke="url(#g)"
                strokeWidth="1.2"
                strokeOpacity="0.45"
              />
            </svg>

            {/* Agent cards */}
            <div className="grid grid-cols-1 gap-4 mt-20 md:grid-cols-3">
              {(
                [
                  {
                    id: "finance",
                    label: "Finance Team",
                    color: "from-blue-400 to-cyan-400",
                  },
                  {
                    id: "sales",
                    label: "Sales/Marketing Team",
                    color: "from-fuchsia-400 to-purple-400",
                  },
                  {
                    id: "tech",
                    label: "Tech Team",
                    color: "from-emerald-400 to-cyan-400",
                  },
                ] as { id: AgentId; label: string; color: string }[]
              ).map((a) => (
                <button
                  key={a.id}
                  onClick={() => openDrawer(a.id)}
                  className="p-5 text-left transition border group rounded-2xl border-white/10 bg-neutral-900/60 hover:bg-neutral-900/80"
                >
                  <div className="grid place-items-center">
                    <div
                      className={`size-14 rounded-full bg-gradient-to-br ${a.color}`}
                    />
                  </div>
                  <div className="mt-3 text-sm font-medium text-center">
                    {a.label}
                  </div>
                  <div className="mt-1 text-xs text-center text-white/60">
                    Click to open the team chat
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Drawer (core is interactive; specialists hit /api/agents/chat) */}
      <Drawer
        open={drawer !== null}
        onClose={() => setDrawer(null)}
        full={drawerFull}
        onToggleFull={() => setDrawerFull((v) => !v)}
        agent={drawer ?? "finance"}
        title={project.name}
        history={
          drawer === "core"
            ? core
            : drawer === "finance"
            ? finance
            : drawer === "sales"
            ? sales
            : tech
        }
        input={agentInput}
        setInput={setAgentInput}
        onSend={() => drawer && sendTo(drawer)}
        placeholder={
          drawer === "core"
            ? "Ask a global question (will brief other agents)…"
            : `Chat with ${drawer}…`
        }
      />

      {/* Root of the storm modal */}
      {rootModal && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setRootModal(false)}
          />
          <div className="fixed inset-0 z-50 grid p-4 place-items-center">
            <div className="w-full max-w-lg p-4 border rounded-2xl border-white/10 bg-neutral-950">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Root of the storm</h4>
                <button
                  className="rounded p-1.5 hover:bg-white/10"
                  onClick={() => setRootModal(false)}
                >
                  <X size={16} />
                </button>
              </div>
              <p className="mt-1 text-sm text-white/60">
                Adjust your core idea. We’ll regenerate the overview.
              </p>
              <textarea
                rows={5}
                className="w-full p-3 mt-3 border rounded-lg outline-none border-white/10 bg-neutral-900 focus:ring-2 focus:ring-blue-500"
                value={rootDraft}
                onChange={(e) => setRootDraft(e.target.value)}
              />
              <div className="flex justify-end gap-2 mt-3">
                <button
                  className="px-3 py-2 border rounded bg-neutral-800 border-white/10"
                  onClick={() => setRootModal(false)}
                >
                  Cancel
                </button>
                <button
                  onClick={saveRootIdea}
                  className="px-3 py-2 text-white bg-indigo-500 rounded hover:bg-indigo-400"
                >
                  Save & Regenerate
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

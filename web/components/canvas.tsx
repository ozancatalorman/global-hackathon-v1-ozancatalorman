"use client";
import { motion } from "framer-motion";
import Node from "./node";

type Edge = { from: [number, number]; to: [number, number] };

function AnimatedEdge({ from, to }: Edge) {
  const [x1, y1] = from; // numbers 0..100
  const [x2, y2] = to;
  const cx = (x1 + x2) / 2;
  const path = `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`;

  return (
    <motion.path
      d={path}
      fill="none"
      stroke="url(#grad)"
      strokeWidth="1.8"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.2 }}
      strokeLinecap="round"
      className="drop-shadow-[0_0_8px_rgba(255,255,255,0.25)]"
    />
  );
}

export default function Canvas({
  active,
  onSelect,
}: {
  active: string[];
  onSelect: (id: string) => void;
}) {
  const nodes = {
    general: { x: 28, y: 50, label: "General Orchestrator" },
    finance: { x: 68, y: 28, label: "Finance" },
    marketing: { x: 68, y: 50, label: "Marketing" },
    ops: { x: 68, y: 72, label: "Operations" },
  };

  const edges: Edge[] = [
    {
      from: [nodes.general.x, nodes.general.y],
      to: [nodes.finance.x, nodes.finance.y],
    },
    {
      from: [nodes.general.x, nodes.general.y],
      to: [nodes.marketing.x, nodes.marketing.y],
    },
    {
      from: [nodes.general.x, nodes.general.y],
      to: [nodes.ops.x, nodes.ops.y],
    },
  ];

  return (
    <div className="relative h-[560px] w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-zinc-950 to-zinc-900">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(white_1px,transparent_1px)] [background-size:22px_22px]" />

      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.25" />
          </linearGradient>
        </defs>
        {edges.map((e, i) => (
          <AnimatedEdge key={i} {...e} />
        ))}
      </svg>

      <Node
        label={nodes.general.label}
        x={nodes.general.x}
        y={nodes.general.y}
        active
        onClick={() => onSelect("general")}
      />
      {(["finance", "marketing", "ops"] as const).map((id) => (
        <Node
          key={id}
          label={(nodes as any)[id].label}
          x={(nodes as any)[id].x}
          y={(nodes as any)[id].y}
          active={active.includes(id)}
          onClick={() => onSelect(id)}
        />
      ))}
    </div>
  );
}

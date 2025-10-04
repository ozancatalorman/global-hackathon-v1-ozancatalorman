"use client";
import { motion } from "framer-motion";

type Props = {
  label: string;
  x: number; // 0..100 (percent of canvas)
  y: number; // 0..100
  active?: boolean;
  onClick?: () => void;
};

export default function Node({ label, x, y, active, onClick }: Props) {
  return (
    <motion.div
      onClick={onClick}
      className={[
        "absolute -translate-x-1/2 -translate-y-1/2 select-none cursor-pointer",
        "rounded-2xl px-4 py-2 shadow-lg ring-1 backdrop-blur",
        active
          ? "bg-white text-black ring-white/40"
          : "bg-zinc-900/70 text-zinc-100 ring-white/10",
      ].join(" ")}
      style={{ left: `${x}%`, top: `${y}%` }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <span className="text-sm font-medium">{label}</span>
    </motion.div>
  );
}
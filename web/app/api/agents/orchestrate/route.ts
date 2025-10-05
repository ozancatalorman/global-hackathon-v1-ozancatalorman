// web/app/api/agents/orchestrate/route.ts
import { NextRequest } from "next/server";
import {
  coreGenerateSpecialistPrompts,
  runSpecialistsWithMemory,
  coreSummarizeAcrossAgents,
} from "@/components/lib/agents/main";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      projectId,
      idea,
      userInputs = [],
      histories = {},
    }: {
      projectId?: string;
      idea?: string;
      userInputs?: string[];
      histories?: {
        finance?: { role: "user" | "assistant"; content: string }[];
        sales?: { role: "user" | "assistant"; content: string }[];
        tech?: { role: "user" | "assistant"; content: string }[];
      };
    } = body ?? {};

    if (!idea) return json({ error: "Missing 'idea'." }, 400);

    // 1) CEO agent produces tailored prompts for each specialist
    const prompts = await coreGenerateSpecialistPrompts({ idea, userInputs });

    // 2) Specialists run with project memory
    const raw = await runSpecialistsWithMemory({
      prompts,
      financeHistory: histories.finance ?? [],
      salesHistory: histories.sales ?? [],
      techHistory: histories.tech ?? [],
    });

    // 3) CEO summarizes from 4 perspectives
    const summary = await coreSummarizeAcrossAgents({ idea, raw });

    return json({
      projectId: projectId ?? "demo",
      prompts,   // { finance, sales, tech }
      raw,       // { finance, sales, tech } full writeups
      summary,   // { comments: { ceo, finance, sales, tech }, note }
    });
  } catch (e: any) {
    return json({ error: String(e) }, 500);
  }
}

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}
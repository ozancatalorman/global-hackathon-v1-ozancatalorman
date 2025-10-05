import { NextRequest } from "next/server";
import {
  coreGenerateSpecialistPrompts,
  runSpecialistsWithMemory,
  coreSummarizeAcrossAgents,
} from "@/components/lib/agents/main";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const {
      projectId,
      idea,
      userInputs = [],
      histories = {},
    } = await req.json();

    const prompts = await coreGenerateSpecialistPrompts({ idea, userInputs });

    const raw = await runSpecialistsWithMemory({
      prompts,
      financeHistory: histories.finance ?? [],
      salesHistory: histories.sales ?? [],
      techHistory: histories.tech ?? [],
    });

    const summary = await coreSummarizeAcrossAgents({ idea, raw });

    return json({ projectId, prompts, raw, summary }, 200);
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

// web/app/api/agents/chat/route.ts
import { NextRequest } from "next/server";
import { callFinance } from "@/components/lib/agents/specialists/finance";
import { callSales } from "@/components/lib/agents/specialists/sales-marketing";
import { callTech } from "@/components/lib/agents/specialists/tech";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const agentIdRaw = (body?.agentId ?? "").toString().toLowerCase();
    const id = agentIdRaw === "sales-marketing" ? "sales" : agentIdRaw;

    const corePrompt = body?.corePrompt ?? "";
    const history = Array.isArray(body?.history) ? body.history : [];

    const projectIdea = body?.projectIdea ?? "";
    const coreOverview = body?.coreOverview ?? "";

    const context = [
      `PROJECT IDEA: ${projectIdea || "(n/a)"}`,
      coreOverview ? `CEO OVERVIEW: ${coreOverview}` : null,
      corePrompt ? `CORE TASK FOR ${id.toUpperCase()}: ${corePrompt}` : null,
      "Guidance: Use conversation history to avoid repeating earlier content. If user repeats a question, add new depth or ask one sharp clarifier. Prefer specifics and numbers.",
    ].filter(Boolean).join("\n\n");

    // Prepend a system message to the existing history
    const contextualHistory = [
      { role: "system", content: context },
      ...history,
    ];

    let text = "";
    if (id === "finance") text = await callFinance(corePrompt, history);
    else if (id === "sales") text = await callSales(corePrompt, history);
    else if (id === "tech") text = await callTech(corePrompt, history);
    else return json({ error: "Unknown agentId", received: body?.agentId ?? null }, 400);

    return json({ text });
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
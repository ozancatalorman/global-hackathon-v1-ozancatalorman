import { chatOnce } from "@/components/lib/agents/client/openai_client";
import { MAIN_PROMPT } from "@/components/lib/system-prompts/main";
import { callFinance } from "./specialists/finance";
import { callSales } from "./specialists/sales-marketing";
import { callTech } from "./specialists/tech";
import type { SpecialistPrompts, UIMessage } from "./types";

export async function coreGenerateSpecialistPrompts(params: {
  idea: string;
  userInputs?: string[];
}): Promise<SpecialistPrompts> {
  const userExtras =
    (params.userInputs ?? [])
      .filter(Boolean)
      .map((s) => `- ${s}`)
      .join("\n") || "(none)";

  const text = await chatOnce({
    system: MAIN_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          "MODE=A",
          "",
          `Idea:`,
          params.idea,
          "",
          `Extra inputs:`,
          userExtras,
          "",
          `Constraints: Return ONLY a strict JSON object. No prose, no backticks.`,
          `If this is a follow-up, vary angles/assumptions to progress the work; avoid repeating earlier prompts.`,
        ].join("\n"),
      },
    ],
    temperature: 0.45,
    max_tokens: 500,
  });

  const match = text.match(/\{[\s\S]*\}/);
  const jsonStr = match ? match[0] : text;

  try {
    const parsed = JSON.parse(jsonStr) as SpecialistPrompts;
    // quick guard for shape
    if (!parsed.finance || !parsed.sales || !parsed.tech)
      throw new Error("bad shape");
    return parsed;
  } catch {
    return {
      finance:
        `For this idea: "${params.idea}". Analyze unit economics, assumptions, runway, break-even. ` +
        `List the next 3 validations with data you need.`,
      sales:
        `For this idea: "${params.idea}". Define ICP, positioning, top channels. ` +
        `Propose 3 experiments with success metrics.`,
      tech:
        `For this idea: "${params.idea}". Outline MVP scope, key components, major risks, ` +
        `and a crisp 2-week sprint plan.`,
    };
  }
}

export async function runSpecialistsWithMemory(params: {
  prompts: SpecialistPrompts;
  financeHistory?: UIMessage[];
  salesHistory?: UIMessage[];
  techHistory?: UIMessage[];
}) {
  const [finance, sales, tech] = await Promise.all([
    callFinance(params.prompts.finance, params.financeHistory ?? []),
    callSales(params.prompts.sales, params.salesHistory ?? []),
    callTech(params.prompts.tech, params.techHistory ?? []),
  ]);
  return { finance, sales, tech };
}

export async function coreSummarizeAcrossAgents(params: {
  idea: string;
  raw: { finance: string; sales: string; tech: string };
}) {
  const text = await chatOnce({
    system: MAIN_PROMPT,
    messages: [
      {
        role: "user",
        content:
          `MODE=B\n` +
          `Idea:\n${params.idea}\n\n` +
          `FINANCE RAW:\n${params.raw.finance}\n\n` +
          `SALES RAW:\n${params.raw.sales}\n\n` +
          `TECH RAW:\n${params.raw.tech}\n`,
      },
    ],
    temperature: 0.2,
    max_tokens: 900,
  });

  try {
    return JSON.parse(text) as {
      comments: { ceo: string; finance: string; sales: string; tech: string };
      note: string;
    };
  } catch {
    return {
      comments: {
        ceo: text,
        finance: "See Finance section above.",
        sales: "See Sales/Marketing section above.",
        tech: "See Tech section above.",
      },
      note: "Each agent has its own chat — open them individually for follow-ups.",
    };
  }
}

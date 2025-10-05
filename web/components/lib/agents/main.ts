import { chatOnce } from "@/components/lib/agents/client/openai_client";
import { MAIN_PROMPT } from "@/components/lib/system-prompts/main";
import { callFinance } from "./specialists/finance";
import { callSales } from "./specialists/sales-marketing";
import { callTech } from "./specialists/tech";
import type { SpecialistPrompts, UIMessage } from "./types";

/** A) Core → generate 3 specialist prompts */
export async function coreGenerateSpecialistPrompts(params: {
  idea: string;
  userInputs?: string[];
}): Promise<SpecialistPrompts> {
  const text = await chatOnce({
    system: MAIN_PROMPT,
    messages: [
      {
        role: "user",
        content:
          `MODE=A\n` +
          `Idea:\n${params.idea}\n\n` +
          `Extra inputs:\n${(params.userInputs ?? [])
            .map((s) => `- ${s}`)
            .join("\n")}\n\n` +
          // NEW anti-repeat nudge:
          `Constraints:\n- Avoid repeating earlier prompts verbatim.\n- If the user is following up, vary angle/assumptions to move the work forward.\n- Prefer concrete, testable tasks.\n`,
      },
    ],
    // bump a bit for novelty
    temperature: 0.5,
    max_tokens: 500,
  });

  try {
    return JSON.parse(text) as SpecialistPrompts;
  } catch {
    return {
      finance:
        "Analyze unit economics, key assumptions, runway, break-even; list next validations.",
      sales:
        "Define ICP, positioning, top channels, 3 experiments with success metrics.",
      tech: "Outline MVP scope, key components, risks and a 2-week sprint plan.",
    };
  }
}

/** B) Run specialists with memory; return RAW outputs for chat storage */
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

/** C) Core → summarize across agents from 4 perspectives + note about individual chats */
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
    // degrade gracefully
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

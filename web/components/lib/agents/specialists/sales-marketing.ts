import {
  chatOnce,
  ChatMessage,
} from "@/components/lib/agents/client/openai_client";
import { SALES_PROMPT } from "@/components/lib/system-prompts/sales-marketing";
import type { UIMessage } from "../types";

export async function callSales(
  corePrompt: string,
  history: UIMessage[] = [],
  ctx?: { projectIdea?: string; coreOverview?: string }
) {
  const prior: ChatMessage[] = (history ?? []).map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const finalUser = [
    corePrompt && `Core prompt for Sales/Marketing:\n${corePrompt}`,
    ctx?.projectIdea && `\nIdea:\n${ctx.projectIdea}`,
    ctx?.coreOverview && `\nCEO overview:\n${ctx.coreOverview}`,
    `\n\nPlease write a **concise Markdown** response using short sections, `,
    `clear headings, and bullet lists. Focus on ICP, positioning, channels, `,
    `growth experiments, and actionable next steps.`,
  ]
    .filter(Boolean)
    .join("");

  const messages: ChatMessage[] = [
    ...prior,
    {
      role: "user",
      content:
        finalUser || "Analyze this from a sales and marketing perspective.",
    },
  ];

  return chatOnce({
    system: SALES_PROMPT,
    messages,
    temperature: 0.35,
    max_tokens: 900,
  });
}

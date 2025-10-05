import {
  chatOnce,
  ChatMessage,
} from "@/components/lib/agents/client/openai_client";
import { FINANCE_PROMPT } from "@/components/lib/system-prompts/finance";
import type { UIMessage } from "../types";

export async function callFinance(
  corePrompt: string,
  history: UIMessage[] = [],
  ctx?: { projectIdea?: string; coreOverview?: string }
) {
  const prior: ChatMessage[] = (history ?? []).map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const finalUser = [
    corePrompt && `Core prompt for Finance:\n${corePrompt}`,
    ctx?.projectIdea && `\nIdea:\n${ctx.projectIdea}`,
    ctx?.coreOverview && `\nCEO overview:\n${ctx.coreOverview}`,
    `\n\nPlease respond with clear, concise **Markdown** using short sections,`,
    `headings, and bullet lists where helpful. Avoid filler; be actionable.`,
  ]
    .filter(Boolean)
    .join("");

  const messages: ChatMessage[] = [
    ...prior,
    {
      role: "user",
      content:
        finalUser || "Analyze this from a finance perspective and be concise.",
    },
  ];

  return chatOnce({
    system: FINANCE_PROMPT,
    messages,
    temperature: 0.35,
    max_tokens: 900,
  });
}

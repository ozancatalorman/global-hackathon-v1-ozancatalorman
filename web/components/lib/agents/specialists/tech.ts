import {
  chatOnce,
  ChatMessage,
} from "@/components/lib/agents/client/openai_client";
import { TECH_PROMPT } from "@/components/lib/system-prompts/tech";
import type { UIMessage } from "../types";

export async function callTech(
  corePrompt: string,
  history: UIMessage[] = [],
  ctx?: { projectIdea?: string; coreOverview?: string }
) {
  const prior: ChatMessage[] = (history ?? []).map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const finalUser = [
    corePrompt && `Core prompt for Tech:\n${corePrompt}`,
    ctx?.projectIdea && `\nIdea:\n${ctx.projectIdea}`,
    ctx?.coreOverview && `\nCEO overview:\n${ctx.coreOverview}`,
    `\n\nPlease provide a **Markdown-formatted** response with sections for:`,
    `architecture outline, tech stack, key risks, 2-week sprint plan, and`,
    `recommendations for future scalability.`,
  ]
    .filter(Boolean)
    .join("");

  const messages: ChatMessage[] = [
    ...prior,
    {
      role: "user",
      content:
        finalUser ||
        "Analyze this from a tech perspective and outline MVP steps.",
    },
  ];

  return chatOnce({
    system: TECH_PROMPT,
    messages,
    temperature: 0.35,
    max_tokens: 900,
  });
}

// components/lib/agents/specialists/finance.ts
import { chatOnce, ChatMessage } from "@/components/lib/agents/client/openai_client";
import { FINANCE_PROMPT } from "@/components/lib/system-prompts/finance";
import type { UIMessage } from "../types";

/**
 * Call the Finance specialist.
 *
 * - Backward compatible: ctx is optional.
 * - Appends a fresh final user instruction that merges the latest corePrompt
 *   and optional context so the model doesn’t reuse an old trajectory.
 * - Asks for clean Markdown with headings/bullets for nicer chat rendering.
 */
export async function callFinance(
  corePrompt: string,
  history: UIMessage[] = [],
  ctx?: { projectIdea?: string; coreOverview?: string }
) {
  // Map existing per-agent history first (system prompt comes from FINANCE_PROMPT)
  const prior: ChatMessage[] = (history ?? []).map((m) => ({
    role: m.role,
    content: m.content,
  }));

  // Build a fresh instruction as the last user turn
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
    // (System prompt is passed separately to chatOnce)
    ...prior,
    { role: "user", content: finalUser || "Analyze this from a finance perspective and be concise." },
  ];

  return chatOnce({
    system: FINANCE_PROMPT,
    messages,
    temperature: 0.35,   // a touch more variety than 0.2
    max_tokens: 900,
  });
}
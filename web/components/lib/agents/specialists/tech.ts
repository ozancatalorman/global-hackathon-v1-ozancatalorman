import { chatOnce, ChatMessage } from "@/components/lib/agents/client/openai_client";
import { TECH_PROMPT } from "@/components/lib/system-prompts/tech";
import type { UIMessage } from "../types";

export async function callTech(corePrompt: string, history: UIMessage[] = []) {
  const msgs: ChatMessage[] = [
    { role: "user", content: `Core prompt for Tech:\n${corePrompt}` },
    ...history,
  ];
  return chatOnce({ system: TECH_PROMPT, messages: msgs, temperature: 0.3 });
}
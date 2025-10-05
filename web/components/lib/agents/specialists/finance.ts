import { chatOnce, ChatMessage } from "@/components/lib/agents/client/openai_client";
import { FINANCE_PROMPT } from "@/components/lib/system-prompts/finance";
import type { UIMessage } from "../types";

export async function callFinance(corePrompt: string, history: UIMessage[] = []) {
  const msgs: ChatMessage[] = [
    { role: "user", content: `Core prompt for Finance:\n${corePrompt}` },
    ...history,
  ];
  return chatOnce({ system: FINANCE_PROMPT, messages: msgs, temperature: 0.2 });
}
import { chatOnce, ChatMessage } from "@/components/lib/agents/client/openai_client";
import { SALES_PROMPT } from "@/components/lib/system-prompts/sales-marketing";
import type { UIMessage } from "../types";

export async function callSales(corePrompt: string, history: UIMessage[] = []) {
  const msgs: ChatMessage[] = [
    { role: "user", content: `Core prompt for Sales/Marketing:\n${corePrompt}` },
    ...history,
  ];
  return chatOnce({ system: SALES_PROMPT, messages: msgs, temperature: 0.3 });
}
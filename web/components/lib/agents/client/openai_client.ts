import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export async function chatOnce(opts: {
  system: string;
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
   presence_penalty?: number;   
  frequency_penalty?: number;  
}) {
  const { system, messages, model = "gpt-4o-mini", temperature = 0.3, max_tokens = 1400 } = opts;

  const resp = await openai.chat.completions.create({
    model,
    temperature,
    max_tokens,
    messages: [{ role: "system", content: system }, ...messages],
  });

  return resp.choices[0]?.message?.content?.trim() ?? "";
}
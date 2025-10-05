import OpenAI from "openai";

export const runtime = "edge";

export async function GET() {
  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

    const resp = await client.chat.completions.create({
      model: "gpt-4o-mini", // I used this model since it's fast and cheap :D
      messages: [{ role: "user", content: "pong" }],
      max_tokens: 5,
      temperature: 0,
    });

    const text = resp.choices[0]?.message?.content ?? "";
    return new Response(JSON.stringify({ ok: true, text }), {
      headers: { "content-type": "application/json" },
      status: 200,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      headers: { "content-type": "application/json" },
      status: 500,
    });
  }
}

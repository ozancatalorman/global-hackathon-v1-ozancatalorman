export type AgentId = "main" | "finance" | "sales" | "tech";

export type UIMessage = {
  role: "user" | "assistant";
  content: string;
  ts?: number;
};

export type SpecialistPrompts = {
  finance: string;
  sales: string;
  tech: string;
};

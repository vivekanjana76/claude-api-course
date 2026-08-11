import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Curriculum — AI Engineer Academy",
  description:
    "Modules covering everything an AI Engineer needs: how LLMs work, prompt and context engineering, embeddings and retrieval, RAG, agents and tool use, MCP, fine-tuning and alignment, inference and serving, evaluation, LLMOps, safety, multimodal, system design, and the role itself.",
};

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return children;
}

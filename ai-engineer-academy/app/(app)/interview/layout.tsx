import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interview Q&A — AI Engineer Academy",
  description:
    "Model answers to the questions AI Engineer panels actually ask — foundations, prompting, retrieval and RAG, agents and MCP, fine-tuning, inference, evaluation, production, safety, and system design.",
};

export default function InterviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}

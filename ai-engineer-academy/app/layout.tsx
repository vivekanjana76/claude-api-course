import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Engineer Academy — Build production systems on top of LLMs",
  description:
    "A complete, visual curriculum for the AI Engineer role: prompt & context engineering, embeddings and RAG, agents and tool use, MCP, fine-tuning and alignment, inference and serving, evaluation, LLMOps, guardrails and AI safety — plus system design and interview prep.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Interview Academy — Ace your AI/ML job interviews",
  description:
    "A beautiful, visual course that prepares you for AI and machine-learning job interviews: ML foundations, classic algorithms, deep learning, NLP & transformers, LLMs & generative AI, MLOps, ML system design, and behavioral strategy — with model answers, examples, and explanations.",
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

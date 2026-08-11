import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Glossary — AI Engineer Academy",
  description:
    "Searchable, cross-linked definitions for the whole AI engineering vocabulary — from attention and AWQ to speculative decoding and zero-shot — with the terms trending in 2026 job descriptions flagged as a keyword radar.",
};

export default function GlossaryLayout({ children }: { children: React.ReactNode }) {
  return children;
}

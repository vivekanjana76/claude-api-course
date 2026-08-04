import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Glossary — AWS Academy",
  description:
    "Searchable, cross-linked definitions for every AWS service, acronym, and piece of jargon in the course — from ARN and awsvpc to write sharding.",
};

export default function GlossaryLayout({ children }: { children: React.ReactNode }) {
  return children;
}

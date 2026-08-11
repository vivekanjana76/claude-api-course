import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Intuition Prep — AI Engineer Academy",
  description:
    "Rapid drills on the judgment calls AI Engineer interviews actually test: which adaptation technique, which pipeline stage is broken, how you'd evaluate it, where the guardrail belongs, and what that keyword means.",
};

export default function PrepLayout({ children }: { children: React.ReactNode }) {
  return children;
}

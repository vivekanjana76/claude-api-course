import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Review — Agent Academy",
  description:
    "Spaced-repetition review over every flashcard in the Agentic AI curriculum. Cards you recall move further out; cards you miss come back today.",
};

export default function ReviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mock exam — AI Engineer Academy",
  description:
    "A timed paper drawn at random from every quiz question in the AI Engineer curriculum, with shuffled options and a per-module breakdown of where the marks went.",
};

export default function ExamLayout({ children }: { children: React.ReactNode }) {
  return children;
}

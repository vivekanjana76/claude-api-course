import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interview Q&A — AWS Academy",
  description:
    "Model answers to the AWS questions hiring managers actually ask — foundations, IAM & security, networking, compute, data, operations, architecture, and cost.",
};

export default function InterviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}

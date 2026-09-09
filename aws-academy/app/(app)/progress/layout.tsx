import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Progress — AWS Academy",
  description:
    "Lessons completed, quiz mastery, review retention, and a study streak — plus a backup you can carry to another browser.",
};

export default function ProgressLayout({ children }: { children: React.ReactNode }) {
  return children;
}

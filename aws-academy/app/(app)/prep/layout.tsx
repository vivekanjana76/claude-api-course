import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Intuition Prep — AWS Academy",
  description:
    "Rapid drills on the judgment calls AWS interviews actually test: which compute, which data store, where the security control goes, what you'd check next, and what that acronym means.",
};

export default function PrepLayout({ children }: { children: React.ReactNode }) {
  return children;
}

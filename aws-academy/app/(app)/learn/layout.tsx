import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Curriculum — AWS Academy",
  description:
    "13 modules and 51 lessons covering everything an AWS Cloud Engineer needs: IAM, EC2, S3, VPC, databases, serverless, containers, IaC, observability, security, architecture, and the role itself.",
};

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AWS Academy — Become an AWS Cloud Engineer",
  description:
    "A complete, visual AWS curriculum for the Cloud Engineer role: IAM, EC2, S3, VPC, RDS & DynamoDB, Lambda, ECS/EKS, CloudFormation & Terraform, CI/CD, CloudWatch, security, cost and Well-Architected design — from first principles to production.",
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

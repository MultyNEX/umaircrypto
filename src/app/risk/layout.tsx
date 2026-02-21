import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Risk Disclaimer - UmairCrypto",
  description:
    "Important risk disclosure for UmairCrypto services. Cryptocurrency trading involves significant risk. Read our full disclaimer and UAE regulatory notice.",
};

export default function RiskLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

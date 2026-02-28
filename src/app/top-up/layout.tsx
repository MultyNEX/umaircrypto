import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Complete Your Payment - UmairCrypto",
  description: "Complete your remaining payment to proceed with your consultation booking.",
};

export default function TopupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

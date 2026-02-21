import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Consultation - UmairCrypto",
  description:
    "Book a 1-on-1 crypto trading consultation with Umair. Choose your plan, pay via crypto, and schedule your session. Starter $200, Pro $350, VIP $1,200.",
};

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

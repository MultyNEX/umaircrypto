"use client";

import { motion } from "framer-motion";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const LAST_UPDATED = "February 2026";

export default function RiskDisclaimerPage() {
  return (
    <main className="relative min-h-screen bg-bg-primary">
      {/* Background effects */}
      <div className="aurora-orb aurora-orb-warm top-[10%] right-[10%]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.015)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-6 py-12 sm:py-20">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>

        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20">
              <AlertTriangle size={24} className="text-[#F59E0B]" />
            </div>
            <div>
              <p className="text-[#F59E0B] font-semibold text-sm uppercase tracking-widest">
                Legal
              </p>
              <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary">
                Risk Disclaimer
              </h1>
            </div>
          </div>
          <p className="text-text-secondary text-sm">
            Last updated: {LAST_UPDATED}
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-8"
        >
          {/* Warning banner */}
          <div className="p-5 rounded-xl border border-[#F59E0B]/20 bg-[#F59E0B]/[0.05]">
            <div className="flex gap-3">
              <AlertTriangle size={20} className="text-[#F59E0B] flex-shrink-0 mt-0.5" />
              <p className="text-text-primary text-sm sm:text-base font-semibold">
                The content provided on this website and through Umair Crypto&apos;s
                services is for educational and informational purposes only. It
                does not constitute financial advice, investment advice, trading
                advice, or any other form of professional advice.
              </p>
            </div>
          </div>

          {/* Sections */}
          <Section title="1. Not Financial Advice">
            <p>
              All content shared by Umair Crypto — including but not limited to
              chart analysis, trade setups, market commentary, social media
              posts, consultations, and mentorship sessions — is strictly
              educational and reflects personal opinions. Nothing on this website
              or in any associated service should be interpreted as a
              recommendation to buy, sell, or hold any cryptocurrency, token, or
              financial instrument.
            </p>
            <p>
              You should always conduct your own research (DYOR) and consult
              with a qualified, licensed financial advisor before making any
              investment decisions.
            </p>
          </Section>

          <Section title="2. Trading Risks">
            <p>
              Cryptocurrency trading involves substantial risk of loss and is not
              suitable for every investor. The value of cryptocurrencies is
              highly volatile and can fluctuate significantly in short periods of
              time. You could lose some or all of your invested capital.
            </p>
            <p>
              Key risks include but are not limited to:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-text-secondary ml-2">
              <li>Extreme price volatility and market manipulation</li>
              <li>Liquidity risk — inability to exit positions at desired prices</li>
              <li>Leverage and margin trading risks leading to amplified losses</li>
              <li>Smart contract vulnerabilities and protocol exploits</li>
              <li>Exchange insolvency, hacks, or withdrawal freezes</li>
              <li>Regulatory changes that may affect asset legality or value</li>
              <li>Total loss of capital, including in stablecoin de-peg events</li>
            </ul>
            <p>
              Never trade with money you cannot afford to lose. Only invest
              capital that you are fully prepared to lose without affecting your
              financial well-being.
            </p>
          </Section>

          <Section title="3. Past Performance">
            <p>
              Past performance is not indicative of future results. Any trade
              results, portfolio screenshots, profit/loss statements, or
              performance metrics shared on this website, social media, or in
              consultations are historical in nature and do not guarantee similar
              outcomes in the future.
            </p>
            <p>
              Market conditions change. A strategy that performed well in one
              market cycle may not perform in another. Individual results will
              vary based on factors including market conditions, entry/exit
              timing, position sizing, and risk management.
            </p>
          </Section>

          <Section title="4. No Guarantees">
            <p>
              Umair Crypto makes no guarantees, representations, or warranties
              regarding the accuracy, completeness, or reliability of any
              information provided. Market analysis is inherently speculative.
              No analysis method — technical, fundamental, or otherwise — can
              predict market movements with certainty.
            </p>
            <p>
              Participation in any paid consultation, mentorship program, or
              community does not guarantee profitability or any specific
              financial outcome. The services are educational tools to help you
              develop your own trading skills and judgment.
            </p>
          </Section>

          <Section title="5. Third-Party Content & Links">
            <p>
              This website may contain links to third-party websites, exchanges,
              tools, or resources. These are provided for convenience only.
              Umair Crypto does not endorse, control, or assume responsibility
              for the content, privacy policies, or practices of any third-party
              services.
            </p>
            <p>
              Use of any third-party platforms, including cryptocurrency
              exchanges, wallets, and DeFi protocols, is entirely at your own
              risk.
            </p>
          </Section>

          <Section title="6. Regulatory Notice">
            <p>
              Cryptocurrency regulations vary by jurisdiction. It is your sole
              responsibility to determine whether the use of this website and
              its services complies with the laws and regulations applicable in
              your country or region. Umair Crypto does not provide services in
              jurisdictions where doing so would be unlawful.
            </p>
            <p>
              Users in the United Arab Emirates should be aware that
              cryptocurrency trading is permitted through licensed exchanges
              regulated by the Virtual Assets Regulatory Authority (VARA) in
              Dubai or the Financial Services Regulatory Authority (FSRA) in
              ADGM. This website does not operate as a licensed exchange or
              broker.
            </p>
          </Section>

          <Section title="7. Personal Responsibility">
            <p>
              By using this website or engaging with any of Umair Crypto&apos;s
              services, you acknowledge and accept that:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-text-secondary ml-2">
              <li>All trading and investment decisions are made at your own risk</li>
              <li>You are solely responsible for your own financial decisions</li>
              <li>You will not hold Umair Crypto liable for any losses incurred</li>
              <li>You have read and understood this risk disclaimer in full</li>
              <li>You are of legal age to engage in financial activities in your jurisdiction</li>
            </ul>
          </Section>

          <Section title="8. Limitation of Liability">
            <p>
              To the fullest extent permitted by law, Umair Crypto, its owner
              Umair Orakzai, and any associated individuals shall not be held
              liable for any direct, indirect, incidental, consequential,
              special, or exemplary damages resulting from the use of this
              website, its content, or any paid services — including but not
              limited to financial losses, loss of profits, or loss of data.
            </p>
          </Section>

          <Section title="9. Contact">
            <p>
              If you have any questions about this disclaimer, you may reach out
              via{" "}
              <a
                href="https://instagram.com/umairorkz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-primary hover:underline"
              >
                @umairorkz on Instagram
              </a>{" "}
              or email at{" "}
              <a
                href="mailto:umairxbt@gmail.com"
                className="text-accent-primary hover:underline"
              >
                umairxbt@gmail.com
              </a>
              .
            </p>
          </Section>

          {/* Bottom divider */}
          <div className="pt-6 border-t border-white/[0.06]">
            <p className="text-text-secondary/50 text-xs text-center">
              By continuing to use umaircrypto.com, you confirm that you have
              read, understood, and agreed to this Risk Disclaimer.
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

// ─── Reusable section component ─────────────────────────────────────
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h2 className="font-heading text-lg sm:text-xl font-bold text-text-primary">
        {title}
      </h2>
      <div className="space-y-3 text-text-secondary text-sm sm:text-base leading-relaxed">
        {children}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How do I book a consultation?",
    a: 'Click "Book a Call" anywhere on the site. Pick a time and you\'ll get a confirmation with a meeting link.',
  },
  {
    q: "What cryptocurrencies can I pay with?",
    a: "BTC, ETH, USDT, USDC, and 350+ other coins via our secure payment gateway.",
  },
  {
    q: "Do you offer refunds?",
    a: "Please reach out via WhatsApp to discuss any concerns.",
  },
  {
    q: "Can I join the community without a consultation?",
    a: "Yes! Follow @umairorkz on Instagram and X, or join the WhatsApp channel for free market updates.",
  },
  {
    q: "What markets do you cover?",
    a: "Primarily BTC and ETH, plus major altcoins including SOL, SUI, LTC, and others based on current setups.",
  },
  {
    q: "Is this financial advice?",
    a: "No. All analysis is educational and for informational purposes only. Always do your own research.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section id="faq" className="relative py-8 md:py-16">
      <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 md:mb-8"
        >
          <p className="text-accent-primary font-semibold text-sm uppercase tracking-widest mb-3">
            FAQ
          </p>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold">
            Frequently Asked Questions
          </h2>
          <p className="text-text-secondary mt-4 text-sm sm:text-base">
            Common questions answered.
          </p>
        </motion.div>

        {/* Accordion */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="space-y-3"
        >
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`rounded-2xl border bg-bg-secondary/60 glass-enhanced overflow-hidden transition-all duration-300 ${
                  isOpen
                    ? "border-accent-primary/30 shadow-[0_0_20px_rgba(56,189,248,0.1)]"
                    : "border-white/[0.08] hover:border-accent-primary/20 hover:shadow-[0_0_15px_rgba(56,189,248,0.08)]"
                }`}
              >
                <button
                  onClick={() => toggle(i)}
                  className="flex items-center justify-between w-full px-5 sm:px-6 py-5 text-left gap-4 min-h-[56px]"
                >
                  <span className="font-heading font-semibold text-sm sm:text-base text-text-primary">
                    {faq.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="shrink-0 text-text-secondary"
                  >
                    <ChevronDown size={20} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 sm:px-6 pb-5 text-text-secondary text-sm sm:text-base leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

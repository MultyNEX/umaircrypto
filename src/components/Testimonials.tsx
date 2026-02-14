"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "Umair's chart analysis is on another level. Called the BTC bounce at $85K before anyone else saw it.",
    name: "Ahmad R.",
    role: "Crypto Trader",
  },
  {
    quote:
      "Joined the community 6 months ago. Best decision I made. The TA breakdowns are worth 10x the consultation fee.",
    name: "Sarah K.",
    role: "Portfolio Manager",
  },
  {
    quote:
      "No hype, no hopium — just clean analysis. Exactly what I needed to stop losing money on bad entries.",
    name: "Bilal M.",
    role: "Day Trader",
  },
  {
    quote:
      "The VIP mentorship changed how I read charts. I finally understand structure, not just price.",
    name: "Fatima Z.",
    role: "Swing Trader",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative py-16 md:py-32">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-14"
        >
          <p className="text-accent-primary font-semibold text-sm uppercase tracking-widest mb-3">
            Testimonials
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold">
            What Traders Say
          </h2>
        </motion.div>

        {/* Cards grid — single column on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative rounded-2xl bg-bg-secondary/60 backdrop-blur-xl border border-white/[0.08] glass p-6 sm:p-8 border-l-2 border-l-accent-primary"
            >
              {/* Quote icon */}
              <Quote
                size={28}
                className="text-accent-primary/20 absolute top-6 right-6 sm:top-8 sm:right-8"
              />

              {/* Quote text */}
              <p className="text-text-secondary italic leading-relaxed text-base sm:text-lg mb-6 pr-8">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Attribution */}
              <div>
                <p className="font-heading font-bold text-text-primary">
                  {t.name}
                </p>
                <p className="text-text-secondary text-sm">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { useTilt } from "@/hooks/useTilt";

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

function TestimonialCard({
  t,
  i,
}: {
  t: (typeof testimonials)[number];
  i: number;
}) {
  const tilt = useTilt(6);

  return (
    <motion.div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: i * 0.1 }}
      className="relative rounded-2xl bg-bg-secondary/60 glass-enhanced border border-white/[0.08] p-6 sm:p-8 border-l-2 border-l-accent-primary shimmer-card tilt-card"
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
  );
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative py-10 md:py-20 overflow-hidden">
      {/* Aurora orb */}
      <div className="aurora-orb aurora-orb-teal bottom-[20%] left-[10%]" />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
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
            Testimonials
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold">
            What Traders <span className="text-gradient-animated">Say</span>
          </h2>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name} t={t} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

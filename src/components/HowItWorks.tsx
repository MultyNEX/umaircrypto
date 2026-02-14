"use client";

import { motion } from "framer-motion";
import { CalendarCheck, MessageSquareText, TrendingUp } from "lucide-react";

const steps = [
  {
    number: 1,
    title: "Book a Call",
    description: "Pick a time that works for you",
    icon: CalendarCheck,
  },
  {
    number: 2,
    title: "We Talk Strategy",
    description: "Share your portfolio, get real analysis",
    icon: MessageSquareText,
  },
  {
    number: 3,
    title: "Trade With Confidence",
    description: "Clear plan, clear levels, no guessing",
    icon: TrendingUp,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function HowItWorks() {
  return (
    <section className="relative py-16 md:py-32">
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
            Process
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold">
            How It Works
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8">
          {/* Connector line — horizontal on desktop */}
          <div className="hidden md:block absolute top-[3.25rem] left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px border-t-2 border-dashed border-border pointer-events-none" />

          {/* Connector line — vertical on mobile */}
          <div className="md:hidden absolute top-0 bottom-0 left-1/2 -translate-x-px w-px border-l-2 border-dashed border-border pointer-events-none" />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative flex flex-col items-center text-center rounded-2xl bg-bg-secondary/60 backdrop-blur-xl border border-white/[0.08] glass p-8 md:p-8"
            >
              {/* Number circle — larger on mobile */}
              <div className="relative z-10 flex items-center justify-center w-20 h-20 md:w-16 md:h-16 rounded-full bg-accent-primary/10 border-2 border-accent-primary mb-5">
                <span className="font-heading text-3xl md:text-2xl font-bold text-accent-primary">
                  {step.number}
                </span>
              </div>

              {/* Icon */}
              <step.icon size={22} className="text-text-secondary mb-3" />

              {/* Title */}
              <h3 className="font-heading text-xl font-bold mb-2">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-text-secondary text-base leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

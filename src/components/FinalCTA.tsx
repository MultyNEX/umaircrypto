"use client";

import { motion } from "framer-motion";
import { ArrowRight, Shield, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function FinalCTA() {
  return (
    <section
      id="contact"
      className="relative py-12 md:py-20 overflow-hidden"
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 via-transparent to-accent-secondary/5 pointer-events-none" />

      {/* Aurora orbs */}
      <div className="aurora-orb aurora-orb-teal top-[20%] right-[20%]" />
      <div className="aurora-orb aurora-orb-gold bottom-[20%] left-[20%]" />

      {/* Top line */}
      <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-accent-primary/15 to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="space-y-5"
        >
          <p className="text-accent-primary font-semibold text-sm uppercase tracking-widest">
            Get Started
          </p>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold">
            Ready to Trade{" "}
            <span className="text-gradient-animated">With an Edge?</span>
          </h2>
          <p className="text-text-secondary text-sm sm:text-base max-w-xl mx-auto">
            Join 200K+ traders who trust UmairCrypto for market insights,
            chart analysis, and 1-on-1 mentorship.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mt-10 mb-10 max-w-lg mx-auto"
        >
          {[
            { icon: Users, label: "Community", value: "200K+" },
            { icon: TrendingUp, label: "Win Rate", value: "95%" },
            { icon: Shield, label: "Since", value: "2020" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]"
            >
              <stat.icon
                size={20}
                className="text-accent-primary mx-auto mb-2"
              />
              <p className="text-text-primary font-heading text-lg sm:text-xl font-bold">
                {stat.value}
              </p>
              <p className="text-text-secondary text-xs">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/payment"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold rounded-xl bg-accent-primary text-bg-primary hover:brightness-110 transition-all duration-200 shadow-[0_0_25px_rgba(56,189,248,0.35)] hover:shadow-[0_0_40px_rgba(56,189,248,0.55)] btn-neon-glow"
          >
            Book a Consultation
            <ArrowRight size={18} />
          </Link>
          <a
            href="https://www.instagram.com/umairorkz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold rounded-xl border border-border text-text-primary hover:bg-bg-tertiary transition-all duration-200"
          >
            Follow on Instagram
          </a>
        </motion.div>

        {/* Disclaimer link */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 text-text-secondary/50 text-xs"
        >
          Trading involves risk.{" "}
          <Link
            href="/risk"
            className="text-accent-primary/60 hover:text-accent-primary transition-colors underline underline-offset-2"
          >
            Read our disclaimer
          </Link>
        </motion.p>
      </div>
    </section>
  );
}
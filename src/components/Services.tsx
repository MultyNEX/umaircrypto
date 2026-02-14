"use client";

import { motion } from "framer-motion";
import { Check, MessageCircle } from "lucide-react";
import { useTilt } from "@/hooks/useTilt";

const tiers = [
  {
    name: "Starter",
    title: "1-on-1 Chart Review",
    price: "$XX",
    features: [
      "30-minute session",
      "Portfolio overview",
      "Key levels & entries",
    ],
    cta: { label: "Book Now", href: "#contact" },
    highlighted: false,
  },
  {
    name: "Pro",
    title: "Full Consultation",
    price: "$XX",
    badge: "Most Popular",
    features: [
      "60-minute deep dive",
      "Complete portfolio audit",
      "Custom trading plan",
      "Ongoing support (7 days)",
    ],
    cta: { label: "Book Now", href: "#contact" },
    highlighted: true,
  },
  {
    name: "VIP",
    title: "Ongoing Mentorship",
    price: "Let's Talk",
    features: [
      "Weekly calls",
      "Private group access",
      "Priority chart analysis",
      "Custom alerts",
    ],
    cta: {
      label: "Message on WhatsApp",
      href: "https://wa.me/PLACEHOLDER?text=Hi%20Umair,%20I'm%20interested%20in%20VIP%20mentorship",
      external: true,
    },
    highlighted: false,
  },
] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

function TierCard({ tier, i }: { tier: (typeof tiers)[number]; i: number }) {
  const tilt = useTilt(8);

  return (
    <motion.div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      key={tier.name}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: i * 0.15 }}
      className={`relative flex flex-col rounded-2xl p-6 sm:p-8 glass-enhanced border shimmer-card tilt-card ${
        tier.highlighted
          ? "bg-bg-secondary/80 border-animated-gold"
          : "bg-bg-secondary/60 border-white/[0.08]"
      }`}
    >
      {/* Badge */}
      {tier.highlighted && "badge" in tier && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-accent-secondary text-bg-primary text-xs font-bold uppercase tracking-wide">
          {tier.badge}
        </span>
      )}

      {/* Tier name */}
      <p
        className={`text-sm font-semibold uppercase tracking-widest mb-1 ${
          tier.highlighted
            ? "text-accent-secondary"
            : "text-text-secondary"
        }`}
      >
        {tier.name}
      </p>

      {/* Title */}
      <h3 className="font-heading text-xl sm:text-2xl font-bold mb-5">
        {tier.title}
      </h3>

      {/* Price */}
      <p className="font-heading text-4xl font-bold mb-8">
        <span
          className={
            tier.highlighted
              ? "text-accent-secondary"
              : "text-accent-primary"
          }
        >
          {tier.price}
        </span>
      </p>

      {/* Features */}
      <ul className="space-y-3.5 mb-8 flex-1">
        {tier.features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-3 text-text-secondary text-base"
          >
            <Check
              size={18}
              className={`mt-0.5 shrink-0 ${
                tier.highlighted
                  ? "text-accent-secondary"
                  : "text-accent-primary"
              }`}
            />
            {feature}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a
        href={tier.cta.href}
        {...("external" in tier.cta && tier.cta.external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        className={`flex items-center justify-center gap-2 w-full py-4 rounded-xl text-base font-semibold transition-all duration-200 btn-neon-glow ${
          tier.highlighted
            ? "bg-accent-secondary text-white hover:brightness-110 shadow-[0_0_20px_rgba(168,85,247,0.25)] hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]"
            : "bg-accent-primary text-bg-primary hover:brightness-110 shadow-[0_0_20px_rgba(56,189,248,0.25)] hover:shadow-[0_0_30px_rgba(56,189,248,0.4)]"
        }`}
      >
        {"external" in tier.cta && tier.cta.external && (
          <MessageCircle size={16} />
        )}
        {tier.cta.label}
      </a>
    </motion.div>
  );
}

export default function Services() {
  return (
    <section id="services" className="relative py-16 md:py-32 overflow-hidden">
      {/* Aurora orbs */}
      <div className="aurora-orb aurora-orb-gold top-[30%] left-[5%]" />
      <div className="aurora-orb aurora-orb-warm bottom-[10%] right-[15%]" />
      {/* Top reflective line */}
      <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-accent-secondary/15 to-transparent" />

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
            Services
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold">
            Work <span className="text-gradient-animated">With Me</span>
          </h2>
          <p className="text-text-secondary mt-4 text-base sm:text-lg">
            Choose the plan that fits your level.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch pt-5">
          {tiers.map((tier, i) => (
            <TierCard key={tier.name} tier={tier} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { Users, Camera, AtSign, Clock, TrendingUp, MapPin } from "lucide-react";
import { useCounter } from "@/hooks/useCounter";
import { useTilt } from "@/hooks/useTilt";
import Image from "next/image";

const stats = [
  { value: "300K+", label: "Traders in Community", icon: Users, countEnd: 300, suffix: "K+" },
  { value: "152K", label: "Instagram Followers", icon: Camera, countEnd: 152, suffix: "K" },
  { value: "26.8K", label: "X Followers", icon: AtSign, countEnd: 26.8, suffix: "K" },
  { value: "4+", label: "Years in Crypto", icon: Clock, countEnd: 4, suffix: "+" },
  { value: "BTC & ETH", label: "Specialist", icon: TrendingUp },
  { value: "UAE 🇦🇪", label: "Based in", icon: MapPin },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

function CounterStatCard({ stat, index }: { stat: typeof stats[number] & { countEnd: number; suffix: string }; index: number }) {
  const tilt = useTilt(8);
  const counter = useCounter(stat.countEnd, 2000, stat.suffix);

  return (
    <div
      ref={(el) => {
        (tilt.ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
        (counter.ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
      }}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      className="relative rounded-2xl bg-bg-secondary/60 backdrop-blur-xl border border-white/[0.08] glass-enhanced p-4 sm:p-5 hover:border-accent-primary/30 transition-colors duration-300 shimmer-card tilt-card float-bob"
      style={{ animationDelay: `${index * 0.3}s` }}
    >
      <stat.icon size={16} className="text-text-secondary mb-2.5" />
      <p className="font-heading font-bold text-xl sm:text-lg text-accent-primary">
        {counter.displayValue}
      </p>
      <p className="text-text-secondary text-xs mt-1">{stat.label}</p>
    </div>
  );
}

function StaticStatCard({ stat, index }: { stat: typeof stats[number]; index: number }) {
  const tilt = useTilt(8);

  return (
    <div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      className="relative rounded-2xl bg-bg-secondary/60 backdrop-blur-xl border border-white/[0.08] glass-enhanced p-4 sm:p-5 hover:border-accent-primary/30 transition-colors duration-300 shimmer-card tilt-card float-bob"
      style={{ animationDelay: `${index * 0.3}s` }}
    >
      <stat.icon size={16} className="text-text-secondary mb-2.5" />
      <p className="font-heading font-bold text-xl sm:text-lg text-accent-primary">
        {stat.value}
      </p>
      <p className="text-text-secondary text-xs mt-1">{stat.label}</p>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="relative py-16 md:py-32 overflow-hidden">
      {/* Aurora orbs */}
      <div className="aurora-orb aurora-orb-teal top-[20%] right-[10%]" />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — Umair's photo */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="hidden lg:flex justify-center lg:justify-start"
          >
            <div className="relative w-80 h-[22rem] md:w-96 md:h-[28rem]">
              <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-accent-primary/10 via-transparent to-accent-secondary/10 blur-2xl" />
              <div className="relative w-full h-full rounded-2xl border border-white/[0.08] glass-enhanced overflow-hidden">
                <Image
                  src="/umair-about.png"
                  alt="Umair Orakzai - Crypto Analyst"
                  fill
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/60 via-transparent to-transparent" />
              </div>

              {/* Swirling arrow pointing to Umair (right side) */}
              <svg
                className="absolute -right-8 top-1/4 w-28 h-28 text-accent-primary drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]"
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Swirl path */}
                <path
                  d="M110 20 C95 15, 70 10, 55 25 C40 40, 50 60, 40 75 C30 90, 20 85, 15 80"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray="4 4"
                />
                {/* Arrowhead */}
                <polygon
                  points="10,85 20,78 16,72"
                  fill="currentColor"
                />
              </svg>
              {/* Label */}
              <span className="absolute -right-4 top-[14%] font-heading text-sm font-bold text-accent-primary drop-shadow-[0_0_8px_rgba(56,189,248,0.5)] whitespace-nowrap">
                That&apos;s me!
              </span>
            </div>
          </motion.div>

          {/* Right — Bio + stats */}
          <div className="space-y-8 sm:space-y-10">
            {/* Section header */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <p className="text-accent-primary font-semibold text-sm uppercase tracking-widest mb-3">
                About
              </p>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold">
                About <span className="text-gradient-animated">Umair Orakzai</span>
              </h2>
            </motion.div>

            {/* Bio */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="space-y-4 text-text-secondary leading-relaxed text-base sm:text-lg"
            >
              <p>
                I&apos;ve been in crypto since 2021. Started as a trader, built a
                community of 300,000+ along the way. I focus on what the charts
                tell me — SMA, RSI, volume, structure. No hype, no hopium. If
                the setup&apos;s there, I call it. If it&apos;s not, I say so.
                That&apos;s it.
              </p>
              <p>
                I&apos;m the founder of The Chuff Gang and run one of the
                largest trading communities in the space. Whether you&apos;re
                just getting started or managing a serious portfolio, I can help
                you read the market with clarity.
              </p>
            </motion.div>

            {/* Stats grid */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2"
            >
              {stats.map((stat, idx) =>
                stat.countEnd ? (
                  <CounterStatCard key={stat.label} stat={stat as typeof stats[number] & { countEnd: number; suffix: string }} index={idx} />
                ) : (
                  <StaticStatCard key={stat.label} stat={stat} index={idx} />
                )
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

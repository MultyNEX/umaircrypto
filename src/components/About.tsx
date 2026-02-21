"use client";

import { motion } from "framer-motion";
import { Users, Camera, AtSign, Clock, TrendingUp, MapPin } from "lucide-react";
import { useCounter } from "@/hooks/useCounter";
import { useTilt } from "@/hooks/useTilt";
import Image from "next/image";

const START_YEAR = 2020;
const yearsExp = new Date().getFullYear() - START_YEAR;

const stats = [
  { value: "200K+", label: "Traders in Community", icon: Users, countEnd: 200, suffix: "K+" },
  { value: "152K", label: "Instagram Followers", icon: Camera, countEnd: 152, suffix: "K" },
  { value: "30K+", label: "X Followers", icon: AtSign, countEnd: 30, suffix: "K+" },
  { value: `${yearsExp}+`, label: "Years in Crypto", icon: Clock, countEnd: yearsExp, suffix: "+" },
  { value: "BTC & ETH", label: "Specialist", icon: TrendingUp },
  { value: "UAE \u{1F1E6}\u{1F1EA}", label: "Based in", icon: MapPin },
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
    <section id="about" className="relative py-8 md:py-16 overflow-hidden">
      {/* Aurora orbs */}
      <div className="aurora-orb aurora-orb-teal top-[20%] right-[10%]" />

      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — Umair's photo */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex justify-center lg:justify-start"
          >
            <div className="relative w-full max-w-[480px]">
              <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-accent-primary/10 via-transparent to-accent-secondary/10 blur-2xl" />
              <div className="relative w-full rounded-2xl border border-white/[0.08] glass-enhanced overflow-hidden">
                <Image
                  src="/umair-about.png"
                  alt="Umair Orakzai - Crypto Analyst"
                  width={1024}
                  height={1328}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/60 via-transparent to-transparent" />
              </div>

              {/* "That's me!" label — points to Umair on the RIGHT of the photo */}
              <span className="hidden lg:block absolute -right-20 top-[1%] font-heading text-lg font-bold text-accent-primary drop-shadow-[0_0_16px_rgba(56,189,248,0.6)] whitespace-nowrap">
                That&apos;s me!
              </span>
              {/* Dashed arrow curving from label down to Umair (right side of photo) */}
              <svg
                className="hidden lg:block absolute right-[8%] top-[6%] w-24 h-[18%] text-accent-primary drop-shadow-[0_0_16px_rgba(56,189,248,0.5)]"
                viewBox="0 0 100 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M60 5 C58 30, 52 60, 50 95"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray="7 5"
                />
                {/* Arrowhead pointing down toward Umair */}
                <polygon
                  points="42,90 58,90 50,104"
                  fill="currentColor"
                />
              </svg>
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
              <div className="flex justify-center lg:justify-start mb-5">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-xs font-semibold uppercase tracking-widest shadow-[0_0_15px_rgba(56,189,248,0.15)]">
                  <TrendingUp size={14} />
                  The Analyst
                </span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold">
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
              className="space-y-4 text-text-secondary leading-relaxed text-sm sm:text-base"
            >
              <p>
                I&apos;ve been active in the crypto space since 2020, starting
                as a trader and evolving into a community builder and mentor.
                I&apos;ve built a community of 200,000+ traders and investors,
                founded Chuff Gang, and co-founded Thrive.
              </p>
              <p>
                I successfully predicted the 2023 bull market and called the
                2025 cycle top at $125K. My trading win rate for 2026 so far is
                95%. I&apos;ve completed multiple trading challenges and received
                awards from exchanges as a top-performing trader.
              </p>
              <p>
                Whether you&apos;re just starting out or already experienced, I
                help people understand crypto, improve their trading, and make
                smarter decisions — from fundamentals to advanced strategies.
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
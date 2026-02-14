"use client";

import { motion } from "framer-motion";
import { Users, Camera, AtSign, Clock, TrendingUp, MapPin } from "lucide-react";

const stats = [
  { value: "300K+", label: "Traders in Community", icon: Users },
  { value: "152K", label: "Instagram Followers", icon: Camera },
  { value: "26.8K", label: "X Followers", icon: AtSign },
  { value: "4+", label: "Years in Crypto", icon: Clock },
  { value: "BTC & ETH", label: "Specialist", icon: TrendingUp },
  { value: "UAE 🇦🇪", label: "Based in", icon: MapPin },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function About() {
  return (
    <section id="about" className="relative py-16 md:py-32">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — Visual placeholder (hidden on mobile — no photo yet) */}
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
              <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-bg-tertiary to-bg-secondary border border-border overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(42,42,62,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(42,42,62,0.4)_1px,transparent_1px)] bg-[size:30px_30px]" />
                <div className="absolute top-8 left-8 w-32 h-32 rounded-full bg-accent-primary/10 blur-3xl" />
                <div className="absolute bottom-8 right-8 w-32 h-32 rounded-full bg-accent-secondary/10 blur-3xl" />
                <span className="relative text-text-secondary text-sm font-medium tracking-wide">
                  PHOTO COMING SOON
                </span>
              </div>
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
                About Umair
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
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="relative rounded-2xl bg-bg-secondary/60 backdrop-blur-xl border border-white/[0.08] glass p-4 sm:p-5 hover:border-accent-primary/30 transition-colors duration-300"
                >
                  <stat.icon
                    size={16}
                    className="text-text-secondary mb-2.5"
                  />
                  <p className="font-heading font-bold text-xl sm:text-lg text-accent-primary">
                    {stat.value}
                  </p>
                  <p className="text-text-secondary text-xs mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function FinalCTA() {
  return (
    <section
      id="contact"
      className="relative py-20 md:py-36 overflow-hidden"
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 via-transparent to-accent-secondary/5 pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold">
            Ready to Trade{" "}
            <span className="text-accent-primary">With Clarity?</span>
          </h2>
          <p className="text-text-secondary text-base sm:text-lg max-w-xl mx-auto">
            Book your free consultation or message me directly.
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
        >
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl bg-accent-primary text-bg-primary hover:brightness-110 transition-all duration-200 shadow-[0_0_25px_rgba(0,212,170,0.35)] hover:shadow-[0_0_40px_rgba(0,212,170,0.55)]"
          >
            Book a Free Call
          </a>
          <a
            href="https://wa.me/PLACEHOLDER?text=Hi%20Umair,%20I'm%20interested%20in%20a%20consultation"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold rounded-xl border border-border text-text-primary hover:bg-bg-tertiary transition-all duration-200"
          >
            <MessageCircle size={18} />
            WhatsApp Me
          </a>
        </motion.div>
      </div>
    </section>
  );
}

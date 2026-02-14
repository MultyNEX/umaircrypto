"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  return (
    <div className="fixed bottom-6 right-6 z-50 group animate-bounce-gentle">
      {/* Tooltip */}
      <span className="absolute bottom-full right-0 mb-3 px-4 py-2 rounded-xl bg-bg-secondary/95 backdrop-blur-xl border border-accent-primary/30 text-text-primary text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-[0_0_20px_rgba(56,189,248,0.15)]">
        Chat with Umair
      </span>

      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-15" />

      {/* Button */}
      <a
        href="https://wa.me/PLACEHOLDER?text=Hi%20Umair,%20I'm%20interested%20in%20a%20consultation"
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-16 h-16 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 transition-transform duration-200"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={26} fill="white" strokeWidth={0} />
      </a>
    </div>
  );
}

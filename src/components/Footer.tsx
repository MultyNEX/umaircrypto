import { AtSign, Camera, MessageCircle, Gamepad2, Send } from "lucide-react";

const quickLinks = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Markets", href: "#markets" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

const socials = [
  {
    label: "X (Twitter)",
    href: "https://x.com/Umairorkz",
    icon: AtSign,
    handle: "@Umairorkz",
  },
  {
    label: "Instagram",
    href: "https://instagram.com/umairorkz",
    icon: Camera,
    handle: "@umairorkz",
  },
  {
    label: "WhatsApp",
    href: "https://whatsapp.com/channel/0029VaqMPvw7IUYQ2BHgwr2L",
    icon: MessageCircle,
    handle: "Channel",
  },
  {
    label: "Telegram",
    href: "https://t.me/umairfromx",
    icon: Send,
    handle: "Telegram",
  },
  {
    label: "Discord",
    href: "#",
    icon: Gamepad2,
    handle: "Coming Soon",
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg-secondary/40">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 text-center md:text-left">
          {/* Column 1 — Brand */}
          <div>
            <a
              href="#"
              className="font-heading text-xl font-bold tracking-tight"
            >
              UMAIR <span className="text-accent-primary">CRYPTO</span>
            </a>
            <p className="text-text-secondary text-sm mt-3 leading-relaxed max-w-xs mx-auto md:mx-0">
              Technical analysis. Real conviction.
            </p>
          </div>

          {/* Column 2 — Quick links */}
          <div>
            <h4 className="font-heading font-semibold text-sm uppercase tracking-widest text-text-secondary mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-text-secondary hover:text-text-primary text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Socials */}
          <div>
            <h4 className="font-heading font-semibold text-sm uppercase tracking-widest text-text-secondary mb-4">
              Socials
            </h4>

            {/* Icon-only row on mobile */}
            <div className="flex items-center justify-center gap-4 md:hidden">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-bg-tertiary/60 text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors duration-200"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>

            {/* Full list on desktop */}
            <ul className="hidden md:block space-y-2.5">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary text-sm transition-colors duration-200"
                  >
                    <social.icon size={16} />
                    {social.handle}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-text-secondary text-center">
          <p>&copy; 2026 Umair Crypto. All rights reserved.</p>
          <p>
            Not financial advice. Trading involves risk. Always do your own
            research.
          </p>
          <a
            href="#"
            className="hover:text-text-primary transition-colors duration-200"
          >
            Built by K1ngLFG
          </a>
        </div>
      </div>
    </footer>
  );
}

# Umair Crypto

Dark-mode, mobile-first crypto consultancy website for **Umair Crypto** (@Umairorkz) — featuring live market data, consultancy booking, crypto payments, and community links.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Live Prices:** TradingView Widgets (Ticker Tape + Advanced Chart)
- **Booking:** Cal.com
- **Crypto Payments:** NOWPayments
- **Contact:** WhatsApp floating button

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/umaircrypto.git
cd umaircrypto
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Deployment

This project is configured for deployment on [Vercel](https://vercel.com):

1. Push to GitHub
2. Import the repo on [vercel.com/new](https://vercel.com/new)
3. Deploy with default settings — no extra configuration needed

## Project Structure

```
src/
  app/
    layout.tsx        # Root layout with fonts + global providers
    page.tsx          # Single-page composition of all sections
    globals.css       # CSS variables, glass utilities, scrollbar
  components/
    Navbar.tsx        # Sticky navbar with mobile overlay menu
    TickerTape.tsx    # TradingView ticker tape (lazy loaded)
    Hero.tsx          # Hero section with CTAs + trust bar
    About.tsx         # Bio + stat cards
    LiveMarkets.tsx   # TradingView advanced chart (lazy loaded)
    Services.tsx      # Three-tier pricing cards
    HowItWorks.tsx    # Three-step process
    Testimonials.tsx  # Testimonial cards grid
    Payment.tsx       # Crypto payment section
    FAQ.tsx           # Accordion FAQ
    FinalCTA.tsx      # Final call-to-action
    Footer.tsx        # Footer with socials + quick links
    WhatsAppButton.tsx # Fixed WhatsApp floating button
  lib/
    utils.ts          # cn() class name utility
```

## License

All rights reserved.

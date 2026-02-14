# umaircrypto.com — Project Brief

## Project Overview

Build a dark-mode, mobile-first crypto consultancy website for **Umair Crypto** (@Umairorkz). Single-page site with live market data, consultancy booking, crypto payments, and WhatsApp contact.

---

## Client Profile

- **Full Name:** Umair Orakzai
- **Brand:** Umair Crypto
- **Based in:** UAE 🇦🇪
- **Founder of:** @thechuffgang

### Socials & Contact
- **Instagram:** @umairorkz (152K followers, 254 posts)
- **X (Twitter):** @Umairorkz (26.8K followers)
- **WhatsApp Channel:** "Umair Orakzai" — https://whatsapp.com/channel/0029VaqMPvw7IUYQ2BHgwr2L
- **Discord:** Has one (link TBD — get from client)
- **Email:** umairxbt@gmail.com
- **Community:** 300K+ traders
- **Total Social Following:** 178K+

### Expertise & Content
- **Focus:** BTC, ETH, altcoins (SUI, FIL, HYPE, LTC, PENDLE, ENA)
- **Expertise:** Technical analysis — SMA, RSI, volume profiles, POC levels, invalidation zones
- **Active Since:** May 2021 (4+ years)
- **Tone:** Direct, no-BS, confident. Writes like a trader — clear, sharp, no fluff.
- **Post Engagement:** 200K+ views on viral posts
- **Bio note:** "NOT A FINANCIAL ADVISER" — must include disclaimer on site

---

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Live Prices:** TradingView Widgets (Ticker Tape + Advanced Chart)
- **Booking:** Cal.com (embed or link)
- **Crypto Payments:** NOWPayments (button/link)
- **Contact:** WhatsApp floating button (wa.me link)
- **Hosting:** Vercel (free tier)
- **Domain:** umaircrypto.com (registered on Porkbun)

---

## Design Direction

### Theme: Dark mode primary. Crypto-native aesthetic.

### Color Palette
```
--bg-primary:      #0A0A0F    (near-black base)
--bg-secondary:    #12121A    (card backgrounds)
--bg-tertiary:     #1A1A2E    (hover states, subtle sections)
--accent-primary:  #00D4AA    (electric teal — CTAs, highlights)
--accent-secondary:#FFD700    (gold — premium/VIP elements)
--text-primary:    #F0F0F0    (main text)
--text-secondary:  #8B8B9E    (muted text, labels)
--border:          #2A2A3E    (subtle borders, dividers)
--danger:          #FF4757    (bearish/alerts)
--success:         #00D4AA    (bullish/confirmations)
```

### Typography
- **Headlines:** Bold, modern display font (e.g., Clash Display, Satoshi, or similar — NOT Inter, Roboto, or Arial)
- **Body:** Clean sans-serif (e.g., DM Sans, General Sans)
- **Numbers/Prices:** Monospace (e.g., JetBrains Mono, Space Mono)

### Design Elements
- Glassmorphism cards (semi-transparent, backdrop-blur)
- Subtle grid or dot pattern on background for depth
- Neon glow on primary CTA buttons (box-shadow with accent color)
- Smooth scroll animations (fade-up on section enter via Framer Motion)
- TradingView ticker tape running across top
- Floating WhatsApp button (bottom-right, always visible)

---

## Project Structure

```
umaircrypto/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout (fonts, metadata, WhatsApp button)
│   │   ├── page.tsx            # Homepage (all sections composed here)
│   │   └── globals.css         # Tailwind config + CSS variables
│   ├── components/
│   │   ├── Navbar.tsx          # Sticky nav with CTA button
│   │   ├── TickerTape.tsx      # TradingView scrolling prices
│   │   ├── Hero.tsx            # Main hero with headline + CTA
│   │   ├── LiveMarkets.tsx     # TradingView advanced chart
│   │   ├── About.tsx           # Bio section
│   │   ├── Services.tsx        # 3-tier consultancy cards
│   │   ├── HowItWorks.tsx      # 3-step process
│   │   ├── Testimonials.tsx    # Social proof cards
│   │   ├── Payment.tsx         # Crypto payment options
│   │   ├── FAQ.tsx             # Accordion FAQ
│   │   ├── FinalCTA.tsx        # Closing CTA section
│   │   ├── Footer.tsx          # Links, disclaimer, socials
│   │   └── WhatsAppButton.tsx  # Floating WhatsApp icon
│   └── lib/
│       └── utils.ts
├── public/
│   ├── umair-photo.jpg         # PLACEHOLDER — client to provide
│   └── og-image.jpg            # Social share image
├── tailwind.config.ts
├── next.config.js
└── package.json
```

---

## Page Sections (Top to Bottom)

### 1. Sticky Navbar
- Text logo: "UMAIR CRYPTO" (accent color on "CRYPTO")
- Nav links: About | Markets | Services | Testimonials | Contact
- CTA button (right): "Book a Call" (accent colored, glowing)
- Mobile: hamburger menu
- Transparent background, adds backdrop-blur on scroll

### 2. TradingView Ticker Tape
- Full-width scrolling ticker below nav
- Symbols: BTCUSDT, ETHUSDT, SOLUSDT, BNBUSDT, XRPUSDT
- Dark theme, transparent background
- Use TradingView embed script (not npm package — more reliable)

### 3. Hero Section
```
LEFT SIDE:
- Badge pill: "300K+ Traders Community" (subtle pulse animation)
- Headline: "Navigate Crypto Markets With Clarity."
- Subheadline: "Technical analysis. Real conviction. No fluff.
  Join 300,000+ traders who trust Umair Crypto for BTC, ETH,
  and altcoin insights."
- Two CTAs:
  [Book a Free Consultation] (primary, glowing)
  [Join the Community →] (ghost/outline → links to WhatsApp channel: https://whatsapp.com/channel/0029VaqMPvw7IUYQ2BHgwr2L)
- Trust bar: "152K+ Instagram · 26.8K X · 300K+ Traders · Since 2021"

RIGHT SIDE:
- Professional photo of Umair (placeholder for now — use gradient
  circle or stylized avatar placeholder)
```

### 4. Live Markets Section
```
Title: "Live Markets"
Subtitle: "Real-time prices. No delay."

- TradingView Advanced Chart widget (dark theme)
  Default: BTCUSDT, allow symbol change
- Height: ~500px, full width
- Lazy load this widget (it's heavy)
```

### 5. About Section
```
Title: "About Umair"

BIO TEXT (write in his voice):
"I've been in crypto since 2021. Started as a trader, built a
community of 300,000+ along the way. I focus on what the charts
tell me — SMA, RSI, volume, structure. No hype, no hopium. If
the setup's there, I call it. If it's not, I say so. That's it.

I'm the founder of The Chuff Gang and run one of the largest
trading communities in the space. Whether you're just getting
started or managing a serious portfolio, I can help you read
the market with clarity."

STATS (accent-colored numbers):
- 300K+ Traders in Community
- 152K Instagram Followers
- 26.8K X Followers
- 4+ Years in Crypto
- BTC & ETH Specialist
- Based in UAE 🇦🇪
```

### 6. Services Section
```
Title: "Work With Me"
Subtitle: "Choose the plan that fits your level."

THREE CARDS (glassmorphism):

STARTER — "1-on-1 Chart Review"
- 30-minute session
- Portfolio overview
- Key levels & entries
- Price: $XX (placeholder)
- CTA: [Book Now]

PRO (highlighted, gold border, "Most Popular" badge) — "Full Consultation"
- 60-minute deep dive
- Complete portfolio audit
- Custom trading plan
- Ongoing support (7 days)
- Price: $XX (placeholder)
- CTA: [Book Now]

VIP — "Ongoing Mentorship"
- Weekly calls
- Private group access
- Priority chart analysis
- Custom alerts
- Price: "Let's Talk"
- CTA: [Message on WhatsApp]
```

### 7. How It Works
```
Three steps, horizontal on desktop:

Step 1: "Book a Call" — Pick a time that works
Step 2: "We Talk Strategy" — Share your portfolio, get analysis
Step 3: "Trade With Confidence" — Clear plan, clear levels
```

### 8. Testimonials
```
Title: "What Traders Say"

SAMPLE TESTIMONIALS (placeholders — client to provide real ones):

1. "Umair's chart analysis is on another level. Called the BTC
   bounce at $85K before anyone else saw it."
   — Ahmad R., Crypto Trader

2. "Joined the community 6 months ago. Best decision I made.
   The TA breakdowns are worth 10x the consultation fee."
   — Sarah K., Portfolio Manager

3. "No hype, no hopium — just clean analysis. Exactly what I
   needed to stop losing money on bad entries."
   — Bilal M., Day Trader

4. "The VIP mentorship changed how I read charts. I finally
   understand structure, not just price."
   — Fatima Z., Swing Trader
```

### 9. Payment Section
```
Title: "Pay With Crypto"
Subtitle: "Fast, secure, non-custodial."

Show accepted: BTC, ETH, USDT, USDC + 350 more via NOWPayments
Payment button or link (placeholder URL for now)
WhatsApp CTA: "Prefer to discuss first?"

Visual: Crypto coin icons with subtle float animation
```

### 10. FAQ Section
```
Accordion style (expandable):

Q: How do I book a consultation?
A: Click "Book a Call" anywhere on the site. Pick a time and
   you'll get a confirmation with a meeting link.

Q: What cryptocurrencies can I pay with?
A: BTC, ETH, USDT, USDC, and 350+ other coins via our secure
   payment gateway.

Q: Do you offer refunds?
A: Please reach out via WhatsApp to discuss any concerns.

Q: Can I join the community without a consultation?
A: Yes! Follow @umairorkz on Instagram and X, or join
   the WhatsApp channel for free market updates.

Q: What markets do you cover?
A: Primarily BTC and ETH, plus major altcoins including SOL,
   SUI, LTC, and others based on current setups.

Q: Is this financial advice?
A: No. All analysis is educational and for informational
   purposes only. Always do your own research.
```

### 11. Final CTA Section
```
Full-width dark section with accent gradient overlay

Headline: "Ready to Trade With Clarity?"
Subheadline: "Book your free consultation or message me directly."

Two CTAs:
[Book a Free Call] → Cal.com link (placeholder)
[WhatsApp Me] → wa.me link (placeholder)
```

### 12. Footer
```
- Logo: UMAIR CRYPTO
- Quick links: About | Services | Markets | Contact
- Socials:
  - X: @Umairorkz
  - Instagram: @umairorkz
  - WhatsApp Channel: https://whatsapp.com/channel/0029VaqMPvw7IUYQ2BHgwr2L
  - Discord: (link TBD)
- Disclaimer: "Not financial advice. Trading involves risk.
  Always do your own research."
- © 2026 Umair Crypto. All rights reserved.
```

### 13. Floating WhatsApp Button
```
Fixed, bottom-right, always visible on all pages
Green WhatsApp icon (#25D366)
Subtle pulse animation
Links to: https://wa.me/PLACEHOLDER?text=Hi%20Umair,%20I'm%20interested%20in%20a%20consultation
On hover: scale up slightly
```

---

## SEO Metadata

```
Title: Umair Crypto | Crypto Trading Consultant & Analyst
Description: Join 300K+ traders. Expert BTC & ETH technical analysis,
1-on-1 consultations, and a thriving crypto trading community. 152K+
on Instagram.
OG Image: 1200x630 branded image (create later)
Twitter Card: summary_large_image
Twitter Creator: @Umairorkz
```

---

## Placeholder Items (Client Will Provide Later)

- [ ] Professional headshot photo
- [ ] WhatsApp number for payment/consultation contact (separate from channel)
- [ ] Crypto wallet addresses (BTC, ETH, USDT)
- [ ] Service pricing (exact numbers)
- [ ] Real testimonials from community
- [ ] Cal.com booking link
- [ ] NOWPayments payment link
- [ ] Discord community invite link
- [ ] Logo (if any — text logo is fine for now)

## Already Collected (Real Data)

- [x] Full name: Umair Orakzai
- [x] Brand: Umair Crypto
- [x] Location: UAE
- [x] Instagram: @umairorkz (152K)
- [x] X: @Umairorkz (26.8K)
- [x] WhatsApp Channel: https://whatsapp.com/channel/0029VaqMPvw7IUYQ2BHgwr2L
- [x] Email: umairxbt@gmail.com
- [x] Community: 300K+ traders
- [x] Founder of @thechuffgang
- [x] Content style: TA-focused, SMA/RSI/volume analysis
- [x] Disclaimer: "NOT A FINANCIAL ADVISER"

---

## Build Order

1. Scaffold Next.js + Tailwind + TypeScript
2. Set up color theme, fonts, CSS variables in globals.css and tailwind.config.ts
3. Build Navbar (sticky, transparent → blur on scroll)
4. Build TradingView Ticker Tape
5. Build Hero section
6. Build About section
7. Build Live Markets (TradingView chart)
8. Build Services cards
9. Build How It Works
10. Build Testimonials
11. Build Payment section
12. Build FAQ accordion
13. Build Final CTA
14. Build Footer
15. Add WhatsApp floating button
16. Mobile responsive pass
17. Framer Motion animations
18. SEO meta tags + OG image
19. Deploy to Vercel
20. Connect umaircrypto.com domain

---

## Important Notes

- Mobile-first: every section must look great on 375px first
- Touch-friendly CTAs: minimum 48px tap target
- Lazy-load TradingView widgets (they're heavy)
- Target load time: under 2 seconds on 4G
- No external CSS frameworks besides Tailwind
- All in one page — no routing needed for MVP
- Use Next.js Image component for optimized images
- Keep the code clean, well-commented, and maintainable

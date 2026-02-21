import sharp from "sharp";
import { writeFileSync } from "fs";
import { join } from "path";

const PUBLIC = join(import.meta.dirname, "..", "public");

// ─── SVG monogram builder ──────────────────────────────────────────
function ucMonogramSVG(size) {
  // Scale factor — design at 512 base, scale for other sizes
  const s = size / 512;

  // Font sizes tuned per target
  let fontSize, letterSpacing, yOffset;
  if (size <= 32) {
    // Tiny sizes: bolder, bigger letters, tighter
    fontSize = 340 * s;
    letterSpacing = 20 * s;
    yOffset = 10 * s;
  } else if (size <= 64) {
    fontSize = 310 * s;
    letterSpacing = 22 * s;
    yOffset = 8 * s;
  } else {
    fontSize = 280 * s;
    letterSpacing = 24 * s;
    yOffset = 5 * s;
  }

  // Rounded rect padding
  const pad = size * 0.08;
  const radius = size * 0.18;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <!-- Pink to blue gradient (top-left to bottom-right) -->
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E74694"/>
      <stop offset="50%" stop-color="#A855F7"/>
      <stop offset="100%" stop-color="#38BDF8"/>
    </linearGradient>
    <!-- Outer glow -->
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="${size * 0.02}"/>
    </filter>
    <!-- Border gradient -->
    <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E74694" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#38BDF8" stop-opacity="0.6"/>
    </linearGradient>
  </defs>

  <!-- Dark background with rounded corners -->
  <rect x="0" y="0" width="${size}" height="${size}" rx="${radius}" fill="#060612"/>

  <!-- Subtle border -->
  <rect x="${pad * 0.4}" y="${pad * 0.4}" width="${size - pad * 0.8}" height="${size - pad * 0.8}" rx="${radius * 0.9}" fill="none" stroke="url(#borderGrad)" stroke-width="${Math.max(1, size * 0.02)}"/>

  <!-- Glow layer behind text -->
  <text
    x="50%" y="${50 + yOffset}%"
    text-anchor="middle"
    dominant-baseline="central"
    font-family="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
    font-weight="900"
    font-size="${fontSize}"
    letter-spacing="${letterSpacing}"
    fill="url(#grad)"
    filter="url(#glow)"
    opacity="0.5"
  >UC</text>

  <!-- Main text -->
  <text
    x="50%" y="${50 + yOffset}%"
    text-anchor="middle"
    dominant-baseline="central"
    font-family="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
    font-weight="900"
    font-size="${fontSize}"
    letter-spacing="${letterSpacing}"
    fill="url(#grad)"
  >UC</text>
</svg>`;
}

// ─── Generate PNG at a given size ──────────────────────────────────
async function generatePNG(size, filename) {
  const svg = ucMonogramSVG(size);
  const buf = await sharp(Buffer.from(svg))
    .resize(size, size)
    .png({ quality: 100, compressionLevel: 9 })
    .toBuffer();
  const path = join(PUBLIC, filename);
  writeFileSync(path, buf);
  console.log(`  ✓ ${filename} (${size}x${size})`);
  return buf;
}

// ─── Generate ICO (multi-size) ─────────────────────────────────────
function createICO(buffers16, buffers32) {
  // ICO format: header + entries + image data
  const images = [
    { size: 16, buf: buffers16 },
    { size: 32, buf: buffers32 },
  ];

  const headerSize = 6;
  const entrySize = 16;
  const numImages = images.length;

  let offset = headerSize + entrySize * numImages;
  const entries = [];
  const datas = [];

  for (const img of images) {
    entries.push({
      width: img.size === 256 ? 0 : img.size,
      height: img.size === 256 ? 0 : img.size,
      offset,
      size: img.buf.length,
    });
    datas.push(img.buf);
    offset += img.buf.length;
  }

  const totalSize = offset;
  const ico = Buffer.alloc(totalSize);

  // Header
  ico.writeUInt16LE(0, 0); // reserved
  ico.writeUInt16LE(1, 2); // ICO type
  ico.writeUInt16LE(numImages, 4); // count

  // Entries
  let pos = headerSize;
  for (const entry of entries) {
    ico.writeUInt8(entry.width, pos);
    ico.writeUInt8(entry.height, pos + 1);
    ico.writeUInt8(0, pos + 2); // color palette
    ico.writeUInt8(0, pos + 3); // reserved
    ico.writeUInt16LE(1, pos + 4); // color planes
    ico.writeUInt16LE(32, pos + 6); // bits per pixel
    ico.writeUInt32LE(entry.size, pos + 8);
    ico.writeUInt32LE(entry.offset, pos + 12);
    pos += entrySize;
  }

  // Image data
  for (const data of datas) {
    data.copy(ico, pos);
    pos += data.length;
  }

  return ico;
}

// ─── Main ──────────────────────────────────────────────────────────
async function main() {
  console.log("Generating UC monogram icons...\n");

  // Generate all PNG sizes
  const buf16 = await generatePNG(16, "favicon-16x16.png");
  const buf32 = await generatePNG(32, "favicon-32x32.png");
  await generatePNG(180, "apple-touch-icon.png");
  await generatePNG(192, "android-chrome-192x192.png");
  await generatePNG(512, "android-chrome-512x512.png");

  // Generate favicon.ico (multi-size: 16 + 32)
  const ico = createICO(buf16, buf32);
  writeFileSync(join(PUBLIC, "favicon.ico"), ico);
  console.log("  ✓ favicon.ico (16+32 multi-size)");

  console.log("\nDone! All icons regenerated.");
}

main().catch(console.error);

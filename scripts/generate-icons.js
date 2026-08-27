import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '..', 'public');
const iconsDir = path.join(publicDir, 'icons');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Master SVG template for Standard Icon (Beautiful Greek Blue Gradient + Golden Laurel Wreath + Lambda)
function createSvg(size, isMaskable = false) {
  const padding = isMaskable ? size * 0.18 : size * 0.08;
  const contentSize = size - padding * 2;
  const center = size / 2;
  const radius = isMaskable ? 0 : size * 0.22;

  return `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#005ba1" />
      <stop offset="50%" stop-color="#003e73" />
      <stop offset="100%" stop-color="#002142" />
    </linearGradient>

    <!-- Accent Gold Gradient for Lambda & Accents -->
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="50%" stop-color="#F3F7FA" />
      <stop offset="100%" stop-color="#D0E4FF" />
    </linearGradient>

    <linearGradient id="goldAccent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCD34D" />
      <stop offset="100%" stop-color="#F59E0B" />
    </linearGradient>

    <!-- Subtle Glow Filter -->
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="${size * 0.015}" stdDeviation="${size * 0.02}" flood-color="#001428" flood-opacity="0.5"/>
    </filter>

    <filter id="letterShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="${size * 0.01}" stdDeviation="${size * 0.015}" flood-color="#001830" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- Background Layer -->
  ${
    isMaskable
      ? `<rect width="${size}" height="${size}" fill="url(#bgGrad)" />`
      : `<rect width="${size}" height="${size}" rx="${radius}" fill="url(#bgGrad)" />`
  }

  <!-- Geometric Greek Pattern Accent (Subtle Inner Border) -->
  <rect x="${padding + contentSize * 0.03}" y="${padding + contentSize * 0.03}" 
        width="${contentSize * 0.94}" height="${contentSize * 0.94}" 
        rx="${isMaskable ? size * 0.08 : radius * 0.8}" 
        fill="none" 
        stroke="rgba(255, 255, 255, 0.15)" 
        stroke-width="${Math.max(1, size * 0.008)}" 
        stroke-dasharray="${size * 0.03} ${size * 0.015}" />

  <!-- Center Circle Shield / Laurel Ring -->
  <circle cx="${center}" cy="${center}" r="${contentSize * 0.42}" 
          fill="rgba(0, 45, 90, 0.4)" 
          stroke="rgba(252, 211, 77, 0.35)" 
          stroke-width="${Math.max(1, size * 0.01)}" />

  <!-- Greek Lambda 'Λ' Typography & Classical Elegance -->
  <g filter="url(#letterShadow)">
    <text x="${center}" y="${center + contentSize * 0.22}" 
          font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Cinzel', serif" 
          font-size="${contentSize * 0.62}" 
          font-weight="900" 
          text-anchor="middle" 
          fill="url(#goldGrad)" 
          letter-spacing="-1">Λ</text>
  </g>

  <!-- Subtle Gold Crown / Pillar Star at the apex of Lambda -->
  <circle cx="${center}" cy="${center - contentSize * 0.28}" r="${contentSize * 0.045}" fill="url(#goldAccent)" filter="url(#glow)"/>

  <!-- Subtitle / Brand Mark 'LOGOS' at the bottom of the shield -->
  <text x="${center}" y="${center + contentSize * 0.38}" 
        font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" 
        font-size="${contentSize * 0.09}" 
        font-weight="800" 
        text-anchor="middle" 
        letter-spacing="${contentSize * 0.025}" 
        fill="#93C5FD">LOGOS</text>
</svg>
`;
}

// Generate all sizes
const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-48x48.png', size: 48 },
  { name: 'icon-72x72.png', size: 72 },
  { name: 'icon-96x96.png', size: 96 },
  { name: 'icon-128x128.png', size: 128 },
  { name: 'icon-144x144.png', size: 144 },
  { name: 'icon-152x152.png', size: 152 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192x192.png', size: 192 },
  { name: 'icon-384x384.png', size: 384 },
  { name: 'icon-512x512.png', size: 512 },
  { name: 'icon-512x512-maskable.png', size: 512, isMaskable: true }
];

async function run() {
  console.log('Generating PWA Greek App Icons...');

  // Save Master SVG
  const masterSvg = createSvg(512, false);
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), masterSvg);
  fs.writeFileSync(path.join(iconsDir, 'icon-master.svg'), masterSvg);

  for (const item of sizes) {
    const svg = createSvg(item.size, item.isMaskable || false);
    const destInIcons = path.join(iconsDir, item.name);
    const destInPublic = path.join(publicDir, item.name);

    const buffer = await sharp(Buffer.from(svg))
      .png({ quality: 100, compressionLevel: 9 })
      .toBuffer();

    fs.writeFileSync(destInIcons, buffer);
    fs.writeFileSync(destInPublic, buffer);
    console.log(`✓ Generated ${item.name} (${item.size}x${item.size})`);
  }

  // Also create root favicon.ico compatible copy from 32x32 or 48x48
  const icoBuffer = await sharp(Buffer.from(createSvg(48)))
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);

  console.log('All PWA Icons generated successfully!');
}

run().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});

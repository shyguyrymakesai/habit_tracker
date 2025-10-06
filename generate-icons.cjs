const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Create a simple SVG icon with the app initial
const createSVG = (size, text, bgColor, textColor) => `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="${bgColor}"/>
  <text 
    x="50%" 
    y="50%" 
    font-size="${size * 0.6}" 
    font-family="Arial, sans-serif" 
    font-weight="bold" 
    fill="${textColor}" 
    text-anchor="middle" 
    dominant-baseline="central"
  >${text}</text>
</svg>
`;

const publicDir = path.join(__dirname, 'public');

// Create directory if it doesn't exist
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate icons
async function generateIcons() {
  try {
    // 192x192 icon
    await sharp(Buffer.from(createSVG(192, 'H', '#3b82f6', '#ffffff')))
      .png()
      .toFile(path.join(publicDir, 'pwa-192.png'));
    console.log('✓ Created pwa-192.png');

    // 512x512 icon
    await sharp(Buffer.from(createSVG(512, 'H', '#3b82f6', '#ffffff')))
      .png()
      .toFile(path.join(publicDir, 'pwa-512.png'));
    console.log('✓ Created pwa-512.png');

    // 512x512 maskable icon (with padding for safe zone)
    await sharp(Buffer.from(createSVG(512, 'H', '#3b82f6', '#ffffff')))
      .extend({
        top: 51,
        bottom: 51,
        left: 51,
        right: 51,
        background: '#3b82f6'
      })
      .resize(512, 512)
      .png()
      .toFile(path.join(publicDir, 'pwa-maskable.png'));
    console.log('✓ Created pwa-maskable.png');

    console.log('\n✅ All PWA icons generated successfully!');
    console.log('Note: These are placeholder icons. Replace them with custom designs for production.');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();

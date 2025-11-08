# Icon Generation Guide for Puranveshana

## Quick Method: Use the Icon Generator Tool

I've created an HTML tool to generate all your icons with the orange pin theme.

### Steps:

1. **Open the generator:**
   ```bash
   open scripts/generate-icons.html
   ```
   (Or navigate to `/scripts/generate-icons.html` in your browser)

2. **Download each icon:**
   - Click each "Download" button
   - Save the files directly to your `/public` folder

3. **Icons you'll get:**
   - `favicon.ico` (32x32) - Browser tab icon
   - `apple-touch-icon.png` (180x180) - iOS home screen
   - `icon-192.png` (192x192) - PWA small icon
   - `icon-512.png` (512x512) - PWA large icon
   - `logo.png` (256x256) - General purpose logo
   - `og-image.jpg` (1200x630) - Social media sharing

## Alternative Method: Use Online Tools

If you prefer, you can also use these online tools:

### 1. Favicon Generator
- Go to: https://favicon.io/favicon-generator/
- Use these settings:
  - Text: P (or pin emoji 📍)
  - Background: #ea580c (orange)
  - Font: Choose any bold font
  - Download and extract to `/public`

### 2. For Social Media Image (OG Image)
- Go to: https://www.canva.com
- Create 1200x630px design
- Add orange pin icon
- Add text: "Puranveshana - Heritage Discovery"
- Use gradient: amber → orange → white
- Export as JPG → Save as `og-image.jpg`

## Current Status

✅ `favicon.svg` - Created (SVG version)
⏳ `favicon.ico` - Generate using tool above
⏳ `apple-touch-icon.png` - Generate using tool above
⏳ `icon-192.png` - Generate using tool above
⏳ `icon-512.png` - Generate using tool above
⏳ `logo.png` - Generate using tool above
⏳ `og-image.jpg` - Generate using tool above

## Orange Pin Color Code

Primary Orange: `#ea580c` (Tailwind orange-600)
Accent Orange: `#fed7aa` (Tailwind orange-200)

## After Generating Icons

1. Verify all files are in `/public` folder:
   ```bash
   ls -la public/*.{ico,png,jpg,svg}
   ```

2. Test the favicon by running:
   ```bash
   npm run dev
   ```
   Then open http://localhost:3000 and check the browser tab

3. Verify in production after deploying to Vercel

## Design Specifications

All icons feature:
- Orange pin/map marker design (#ea580c)
- Clean, minimal style
- White or gradient backgrounds
- Optimized for both light and dark modes
- Consistent with Puranveshana brand

---

**Need help?** The SVG favicon is already created and will work in most modern browsers!

# ShaQR

**Fast, high-density vector QR engine.**

ShaQR is a handcrafted, senior-grade frontend utility for generating customizable, high-resolution QR codes directly in the browser.

## Features

- ⚡️ **Blazing Fast**: Pure vanilla JS with zero build-step overhead.
- 🎨 **Bespoke UI**: Premium dark mode design system (Zinc Black, Electric Amber) crafted from scratch.
- 🔄 **Multi-Mode Payload**: Seamlessly switch between URL, Text, Wi-Fi, and vCard payloads.
- ⚙️ **Engine Controls**: Granular control over dot styles, corner anchors, error correction, and colors.
- 🛡️ **Safety Checks**: Automatic scannability checks (auto-boosts error correction when adding a logo).
- 📤 **Exports**: Live vector preview with high-res PNG (up to 4096px) and scalable SVG exports.
- 📋 **Clipboard API**: Copy generated image or payload strings directly to your system clipboard.

## Deployment (Vercel)

This project is a clean, static frontend and requires zero configuration to deploy.

1. Install Vercel CLI (optional): `npm i -g vercel`
2. Run `vercel` in the root directory.

Or, push to a GitHub repository and import the project in the Vercel dashboard. The included `vercel.json` ensures clean routing.

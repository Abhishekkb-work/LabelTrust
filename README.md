# LabelTrust Checker 🇮🇳

> **FSSAI Food Safety Trust Score & Label Verification Prototype for Indian Consumers**

LabelTrust Checker is a mobile-first web application designed for the Indian context to address food quality information asymmetry. Shoppers can scan product barcodes, photograph food labels for AI-assisted OCR extraction, verify official 14-digit FSSAI license records, inspect past violations or recall notices, and review transparent crowdsourced consumer feedback.

---

## 🌟 Key Features

- **Barcode & QR Code Scanner**: Live WebRTC camera scanner and instant 1-click test presets for popular Indian food brands (Amul, MDH, Patanjali, Dabur, Fortune, etc.).
- **Multimodal AI Label OCR**: Powered by Google Gemini 3.8 Flash to extract 14-digit FSSAI numbers, ingredients, batch codes, and identify ambiguous packaging claims.
- **FSSAI Regulatory Integration**: Decodes 14-digit license numbers into issuing state jurisdiction, central vs. state registration type, validity period, and official enforcement notices.
- **Transparent Trust Score (0–100)**: Rule-based, weighted scoring combining verified government compliance (60%) and community incident reports (40%).
- **Crowdsourced Incident Feedback**: Interactive reporting for consumers to record issues (packaging flaws, foreign particles, odor) or verify fresh quality with guest mode support.
- **Side-by-Side Comparison**: Compare up to 4 food products simultaneously on trust tiers, recall history, and price per unit.
- **Indian Multilingual Ready**: English, Hindi (हिन्दी), and Kannada (ಕನ್ನಡ) UI support.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- `npm` or `bun`

### Installation

1. Clone or download your repository:
   ```bash
   git clone https://github.com/<your-username>/labeltrust-checker.git
   cd labeltrust-checker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory (based on `.env.example`):
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API key:
   ```env
   GEMINI_API_KEY="your_gemini_api_key_here"
   PORT=3000
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploying to GitHub Pages

The repository is pre-configured so that **any deployment option in GitHub Pages works out-of-the-box**:

### Method 1: Deploy from Branch (Simplest & Direct)
1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Deploy LabelTrust Checker"
   git push origin main
   ```
2. In your GitHub repository, navigate to **Settings** → **Pages** (in the left sidebar).
3. Under **Branch**:
   - Choose `main`
   - In the folder dropdown, you can select either **`/ (root)`** or **`/docs`** (both are pre-bundled and work!).
4. Click **Save**. Your site will be live in 1-2 minutes without any blank screen!

### Method 2: Deploy with GitHub Actions
1. Go to **Settings** → **Pages**.
2. Under **Build and deployment** → **Source**, select **GitHub Actions**.
3. Push to `main`. The included workflow (`.github/workflows/deploy.yml`) will automatically build and publish the latest site.

### Method 3: One-Command CLI Deploy
```bash
npm run deploy
```
This builds into `dist` and pushes directly to a `gh-pages` branch.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React, Motion, Canvas-Confetti
- **Backend**: Node.js, Express, Vite middleware
- **AI / Multimodal OCR**: Google Gen AI SDK (`@google/genai`) with Gemini 3.8 Flash
- **Barcode & QR Processing**: `html5-qrcode`

---

## 📄 License & Disclaimer

This project is a hackathon prototype developed for consumer awareness. The Trust Score algorithm synthesizes public regulatory filings from FSSAI / FoSCoS and crowdsourced community reports. It does not certify chemical composition or legal adulteration without certified laboratory testing by an NABL-accredited food lab.

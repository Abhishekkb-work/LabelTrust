# LabelTrust Checker – Build Plan (Hackathon Prototype)

---

## 1. Problem Statement

In India, price-conscious consumers buy a large share of their food as branded packaged products, both offline and online. However:

- **Information asymmetry**: Consumers see only branding, marketing claims, and limited label text. They cannot easily verify if:
  - The **FSSAI license number** is valid and active.
  - The **manufacturer details** match the license.
  - The product or brand has had **violations, fines, or recalls** in the past.
- **Opaque accountability**: Regulatory data (FSSAI, state labs, recall notices) is scattered, hard to search on a phone, and not presented in simple, comparable form at point of purchase.
- **Lack of consumer-friendly tools**: There are few low-cost, easy tools that:
  - Work with barcodes/QR codes and label photos.
  - Combine **official regulatory data** with **user-reported test/experience data**.
  - Clearly distinguish **verified facts** from **unverified reports**.
- **Weak incentives for safety innovation**: Because consumers cannot easily compare products on safety, brands face more pressure on price and marketing than on transparent quality.

This leads to a situation where many consumers **cannot judge risk** and may unknowingly buy products from manufacturers with weak safety practices or past violations, even when safer alternatives exist at similar prices.

---

## 2. Solution Overview

**LabelTrust Checker** is a mobile/web prototype that lets users scan or photograph packaged food labels and instantly see a **simple, transparent “trust score”** for that product and brand.

Core ideas:

- **Input**: 
  - Scan a **barcode/QR code** or
  - Upload/take a **photo of the label** (for OCR of FSSAI license, brand name, etc.).
- **Processing**:
  - Extract **FSSAI license number** and key label text via OCR and/or barcode decoding.
  - Query public/regulatory data (FSSAI or other open datasets) for:
    - License validity, status, and manufacturer details.
    - Any recorded **violations**, **recalls**, or **court orders** linked to the license/brand/product.
  - Incorporate **crowdsourced user feedback** (simple reports of issues, third‑party test results, or positive experiences).
- **Output**:
  - A **one‑tap trust score** (e.g., 0–100, plus traffic-light color coding) that is:
    - Clearly broken down into components (regulatory history vs user feedback).
    - Explicit about which data is **verified** vs **user‑reported/unverified**.
  - A **comparison view** so users can compare similar products by trust score, not just price.

The prototype is designed as a **low-cost, open-source–friendly web/mobile app** suitable for the Indian context, optimized for:

- Low-end Android phones and mobile web.
- Intermittent connectivity (basic caching).
- Simple UI, multi-language ready (starting with English + 1–2 Indian languages if time allows).

No part of the system will **assert that a product is adulterated**. Instead, it will:

- Surface **verified regulatory actions** (e.g., official recall) clearly.
- Show **user reports** as “unverified community feedback.”
- Use neutral language like “Higher risk / Lower risk / Needs caution / No known issues in our data,” never “definitely adulterated” without concrete, verifiable lab test evidence.

---

## 3. Target Users

**Primary target user**:  
Price-conscious Indian consumers buying **branded packaged foods**, especially:

- Shoppers in **kirana stores**, supermarkets, and modern retail.
- Users buying from **e-commerce platforms** (Amazon, BigBasket, Blinkit, etc.).
- College students and young professionals who:
  - Are tech‑savvy.
  - Care about both **price** and **safety**.
  - Are willing to contribute feedback if the UI is simple.

**User needs:**

- **Fast, one-tap check**: Scan barcode / take a picture and get a result in 3–5 seconds.
- **Understandable trust indicator**: Simple score + color code and short explanation.
- **Transparent source labeling**:
  - What is from **regulators** vs **community**.
  - Clear indication when **data is missing or incomplete**.
- **Low data usage, low friction**: Works in cheap phones, no heavy downloads; optional login for feedback.
- **Privacy-respecting**: Minimal personal data collected; feedback can be anonymous/pseudonymous.

---

## 4. Key Features

These features must be implemented in the prototype and referenced across the build:

1. **Barcode/QR Code Scanner**
   - Scan product barcode/QR to auto-fetch or look up:
     - Product identifier (e.g., GTIN / barcode number).
     - Linked **FSSAI license number** (if available from mapping or OCR fallback).
   - Provide fallback manual entry of **FSSAI license number** if scanning fails.

2. **Regulatory Data Integration**
   - Query one or more **public regulatory/open data sources** to get:
     - FSSAI license validity and status.
     - Manufacturer name, address, category.
     - Available violation/recall/notice records linked to license/brand.
   - Cache results locally (for the hackathon app) for faster subsequent lookups.

3. **Crowdsourced Feedback System**
   - Simple in-app form for users to submit:
     - Observed issues (e.g., off smell, foreign objects, expiry mismatch).
     - Links/attachments (optional) about lab tests or media reports.
     - Basic rating (e.g., “No issue”, “Minor issue”, “Serious issue”).
   - Display community feedback counts and text snippets, with clear **“user-reported”** labels.

4. **Trust Score Calculation**
   - Algorithm that combines:
     - **Verified regulatory data** (license validity, violation history).
     - **User-reported feedback** (volume, recency, severity, credibility signals).
   - Output:
     - A **numeric trust score** (e.g., 0–100).
     - Category labels (e.g., “High Trust”, “Medium Trust”, “Low Trust”, “Insufficient Data”).
   - Show a **breakdown** so users can see how score was derived.

5. **Product Comparison Tool**
   - Allow users to:
     - Add multiple scanned/searched products to a **comparison list**.
     - View a side-by-side comparison of:
       - Trust scores.
       - Key regulatory info (license status, violations).
       - Price (if user enters or from integrated source).
   - Highlight safer/high-trust options visually.

---

## 5. User Flow

### 5.1 Onboarding & Home

1. **User opens app / web app**.
2. **Onboarding screen** (1–2 panels):
   - Explains:
     - This app helps you understand food safety risk using **public data and community reports**.
     - It **does not prove adulteration** and is **not an official FSSAI tool**.
   - Ask user to:
     - Accept **terms & privacy** (simple modal).
3. **Home screen** shows:
   - “Scan Barcode/QR” button.
   - “Scan/Upload Label Photo” button.
   - “Search by FSSAI License / Brand” small text link (optional).
   - “Compare Products (0)” disabled state.

### 5.2 Flow A: Barcode/QR Code Scan

1. User taps **“Scan Barcode/QR”**.
2. App requests **camera permission**.
3. Barcode scanner opens (using HTML5/WebRTC for PWA or native library for mobile).
4. On successful scan:
   - Extract barcode number/QR data.
   - Check local mapping table (if created) for:
     - Product name, brand, FSSAI license number (if known).
   - If mapping found:
     - Proceed to **Regulatory Lookup**.
   - If not:
     - Ask user to:
       - Option 1: **Take label photo** for OCR.
       - Option 2: **Enter FSSAI license number manually**.

### 5.3 Flow B: Label Photo (OCR)

1. User taps **“Scan/Upload Label Photo”** from home or fallback from barcode flow.
2. Options:
   - **Take Photo** (camera) or **Upload from Gallery**.
3. After user provides image:
   - Show simple cropping/zoom (optional, if time).
   - Run **OCR** on the image (focusing on text blocks).
   - Try to extract:
     - “FSSAI” followed by numeric license (e.g., 14-digit).
     - Brand/manufacturer names.
4. If FSSAI license is detected:
   - Show confirmation screen: “We detected this license number: XXXXX. Continue?”
   - On confirm, proceed to **Regulatory Lookup**.
5. If extraction ambiguous:
   - Highlight candidate numbers and let user manually confirm or correct.
6. If OCR fails:
   - Allow **manual license entry**.

### 5.4 Regulatory Lookup & Data Fusion

1. Once barcode/license number is known:
   - Show **loading state**: “Checking FSSAI records and community feedback…”
2. Backend queries:
   - **Regulatory Data Integration** service to fetch:
     - License details & status (active/expired/suspended).
     - Any known violations/recalls linked to license/brand (from sample dataset).
   - **Crowdsourced Feedback** service to fetch:
     - Count of reports by severity.
     - Recent reports (e.g., last 6 months).
3. Backend computes **Trust Score** and returns:
   - Score, category, and explanation pieces.

### 5.5 Product Detail & Trust Score Display

1. **Product Detail Screen** shows:

   - **Top section**:
     - Product name (from mapping or user-entered).
     - Brand name.
     - Main **Trust Score**:
       - Big number (0–100) with colored ring (green/amber/red/grey).
       - Label (“High Trust”, “Medium Trust”, “Low Trust”, “Insufficient Data”).
     - One-line summary:
       - Example: “Active license, no recorded violations found, few minor user reports.”

   - **Regulatory Data Card** (clearly labeled “Verified information”):
     - FSSAI license number.
     - Status: Active / Expired / Suspended / Unknown.
     - Manufacturer name & address.
     - Violations/recalls:
       - If any: show count and short descriptors (“1 recall in 2022: label mismatch”).
       - Link/ID to source (URL or dataset reference).
     - Badge: “Source: Public regulatory/official data” (not FSSAI-official app).

   - **Community Feedback Card** (clearly labeled “User-reported, not verified”):
     - Summary:
       - e.g., “12 user reports: 9 ‘no issue’, 2 ‘minor issue’, 1 ‘serious issue’.”
     - Simple bar/stacked chart.
     - Latest 1–3 feedback snippets:
       - “Reported: bad smell in one batch (unverified).”
     - Button: “View all feedback” and “Report my experience”.

   - **Trust Score Breakdown Card**:
     - Show contributions:
       - Regulatory base score: e.g., 70/100.
       - Adjustments for:
         - No/low violations (+10).
         - Serious recent community reports (−15).
       - Final score: 65.
     - Text: “This is an estimate based on limited data. It does not prove safety or adulteration.”

   - **Actions**:
     - “Add to Comparison”.
     - “Report My Experience”.
     - “Share this report” (optional).

### 5.6 Crowdsourced Feedback Submission

1. User taps **“Report My Experience”**.
2. If not logged in:
   - Offer quick **guest mode**: no login, just choose nickname (optional email).
3. Feedback form:
   - Product auto-filled.
   - Fields:
     - “What type of experience?”:  
       - Options: “No issue / Good quality”, “Minor issue”, “Serious issue”.
     - “What did you notice?”: short text.
     - “When did this happen?”: date selector or “Last week / Last month”.
     - Optional: upload photo (e.g., of packaging, issue).
   - Legal/clarity note: “Your report is public and marked as user-reported and unverified.”
4. On submit:
   - Store in **Feedback DB**.
   - Recalculate (or mark to recalculate) the **Trust Score**.
   - Show thank-you and updated community stats if desired.

### 5.7 Product Comparison

1. From **Product Detail**, user taps **“Add to Comparison”**.
2. The **comparison icon on home** shows updated count (e.g., “Compare (2)”).
3. User taps **“Compare Products”**:
   - See table or card-based layout for up to 3–5 products:
     - Columns:
       - Product/Brand name.
       - Trust Score + color.
       - License status (Active/Expired/Unknown).
       - Violations count.
       - Community reports summary.
   - Highlight highest trust in green, lowest in red.
   - Provide simple explanation: “Based on our data, Product X appears lower risk than Product Y. This is not a guarantee.”

---

## 6. Technical Approach

Design for a **hackathon-viable prototype**: favor simplicity, open-source tools, and minimal infrastructure.

### 6.1 Overall Architecture

- **Client**: Web app (mobile-first) + optionally wrapped as a PWA or Capacitor-based Android app.
- **Backend**: Lightweight REST API with:
  - Product lookup & mapping service.
  - Regulatory data access layer.
  - Feedback system endpoints.
  - Trust score calculation service.
- **Database**: Relational DB (e.g., PostgreSQL) or SQLite for simplicity.

Architecture diagram (conceptual):

- Client (React/Vue) → Backend (Node/Express or Python/FastAPI) →  
  - DB for products, licenses, feedback.  
  - Regulatory dataset(s) (local CSV/JSON or remote APIs).

### 6.2 Frontend Technologies

- **Framework**: 
  - Recommended: **React** (CRA or Vite) for rapid prototyping.  
    Alternative: Vue.js.
- **UI Library**:
  - Chakra UI / Material UI or Tailwind CSS for quick styling.
- **Barcode/QR Scanning**:
  - Web:  
    - `jsQR` or `QuaggaJS` for QR/barcode scanning via camera.
  - Mobile (if native wrapper): 
    - For React Native: `react-native-camera` or `react-native-vision-camera` + barcode plugin.
- **OCR**:
  - **Tesseract.js** (client-side) for FSSAI number extraction from label images.  
    If performance is an issue, offload to backend.

- **Internationalization / Localization** (optional):
  - `react-i18next` with English plus optional Hindi/Tamil etc. as time permits.

### 6.3 Backend Technologies

- **Language/Framework**:
  - Option A: **Node.js + Express** (simple, many JS devs).
  - Option B: **Python + FastAPI** (good for quick APIs and Python OCR/text tools).

- **Endpoints (examples)**:
  - `POST /scan/barcode` → Input: barcode; Output: product + license info.
  - `POST /scan/ocr` → Input: image; Output: parsed license + text.
  - `GET /license/:licenseId` → FSSAI license details + trust score structure.
  - `GET /product/:productId` → Combined product data + trust score.
  - `POST /feedback` → Create new feedback item.
  - `GET /feedback` (with filters) → List feedback items for product/license.
  - `POST /compare` → Input: list of product IDs; Output: comparison data.

- **Trust Score Service**:
  - Implement as a separate module with a pure function:
    - `calculateTrustScore({regulatoryData, feedbackData}) → {score, breakdown, label}`.

- **Data Storage**:
  - **DB schema (simplified)**:
    - `products`:
      - `id`
      - `barcode` (string)
      - `name`
      - `brand`
      - `fssai_license_id` (fk to `licenses`)
    - `licenses`:
      - `id` (FSSAI license number string)
      - `status` (enum: ACTIVE, EXPIRED, SUSPENDED, UNKNOWN)
      - `holder_name`
      - `address`
      - `category`
      - `last_checked_at`
    - `violations`:
      - `id`
      - `license_id` (fk)
      - `type` (e.g., recall, fine, warning)
      - `description`
      - `severity` (e.g., LOW, MEDIUM, HIGH)
      - `date`
      - `source_url`
    - `feedback`:
      - `id`
      - `product_id` (fk)
      - `license_id` (fk, optional, if known)
      - `user_nickname` (optional)
      - `experience_type` (“GOOD”, “MINOR_ISSUE”, “SERIOUS_ISSUE”)
      - `description`
      - `date_reported`
      - `event_date` (optional)
    - `score_cache` (optional):
      - `license_id` or `product_id`
      - `score`
      - `label`
      - `breakdown_json`
      - `last_computed_at`

### 6.4 Regulatory Data Integration

For the hackathon, assume **offline or pre-scraped datasets**, not full live integration:

- **Possible sources** (to be prepared before/during hackathon as CSV/JSON):
  - Sample FSSAI license list (dummy or real subset if legally allowed).
  - Sample recall/violation records from:
    - FSSAI website notifications.
    - State FDA/public court/press releases (if accessible).
- **Implementation**:
  - Import CSV/JSON into DB (e.g., using scripts).
  - Create indexes on `license_id` for fast lookups.
  - Backend queries DB rather than external APIs for performance and stability.

If live integration is possible (optional stretch):

- Implement scraping or API clients with:
  - Request throttling.
  - Caching of results to avoid repeated network calls.

### 6.5 OCR Pipeline

- **Client-side approach (faster to implement, heavier on device)**:
  - Use Tesseract.js to:
    - Restrict recognition to **digits and the word “FSSAI”** to improve accuracy.
    - Run after user selects/crops the label area.
  - Regex patterns to detect potential FSSAI license numbers:
    - Look for “FSSAI”, “Lic No”, etc. followed by 14 digits.
  - Confidence threshold:
    - If ambiguous, show multiple candidates to user for confirmation.

- **Backend approach (alternative)**:
  - Accept uploaded image.
  - Use Python’s `pytesseract` for OCR.
  - Apply image preprocessing (grayscale, thresholding, resizing).
  - Extract license number as above.

For hackathon, pick **one** and keep it simple (likely backend, if easier to tune quickly).

### 6.6 Trust Score Algorithm (First Version)

Design a **transparent, rule-based** scoring system. Example (can be tuned):

- Start with **base score**: 50.
- **Regulatory contributions** (weight ~60% of final score):
  - License status:
    - Active: +20.
    - Expired: −10.
    - Suspended/Cancelled: −25.
    - Unknown: 0.
  - Violations within last 3 years:
    - 0 violations: +10.
    - 1–2 low/medium severity: 0.
    - ≥1 high severity: −20.
    - >3 violations total: −10 additional.
- **Community contributions** (weight ~40%):
  - Volume/ratio:
    - If ≥10 feedback entries:
      - Ratio serious_issues / total:
        - <5%: +10.
        - 5–20%: −5.
        - >20%: −15.
    - If 3–9 entries:
      - Any serious issues: −5.
    - If <3 entries:
      - Small impact; maybe 0, but mark as “Insufficient community data”.
- Clamp score between 0 and 100.
- Derive label:
  - 80–100: High Trust.
  - 60–79: Medium Trust.
  - 40–59: Low Trust.
  - <40: Very Low Trust.
  - If license unknown & little data: “Insufficient Data”.

Always show text like:  
“Score is an estimate based on limited and partly user-reported data. It does not confirm safety or adulteration.”

### 6.7 Security & Privacy

- **Data collection**:
  - Minimal: optional nickname, no mandatory personally identifiable info.
- **Feedback moderation** (for prototype):
  - Simple filters:
    - Limit length.
    - Basic profanity filter.
  - Note in T&Cs that offensive or defamatory content may be removed.
- **Transport security**:
  - Use HTTPS where possible (if deploying to public internet).
- **Separation of data types**:
  - Clear typing in UI: `verified: true/false`.

### 6.8 Deployment

- **Frontend**:
  - Host on free platform (e.g., Vercel, Netlify).
- **Backend**:
  - Host on free-tier service (e.g., Render, Railway, Heroku free tier alternative).
- **Database**:
  - Hosted PostgreSQL free tier (e.g., Supabase, Railway, Neon).

For hackathon demo, local deployment with `localhost` is also acceptable.

---

## 7. Success Metrics

Success at hackathon level will be evaluated by both **technical completion** and **user impact potential**.

### 7.1 Functional Metrics (Prototype)

- **Core flows working end-to-end**:
  - Barcode/QR scan → product/ license identification → trust score displayed.
  - Label photo upload → OCR → FSSAI license detected → regulatory lookup → trust score.
  - Feedback submission → visible in community section.
  - Product comparison → accurate side-by-side listing.

- **Data correctness & clarity**:
  - ≥90% of demo test cases have correctly parsed FSSAI license numbers.
  - Regulatory data shown matches seeded dataset.
  - UI clearly labels data as **“Verified”** vs **“User-reported”**.

- **Performance**:
  - Barcode → trust score in under ~5 seconds on typical 4G and mid-range phone.
  - Label OCR → result in under ~10 seconds in demo environment.

### 7.2 Usability Metrics

- During user testing with 5–10 people (e.g., hackathon participants, mentors):
  - ≥80% can:
    - Complete a scan and interpret the trust score **without guidance**.
    - Correctly answer “Which of these two products seems safer based on the app?”.
  - ≥80% understand that:
    - The app does **not** guarantee safety.
    - Some data is from users, not from FSSAI.

- Qualitative feedback:
  - Users describe trust score as “easy to understand” in short interviews.
  - Users indicate they **would use this while shopping** if available.

### 7.3 Integrity & Safety Metrics

- **Zero instances** in the UI where:
  - The app explicitly states a product is “definitely adulterated” without official test/recall evidence.
- All violation/recall messages:
  - Contain a link/identifier to source and **do not alter official wording** except to simplify language.

### 7.4 Future-readiness Metrics (Beyond Hackathon)

(Not required to implement fully during hackathon, but useful to design for.)

- Modular design so:
  - New regulatory data sources can be added by plugging into the same trust-score pipeline.
  - Trust-score algorithm can be adjusted without changing the frontend.

---

This plan should allow an AI-assisted prototyping tool (e.g., Lovable, Bolt) or an engineering team to generate a working hackathon prototype of LabelTrust Checker that includes:

- Barcode/QR Code Scanner
- Regulatory Data Integration
- Crowdsourced Feedback System
- Trust Score Calculation
- Product Comparison Tool

while being usable, low-cost, and explicitly safe and transparent about its limitations.
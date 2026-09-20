# NyayaPath (न्यायपथ) ⚖️

**Jurisdiction-Aware, Source-Linked Legal Information & Roadmap Assistant for Indian Citizens**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff.svg)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-4.21-black.svg)](https://expressjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/Tests-23%20Passing-brightgreen.svg)](tests/roadmap.test.ts)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA%20(100)-success.svg)](src/index.css)

NyayaPath bridges the gap between legal confusion and verified, actionable next steps for Indian citizens. When navigating tenancy disputes, arbitrary workplace actions, or procedural hurdles, citizens often struggle to identify the relevant legal forum, the correct documentation to collect, or whether they qualify for free state legal aid. NyayaPath generates a structured, plain-language legal roadmap grounded in official Indian statutory frameworks and government dispute-resolution portals.

---

## 📑 Table of Contents

- [Chosen Challenge Vertical](#-chosen-challenge-vertical)
- [Problem Being Solved](#-problem-being-solved)
- [Core User Journey](#-core-user-journey)
- [Decision-Making Logic](#-decision-making-logic)
- [Safety & Urgency Logic](#-safety--urgency-logic)
- [Dual Engine: Mock Mode & Gemini Mode](#-dual-engine-mock-mode--gemini-mode)
- [Privacy & Ephemeral Document Handling](#-privacy--ephemeral-document-handling)
- [Security Controls & Defenses](#-security-controls--defenses)
- [Curated Official Indian Sources](#-curated-official-indian-sources)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Getting Started & Verification Commands](#-getting-started--verification-commands)
  - [Clone & Installation](#clone--installation)
  - [Environment Configuration](#environment-configuration)
  - [Typecheck, Testing & Build Verification](#typecheck-testing--build-verification)
- [Deployment Architecture & Assumptions](#-deployment-architecture--assumptions)
- [Known Limitations](#-known-limitations)
- [Important Legal Disclaimer](#-important-legal-disclaimer)

---

## 🎯 Chosen Challenge Vertical

**Legal Information Navigation & Citizen Self-Advocacy Preparation (India)**

NyayaPath focuses specifically on early-stage civil and administrative dispute navigation across four common domains under Indian jurisdiction:
1. **Tenant & Residential Tenancy Disputes**: Security deposit non-refund, arbitrary lease deductions, maintenance disputes, and unlawful eviction notices under State Rent Acts.
2. **Employment & Workplace Issues**: Unpaid wages, non-compete restraint clauses under Section 27 of the Indian Contract Act (1872), withholding of relieving letters or experience certificates, and full-and-final (FnF) settlements.
3. **Free Legal-Aid Entitlement & Procedure**: Statutory eligibility under Section 12 of the Legal Services Authorities Act (1987), locating District/State Legal Services Authorities (DLSA/SLSA), and panel advocate assignment.
4. **General Civil & Administrative Matters**: Consumer grievance navigation (e-Daakhil), administrative procedure, and limitation periods.

---

## 💡 Problem Being Solved

Citizens confronting legal challenges in India face three acute bottlenecks:
- **Procedural Bewilderment**: Not knowing which forum holds jurisdiction (e.g., whether a deposit issue goes to the Rent Authority, Consumer Commission, or DLSA pre-litigation conciliation).
- **Evidentiary Disorganization**: Arriving at consultations or hearings without critical evidentiary papers (e.g., move-in inventories, rent receipts, communication trails).
- **Over-Reliance on Generic Advice**: Generic AI chat bots frequently hallucinate non-existent Indian court precedents, invent foreign legal doctrines, or fail to warn citizens of imminent limitation deadlines.

NyayaPath solves this by delivering a **structured, bounded, 10-point roadmap** strictly tied to verified official portals and Indian state jurisdictions.

---

## 🗺️ Core User Journey

NyayaPath maintains an accessible, 4-step progressive disclosure flow:

```
[ 1. Landing Page ] ────────► [ 2. Guided Questionnaire ] ────────► [ 3. Document Check (Optional) ] ────────► [ 4. Legal Roadmap ]
  • Problem selection           • Indian State & District             • PDF / JPG / PNG (Max 5MB)                 • Situation summary
  • Quick demo scenario         • Plain-language description          • Ephemeral in-memory parse                 • Top 3 immediate actions
  • Official sources index      • Deadline & document status          • Magic bytes validation                    • Missing facts & checklist
                                • Safety & urgent risk audit          • One-click purge                           • Verified sources & print
```

1. **Landing Page**: Citizen selects their problem vertical or tries an interactive sample scenario.
2. **Guided Questionnaire**: Collects jurisdiction (State/UT, District), chronological narrative (minimum 15 characters), documentation status, deadline dates, and an 8-factor urgent risk triage.
3. **Optional Document Context**: Users may attach a lease agreement, appointment letter, or notice (PDF/JPG/PNG up to 5MB). Files are parsed strictly in volatile memory. Users can proceed with or without a document.
4. **Tailored Legal Roadmap**: Returns the neutral situation breakdown, top 3 immediate steps ("Do This First"), missing facts checklist, evidentiary document inventory, verified authorities ("Where to Go"), consultation questions, and official statutory references.

---

## 🧠 Decision-Making Logic

NyayaPath utilizes deterministic jurisdiction-aware routing and strict schema bounds:
- **State Jurisdictional Scoping**: Matches tenancy and legal-aid authorities to the citizen's State/UT (e.g., Karnataka Rent Act / KSLSA in Karnataka, Maharashtra Rent Control Act / MSLSA in Maharashtra, DSLSA in Delhi).
- **Rule of Three for Actions**: Enforces a strict ceiling of **3 prioritized immediate actions** to prevent cognitive overload.
- **Evidentiary Rationale**: Every checklist item explicitly explains *why* it is needed and specifies whether an original, photocopy, or digital stamped statement is required.
- **Missing Information Audit**: Explicitly prompts the citizen for facts that could materially alter their rights (e.g., whether an 11-month agreement was registered, exact move-out inspection dates).

---

## 🚨 Safety & Urgency Logic

NyayaPath incorporates safety rules to protect vulnerable users:
- **8 Critical Risk Triggers**:
  - Arrest or police inquiry
  - Criminal allegations or FIR
  - Domestic violence
  - Immediate physical danger
  - Child safety concerns
  - Imminent court or statutory filing deadlines
  - Unlawful or immediate physical eviction
  - Threat of catastrophic financial harm
- **Urgency Levels**:
  - `urgent`: Imminent physical danger, domestic violence, criminal allegation, or active eviction. Triggers high-contrast emergency warning banners, redirects away from autonomous AI reliance, and displays official emergency hotlines (**112** National Emergency, **15100** NALSA Legal Aid, **1091** Women Helpline, **1098** Childline).
  - `caution`: Active notice period or approaching statutory limitation deadline.
  - `normal`: Standard procedural inquiry.

---

## 🔄 Dual Engine: Mock Mode & Gemini Mode

NyayaPath is architected with a resilient dual-engine pattern:

| Engine | Trigger Condition | Characteristics | Production Status |
| :--- | :--- | :--- | :--- |
| **Deterministic Mock Mode** *(Default & Reliable Fallback)* | `AI_PROVIDER=mock`, or missing/invalid `GEMINI_API_KEY`, or AI rate-limit/network failure | Instantaneous response (<5ms), 100% offline, zero external API dependencies, fully grounded in verified Indian statutory templates | **Active in current deployed prototype** |
| **Live AI Engine (Google Gemini)** | `AI_PROVIDER=gemini` and valid `GEMINI_API_KEY` present | Strict JSON schema output via Gemini Flash with retry mechanisms, bounded prompt constraints, and strict domain URL allowlisting | **Configurable via environment variables** |

> **Transparency Note**: In the current public Vercel deployment, NyayaPath operates in **Deterministic Mock Mode**. Gemini Live AI is only enabled in environments where a valid, active `GEMINI_API_KEY` is configured in `.env`.

---

## 🛡️ Privacy & Ephemeral Document Handling

- **Zero Persistent Document Storage**: Uploaded files and parsed text reside strictly in ephemeral memory buffers (`multer.memoryStorage()`). No documents are written to permanent server disk or external databases.
- **Automatic Stale Sweep**: Active in-memory buffers are automatically purged after 1 hour via an unref'd timer that never blocks process teardown.
- **One-Click Memory Purge**: Users can delete their uploaded document and parsed tokens at any time via the **"Delete Uploaded Document"** button.
- **No Private Data in Prompts**: The intake explicitly advises users against providing Aadhaar numbers, passwords, or bank account credentials. Document previews sent for analysis are clamped to safe length limits.

---

## 🔒 Security Controls & Defenses

1. **Strict Input Validation via Zod**:
   - Workflows strictly constrained to `rental`, `employment`, `legal_aid`, `other`.
   - String boundaries enforced (`description`: 10–3000 chars, `state`: 1–100 chars, `district`: max 100 chars).
   - Document IDs strictly validated as UUIDs (`z.string().uuid()`) to eliminate path traversal risks.
2. **File Upload Hardening**:
   - Size strictly limited to 5 MB.
   - Dual-layer validation: file extension, MIME type, and **magic bytes signature check** (inspects buffer bytes for `%PDF-`, JPEG `0xFF, 0xD8, 0xFF`, and PNG `0x89, 0x50, 0x4E, 0x47`). Empty files (<4 bytes) are rejected immediately.
3. **CORS & Network Defenses**:
   - Strict CORS origin allowlist based on `ALLOWED_ORIGIN` (defaults to frontend domain in production; allows localhost only in development mode).
   - Rate limiting via `express-rate-limit` (200 requests / 15-minute window per IP).
   - Defensive security headers via `helmet`.
4. **AI Safety & Domain Allowlisting**:
   - URLs generated by AI models are strictly validated against approved Indian judicial and government domains (`.gov.in`, `.nic.in`, `dslsa.org`, `ecourts.gov.in`, `nalsa.gov.in`). Unapproved or arbitrary domains are automatically sanitized and replaced with verified official portals.
5. **Secret Protection**:
   - `.env` is ignored by Git. `.env.example` contains placeholders only.
   - Zero hardcoded credentials or API keys exist in source code or Git history.
   - **Important Security Notice**: If a Gemini API key was ever committed or shared in external forks, it must be revoked and regenerated immediately via [Google AI Studio](https://aistudio.google.com/).

---

## 🔗 Curated Official Indian Sources

All authorities cited in roadmaps belong to verified Indian government and judicial bodies:

- **NALSA Legal Aid Schemes**: [https://nalsa.gov.in/legal-aid/](https://nalsa.gov.in/legal-aid/) (National Legal Services Authority)
- **eCourts Services & e-Filing Portal**: [https://filing.ecourts.gov.in/](https://filing.ecourts.gov.in/) & [https://ecourts.gov.in/](https://ecourts.gov.in/) (Supreme Court of India e-Committee)
- **e-Daakhil National Consumer Grievance Portal**: [https://edaakhil.nic.in/](https://edaakhil.nic.in/) (National Consumer Disputes Redressal Commission)
- **SAMADHAN Labour Dispute Conciliation**: [https://samadhan.labour.gov.in/](https://samadhan.labour.gov.in/) (Ministry of Labour & Employment)
- **State Legal Services Authorities**:
  - Delhi (DSLSA): [https://dslsa.org/](https://dslsa.org/)
  - Maharashtra (MSLSA): [https://legalservices.maharashtra.gov.in/](https://legalservices.maharashtra.gov.in/)
  - Karnataka (KSLSA): [https://kslsa.kar.nic.in/](https://kslsa.kar.nic.in/)

---

## 🛠️ Architecture & Tech Stack

```
   ┌─────────────────────────────────────────────────────────┐
   │                   React 18 + Vite SPA                   │
   │  Questionnaire → Document Upload → Roadmap Generation   │
   │       Tailored Vanilla CSS • Lucide Icons • Print       │
   └────────────────────────────┬────────────────────────────┘
                                │ HTTP / JSON / Multipart
                                ▼
   ┌─────────────────────────────────────────────────────────┐
   │                   Express + Node.js API                 │
   │  Helmet Security • Rate Limiting • CORS • Multer Memory │
   └──────────────┬───────────────────────────┬──────────────┘
                  │                           │
         [ Document Service ]        [ AI Provider Engine ]
         • Buffer magic bytes        • Gemini Flash
         • In-memory store           • Zod Schema Enforcement
         • Instant deletion          • Deterministic Mock Fallback
                                     • Approved Domain Sanitizer
```

- **Frontend**: React 18, TypeScript 5.7, Vite 6, Semantic HTML5, Vanilla CSS (WCAG 2.1 AA compliant, custom design tokens, responsive typography), Lucide React.
- **Backend**: Node.js 20+, Express 4.21, TypeScript, Helmet, CORS, Express Rate Limit.
- **Validation**: Zod 3.24 for runtime boundary enforcement.
- **Document Processing**: Multer memory storage, `pdf-parse`, magic bytes inspection.
- **Testing**: Native Node.js test runner (`node:test`, `node:assert/strict`) via `tsx`.

---

## 🚀 Getting Started & Verification Commands

### Clone & Installation

```bash
git clone https://github.com/manasviagarkar-cpu/NyayaPath.git
cd NyayaPath
npm install
```

### Environment Configuration

Copy the example environment file:

```bash
# Linux / macOS
cp .env.example .env

# Windows PowerShell
copy .env.example .env
```

Default `.env` settings:

```env
PORT=5000
NODE_ENV=development

# AI Provider: "mock" (recommended offline default) or "gemini"
AI_PROVIDER=mock
GEMINI_API_KEY=your_gemini_api_key_here

# File Upload Settings
UPLOAD_MAX_SIZE_MB=5
ALLOWED_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=200
```

### Typecheck, Testing & Build Verification

NyayaPath provides unified, non-destructive verification scripts:

```bash
# 1. Typecheck frontend and backend without emitting files
npm run typecheck

# 2. Run the 23-check automated test suite
npm test

# 3. Build client and server for production
npm run build

# 4. Run the master verification pipeline in order (Typecheck -> Test -> Build)
npm run verify
```

*(On Windows PowerShell with restricted script execution policies, run `cmd.exe /c "npm run verify"`)*

### Running the Application Locally

```bash
# Concurrently start backend (port 5000) and frontend (port 3000)
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deployment Architecture & Assumptions

NyayaPath consists of an Express API backend and a Vite React SPA frontend:

1. **Standalone Production Service (Recommended)**:
   Deploy as a unified Node.js service (Render, Railway, Docker, or AWS ECS) using:
   ```bash
   npm run build
   npm start
   ```
   In this mode, Express serves the API routes under `/api/*` and statically serves the compiled React app from `dist/` with SPA routing fallbacks.
2. **Current Static Deployment**:
   The live frontend is hosted at [https://nyayapath-ashy.vercel.app/](https://nyayapath-ashy.vercel.app/). Because Vercel serverless environments are stateless and split across distinct Lambda containers (which disrupts in-memory document buffers between `/api/upload` and `/api/roadmap/generate`), production deployment of the full backend is configured as a persistent Node/Express service. The frontend accurately badges simulated execution when live AI backend connectivity is not provisioned.

---

## ⚠️ Known Limitations

1. **No Direct Document OCR**: Scanned document images or password-protected PDFs do not extract machine-readable text; citizens are prompted to verify clauses against their physical documents.
2. **Not Formal Legal Advice**: NyayaPath organizes preparation steps and citizen documentation; it does not replace advocate consultation or court representation.
3. **State Rule Variations**: Local municipal rent control amendments and state labor rules evolve continuously; all cited authorities must be verified directly through official portals.

---

## ⚖️ Important Legal Disclaimer

> **NyayaPath is an educational, procedural navigation, and preparation assistant for Indian citizens. It is not a law firm and does not act as a licensed legal practitioner.**
>
> 1. **No Advocate-Client Relationship**: Use of NyayaPath does not constitute legal representation or establish an attorney-client relationship.
> 2. **No Guaranteed Outcomes**: Legal determinations depend on specific facts, evolving state statutory interpretations, and competent judicial discretion.
> 3. **Not Ready-to-File Court Pleadings**: Generated checklists and roadmaps are designed for personal organization and advocate consultation preparation; they are not formal court petitions.
> 4. **Emergency Channels**: In cases of violence, harassment, imminent arrest, unlawful lockout, or strict limitation expiry, contact local law enforcement (**112**), the Women Helpline (**1091**), or your nearest District Legal Services Authority (**15100**) immediately.

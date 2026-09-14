# NyayaPath (न्यायपथ) ⚖️

**Jurisdiction-Aware, Source-Linked Legal Information & Roadmap Assistant for Indian Citizens**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff.svg)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-4.21-black.svg)](https://expressjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

NyayaPath bridges the gap between legal confusion and verified, actionable next steps. When faced with tenancy disputes, arbitrary workplace actions, or procedural hurdles, citizens often struggle to identify the relevant legal forum, the correct documentation to collect, or whether they qualify for free state legal aid. NyayaPath generates a structured, plain-language legal roadmap grounded in official Indian statutory frameworks and government dispute-resolution portals.

---

## 📑 Table of Contents

- [Key Features](#-key-features)
- [Supported Workflows](#-supported-workflows)
- [The 10-Point Legal Roadmap](#-the-10-point-legal-roadmap)
- [Curated Official Indian Sources](#-curated-official-indian-sources)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Directory Structure](#-directory-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Running the Application](#running-the-application)
  - [Running Automated Tests](#running-automated-tests)
- [API Endpoints](#-api-endpoints)
- [Privacy & Security](#-privacy--security)
- [Important Legal Disclaimer](#-important-legal-disclaimer)

---

## 🌟 Key Features

- **Jurisdiction & State-Specific Guidance**: Tailors advice and authorities to the user's specific Indian state or Union Territory (e.g., Delhi, Maharashtra, Karnataka, Tamil Nadu, Uttar Pradesh, etc.).
- **Dual-Engine Architecture (Live AI + Deterministic Mock)**:
  - Powered by **Google Gemini** (`gemini-2.5-flash`) with strict Zod schema validation and automatic retry logic.
  - Includes a comprehensive **Deterministic Mock Engine** with realistic, state-aware roadmaps requiring zero API keys for offline testing or development.
  - Safe fallback: if AI quota or network fails, gracefully falls back to deterministic logic without breaking the user experience.
- **Safety & Urgent Risk Escalation**:
  - Automatically identifies critical risk factors (threat of arrest, domestic violence, immediate physical danger, unlawful eviction, imminent court deadlines).
  - Flags high-priority urgency levels (`urgent`, `caution`, `normal`) and provides immediate emergency contact recommendations (Police 112, Women Helpline 1091, NALSA Helpline 15100).
- **Privacy-First Document Inspection**:
  - Optional upload of lease agreements, termination letters, or notices (PDF/JPG/PNG up to 5MB).
  - In-memory parsing (`pdf-parse`) with zero disk persistence.
  - One-click **"Delete Document from Memory"** button allowing users to wipe extracted text and identifiers immediately upon roadmap generation.
- **Actionable Citizen Tools**:
  - Top 3 prioritized **"Do This First"** immediate actions.
  - **Document Checklist**: Specifies what papers to gather, why they matter, and whether photocopies or originals are required.
  - **Questions to Ask a Lawyer / Legal Aid Officer**: Pre-drafted questions to maximize the value of legal consultations.
  - **Print & Export**: Built-in print-friendly CSS formatting and one-click clipboard copy.

---

## 🏛️ Supported Workflows

| Workflow | Primary Focus Areas | Key Governing Acts & Frameworks | Official Dispute Forums |
| :--- | :--- | :--- | :--- |
| **Rental & Tenancy** | Security deposit withholding, arbitrary eviction, illegal rent hikes, repair disputes | State Tenancy / Rent Control Acts (e.g., Karnataka Rent Act 1999, Maharashtra Rent Control Act 1999, Model Tenancy Act), Consumer Protection Act 2019 | Rent Authorities / Tribunals, District Consumer Disputes Redressal Commissions (e-Daakhil) |
| **Employment & Workplace** | Unpaid wages/dues, wrongful termination, notice period conflicts, PF/gratuity withholding | Industrial Disputes Act 1947, Payment of Wages Act 1936, Shops and Establishments Acts, Industrial Relations Code | Labour Conciliation Officers, SAMADHAN Portal, Labour Courts |
| **Free Legal Aid** | Eligibility under Section 12 of the Legal Services Authorities Act, 1987 | Legal Services Authorities Act 1987, NALSA Schemes (Women, SC/ST, low-income, persons in custody) | National Legal Services Authority (NALSA), State (SLSA), District (DLSA), Taluka Legal Services Committees (TLSC) |
| **General Civil & Consumer** | Deficiencies in service, contract breaches, consumer grievances | Consumer Protection Act 2019, Specific Relief Act, Indian Contract Act 1872 | e-Daakhil Portal, eCourts Services (v3.0), District Courts |

---

## 📋 The 10-Point Legal Roadmap

Every roadmap returned by NyayaPath adheres strictly to a validated 10-point schema:

1. **Situation Summary**: Neutral, plain-language breakdown of the user's situation.
2. **Immediate Steps (Do This First)**: Exactly 1 to 3 time-sensitive, practical steps.
3. **Missing Information**: Key facts, dates, or documents needed to assess legal options accurately.
4. **Possible Issue Categories**: Relevant civil, labor, or tenancy classifications.
5. **Document Checklist**: Explicit inventory of needed records, rationale, and copy/original requirements.
6. **Where to Go**: Official statutory authorities, online grievance portals, or legal-aid clinics with verified URLs.
7. **Questions to Ask**: Actionable queries to bring to a consultation with an advocate or legal aid counsel.
8. **Urgency Level**: Categorized as `normal`, `caution`, or `urgent`.
9. **Escalation Advice**: Emergency helplines and immediate precautionary notices if high-risk factors exist.
10. **Official Sources & Limitations**: Direct links to authoritative government portals (.gov.in / .nic.in) and explicit legal boundaries.

---

## 🔗 Curated Official Indian Sources

NyayaPath references verified statutory and administrative portals:

- **NALSA Legal Aid Portal**: [https://nalsa.gov.in/legal-aid/](https://nalsa.gov.in/legal-aid/) (National Legal Services Authority)
- **eCourts Services & e-Filing v3.0**: [https://filing.ecourts.gov.in/](https://filing.ecourts.gov.in/) & [https://ecourts.gov.in/](https://ecourts.gov.in/) (Supreme Court of India e-Committee)
- **e-Daakhil Consumer Grievance Portal**: [https://edaakhil.nic.in/](https://edaakhil.nic.in/) (National Consumer Disputes Redressal Commission)
- **SAMADHAN Labour Dispute Portal**: [https://samadhan.labour.gov.in/](https://samadhan.labour.gov.in/) (Ministry of Labour & Employment)
- **State Legal Services Authorities (SLSA)**:
  - Delhi: [https://dslsa.org/](https://dslsa.org/)
  - Maharashtra: [https://legalservices.maharashtra.gov.in/](https://legalservices.maharashtra.gov.in/)
  - Karnataka: [https://kslsa.kar.nic.in/](https://kslsa.kar.nic.in/)

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
         • PDF text parsing          • Gemini 2.5 Flash
         • In-memory store           • Zod Schema Validation
         • Instant deletion          • Deterministic Mock Fallback
                                     • Curated Sources Database
```

### Technologies

- **Frontend**: React 18, TypeScript, Vite 6, Vanilla CSS (harmonious design system with custom CSS tokens, dark/light modes, micro-interactions), Lucide React.
- **Backend**: Node.js, Express 4, TypeScript, `tsx`, Helmet (security headers), CORS, Express Rate Limit.
- **Document Processing**: Multer (in-memory buffer storage), `pdf-parse` (secure PDF text extraction).
- **Validation & AI**: Zod (runtime request/response validation), Google Gemini API (`gemini-2.5-flash`).
- **Testing**: Built-in Node.js test runner (`node:test`, `node:assert/strict`) via `tsx`.

---

## 📁 Directory Structure

```text
legal/
├── index.html                   # HTML entry point with Google Fonts (Outfit & Inter)
├── package.json                 # Project scripts and dependencies
├── tsconfig.json                # Frontend TypeScript configuration
├── tsconfig.server.json         # Backend TypeScript configuration
├── vite.config.ts               # Vite bundler & API proxy configuration
├── .env.example                 # Example environment variables
│
├── server/                      # Express Backend
│   ├── index.ts                 # Server setup, middleware, static serving & error handler
│   ├── routes.ts                # API router (/health, /sources, /upload, /roadmap/generate)
│   ├── schema.ts                # Zod schemas for questionnaire & roadmap output
│   ├── types.ts                 # Shared TypeScript interfaces & types
│   ├── sources.ts               # Curated official government legal sources
│   ├── documentService.ts       # In-memory document parser & deletion manager
│   └── aiProvider.ts            # Gemini AI integration & deterministic mock engine
│
├── src/                         # React Frontend
│   ├── main.tsx                 # React application entry point
│   ├── App.tsx                  # Stage manager (Landing -> Questionnaire -> Upload -> Roadmap)
│   ├── index.css                # Premium design system & typography tokens
│   ├── types.ts                 # Frontend state and prop types
│   └── components/
│       ├── Header.tsx           # Navigation bar with live AI / mock badge
│       ├── LandingHero.tsx      # Problem selector and benefit cards
│       ├── QuestionnaireForm.tsx# Step-by-step intake with state selection & urgent risk triage
│       ├── DocumentUploader.tsx # Optional file uploader with privacy assurance
│       ├── RoadmapView.tsx      # Comprehensive 10-point roadmap display & print view
│       ├── UrgentAlertBanner.tsx# High-visibility warning for critical emergencies
│       ├── SourcesModal.tsx     # Curated official sources explorer
│       └── Footer.tsx           # Official disclaimers and emergency helpline contacts
│
└── tests/
    └── roadmap.test.ts          # Automated test suite (Validation, Mock Engine, Sources)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/nyayapath.git
cd nyayapath
npm install
```

### Environment Configuration

Copy the example environment file:

```bash
# On Linux/macOS
cp .env.example .env

# On Windows PowerShell
copy .env.example .env
```

Open `.env` and configure your settings:

```env
PORT=5000
NODE_ENV=development

# AI Provider: "mock" (offline/zero-config) or "gemini"
AI_PROVIDER=mock

# Required only if AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here

# File Upload Settings
UPLOAD_MAX_SIZE_MB=5
ALLOWED_ORIGIN=http://localhost:3000

# Rate Limiting (15 minutes window, max 100 requests per IP)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

> **Note**: If `AI_PROVIDER=mock` or `GEMINI_API_KEY` is not provided, NyayaPath automatically runs in **Deterministic Mock Mode**, producing fully formatted, realistic roadmaps without external API calls.

### Running the Application

You can run both the server and client concurrently with a single command:

```bash
npm run dev
```

Alternatively, run them in separate terminals:

```bash
# Terminal 1: Backend API server (runs with tsx watch on port 5000)
npm run dev:server

# Terminal 2: Frontend client (Vite dev server on port 3000)
npm run dev:client
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
# Build both frontend and backend
npm run build

# Start the production server (serves the static frontend from dist/)
npm start
```

### Running Automated Tests

Run the comprehensive test suite verifying schema validation, mock engine outputs, urgent risk flags, and document deletion:

```bash
npm test
```

*(On Windows PowerShell where script execution is restricted, run `npm.cmd test`)*

---

## 📡 API Endpoints

### 1. Health Check
`GET /api/health`
Returns service status, current timestamp, and active mode (`mock` or `live_ai`).

### 2. Curated Legal Sources
`GET /api/sources?topic={workflow}&jurisdiction={state}`
Returns official statutory authorities and government portals filtered by topic (`rental`, `employment`, `legal_aid`, `general`) and jurisdiction.

### 3. Upload Document (Optional)
`POST /api/upload`
- **Body**: `multipart/form-data` with field `document` (PDF, JPG, JPEG, PNG up to 5MB).
- **Response**: Document metadata and preview of extracted text.

### 4. Delete Uploaded Document
`DELETE /api/document/:id`
Immediately purges the uploaded document and extracted text from in-memory cache.

### 5. Generate Legal Roadmap
`POST /api/roadmap/generate`
- **Body**:
  ```json
  {
    "answers": {
      "workflow": "rental",
      "state": "Karnataka",
      "district": "Bengaluru Urban",
      "description": "Landlord refusing to return security deposit of Rs 80,000 after moving out.",
      "hasWrittenDocument": "yes",
      "hasReceivedDeadline": "no",
      "hasUrgentRisk": false
    },
    "documentId": "optional-document-uuid"
  }
  ```
- **Response**: Complete 10-point structured roadmap matching `RoadmapResponseSchema`.

---

## 🔒 Privacy & Security

- **No Permanent Document Storage**: Uploaded files and extracted text are kept strictly in ephemeral memory buffers. No documents are written to permanent server disk.
- **Instant Data Scrubbing**: Users can click "Delete Document from Memory" at any time to purge their uploaded context.
- **Security Headers & Protection**: Configured with `helmet` for defensive HTTP headers and `express-rate-limit` to prevent brute-force abuse.
- **Input Sanitization & Schema Enforcement**: All payloads are rigorously validated using `zod` schemas before processing.

---

## ⚠️ Important Legal Disclaimer

> **NyayaPath is an educational and legal information navigation tool, not a law firm or a substitute for a qualified lawyer.**
>
> 1. **No Attorney-Client Relationship**: Using NyayaPath does not create an advocate-client relationship.
> 2. **No Guaranteed Outcomes**: Legal situations depend on specific facts, evolving state rules, and judicial interpretation.
> 3. **Not Ready-to-File Pleadings**: Roadmaps and checklists are designed for personal preparation and consultation organizing; they are not official court pleadings.
> 4. **Emergency Situations**: In cases of physical violence, threats to life, arrest, or urgent statutory deadlines, immediately contact local law enforcement (112), Women's Helpline (1091), or your District Legal Services Authority (DLSA).

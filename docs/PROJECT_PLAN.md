# Merald Group Corporate Portal & HR Management System — Master Project Plan

## Executive Overview
Merald Group is a multi-national conglomerate operating across Nigeria, India, UAE, Ghana, and Uganda. This project encompasses:
1. **Public Marketing Website:** High-aesthetic, responsive corporate portal highlighting Merald's business verticals, global footprint, EPC/MEP projects, IFM services, haulify logistics, country-specific landing pages, career openings, and interactive inquiry forms with Google Maps and office visual assets.
2. **Admin Panel & HR/Manpower Management System:** Role-protected enterprise management portal featuring Employee Master Data, Document Expiry Tracking, Daily & Monthly Attendance, Leave Workflows, Payroll & Payslip Generation, Manpower Supply Analytics (Contract vs. Actual), Site Management, Onboarding/Exit workflows, Multi-format Reporting, and **OTP-Verified Password Recovery & Welcome Email Workflows**.

---

## 1. Design System & Branding Tokens

### A. Color Palette Tokens (`src/config/theme.js`)
Extracted from the navy-to-teal-to-mint gradient logo fan icon & wordmark:

| CSS Variable / Token | Hex Value | Primary Usage |
|---|---|---|
| `--color-navy-900` | `#0D2E45` | Main Headings, Navy Wordmark, Dark Headers |
| `--color-navy-700` | `#14476B` | Primary Action Buttons, Active Links |
| `--color-blue-600` | `#1D6FA5` | Secondary Accents, Hover States |
| `--color-teal-500` | `#3D9DA0` | Highlights, Active Tabs, Key Icons |
| `--color-mint-400` | `#83C9B8` | Soft Accent Backgrounds, Status Badges |
| `--color-mint-100` | `#E4F5EE` | Light Section Surfaces, Card Accents |
| `--color-neutral-900` | `#1A1F24` | Primary Body Text |
| `--color-neutral-500` | `#6B7280` | Secondary / Muted Text |
| `--color-neutral-100` | `#F7F9FA` | Main Page Background |
| `--color-white` | `#FFFFFF` | Card Containers, High Contrast Text |
| `--color-error` | `#D64545` | Error Toasts, Validation Alerts |
| `--color-success` | `#2E9E5B` | Success Toasts, Approval Badges |

**Brand Gradient Token:**
`--gradient-brand: linear-gradient(135deg, #0D2E45 0%, #1D6FA5 45%, #3D9DA0 75%, #83C9B8 100%)`

### B. Typography & Type Scale
- **Headings Font:** `Poppins` (Weights: 600, 700)
- **Body Font:** `Inter` (Weights: 400, 500)
- **Logo Wordmark Script Font:** `Sacramento` / `Pacifico` (Used **ONLY** for the "Merald" wordmark in logo/header)

---

## 2. Security & Exact Role-Based Access Control (RBAC Matrix)

The system strictly enforces the following permissions matrix across backend middleware (`middleware/roleMiddleware.js`) and frontend UI route gates:

| Feature / System Module | HR | ACCOUNTS | ADMIN | SITE_SUPERVISOR |
|---|---|---|---|---|
| **System Settings & User RBAC Roles** | FULL ACCESS | FULL ACCESS | NO ACCESS | NO ACCESS |
| **Sensitive Financial Info** (*basicSalary*, Bank Details, Tax PIN) | FULL ACCESS | FULL ACCESS | BLOCKED / MASKED | BLOCKED / MASKED |
| **Payroll Processing & Payslip PDF** | FULL ACCESS | FULL ACCESS | BLOCKED / NO ACCESS | BLOCKED / NO ACCESS |
| **Audit Security Logs** | FULL ACCESS | FULL ACCESS | Read Only | No Access |
| **Employee Master Data** (General Profile & Skills) | FULL ACCESS | Read Only | Full Access | Read Only (Site Only) |
| **Legal Documents & Expiry Tracking** | FULL ACCESS | Read Only | Full Access | Read Only (Site Only) |
| **Daily Attendance & Shift Entry** | FULL ACCESS | Read Only | Full Access | Full Access (Site Only) |
| **Leave Approval / Rejection** | FULL ACCESS | No Access | Full Access | Request Only |
| **Sites & Departments Management** | FULL ACCESS | Read Only | Full Access | Read Only |
| **Manpower Management** (Contract vs Actual) | FULL ACCESS | Read Only | Full Access | Read Only (Site Only) |
| **HR & Operational Reports** | FULL ACCESS | Full Access (financial reports only) | Full Access (excluding payroll/financial reports) | No Access |

---

## 3. Email & Authentication Workflows

### A. Welcome Email on Account Creation
- Automatically sends a branded Merald Group welcome email containing login credentials, portal URL, and onboarding instructions whenever a new user/employee account is provisioned by HR or Accounts.

### B. Forgot Password & OTP Recovery Flow
1. **Initiate:** User requests password reset via `/forgot-password` by providing their registered email address.
2. **OTP Dispatch:** Backend generates a secure 6-digit numeric OTP (expires in 10 minutes) and dispatches it to the user's email address using `Nodemailer`.
3. **Verification:** User enters the received OTP on `/verify-otp`.
4. **Password Reset:** Upon successful verification, user unlocks `/reset-password` to securely set their new password.

---

## 4. Public Contact Page Assets & Video Handling

### A. Contact Page Enhancements
- **Corporate Office Visuals:** Real high-resolution visual cards depicting Merald Group headquarters, office building visuals, and team environment.
- **Interactive Map Integration:** Embedded Google Maps displaying precise coordinates for Merald offices across Nigeria, India, UAE, Ghana, and Uganda.
- **Dual Smart Form:** Interactive tabbed form switching between Request for Proposal (RFP) and Supplier/Vendor Registration.

### B. Hero Section Motion Graphics / Video Strategy
- **Antigravity Motion Graphic Engine:** Built using Framer Motion + Canvas/CSS video-style motion graphics that render hero visuals smoothly out-of-the-box without requiring any external video upload!
- **Custom Video Drop-in Ready:** Includes a clean modular configuration allowing the user to drop in their custom MP4 video file anytime by simply updating `src/config/constants.js`.

---

## 5. SEO Content Architecture & Seed Scripts
- **Country SEO Data:** SEO metadata (titles, descriptions, OG tags, local stats, projects, leadership) for Nigeria, India, UAE, Ghana, and Uganda.
- **Seed Script (`backend/seeders/seedCountries.js`):** Automated seed script populates rich SEO content, country slugs, keywords, and local project case studies into MongoDB.

---

## 6. Scalability Architecture — Target: 500 Concurrent Users

| Layer | Optimization Measure | Implementation Detail |
|---|---|---|
| **App Server** | Stateless Express | No local session state; JWT authentication; horizontal load balancer ready |
| **Middlewares** | Compression & Security | `compression` (gzip/brotli), `helmet` security headers, CORS protection |
| **Database** | Connection Pool & Indexing | Mongoose pool size (30-50 connection max pool); Compound indexes on `Employee`, `Attendance`, `Document`, `Site` |
| **Pagination** | Server-side Limits | Mandatory limit/offset cursor pagination for all list APIs (default 20, max 100) |
| **Caching** | Semi-static Page Cache | In-memory / Redis cache for public marketing content (services, country SEO, stats) |
| **Rate Limiting** | DDoS & Abuse Prevention | `express-rate-limit` on `/api/v1/auth/*`, `/api/v1/inquiries`, `/api/v1/jobs/apply` |
| **File Storage** | Streaming Uploads | Multer memory/stream disk storage with file size caps (max 5MB for PDFs/images) |
| **Frontend Bundle** | Code Splitting | `React.lazy` + `Suspense` per route; image lazy loading (`loading="lazy"`) |
| **Audit Doc** | Scalability Record | Dedicated `LOAD_NOTES.md` generated documenting performance trade-offs |

---

## 7. Site Map & Route Hierarchy

```
[Public Website]
├── /                       → Home (Hero Animation/Video, Stats Counter, Verticals Grid, Global Map)
├── /services               → Services (EPC & MEP, IFM, Distribution, Logistics/Haulify, Manpower Supply)
├── /countries              → Countries Overview
├── /countries/:slug        → Country Detail Pages (Nigeria, India, UAE, Ghana, Uganda - Seeded SEO Data)
├── /about                  → About Us (Company History, Timeline, Core Values, Leadership, HSE Compliance)
├── /jobs                   → Careers (Why Work With Us, 4-Step Recruitment Process, Job Openings Grid, Application Modal)
├── /contact                → Contact Us (Dual Smart Form: RFP vs. Vendor, Office Images, Google Maps)

[Admin & Auth Routes]
├── /admin/login            → Login Gate (JWT Auth, Role-based redirect)
├── /forgot-password        → Enter email to request password reset OTP
├── /verify-otp             → Enter 6-digit OTP received via email
├── /reset-password         → Set new password after OTP verification
├── /admin/dashboard        → Executive Dashboard (KPI metrics, document expiry alerts, headcount breakdown)
├── /admin/employees        → Employee Master Data (Role-gated CRUD, Document tab, Photo upload)
├── /admin/attendance       → Attendance System (Daily check-ins, Monthly matrix grid, Excel import/export)
├── /admin/leave            → Leave Management (Leave application, approval/rejection modal, balance ledger)
├── /admin/payroll          → Payroll & Compensation (Role-gated salary structure, payslip generator, PDF & Excel export)
├── /admin/manpower         → Manpower Analytics (Contracted vs. Actual headcount, shortfall matrix)
├── /admin/sites            → Site & Project Locations (Site setup, supervisor assignment, workforce allocation)
├── /admin/joining-exit     → Onboarding & Exit Workflow (Clearance checklists, NOC generation)
├── /admin/reports          → HR & Operational Reports (Custom filterable exports in PDF/Excel)
├── /admin/users            → User Management (RBAC: Admin, HR Manager, Accounts, Site Supervisor)
└── /admin/settings         → System Settings (Company details, alert thresholds, email/notification parameters)
```

---

## 8. Phase-by-Phase Development Plan

### Phase 0: Project Foundation, Design System & Auth Workflows
- **Goal:** Monorepo/folder architecture with `client` (React + TypeScript) and `server` (Express + TypeScript), exact color tokens, typography components, loading splash screen, seed scripts, exact RBAC middleware, **Welcome Email**, **Forgot Password OTP Flow**, **i18n Setup**, and **Strict TypeScript Compilation (`tsc --noEmit`)**.
- **Tasks & Components:**
  - TypeScript setup for React frontend in `client/` (`tsconfig.json`, `client/src/**/*.tsx`, `client/src/**/*.ts`).
  - Express TypeScript setup in `server/` (`server/tsconfig.json`, `server/src/**/*.ts`).
  - `client/src/config/theme.ts` with exact hex colors, gradient, and typed theme tokens.
  - `client/src/components/ui/Typography.tsx` (`Heading`, `Text`, `Label`) with strong TypeScript props interfaces.
  - `client/src/components/ui/LoadingScreen.tsx` (Framer Motion Merald splash screen).
  - `react-i18next` internationalization setup (`client/src/config/i18n/`) with translation JSON files for English (`en`), Hindi (`hi`), Arabic (`ar`), and French (`fr`), plus typed `LanguageSwitcher.tsx` header component.
  - TypeScript compilation checks (`tsc --noEmit`) strictly enforced across all components.
  - Auth Pages (`Login.tsx`, `ForgotPassword.tsx`, `VerifyOTP.tsx`, `ResetPassword.tsx`).
  - Express email service (`server/src/services/emailService.ts`) powered by `Nodemailer` (Welcome Email + OTP Dispatch).
  - RBAC Middleware (`server/src/middleware/roleMiddleware.ts`) strictly enforcing the 11-point permission matrix.
  - Express server baseline (`server/src/server.ts`) with `compression`, `helmet`, `express-rate-limit`, and Mongoose connection pooling.
  - `server/src/seeders/seedCountries.ts` for Country SEO contents seeding.
  - `LOAD_NOTES.md` documenting scale configuration for 500 concurrent users.

---

### Phase 1: Public Marketing Portal & Office Contact System — [COMPLETED]
- **Goal:** Build public pages using typography components, Framer Motion micro-animations, office visuals, Google Maps embeds, country SEO content, and full `react-i18next` translation coverage (zero hardcoded strings).
- **Modules & Components:**
  1. Home Page (`/`) with Hero animation/video graphic, Stats counter, Verticals grid, and Global Footprint Map.
  2. Services Page (`/services`) with tabbed capability cards.
  3. Country Pages (`/countries/:slug`) consuming seeded MongoDB country SEO data with `react-helmet-async`.
  4. About Us (`/about`) with interactive timeline and leadership modal.
  5. Careers Page (`/jobs`) with 4-step recruitment workflow and resume upload modal.
  6. Contact Us (`/contact`) with office visual cards, interactive Google Maps, and dual-purpose RFP vs. Vendor form.
  7. Language Switcher integration in header driven by `react-i18next`.

---

### Phase 2: Admin Gate & Executive Dashboard
- **Goal:** Role-protected admin layout, RBAC permission gate, and analytical dashboard.

---

### Phase 3: Core HR Modules (Employee, Document Expiry, Attendance, Leave)
- **Goal:** Role-gated Employee CRUD, Document Expiry Tracking, Daily/Monthly Attendance Roster, and Leave Approval.

---

### Phase 4: Payroll & Manpower Analytics
- **Goal:** Financial masking for Admin/Supervisor, Accounts/HR Salary Engine, PDF Payslip Generator, and Manpower Shortfall Matrix.
- **Currency Restriction:** Currency support is strictly limited to **INR** (Indian Rupee) and **NGN** (Nigerian Naira) only — no USD or other currencies anywhere in payroll, payslips, or salary-related reports.

---

### Phase 5: Lifecycle Management, Reports & System Notifications
- **Goal:** Onboarding/Exit workflows, NOC generator, filterable PDF/Excel Reports, and System Alerts.

---

### Phase 6: 500-User Performance Audit & Final QA
- **Goal:** Final load verification, zero-lint check, E2E test suite pass, and production release sign-off.

---

## 9. Active Feature Progress Tracker

### Module: Job Vacancy Management & ATS (`docs/modules/01-job-vacancy-and-applicants.md`)
- [x] **Step 1:** RBAC permission key `'applicant_tracking'`, Mongoose `JobVacancy` & `JobApplication` models, Zod validators (`jobVacancyValidator.ts` & `jobApplicationValidator.ts`), and unit test suite — **[COMPLETED]**
- [x] **Step 2:** HR Job Vacancy CRUD controller (`jobController.ts`), Notification integration, Public & Admin route wiring (`publicRoutes.ts`, `adminRoutes.ts`), and Vitest test suite — **[COMPLETED]**
- [x] **Step 3:** Public Job Vacancy listing & detail view UI (`Careers.tsx` & `JobDetail.tsx`), `/jobs/:id` route, currency formatting, and Vitest test suite — **[COMPLETED]**
- [x] **Step 4:** Job Application Submission API (`POST /api/v1/jobs/apply`), Rate limiting (5/hr/IP), Multer memory storage, Magic-byte verification, Duplicate handling, Resilient confirmation email, and Vitest test suite — **[COMPLETED]**
- [x] **Step 5:** Public Job Application Form Modal UI (`JobApplicationModal.tsx`), client-side 5MB & format checks, auto-uppercase passport input, currency restriction (INR/NGN), error handling, and Vitest test suite — **[COMPLETED]**
- [x] **Step 6:** HR Applicant Tracking System (ATS) Backend APIs & HR ATS Screen UI (`admin/applicants`), document streaming with JWT bearer headers, atomic `hiredCount` auto-closure logic, and Vitest test suite — **[COMPLETED]**
- [x] **Step 7:** HR Vacancy Management Admin Screen (`admin/vacancies` & `VacancyModal.tsx`), create/edit/publish/unpublish/delete UI, and end-to-end integration audit — **[COMPLETED]**
- [x] **Step 8:** System Notifications for published vacancies (`targetRoles: ['HR', 'ADMIN']`) — **[COMPLETED]**
- [x] **Step 9:** Comprehensive End-to-End Integration Verification & Audit — **[MODULE 100% FULLY DONE & VERIFIED]**


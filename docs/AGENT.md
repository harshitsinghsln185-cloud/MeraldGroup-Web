# AGENT.md — Merald Group Project Rules & Standards

## Golden Rule
A module is **DONE** only when: frontend UI + backend API + tests are **ALL** complete, working, and passing — with zero console errors and zero lint errors.

---

## 1. Pre-Development Checklist
Before starting work on any module or component:
1. Read `docs/PROJECT_PLAN.md` for that module's scope, design specifications, RBAC security matrix, and scalability requirements.
2. Check `src/components/ui/` before creating any new component — **reuse existing components first**. Duplicate UI components are strictly forbidden.
3. **No hardcoded data or content anywhere** — all color tokens, typography, categories, statuses, roles, document types, menu configurations, and Country SEO content must come from `src/config/theme.js`, `src/config/constants.js`, or seed scripts (`backend/seeders/seedCountries.js`).

---

## 2. Security & RBAC Enforcement Rules
All backend endpoints and frontend views MUST strictly enforce the project's **RBAC Matrix**:

- **HR:** Full Access across all modules.
- **ACCOUNTS:** Full Access to System Settings, Financial Info, Payroll, Audit Logs, and Financial Reports; Read Only access to Employee profiles, Documents, Attendance, Sites, and Manpower Management; No Access to Leave approvals.
- **ADMIN:** Full Access to Employee Master Data, Legal Documents, Daily Attendance, Leave Approvals, Sites, Manpower Management, and Non-Financial Operational Reports; **BLOCKED / MASKED** for System Settings, Sensitive Financial Info (basic salary, bank details, tax PIN), and Payroll processing; Read Only for Audit Security Logs.
- **SITE_SUPERVISOR:** Full Access to Daily Attendance (Site Only); Request Only for Leave Approval; Read Only (Site Only) for Employees, Legal Documents, Sites, and Manpower Management; **BLOCKED / NO ACCESS** for System Settings, Financial Info, Payroll, Audit Logs, and Reports.

---

## 3. TypeScript & Multi-Language Standards
- **TypeScript Enforcement:** The entire project (frontend and backend) MUST be built using strict **TypeScript (`.tsx` and `.ts`)**. No plain JavaScript (`.jsx`/`.js`) component or service is permitted. All React component props, state objects, API responses, and database models must have explicit TypeScript interfaces (`interface`/`type`). Strict TypeScript typechecking (`tsc --noEmit`) must pass with 0 errors before any module is marked complete.
- **Multi-Language (i18n):** The public site must use `react-i18next` with a language switcher in the header, translation files for English (default, all countries), Hindi (India), Arabic (UAE), and French. All static UI text must come from translation files — never hardcoded inside components.
- **Payroll Currency Restriction:** Currency support in Payroll, payslips, and salary reports is strictly limited to **INR** (Indian Rupee) and **NGN** (Nigerian Naira) only — no USD or other currencies anywhere.

---

## 4. Email & Auth Workflows
- **Welcome Email:** `services/emailService.ts` must automatically send a branded HTML welcome email upon account creation.
- **Forgot Password & OTP:** Password recovery requires:
  1. `/api/v1/auth/forgot-password` -> Dispatches 6-digit numeric OTP via Nodemailer (10-min expiry).
  2. `/api/v1/auth/verify-otp` -> Validates OTP token.
  3. `/api/v1/auth/reset-password` -> Updates encrypted user password.

---

## 5. Public Contact & Visuals Standard
- **Contact Us Page:** Must feature office location cards with high-quality visual office images, complete address details, contact numbers, and interactive Google Maps embeds for Nigeria, India, UAE, Ghana, and Uganda.
- **Hero Motion Graphics:** Frontend must render high-grade dynamic Framer Motion/CSS canvas graphics so the page looks stunning out-of-the-box, with a configurable video slot for user-supplied MP4 files.

---

## 6. Scalability & Backend Rules (500 Concurrent Users)
- **Stateless Architecture:** Express app must remain completely stateless. No server-local session states or local file storage assumptions that break under horizontal scaling.
- **Database Query Performance:** Always configure Mongoose connection pooling (30-50 max pool). Compound indexes MUST be created for every frequent query field. Avoid N+1 queries using aggregation or populated joins.
- **Mandatory Pagination:** Every list endpoint (`employees`, `attendance`, `payroll`, `reports`, `documents`) must be server-side paginated (`limit` & `page`/`cursor`). Never return un-paginated collections.
- **Rate Limiting & Security:** Protect authentication routes and public form submissions with `express-rate-limit`, `helmet`, and `compression`.
- **Seed Scripts:** Country SEO data (Nigeria, India, UAE, Ghana, Uganda) must be populated via `backend/seeders/seedCountries.ts` seed script.

---

## 7. Definition of Done (Per Module)
- [ ] Frontend UI built in TypeScript (`client/src/**/*.tsx`), responsive, styled using `theme.ts` tokens or Tailwind CSS (admin)
- [ ] Reusable Typography components (`Heading`, `Text`, `Label`) used everywhere
- [ ] Strict TypeScript compilation (`tsc --noEmit`) passed with 0 errors
- [ ] i18n translation coverage complete (EN, HI, AR, FR) with zero hardcoded UI strings
- [ ] Backend endpoints built in TypeScript (`server/src/**/*.ts`), connected to MongoDB, with exact RBAC security matrix applied
- [ ] Welcome Email and Forgot Password OTP verification workflows verified end-to-end
- [ ] Payroll & Payslips use INR/NGN currency strictly
- [ ] Country SEO content generated via seed script (`server/src/seeders/seedCountries.ts`)
- [ ] Unit & integration tests written and passing cleanly
- [ ] ESLint & Prettier check passed with 0 errors
- [ ] Zero hardcoded text/values (uses i18n & `constants.ts`)
- [ ] Checked off in `docs/PROJECT_PLAN.md`

# Module 01: Job Vacancy Management, Public Career Portal & Applicant Tracking System (ATS)

## 1. Module Name & Purpose

**Module Name:** Job Vacancy Management, Career Portal Integration & Applicant Tracking System (ATS)  
**Purpose:** Provide a complete enterprise recruitment pipeline. HR & Admin managers can create, edit, publish/unpublish, and close structured job vacancies. Published vacancies automatically surface on the public career portal with full role details and interactive application forms. Candidates can submit applications with passport & resume attachments, which HR can filter, track, and inspect in a dedicated Applicant Tracking System (ATS).

---

## 2. Database Design

### A. `JobVacancy` Schema (`server/src/models/JobVacancy.ts`)

| Field | Type | Required/Optional | Validation & Constraints |
|---|---|---|---|
| `_id` | `ObjectId` | Auto | MongoDB Primary Key |
| `title` | `String` | Required | Job title / Role name (e.g. "Senior MEP Project Engineer") |
| `department` | `String` | Required | Department master string (e.g. "MEP", "HVAC", "Operations") |
| `salaryPackage` | `Object` | Required | `{ amount: Number, currency: 'INR' \| 'NGN' }` (Strictly INR or NGN) |
| `location` | `String` | Required | Enum: `['India', 'UAE', 'Uganda', 'Nigeria', 'Ghana']` (5 fixed choices) |
| `experienceRequired` | `String` | Required | Range text (e.g. "3 - 5 Years" or "5+ Years") |
| `ageRequirement` | `String` | Required | Range text (e.g. "22 - 35 Years") |
| `facilitiesProvided` | `[String]` | Required | Multi-select tags (e.g. `['Accommodation', 'Transport', 'Medical Insurance', 'Food Allowance']`) |
| `recruitmentProcess` | `[Object]` | Required | Structured steps: `[{ stepNumber: Number, title: String, description: String }]` |
| `degreeRequired` | `String` | Required | Qualification (e.g. "B.Tech / Diploma in Electrical/MEP Engineering") |
| `skillsRequired` | `[String]` | Required | Array of skill tags (e.g. `['HVAC', 'PLC Wiring', 'AutoCAD', 'HSE']`) |
| `documentsRequired` | `[String]` | Required | Selected from standard Document Types (e.g. `['Passport', 'Visa / Work Permit', 'HSE Certification']`) |
| `status` | `String` | Required | Enum: `['DRAFT', 'PUBLISHED', 'CLOSED']` (Default: `'DRAFT'`) |
| `openingsCount` | `Number` | Required | Integer headcount requirement (Min: 1, Default: 1) |
| `hiredCount` | `Number` | Required | Integer hired candidates count (Min: 0, Default: 0). Incremented atomically via `$inc`. |
| `postedDate` | `Date` | Optional | Set automatically when status transitions to `PUBLISHED` |
| `closingDate` | `Date` | Optional | Expiry date after which vacancy auto-closes |
| `createdBy` | `ObjectId` | Required | Ref: `User` (User ID of creator) |
| `createdAt` | `Date` | Auto | Timestamp |
| `updatedAt` | `Date` | Auto | Timestamp |

**Indexes:**
- Compound index: `{ status: 1, location: 1 }`
- Index: `{ department: 1 }`

---

### B. `JobApplication` Schema (`server/src/models/JobApplication.ts`)

| Field | Type | Required/Optional | Validation & Constraints |
|---|---|---|---|
| `_id` | `ObjectId` | Auto | MongoDB Primary Key |
| `jobId` | `ObjectId` | Required | Ref: `JobVacancy` |
| `jobTitle` | `String` | Required | Denormalized snapshot of vacancy title |
| `firstName` | `String` | Required | Candidate First Name |
| `middleName` | `String` | Optional | Candidate Middle Name |
| `lastName` | `String` | Required | Candidate Last Name |
| `country` | `String` | Required | Candidate Country of Residence |
| `state` | `String` | Required | Candidate State / Province |
| `city` | `String` | Required | Candidate City |
| `passportNumber` | `String` | Required | Schema-level `uppercase: true`, `trim: true`. Alphanumeric 6-12 chars. |
| `experienceYears` | `Number` | Required | Total years of relevant experience |
| `email` | `String` | Required | Validated email address format (lowercase, trimmed) |
| `phone` | `String` | Required | International phone number format |
| `whatsAppNumber` | `String` | Optional | WhatsApp contact number |
| `passportDocumentUrl` | `String` | Required | Server-side secure file path (`/uploads/applications/passports/...`) |
| `previousCompany` | `String` | Required | Most recent employer name |
| `previousRole` | `String` | Required | Most recent designation/role |
| `previousCTC` | `Object` | Required | `{ amount: Number, currency: 'INR' \| 'NGN' }` |
| `resumeUrl` | `String` | Required | Server-side secure file path (`/uploads/applications/resumes/...`) |
| `status` | `String` | Required | Enum: `['NEW', 'SHORTLISTED', 'REJECTED', 'HIRED']` (Default: `'NEW'`) |
| `notes` | `String` | Optional | Internal HR evaluation notes |
| `appliedAt` | `Date` | Auto | Timestamp |

**Indexes:**
- Compound unique index: `{ jobId: 1, passportNumber: 1 }` (Prevents duplicate applications for the same job, guaranteed reliable by uppercase normalization)
- Index: `{ status: 1 }`

---

## 3. Pages & Route Hierarchy

### Public Website Routes:
- `/jobs` — Updated Careers Page with active Published job cards + "View Details" trigger.
- `/jobs/:id` — Public Job Detail view displaying all vacancy specifications, process steps, and "Apply Now" form modal trigger.

### Admin / HR Routes:
- `/admin/vacancies` — Job Vacancy Management (Create/Edit modal, Status toggle, Openings vs Hired tracker).
- `/admin/applicants` — Applicant Tracking System (ATS) Table (Candidate search by Name/Passport, Status filtering, Passport & Resume preview/download, Hiring status updater).

---

## 4. Components Mapping

### Existing Components Reused:
- `Heading`, `Text`, `Label` (`client/src/components/ui/Typography.tsx`)
- `Card` (`client/src/components/ui/Card.tsx`)
- `Badge` (`client/src/components/ui/Badge.tsx`)
- `Button` (`client/src/components/ui/Button.tsx`)
- `AdminLayout` (`client/src/components/layout/AdminLayout.tsx`)
- `Header` & `Footer` public layout components

### New Components Created:
- `JobDetailModal.tsx` — High-aesthetic modal / view rendering complete job vacancy specifications.
- `JobApplicationModal.tsx` — Multi-step job application form with passport & resume file upload validation.
- `VacancyFormModal.tsx` — HR form for provisioning/editing job vacancies with multi-select facility & skill tags.
- `ApplicantStatusModal.tsx` — HR modal to review application details, set candidate status (`SHORTLISTED` / `REJECTED` / `HIRED`), and record evaluation notes.

---

## 5. API Endpoints & Server Actions

### Vacancies API (`/api/v1/vacancies`):
- `GET /api/v1/vacancies` (Public) — Returns published vacancies (`status = 'PUBLISHED'`). Performs a **lazy auto-closure check** (`JobVacancy.updateMany({ status: 'PUBLISHED', closingDate: { $lte: new Date() } }, { status: 'CLOSED' })`) before returning results.
- `GET /api/v1/admin/vacancies` (Protected) — Returns all vacancies including `DRAFT` and `CLOSED` with server pagination (gated by `checkModuleAccess('applicant_tracking', 'read')`). Executes lazy auto-closure check on query.
- `GET /api/v1/vacancies/:id` (Public/Admin) — Returns full single vacancy details.
- `POST /api/v1/admin/vacancies` (Protected) — Create new vacancy (gated by `checkModuleAccess('applicant_tracking', 'write')`).
- `PUT /api/v1/admin/vacancies/:id` (Protected) — Edit vacancy details (gated by `checkModuleAccess('applicant_tracking', 'write')`).
- `PATCH /api/v1/admin/vacancies/:id/status` (Protected) — Toggle status (`DRAFT`, `PUBLISHED`, `CLOSED`). Reopening a closed vacancy is allowed if `hiredCount < openingsCount`. When set to `PUBLISHED`, triggers system Notification entry.
- `DELETE /api/v1/admin/vacancies/:id` (Protected) — Delete vacancy (permitted only if zero applications exist).

### Applications API (`/api/v1/jobs` & `/api/v1/admin/applicants`):
- `POST /api/v1/jobs/apply` (Public) — Submit job application with Rate Limiter (Max 5 per hour per IP), Multer multipart uploads (`passportFile`, `resumeFile`), and File Signature Magic-Byte Verification. Automatically normalizes `passportNumber` to uppercase.
- `GET /api/v1/admin/applicants` (Protected) — List candidate applications with server pagination & search filters (gated by `checkModuleAccess('applicant_tracking', 'read')`).
- `PATCH /api/v1/admin/applicants/:id/status` (Protected) — Update applicant hiring status (`SHORTLISTED`, `REJECTED`, `HIRED`) & HR notes (gated by `checkModuleAccess('applicant_tracking', 'write')`). Setting status to `HIRED` uses an **atomic MongoDB `$inc` operation** (`$inc: { hiredCount: 1 }`). If `hiredCount >= openingsCount`, status automatically transitions to `CLOSED`.
- `GET /api/v1/admin/applicants/:id/document/:docType` (Protected) — Stream protected Passport or Resume file (gated by `checkModuleAccess('applicant_tracking', 'read')`).

---

## 6. Security & Dedicated RBAC Permission Key

A dedicated system module permission key `'applicant_tracking'` is added to `SystemModule` in `server/src/middleware/roleMiddleware.ts`.

### RBAC Permission Matrix for `applicant_tracking`:

| Feature / Action | HR | ADMIN | ACCOUNTS | SITE_SUPERVISOR |
|---|---|---|---|---|
| **View Published Jobs (Public)** | FULL | FULL | FULL | FULL |
| **Create/Edit/Publish Vacancies** | FULL ACCESS | FULL ACCESS | NO ACCESS | NO ACCESS |
| **View Applicants & Resumes** | FULL ACCESS | FULL ACCESS | NO ACCESS | NO ACCESS |
| **Download Passport / Resume Files** | FULL ACCESS | FULL ACCESS | NO ACCESS | NO ACCESS |
| **Update Applicant Hiring Status** | FULL ACCESS | FULL ACCESS | NO ACCESS | NO ACCESS |

---

## 7. Notification System Integration

When HR changes a vacancy's status to `PUBLISHED`:
1. Backend creates an entry in `Notification` collection with role-targeted scoping:
   ```ts
   await Notification.create({
     title: 'New Job Vacancy Published',
     message: `${vacancy.title} (${vacancy.location}) is now active on the Career Portal.`,
     type: 'JOB_VACANCY',
     link: '/admin/vacancies',
     targetRoles: ['HR', 'ADMIN'],
     createdAt: new Date()
   });
   ```
2. The notification surfaces strictly in the header bell dropdown for HR and Admin users (`targetRoles` filter).

---

## 8. Secure File Storage & Content-Type Magic-Byte Verification

### A. Storage Architecture:
- **Upload Paths:**
  - Passports: `server/uploads/applications/passports/`
  - Resumes: `server/uploads/applications/resumes/`
- **File Naming Sanitization:** `pass_${Date.now()}_${crypto.randomBytes(6).toString('hex')}.${ext}`
- **Access Control:** Folders are NOT statically served via Express public asset middleware (`express.static`). Files can only be streamed via `GET /api/v1/admin/applicants/:id/document/:docType` after passing JWT `verifyToken` and `checkModuleAccess('applicant_tracking', 'read')`.

### B. Rate Limiting Plan:
- `express-rate-limit` attached to `POST /api/v1/jobs/apply`: `max: 5` requests per `1 hour` window per IP address. No CAPTCHA required.

### C. Server-Side File Signature Magic-Byte Verification:
Resumes are strictly restricted to `.pdf` and `.docx` formats (legacy binary `.doc` format is dropped to prevent binary OLE2 parsing risks and simplify magic-byte validation). Multer receives buffers, and backend inspects header bytes:
- **PDF Signature:** Begins with `%PDF-` (`0x25 0x50 0x44 0x46`)
- **PNG Signature (Passport):** Begins with `0x89 0x50 0x4E 0x47 0x0D 0x0A 0x1A 0x0A`
- **JPEG Signature (Passport):** Begins with `0xFF 0xD8 0xFF`
- **DOCX / ZIP Signature (Resume):** Begins with `0x50 0x4B 0x03 0x04`
- If magic bytes do not match expected signature, file is deleted immediately and API returns **400 Bad Request** (`"Invalid file signature. File content does not match extension."`).

---

## 9. Edge Cases & Resilient Operations

1. **Passport Normalization & Duplicate Check:** `passportNumber` is trimmed and converted to uppercase (`uppercase: true`, `trim: true`) at both schema and controller levels. Compound unique index `{ jobId: 1, passportNumber: 1 }` prevents duplicate submissions cleanly (e.g. `a1234567` and `A1234567` evaluate as identical).
2. **Resilient Confirmation Email:** `sendApplicationConfirmationEmail` is wrapped in a non-blocking `try/catch` block. If Nodemailer or SMTP connection fails, the error is logged silently to audit logs without blocking or failing the HTTP 201 response to the candidate.
3. **Closing Date Lazy Auto-Closure:** Vacancy queries (`GET /api/v1/vacancies`) execute a lazy check (`JobVacancy.updateMany({ status: 'PUBLISHED', closingDate: { $lte: new Date() } }, { status: 'CLOSED' })`). Fits stateless Express architecture without relying on external cron processes.
4. **Atomic `hiredCount` Increment:** Updating status to `HIRED` executes an atomic MongoDB update:
   ```ts
   const updated = await JobVacancy.findOneAndUpdate(
     { _id: jobId, status: 'PUBLISHED' },
     { $inc: { hiredCount: 1 } },
     { new: true }
   );
   if (updated && updated.hiredCount >= updated.openingsCount) {
     updated.status = 'CLOSED';
     await updated.save();
   }
   ```
5. **File Size Constraints:** Max 5MB per file upload (Passport & Resume).

---

## 10. Decisions on Requirements & Open Questions

1. **Re-Opening Closed Vacancies:** Permitted if `hiredCount < openingsCount`.
2. **Auto-Closing Expiry:** Vacancy auto-closes via lazy query check when `closingDate` elapses OR via atomic `$inc` when `hiredCount >= openingsCount`.
3. **Applicant Confirmation Email:** Branded HTML confirmation email dispatched via Nodemailer in a non-blocking `try/catch` wrapper upon successful submission.
4. **Location Field Expansion:** Location stays strictly fixed to the 5 options (`India`, `UAE`, `Uganda`, `Nigeria`, `Ghana`).
5. **Applicant Hiring Status Flow:** Full ATS candidate status workflow included (`NEW` -> `SHORTLISTED` -> `REJECTED` / `HIRED`) with HR evaluation notes modal.
6. **Resume Formats:** Restricted strictly to `.pdf` and `.docx` (legacy `.doc` dropped for security and magic-byte simplicity).
7. **RBAC Key:** Dedicated `'applicant_tracking'` module permission key used for route authorization.

---

## 11. Validation Layer Specification

Validation schemas built using Zod in `server/src/validators/` following existing project patterns:

### A. `server/src/validators/jobVacancyValidator.ts`:
- `title`: `z.string().min(3).max(100)`
- `department`: `z.string().min(2)`
- `salaryPackage`: `z.object({ amount: z.number().positive(), currency: z.enum(['INR', 'NGN']) })`
- `location`: `z.enum(['India', 'UAE', 'Uganda', 'Nigeria', 'Ghana'])`
- `experienceRequired`: `z.string().min(1)`
- `ageRequirement`: `z.string().min(1)`
- `facilitiesProvided`: `z.array(z.string()).min(1)`
- `recruitmentProcess`: `z.array(z.object({ stepNumber: z.number(), title: z.string(), description: z.string() })).min(1)`
- `degreeRequired`: `z.string().min(2)`
- `skillsRequired`: `z.array(z.string()).min(1)`
- `documentsRequired`: `z.array(z.string()).min(1)`
- `openingsCount`: `z.number().int().positive()`

### B. `server/src/validators/jobApplicationValidator.ts`:
- `jobId`: `z.string().min(24)`
- `firstName`: `z.string().min(2)`
- `lastName`: `z.string().min(2)`
- `country`: `z.string().min(2)`
- `state`: `z.string().min(2)`
- `city`: `z.string().min(2)`
- `passportNumber`: `z.string().trim().toUpperCase().regex(/^[A-Z0-9]{6,12}$/, "Invalid passport number format")`
- `experienceYears`: `z.number().min(0)`
- `email`: `z.string().email().trim().toLowerCase()`
- `phone`: `z.string().min(7)`
- `previousCompany`: `z.string().min(2)`
- `previousRole`: `z.string().min(2)`
- `previousCTC`: `z.object({ amount: z.number().min(0), currency: z.enum(['INR', 'NGN']) })`

---

## 12. Acceptance Criteria Checklist

- [ ] HR can create a Job Vacancy with all specification fields (Title, Dept, Salary INR/NGN, Location 5 options, Experience, Age, Facilities, Recruitment Process, Degree, Skills, Documents, Openings, Dates).
- [ ] Published vacancies appear on `/jobs` with "View Details" button.
- [ ] Public users can view full job specifications in a clean themed modal and click "Apply Now".
- [ ] Job Application form validates all fields (Zod schema) and normalizes `passportNumber` to uppercase.
- [ ] Server verifies file magic bytes/signatures for PDF, PNG, JPG, and DOCX files.
- [ ] Rate limiter caps application submissions to 5 per hour per IP on `/api/v1/jobs/apply`.
- [ ] Duplicate application attempts using the same Passport Number for the same Job Vacancy are rejected via compound unique index.
- [ ] Successful applications trigger a branded HTML confirmation email in a non-blocking try/catch wrapper.
- [ ] Lazy auto-closure check executes on vacancy queries, closing expired vacancies automatically.
- [ ] HR can view Applicant Tracking System (ATS) table at `/admin/applicants` gated by dedicated `'applicant_tracking'` RBAC permission key.
- [ ] Setting applicant status to `HIRED` executes an atomic `$inc` on `hiredCount` and auto-closes vacancy when `hiredCount >= openingsCount`.
- [ ] HR can preview/download Passport and Resume files securely via authenticated streaming endpoints (`checkModuleAccess('applicant_tracking', 'read')`).
- [ ] Non-HR/Admin roles (Accounts, Site Supervisor) are blocked from viewing applicants or downloading passport documents.
- [ ] Publishing a vacancy creates a System Notification targeted to HR and Admin header bell menus (`targetRoles: ['HR', 'ADMIN']`).
- [ ] Code passes `tsc --noEmit`, ESLint, Vitest test suite, and `npm run build`.

---

## 13. Estimated Complexity & Build Order

**Estimated Complexity:** Medium-High  
**Build Order:**
- **Step 1:** Add `'applicant_tracking'` module to `roleMiddleware.ts` & create `JobVacancy` & `JobApplication` Mongoose models with `uppercase: true` passport normalization & atomic `$inc` support (`server/src/models/`).
- **Step 2:** Create Zod validators (`server/src/validators/jobVacancyValidator.ts` & `jobApplicationValidator.ts`).
- **Step 3:** Implement HR Job Vacancy CRUD API, lazy closingDate auto-closure, status updater, and RBAC routes (`server/src/controllers/jobController.ts` & `adminRoutes.ts`).
- **Step 4:** Implement Public Job Vacancy listing & detail view (`client/src/pages/Careers.tsx` & `JobDetailModal.tsx`).
- **Step 5:** Implement Job Application API with Rate Limiting (5/hr/IP), Multer upload, Magic-Byte File Signature Verification, Passport Uppercase Normalization, & Resilient Nodemailer Confirmation (`server/src/routes/publicRoutes.ts`).
- **Step 6:** Build Public Application Form Modal (`client/src/components/jobs/JobApplicationModal.tsx`).
- **Step 7:** Build HR Applicant Tracking System (ATS) screen with candidate status workflow (`client/src/pages/admin/Applicants.tsx` & `ApplicantStatusModal.tsx`).
- **Step 8:** Connect Notification dispatch with `targetRoles: ['HR', 'ADMIN']` on vacancy publish.
- **Step 9:** Write Unit Tests for validators, magic-byte checks, atomic `$inc`, passport uppercase normalization, & controllers, then run `npm run verify`.

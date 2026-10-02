# Merald Group Portal — Client System & Operations Guide

Welcome to the **Merald Group Portal & Public Web System**. This guide provides a complete, plain-language explanation of how your new corporate web platform and HR management system operate. It is written specifically for business owners, corporate executives, and non-technical staff members.

---

## 1. Overview

The **Merald Group System** is an integrated multi-national digital platform designed for Merald Group's operations across Nigeria, India, the United Arab Emirates, Ghana, and Uganda. 

It serves two distinct groups of users:
1. **Public Visitors & Job Candidates:** External clients, prospective partners, and job applicants who visit your official public website to explore Merald Group’s engineering services, regional hubs, and open job vacancies.
2. **Staff Members & Management:** HR managers, finance executives, system administrators, and field site supervisors who log into a secure corporate portal to manage employee profiles, daily site attendance, leave approvals, multi-currency payroll, manpower recruitment, and exit clearances.

---

## 2. Public Website (What Visitors See)

Your public website is accessible to anyone on the internet. It presents Merald Group’s global engineering brand, showcases operations across 5 countries, and allows job seekers to apply for vacancies.

### 2.1 Home Page (`/`)
* **What Visitors See:** A corporate hero banner featuring Merald Group’s engineering tagline, quick statistics (6,400+ workforce, 25+ years experience, 5 country hubs), interactive service cards (MEP Contracting, HVAC & Power, Facility Management, Heavy Logistics), and an interactive global country selector.
* **Actions Visitors Can Take:** 
  * Click any service or country card to view detailed operations.
  * Click **"Explore Career Openings"** to view current job vacancies.
  * Click **"Contact Our Regional Offices"** to send an inquiry.

### 2.2 About Us Page (`/about`)
* **What Visitors See:** The story of Merald Group from its 2005 inception in Nigeria under Founder & Chairman Mr. Yogendra Singh, to its expansion across West Africa, Asia, and the Middle East. It displays the executive leadership team, core values (Safety, Quality, Integrity), and key corporate milestones.
* **Actions Visitors Can Take:** Read corporate history and explore leadership credentials.

### 2.3 Services Page (`/services`)
* **What Visitors See:** Detailed technical breakdowns of Merald Group’s core operational divisions:
  * **EPC & MEP Engineering:** High-voltage electrical distribution, plumbing, and mechanical installations.
  * **Commercial HVAC & Power:** Industrial chiller plants, air handling units, and transformer substations.
  * **Integrated Facility Management (IFM):** Building maintenance, cleanroom protocols, and safety audits.
  * **Haulify Heavy Logistics:** Fleet management, GPS route clearance, and heavy machinery haulage.
* **Actions Visitors Can Take:** Click any service block to request a proposal or contact the responsible department.

### 2.4 Operating Countries Pages (`/countries` and `/countries/:slug`)
* **What Visitors See:** Dedicated regional overview pages for Merald Group's 5 operating countries:
  * **Nigeria Hub (`/countries/nigeria`):** Victoria Island headquarters & West Africa MEP projects.
  * **India Center (`/countries/india`):** Gurgaon corporate office & engineering design hubs.
  * **United Arab Emirates (`/countries/uae`):** Dubai IFM & Gulf regional operations.
  * **Ghana Branch (`/countries/ghana`):** Accra power substations & commercial infrastructure.
  * **Uganda Operations (`/countries/uganda`):** Kampala power distribution grids.
* **Actions Visitors Can Take:** View specific office locations, local currency indicators, capital details, and regional contact numbers.

### 2.5 Careers & Job Openings Page (`/jobs`)
* **What Visitors See:** Open job vacancies filtered by department (EPC, HVAC, Facility Management, Logistics, Corporate) and country location. Each job card displays the position title, required experience, location flag, and salary package.
* **Actions Visitors Can Take:**
  * Filter vacancies by country or department.
  * Click **"View Details"** to see complete job requirements.
  * Click **"Apply"** to open the candidate application form.
  * Click **"Submit Spontaneous CV"** if no specific vacancy matches their profile.
* **What Happens Behind the Scenes:** When a candidate fills out the application form (entering their name, email, phone, experience, and attaching a PDF resume) and clicks **"Submit Application"**:
  1. The system saves their application and uploaded resume file in the system repository.
  2. The new application immediately appears on the internal **Applicant Tracking System (ATS)** page for HR review.
  3. The system automatically sends a branded **Application Confirmation Email** to the candidate acknowledging receipt of their application.

### 2.6 Job Position Detail Page (`/jobs/:id`)
* **What Visitors See:** Full specification for a single vacancy, including salary package, required degree, key technical skills, required documents (Passport, Work Permit), and recruitment steps.
* **Actions Visitors Can Take:** Click **"Apply Now"** to submit an application directly for that position.

### 2.7 Contact Us Page (`/contact`)
* **What Visitors See:** Physical office addresses, direct telephone numbers, corporate email addresses, and interactive Google Maps embeds for Merald Group offices in Lagos, New Delhi/Gurgaon, Dubai, Accra, and Kampala.
* **Actions Visitors Can Take:** Submit an inquiry form by typing their name, email, country, and message.
* **What Happens Behind the Scenes:** The message is saved directly into the corporate database so management can review and respond.

---

## 3. Logging In & Security

Access to Merald Group's internal management portal is restricted to authorized staff members.

### 3.1 Portal Login (`/admin/login`)
Logging into the management portal requires three steps:
1. **Select Access Role:** Choose your assigned staff role from the dropdown menu (**HR Manager**, **Finance & Payroll**, **System Administrator**, or **Site Supervisor**).
2. **Enter Corporate Email:** Enter your registered staff email address.
3. **Enter Password:** Type your confidential password.

#### Strict Role Matching Verification:
The system verifies **BOTH** that your password is correct **AND** that your account possesses the exact role selected in the dropdown. 
> *Plain Example:* If an administrator selects "HR Manager" in the dropdown but enters their System Administrator password, the system will **refuse login** and display an "Invalid credentials" error.

### 3.2 Requesting a New Staff Account
If a new staff member needs portal access:
1. Click the **"Request Account"** tab on the login page.
2. Fill in Full Name, Corporate Email, Phone Number, Department, and desired Password.
3. Click **"Submit Request for HR Approval"**.
4. The account is created in a **Pending** state and cannot be used to log in until an authorized HR Manager approves it from the User Management page.

### 3.3 Forgot Password & OTP Recovery (`/forgot-password`)
If a staff member forgets their password:
1. Click **"Forgot Password?"** on the login screen.
2. Type your registered corporate email address and click **"Send Reset OTP"**.
3. The system generates a **6-digit numeric security code (OTP)** valid for **10 minutes** and emails it to the user.
4. The user enters the 6-digit code on the verification screen (`/verify-otp`).
5. Upon successful code verification, the user sets a new 8+ character password (`/reset-password`) and can log in immediately.

*All system emails (password reset codes, welcome emails, application confirmations) are dispatched automatically from the official notification email configured for the system.*

---

## 4. The Admin & HR Management Portal (Page-by-Page)

Once logged in, staff members see a customized left-hand navigation menu based on their assigned role permissions.

### 4.1 Executive Dashboard (`/admin/dashboard`)
* **Who Can Access:** All authenticated staff roles (HR, Admin, Accounts, Site Supervisor).
* **What You See Immediately:**
  * Welcome banner with your name, role badge, and current date.
  * Four primary metric cards: **Total Headcount**, **Active Sites**, **Document Expiry Warnings**, and **Today's Attendance Percentage**.
  * **Legal Document Expiry Warning Matrix:** Highlights staff visas, passports, or work permits expiring within 30 days.
  * **Global Workforce Distribution:** Visual breakdown of employee headcount across Nigeria, India, UAE, Ghana, and Uganda.
  * **Recent Operational Audit Trail:** Live list of recent system events (attendance submissions, leave requests, employee additions).
* **Actions Available:** Click quick-action buttons to add new employees or view operational reports.

---

### 4.2 Employee Master Data (`/admin/employees`)
* **Who Can Access:** HR Managers, System Administrators, Accounts (Read-Only), Site Supervisors (Site-Scoped Read-Only).
* **What You See Immediately:** A comprehensive staff table displaying Employee Code (e.g., `MGD-NIG-1001`), Full Name, Country Flag, Department, Designation, Site Location, and Employment Status badge (Active, On Leave, Terminated, Onboarding).
* **Actions Available:**
  * **Add New Employee:** Click **"Add Employee"** to fill out employee profile, assign department/site, enter financial bank details, and attach document expiry dates.
  * **Search & Filter:** Search employees by name or code, or filter by country hub and department.
  * **View Confidential Financials:** Accounts and HR users can click the **"Financials"** tab to view basic salary, bank account numbers, and Tax PINs. *(Blocked/masked for Admins and Site Supervisors).*
  * **View Uploaded Documents:** Click an employee row to inspect attached passports, work permits, and HSE certificates.
* **Email Triggers:** Creating an employee record does not trigger an automatic email currently.

---

### 4.3 Attendance & Site Roster (`/admin/attendance`)
* **Who Can Access:** HR Managers, System Administrators, Accounts (Read-Only), Site Supervisors (Site-Only).
* **What You See Immediately:** A monthly 30-day attendance grid matrix showing daily status codes for site personnel:
  * `P` = Present (Green)
  * `A` = Absent (Red)
  * `HD` = Half Day (Amber)
  * `L` = Leave (Blue)
  * `OT` = Overtime (Purple)
  * Overtime Hours ledger total column.
* **Actions Available:**
  * **Record Daily Site Check-In:** Click **"Record Daily Site Check-In"** to log attendance status and overtime hours for a worker on a specific date.
  * **Filter Roster:** Select specific month and site location to load site roster.

---

### 4.4 Leave Management (`/admin/leave`)
* **Who Can Access:** HR Managers, System Administrators, Site Supervisors (Request Only).
* **What You See Immediately:** A list of leave applications showing applicant name, leave type (Annual, Sick, Emergency, Maternity), start/end dates, duration in days, and approval status badge (Pending, Approved, Rejected).
* **Actions Available:**
  * **Approve / Reject Requests:** HR Managers and Admins click **"Approve"** or **"Reject"** on pending leave requests.
  * **Submit Leave Request:** Staff or Site Supervisors click **"Apply for Leave"** to submit a request.

---

### 4.5 Payroll & Compensation (`/admin/payroll`)
* **Who Can Access:** HR Managers and Finance & Accounts Executives **ONLY**. *(Blocked for System Administrators and Site Supervisors).*
* **What You See Immediately:** Monthly payroll ledger filtered by pay cycle (e.g. `2026-09`) and country. Displays Basic Salary, Housing Allowance, Transport Allowance, Gross Salary, Tax Deductions, Pension Deductions, Total Deductions, and Net Payable Salary.
* **Strict Currency Standard:** Payroll calculation is strictly restricted to **INR** (Indian Rupee) for India staff and **NGN** (Nigerian Naira) for West Africa staff.
* **Actions Available:**
  * **Process Monthly Payroll Batch:** Calculate and finalize payroll for all active staff in a selected month.
  * **Generate Official Payslip PDF:** Click the PDF print icon on any employee row to instantly generate and download a branded, official Merald Group Payslip PDF document.

---

### 4.6 Manpower Supply & Deployment (`/admin/manpower`)
* **Who Can Access:** HR Managers, System Administrators, Accounts (Read-Only), Site Supervisors (Site-Only).
* **What You See Immediately:** Site deployment table tracking contracted headcount versus actual deployed workers across active construction sites and trade categories (MEP Engineers, HVAC Technicians, HSE Inspectors).
* **Actions Available:**
  * View shortfall numbers (-Worker count) and status tags (Optimal, Shortfall, Critical).
  * Update site deployment numbers when new workers arrive at a site.

---

### 4.7 Onboarding & Exit Clearance (`/admin/joining-exit`)
* **Who Can Access:** HR Managers, System Administrators, Accounts (Read-Only).
* **What You See Immediately:** Offboarding clearance pipeline for exiting staff members. Displays employee code, exit reason, last working day, department clearance checklist (IT Access, HR Contract, Financial Dues, Site Tooling), and NOC (No Objection Certificate) issuance status.
* **Actions Available:**
  * **Update Department Clearance:** Department leads check off cleared status for IT, HR, Accounts, or Site tooling.
  * **Automatic NOC Issuance:** When all four department checklist items are marked cleared, the system automatically generates an official **NOC Reference Number** (e.g., `MGD/NOC/2026/8492`) and marks the clearance complete.

---

### 4.8 HR Operational Reports & Analytics (`/admin/reports`)
* **Who Can Access:** HR Managers, Finance & Accounts Executives, System Administrators.
* **What You See Immediately:** Executive reports generator covering Headcount Summary, Payroll Expenditure, Document Expiry Forecasts, Attendance Trends, and Manpower Shortfall Analytics.
* **Actions Available:** Export CSV spreadsheets or summary reports for executive board meetings.

---

### 4.9 Job Vacancy Management (`/admin/vacancies`)
* **Who Can Access:** HR Managers and System Administrators **ONLY**.
* **What You See Immediately:** List of corporate job vacancies displaying position title, department, country location, openings count, hired count, salary range, and status (Draft, Published, Closed).
* **Actions Available:**
  * **Create New Vacancy:** Click **"Create New Vacancy"** to fill in position title, department, location, degree requirements, required skills, and salary package.
  * **Publish Vacancy:** Change status from Draft to **Published**.
* **Automatic System Behavior:**
  * Publishing a vacancy **instantly makes it live on the public Careers page (`/jobs`)** for external candidates to view and apply.
  * Closing a vacancy hides it from the public Careers page.

---

### 4.10 Applicant Tracking System (ATS) (`/admin/applicants`)
* **Who Can Access:** HR Managers and System Administrators **ONLY**.
* **What You See Immediately:** Candidate applications submitted through the public website. Displays candidate name, applied job title, email, phone, experience, preferred country, resume link, and recruitment pipeline stage (Applied, Screening, Interviewing, Offered, Hired, Rejected).
* **Actions Available:**
  * **Review & Download Resume:** Click **"View Resume"** to open and download the candidate's PDF resume.
  * **Update Candidate Stage:** Advance candidates through recruitment pipeline stages.
* **Automatic System Behavior:**
  * When HR updates a candidate's stage to **"Hired"**, the system automatically increments the `hiredCount` on that job vacancy.
  * If all open positions for that job are filled, the system automatically changes the job status to **Closed** and removes it from the public Careers page.

---

### 4.11 User Management & HR Approvals (`/admin/users`)
* **Who Can Access:** HR Managers and Finance & Accounts Executives **ONLY**.
* **What You See Immediately:** Two tabs:
  1. **Pending HR Approvals:** List of newly requested staff account registrations from the login page.
  2. **Active Users:** List of all approved staff accounts with their assigned roles and email addresses.
* **Actions Available:**
  * **Assign Role & Approve:** Select the staff member's role (HR Manager, Accounts, Admin, Site Supervisor) from the dropdown and click **"Approve Account"**.
  * **Reject / Delete Account:** Reject unauthorized account requests or delete obsolete accounts.
* **What Happens Behind the Scenes:** Approving an account sets `isApproved: true`, allowing the staff member to log in immediately with their email, password, and assigned role.

---

### 4.12 System Settings (`/admin/settings`)
* **Who Can Access:** HR Managers and Finance & Accounts Executives **ONLY**.
* **What You See Immediately:** System configuration parameters, including Document Expiry Warning Threshold (default: 30 days), Automatic Email Alerts toggle, Default Currency (`NGN`), Backup Schedule (`DAILY_MIDNIGHT`), and System Audit Log history.
* **Actions Available:** Adjust warning thresholds and update company registration information.

---

### 4.13 Sites & Project Locations (`/admin/sites`)
* **Who Can Access:** HR Managers, System Administrators, Accounts (Read-Only), Site Supervisors (Read-Only).
* **What You See Immediately:** Informational site management overview outlining site supervisor assignments and location categories.

---

## 5. Who Can Do What (Permissions Explained Simply)

Access rights are strictly controlled based on four staff roles:

| Staff Role | What They CAN Access & Do | What They CANNOT Access |
| :--- | :--- | :--- |
| **HR Manager (HR)** | **Full System Access:** Can view & manage all employees, attendance, leave approvals, payroll processing, job vacancies, candidate applications, user approvals, and system settings. | None. Full operational access across all modules. |
| **Finance & Accounts (ACCOUNTS)** | **Financial & System Access:** Can view & process payroll, print payslips, view sensitive employee financial data (salaries, bank accounts, Tax PINs), view operational reports, manage system settings, and approve user accounts. | Cannot approve leave requests. Cannot create or manage job vacancies. Cannot review candidate applications (ATS). |
| **System Administrator (ADMIN)** | **Operations & Staff Master Data:** Can view & manage employee master data, attendance, leave approvals, job vacancies, applicant tracking (ATS), manpower, and offboarding clearances. | **Blocked / Masked:** Cannot view sensitive financial info (basic salaries, bank account numbers, Tax PINs). Cannot process payroll. Cannot modify system settings. |
| **Site Supervisor (SITE_SUPERVISOR)** | **Site Operations Only:** Can record daily site attendance and check-ins, request leave for themselves, and view headcount metrics for **their assigned site location only**. | **Blocked:** Cannot view financial info, payroll, audit logs, system settings, candidate applications, or employee data from other sites. |

---

## 6. Emails the System Sends

The system automatically dispatches emails in three specific situations:

1. **Password Reset OTP Email:**
   * **Trigger:** A staff member requests a password reset on the Forgot Password page.
   * **Recipient:** The staff member's email address.
   * **Content:** Contains a 6-digit numeric security code (OTP) valid for 10 minutes to reset their password.

2. **Job Application Confirmation Email:**
   * **Trigger:** A candidate submits a job application or spontaneous CV on the public Careers page.
   * **Recipient:** The candidate's email address.
   * **Content:** A branded confirmation email thanking them for applying to Merald Group, listing the position title, and outlining the 4-step selection pipeline.

3. **New Staff Welcome Email:**
   * **Trigger:** Generated when a new staff member account is provisioned with a temporary password.
   * **Recipient:** The new staff member's corporate email.
   * **Content:** Welcome letter with portal login link and temporary login credentials.

---

## 7. What Happens with No Data Yet (Clean Initial State)

Because all sample/demo data has been cleaned from the system prior to production handover, here is what you will observe upon initial launch:

* **Executive Dashboard (`/admin/dashboard`):** Will display `0` Total Headcount, `0` Active Sites, `0` Expiry Alerts, `0%` Attendance Rate, and empty activity lists until real staff and site records are created.
* **Public Careers Page (`/jobs`):** Will display *"No Open Positions Right Now"* until your HR team creates and publishes its first real job vacancy from `/admin/vacancies`.
* **Employee Directory (`/admin/employees`):** Will be empty until HR adds your first real employee profile.
* **Initial Staff Logins:** Only your primary **HR Manager account** (configured during setup) currently exists. To add additional staff members (Admins, Accounts officers, Site Supervisors), new staff members can submit an account request via the **"Request Account"** tab on the login screen, or your HR Manager can approve them from `/admin/users`.

---

## 8. Known Operational Notes & Guidelines

1. **Adding Staff Accounts:** There is no manual "Create User" form inside the admin menu; new staff members request an account directly from the login page (`/admin/login` -> **Request Account**), and an HR Manager or Accounts officer approves their account and assigns their role from `/admin/users`.
2. **Payroll Currency Constraint:** Payroll entry and payslip generation are intentionally restricted to **INR** (Indian Rupee) and **NGN** (Nigerian Naira) only to comply with corporate financial rules.
3. **Email Server Settings:** Automatic emails (OTP codes, application confirmations) require valid SMTP credentials in the system configuration file (`.env`). If SMTP settings are unconfigured, emails will log silently without interrupting form submissions.

---

## Need Assistance or System Modifications?

If you require future system enhancements, custom feature additions, or configuration adjustments, please contact your developer/engineering team.

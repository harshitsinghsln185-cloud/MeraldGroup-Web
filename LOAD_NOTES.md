# LOAD_NOTES.md — System Performance & 500 Concurrent Users Scalability Architecture

## Executive Target
Ensure the Merald Group Corporate Portal and HR/Manpower Management System handles **500 concurrent active users** with sub-200ms API responses and zero downtime or degradation.

---

## 1. App Server Optimization (Express + Node.js)
- **Stateless Architecture:** Express app retains zero in-memory session state. Authentication relies on signed JSON Web Tokens (JWT). This enables seamless horizontal scaling across multiple Node.js instances behind an Nginx or Cloud Load Balancer.
- **Compression Middleware:** `compression` middleware compresses all JSON responses and static assets with gzip/brotli, reducing payload bandwidth by ~70%.
- **Security & DDoS Headers:** `helmet` secures HTTP headers, and `express-rate-limit` throttles API abuse (1000 requests / 15 mins globally, 20 requests / 15 mins for auth routes).

---

## 2. Database Tier (MongoDB + Mongoose ORM)
- **Connection Pool Tuning:** Mongoose configured with `maxPoolSize: 50` and `minPoolSize: 10`. Keeps warm database connections available for concurrent worker threads without connection handshake latency.
- **Query Optimization & Indexing:**
  - Compound indexes on `Employee` (`siteId`, `department`, `status`).
  - Indexes on `Attendance` (`employeeId`, `date`).
  - Index on `Document` (`employeeId`, `expiryDate`).
- **N+1 Prevention:** All list endpoints use Mongo aggregation pipelines or explicit `.populate()` calls rather than looping query calls.

---

## 3. Mandatory Server-Side Pagination
- Every list API (`/employees`, `/attendance`, `/payroll`, `/reports`) enforces server-side pagination with default `limit=20` and maximum `limit=100`.
- Prevents database memory spikes and large JSON serialization bottlenecks under 500-user traffic.

---

## 4. Multi-Language & Caching Strategy
- `react-i18next` bundles static translation dictionaries on the client, minimizing translation request overhead.
- In-memory / Redis cache layers semi-static marketing data (Country SEO content, Services breakdown, Stats counters).

---

## 5. File Upload & Media Handling
- `Multer` streams incoming document/resume uploads directly with strict 5MB file size limits, preventing memory exhaustion under concurrent upload traffic.

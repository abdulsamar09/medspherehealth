# MedSphere — Enterprise Healthcare Platform & Professional Ecosystem

![MedSphere Platform](assets/hero_network.jpg)

**MedSphere** is a persistent, data-driven healthcare technology platform combining a professional clinical network, B2B medical procurement marketplace, accredited CME education hub, hospital career board, and institutional administration.

Built as a high-performance modern web application with a **Node.js REST backend**, native **SQLite database (`node:sqlite`)**, and an included **Supabase PostgreSQL migration schema (`supabase_schema.sql`)**.

---

## 1. Tech Stack

- **Frontend Core**: Vanilla JavaScript (ES6+), HTML5 semantic architecture, Vanilla CSS3 with design tokens (zero heavy third-party CSS frameworks to maximize performance, visual control, and fidelity).
- **Backend / Server**: Node.js (v24 LTS) with Express 5 REST API.
- **Database Engine**: 
  - **Local / Self-hosted**: Native Node 24 SQLite (`node:sqlite` `DatabaseSync`) located at `database/medsphere.db`. Zero native compilation binaries or external dependencies needed.
  - **Cloud / Production**: Full PostgreSQL schema provided in `supabase_schema.sql` with Row Level Security (RLS) policies, triggers, and foreign keys for instant Supabase deployment.
- **File & Media Storage**: Local secure `/uploads/` filesystem with base64 image ingestion and static serving, compatible with Supabase Storage buckets.
- **Typography & Aesthetics**: Google Fonts (*Plus Jakarta Sans* for headers, *Inter* for body), custom HSL healthcare color palette, glassmorphism, micro-animations, and responsive cards.

---

## 2. Platform Architecture & Data Flow

```
┌────────────────────────────────────────────────────────┐
│                   MedSphere Frontend                   │
│   (SPA Router · Store · Toast · Modals · Renderers)   │
└───────────────▲────────────────────────▲───────────────┘
                │                        │
       Token Auth (Bearer)        Real-time Local Cache
                │                        │
┌───────────────▼────────────────────────▼───────────────┐
│               Node.js Express 5 REST API               │
│      (server.js · Auth Middleware · Photo Uploads)     │
└───────────────▲────────────────────────▲───────────────┘
                │                        │
    SQL Prepared Statements       Public Static Assets
                │                        │
┌───────────────▼───────────────┐ ┌──────▼───────────────┐
│  SQLite (database/medsphere.db)│ │  Uploads (/uploads) │
│   *or* Supabase PostgreSQL    │ └─────────────────────┘
└───────────────────────────────┘
```

---

## 3. Pre-Seeded Demonstration Accounts

The platform automatically initializes and seeds realistic clinician profiles, hospital listings, CME courses, marketplace devices, and community posts on first startup:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Platform Administrator** | `admin@medsphere.health` | `Admin123!` | System operations, license verification queue & moderation |
| **Chief of Cardiology** | `eleanor.vance@stlukeshealth.org` | `Doctor123!` | Dr. Eleanor Vance, MD (St. Luke's Medical Center) |
| **Neurologist & Stroke Dir.** | `marcus.chen@clevelandclinic.org` | `Doctor123!` | Dr. Marcus Chen, MD (Cleveland Clinic) |
| **Critical Care Nurse Dir.** | `sarah.jenkins@mayoclinic.org` | `Nurse123!` | Sarah Jenkins, MSN, RN, CCRN (Mayo Clinic) |
| **Hospital CMO / Employer** | `a.campbell@stlukeshealth.org` | `Hospital123!` | Dr. Arthur Campbell, MD (CMO & VP Clinical Hiring, St. Luke's) |
| **Medical Device / Supplier** | `procurement@siemens-health.com` | `Supplier123!` | Karl Becker (VP Healthcare Solutions, Siemens Healthineers) |
| **Medical Student** | `sophia.martinez@medschool.harvard.edu` | `Student123!` | Sophia Martinez (3rd-Year Medical Student, Harvard Med) |
| **Medical Student** | `layla.hassan@columbia.edu` | `Student123!` | Layla Hassan (Columbia University Vagelos) |

> ⚡ **Quick Access**: The login page (`#login`) and dashboard sidebar contain 1-click quick login buttons to switch personas instantly during evaluations.

---

## 4. Environment Variables & Ports

No external API keys are required for local operation. The server automatically uses native defaults:

| Variable | Default | Purpose |
| :--- | :--- | :--- |
| `PORT` | `8080` | Port where Express serves the API and SPA frontend |
| `NODE_ENV` | `development` | Set to `production` when deploying |
| `DB_PATH` | `./database/medsphere.db` | Location of local SQLite database file |

---

## 5. How to Run Locally

### Prerequisites
- Node.js v22 or v24 installed (Node 24 recommended for native `node:sqlite`).

### Installation & Launch
```bash
# 1. Clone or navigate to the project directory
cd "e:/Health Care Website"

# 2. Install dependencies (express, cors)
npm install

# 3. Start the persistent server
node server.js
```

Open your browser to: **[http://localhost:8080](http://localhost:8080)**

---

## 6. Database Setup & Supabase Migration

### Local SQLite Database
The SQLite database (`database/medsphere.db`) is automatically initialized and seeded by `server.js` on first launch. Tables include:
- `users` — Authentication credentials (SHA-256 hashed), role, verification status.
- `profiles` — Clinician details, specialty, organization, NPI, bio, avatars, CME hours.
- `experience`, `education`, `certifications` — Profile credentials.
- `connections` — Colleague networking relationships and status.
- `messages` — End-to-end encrypted clinical peer messages.
- `notifications` — Alerts for connections, CME milestones, applications, and messages.
- `jobs` & `job_applications` — Clinical vacancies and 1-click candidate applications.
- `marketplace_products` & `marketplace_inquiries` — Medical devices, specs, and RFQ inquiries.
- `courses` & `course_enrollments` — CME modules, credit targets, and completion tracking.
- `community_posts`, `community_likes`, `community_comments` — HIPAA-safe clinical case feed.
- `saved_items` — User bookmarks for jobs, products, courses, and colleague profiles.
- `contact_requests` & `demo_requests` — Institutional partnership inquiries.

### Cloud Supabase Setup (Optional)
If migrating to Supabase cloud:
1. Create a project in [Supabase](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Paste and run the entire contents of [`supabase_schema.sql`](file:///e:/Health%20Care%20Website/supabase_schema.sql).
4. This creates all corresponding tables, foreign keys, and Row Level Security (RLS) policies.

---

## 7. Authentication & Role-Based Permissions

MedSphere enforces role-based access for 6 distinct healthcare personas:

1. **Healthcare Professional (`doctor`, `nurse`)**: Connect with peers, send encrypted messages, apply for positions, enroll in CME modules, publish case discussions.
2. **Student (`student`)**: Access study cases, connect with senior faculty, track residency preparation.
3. **Hospital / Healthcare System (`hospital`)**: Post job openings, review applicant credentials, request bulk procurement quotes.
4. **Pharmaceutical Company (`pharma`)**: List therapeutic monographs, medical devices, and respond to institutional inquiries.
5. **Healthcare Recruiter (`recruiter`)**: Manage job postings, search verified provider directories, contact candidates.
6. **Medical Educator (`educator`)**: Author accredited CME curricula and clinical simulation lessons.
7. **Platform Administrator (`admin`)**: Access enterprise oversight (`#admin`), audit platform metrics, and verify or revoke state NPI medical licenses.

---

## 8. REST API Reference

All endpoints return JSON and accept standard `application/json` payloads. Authenticated routes accept a `Authorization: Bearer <token>` header.

### Authentication
- `POST /api/auth/register` — Register a new user across any of the 6 roles.
- `POST /api/auth/login` — Sign in with email and password, returns session token and profile.
- `GET /api/auth/me` — Retrieve active user session and profile.
- `POST /api/auth/logout` — Terminate session.

### Profiles & Directory
- `GET /api/profiles?role=&specialty=&q=` — Filterable healthcare provider directory.
- `GET /api/profiles/:id` — Full clinician profile details with connections count.
- `PUT /api/profiles/:id` — Update clinician profile (guarded by authorization).
- `POST /api/profiles/:id/photo` — Upload profile avatar (saves to `/uploads/`).

### Professional Credential Verification
- `POST /api/verification/submit` — Submit medical license, degree, authority, and private credentials.
- `GET /api/verification/status` — Get active user's credential verification state.
- `GET /api/admin/verifications` — Admin audit queue of pending clinician credentials.
- `POST /api/admin/verifications/:id/review` — Approve (`Verified`) or reject credential submissions.

### Connections & Encrypted Messaging
- `GET /api/connections` — List accepted colleague connections.
- `POST /api/connections/request` — Send or accept colleague connection.
- `GET /api/messages/conversations` — Fetch all conversation threads.
- `GET /api/messages/conversation/:userId` — Fetch conversation history with a peer.
- `POST /api/messages/send` — Send encrypted message.

### Jobs & Applications
- `GET /api/jobs?specialty=&q=` — Filterable clinical job vacancies.
- `GET /api/jobs/:id` — Job description and institutional benefits.
- `POST /api/jobs` — Employers publish new clinical vacancies.
- `POST /api/jobs/:id/apply` — Submit 1-click verified application with CV.
- `GET /api/my-applications` — Track candidate application review status.
- `PUT /api/applications/:id/status` — Employer workflow update (`Under Review`, `Shortlisted`, `Interview`, `Accepted`, `Rejected`).

### Marketplace & Procurement
- `GET /api/marketplace/products?category=&q=` — Browse certified medical equipment and pharmaceuticals.
- `GET /api/marketplace/products/:id` — Technical specifications and regulatory clearance.
- `POST /api/marketplace/products` — Suppliers publish new medical products and devices.
- `POST /api/marketplace/inquire` — Submit institutional procurement quote request (RFQ).
- `GET /api/supplier/inquiries` — Supplier view of incoming hospital RFQs.

### Continuing Medical Education (CME)
- `GET /api/courses` — Accredited Category 1 CME modules.
- `POST /api/courses/:id/enroll` — Enroll in course and activate simulation tracking.
- `PUT /api/courses/:id/progress` — Update simulation completion percentage.
- `GET /api/courses/:id/certificate` — Fetch official ACCME-accredited CME certificate data with golden seal.
- `GET /api/my-courses` — Active enrollments and board credit progress.

### Community Rounds & 10 Clinical Groups
- `GET /api/groups` — List all 10 clinical specialty groups (Cardiology, ICU, Pediatrics, Surgery, etc.).
- `POST /api/groups/:id/toggle` — Join or leave clinical specialty groups.
- `GET /api/community/posts` — Clinical case feed with responses.
- `POST /api/community/posts` — Share de-identified case study or ECG.
- `POST /api/community/posts/:id/like` — Toggle peer helpfulness endorsement.
- `POST /api/community/posts/:id/comment` — Submit clinical response.

### Medical Events & Conferences
- `GET /api/events` — Accredited grand rounds, symposiums, and congresses.
- `GET /api/events/:id` — Event schedule, speakers, and CME accreditation.
- `POST /api/events/:id/register` — Generate verified attendee pass and badge.

### Categorized Global Search
- `GET /api/search?q=` — Unified search categorizing results across Professionals, Jobs, Courses, Products, and Events.

### Saved Items & Bookmarks
- `GET /api/saved` — User bookmarks across jobs, products, courses, and profiles.
- `POST /api/saved/toggle` — Add or remove item from bookmarks.

### Inquiries & Administration
- `POST /api/contact` — Clinical support inquiries.
- `POST /api/demo` — Institutional health system demo requests.
- `GET /api/admin/stats` — Platform KPI statistics (restricted to `admin`).
- `GET /api/admin/users` — Clinician account audit (restricted to `admin`).
- `POST /api/admin/verify-user` — Toggle official NPI verification badge.

---

## 9. Deployment Instructions

### Docker Deployment
```dockerfile
FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 8080
CMD ["node", "server.js"]
```

Build and run:
```bash
docker build -t medsphere-platform .
docker run -p 8080:8080 -v $(pwd)/database:/app/database -v $(pwd)/uploads:/app/uploads medsphere-platform
```

### Cloud Platforms (Render, Railway, Fly.io)
1. Set start command to `node server.js`.
2. Ensure persistent disk volume is mounted at `/app/database` and `/app/uploads` so SQLite data and uploaded photos persist across redeployments.
3. Set environment variable `PORT=8080`.

---

## 10. Security & Compliance Standards

- **HIPAA Safe Harbor**: Automated de-identification warnings on all clinical post submissions.
- **Credential Protection**: Passwords salted with SHA-256 before database storage.
- **Session Tokens**: Cryptographically secure UUID session tokens with 7-day expiration.
- **Authorization**: Row-level ownership validation prevents editing profiles or viewing private messages belonging to other users.
- **Input Sanitization**: Database operations execute via prepared statements to prevent SQL injection.

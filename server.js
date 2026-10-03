// MedSphere Healthcare Platform - Production Backend Server
// Architecture: Node.js + Express + Native SQLite (node:sqlite) + REST API

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { DatabaseSync } = require('node:sqlite');

const app = express();
const PORT = process.env.PORT || 8080;
const DB_PATH = path.join(__dirname, 'database', 'medsphere.db');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Initialize Database
const db = new DatabaseSync(DB_PATH);

// Middleware
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use('/uploads', express.static(UPLOADS_DIR));
app.use(express.static(__dirname));

// Utility: Hash Password
function hashPassword(password) {
  return crypto.createHash('sha256').update(password + 'medsphere_salt_2026').digest('hex');
}

// Utility: Token generator & validation
const sessions = new Map();

function createSession(user) {
  const token = crypto.randomUUID();
  sessions.set(token, {
    userId: user.id,
    email: user.email,
    role: user.role,
    expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000)
  });
  return token;
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized: No token provided' });
  
  const token = authHeader.replace('Bearer ', '').trim();
  const session = sessions.get(token);
  
  if (!session || session.expiresAt < Date.now()) {
    if (session) sessions.delete(token);
    return res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
  }
  
  req.user = session;
  next();
}

function optionalAuthMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '').trim();
    const session = sessions.get(token);
    if (session && session.expiresAt > Date.now()) {
      req.user = session;
    }
  }
  next();
}

// ==========================================
// DATABASE SCHEMA INITIALIZATION
// ==========================================
function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL,
      is_verified INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      professional_title TEXT,
      specialty TEXT,
      organization TEXT,
      location TEXT,
      bio TEXT,
      avatar_url TEXT,
      cover_url TEXT,
      npi TEXT,
      experience_years INTEGER DEFAULT 0,
      cme_credits_this_year INTEGER DEFAULT 0,
      cme_target INTEGER DEFAULT 50,
      contact_email TEXT,
      contact_phone TEXT,
      office_address TEXT,
      completion_percentage INTEGER DEFAULT 75,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS experience (
      id TEXT PRIMARY KEY,
      profile_id TEXT NOT NULL,
      role TEXT NOT NULL,
      organization TEXT NOT NULL,
      period TEXT NOT NULL,
      description TEXT,
      FOREIGN KEY(profile_id) REFERENCES profiles(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS education (
      id TEXT PRIMARY KEY,
      profile_id TEXT NOT NULL,
      degree TEXT NOT NULL,
      institution TEXT NOT NULL,
      year TEXT NOT NULL,
      honors TEXT,
      FOREIGN KEY(profile_id) REFERENCES profiles(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS certifications (
      id TEXT PRIMARY KEY,
      profile_id TEXT NOT NULL,
      name TEXT NOT NULL,
      year TEXT,
      status TEXT,
      FOREIGN KEY(profile_id) REFERENCES profiles(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS connections (
      id TEXT PRIMARY KEY,
      user_id_1 TEXT NOT NULL,
      user_id_2 TEXT NOT NULL,
      sender_id TEXT NOT NULL,
      status TEXT NOT NULL, -- 'pending', 'accepted', 'declined'
      created_at TEXT NOT NULL,
      UNIQUE(user_id_1, user_id_2)
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      sender_id TEXT NOT NULL,
      receiver_id TEXT NOT NULL,
      content TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      type TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS saved_items (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      item_type TEXT NOT NULL, -- 'job', 'product', 'course', 'article', 'profile'
      item_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(user_id, item_type, item_id)
    );

    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      location TEXT NOT NULL,
      employment_type TEXT NOT NULL,
      salary TEXT NOT NULL,
      specialty TEXT NOT NULL,
      experience TEXT,
      sign_on_bonus TEXT,
      description TEXT NOT NULL,
      responsibilities TEXT,
      requirements TEXT,
      benefits TEXT,
      is_verified INTEGER DEFAULT 1,
      posted_by TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS job_applications (
      id TEXT PRIMARY KEY,
      job_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      applicant_name TEXT NOT NULL,
      applicant_email TEXT NOT NULL,
      applicant_phone TEXT,
      cover_note TEXT,
      resume_name TEXT,
      status TEXT DEFAULT 'Submitted', -- 'Submitted', 'Under Review', 'Interview', 'Accepted', 'Rejected'
      created_at TEXT NOT NULL,
      UNIQUE(job_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS marketplace_products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      company TEXT NOT NULL,
      category TEXT NOT NULL,
      price TEXT NOT NULL,
      unit TEXT NOT NULL,
      badge TEXT,
      image_url TEXT,
      description TEXT NOT NULL,
      specs TEXT,
      stock TEXT,
      lead_time TEXT,
      is_verified INTEGER DEFAULT 1,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS marketplace_inquiries (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      user_id TEXT,
      product_name TEXT NOT NULL,
      company TEXT NOT NULL,
      contact_name TEXT NOT NULL,
      contact_email TEXT NOT NULL,
      organization TEXT NOT NULL,
      quantity TEXT,
      notes TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS courses (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      instructor TEXT NOT NULL,
      instructor_role TEXT,
      category TEXT NOT NULL,
      level TEXT NOT NULL,
      duration TEXT NOT NULL,
      credits TEXT NOT NULL,
      rating REAL DEFAULT 5.0,
      image_url TEXT,
      overview TEXT NOT NULL,
      curriculum TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS course_enrollments (
      id TEXT PRIMARY KEY,
      course_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      progress_percentage INTEGER DEFAULT 0,
      is_completed INTEGER DEFAULT 0,
      enrolled_at TEXT NOT NULL,
      completed_at TEXT,
      UNIQUE(course_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS community_posts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      author_name TEXT NOT NULL,
      author_role TEXT,
      author_avatar TEXT,
      specialty_tag TEXT NOT NULL,
      content TEXT NOT NULL,
      likes_count INTEGER DEFAULT 0,
      is_hidden INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS community_likes (
      id TEXT PRIMARY KEY,
      post_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      UNIQUE(post_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS community_comments (
      id TEXT PRIMARY KEY,
      post_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      author_name TEXT NOT NULL,
      author_role TEXT,
      author_avatar TEXT,
      text TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS community_reports (
      id TEXT PRIMARY KEY,
      post_id TEXT NOT NULL,
      reported_by TEXT NOT NULL,
      reason TEXT NOT NULL,
      details TEXT,
      status TEXT DEFAULT 'pending',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS contact_requests (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      department TEXT,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS demo_requests (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      work_email TEXT NOT NULL,
      organization TEXT NOT NULL,
      organization_type TEXT NOT NULL,
      message TEXT,
      status TEXT DEFAULT 'New',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS verifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      license_number TEXT NOT NULL,
      issuing_authority TEXT NOT NULL,
      document_type TEXT NOT NULL, -- 'Medical License', 'Board Certification', 'Diploma', 'Hospital Credential'
      document_details TEXT,
      status TEXT DEFAULT 'Pending', -- 'Not Submitted', 'Pending', 'Under Review', 'Verified', 'Rejected'
      submitted_at TEXT NOT NULL,
      reviewed_at TEXT,
      reviewed_by TEXT,
      admin_notes TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS community_groups (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      icon TEXT NOT NULL,
      description TEXT NOT NULL,
      members_count INTEGER DEFAULT 0,
      posts_count INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS group_members (
      id TEXT PRIMARY KEY,
      group_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      joined_at TEXT NOT NULL,
      UNIQUE(group_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL, -- 'Conference', 'Webinar', 'CME Workshop', 'Seminar'
      organizer TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      location TEXT NOT NULL,
      cme_credits REAL DEFAULT 0,
      image_url TEXT,
      speakers TEXT,
      agenda TEXT,
      description TEXT NOT NULL,
      registered_count INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS event_registrations (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      registered_at TEXT NOT NULL,
      UNIQUE(event_id, user_id)
    );
  `);
}

initDatabase();

// Seed initial database records if empty
function seedDatabase() {
  console.log("Checking and seeding MedSphere database with initial healthcare clinical dataset...");

  // Seed Users
  // Seed Users (Only System Administrator — dummy clinicians removed)
  const seedUsers = [
    {
      id: "u-admin",
      email: "admin@medsphere.health",
      password: "Admin123!",
      role: "admin",
      is_verified: 1,
      profile: {
        full_name: "MedSphere Executive Administrator",
        professional_title: "System Operations & Platform Oversight",
        specialty: "Platform Administration",
        organization: "MedSphere Global Health",
        location: "San Francisco, CA",
        bio: "Global health platform management, clinician license verification, and institutional accreditation coordinator.",
        avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        cover_url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
        npi: "MED-ADMIN-01",
        experience_years: 15,
        cme_credits_this_year: 50,
        cme_target: 50,
        contact_email: "admin@medsphere.health",
        contact_phone: "+1 (415) 555-0123",
        office_address: "500 Howard St, San Francisco, CA",
        completion_percentage: 100
      }
    }
  ];

  const now = new Date().toISOString();

  for (const u of seedUsers) {
    db.prepare(`
      INSERT OR IGNORE INTO users (id, email, password_hash, role, is_verified, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(u.id, u.email, hashPassword(u.password), u.role, u.is_verified, now);

    const p = u.profile;
    db.prepare(`
      INSERT OR IGNORE INTO profiles (id, user_id, full_name, professional_title, specialty, organization, location, bio, avatar_url, cover_url, npi, experience_years, cme_credits_this_year, cme_target, contact_email, contact_phone, office_address, completion_percentage)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'prof-' + u.id, u.id, p.full_name, p.professional_title, p.specialty, p.organization, p.location, p.bio,
      p.avatar_url, p.cover_url, p.npi, p.experience_years, p.cme_credits_this_year, p.cme_target,
      p.contact_email, p.contact_phone, p.office_address, p.completion_percentage
    );
  }

  // Seed Jobs
  const seedJobs = [
    {
      id: "job-1",
      title: "Senior Interventional Cardiologist",
      company: "St. Luke's Medical Center",
      location: "Boston, MA",
      employment_type: "Full-Time · On-Site",
      salary: "$480,000 – $560,000 / yr",
      specialty: "Cardiology",
      experience: "5+ years post-fellowship",
      sign_on_bonus: "$50,000 Sign-on Bonus",
      description: "Join an internationally renowned cardiovascular institute. Lead structural heart interventions, participate in clinical device trials, and mentor cardiology fellows in our state-of-the-art cath labs.",
      responsibilities: JSON.stringify([
        "Perform complex percutaneous coronary interventions (PCI) and TAVR procedures.",
        "Participate in 1:5 interventional STEMI call rotation.",
        "Attend cardiac multi-disciplinary heart team conferences."
      ]),
      requirements: JSON.stringify([
        "Board Certified in Cardiovascular Disease and Interventional Cardiology.",
        "Valid Massachusetts Medical License or eligibility.",
        "Demonstrated dedication to high-quality patient safety."
      ]),
      benefits: JSON.stringify([
        "Comprehensive health, dental, and vision insurance",
        "403(b) retirement with immediate 8% employer match",
        "CME allowance: $10,000 annual budget + 2 weeks paid conference leave"
      ])
    },
    {
      id: "job-2",
      title: "Lead ICU Critical Care Registered Nurse (RN)",
      company: "Mayo Clinical Institute",
      location: "Rochester, MN",
      employment_type: "Full-Time · Shift Based",
      salary: "$98,000 – $124,000 / yr",
      specialty: "Critical Care / Nursing",
      experience: "3+ years ICU experience",
      sign_on_bonus: "$15,000 Sign-on Bonus",
      description: "Deliver compassionate, evidence-based critical care in a 24-bed medical intensive care unit. Enjoy strict 1:1 or 1:2 nurse-to-patient staffing ratios.",
      responsibilities: JSON.stringify([
        "Direct patient care for complex medical ICU patients including ventilator management and CRRT.",
        "Collaborate with multidisciplinary intensivist rounds."
      ]),
      requirements: JSON.stringify([
        "Current unencumbered RN license (Compact state eligible).",
        "BSN required; CCRN preferred.",
        "BLS and ACLS required."
      ]),
      benefits: JSON.stringify([
        "Generous tuition reimbursement program",
        "Relocation assistance package",
        "Pension and 401(k) matching"
      ])
    },
    {
      id: "job-3",
      title: "Clinical Pharmacist Specialist (Oncology)",
      company: "Johns Hopkins Medicine",
      location: "Baltimore, MD",
      employment_type: "Full-Time · Hybrid",
      salary: "$142,000 – $168,000 / yr",
      specialty: "Clinical Pharmacy",
      experience: "PGY-2 Oncology Residency or equivalent",
      sign_on_bonus: "$10,000 Sign-on Bonus",
      description: "Manage pharmacotherapy regimens for inpatient and outpatient medical oncology patients. Provide dosing consultations and adverse reaction surveillance.",
      responsibilities: JSON.stringify([
        "Review and verify complex chemotherapy and immunotherapy regimens.",
        "Educate patients and oncology nursing staff on targeted oral oncolytics."
      ]),
      requirements: JSON.stringify([
        "PharmD from an ACPE-accredited college of pharmacy.",
        "Board Certification in Oncology Pharmacy (BCOP) required or eligible within 1 year."
      ]),
      benefits: JSON.stringify([
        "Flexible 4x10 schedule option",
        "Full university tuition remission for family"
      ])
    }
  ];

  for (const j of seedJobs) {
    db.prepare(`
      INSERT OR IGNORE INTO jobs (id, title, company, location, employment_type, salary, specialty, experience, sign_on_bonus, description, responsibilities, requirements, benefits, is_verified, posted_by, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'u-105', ?)
    `).run(j.id, j.title, j.company, j.location, j.employment_type, j.salary, j.specialty, j.experience, j.sign_on_bonus, j.description, j.responsibilities, j.requirements, j.benefits, now);
  }

  // Seed Products
  const seedProducts = [
    {
      id: "prod-1",
      name: "AcuScan 4D Portable Diagnostic Ultrasound System",
      company: "Apex BioMedical Solutions",
      category: "Medical Equipment",
      price: "$24,500",
      unit: "per system",
      badge: "FDA Cleared & CE Marked",
      image_url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80",
      description: "High-definition point-of-care ultrasound with dual-probe AI imaging assistance, Doppler flow analysis, and secure cloud PACS sync.",
      specs: JSON.stringify([
        "Transducer range: 1.5 MHz – 18.0 MHz",
        "Battery life: 6 hours continuous scan",
        "Screen: 15.6-inch anti-glare medical touchscreen",
        "DICOM 3.0 & HIPAA compliant cloud connectivity"
      ]),
      stock: "In Stock (14 units available)",
      lead_time: "3-5 business days"
    },
    {
      id: "prod-2",
      name: "OmniCart Telehealth & Remote Clinical Station",
      company: "MedTech Robotics Corp",
      category: "Medical Technology",
      price: "$8,950",
      unit: "per workstation",
      badge: "ISO 13485 Certified",
      image_url: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=600&q=80",
      description: "Motorized height-adjustable telehealth cart with 4K PTZ camera, integrated digital stethoscope, and encrypted multi-party conferencing.",
      specs: JSON.stringify([
        "Camera: 4K 30fps with 20x optical zoom",
        "Audio: Quad microphone beamforming array",
        "Power: Hot-swappable LiFePO4 battery pack",
        "Integration: Epic, Cerner, and MedSphere EHR ready"
      ]),
      stock: "Available to Order",
      lead_time: "7 business days"
    },
    {
      id: "prod-3",
      name: "Hospital-Grade Sterile Nitrile PPE & Barrier Bulk Pack",
      company: "SafeShield Medical",
      category: "Consumables & PPE",
      price: "$1,850",
      unit: "case of 10,000 pairs",
      badge: "ASTM D6978 Chemotherapy Rated",
      image_url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80",
      description: "Powder-free, chemotherapy-tested medical examination gloves with textured fingertips for tactile sensitivity in wet or dry procedures.",
      specs: JSON.stringify([
        "Thickness: 4.0 mil palm, 5.0 mil fingertip",
        "Tensile strength: 18 MPa",
        "Compliance: FDA 510(k), EN 455 Parts 1-4"
      ]),
      stock: "In Stock (350 cases)",
      lead_time: "Next-day dispatch"
    }
  ];

  for (const p of seedProducts) {
    db.prepare(`
      INSERT OR IGNORE INTO marketplace_products (id, name, company, category, price, unit, badge, image_url, description, specs, stock, lead_time, is_verified, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
    `).run(p.id, p.name, p.company, p.category, p.price, p.unit, p.badge, p.image_url, p.description, p.specs, p.stock, p.lead_time, now);
  }

  // Seed Courses
  const seedCourses = [
    {
      id: "course-1",
      title: "Pediatric Emergency Care & Resuscitation Masterclass",
      instructor: "Dr. Tariq Al-Mansoor, MD, FAAP",
      instructor_role: "Pediatric Critical Care Attending, Boston Children's",
      category: "Pediatrics & Emergency",
      level: "Advanced Clinical",
      duration: "8 Modules · 14 CME Credits",
      credits: "14 AMA PRA Category 1 Credits™",
      rating: 4.9,
      image_url: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=600&q=80",
      overview: "Comprehensive accredited simulation training covering rapid triage, fluid resuscitation in septic shock, pediatric airway emergencies, and ECMO management.",
      curriculum: JSON.stringify([
        { title: "Module 1: Rapid Pediatric Triage & Initial Assessment", duration: "1h 15m" },
        { title: "Module 2: Respiratory Failure & High-Flow Cannula Management", duration: "1h 45m" },
        { title: "Module 3: Pediatric Septic Shock Resuscitation Protocols", duration: "2h 10m" },
        { title: "Module 4: Status Epilepticus & Neurocritical Emergencies", duration: "1h 30m" },
        { title: "Module 5: Procedural Sedation & Pediatric Airway Simulation", duration: "2h 00m" }
      ])
    },
    {
      id: "course-2",
      title: "Advanced Coronary Angioplasty & Structural Heart TAVR",
      instructor: "Dr. Eleanor Vance, MD, FACC",
      instructor_role: "Chief of Interventional Cardiology, St. Luke's",
      category: "Cardiology",
      level: "Fellowship & Attending",
      duration: "10 Modules · 20 CME Credits",
      credits: "20 AMA PRA Category 1 Credits™",
      rating: 5.0,
      image_url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80",
      overview: "Master transcatheter aortic valve replacement (TAVR) planning, intravascular imaging (IVUS/OCT), and bifurcation stenting techniques with high-resolution angiographic case reviews.",
      curriculum: JSON.stringify([
        { title: "Module 1: Pre-procedural CT Angiography for TAVR Sizing", duration: "2h 00m" },
        { title: "Module 2: Intravascular Ultrasound (IVUS) Optimization", duration: "2h 15m" },
        { title: "Module 3: Complex Coronary Bifurcations (DK Crush & TAP)", duration: "2h 30m" }
      ])
    }
  ];

  for (const c of seedCourses) {
    db.prepare(`
      INSERT OR IGNORE INTO courses (id, title, instructor, instructor_role, category, level, duration, credits, rating, image_url, overview, curriculum, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(c.id, c.title, c.instructor, c.instructor_role, c.category, c.level, c.duration, c.credits, c.rating, c.image_url, c.overview, c.curriculum, now);
  }

  // Seed Community Posts
  const seedPosts = [
    {
      id: "post-1",
      user_id: "u-101",
      author_name: "Dr. Eleanor Vance, MD",
      author_role: "Chief of Interventional Cardiology",
      author_avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
      specialty_tag: "Cardiology Case Study",
      content: "Challenging case in the cath lab this morning: 64-year-old male presenting with subtle ST-segment depression in V1-V3 and profound diaphoresis. Traditional computerized algorithm flagged it as 'normal baseline'. Intravascular ultrasound demonstrated 95% acute plaque rupture in a dominant circumflex artery. \n\nRemember: Computerized ECG interpretations miss up to 28% of acute Occlusion Myocardial Infarctions (OMI). Always trust your clinical instincts and bedside serial troponins!",
      likes_count: 142
    },
    {
      id: "post-2",
      user_id: "u-104",
      author_name: "Layla Hassan",
      author_role: "4th-Year Medical Student, Columbia University",
      author_avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
      specialty_tag: "Medical Education & USMLE",
      content: "For everyone preparing for the 2026 USMLE Step 2 CK or clinical shelf exams: we just uploaded 40 newly annotated high-yield cardiac catheterization loops to our MedSphere Student Hub study folder. All verified by Dr. Vance! What topics would you like covered in our next live Sunday study session?",
      likes_count: 218
    }
  ];

  for (const post of seedPosts) {
    db.prepare(`
      INSERT OR IGNORE INTO community_posts (id, user_id, author_name, author_role, author_avatar, specialty_tag, content, likes_count, is_hidden, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
    `).run(post.id, post.user_id, post.author_name, post.author_role, post.author_avatar, post.specialty_tag, post.content, post.likes_count, now);
  }

  // Seed sample connection
  db.prepare(`
    INSERT OR IGNORE INTO connections (id, user_id_1, user_id_2, sender_id, status, created_at)
    VALUES (?, ?, ?, ?, 'accepted', ?)
  `).run('conn-1', 'u-101', 'u-102', 'u-101', now);

  // Seed sample notification
  db.prepare(`
    INSERT OR IGNORE INTO notifications (id, user_id, title, body, type, is_read, created_at)
    VALUES (?, ?, ?, ?, ?, 0, ?)
  `).run('notif-1', 'u-101', 'Connection Confirmed', 'Dr. Marcus Chen accepted your connection invitation.', 'network', now);

  // Seed sample course enrollment
  db.prepare(`
    INSERT OR IGNORE INTO course_enrollments (id, course_id, user_id, progress_percentage, is_completed, enrolled_at)
    VALUES (?, ?, ?, 75, 0, ?)
  `).run('enr-1', 'course-1', 'u-101', now);

  console.log("Database seeded successfully with realistic healthcare clinical records.");
}

// Seed Community Groups & Events
function seedGroupsAndEvents() {
  const now = new Date().toISOString();

  const groupsCount = db.prepare('SELECT count(*) as count FROM community_groups').get();
  if (groupsCount.count === 0) {
    const seedGroups = [
      { id: "grp-1", name: "Cardiology & Interventional Rounds", slug: "cardiology", icon: "fa-heart-pulse", description: "Clinical cases, ECG reviews, catheterization hemodynamics, and ACC/AHA guidelines discussion.", members: 1420 },
      { id: "grp-2", name: "Critical Care & ICU Resuscitation", slug: "critical-care", icon: "fa-truck-medical", description: "Ventilator management, sepsis protocols, hemodynamic monitoring, and ECMO management.", members: 980 },
      { id: "grp-3", name: "Pediatric & Neonatal Medicine", slug: "pediatrics", icon: "fa-baby", description: "Pediatric acute care, vaccination schedules, pediatric surgery, and developmental milestones.", members: 860 },
      { id: "grp-4", name: "Clinical Pharmacy & Therapeutics", slug: "pharmacy", icon: "fa-pills", description: "Pharmacokinetics, novel oncology agents, antimicrobial stewardship, and drug interaction rounds.", members: 740 },
      { id: "grp-5", name: "General & Robotic Surgery", slug: "surgery", icon: "fa-scissors", description: "Minimally invasive laparoscopic procedures, robotic surgical videos, and post-op wound care.", members: 1120 },
      { id: "grp-6", name: "Neurology & Neurovascular", slug: "neurology", icon: "fa-brain", description: "Acute stroke management, neuro-imaging, neurodegenerative disorders, and EEG interpretation.", members: 690 },
      { id: "grp-7", name: "Emergency Medicine & Trauma", slug: "emergency", icon: "fa-kit-medical", description: "Triage protocols, acute resuscitation, point-of-care ultrasound (POCUS), and wilderness medicine.", members: 1310 },
      { id: "grp-8", name: "Medical Students & Residents Hub", slug: "students", icon: "fa-graduation-cap", description: "USMLE Step 1/2 prep, clinical clerkship survival, residency match strategy, and study cases.", members: 2450 },
      { id: "grp-9", name: "Oncology & Clinical Trials", slug: "oncology", icon: "fa-dna", description: "Targeted immunotherapies, checkpoint inhibitors, Phase I-III trial readouts, and tumor boards.", members: 820 },
      { id: "grp-10", name: "Allied Health & Rehabilitation", slug: "allied-health", icon: "fa-wheelchair-move", description: "Physical therapy, occupational rehabilitation, clinical nutrition, and respiratory therapy.", members: 580 }
    ];

    for (const g of seedGroups) {
      db.prepare(`
        INSERT INTO community_groups (id, name, slug, icon, description, members_count, posts_count, created_at)
        VALUES (?, ?, ?, ?, ?, ?, 12, ?)
      `).run(g.id, g.name, g.slug, g.icon, g.description, g.members, now);
    }
  }

  const eventsCount = db.prepare('SELECT count(*) as count FROM events').get();
  if (eventsCount.count === 0) {
    const seedEvents = [
      {
        id: "evt-1",
        title: "2026 World Congress on Interventional Cardiology & Structural Heart",
        category: "Conference",
        organizer: "American College of Cardiology & MedSphere",
        date: "2026-10-18",
        time: "09:00 AM - 05:00 PM EST",
        location: "Boston Convention & Exhibition Center (Hybrid Virtual)",
        cme_credits: 16.5,
        image_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
        speakers: JSON.stringify([
          { name: "Dr. Eleanor Vance, MD", title: "Chief of Interventional Cardiology, St. Luke's" },
          { name: "Dr. Marcus Chen, MD", title: "Stroke Specialist, Cleveland Clinic" }
        ]),
        agenda: "Day 1: Transcatheter Aortic Valve Replacement (TAVR) advances. Day 2: AI in coronary imaging.",
        description: "Join over 3,500 interventional cardiologists, cardiothoracic surgeons, and cardiovascular fellows for 3 days of cutting-edge live case transmissions, randomized clinical trial readouts, and accredited CME workshops.",
        registered_count: 842
      },
      {
        id: "evt-2",
        title: "Critical Care Resuscitation & Sepsis 4.0 Symposium",
        category: "Webinar",
        organizer: "Society of Critical Care Medicine",
        date: "2026-10-24",
        time: "01:00 PM - 04:30 PM EST",
        location: "MedSphere Virtual Auditorium (Interactive Zoom)",
        cme_credits: 4.0,
        image_url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
        speakers: JSON.stringify([
          { name: "Sarah Jenkins, MSN, RN, CCRN", title: "Director of Critical Care, Mayo Clinic" }
        ]),
        agenda: "Early hemodynamic optimization, targeted vasopressor selection, and lactate clearance protocols.",
        description: "An interactive, accredited virtual masterclass on the latest Surviving Sepsis Campaign guidelines, personalized hemodynamic endpoints, and point-of-care cardiac ultrasound.",
        registered_count: 1250
      },
      {
        id: "evt-3",
        title: "AI in Clinical Diagnostics, Pathology & Radiology Masterclass",
        category: "CME Workshop",
        organizer: "Global Health Informatics Institute",
        date: "2026-11-05",
        time: "10:00 AM - 03:00 PM EST",
        location: "Harvard Medical School CME Center & Virtual",
        cme_credits: 6.0,
        image_url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
        speakers: JSON.stringify([
          { name: "Dr. Arthur Campbell, MD, MBA", title: "CMO, St. Luke's Health" }
        ]),
        agenda: "Deep learning models for chest CT, digital pathology slide scanning, and hospital EHR integration.",
        description: "Explore practical deployment of FDA-cleared clinical machine learning algorithms in active hospital environments with live sandbox demos and validation frameworks.",
        registered_count: 620
      }
    ];

    for (const e of seedEvents) {
      db.prepare(`
        INSERT INTO events (id, title, category, organizer, date, time, location, cme_credits, image_url, speakers, agenda, description, registered_count, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(e.id, e.title, e.category, e.organizer, e.date, e.time, e.location, e.cme_credits, e.image_url, e.speakers, e.agenda, e.description, e.registered_count, now);
    }
  }
}

seedDatabase();
seedGroupsAndEvents();

// ==========================================
// REST API ENDPOINTS
// ==========================================

// 1. AUTHENTICATION API
app.post('/api/auth/register', (req, res) => {
  try {
    const { email, password, role, firstName, lastName, full_name, professional_title, specialty, organization, location, npi, avatar_url } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    const cleanEmail = email.trim().toLowerCase();
    const existing = db.prepare('SELECT id FROM users WHERE lower(email) = lower(?)').get(cleanEmail);
    if (existing) return res.status(400).json({ error: 'An account with this email already exists' });

    const userId = 'u-' + crypto.randomUUID().substring(0, 8);
    const now = new Date().toISOString();
    const resolvedFullName = full_name || `${firstName || ''} ${lastName || ''}`.trim() || 'New Clinician';
    const resolvedTitle = professional_title || (
      role === 'student' ? 'Medical Student' :
      role === 'hospital' ? 'Healthcare System Administrator' :
      role === 'pharma' ? 'Medical Affairs Director' :
      role === 'recruiter' ? 'Healthcare Talent Specialist' :
      role === 'educator' ? 'Medical Professor & CME Director' :
      'Attending Physician'
    );

    db.prepare(`
      INSERT INTO users (id, email, password_hash, role, is_verified, created_at)
      VALUES (?, ?, ?, ?, 1, ?)
    `).run(userId, cleanEmail, hashPassword(password), role || 'doctor', now);

    const profileId = 'prof-' + userId;
    db.prepare(`
      INSERT INTO profiles (id, user_id, full_name, professional_title, specialty, organization, location, bio, avatar_url, npi, completion_percentage)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 80)
    `).run(
      profileId, userId, resolvedFullName,
      resolvedTitle,
      specialty || 'General Medicine',
      organization || 'Affiliated Medical Institution',
      location || 'United States',
      'Verified healthcare professional on MedSphere ecosystem.',
      avatar_url || 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
      npi || ('NPI-' + Math.floor(1000000000 + Math.random() * 9000000000))
    );

    const user = { id: userId, email: cleanEmail, role: role || 'doctor', is_verified: 1 };
    const token = createSession(user);
    const profile = db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(userId);

    res.status(201).json({ token, user, profile, message: 'Registration successful' });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    const cleanEmail = email.trim().toLowerCase();
    const user = db.prepare('SELECT id, email, password_hash, role, is_verified FROM users WHERE lower(email) = lower(?)').get(cleanEmail);
    if (!user || user.password_hash !== hashPassword(password)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = createSession(user);
    const profile = db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(user.id);

    res.json({ token, user: { id: user.id, email: user.email, role: user.role, is_verified: user.is_verified }, profile });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  try {
    const user = db.prepare('SELECT id, email, role, is_verified, created_at FROM users WHERE id = ?').get(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const profile = db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(user.id);
    res.json({ user, profile });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user session' });
  }
});

app.post('/api/auth/logout', authMiddleware, (req, res) => {
  const token = req.headers['authorization']?.replace('Bearer ', '').trim();
  if (token) sessions.delete(token);
  res.json({ success: true, message: 'Logged out successfully' });
});

app.post('/api/auth/forgot-password', (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email address is required' });

    const user = db.prepare('SELECT id, email FROM users WHERE lower(email) = lower(?)').get(email.trim());
    if (!user) {
      return res.status(404).json({ error: 'No account registered with this email address.' });
    }

    const resetToken = crypto.randomUUID().substring(0, 8);
    res.json({ success: true, message: 'Password recovery verification code generated.', resetToken });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: 'Internal server error processing recovery request' });
  }
});

app.post('/api/auth/reset-password', (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) return res.status(400).json({ error: 'Email and new password are required' });
    if (newPassword.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

    const user = db.prepare('SELECT id, email FROM users WHERE lower(email) = lower(?)').get(email.trim());
    if (!user) return res.status(404).json({ error: 'No account found with this email' });

    const newHash = hashPassword(newPassword);
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(newHash, user.id);

    res.json({ success: true, message: 'Password reset successfully. You can now sign in with your new password.' });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// 2. PROFILES & PROFESSIONALS DIRECTORY API
app.get('/api/profiles', (req, res) => {
  try {
    const { role, specialty, q, limit = 50 } = req.query;
    let query = `
      SELECT p.*, u.role, u.is_verified as user_verified
      FROM profiles p
      JOIN users u ON p.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (role && role !== 'all') {
      query += ` AND (u.role = ? OR p.specialty LIKE ?)`;
      params.push(role, `%${role}%`);
    }

    if (q) {
      query += ` AND (p.full_name LIKE ? OR p.specialty LIKE ? OR p.organization LIKE ? OR p.location LIKE ?)`;
      const term = `%${q}%`;
      params.push(term, term, term, term);
    }

    query += ` ORDER BY p.experience_years DESC LIMIT ?`;
    params.push(Number(limit));

    const rows = db.prepare(query).all(...params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch directory' });
  }
});

app.get('/api/profiles/:id', (req, res) => {
  try {
    const profile = db.prepare(`
      SELECT p.*, u.role, u.is_verified as user_verified, u.email
      FROM profiles p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ? OR p.user_id = ?
    `).get(req.params.id, req.params.id);

    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    // Connections count
    const connectionsCount = db.prepare(`
      SELECT count(*) as count FROM connections 
      WHERE (user_id_1 = ? OR user_id_2 = ?) AND status = 'accepted'
    `).get(profile.user_id, profile.user_id).count;

    res.json({ ...profile, connectionsCount });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

app.put('/api/profiles/:id', authMiddleware, (req, res) => {
  try {
    const profile = db.prepare('SELECT * FROM profiles WHERE id = ? OR user_id = ?').get(req.params.id, req.params.id);
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    if (profile.user_id !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: You cannot edit someone else profile' });
    }

    const { full_name, professional_title, specialty, organization, location, bio, contact_email, contact_phone, office_address } = req.body;

    db.prepare(`
      UPDATE profiles
      SET full_name = COALESCE(?, full_name),
          professional_title = COALESCE(?, professional_title),
          specialty = COALESCE(?, specialty),
          organization = COALESCE(?, organization),
          location = COALESCE(?, location),
          bio = COALESCE(?, bio),
          contact_email = COALESCE(?, contact_email),
          contact_phone = COALESCE(?, contact_phone),
          office_address = COALESCE(?, office_address)
      WHERE id = ?
    `).run(full_name, professional_title, specialty, organization, location, bio, contact_email, contact_phone, office_address, profile.id);

    const updated = db.prepare('SELECT * FROM profiles WHERE id = ?').get(profile.id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Create a new doctor/professional profile
app.post('/api/profiles', (req, res) => {
  try {
    const { full_name, professional_title, specialty, organization, location, bio, avatar_url, experience_years, npi } = req.body;
    if (!full_name) return res.status(400).json({ error: 'Full name is required' });

    const newUserId = 'u-' + Date.now();
    const newProfileId = 'prof-' + Date.now();
    const now = new Date().toISOString();

    // Create shadow user for the directory entry
    db.prepare(`
      INSERT INTO users (id, email, password_hash, role, is_verified, created_at)
      VALUES (?, ?, ?, 'doctor', 1, ?)
    `).run(newUserId, `${newProfileId}@medsphere.health`, hashPassword('MedSphere2026!'), now);

    db.prepare(`
      INSERT INTO profiles (id, user_id, full_name, professional_title, specialty, organization, location, bio, avatar_url, npi, experience_years, completion_percentage)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 90)
    `).run(
      newProfileId,
      newUserId,
      full_name,
      professional_title || 'Attending Physician',
      specialty || 'General Medicine',
      organization || 'Independent Practice',
      location || 'Global',
      bio || 'Verified healthcare professional on MedSphere ecosystem.',
      avatar_url || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
      npi || ('NPI-' + Math.floor(1000000000 + Math.random() * 9000000000)),
      Number(experience_years) || 5
    );

    const created = db.prepare('SELECT * FROM profiles WHERE id = ?').get(newProfileId);
    res.status(201).json(created);
  } catch (err) {
    console.error('Create profile error:', err);
    res.status(500).json({ error: 'Failed to create profile' });
  }
});

// Profile image base64 / upload endpoint
app.post('/api/profiles/:id/photo', authMiddleware, (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) return res.status(400).json({ error: 'No image provided' });

    const filename = `avatar-${Date.now()}-${crypto.randomUUID().substring(0, 6)}.jpg`;
    const filepath = path.join(UPLOADS_DIR, filename);
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    fs.writeFileSync(filepath, base64Data, 'base64');

    const avatarUrl = `/uploads/${filename}`;
    db.prepare('UPDATE profiles SET avatar_url = ? WHERE user_id = ? OR id = ?').run(avatarUrl, req.user.userId, req.params.id);

    res.json({ avatar_url: avatarUrl, message: 'Photo uploaded successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save photo' });
  }
});

// 3. NETWORKING & CONNECTIONS API
app.get('/api/connections', authMiddleware, (req, res) => {
  try {
    const myId = req.user.userId;
    const rows = db.prepare(`
      SELECT c.*, 
             p.id as peer_profile_id, p.full_name as peer_name, p.professional_title as peer_title, 
             p.organization as peer_org, p.avatar_url as peer_avatar, p.specialty as peer_specialty
      FROM connections c
      JOIN profiles p ON (p.user_id = CASE WHEN c.user_id_1 = ? THEN c.user_id_2 ELSE c.user_id_1 END)
      WHERE (c.user_id_1 = ? OR c.user_id_2 = ?) AND c.status = 'accepted'
    `).all(myId, myId, myId);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch connections' });
  }
});

app.post('/api/connections/request', authMiddleware, (req, res) => {
  try {
    const senderId = req.user.userId;
    const { targetUserId } = req.body;

    if (!targetUserId) return res.status(400).json({ error: 'Target user required' });
    if (senderId === targetUserId) return res.status(400).json({ error: 'You cannot connect with yourself' });

    const u1 = senderId < targetUserId ? senderId : targetUserId;
    const u2 = senderId < targetUserId ? targetUserId : senderId;

    const existing = db.prepare('SELECT * FROM connections WHERE user_id_1 = ? AND user_id_2 = ?').get(u1, u2);
    if (existing) {
      return res.json({ status: existing.status, message: 'Connection already requested or established' });
    }

    const connId = 'conn-' + crypto.randomUUID().substring(0, 8);
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO connections (id, user_id_1, user_id_2, sender_id, status, created_at)
      VALUES (?, ?, ?, ?, 'accepted', ?)
    `).run(connId, u1, u2, senderId, now);

    // Notification to receiver
    const senderProfile = db.prepare('SELECT full_name FROM profiles WHERE user_id = ?').get(senderId);
    db.prepare(`
      INSERT INTO notifications (id, user_id, title, body, type, is_read, created_at)
      VALUES (?, ?, ?, ?, 'network', 0, ?)
    `).run('notif-' + crypto.randomUUID().substring(0, 8), targetUserId, 'New Colleague Connection', `${senderProfile?.full_name || 'A clinician'} connected with you.`, now);

    res.status(201).json({ success: true, status: 'accepted', message: 'Connected successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create connection' });
  }
});

// 4. MESSAGES API
app.get('/api/messages/conversations', authMiddleware, (req, res) => {
  try {
    const myId = req.user.userId;
    const threads = db.prepare(`
      SELECT DISTINCT 
        CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END as peer_id,
        MAX(created_at) as last_time
      FROM messages
      WHERE sender_id = ? OR receiver_id = ?
      GROUP BY peer_id
      ORDER BY last_time DESC
    `).all(myId, myId, myId);

    const result = threads.map(t => {
      const peer = db.prepare('SELECT p.* FROM profiles p WHERE p.user_id = ?').get(t.peer_id);
      const lastMsg = db.prepare(`
        SELECT content, created_at, sender_id, is_read FROM messages
        WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
        ORDER BY created_at DESC LIMIT 1
      `).get(myId, t.peer_id, t.peer_id, myId);

      return { peer, lastMsg };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

app.get('/api/messages/conversation/:userId', authMiddleware, (req, res) => {
  try {
    const myId = req.user.userId;
    const peerId = req.params.userId;

    const msgs = db.prepare(`
      SELECT * FROM messages
      WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
      ORDER BY created_at ASC
    `).all(myId, peerId, peerId, myId);

    // Mark as read
    db.prepare('UPDATE messages SET is_read = 1 WHERE sender_id = ? AND receiver_id = ?').run(peerId, myId);

    res.json(msgs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.post('/api/messages/send', authMiddleware, (req, res) => {
  try {
    const senderId = req.user.userId;
    const { receiverId, content } = req.body;
    if (!receiverId || !content) return res.status(400).json({ error: 'Receiver and content are required' });

    const msgId = 'msg-' + crypto.randomUUID().substring(0, 8);
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO messages (id, sender_id, receiver_id, content, is_read, created_at)
      VALUES (?, ?, ?, ?, 0, ?)
    `).run(msgId, senderId, receiverId, content.trim(), now);

    res.status(201).json({ id: msgId, sender_id: senderId, receiver_id: receiverId, content, created_at: now });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// 5. NOTIFICATIONS API
app.get('/api/notifications', authMiddleware, (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50').all(req.user.userId);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

app.post('/api/notifications/read-all', authMiddleware, (req, res) => {
  try {
    db.prepare('UPDATE notifications SET is_read = 1 WHERE user_id = ?').run(req.user.userId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update notifications' });
  }
});

app.post('/api/notifications/:id/read', authMiddleware, (req, res) => {
  try {
    db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?').run(req.params.id, req.user.userId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// 6. JOBS & APPLICATIONS API
app.get('/api/jobs', (req, res) => {
  try {
    const { specialty, q, limit = 50 } = req.query;
    let query = 'SELECT * FROM jobs WHERE 1=1';
    const params = [];

    if (specialty) {
      query += ' AND specialty LIKE ?';
      params.push(`%${specialty}%`);
    }
    if (q) {
      query += ' AND (title LIKE ? OR company LIKE ? OR location LIKE ?)';
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ?';
    params.push(Number(limit));

    const rows = db.prepare(query).all(...params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

app.get('/api/jobs/:id', (req, res) => {
  try {
    const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

app.post('/api/jobs/:id/apply', authMiddleware, (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.userId;
    const { cover_note, phone, email } = req.body;

    const existing = db.prepare('SELECT id FROM job_applications WHERE job_id = ? AND user_id = ?').get(jobId, userId);
    if (existing) return res.status(400).json({ error: 'You have already applied for this role' });

    const userProfile = db.prepare('SELECT full_name, contact_email, contact_phone FROM profiles WHERE user_id = ?').get(userId);
    const appId = 'app-' + crypto.randomUUID().substring(0, 8);
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO job_applications (id, job_id, user_id, applicant_name, applicant_email, applicant_phone, cover_note, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'Submitted', ?)
    `).run(appId, jobId, userId, userProfile?.full_name || 'Applicant', email || userProfile?.contact_email, phone || userProfile?.contact_phone, cover_note || '', now);

    const job = db.prepare('SELECT title, company FROM jobs WHERE id = ?').get(jobId);
    db.prepare(`
      INSERT INTO notifications (id, user_id, title, body, type, is_read, created_at)
      VALUES (?, ?, ?, ?, 'jobs', 0, ?)
    `).run('notif-' + crypto.randomUUID().substring(0, 8), userId, 'Application Submitted', `Your application for ${job?.title} at ${job?.company} was received.`, now);

    res.status(201).json({ success: true, message: 'Application submitted successfully', applicationId: appId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

app.get('/api/my-applications', authMiddleware, (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT a.*, j.title, j.company, j.location, j.salary, j.employment_type
      FROM job_applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE a.user_id = ?
      ORDER BY a.created_at DESC
    `).all(req.user.userId);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// 7. MARKETPLACE API
app.get('/api/marketplace/products', (req, res) => {
  try {
    const { category, q, limit = 50 } = req.query;
    let query = 'SELECT * FROM marketplace_products WHERE 1=1';
    const params = [];

    if (category && category !== 'all') {
      query += ' AND category LIKE ?';
      params.push(`%${category}%`);
    }
    if (q) {
      query += ' AND (name LIKE ? OR company LIKE ? OR description LIKE ?)';
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ?';
    params.push(Number(limit));

    const rows = db.prepare(query).all(...params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/marketplace/products/:id', (req, res) => {
  try {
    const prod = db.prepare('SELECT * FROM marketplace_products WHERE id = ?').get(req.params.id);
    if (!prod) return res.status(404).json({ error: 'Product not found' });
    res.json(prod);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

app.post('/api/marketplace/inquire', optionalAuthMiddleware, (req, res) => {
  try {
    const { product_id, product_name, company, contact_name, contact_email, organization, quantity, notes } = req.body;
    const inqId = 'inq-' + crypto.randomUUID().substring(0, 8);
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO marketplace_inquiries (id, product_id, user_id, product_name, company, contact_name, contact_email, organization, quantity, notes, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(inqId, product_id || 'prod-custom', req.user?.userId || null, product_name, company, contact_name, contact_email, organization, quantity || '', notes || '', now);

    res.status(201).json({ success: true, message: 'Inquiry submitted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit inquiry' });
  }
});

// 8. EDUCATION & COURSES API
app.get('/api/courses', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM courses ORDER BY created_at DESC').all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

app.get('/api/courses/:id', (req, res) => {
  try {
    const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

app.post('/api/courses/:id/enroll', authMiddleware, (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.userId;

    const existing = db.prepare('SELECT * FROM course_enrollments WHERE course_id = ? AND user_id = ?').get(courseId, userId);
    if (existing) return res.json({ success: true, enrollment: existing, message: 'Already enrolled' });

    const enrId = 'enr-' + crypto.randomUUID().substring(0, 8);
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO course_enrollments (id, course_id, user_id, progress_percentage, is_completed, enrolled_at)
      VALUES (?, ?, ?, 10, 0, ?)
    `).run(enrId, courseId, userId, now);

    res.status(201).json({ success: true, message: 'Enrolled successfully', enrollmentId: enrId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to enroll in course' });
  }
});

app.get('/api/my-courses', authMiddleware, (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT e.*, c.title, c.instructor, c.category, c.level, c.duration, c.credits, c.image_url
      FROM course_enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE e.user_id = ?
    `).all(req.user.userId);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch enrolled courses' });
  }
});

// 9. COMMUNITY API
app.get('/api/community/posts', (req, res) => {
  try {
    const posts = db.prepare(`
      SELECT p.*, count(distinct c.id) as comments_count
      FROM community_posts p
      LEFT JOIN community_comments c ON p.id = c.post_id
      WHERE p.is_hidden = 0
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `).all();

    // Fetch comments for each
    const result = posts.map(post => {
      const comments = db.prepare(`
        SELECT * FROM community_comments WHERE post_id = ? ORDER BY created_at ASC
      `).all(post.id);
      return { ...post, comments };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch community posts' });
  }
});

app.post('/api/community/posts', authMiddleware, (req, res) => {
  try {
    const userId = req.user.userId;
    const { specialty_tag, content } = req.body;
    if (!content || !content.trim()) return res.status(400).json({ error: 'Post content is required' });

    const userProfile = db.prepare('SELECT full_name, professional_title, avatar_url FROM profiles WHERE user_id = ?').get(userId);
    const postId = 'post-' + crypto.randomUUID().substring(0, 8);
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO community_posts (id, user_id, author_name, author_role, author_avatar, specialty_tag, content, likes_count, is_hidden, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, 0, ?)
    `).run(
      postId, userId,
      userProfile?.full_name || 'Clinician',
      userProfile?.professional_title || 'Healthcare Practitioner',
      userProfile?.avatar_url || '',
      specialty_tag || 'Clinical Discussion',
      content.trim(),
      now
    );

    res.status(201).json({ id: postId, message: 'Post published successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

app.post('/api/community/posts/:id/like', authMiddleware, (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;

    const existing = db.prepare('SELECT id FROM community_likes WHERE post_id = ? AND user_id = ?').get(postId, userId);
    if (existing) {
      db.prepare('DELETE FROM community_likes WHERE id = ?').run(existing.id);
      db.prepare('UPDATE community_posts SET likes_count = MAX(0, likes_count - 1) WHERE id = ?').run(postId);
      return res.json({ liked: false });
    } else {
      const likeId = 'like-' + crypto.randomUUID().substring(0, 8);
      db.prepare('INSERT INTO community_likes (id, post_id, user_id) VALUES (?, ?, ?)').run(likeId, postId, userId);
      db.prepare('UPDATE community_posts SET likes_count = likes_count + 1 WHERE id = ?').run(postId);
      return res.json({ liked: true });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle like' });
  }
});

app.post('/api/community/posts/:id/comment', authMiddleware, (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;
    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ error: 'Comment text required' });

    const userProfile = db.prepare('SELECT full_name, professional_title, avatar_url FROM profiles WHERE user_id = ?').get(userId);
    const commentId = 'com-' + crypto.randomUUID().substring(0, 8);
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO community_comments (id, post_id, user_id, author_name, author_role, author_avatar, text, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      commentId, postId, userId,
      userProfile?.full_name || 'Clinician',
      userProfile?.professional_title || 'Healthcare Practitioner',
      userProfile?.avatar_url || '',
      text.trim(),
      now
    );

    res.status(201).json({ id: commentId, author_name: userProfile?.full_name, text, created_at: now });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// 10. SAVED ITEMS API
app.get('/api/saved', authMiddleware, (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM saved_items WHERE user_id = ? ORDER BY created_at DESC').all(req.user.userId);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch saved items' });
  }
});

app.post('/api/saved/toggle', authMiddleware, (req, res) => {
  try {
    const userId = req.user.userId;
    const { item_type, item_id } = req.body;
    if (!item_type || !item_id) return res.status(400).json({ error: 'Item type and ID required' });

    const existing = db.prepare('SELECT id FROM saved_items WHERE user_id = ? AND item_type = ? AND item_id = ?').get(userId, item_type, item_id);
    if (existing) {
      db.prepare('DELETE FROM saved_items WHERE id = ?').run(existing.id);
      return res.json({ saved: false, message: 'Removed from bookmarks' });
    } else {
      const savedId = 'sav-' + crypto.randomUUID().substring(0, 8);
      const now = new Date().toISOString();
      db.prepare('INSERT INTO saved_items (id, user_id, item_type, item_id, created_at) VALUES (?, ?, ?, ?, ?)').run(savedId, userId, item_type, item_id, now);
      return res.json({ saved: true, message: 'Saved to bookmarks' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle save' });
  }
});

// 11. CONTACT & DEMO REQUESTS API
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, department, message } = req.body;
    const id = 'req-' + crypto.randomUUID().substring(0, 8);
    const now = new Date().toISOString();
    db.prepare('INSERT INTO contact_requests (id, name, email, department, message, created_at) VALUES (?, ?, ?, ?, ?, ?)').run(id, name, email, department || '', message || '', now);
    res.status(201).json({ success: true, message: 'Contact inquiry recorded' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to record contact request' });
  }
});

app.post('/api/demo', (req, res) => {
  try {
    const { name, email, organization, orgType, message } = req.body;
    const id = 'demo-' + crypto.randomUUID().substring(0, 8);
    const now = new Date().toISOString();
    db.prepare('INSERT INTO demo_requests (id, name, work_email, organization, organization_type, message, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(id, name, email, organization, orgType || 'Hospital', message || '', 'New', now);
    res.status(201).json({ success: true, message: 'Demo request recorded' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to record demo request' });
  }
});

// 12. ADMIN DASHBOARD & AUDIT API
app.get('/api/admin/stats', authMiddleware, (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });

    const totalUsers = db.prepare('SELECT count(*) as count FROM users').get().count;
    const activeJobs = db.prepare('SELECT count(*) as count FROM jobs').get().count;
    const activeCourses = db.prepare('SELECT count(*) as count FROM courses').get().count;
    const activeProducts = db.prepare('SELECT count(*) as count FROM marketplace_products').get().count;
    const totalApplications = db.prepare('SELECT count(*) as count FROM job_applications').get().count;
    const totalPosts = db.prepare('SELECT count(*) as count FROM community_posts').get().count;
    const demoRequests = db.prepare('SELECT count(*) as count FROM demo_requests').get().count;

    res.json({
      totalUsers,
      activeJobs,
      activeCourses,
      activeProducts,
      totalApplications,
      totalPosts,
      demoRequests
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

app.get('/api/admin/users', authMiddleware, (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
    const rows = db.prepare(`
      SELECT u.id, u.email, u.role, u.is_verified, u.created_at, p.full_name, p.specialty, p.organization
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      ORDER BY u.created_at DESC
    `).all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.post('/api/admin/verify-user', authMiddleware, (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
    const { userId, isVerified } = req.body;
    db.prepare('UPDATE users SET is_verified = ? WHERE id = ?').run(isVerified ? 1 : 0, userId);
    res.json({ success: true, message: `User verification updated to ${isVerified ? 'Verified' : 'Unverified'}` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update verification status' });
  }
});

// 13. PROFESSIONAL CREDENTIAL VERIFICATION API
app.post('/api/verification/submit', authMiddleware, (req, res) => {
  try {
    const userId = req.user.userId;
    const { license_number, issuing_authority, document_type, document_details } = req.body;
    if (!license_number || !issuing_authority) {
      return res.status(400).json({ error: 'License number and issuing authority required' });
    }

    const now = new Date().toISOString();
    const existing = db.prepare('SELECT id FROM verifications WHERE user_id = ?').get(userId);

    if (existing) {
      db.prepare(`
        UPDATE verifications 
        SET license_number = ?, issuing_authority = ?, document_type = ?, document_details = ?, status = 'Pending', submitted_at = ?
        WHERE user_id = ?
      `).run(license_number, issuing_authority, document_type || 'Medical License', document_details || '', now, userId);
    } else {
      const vId = 'ver-' + crypto.randomUUID().substring(0, 8);
      db.prepare(`
        INSERT INTO verifications (id, user_id, license_number, issuing_authority, document_type, document_details, status, submitted_at)
        VALUES (?, ?, ?, ?, ?, ?, 'Pending', ?)
      `).run(vId, userId, license_number, issuing_authority, document_type || 'Medical License', document_details || '', now);
    }

    // In-app confirmation notification
    db.prepare(`
      INSERT INTO notifications (id, user_id, title, body, type, is_read, created_at)
      VALUES (?, ?, 'Credentials Submitted', 'Your medical verification request is under review by MedSphere compliance.', 'system', 0, ?)
    `).run('notif-' + crypto.randomUUID().substring(0, 8), userId, now);

    res.status(201).json({ success: true, message: 'Verification credentials submitted for review.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit credentials' });
  }
});

app.get('/api/verification/status', authMiddleware, (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM verifications WHERE user_id = ?').get(req.user.userId);
    res.json(row || { status: 'Not Submitted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch verification status' });
  }
});

app.get('/api/admin/verifications', authMiddleware, (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
    const rows = db.prepare(`
      SELECT v.*, u.email, p.full_name, p.professional_title, p.specialty, p.organization
      FROM verifications v
      JOIN users u ON v.user_id = u.id
      JOIN profiles p ON v.user_id = p.user_id
      ORDER BY v.submitted_at DESC
    `).all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch verifications' });
  }
});

app.post('/api/admin/verifications/:id/review', authMiddleware, (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
    const { status, admin_notes } = req.body;
    const vId = req.params.id;
    const ver = db.prepare('SELECT * FROM verifications WHERE id = ?').get(vId);
    if (!ver) return res.status(404).json({ error: 'Verification record not found' });

    const now = new Date().toISOString();
    db.prepare(`
      UPDATE verifications
      SET status = ?, reviewed_at = ?, reviewed_by = ?, admin_notes = ?
      WHERE id = ?
    `).run(status, now, req.user.userId, admin_notes || '', vId);

    // If verified, update users.is_verified = 1
    if (status === 'Verified') {
      db.prepare('UPDATE users SET is_verified = 1 WHERE id = ?').run(ver.user_id);
    } else if (status === 'Rejected') {
      db.prepare('UPDATE users SET is_verified = 0 WHERE id = ?').run(ver.user_id);
    }

    db.prepare(`
      INSERT INTO notifications (id, user_id, title, body, type, is_read, created_at)
      VALUES (?, ?, ?, ?, 'system', 0, ?)
    `).run('notif-' + crypto.randomUUID().substring(0, 8), ver.user_id, `Verification ${status}`, `Your credential verification has been marked as ${status}.${admin_notes ? ' Note: ' + admin_notes : ''}`, now);

    res.json({ success: true, message: `Verification status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to review verification' });
  }
});

// 14. COMMUNITY GROUPS API
app.get('/api/groups', optionalAuthMiddleware, (req, res) => {
  try {
    const groups = db.prepare('SELECT * FROM community_groups ORDER BY members_count DESC').all();
    const userId = req.user?.userId;

    const result = groups.map(g => {
      let isMember = false;
      if (userId) {
        const mem = db.prepare('SELECT id FROM group_members WHERE group_id = ? AND user_id = ?').get(g.id, userId);
        isMember = Boolean(mem);
      }
      return { ...g, is_member: isMember };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch community groups' });
  }
});

app.post('/api/groups/:id/toggle', authMiddleware, (req, res) => {
  try {
    const groupId = req.params.id;
    const userId = req.user.userId;

    const existing = db.prepare('SELECT id FROM group_members WHERE group_id = ? AND user_id = ?').get(groupId, userId);
    if (existing) {
      db.prepare('DELETE FROM group_members WHERE id = ?').run(existing.id);
      db.prepare('UPDATE community_groups SET members_count = MAX(0, members_count - 1) WHERE id = ?').run(groupId);
      return res.json({ joined: false });
    } else {
      const now = new Date().toISOString();
      db.prepare('INSERT INTO group_members (id, group_id, user_id, joined_at) VALUES (?, ?, ?, ?)').run('gm-' + crypto.randomUUID().substring(0, 8), groupId, userId, now);
      db.prepare('UPDATE community_groups SET members_count = members_count + 1 WHERE id = ?').run(groupId);
      return res.json({ joined: true });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle group membership' });
  }
});

// 15. EVENTS API
app.get('/api/events', optionalAuthMiddleware, (req, res) => {
  try {
    const { category, q } = req.query;
    let query = 'SELECT * FROM events WHERE 1=1';
    const params = [];

    if (category && category !== 'all') {
      query += ' AND category LIKE ?';
      params.push(`%${category}%`);
    }
    if (q) {
      query += ' AND (title LIKE ? OR location LIKE ? OR organizer LIKE ?)';
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }
    query += ' ORDER BY date ASC';

    const events = db.prepare(query).all(...params);
    const userId = req.user?.userId;

    const result = events.map(e => {
      let isRegistered = false;
      if (userId) {
        const reg = db.prepare('SELECT id FROM event_registrations WHERE event_id = ? AND user_id = ?').get(e.id, userId);
        isRegistered = Boolean(reg);
      }
      return {
        ...e,
        speakers: typeof e.speakers === 'string' ? JSON.parse(e.speakers || '[]') : e.speakers,
        is_registered: isRegistered
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

app.get('/api/events/:id', (req, res) => {
  try {
    const e = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
    if (!e) return res.status(404).json({ error: 'Event not found' });
    res.json({
      ...e,
      speakers: typeof e.speakers === 'string' ? JSON.parse(e.speakers || '[]') : e.speakers
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch event detail' });
  }
});

app.post('/api/events/:id/register', authMiddleware, (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.userId;

    const existing = db.prepare('SELECT id FROM event_registrations WHERE event_id = ? AND user_id = ?').get(eventId, userId);
    if (existing) return res.json({ success: true, message: 'Already registered for this event.' });

    const now = new Date().toISOString();
    db.prepare('INSERT INTO event_registrations (id, event_id, user_id, registered_at) VALUES (?, ?, ?, ?)').run('er-' + crypto.randomUUID().substring(0, 8), eventId, userId, now);
    db.prepare('UPDATE events SET registered_count = registered_count + 1 WHERE id = ?').run(eventId);

    const event = db.prepare('SELECT title, date FROM events WHERE id = ?').get(eventId);
    db.prepare(`
      INSERT INTO notifications (id, user_id, title, body, type, is_read, created_at)
      VALUES (?, ?, 'Event Registration Confirmed', ?, 'events', 0, ?)
    `).run('notif-' + crypto.randomUUID().substring(0, 8), userId, `You are registered for ${event?.title || 'medical event'} on ${event?.date}.`, now);

    res.status(201).json({ success: true, message: 'Registration confirmed successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to register for event' });
  }
});

app.get('/api/my-events', authMiddleware, (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT er.registered_at, e.*
      FROM event_registrations er
      JOIN events e ON er.event_id = e.id
      WHERE er.user_id = ?
      ORDER BY e.date ASC
    `).all(req.user.userId);

    const result = rows.map(e => ({
      ...e,
      speakers: typeof e.speakers === 'string' ? JSON.parse(e.speakers || '[]') : e.speakers
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch registered events' });
  }
});

// 16. CATEGORIZED GLOBAL SEARCH API
app.get('/api/search', (req, res) => {
  try {
    const q = req.query.q ? req.query.q.trim() : '';
    if (!q) return res.json({ professionals: [], jobs: [], courses: [], products: [], events: [], total: 0 });

    const term = `%${q}%`;

    const professionals = db.prepare(`
      SELECT p.*, u.role, u.is_verified as user_verified
      FROM profiles p
      JOIN users u ON p.user_id = u.id
      WHERE p.full_name LIKE ? OR p.specialty LIKE ? OR p.organization LIKE ? OR p.location LIKE ?
      LIMIT 8
    `).all(term, term, term, term);

    const jobs = db.prepare(`
      SELECT * FROM jobs
      WHERE title LIKE ? OR company LIKE ? OR location LIKE ? OR specialty LIKE ?
      LIMIT 8
    `).all(term, term, term, term);

    const courses = db.prepare(`
      SELECT * FROM courses
      WHERE title LIKE ? OR instructor LIKE ? OR category LIKE ?
      LIMIT 8
    `).all(term, term, term);

    const products = db.prepare(`
      SELECT * FROM marketplace_products
      WHERE name LIKE ? OR company LIKE ? OR category LIKE ?
      LIMIT 8
    `).all(term, term, term);

    const events = db.prepare(`
      SELECT * FROM events
      WHERE title LIKE ? OR organizer LIKE ? OR category LIKE ?
      LIMIT 8
    `).all(term, term, term);

    const total = professionals.length + jobs.length + courses.length + products.length + events.length;

    res.json({
      query: q,
      total,
      professionals,
      jobs,
      courses,
      products,
      events
    });
  } catch (err) {
    res.status(500).json({ error: 'Search query failed' });
  }
});

// 17. EMPLOYER JOB MANAGEMENT & CANDIDATE SEARCH
app.post('/api/jobs', authMiddleware, (req, res) => {
  try {
    const { title, company, location, employment_type, salary, specialty, experience, sign_on_bonus, description, responsibilities, requirements, benefits } = req.body;
    if (!title || !company || !location || !salary || !specialty) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const jobId = 'job-' + crypto.randomUUID().substring(0, 8);
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO jobs (id, title, company, location, employment_type, salary, specialty, experience, sign_on_bonus, description, responsibilities, requirements, benefits, is_verified, posted_by, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
    `).run(jobId, title, company, location, employment_type || 'Full Time', salary, specialty, experience || '1+ Year', sign_on_bonus || '', description, responsibilities || '', requirements || '', benefits || '', req.user.userId, now);

    res.status(201).json({ id: jobId, message: 'Job opportunity posted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to post job' });
  }
});

app.get('/api/employer/jobs', authMiddleware, (req, res) => {
  try {
    const jobs = db.prepare(`
      SELECT j.*, count(a.id) as applicants_count
      FROM jobs j
      LEFT JOIN job_applications a ON j.id = a.job_id
      WHERE j.posted_by = ? OR ? = 'admin'
      GROUP BY j.id
      ORDER BY j.created_at DESC
    `).all(req.user.userId, req.user.role);

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch employer jobs' });
  }
});

app.get('/api/employer/applicants', authMiddleware, (req, res) => {
  try {
    const applicants = db.prepare(`
      SELECT a.*, j.title as job_title, j.company as job_company, p.avatar_url, p.professional_title, p.specialty as applicant_specialty, p.location as applicant_location
      FROM job_applications a
      JOIN jobs j ON a.job_id = j.id
      LEFT JOIN profiles p ON a.user_id = p.user_id
      WHERE j.posted_by = ? OR ? = 'admin'
      ORDER BY a.created_at DESC
    `).all(req.user.userId, req.user.role);

    res.json(applicants);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch applicants' });
  }
});

app.put('/api/applications/:id/status', authMiddleware, (req, res) => {
  try {
    const { status } = req.body;
    const appId = req.params.id;

    db.prepare('UPDATE job_applications SET status = ? WHERE id = ?').run(status, appId);
    const appRecord = db.prepare('SELECT a.*, j.title, j.company FROM job_applications a JOIN jobs j ON a.job_id = j.id WHERE a.id = ?').get(appId);

    if (appRecord) {
      const now = new Date().toISOString();
      db.prepare(`
        INSERT INTO notifications (id, user_id, title, body, type, is_read, created_at)
        VALUES (?, ?, 'Application Status Update', ?, 'jobs', 0, ?)
      `).run('notif-' + crypto.randomUUID().substring(0, 8), appRecord.user_id, `Your application for ${appRecord.title} at ${appRecord.company} is now: ${status}.`, now);
    }

    res.json({ success: true, message: `Application status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

app.get('/api/candidates', authMiddleware, (req, res) => {
  try {
    const { specialty, location, q } = req.query;
    let query = `
      SELECT p.*, u.role, u.is_verified as user_verified, u.email
      FROM profiles p
      JOIN users u ON p.user_id = u.id
      WHERE u.role IN ('doctor', 'nurse', 'pharmacist', 'pediatrician', 'student')
    `;
    const params = [];

    if (specialty && specialty !== 'all') {
      query += ` AND p.specialty LIKE ?`;
      params.push(`%${specialty}%`);
    }
    if (location) {
      query += ` AND p.location LIKE ?`;
      params.push(`%${location}%`);
    }
    if (q) {
      query += ` AND (p.full_name LIKE ? OR p.bio LIKE ? OR p.organization LIKE ?)`;
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }
    query += ` ORDER BY p.experience_years DESC LIMIT 50`;

    const candidates = db.prepare(query).all(...params);
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ error: 'Failed to search candidates' });
  }
});

// 18. SUPPLIER PRODUCT MANAGEMENT & INQUIRIES
app.get('/api/supplier/products', authMiddleware, (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM marketplace_products ORDER BY created_at DESC').all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch supplier products' });
  }
});

app.post('/api/marketplace/products', authMiddleware, (req, res) => {
  try {
    const { name, company, category, price, unit, badge, image_url, description, specs, stock, lead_time } = req.body;
    if (!name || !company || !price) return res.status(400).json({ error: 'Product name, company and price required' });

    const prodId = 'prod-' + crypto.randomUUID().substring(0, 8);
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO marketplace_products (id, name, company, category, price, unit, badge, image_url, description, specs, stock, lead_time, is_verified, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
    `).run(prodId, name, company, category || 'Medical Equipment', price, unit || 'Per Unit', badge || 'FDA Cleared', image_url || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80', description, specs || 'Clinical Grade Specifications', stock || 'In Stock', lead_time || '2-4 business days', now);

    res.status(201).json({ id: prodId, message: 'Product listed in MedSphere Marketplace successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add marketplace product' });
  }
});

app.get('/api/supplier/inquiries', authMiddleware, (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM marketplace_inquiries ORDER BY created_at DESC').all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

// 19. EDUCATION LESSON PROGRESS & CME CERTIFICATE
app.put('/api/courses/:id/progress', authMiddleware, (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.userId;
    const { progress_percentage } = req.body;

    const isCompleted = Number(progress_percentage) >= 100 ? 1 : 0;
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE course_enrollments
      SET progress_percentage = ?, is_completed = ?, completed_at = CASE WHEN ? = 1 THEN ? ELSE completed_at END
      WHERE course_id = ? AND user_id = ?
    `).run(progress_percentage, isCompleted, isCompleted, now, courseId, userId);

    if (isCompleted) {
      const course = db.prepare('SELECT title, credits FROM courses WHERE id = ?').get(courseId);
      db.prepare(`
        INSERT INTO notifications (id, user_id, title, body, type, is_read, created_at)
        VALUES (?, ?, 'CME Certificate Earned', ?, 'education', 0, ?)
      `).run('notif-' + crypto.randomUUID().substring(0, 8), userId, `Congratulations! You completed ${course?.title || 'CME Course'} and earned ${course?.credits || '4.0'} CME credits. Your certificate is ready!`, now);
    }

    res.json({ success: true, progress_percentage, is_completed: isCompleted });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

app.get('/api/certificates/:enrollmentId', authMiddleware, (req, res) => {
  try {
    const row = db.prepare(`
      SELECT e.*, c.title as course_title, c.credits, c.instructor, p.full_name as clinician_name, p.specialty, u.email
      FROM course_enrollments e
      JOIN courses c ON e.course_id = c.id
      JOIN users u ON e.user_id = u.id
      JOIN profiles p ON e.user_id = p.user_id
      WHERE e.id = ? OR (e.course_id = ? AND e.user_id = ?)
    `).get(req.params.enrollmentId, req.params.enrollmentId, req.user.userId);

    if (!row) return res.status(404).json({ error: 'Enrollment record not found' });

    res.json({
      certificateId: 'CME-ACCME-' + crypto.createHash('md5').update(row.id + row.user_id).digest('hex').substring(0, 10).toUpperCase(),
      clinicianName: row.clinician_name,
      courseTitle: row.course_title,
      cmeCredits: row.credits,
      instructor: row.instructor,
      accreditationProvider: 'Accreditation Council for Continuing Medical Education (ACCME) & MedSphere Medical Institute',
      providerId: 'ACCME-MS-782194',
      issueDate: row.completed_at ? row.completed_at.split('T')[0] : new Date().toISOString().split('T')[0],
      verificationHash: crypto.randomUUID()
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate certificate' });
  }
});

// Fallback to index.html for SPA routes (Express 5 compatible)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🏥 MedSphere Healthcare Platform Live Server Running!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🗄️  Database: ${DB_PATH} (SQLite native)`);
  console.log(`=======================================================`);
});

// MedSphere Global Platform Data Store
// Realistic clinical, organizational, and educational healthcare data

window.MEDSPHERE_DATA = {
  // Current logged in user
  currentUser: {
    id: "u-2643df7b",
    name: "Dr. Abdul Samad",
    fullName: "Dr. Abdul Samad",
    title: "Attending Physician",
    organization: "Verified Medical Network",
    specialty: "Interventional Cardiology",
    npi: "1098213793",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80",
    cover: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
    location: "United States",
    bio: "Verified healthcare professional on MedSphere clinical ecosystem.",
    experienceYears: 8,
    cmeCreditsThisYear: 38,
    cmeTarget: 50,
    connectionsCount: 28,
    savedJobsCount: 0,
    enrolledCoursesCount: 0,
    profileCompletion: 85,
    contact: {
      email: "abdulsamar411@gmail.com",
      phone: "+1 (555) 019-2834",
      office: "Cardiology Suite"
    },
    experience: [
      {
        role: "Chief of Interventional Cardiology",
        organization: "St. Luke's Medical Center",
        period: "2021 — Present",
        description: "Directing cardiac catheterization lab, supervising 18 fellows and attendings, leading TAVR and complex coronary revascularization programs."
      },
      {
        role: "Associate Professor of Cardiovascular Medicine",
        organization: "Harvard Medical School Teaching Hospital",
        period: "2016 — 2021",
        description: "Principal investigator on 4 multi-center transcatheter valve trials. Published 32 peer-reviewed articles."
      },
      {
        role: "Cardiology Fellow",
        organization: "Johns Hopkins Medicine",
        period: "2012 — 2016",
        description: "Comprehensive training in clinical cardiology, echocardiography, and interventional hemodynamics."
      }
    ],
    education: [
      {
        degree: "Doctor of Medicine (MD)",
        institution: "Johns Hopkins University School of Medicine",
        year: "2012",
        honors: "Alpha Omega Alpha Honor Society"
      },
      {
        degree: "BS in Biomedical Engineering",
        institution: "Massachusetts Institute of Technology",
        year: "2008",
        honors: "Summa Cum Laude"
      }
    ],
    certifications: [
      { name: "American Board of Internal Medicine (Cardiovascular Disease)", year: "2016", status: "Active" },
      { name: "Interventional Cardiology Subspecialty Certification", year: "2017", status: "Active" },
      { name: "National Board of Echocardiography (FACC, FSCAI)", year: "2018", status: "Fellow" }
    ],
    specialties: ["Interventional Cardiology", "Structural Heart Disease", "TAVR", "Coronary Angioplasty", "Intravascular Imaging"],
    interests: ["AI in Echocardiography", "Fellowship Mentorship", "Decentralized Clinical Trials", "Healthcare Equity"]
  },

  // Target User Categories (Homepage "Who is MedSphere for")
  categories: [
    {
      id: "doctors",
      role: "Doctors & Specialists",
      badge: "GPs & Specialists",
      icon: "stethoscope",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80",
      description: "Connect with verified peers, access CME accredited modules, discuss complex clinical cases, and discover clinical opportunities worldwide."
    },
    {
      id: "nurses",
      role: "Nurses & Nurse Practitioners",
      badge: "RN, LPN, ICU & NP",
      icon: "heart-pulse",
      image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=600&q=80",
      description: "Share acute care protocols, access specialized clinical training, track CE credits, and explore premier hospital positions."
    },
    {
      id: "pediatricians",
      role: "Pediatricians & Child Health",
      badge: "Child Health Experts",
      icon: "baby",
      image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80",
      description: "Collaborate on pediatric critical care, neonatal guidelines, clinical trials, and adolescent developmental resources."
    },
    {
      id: "midwives",
      role: "Midwives & Maternal Care",
      badge: "Maternal Care Pros",
      icon: "users-alt",
      image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=600&q=80",
      description: "Elevate evidence-based maternal care, community birth safety protocols, global midwifery forums, and accredited modules."
    },
    {
      id: "hospitals",
      role: "Hospitals & Health Systems",
      badge: "Public & Private Systems",
      icon: "hospital",
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80",
      description: "Recruit top-tier verified medical talent, streamline institutional procurement, and showcase clinical excellence centers."
    },
    {
      id: "pharmacies",
      role: "Pharmacies & Dispensaries",
      badge: "Retail & Clinical Health",
      icon: "capsules",
      image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=600&q=80",
      description: "Direct sourcing from verified pharmaceutical manufacturers, drug interaction advisories, and clinical pharmacotherapy networks."
    },
    {
      id: "pharma",
      role: "Pharma Manufacturers",
      badge: "R&D & Global Suppliers",
      icon: "flask",
      image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=600&q=80",
      description: "Engage key opinion leaders, publish clinical trial data, and distribute verified therapeutics through the healthcare marketplace."
    },
    {
      id: "students",
      role: "Medical Students",
      badge: "MD & Residency Candidates",
      icon: "graduation-cap",
      image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=600&q=80",
      description: "USMLE/board study guides, virtual clinical case rounds, verified mentorship, and residency matching masterclasses."
    },
    {
      id: "nursing-students",
      role: "Nursing Students",
      badge: "BSN & Diploma Candidates",
      icon: "award",
      image: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=600&q=80",
      description: "NCLEX preparation toolkits, pharmacology flashcards, verified clinical preceptorships, and entry-level career fairs."
    },
    {
      id: "recruiters",
      role: "Healthcare Recruiters",
      badge: "Talent Partners & Staffing",
      icon: "briefcase",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
      description: "Source pre-verified clinicians with license confirmation, specialty filters, credential histories, and instant direct outreach."
    }
  ],

  // Healthcare Professionals Directory
  // NOTE: This is empty — real doctors are loaded live from /api/profiles (SQLite backend)
  professionals: [],

  // Hospitals & Healthcare Organizations Directory
  hospitals: [
    {
      id: "hosp-1",
      name: "St. Luke's Medical Center",
      type: "Academic Health System",
      location: "Boston, MA",
      beds: "850 Beds",
      staff: "4,200+ Clinicians",
      accreditation: "Joint Commission Magnet Hospital",
      verified: true,
      logo: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=200&q=80",
      cover: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
      overview: "Ranked among the top 10 heart and vascular institutions in North America. Centers of excellence in Cardiology, Oncology, and Neurosciences.",
      openJobsCount: 48,
      specialties: ["Cardiovascular Medicine", "Oncology", "Neurosurgery", "Pediatric Care", "Organ Transplant"]
    },
    {
      id: "hosp-2",
      name: "Mayo Clinical Institute",
      type: "Non-Profit Academic Medical Center",
      location: "Rochester, MN",
      beds: "1,265 Beds",
      staff: "7,500+ Clinicians",
      accreditation: "Joint Commission Gold Seal",
      verified: true,
      logo: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=200&q=80",
      cover: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80",
      overview: "World-renowned integrated clinical practice and biomedical research institution offering cutting-edge comprehensive care.",
      openJobsCount: 86,
      specialties: ["Comprehensive Cancer Center", "Genomic Medicine", "Robotic Surgery", "Immunology"]
    },
    {
      id: "hosp-3",
      name: "Cleveland Clinical Center",
      type: "Multi-Specialty Academic System",
      location: "Cleveland, OH",
      beds: "1,440 Beds",
      staff: "6,800+ Clinicians",
      accreditation: "Magnet Recognized",
      verified: true,
      logo: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=200&q=80",
      cover: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80",
      overview: "Consistently recognized as the leading cardiovascular and heart surgery medical center in the world with global outreach.",
      openJobsCount: 62,
      specialties: ["Heart & Vascular", "Digestive Disease", "Orthopedic Surgery", "Neurology"]
    },
    {
      id: "hosp-4",
      name: "Johns Hopkins Medicine",
      type: "Integrated Global Health Enterprise",
      location: "Baltimore, MD",
      beds: "1,162 Beds",
      staff: "8,100+ Clinicians",
      accreditation: "Joint Commission Accredited",
      verified: true,
      logo: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=200&q=80",
      cover: "https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=800&q=80",
      overview: "A pioneer in modern medical education and patient care, fostering global biomedical discoveries and clinical breakthroughs.",
      openJobsCount: 74,
      specialties: ["Biomedical Informatics", "Pediatric Trauma", "Geriatrics", "Psychiatry"]
    }
  ],

  // Pharmaceutical & MedTech Companies
  companies: [
    {
      id: "comp-1",
      name: "Pfizer Global Health",
      category: "Pharmaceuticals & Vaccines",
      headquarters: "New York, NY",
      pipelineSize: "92 Therapeutics in Phase 3",
      verified: true,
      logo: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=200&q=80",
      overview: "Developing innovative therapies, mRNA vaccines, and targeted oncology treatments that significantly improve patient lives worldwide.",
      productsCount: 140,
      activeTrials: 45
    },
    {
      id: "comp-2",
      name: "Roche Diagnostics & Pharma",
      category: "Biotechnology & Diagnostics",
      headquarters: "Basel, Switzerland",
      pipelineSize: "78 Molecular Diagnostics",
      verified: true,
      logo: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=200&q=80",
      overview: "A global leader in pharmaceuticals and diagnostics focused on advancing science to improve people's lives and precision medicine.",
      productsCount: 210,
      activeTrials: 52
    },
    {
      id: "comp-3",
      name: "Medtronic Innovations",
      category: "Medical Devices & Robotics",
      headquarters: "Minneapolis, MN",
      pipelineSize: "35 Surgical Platforms",
      verified: true,
      logo: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=200&q=80",
      overview: "Transforming the treatment of chronic disease with implantable cardiac pacemakers, spinal surgery systems, and robotic assistance.",
      productsCount: 95,
      activeTrials: 30
    }
  ],

  // Healthcare Marketplace Products & Equipment
  products: [
    {
      id: "prod-1",
      name: "AcuScan 4D Portable Diagnostic Ultrasound System",
      company: "Apex BioMedical Solutions",
      category: "Medical Equipment",
      price: "$24,500",
      unit: "per system",
      rating: 4.9,
      reviewsCount: 38,
      verifiedSeller: true,
      badge: "FDA Cleared & CE Marked",
      image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80",
      description: "High-definition point-of-care ultrasound with dual-probe AI imaging assistance, Doppler flow analysis, and secure cloud PACS sync.",
      specs: [
        "Transducer range: 1.5 MHz – 18.0 MHz",
        "Battery life: 6 hours continuous scan",
        "Screen: 15.6-inch anti-glare medical touchscreen",
        "DICOM 3.0 & HIPAA compliant cloud connectivity"
      ],
      leadTime: "3-5 business days",
      stock: "In Stock (14 units available)"
    },
    {
      id: "prod-2",
      name: "OmniCart Telehealth & Remote Clinical Station",
      company: "MedTech Robotics Corp",
      category: "Medical Technology",
      price: "$8,950",
      unit: "per workstation",
      rating: 4.8,
      reviewsCount: 22,
      verifiedSeller: true,
      badge: "ISO 13485 Certified",
      image: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=600&q=80",
      description: "Motorized height-adjustable telehealth cart with 4K PTZ camera, integrated digital stethoscope, and encrypted multi-party conferencing.",
      specs: [
        "Camera: 4K 30fps with 20x optical zoom",
        "Audio: Quad microphone beamforming array",
        "Power: Hot-swappable LiFePO4 battery pack",
        "Integration: Epic, Cerner, and MedSphere EHR ready"
      ],
      leadTime: "7 business days",
      stock: "Available to Order"
    },
    {
      id: "prod-3",
      name: "CryoSafe Ultra-Low Smart Biologics Vaccine Freezer",
      company: "ThermoClinical Systems",
      category: "Medical Equipment",
      price: "$14,200",
      unit: "per unit",
      rating: 5.0,
      reviewsCount: 19,
      verifiedSeller: true,
      badge: "WHO PQS Certified",
      image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=600&q=80",
      description: "Energy-efficient -86°C ultra-low temperature upright freezer with dual independent compressors and 24/7 cellular telemetry alerts.",
      specs: [
        "Temperature range: -50°C to -86°C",
        "Capacity: 500 liters (38,000 cryovials)",
        "Backup: Liquid CO2 emergency cooling port",
        "Security: RFID biometric badge access"
      ],
      leadTime: "2 weeks",
      stock: "In Stock"
    },
    {
      id: "prod-4",
      name: "SurgiVision 4K 3D Ergonomic Surgical Loupes & Headlight",
      company: "OptiMed Precision Optics",
      category: "Medical Equipment",
      price: "$3,400",
      unit: "per set",
      rating: 4.9,
      reviewsCount: 64,
      verifiedSeller: true,
      badge: "FDA Registered",
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80",
      description: "Custom-fitted prismatic surgical magnification loupes with 95 CRI wireless LED illumination designed for prolonged operating theatre comfort.",
      specs: [
        "Magnification: 3.5x to 5.5x Prismatic",
        "Working distance: Custom 350mm to 550mm",
        "Weight: Ultra-lightweight titanium alloy frame (48g)",
        "Illumination: 70,000 Lux daylight-balanced LED"
      ],
      leadTime: "10-14 days custom fit",
      stock: "Custom Order"
    },
    {
      id: "prod-5",
      name: "InstaStat Rapid Point-of-Care Blood Chemistry Analyzer",
      company: "Novas Diagnostics",
      category: "Pharmaceuticals & Lab",
      price: "$6,800",
      unit: "per analyzer",
      rating: 4.7,
      reviewsCount: 31,
      verifiedSeller: true,
      badge: "CLIA Waived",
      image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=600&q=80",
      description: "Microfluidic cartridge analyzer delivering complete metabolic panel, cardiac biomarkers, and blood gas results in under 2 minutes.",
      specs: [
        "Sample size: 100 microliters whole blood",
        "Test time: 120 seconds",
        "Connectivity: Wi-Fi, Ethernet, Bluetooth LE",
        "QC: Automatic internal electronic simulator"
      ],
      leadTime: "3 business days",
      stock: "In Stock"
    },
    {
      id: "prod-6",
      name: "Hospital-Grade Sterile Nitrile PPE & Barrier Bulk Pack",
      company: "SafeShield Medical",
      category: "Consumables & PPE",
      price: "$1,850",
      unit: "case of 10,000 pairs",
      rating: 4.8,
      reviewsCount: 89,
      verifiedSeller: true,
      badge: "ASTM D6978 Chemotherapy Rated",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80",
      description: "Powder-free, chemotherapy-tested medical examination gloves with textured fingertips for tactile sensitivity in wet or dry procedures.",
      specs: [
        "Thickness: 4.0 mil palm, 5.0 mil fingertip",
        "Tensile strength: 18 MPa",
        "Compliance: FDA 510(k), EN 455 Parts 1-4",
        "Packaging: 10 boxes/case, 100 gloves/box"
      ],
      leadTime: "Next-day dispatch",
      stock: "In Stock (350 cases)"
    }
  ],

  // Medical Education Courses (LMS & CME Hub)
  courses: [
    {
      id: "course-1",
      title: "Pediatric Emergency Care & Resuscitation Masterclass",
      instructor: "Dr. Tariq Al-Mansoor, MD, FAAP",
      instructorRole: "Pediatric Critical Care Attending, Boston Children's",
      category: "Pediatrics & Emergency",
      level: "Advanced Clinical",
      duration: "8 Modules · 14 CME Credits",
      credits: "14 AMA PRA Category 1 Credits™",
      rating: 4.9,
      studentsCount: 3840,
      image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=600&q=80",
      accredited: true,
      overview: "Comprehensive accredited simulation training covering rapid triage, fluid resuscitation in septic shock, pediatric airway emergencies, and ECMO management.",
      curriculum: [
        { title: "Module 1: Rapid Pediatric Triage & Initial Assessment", duration: "1h 15m" },
        { title: "Module 2: Respiratory Failure & High-Flow Cannula Management", duration: "1h 45m" },
        { title: "Module 3: Pediatric Septic Shock Resuscitation Protocols", duration: "2h 10m" },
        { title: "Module 4: Status Epilepticus & Neurocritical Emergencies", duration: "1h 30m" },
        { title: "Module 5: Procedural Sedation & Pediatric Airway Simulation", duration: "2h 00m" }
      ]
    },
    {
      id: "course-2",
      title: "Advanced Coronary Angioplasty & Structural Heart TAVR",
      instructor: "Dr. Eleanor Vance, MD, FACC",
      instructorRole: "Chief of Interventional Cardiology, St. Luke's",
      category: "Cardiology",
      level: "Fellowship & Attending",
      duration: "10 Modules · 20 CME Credits",
      credits: "20 AMA PRA Category 1 Credits™",
      rating: 5.0,
      studentsCount: 2950,
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80",
      accredited: true,
      overview: "Master transcatheter aortic valve replacement (TAVR) planning, intravascular imaging (IVUS/OCT), and bifurcation stenting techniques with high-resolution angiographic case reviews.",
      curriculum: [
        { title: "Module 1: Pre-procedural CT Angiography for TAVR Sizing", duration: "2h 00m" },
        { title: "Module 2: Intravascular Ultrasound (IVUS) Optimization", duration: "2h 15m" },
        { title: "Module 3: Complex Coronary Bifurcations (DK Crush & TAP)", duration: "2h 30m" },
        { title: "Module 4: Vascular Access Hemostasis & Complication Avoidance", duration: "1h 45m" }
      ]
    },
    {
      id: "course-4",
      title: "AI in Radiology & Automated Diagnostic Imaging Interpretation",
      instructor: "Dr. Marcus Chen, MD",
      instructorRole: "Attending Neurologist, Cleveland Clinic",
      category: "MedTech & Radiology",
      level: "All Clinicians",
      duration: "5 Modules · 10 CME Credits",
      credits: "10 AMA PRA Category 1 Credits™",
      rating: 4.8,
      studentsCount: 3100,
      image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80",
      accredited: true,
      overview: "Practical evaluation of machine learning diagnostic decision tools in chest X-ray, acute stroke head CT, and bone trauma scans.",
      curriculum: [
        { title: "Module 1: Foundations of Deep Learning in Diagnostic Medicine", duration: "1h 30m" },
        { title: "Module 2: Validating AI Sensitivity vs Human Over-read", duration: "2h 00m" },
        { title: "Module 3: Medico-Legal Implications of Automated Diagnostic AI", duration: "1h 45m" }
      ]
    }
  ],

  // Healthcare Jobs Board
  jobs: [
    {
      id: "job-ent-1",
      title: "Specialist ENT",
      company: "Mediclinic",
      facility: "Mediclinic Dubai Hills",
      location: "Dubai, United Arab Emirates",
      type: "Full-Time",
      salary: "AED 65,000 – 80,000 / mo",
      posted: "2y ago",
      postedDate: "Nov 22, 2023",
      openings: "1 position",
      verifiedOrg: true,
      specialty: "ENT / Otolaryngology",
      roleType: "Specialist",
      experience: "At least 3 - 5 years' post qualification experience at Specialist level (independent of country) Desired: At least 1 year Specialist level experience from a Tier 1 country as specified by the UAE healthcare regulator",
      signOnBonus: "Relocation & Housing Provided",
      description: "At least 3 - 5 years' post qualification experience at Specialist level (independent of country) Desired: At least 1 year Specialist level experience from a Tier 1 country as specified by the UAE healthcare regulator.",
      responsibilities: [
        "Provide advanced clinical and surgical care in otolaryngology.",
        "Perform endoscopic sinus surgeries and pediatric ENT interventions.",
        "Collaborate with multi-disciplinary clinical head & neck teams."
      ],
      requirements: [
        "Specialist license eligible under DHA / DOH regulations.",
        "Board Certification in Otolaryngology (ENT).",
        "Tier 1 clinical training background."
      ],
      benefits: [
        "Tax-free competitive monthly salary",
        "Annual business flight allowances",
        "Comprehensive health & malpractice insurance"
      ]
    },
    {
      id: "job-obgyn-1",
      title: "Consultant Obstetrician & Gynaecologist/Fetal Medicine",
      company: "Mediclinic",
      facility: "Mediclinic Airport Road Hospital",
      location: "Abu Dhabi, United Arab Emirates",
      type: "Full-Time",
      salary: "AED 90,000 – 115,000 / mo",
      posted: "2y ago",
      postedDate: "Nov 22, 2023",
      openings: "1 position",
      verifiedOrg: true,
      specialty: "Obstetrics & Gynecology",
      roleType: "Consultant",
      experience: "At least 3-5 years' post qualification experience at Consultant level (independent of country) Desired: At least 1 year Consultant level experience from a Tier 1 country as specified by the UAE healthcare regulator",
      signOnBonus: "Executive Relocation Package",
      description: "At least 3-5 years' post qualification experience at Consultant level (independent of country) Desired: At least 1 year Consultant level experience from a Tier 1 country as specified by the UAE healthcare regulator.",
      responsibilities: [
        "High-risk obstetrics and fetal maternal medicine assessments.",
        "Advanced prenatal ultrasound scans and amniocentesis.",
        "Lead labor and delivery emergency management."
      ],
      requirements: [
        "Consultant status with CCT / American Board / Arab Board.",
        "Sub-specialty fellowship in Maternal-Fetal Medicine.",
        "Valid DOH Consultant license eligibility."
      ],
      benefits: [
        "100% Tax-free salary with productivity incentives",
        "Family accommodation allowance + schooling support",
        "Comprehensive private medical cover"
      ]
    },
    {
      id: "job-1",
      title: "Senior Interventional Cardiologist",
      company: "St. Luke's Medical Center",
      location: "Boston, MA",
      type: "Full-Time · On-Site",
      salary: "$480,000 – $560,000 / yr",
      posted: "2 days ago",
      verifiedOrg: true,
      specialty: "Cardiology",
      experience: "5+ years post-fellowship",
      signOnBonus: "$50,000 Sign-on Bonus",
      description: "Join an internationally renowned cardiovascular institute. Lead structural heart interventions, participate in clinical device trials, and mentor cardiology fellows in our state-of-the-art cath labs.",
      responsibilities: [
        "Perform complex percutaneous coronary interventions (PCI) and TAVR procedures.",
        "Participate in 1:5 interventional STEMI call rotation.",
        "Attend cardiac multi-disciplinary heart team conferences.",
        "Instruct cardiology fellows and residents in clinical cardiology."
      ],
      requirements: [
        "Board Certified in Cardiovascular Disease and Interventional Cardiology.",
        "Valid Massachusetts Medical License or eligibility.",
        "Proven experience with intravascular ultrasound (IVUS) and mechanical circulatory support (Impella/ECMO).",
        "Demonstrated dedication to high-quality patient safety."
      ],
      benefits: [
        "Comprehensive health, dental, and vision insurance",
        "403(b) retirement with immediate 8% employer match",
        "CME allowance: $10,000 annual budget + 2 weeks paid conference leave",
        "Malpractice insurance with full tail coverage provided"
      ]
    },
    {
      id: "job-2",
      title: "Lead ICU Critical Care Registered Nurse (RN)",
      company: "Mayo Clinical Institute",
      location: "Rochester, MN",
      type: "Full-Time · Shift Based",
      salary: "$98,000 – $124,000 / yr",
      posted: "Just now",
      verifiedOrg: true,
      specialty: "Critical Care / Nursing",
      experience: "3+ years ICU experience",
      signOnBonus: "$15,000 Sign-on Bonus",
      description: "Deliver compassionate, evidence-based critical care in a 24-bed medical intensive care unit. Enjoy strict 1:1 or 1:2 nurse-to-patient staffing ratios.",
      responsibilities: [
        "Direct patient care for complex medical ICU patients including ventilator management and CRRT.",
        "Collaborate with multidisciplinary intensivist rounds.",
        "Precept new graduate nurses and student externs."
      ],
      requirements: [
        "Current unencumbered RN license (Compact state eligible).",
        "BSN required; MSN preferred.",
        "CCRN certification preferred.",
        "BLS and ACLS required."
      ],
      benefits: [
        "Generous tuition reimbursement program",
        "Relocation assistance package",
        "Subsidized hospital child care",
        "Pension and 401(k) matching"
      ]
    },
    {
      id: "job-3",
      title: "Clinical Pharmacist Specialist (Oncology)",
      company: "Johns Hopkins Medicine",
      location: "Baltimore, MD",
      type: "Full-Time · Hybrid",
      salary: "$142,000 – $168,000 / yr",
      posted: "3 days ago",
      verifiedOrg: true,
      specialty: "Clinical Pharmacy",
      experience: "PGY-2 Oncology Residency or equivalent",
      signOnBonus: "$10,000 Sign-on Bonus",
      description: "Manage pharmacotherapy regimens for inpatient and outpatient medical oncology patients. Provide dosing consultations and adverse reaction surveillance.",
      responsibilities: [
        "Review and verify complex chemotherapy and immunotherapy regimens.",
        "Educate patients and oncology nursing staff on targeted oral oncolytics.",
        "Participate in Pharmacy & Therapeutics committee reviews."
      ],
      requirements: [
        "PharmD from an ACPE-accredited college of pharmacy.",
        "Board Certification in Oncology Pharmacy (BCOP) required or eligible within 1 year.",
        "Active Maryland pharmacist license."
      ],
      benefits: [
        "Flexible 4x10 schedule option",
        "Full university tuition remission for family",
        "Health and wellness stipend"
      ]
    },
    {
      id: "job-4",
      title: "Staff Pediatrician (Outpatient Clinic)",
      company: "Children's Health Alliance",
      location: "Austin, TX",
      type: "Full-Time · On-Site",
      salary: "$235,000 – $270,000 / yr",
      posted: "5 days ago",
      verifiedOrg: true,
      specialty: "Pediatrics",
      experience: "1+ years or graduating resident",
      signOnBonus: "$25,000 Sign-on Bonus",
      description: "Join a supportive community pediatric practice providing comprehensive well-child checkups, acute sick visits, and chronic disease management.",
      responsibilities: [
        "Provide direct pediatric clinical care for children from newborn to 18 years.",
        "Light shared telephone call rotation (1:8 weeks).",
        "Collaborate with pediatric subspecialists and community early intervention teams."
      ],
      requirements: [
        "MD/DO degree from accredited institution.",
        "Board certified or board eligible in General Pediatrics.",
        "Active Texas Medical License."
      ],
      benefits: [
        "Zero hospital rounding duties",
        "4 weeks paid vacation + 10 paid holidays",
        "Student loan repayment assistance up to $60,000"
      ]
    },
    {
      id: "job-5",
      title: "Consultant Laparoscopic & General Surgeon",
      company: "Cleveland Clinic Abu Dhabi",
      location: "Abu Dhabi, UAE",
      type: "Full-Time · Hospital-Based",
      salary: "AED 85,000 – 110,000 / mo (Tax Free)",
      posted: "1 day ago",
      verifiedOrg: true,
      specialty: "Surgery",
      roleType: "Consultant",
      experience: "7+ years post-CCT / Board",
      signOnBonus: "Housing + Relocation Package",
      description: "Perform advanced minimally invasive digestive and oncologic surgical procedures in world-class operating theaters. Work alongside global clinical faculty.",
      responsibilities: [
        "Conduct complex laparoscopic and robotic-assisted abdominal surgeries.",
        "Oversee surgical inpatient wards and acute surgical admissions.",
        "Lead surgical mortality and morbidity conferences and resident clinical seminars."
      ],
      requirements: [
        "CCT / American Board / Arab Board / FCPS or CCST in General Surgery.",
        "DOH / DHA Consultant License eligible.",
        "Demonstrated track record of minimally invasive laparoscopic excellence."
      ],
      benefits: [
        "100% Tax-Free executive salary",
        "Executive family housing allowance + education assistance",
        "Annual business-class flights + comprehensive health coverage"
      ]
    },
    {
      id: "job-6",
      title: "Specialist Family Medicine Physician",
      company: "Emirates Hospital Group",
      location: "Dubai, UAE",
      type: "Full-Time · Clinic-Based",
      salary: "AED 50,000 – 65,000 / mo (Tax Free)",
      posted: "3 days ago",
      verifiedOrg: true,
      specialty: "Family Medicine",
      roleType: "Specialist",
      experience: "3+ years post-specialization",
      signOnBonus: "Tax-Free Allowance",
      description: "Deliver high-touch outpatient preventive and primary care to an international patient population in Jumeirah. Emphasize lifestyle medicine and preventive screenings.",
      responsibilities: [
        "Comprehensive health checkups, chronic condition management (diabetes, hypertension).",
        "Preventive immunization schedules and acute outpatient triage.",
        "Collaborate seamlessly with in-house diagnostic radiology and laboratory units."
      ],
      requirements: [
        "MRCGP / Board Certification in Family Medicine.",
        "DHA Specialist License or Eligibility Letter.",
        "Fluent in English; Arabic proficiency is an advantage."
      ],
      benefits: [
        "Family medical insurance + 30 days paid annual leave",
        "Performance productivity bonus structure",
        "Generous CME allowance and training workshops"
      ]
    },
    {
      id: "job-7",
      title: "Consultant Emergency Medicine & Trauma",
      company: "King's College Hospital London",
      location: "London, UK",
      type: "Full-Time · Major Trauma Center",
      salary: "£93,666 – £126,281 / yr",
      posted: "4 days ago",
      verifiedOrg: true,
      specialty: "Emergency",
      roleType: "Consultant",
      experience: "5+ years post-fellowship",
      signOnBonus: "£10,000 Relocation Grant",
      description: "Provide senior clinical leadership in one of Europe's busiest Major Trauma Centers. Guide emergency resuscitations and mentor junior clinical registrars.",
      responsibilities: [
        "Direct emergency department resuscitation room management.",
        "Provide shop-floor clinical leadership during acute intake peaks.",
        "Supervise emergency medicine specialist registrars and clinical fellows."
      ],
      requirements: [
        "FRCEM or equivalent international emergency medicine qualification.",
        "Full GMC registration with Specialist Register entry.",
        "ALS, ATLS, and APLS instructor status preferred."
      ],
      benefits: [
        "NHS Pension Scheme with generous employer contributions",
        "Study budget £2,500/yr + 10 days study leave",
        "Flexible condensed working patterns available"
      ]
    },
    {
      id: "job-8",
      title: "Senior Telehealth Physician (Remote Urgent Care)",
      company: "MedSphere Virtual Care Network",
      location: "Remote / Hybrid",
      type: "Part-Time / Locum · Remote",
      salary: "$180 – $220 / hr",
      posted: "Just now",
      verifiedOrg: true,
      specialty: "Family Medicine",
      roleType: "Specialist",
      experience: "2+ years post-residency",
      signOnBonus: "Flexible Shifts",
      description: "Conduct high-quality asynchronous and video telehealth consultations from home with pre-verified patients. Flexible on-demand hours with automated EHR integration.",
      responsibilities: [
        "Evaluate acute non-emergent medical complaints via secure HD telemedicine video.",
        "Electronically prescribe medications and order diagnostic labs.",
        "Provide clinical triage and follow-up guidance."
      ],
      requirements: [
        "MD or DO with active multi-state license.",
        "Board certified in Family Medicine, Internal Medicine, or Emergency Medicine.",
        "High-speed secure internet and dedicated private consultation environment."
      ],
      benefits: [
        "100% remote work flexibility — set your own schedule",
        "Full medical malpractice insurance with tail coverage included",
        "EHR charting assistance with AI clinical note drafting"
      ]
    }
  ],

  // Knowledge Center & Clinical Insights Articles
  articles: [
    {
      id: "art-1",
      title: "Inside the New WHO Maternal Health & Midwifery Standards: What Clinicians Must Know",
      category: "Education",
      readTime: "7 min read",
      author: "Amara Nwosu, CNM & Global Health Advisory Board",
      date: "September 24, 2026",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
      excerpt: "The World Health Organization has issued updated guidelines focusing on respectful maternity care, physiologic labor support, and emergency obstetric preparedness.",
      content: `The 2026 World Health Organization guidelines mark a transformative shift toward integrated, respectful maternal healthcare worldwide. The recommendations emphasize the vital role of autonomous midwifery-led care units, evidence-based labor interventions, and seamless transfer protocols to tertiary hospitals.\n\n### Key Clinical Recommendations\n1. **Routine Continuous Support in Labor:** Every laboring woman should have access to continuous emotional and physical support from a trusted companion or professional doula.\n2. **Minimizing Unnecessary Interventions:** Routine episiotomy, routine amniotomy, and continuous electronic fetal monitoring in low-risk pregnancies are strongly discouraged in favor of intermittent auscultation.\n3. **Postpartum Hemorrhage Readiness:** All birthing facilities must maintain active uterotonic storage, tranexamic acid protocols, and standardized quantitative blood loss measurement tools.`
    },
    {
      id: "art-2",
      title: "Negotiating Your First Attending Contract: Legal, Compensation & RVU Playbook",
      category: "Career Guide",
      readTime: "9 min read",
      author: "Dr. Eleanor Vance, MD & Healthcare Legal Fellows",
      date: "September 20, 2026",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80",
      excerpt: "Crucial contract negotiation strategies for graduating residents and fellows. Demystifying base salary, wRVU conversion factors, restrictive covenants, and tail insurance.",
      content: `Transitioning from residency or fellowship into your first attending physician contract is one of the most critical financial and professional milestones of your career. Too many young physicians sign boilerplate agreements without scrutinizing restrictive covenants or productivity thresholds.\n\n### Crucial Negotiation Checkpoints\n1. **Malpractice Tail Coverage:** Never accept an agreement requiring you to fund your own tail coverage upon departure unless the base compensation distinctly offsets the $30,000–$100,000 liability.\n2. **wRVU Baselines and Reconciliation:** Ensure production benchmarks account for ramp-up periods during your first 18 months.\n3. **Restrictive Covenants:** Scrutinize non-compete radius restrictions. A 15-mile radius in a major metropolitan area can completely ban you from neighboring health systems.`
    },
    {
      id: "art-3",
      title: "The 2026 Outlook: AI-Assisted Clinical Diagnostics Enter Mainstream Hospital Practice",
      category: "Healthcare News",
      readTime: "6 min read",
      author: "Dr. Marcus Chen, MD, Cleveland Clinic",
      date: "September 18, 2026",
      image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80",
      excerpt: "How real-time algorithmic triage in emergency radiology and electrocardiography is improving door-to-needle times while preserving clinician autonomy.",
      content: `Over the past three years, artificial intelligence has migrated from academic proof-of-concept models into daily hospital workflow. In 2026, leading health systems report measurable reductions in diagnostic delays for large vessel occlusions, pulmonary embolisms, and occult cervical spine fractures.\n\n### Where AI Drives Measurable Value\n- **Triage Queuing:** Prioritizing positive head CTs to the top of the radiologist's read queue within 90 seconds of scan completion.\n- **Automated ECG Interpretation:** Identifying subtle acute coronary occlusion (OMI) that traditional STEMI criteria frequently overlook.\n- **Clinician Over-read:** Serving as an infallible safety net rather than an autonomous replacement for clinical judgement.`
    }
  ],

  // Upcoming Industry & CME Events
  events: [
    {
      id: "ev-1",
      title: "World Congress on Cardiovascular Medicine & TAVR 2026",
      date: "November 14-16, 2026",
      location: "San Francisco, CA & Virtual",
      organizer: "American College of Cardiology & MedSphere",
      cmeCredits: "18 CME Credits",
      attendees: "3,400+ Registered",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80",
      description: "Three days of live case transmissions from catheterization laboratories worldwide, keynote lectures on transcatheter innovations, and hands-on simulation suites."
    },
    {
      id: "ev-2",
      title: "Global Critical Care Nursing & Resuscitation Summit",
      date: "December 5-7, 2026",
      location: "Chicago, IL & Virtual",
      organizer: "AACN Healthcare Collaborative",
      cmeCredits: "16 CE Contact Hours",
      attendees: "2,850+ Registered",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80",
      description: "Interactive workshops on mechanical ventilation, continuous renal replacement therapy, and resilience strategies for acute hospital nursing units."
    }
  ],

  // Colleague Clinical Stories (Active Network)
  stories: [],

  // Community Discussion Feed
  communityPosts: [
    {
      id: "post-1",
      authorName: "Dr. Eleanor Vance, MD",
      authorRole: "Chief of Interventional Cardiology",
      authorAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
      time: "2 hours ago",
      specialtyTag: "Cardiology Case Study",
      content: "Challenging case in the cath lab this morning: 64-year-old male presenting with subtle ST-segment depression in V1-V3 and profound diaphoresis. Traditional computerized algorithm flagged it as 'normal baseline'. Intravascular ultrasound demonstrated 95% acute plaque rupture in a dominant circumflex artery. \n\nRemember: Computerized ECG interpretations miss up to 28% of acute Occlusion Myocardial Infarctions (OMI). Always trust your clinical instincts and bedside serial troponins!",
      likesCount: 142,
      commentsCount: 29,
      sharesCount: 18,
      likedByMe: false,
      comments: [
        {
          name: "Dr. Marcus Chen",
          role: "Neurologist, Cleveland Clinic",
          avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80",
          text: "Phenomenal catch, Eleanor! We see the exact same cognitive trap in posterior stroke presentations where initial NIHSS is deceptively low.",
          time: "1 hour ago"
        },
        {
          name: "Sarah Jenkins, RN",
          role: "ICU Director, Mayo Clinic",
          avatar: "https://images.unsplash.com/photo-1594824813515-546059e13d92?auto=format&fit=crop&w=200&q=80",
          text: "Diaphoresis + persistent nausea in the ER should always sound immediate clinical alarm bells, regardless of what the machine printout says.",
          time: "45 mins ago"
        }
      ]
    },
    {
      id: "post-poll-1",
      type: "poll",
      authorName: "Dr. Marcus Chen, MD",
      authorRole: "Neurology & Stroke Critical Care, Cleveland Clinic",
      authorAvatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80",
      time: "3 hours ago",
      specialtyTag: "Stroke Protocol & Emergency",
      content: "Clinical poll for ER and Neurointerventional teams: 58-year-old female presents 2 hours post acute right hemiparesis and aphasia with M1 MCA occlusion. Baseline BP is 188/112 mmHg, blood glucose 118 mg/dL. What is your immediate protocol prior to transfer for endovascular thrombectomy?",
      poll: {
        question: "Immediate priority step before groin puncture?",
        totalVotes: 255,
        myVote: null,
        options: [
          { id: "opt-1", text: "IV Labetalol/Nicardipine to titrate BP <185/110", votes: 94 },
          { id: "opt-2", text: "Immediate IV Tenecteplase (TNK) bolus", votes: 138 },
          { id: "opt-3", text: "Direct transfer to angiosuite without IV thrombolysis", votes: 23 }
        ]
      },
      likesCount: 96,
      commentsCount: 19,
      sharesCount: 14,
      likedByMe: false,
      comments: [
        {
          name: "Dr. Eleanor Vance, MD",
          role: "Chief of Interventional Cardiology",
          avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
          text: "Rapid BP control first! High systolic pressures during clot retrieval increase hemorrhagic transformation risk substantially.",
          time: "2 hours ago"
        }
      ]
    },
    {
      id: "post-2",
      authorName: "Layla Hassan",
      authorRole: "4th-Year Medical Student, Columbia University",
      authorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
      time: "5 hours ago",
      specialtyTag: "Medical Education & USMLE",
      content: "For everyone preparing for the 2026 USMLE Step 2 CK or clinical shelf exams: we just uploaded 40 newly annotated high-yield cardiac catheterization loops to our MedSphere Student Hub study folder. All verified by Dr. Vance! Link in bio. What topics would you like covered in our next live Sunday study session?",
      likesCount: 218,
      commentsCount: 41,
      sharesCount: 35,
      likedByMe: true,
      comments: [
        {
          name: "Dr. Tariq Al-Mansoor",
          role: "Pediatric Attending",
          avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=200&q=80",
          text: "Happy to host a pediatric fluid resuscitation breakdown for the students next month!",
          time: "3 hours ago"
        }
      ]
    }
  ],

  // Testimonials
  testimonials: [
    {
      quote: "From study groups to clinical rotations and residency matching, MedSphere is the collaborative network I wish I had on day one of medical school.",
      author: "Layla Hassan",
      role: "4th-year Medical Student",
      org: "Columbia Vagelos College of Physicians",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
      rating: 5
    },
    {
      quote: "MedSphere has become the single place where I find interventional peers, hire promising fellows, and stay sharp with accredited CME — all in one modern feed.",
      author: "Dr. Amelia Reyes",
      role: "Cardiologist & Clinical Director",
      org: "Mercy Health System",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80",
      rating: 5
    },
    {
      quote: "I landed my premier critical-care hospital contract in three days and finished my specialty certification on the exact same platform. The verification makes all the difference.",
      author: "James Okafor, RN",
      role: "Cardiothoracic ICU Nurse",
      org: "St. Luke's Health System",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      rating: 5
    }
  ],

  // Platform Metric Counters
  metrics: {
    professionals: "180,000+",
    verifiedProfiles: "94,000+",
    hospitals: "2,400+",
    pharmacyMembers: "8,600+",
    courses: "1,200+",
    connections: "25,000+"
  }
};

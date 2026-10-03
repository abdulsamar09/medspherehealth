// MedSphere SPA Router & Page Lifecycle Manager
// Directs all navigation, dynamic SEO titles, scroll restoration, and sub-views

window.MedSphereRouter = {
  routes: {
    // 1. Home / Feed / Dashboard
    'home': () => window.MedSphereHome.render(),
    '': () => window.MedSphereHome.render(),
    'feed': () => window.MedSphereDashboard.renderDashboard('feed'),

    // 2. About
    'about': () => window.MedSphereCommunity.renderAbout(),

    // 3 & 4. Network & Directory
    'network': (params) => window.MedSphereDirectory.renderDirectory(params),
    'directory': (params) => window.MedSphereDirectory.renderDirectory(params),
    'professionals': (params) => window.MedSphereDirectory.renderDirectory(params),

    // 5. Professional Profile
    'profile': (params) => window.MedSphereDirectory.renderProfile(params),

    // 6 & 7. Hospitals Directory & Hospital Profile
    'hospitals': (params) => window.MedSphereDirectory.renderHospitals(params),
    'hospital': (params) => window.MedSphereDirectory.renderHospitalProfile(params),

    // 8 & 9. Pharmaceutical Companies & Profile
    'companies': (params) => window.MedSphereDirectory.renderCompanies(params),
    'company': (params) => window.MedSphereDirectory.renderCompanyProfile(params),
    'pharmaceuticals': (params) => window.MedSphereDirectory.renderCompanies(params),

    // 10 & 11. Marketplace
    'marketplace': (params) => window.MedSphereMarketplace.renderMarketplace(params),
    'marketplace-products': (params) => window.MedSphereMarketplace.renderMarketplace(params),

    // 12. Product Detail
    'product': (params) => window.MedSphereMarketplace.renderProductDetail(params),

    // 13 & 14. Education & Courses
    'education': (params) => window.MedSphereEducation.renderEducation(params),
    'courses': (params) => window.MedSphereEducation.renderEducation(params),

    // 15. Course Detail
    'course': (params) => window.MedSphereEducation.renderCourseDetail(params),

    // 16 & 17. Jobs
    'jobs': (params) => window.MedSphereJobs.renderJobs(params),
    'jobs-all': (params) => window.MedSphereJobs.renderJobs(params),

    // 18. Job Detail
    'job': (params) => window.MedSphereJobs.renderJobDetail(params),

    // 19. Resources & Study Center
    'resources': (params) => window.MedSphereCommunity.renderArticles(params),

    // 20. Knowledge Center / Articles
    'articles': (params) => window.MedSphereCommunity.renderArticles(params),
    'insights': (params) => window.MedSphereCommunity.renderArticles(params),

    // 21. Article Detail
    'article': (params) => window.MedSphereCommunity.renderArticleDetail(params),

    // 22 & 23. Events (Removed - redirect to feed)
    'events': () => {
      window.location.hash = '#feed';
      return '';
    },
    'event': () => {
      window.location.hash = '#feed';
      return '';
    },

    // 24. Community Discussion
    'community': () => window.MedSphereCommunity.renderCommunity(),

    // 25. Pricing (Removed - redirect to home)
    'pricing': () => {
      window.location.hash = '#home';
      return window.MedSphereCommunity.renderLanding();
    },

    // 26. Contact Us
    'contact': () => window.MedSphereCommunity.renderContact(),

    // 27. Request a Demo
    'demo': () => window.MedSphereCommunity.renderContact(),

    // 28. Login
    'login': () => window.MedSphereAuth.renderLogin(),

    // 29. Register
    'register': () => window.MedSphereAuth.renderRegister(),

    // 30. Forgot Password
    'forgot-password': () => window.MedSphereAuth.renderForgotPassword(),

    // 31. User Dashboard Overview
    'dashboard': () => window.MedSphereDashboard.renderDashboard('overview'),

    // 32. Settings
    'settings': () => window.MedSphereDashboard.renderDashboard('settings'),

    // 33. Notifications
    'notifications': () => window.MedSphereDashboard.renderDashboard('notifications'),

    // 34. Saved Items
    'saved': () => window.MedSphereDashboard.renderDashboard('saved'),
    'saved-items': () => window.MedSphereDashboard.renderDashboard('saved'),

    // 35. My Applications
    'applications': () => window.MedSphereDashboard.renderDashboard('applications'),
    'my-applications': () => window.MedSphereDashboard.renderDashboard('applications'),

    // 36. My Courses & CME
    'my-courses': () => window.MedSphereDashboard.renderDashboard('courses'),
    'certificates': () => window.MedSphereDashboard.renderDashboard('courses'),

    // 37. My Connections
    'my-connections': () => window.MedSphereDashboard.renderDashboard('connections'),
    'connections': () => window.MedSphereDashboard.renderDashboard('connections'),

    // 38. Role-Based Specialized Portals
    'employer': () => window.MedSphereDashboard.renderDashboard('employer'),
    'recruiter': () => window.MedSphereDashboard.renderDashboard('employer'),
    'supplier': () => window.MedSphereDashboard.renderDashboard('supplier'),
    'pharma': () => window.MedSphereDashboard.renderDashboard('supplier'),
    'student': () => window.MedSphereDashboard.renderDashboard('student'),
    'verification': () => window.MedSphereDashboard.renderDashboard('verification'),
    'groups': (params) => window.MedSphereCommunity.renderCommunity(params),

    // 39. Real Encrypted Messaging
    'messages': (params) => window.MedSphereMessages.renderMessages(params),

    // 40. Enterprise Admin Oversight
    'admin': () => window.MedSphereAdmin.renderAdmin(),

    // 41. Global Search
    'search': (params) => window.MedSphereRouter.renderGlobalSearch(params)
  },

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  },

  parseHash() {
    const raw = window.location.hash.slice(1) || 'home';
    const [path, queryString] = raw.split('?');
    const params = {};
    if (queryString) {
      const pairs = queryString.split('&');
      for (const pair of pairs) {
        const [k, v] = pair.split('=');
        if (k) params[decodeURIComponent(k)] = decodeURIComponent(v || '');
      }
    }
    return { path: path.toLowerCase(), params };
  },

  protectedRoutes: [
    'feed',
    'dashboard',
    'settings',
    'notifications',
    'saved',
    'saved-items',
    'applications',
    'my-applications',
    'my-courses',
    'certificates',
    'my-connections',
    'connections',
    'employer',
    'recruiter',
    'supplier',
    'pharma',
    'student',
    'verification',
    'messages',
    'admin'
  ],

  async handleRoute() {
    const { path, params } = this.parseHash();
    const mainEl = document.getElementById('main-content');
    if (!mainEl) return;

    // Authentication Guard for Protected Member Routes
    const isProtected = this.protectedRoutes.includes(path);
    const isLoggedIn = Boolean(window.MedSphereStore && window.MedSphereStore.isLoggedIn());

    if (isProtected && !isLoggedIn) {
      window.location.hash = `#login?redirect=${encodeURIComponent(path)}`;
      return;
    }

    // If logged in and visits login/register, redirect to feed
    if (isLoggedIn && (path === 'login' || path === 'register')) {
      const target = params.redirect || 'feed';
      window.location.hash = `#${target}`;
      return;
    }

    // Loading state
    mainEl.innerHTML = `
      <div style="min-height:50vh; display:flex; align-items:center; justify-content:center;">
        <div style="text-align:center;">
          <div style="width:40px; height:40px; border:3px solid var(--primary-100); border-top-color:var(--primary-800); border-radius:50%; animation:spin 0.8s linear infinite; margin:0 auto 1rem;"></div>
          <div style="font-size:0.875rem; color:var(--slate-500); font-weight:600;">Loading MedSphere...</div>
        </div>
      </div>
      <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
    `;

    const handler = this.routes[path] || this.routes['home'];

    try {
      const html = await Promise.resolve(handler(params));
      mainEl.innerHTML = html;
      // Load async widgets for feed/dashboard
      if ((path === 'feed' || path === 'dashboard') && window.MedSphereDashboard && window.MedSphereDashboard.loadMyGroupsWidget) {
        setTimeout(() => window.MedSphereDashboard.loadMyGroupsWidget(), 50);
      }
    } catch (err) {
      console.error("Routing render error:", err);
      mainEl.innerHTML = `<div class="container text-center" style="padding:5rem 0;"><h3>Page failed to load</h3><p class="text-muted">${err.message}</p><a href="#home" class="btn btn-primary mt-2">Return Home</a></div>`;
    }

    // Always restore body scroll on any route change (in case mobile modal/detail was open)
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';

    window.scrollTo({ top: 0, behavior: 'instant' });
    this.updateActiveNav(path);
    this.updatePageTitle(path);
    this.initPageInteractions(path);

    const footerEl = document.getElementById('site-footer');
    const preFooterEl = document.getElementById('pre-footer-cta');
    const hideFooterRoutes = ['login', 'register', 'forgot-password', 'dashboard', 'feed'];
    const shouldHide = hideFooterRoutes.includes(path);
    if (footerEl) {
      footerEl.style.display = shouldHide ? 'none' : 'block';
    }
    if (preFooterEl) {
      preFooterEl.style.display = shouldHide ? 'none' : 'block';
    }
  },

  refreshCurrentPage() {
    this.handleRoute();
  },

  updateActiveNav(path) {
    const links = document.querySelectorAll('.nav-link, .mobile-nav-link, .nav-tab');
    links.forEach(link => {
      const href = link.getAttribute('href');
      const isHomeMatch = (path === 'home' || path === '') && href === '#home';
      const isFeedMatch = (path === 'feed' || path === 'dashboard') && (href === '#feed' || href === '#dashboard');
      const isNetworkMatch = (path === 'network' || path === 'directory' || path === 'professionals' || path === 'profile') && href === '#network';
      const isMarketMatch = (path === 'marketplace' || path === 'marketplace-products' || path === 'product') && href === '#marketplace';
      const isEduMatch = (path === 'education' || path === 'courses' || path === 'course') && href === '#education';
      const isJobsMatch = (path === 'jobs' || path === 'jobs-all' || path === 'job') && href === '#jobs';
      const isHospitalMatch = (path === 'hospitals' || path === 'hospital') && href === '#hospitals';

      if (href && (href === `#${path}` || isHomeMatch || isFeedMatch || isNetworkMatch || isMarketMatch || isEduMatch || isJobsMatch || isHospitalMatch)) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    const drawerBackdrop = document.getElementById('mobile-drawer-backdrop');
    if (drawerBackdrop) drawerBackdrop.classList.remove('active');
  },

  updatePageTitle(path) {
    const titles = {
      'home': 'MedSphere — Healthcare Professional Network, Marketplace & Education',
      'about': 'About MedSphere — Unifying Global Healthcare',
      'network': 'Healthcare Professionals Directory — MedSphere',
      'directory': 'Healthcare Professionals Directory — MedSphere',
      'profile': 'Clinician Profile — MedSphere Network',
      'hospitals': 'Hospitals & Health Systems Directory — MedSphere',
      'hospital': 'Hospital Clinical Overview — MedSphere',
      'companies': 'Pharmaceutical & MedTech Companies — MedSphere',
      'marketplace': 'Healthcare Marketplace & B2B Procurement — MedSphere',
      'product': 'Medical Device & Product Specs — MedSphere Marketplace',
      'education': 'Medical Education Hub & Accredited CME — MedSphere',
      'course': 'CME Curriculum & Learning Modules — MedSphere',
      'jobs': 'Healthcare Jobs Board & Clinical Openings — MedSphere',
      'job': 'Clinical Job Opportunity — MedSphere',
      'articles': 'Medical Knowledge Center & Clinical Insights — MedSphere',
      'article': 'Clinical Editorial — MedSphere Knowledge Center',
      'events': 'Healthcare Congresses & Symposiums — MedSphere',
      'community': 'Clinical Community & Case Discussions — MedSphere',
      'contact': 'Contact Healthcare Advisory — MedSphere',
      'dashboard': 'Clinician SaaS Dashboard — MedSphere',
      'messages': 'Encrypted Clinical Messaging — MedSphere',
      'admin': 'Enterprise Platform Administration — MedSphere',
      'login': 'Sign In — MedSphere Verified Portal',
      'register': 'Join the Network — MedSphere Onboarding'
    };

    document.title = titles[path] || 'MedSphere — Healthcare Network, Marketplace & Education';
  },

  initPageInteractions(path) {
    if (path === 'home' || path === '') {
      this.initCounters();
      if (window.MedSphereHome && window.MedSphereHome.initHowItWorksScroll) {
        window.MedSphereHome.initHowItWorksScroll();
      }
      if (window.MedSphereHome && window.MedSphereHome.initServicesCarousel) {
        window.MedSphereHome.initServicesCarousel();
      }
    }

    // Network / Directory: load real doctor profiles from backend
    if (path === 'network' || path === 'directory' || path === 'professionals') {
      if (window.MedSphereDirectory && window.MedSphereDirectory.loadRealProfiles) {
        // Small delay so the DOM is ready
        setTimeout(() => window.MedSphereDirectory.loadRealProfiles(), 80);
      }
    }
  },

  initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10);
          if (target) {
            let start = 0;
            const duration = 1200;
            const stepTime = 25;
            const steps = duration / stepTime;
            const increment = target / steps;
            
            const timer = setInterval(() => {
              start += increment;
              if (start >= target) {
                el.innerText = target >= 1000 ? (target >= 10000 ? (target/1000).toFixed(0)+'K+' : target.toLocaleString()+'+') : target+'K+';
                clearInterval(timer);
              } else {
                el.innerText = Math.floor(start) + '+';
              }
            }, stepTime);
          }
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.2 });

    counters.forEach(c => observer.observe(c));
  },

  // Categorized Global Search Renderer (Professionals | Jobs | Courses | Products | Events)
  async renderGlobalSearch(params = {}) {
    const q = (params.q || '').toLowerCase();
    const data = window.MEDSPHERE_DATA;

    const liveProfs = (window.MedSphereDirectory && window.MedSphereDirectory.getAllProfessionals)
      ? window.MedSphereDirectory.getAllProfessionals()
      : (data.professionals || []);
    let matchedProfs = liveProfs.filter(p => `${p.name} ${p.title} ${p.specialty} ${p.organization}`.toLowerCase().includes(q));
    let matchedJobs = data.jobs.filter(j => `${j.title} ${j.company} ${j.specialty}`.toLowerCase().includes(q));
    let matchedProducts = data.products.filter(p => `${p.name} ${p.company} ${p.category}`.toLowerCase().includes(q));
    let matchedCourses = data.courses.filter(c => `${c.title} ${c.instructor} ${c.category}`.toLowerCase().includes(q));

    try {
      if (window.MedSphereAPI && q) {
        const live = await window.MedSphereAPI.globalSearch(q);
        if (live) {
          if (live.professionals && live.professionals.length) {
            matchedProfs = live.professionals.map(p => ({
              id: p.id,
              name: p.full_name,
              title: p.professional_title,
              organization: p.organization,
              specialty: p.specialty,
              avatar: p.avatar_url || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80'
            }));
          }
          if (live.jobs && live.jobs.length) matchedJobs = live.jobs;
          if (live.products && live.products.length) {
            matchedProducts = live.products.map(p => ({
              id: p.id,
              name: p.name,
              company: p.company,
              category: p.category,
              price: p.price,
              image: p.image_url || 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=400&q=80'
            }));
          }
          if (live.courses && live.courses.length) matchedCourses = live.courses;
        }
      }
    } catch (e) {}

    const totalResults = matchedProfs.length + matchedJobs.length + matchedProducts.length + matchedCourses.length;

    return `
      <div class="page-hero-banner">
        <div class="container">
          <div class="breadcrumbs">
            <a href="#home">Home</a> <span>/</span> <span>Global Search</span>
          </div>
          <h1 class="page-title">Search Results for "${params.q || ''}"</h1>
          <p class="section-subtitle">Found ${totalResults} categorized results across Professionals, Jobs, Products, Courses, and Events.</p>
        </div>
      </div>

      <div class="container" style="padding-top:3rem; padding-bottom:5rem;">
        <!-- Professionals Matches -->
        ${matchedProfs.length ? `
          <div style="margin-bottom:3rem;">
            <h3 style="font-size:1.35rem; color:var(--primary-900); margin-bottom:1rem; padding-bottom:0.5rem; border-bottom:1px solid var(--border-subtle);">
              Clinicians & Healthcare Professionals (${matchedProfs.length})
            </h3>
            <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:1.5rem;">
              ${matchedProfs.map(p => `
                <div class="prof-card">
                  <div class="prof-card-top">
                    <img src="${p.avatar}" alt="${p.name}" class="prof-avatar">
                    <div>
                      <h4 style="font-size:1.05rem;"><a href="#profile?id=${p.id}">${p.name}</a></h4>
                      <div class="text-xs text-muted">${p.title} · ${p.organization}</div>
                    </div>
                  </div>
                  <a href="#profile?id=${p.id}" class="btn btn-outline btn-sm mt-2">View Full Profile</a>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Jobs Matches -->
        ${matchedJobs.length ? `
          <div style="margin-bottom:3rem;">
            <h3 style="font-size:1.35rem; color:var(--primary-900); margin-bottom:1rem; padding-bottom:0.5rem; border-bottom:1px solid var(--border-subtle);">
              Hospital Career Vacancies (${matchedJobs.length})
            </h3>
            <div style="display:flex; flex-direction:column; gap:1rem;">
              ${matchedJobs.map(j => `
                <div class="job-card" style="padding:1.25rem;">
                  <div>
                    <h4 style="font-size:1.15rem;"><a href="#job?id=${j.id}">${j.title}</a></h4>
                    <div class="text-sm text-muted">${j.company} · ${j.location} · <strong>${j.salary}</strong></div>
                  </div>
                  <a href="#job?id=${j.id}" class="btn btn-primary btn-sm">Review & Apply</a>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Courses Matches -->
        ${matchedCourses.length ? `
          <div style="margin-bottom:3rem;">
            <h3 style="font-size:1.35rem; color:var(--primary-900); margin-bottom:1rem; padding-bottom:0.5rem; border-bottom:1px solid var(--border-subtle);">
              Accredited CME Courses & Curricula (${matchedCourses.length})
            </h3>
            <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:1.5rem;">
              ${matchedCourses.map(c => `
                <div class="card" style="padding:1.25rem; display:flex; flex-direction:column;">
                  <span class="badge badge-cme" style="margin-bottom:0.35rem;">${c.credits || 'CME'}</span>
                  <h4 style="font-size:1.1rem; margin-bottom:0.25rem;"><a href="#course?id=${c.id}">${c.title}</a></h4>
                  <div class="text-xs text-muted" style="margin-bottom:1rem;">Instructor: ${c.instructor}</div>
                  <a href="#course?id=${c.id}" class="btn btn-primary btn-sm mt-auto">Enroll &amp; View</a>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Products Matches -->
        ${matchedProducts.length ? `
          <div style="margin-bottom:3rem;">
            <h3 style="font-size:1.35rem; color:var(--primary-900); margin-bottom:1rem; padding-bottom:0.5rem; border-bottom:1px solid var(--border-subtle);">
              Marketplace Equipment & Tech (${matchedProducts.length})
            </h3>
            <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:1.5rem;">
              ${matchedProducts.map(p => `
                <div class="card" style="padding:1rem;">
                  <img src="${p.image}" alt="${p.name}" style="height:140px; width:100%; object-fit:cover; border-radius:var(--radius-sm); margin-bottom:0.75rem;">
                  <h4 style="font-size:0.95rem;"><a href="#product?id=${p.id}">${p.name}</a></h4>
                  <div style="font-weight:700; color:var(--primary-900); margin:0.5rem 0;">${p.price}</div>
                  <a href="#product?id=${p.id}" class="btn btn-outline btn-sm w-100">View Specs</a>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${!totalResults ? `
          <div class="text-center" style="padding:4rem 0;">
            <h3>No results found for "${params.q || ''}"</h3>
            <p class="text-muted" style="margin-top:0.5rem;">Try searching for a specialty like "Cardiology", role like "Nurse", or equipment like "Ultrasound".</p>
            <a href="#directory" class="btn btn-primary mt-2">Browse Professionals Directory</a>
          </div>
        ` : ''}
      </div>
    `;
  }
};

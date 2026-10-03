// MedSphere Homepage Renderer

window.MedSphereHome = {
  render() {
    const data = window.MEDSPHERE_DATA;
    setTimeout(() => {
      if (this.initHowItWorksScroll) this.initHowItWorksScroll();
      if (this.initServicesCarousel) this.initServicesCarousel();
    }, 60);
    
    return `
      <!-- 1. HERO SECTION (Pixel-perfect match to user reference screenshot) -->
      <section class="hero-section hero-layout-cinematic" id="hero">
        <div class="container hero-container-cinematic">
          <div class="hero-content-cinematic">
            <!-- Pill Badge (Dot + The Science Behind Connected Healthcare Solutions) -->
            <div class="hero-cinematic-pill">
              <span class="hero-pill-dot"></span>
              <span>The Science Behind Connected Healthcare Solutions</span>
            </div>

            <!-- Main Title (White + Soft Cyan Highlight) -->
            <h1 class="hero-cinematic-title">
              <span class="hero-title-line title-white">Connecting the Future of</span>
              <span class="hero-title-line title-cyan">Healthcare & Medicine</span>
            </h1>

            <!-- Subtitle Description -->
            <p class="hero-cinematic-subtitle">
              At MedSphere, we combine verified clinical expertise with cutting-edge medical technology to deliver trusted solutions for doctors, nurses, students, hospitals, and healthcare organizations worldwide.
            </p>

            <!-- Dual Action Buttons -->
            <div class="hero-cinematic-actions">
              <a href="#network" class="btn-hero-join">
                <span>Join the Network</span>
                <i class="fa-solid fa-arrow-right"></i>
              </a>
              <a href="#marketplace" class="btn-hero-explore">
                <span>Explore Marketplace</span>
                <i class="fa-solid fa-arrow-right"></i>
              </a>
            </div>

            <!-- Bottom Floating Trust Bar (White rounded card with 3 metric segments) -->
            <div class="hero-trust-bar">
              <!-- Item 1: 25+ Years Of Experience -->
              <div class="trust-item">
                <div class="trust-icon-box">
                  <i class="fa-solid fa-user-group"></i>
                </div>
                <div class="trust-text-stack">
                  <span class="trust-big-num">25+</span>
                  <span class="trust-small-sub">Years Of Experience</span>
                </div>
              </div>

              <div class="trust-divider"></div>

              <!-- Item 2: Overlapping Doctor Avatars + "Trusted By 180k+ Satisfied Doctors" -->
              <div class="trust-item">
                <div class="trust-avatar-stack">
                  <img src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=80&q=80" alt="Doctor" class="trust-avatar-pic">
                  <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=80&q=80" alt="Doctor" class="trust-avatar-pic">
                  <img src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=80&q=80" alt="Doctor" class="trust-avatar-pic">
                  <span class="trust-avatar-plus">+</span>
                </div>
                <div class="trust-text-stack">
                  <span class="trust-label-tiny">Trusted By</span>
                  <strong class="trust-bold-title">180k+ Satisfied Doctors</strong>
                </div>
              </div>

              <div class="trust-divider"></div>

              <!-- Item 3: Global Reach Across 100+ Countries -->
              <div class="trust-item">
                <div class="trust-icon-box">
                  <i class="fa-solid fa-globe"></i>
                </div>
                <div class="trust-text-stack">
                  <strong class="trust-bold-title">Global Reach</strong>
                  <span class="trust-small-sub">Across 100+ Countries</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Top-Right Floating Verified Professionals Card -->
          <div class="hero-verified-card">
            <div class="verified-icon-shield">
              <i class="fa-solid fa-shield-halved"></i>
            </div>
            <div class="verified-text-wrap">
              <div class="verified-title">Verified Professionals</div>
              <div class="verified-sub">Trusted & Secure</div>
            </div>
          </div>

          <!-- Mid-Right "Better Care Together" Cursive Handwritten Text with Swoosh -->
          <div class="hero-handwritten-together">
            <div class="together-text">
              <span>Better</span>
              <span>Care</span>
              <span>Together</span>
            </div>
            <svg class="together-swoosh" width="105" height="24" viewBox="0 0 105 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 14C32 24 75 20 101 6" stroke="#4db5ff" stroke-width="3.5" stroke-linecap="round"/>
            </svg>
          </div>
        </div>
      </section>

      <!-- 2. TRUSTED BY LEADING ORGANIZATIONS -->
      <section class="trusted-section">
        <div class="container">
          <div class="trusted-heading">POWERING TEAMS AT LEADING HEALTHCARE ORGANIZATIONS</div>
          <div class="trusted-logos-grid">
            <div class="org-logo-item">
              <i class="fa-solid fa-hospital" style="color:var(--primary-600); font-size:1.25rem;"></i>
              <span>Mayo Health</span>
            </div>
            <div class="org-logo-item">
              <i class="fa-solid fa-staff-snake" style="color:var(--primary-600); font-size:1.25rem;"></i>
              <span>St. Luke's</span>
            </div>
            <div class="org-logo-item">
              <i class="fa-solid fa-capsules" style="color:var(--primary-600); font-size:1.25rem;"></i>
              <span>Pfizer</span>
            </div>
            <div class="org-logo-item">
              <i class="fa-solid fa-square-plus" style="color:var(--primary-600); font-size:1.25rem;"></i>
              <span>Cleveland Clinic</span>
            </div>
            <div class="org-logo-item">
              <i class="fa-solid fa-earth-americas" style="color:var(--primary-600); font-size:1.25rem;"></i>
              <span>WHO</span>
            </div>
            <div class="org-logo-item">
              <i class="fa-solid fa-heart-pulse" style="color:var(--primary-600); font-size:1.25rem;"></i>
              <span>NHS Trust</span>
            </div>
            <div class="org-logo-item">
              <i class="fa-solid fa-dna" style="color:var(--primary-600); font-size:1.25rem;"></i>
              <span>Roche</span>
            </div>
          </div>
        </div>
      </section>


      <!-- 4. SERVICES & SPECIALTIES SHOWCASE (10 HEALTHCARE SERVICES MATCHING REFERENCE LAYOUT) -->
      <section class="section services-showcase-section" id="services">
        <div class="container services-container">
          <!-- Subtle medical cross watermark in top-left matching reference layout -->
          <div class="services-watermark-cross" aria-hidden="true">
            <svg width="130" height="130" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M38 12 H62 V38 H88 V62 H62 V88 H38 V62 H12 V38 H38 V12 Z" fill="currentColor"/>
            </svg>
          </div>

          <!-- Centered Header matching reference image: Pill Badge, Bold Headline with Accent, Subtitle -->
          <div class="services-section-header">
            <div class="services-eyebrow-pill">
              <span class="services-pill-dot"></span>
              <span>Services</span>
            </div>
            <h2 class="services-headline">
              <span class="services-headline-main">Connecting Every Corner of Healthcare</span>
              <span class="services-headline-accent">with Verified Excellence</span>
            </h2>
            <p class="services-subtitle">
              From frontline physicians and acute care nurses to premier hospitals, pharmaceutical leaders, and medical trainees — unified on one trusted clinical ecosystem.
            </p>
          </div>

          <!-- 10 Services Cards Grid matching reference image layout (Desktop Grid, Mobile Carousel) -->
          <div class="services-showcase-grid" id="services-showcase-grid">
            ${data.categories.map(cat => `
              <a href="#directory?role=${cat.id}" class="service-card" data-role="${cat.id}">
                <div class="service-card-media">
                  <img src="${cat.image}" alt="${cat.role}" class="service-card-img" loading="lazy" draggable="false" />
                  <div class="service-circle-badge">
                    ${this.getCategoryIcon(cat.icon)}
                  </div>
                </div>
                <div class="service-card-body">
                  <h3 class="service-card-title">${cat.role}</h3>
                  <div class="service-card-accent-dash"></div>
                  <p class="service-card-desc">${cat.description}</p>
                  <div class="service-card-link-row">
                    <span class="service-card-link-text">Explore Network</span>
                    <i class="fa-solid fa-arrow-right-long service-card-arrow"></i>
                  </div>
                </div>
              </a>
            `).join('')}
          </div>

          <!-- Mobile Carousel Navigation Controls (Hidden on PC, visible on mobile) -->
          <div class="services-mobile-controls" id="services-mobile-controls" aria-label="Services carousel controls">
            <button type="button" class="services-mob-arrow" id="services-prev-btn" onclick="window.MedSphereHome.scrollServices(-1)" aria-label="Previous service">
              <i class="fa-solid fa-chevron-left"></i>
            </button>
            <div class="services-mob-dots" id="services-mob-dots">
              ${data.categories.map((cat, idx) => `
                <button type="button" class="services-mob-dot ${idx === 0 ? 'active' : ''}" onclick="window.MedSphereHome.scrollToService(${idx})" aria-label="Go to service slide ${idx + 1}"></button>
              `).join('')}
            </div>
            <button type="button" class="services-mob-arrow" id="services-next-btn" onclick="window.MedSphereHome.scrollServices(1)" aria-label="Next service">
              <i class="fa-solid fa-chevron-right"></i>
            </button>
          </div>

          <!-- Bottom Banner matching reference image: Doctor avatar + phone icon badge + text + link -->
          <div class="services-footer-banner-wrap">
            <div class="services-footer-banner">
              <div class="services-avatar-phone-combo">
                <img src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=120&q=80" alt="Doctor" class="services-advisor-avatar" />
                <span class="services-advisor-phone-badge">
                  <i class="fa-solid fa-phone"></i>
                </span>
              </div>
              <div class="services-footer-banner-content">
                <span class="services-banner-prompt">Let's Make Something Great Work Together.</span>
                <a href="#directory" class="services-banner-action-link">View All Services</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. MARKETPLACE FEATURES (DARK BLUE SECTION) -->
      <section class="marketplace-features-section" id="features">
        <div class="container">
          <div class="section-header text-center" style="max-width: 840px; margin: 0 auto 3.75rem auto; display: flex; flex-direction: column; align-items: center;">
            <div class="services-eyebrow-pill" style="background: rgba(37, 184, 242, 0.12); border-color: rgba(37, 184, 242, 0.3); color: #25B8F2;">
              <span class="services-pill-dot"></span>
              <span>Marketplace Features</span>
            </div>
            <h2 class="section-title text-white" style="font-family: var(--font-heading); font-size: clamp(2.1rem, 3.4vw, 2.9rem); font-weight: 800; letter-spacing: -0.02em; margin-bottom: 1rem;">
              Everything healthcare needs, in one ecosystem.
            </h2>
            <p class="section-subtitle" style="color: var(--slate-300); font-size: 1.05rem; line-height: 1.6; max-width: 680px; margin: 0 auto;">
              From networking and recruitment to continuing education and pharmaceutical sourcing — built with enterprise-grade security and verification.
            </p>
          </div>

          <div class="marketplace-features-grid">
            <div class="feature-box-dark">
              <div class="feature-box-icon">
                <i class="fa-solid fa-users-gear" style="font-size:1.4rem;"></i>
              </div>
              <h4 class="feature-box-title">Professional Networking</h4>
              <p class="feature-box-desc">Connect with verified peers, mentors, and specialty leaders across clinical disciplines worldwide.</p>
              <a href="#network" class="feature-box-link">Learn more &rarr;</a>
            </div>

            <div class="feature-box-dark">
              <div class="feature-box-icon">
                <i class="fa-solid fa-briefcase-medical" style="font-size:1.4rem;"></i>
              </div>
              <h4 class="feature-box-title">Healthcare Job Marketplace</h4>
              <p class="feature-box-desc">Discover clinical roles, locum tenens, and academic positions from premier hospitals and health systems.</p>
              <a href="#jobs" class="feature-box-link">Learn more &rarr;</a>
            </div>

            <div class="feature-box-dark">
              <div class="feature-box-icon">
                <i class="fa-solid fa-graduation-cap" style="font-size:1.4rem;"></i>
              </div>
              <h4 class="feature-box-title">Medical Education Hub</h4>
              <p class="feature-box-desc">Accredited AMA PRA Category 1 CME, nursing contact hours, and clinical simulation courses on demand.</p>
              <a href="#education" class="feature-box-link">Learn more &rarr;</a>
            </div>

            <div class="feature-box-dark">
              <div class="feature-box-icon">
                <i class="fa-solid fa-user-doctor" style="font-size:1.4rem;"></i>
              </div>
              <h4 class="feature-box-title">Internship Opportunities</h4>
              <p class="feature-box-desc">Find clinical rotations, sub-internships, and residency shadowing programs tailored to your medical track.</p>
              <a href="#jobs?type=internship" class="feature-box-link">Learn more &rarr;</a>
            </div>

            <div class="feature-box-dark">
              <div class="feature-box-icon">
                <i class="fa-solid fa-book-medical" style="font-size:1.4rem;"></i>
              </div>
              <h4 class="feature-box-title">Student Resources</h4>
              <p class="feature-box-desc">USMLE Step 1/2 CK prep, NCLEX question banks, clinical shelf notes, and active peer study groups.</p>
              <a href="#resources" class="feature-box-link">Learn more &rarr;</a>
            </div>

            <div class="feature-box-dark">
              <div class="feature-box-icon">
                <i class="fa-solid fa-flask-vial" style="font-size:1.4rem;"></i>
              </div>
              <h4 class="feature-box-title">Pharmaceutical Directory</h4>
              <p class="feature-box-desc">Direct verified channel to pharmaceutical pipelines, drug monograph downloads, and safety bulletins.</p>
              <a href="#companies" class="feature-box-link">Learn more &rarr;</a>
            </div>

            <div class="feature-box-dark">
              <div class="feature-box-icon">
                <i class="fa-solid fa-hospital-user" style="font-size:1.4rem;"></i>
              </div>
              <h4 class="feature-box-title">Hospital Partnerships</h4>
              <p class="feature-box-desc">Streamlined institutional procurement, medical equipment RFPs, and regional clinical consortiums.</p>
              <a href="#hospitals" class="feature-box-link">Learn more &rarr;</a>
            </div>

            <div class="feature-box-dark">
              <div class="feature-box-icon">
                <i class="fa-solid fa-graduation-cap" style="font-size:1.4rem;"></i>
              </div>
              <h4 class="feature-box-title">Accredited CME Education</h4>
              <p class="feature-box-desc">Accredited clinical modules, AMA PRA Category 1 Credits™, and medical board certificates.</p>
              <a href="#education" class="feature-box-link">Learn more &rarr;</a>
            </div>
          </div>

          <div style="text-align: center; margin-top: 3.5rem;">
            <a href="#marketplace" class="btn-duo btn-duo-secondary">
              <span class="btn-duo-text">Explore Marketplace Sourcing</span>
              <span class="btn-duo-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </span>
            </a>
          </div>
        </div>
      </section>

      <!-- 5. HOW IT WORKS 4-STEPS (Positioned directly below Everything healthcare needs, in one ecosystem) -->
      <section class="how-it-works-scroll-container" id="how-it-works">
        <div class="how-it-works-sticky-frame">
          <div class="how-it-works-ambient-glow"></div>
          <div class="container">
            <div class="how-it-works-grid">
              <!-- Left Column: Pill Badge, Bold Headline, Subtitle Dot & Text, Clinical Visual Card -->
              <div class="how-it-works-left">
                <div class="how-it-works-pill-badge">
                  <i class="fa-solid fa-staff-snake"></i>
                  <span>How It Works</span>
                </div>

                <h2 class="how-it-works-title">
                  From onboarding to opportunity in four steps.
                </h2>

                <div class="how-it-works-subtitle-wrap">
                  <span class="how-it-works-accent-dot"></span>
                  <p class="how-it-works-subtitle">
                    A guided experience that helps every member — from students to health systems — unlock verified value from day one.
                  </p>
                </div>

                <div class="how-it-works-image-card">
                  <img src="assets/how_it_works_doctor.jpg" alt="MedSphere verified clinician consultation with patient" class="how-it-works-img" loading="lazy">
                </div>
              </div>

              <!-- Right Column: Vertical Connected Steps Timeline -->
              <div class="how-it-works-right">
                <div class="how-it-works-timeline">
                  <!-- Continuous vertical line track with animated filling line on scroll -->
                  <div class="how-timeline-line-track">
                    <div class="how-timeline-line-fill" id="how-timeline-fill-bar">
                      <div class="how-timeline-line-head"></div>
                    </div>
                  </div>

                  <!-- Step 01 -->
                  <div class="how-step-item is-active" data-step="1">
                    <div class="how-step-marker">
                      <div class="how-step-circle">01</div>
                    </div>
                    <div class="how-step-body">
                      <h3 class="how-step-title">Create your profile</h3>
                      <p class="how-step-desc">Verify your medical credentials and NPI in minutes to showcase your verified clinical expertise.</p>
                    </div>
                  </div>

                  <!-- Step 02 -->
                  <div class="how-step-item" data-step="2">
                    <div class="how-step-marker">
                      <div class="how-step-circle">02</div>
                    </div>
                    <div class="how-step-body">
                      <h3 class="how-step-title">Connect with professionals</h3>
                      <p class="how-step-desc">Build an authentic network of doctors, nurses, researchers, hospitals and verified industry partners.</p>
                    </div>
                  </div>

                  <!-- Step 03 -->
                  <div class="how-step-item" data-step="3">
                    <div class="how-step-marker">
                      <div class="how-step-circle">03</div>
                    </div>
                    <div class="how-step-body">
                      <h3 class="how-step-title">Access opportunities</h3>
                      <p class="how-step-desc">Apply for premier hospital positions, enroll in CME courses, and explore direct marketplace sourcing.</p>
                    </div>
                  </div>

                  <!-- Step 04 -->
                  <div class="how-step-item" data-step="4">
                    <div class="how-step-marker">
                      <div class="how-step-circle">04</div>
                    </div>
                    <div class="how-step-body">
                      <h3 class="how-step-title">Grow your career</h3>
                      <p class="how-step-desc">Earn accredited certifications, gain global clinical visibility, and scale your institutional impact.</p>
                    </div>
                  </div>
                </div>

                <div class="how-it-works-action-wrap">
                  <a href="#register" class="btn-duo btn-duo-primary">
                    <span class="btn-duo-text">Start Your Medical Journey</span>
                    <span class="btn-duo-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 6. PLATFORM STATISTICS STRIP -->
      <section class="stats-strip-section">
        <div class="container">
          <div class="stats-strip-grid">
            <div class="stat-strip-box">
              <div class="stat-big counter" data-target="180">180K+</div>
              <div class="stat-sub">Healthcare Professionals</div>
            </div>
            <div class="stat-strip-box">
              <div class="stat-big counter" data-target="94">94K+</div>
              <div class="stat-sub">Verified Profiles</div>
            </div>
            <div class="stat-strip-box">
              <div class="stat-big counter" data-target="2400">2,400+</div>
              <div class="stat-sub">Healthcare Organizations</div>
            </div>
            <div class="stat-strip-box">
              <div class="stat-big counter" data-target="8600">8,600+</div>
              <div class="stat-sub">Courses & Resources</div>
            </div>
            <div class="stat-strip-box">
              <div class="stat-big counter" data-target="1200">1,200+</div>
              <div class="stat-sub">Healthcare Partners</div>
            </div>
            <div class="stat-strip-box">
              <div class="stat-big counter" data-target="25000">25K+</div>
              <div class="stat-sub">Community Connections</div>
            </div>
          </div>
        </div>
      </section>



      <!-- 9. SUCCESS STORIES / TESTIMONIALS (Matching Reference Image Layout) -->
      <section class="section testimonials-section" id="testimonials">
        <div class="container">
          <div class="testimonials-header-split">
            <!-- Left Header: Eyebrow Pill + Title + Subtitle -->
            <div class="testimonials-header-left">
              <span class="testimonials-pill-eyebrow">TESTIMONIALS</span>
              <h2 class="testimonials-title">
                Loved by <span class="testimonials-title-highlight">Clinicians, Students</span> and leaders.
              </h2>
              <p class="testimonials-subtitle">
                Discover how healthcare pioneers use MedSphere to advance their clinical practice and find opportunities worldwide.
              </p>
            </div>

            <!-- Right Controls: Rounded Pill with < | > Carousel Arrows -->
            <div class="testimonials-nav-pill">
              <button type="button" class="test-nav-arrow" id="test-prev-btn" onclick="window.MedSphereHome.scrollTestimonials(-1)" aria-label="Previous Testimonials">
                <i class="fa-solid fa-chevron-left"></i>
              </button>
              <div class="test-nav-divider"></div>
              <button type="button" class="test-nav-arrow" id="test-next-btn" onclick="window.MedSphereHome.scrollTestimonials(1)" aria-label="Next Testimonials">
                <i class="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>

          <!-- Cards Row / Carousel -->
          <div class="testimonials-carousel-track" id="testimonials-carousel-track">
            ${data.testimonials.map(item => `
              <div class="testimonial-card">
                <!-- Top-Left Stylized Quotation Mark (Image 1) -->
                <div class="testimonial-quote-icon">
                  <svg width="34" height="26" viewBox="0 0 34 26" fill="currentColor">
                    <path d="M0 26V15.4286L6.85714 0H14.8571L9.14286 13.7143H14.8571V26H0ZM19.1429 26V15.4286L26 0H34L28.2857 13.7143H34V26H19.1429Z" />
                  </svg>
                </div>

                <!-- Middle Quote Text -->
                <p class="testimonial-quote">${item.quote}</p>

                <!-- Bottom Row: Author + 5 Stars -->
                <div class="testimonial-bottom-row">
                  <div class="testimonial-author-meta">
                    <img src="${item.avatar}" alt="${item.author}" class="test-avatar" loading="lazy">
                    <div class="test-author-text">
                      <div class="test-author-header">
                        <span class="test-author-name">${item.author}</span>
                        <div class="test-stars-group">
                          <i class="fa-solid fa-star"></i>
                          <i class="fa-solid fa-star"></i>
                          <i class="fa-solid fa-star"></i>
                          <i class="fa-solid fa-star"></i>
                          <i class="fa-solid fa-star"></i>
                        </div>
                      </div>
                      <div class="test-author-role">${item.role} · ${item.org}</div>
                    </div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- 10. KNOWLEDGE CENTER -->
      <section class="section knowledge-section" id="insights">
        <div class="container">
          <div class="section-header" style="display:flex; justify-content:space-between; align-items:flex-end; text-align:left; max-width:none;">
            <div>
              <span class="section-eyebrow">KNOWLEDGE CENTER</span>
              <h2 class="section-title" style="margin-bottom:0;">Insights from the front lines of healthcare.</h2>
            </div>
            <a href="#articles" class="btn-duo btn-duo-secondary">
              <span class="btn-duo-text">All Articles</span>
              <span class="btn-duo-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </span>
            </a>
          </div>

          <div class="articles-grid">
            ${data.articles.map(art => `
              <div class="article-card">
                <div class="article-img-wrap">
                  <img src="${art.image}" alt="${art.title}">
                </div>
                <div class="article-body">
                  <span class="article-cat-pill">${art.category}</span>
                  <h4 class="article-title">${art.title}</h4>
                  <p class="article-excerpt">${art.excerpt}</p>
                  <a href="#article?id=${art.id}" class="article-read-link">
                    Read article
                    <i class="fa-solid fa-arrow-right"></i>
                  </a>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  },

  async handleDemoSubmit(form) {
    const name = form.querySelector('[name="name"]').value;
    const email = form.querySelector('[name="email"]').value;
    const organization = form.querySelector('[name="organization"]').value;
    const orgType = form.querySelector('[name="orgType"]').value;
    const message = form.querySelector('[name="message"]').value;

    try {
      if (window.MedSphereAPI) {
        await window.MedSphereAPI.submitDemo({ name, email, organization, orgType, message });
      }
    } catch (e) {
      console.warn("Could not save remote demo request:", e);
    }

    window.MedSphereToast.show("Demo Request Received", `Thank you, ${name}! An enterprise partnership director will reach out regarding ${organization} within 24 hours.`, "success");
    form.reset();
  },

  scrollTestimonials(direction) {
    const track = document.getElementById('testimonials-carousel-track');
    if (!track) return;
    const cardWidth = track.querySelector('.testimonial-card')?.offsetWidth || 380;
    track.scrollBy({ left: direction * (cardWidth + 32), behavior: 'smooth' });
  },

  scrollServices(direction) {
    const track = document.getElementById('services-showcase-grid');
    if (!track) return;
    const card = track.querySelector('.service-card');
    const cardWidth = card ? card.offsetWidth + 16 : 280;
    track.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
  },

  scrollToService(index) {
    const track = document.getElementById('services-showcase-grid');
    if (!track) return;
    const cards = track.querySelectorAll('.service-card');
    if (cards[index]) {
      cards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  },

  initServicesCarousel() {
    const track = document.getElementById('services-showcase-grid');
    const dotsContainer = document.getElementById('services-mob-dots');
    if (!track || !dotsContainer) return;

    const dots = dotsContainer.querySelectorAll('.services-mob-dot');
    const cards = track.querySelectorAll('.service-card');
    if (!cards.length || !dots.length) return;

    let ticking = false;
    const updateDots = () => {
      const trackRect = track.getBoundingClientRect();
      const trackCenter = trackRect.left + trackRect.width / 2;
      let closestIdx = 0;
      let minDistance = Infinity;

      cards.forEach((card, idx) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const dist = Math.abs(cardCenter - trackCenter);
        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = idx;
        }
      });

      dots.forEach((dot, idx) => {
        if (idx === closestIdx) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
      ticking = false;
    };

    track.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateDots);
        ticking = true;
      }
    }, { passive: true });
  },

  getCategoryIcon(icon) {
    switch (icon) {
      case 'stethoscope':
        return '<i class="fa-solid fa-stethoscope"></i>';
      case 'heart-pulse':
        return '<i class="fa-solid fa-heart-pulse"></i>';
      case 'baby':
        return '<i class="fa-solid fa-baby"></i>';
      case 'users-alt':
        return '<i class="fa-solid fa-user-doctor"></i>';
      case 'hospital':
        return '<i class="fa-solid fa-hospital"></i>';
      case 'capsules':
        return '<i class="fa-solid fa-capsules"></i>';
      case 'flask':
        return '<i class="fa-solid fa-flask-vial"></i>';
      case 'graduation-cap':
        return '<i class="fa-solid fa-graduation-cap"></i>';
      case 'award':
        return '<i class="fa-solid fa-award"></i>';
      case 'briefcase':
        return '<i class="fa-solid fa-briefcase-medical"></i>';
      default:
        return '<i class="fa-solid fa-circle-nodes"></i>';
    }
  },

  initHowItWorksScroll() {
    const container = document.getElementById('how-it-works');
    if (!container) return;

    const fillBar = document.getElementById('how-timeline-fill-bar');
    const stepItems = container.querySelectorAll('.how-step-item');
    if (!stepItems.length) return;

    if (window._howItWorksScrollHandler) {
      window.removeEventListener('scroll', window._howItWorksScrollHandler);
      window.removeEventListener('resize', window._howItWorksScrollHandler);
    }

    const updateScroll = () => {
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScroll = container.offsetHeight - windowHeight;

      if (totalScroll <= 0) {
        // Mobile / fallback for non-sticky heights
        const scrollMiddle = windowHeight * 0.55;
        let highestActive = 0;
        stepItems.forEach((item, idx) => {
          const itemRect = item.getBoundingClientRect();
          if (itemRect.top <= scrollMiddle) {
            item.classList.add('is-active');
            highestActive = idx;
          } else {
            item.classList.remove('is-active');
          }
        });
        if (fillBar) {
          fillBar.style.height = `${(highestActive / 3) * 100}%`;
        }
        return;
      }

      // Progress mapped smoothly from 0.0 to 1.0 while section is fixed in viewport
      const progress = Math.min(Math.max(-rect.top / totalScroll, 0), 1);

      if (fillBar) {
        fillBar.style.height = `${(progress * 100).toFixed(1)}%`;
      }

      // Progressive step thresholds: 01 (0.00), 02 (0.26), 03 (0.58), 04 (0.88)
      const thresholds = [0, 0.26, 0.58, 0.88];
      stepItems.forEach((item, idx) => {
        if (progress >= thresholds[idx]) {
          item.classList.add('is-active');
        } else {
          if (idx === 0 && rect.top <= windowHeight * 0.75) {
            item.classList.add('is-active');
          } else {
            item.classList.remove('is-active');
          }
        }
      });
    };

    let ticking = false;
    window._howItWorksScrollHandler = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', window._howItWorksScrollHandler, { passive: true });
    window.addEventListener('resize', window._howItWorksScrollHandler, { passive: true });

    // Allow user to click any step to scroll to it smoothly
    stepItems.forEach((item, idx) => {
      item.addEventListener('click', () => {
        const totalScroll = container.offsetHeight - window.innerHeight;
        if (totalScroll > 0) {
          const targetProgress = [0.05, 0.32, 0.65, 0.95][idx];
          const targetY = container.offsetTop + (totalScroll * targetProgress);
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        }
      });
    });

    updateScroll();
  }
};

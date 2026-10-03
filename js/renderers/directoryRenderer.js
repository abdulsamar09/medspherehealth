// MedSphere Directory & Profile Renderer

window.MedSphereDirectory = {
  // State for active network filters
  activeSpecialty: 'all',
  activeSearchQuery: '',
  activeLocation: 'all',
  activeAvailability: 'all',
  activeSpotlightTab: 'overview',
  activeSpotlightId: null,
  activeSort: 'recent',
  visibleCount: 16,

  // Cache of real profiles fetched from backend
  _backendProfiles: null,
  _profilesLoading: false,

  // 1. Healthcare Professionals Directory (Modern DocTak-style in MedSphere Theme)
  renderDirectory(params = {}) {
    const data = window.MEDSPHERE_DATA;
    const store = window.MedSphereStore;

    // Apply URL params if provided
    if (params.specialty) this.activeSpecialty = params.specialty;
    if (params.q) this.activeSearchQuery = params.q;
    if (params.location) this.activeLocation = params.location;
    if (params.availability) this.activeAvailability = params.availability;

    const list = this.getFilteredProfessionals();
    // Fallback placeholder used before async backend fetch completes
    const _emptySpotlight = {
      id: 'placeholder',
      name: 'Dr. Abdul Samad',
      monogram: 'AS',
      monogramColor: '#0080ff',
      title: 'Attending Physician',
      organization: 'Verified Medical Network',
      specialty: 'Interventional Cardiology',
      location: 'United States',
      tags: ['Open to roles', 'Global'],
      joinedText: 'Verified Member',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
      bio: 'Verified healthcare professional on MedSphere.',
      stats: { years: 5, cases: '500+', publications: 2, peerRating: '98%' },
      verifiedFacts: { identity: 'Verified Government ID & License', specialty: 'Interventional Cardiology', board: 'Board Certified Specialist', affiliation: 'Verified Medical Network', location: 'United States · Verified', verifiedDate: 'Active' }
    };
    const spotlightProf = list.find(p => p.id === this.activeSpotlightId) || list[0] || _emptySpotlight;

    const specialtyPills = [
      { id: 'all', label: 'All' },
      { id: 'Others', label: 'Others' },
      { id: 'Anatomical Pathology', label: 'Anatomical Pathology' },
      { id: 'Anesthesiology', label: 'Anesthesiology' },
      { id: 'Internal Medicine', label: 'Internal Medicine' },
      { id: 'Family Medicine', label: 'Family Medicine' },
      { id: 'Dermatology', label: 'Dermatology' },
      { id: 'Surgical Oncology', label: 'Surgical Oncology' },
      { id: 'Emergency Medicine', label: 'Emergency Medicine' },
      { id: 'Cardiology', label: 'Cardiology' },
      { id: 'Pediatrics', label: 'Pediatrics' },
      { id: 'Neurology', label: 'Neurology' },
      { id: 'Critical Care / ICU', label: 'Critical Care' }
    ];

    return `
      <div class="network-page-wrapper">
        <div class="network-page-container">
          
          <!-- HERO SECTION (Left Content, Right Image) -->
          <section class="network-hero-section">
            <div class="network-hero-grid">
              
              <!-- Left Hero Column -->
              <div class="network-hero-col-left">
                <div class="network-badge-pill">
                  <i class="fa-solid fa-arrow-up-right-from-square"></i>
                  <span>People on MedSphere</span>
                </div>

                <h1 class="network-hero-title">
                  <span id="network-hero-count">${list.length}</span> verified doctors
                  <span class="network-hero-highlight">across 79 specialties.</span>
                </h1>

                <p class="network-hero-sub">
                  Explore a trusted network of verified doctors. Connect, collaborate, and communicate securely after signing in. Every doctor on MedSphere is identity verified.
                </p>

                <div class="network-hero-actions">
                  <a href="#network-browse" class="btn-pill-primary" onclick="event.preventDefault(); document.getElementById('network-browse').scrollIntoView({ behavior: 'smooth' });">
                    <span>Browse profiles</span>
                    <i class="fa-solid fa-chevron-right" style="font-size:0.75rem;"></i>
                  </a>
                  <button type="button" onclick="window.MedSphereModals.open('modal-create-profile')" class="btn-pill-outline" style="cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
                    <i class="fa-solid fa-user-plus"></i>
                    <span>Create profile</span>
                  </button>
                </div>

                <div class="network-metrics-row">
                  <div class="network-metric-chip">
                    <i class="fa-solid fa-user-group"></i>
                    <span>1,615+ Profiles</span>
                  </div>
                  <div class="network-metric-chip">
                    <i class="fa-solid fa-stethoscope"></i>
                    <span>79 Specialties</span>
                  </div>
                  <div class="network-metric-chip">
                    <i class="fa-solid fa-shield-halved" style="color:#0080ff;"></i>
                    <span>Verified</span>
                  </div>
                </div>
              </div>

              <!-- Right Hero Column: Medical Team Image -->
              <div class="network-hero-col-right">
                <div class="network-hero-image-wrap">
                  <img src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=1000&q=80" alt="Verified Healthcare Specialists on MedSphere" loading="lazy">
                </div>
              </div>

            </div>
          </section>

          <!-- FILTER BAR CONTROLS SECTION -->
          <section class="network-filter-controls-wrap" id="network-browse">
            
            <!-- Row 1: Search Input & 3 Dropdowns -->
            <div class="network-search-row">
              
              <!-- Search box -->
              <div class="network-search-box">
                <i class="fa-solid fa-magnifying-glass"></i>
                <input type="text" id="network-search-input" value="${this.activeSearchQuery}" placeholder="Search by name, specialty, hospital or city" oninput="window.MedSphereDirectory.handleSearchInput(this.value)">
              </div>

              <!-- All specialties select -->
              <div class="network-select-wrap">
                <select id="network-spec-select" onchange="window.MedSphereDirectory.handleSpecialtySelect(this.value)">
                  <option value="all" ${this.activeSpecialty==='all'?'selected':''}>All specialties</option>
                  <option value="Cardiology" ${this.activeSpecialty==='Cardiology'?'selected':''}>Cardiology</option>
                  <option value="Anatomical Pathology" ${this.activeSpecialty==='Anatomical Pathology'?'selected':''}>Anatomical Pathology</option>
                  <option value="Neurology" ${this.activeSpecialty==='Neurology'?'selected':''}>Neurology</option>
                  <option value="Emergency Medicine" ${this.activeSpecialty==='Emergency Medicine'?'selected':''}>Emergency Medicine</option>
                  <option value="Surgical Oncology" ${this.activeSpecialty==='Surgical Oncology'?'selected':''}>Surgical Oncology</option>
                  <option value="Anesthesiology" ${this.activeSpecialty==='Anesthesiology'?'selected':''}>Anesthesiology</option>
                  <option value="Internal Medicine" ${this.activeSpecialty==='Internal Medicine'?'selected':''}>Internal Medicine</option>
                  <option value="Critical Care / ICU" ${this.activeSpecialty==='Critical Care / ICU'?'selected':''}>Critical Care / ICU</option>
                  <option value="Pediatrics" ${this.activeSpecialty==='Pediatrics'?'selected':''}>Pediatrics</option>
                  <option value="Family Medicine" ${this.activeSpecialty==='Family Medicine'?'selected':''}>Family Medicine</option>
                  <option value="Clinical Pharmacy" ${this.activeSpecialty==='Clinical Pharmacy'?'selected':''}>Clinical Pharmacy</option>
                  <option value="General Surgery" ${this.activeSpecialty==='General Surgery'?'selected':''}>General Surgery</option>
                </select>
              </div>

              <!-- Any location select -->
              <div class="network-select-wrap">
                <select id="network-loc-select" onchange="window.MedSphereDirectory.handleLocationSelect(this.value)">
                  <option value="all" ${this.activeLocation==='all'?'selected':''}>Any location</option>
                  <option value="Boston, MA" ${this.activeLocation==='Boston, MA'?'selected':''}>Boston, MA</option>
                  <option value="Cleveland, OH" ${this.activeLocation==='Cleveland, OH'?'selected':''}>Cleveland, OH</option>
                  <option value="Rochester, MN" ${this.activeLocation==='Rochester, MN'?'selected':''}>Rochester, MN</option>
                  <option value="Karachi, Pakistan" ${this.activeLocation==='Karachi, Pakistan'?'selected':''}>Karachi, Pakistan</option>
                  <option value="Dubai, UAE" ${this.activeLocation==='Dubai, UAE'?'selected':''}>Dubai, UAE</option>
                  <option value="Abu Dhabi, UAE" ${this.activeLocation==='Abu Dhabi, UAE'?'selected':''}>Abu Dhabi, UAE</option>
                  <option value="San Francisco, CA" ${this.activeLocation==='San Francisco, CA'?'selected':''}>San Francisco, CA</option>
                  <option value="New York, NY" ${this.activeLocation==='New York, NY'?'selected':''}>New York, NY</option>
                  <option value="Houston, TX" ${this.activeLocation==='Houston, TX'?'selected':''}>Houston, TX</option>
                </select>
              </div>

              <!-- Availability select -->
              <div class="network-select-wrap">
                <select id="network-avail-select" onchange="window.MedSphereDirectory.handleAvailabilitySelect(this.value)">
                  <option value="all" ${this.activeAvailability==='all'?'selected':''}>Availability</option>
                  <option value="Open to roles" ${this.activeAvailability==='Open to roles'?'selected':''}>Open to roles</option>
                  <option value="Open to research" ${this.activeAvailability==='Open to research'?'selected':''}>Open to research</option>
                  <option value="Speaking / CME" ${this.activeAvailability==='Speaking / CME'?'selected':''}>Speaking / CME</option>
                </select>
              </div>

              <!-- Reset / Filter toggle buttons -->
              <div class="network-filter-actions-group">
                <button type="button" class="network-filter-icon-btn" title="Reset Filters" onclick="window.MedSphereDirectory.resetFilters()">
                  <i class="fa-solid fa-arrow-rotate-left"></i>
                </button>
                <button type="button" class="network-filter-icon-btn" title="Toggle Grid Mode" onclick="window.MedSphereToast.show('View Mode', '4-Column Grid View active.', 'info')">
                  <i class="fa-solid fa-grip"></i>
                </button>
              </div>

            </div>

            <!-- Row 2: Specialty Quick Pills -->
            <div class="network-pills-row" id="network-specialty-pills">
              ${specialtyPills.map(sp => `
                <button type="button" class="network-spec-pill ${this.activeSpecialty.toLowerCase() === sp.id.toLowerCase() ? 'active' : ''}" onclick="window.MedSphereDirectory.handleSpecialtyPillClick('${sp.id}')">
                  ${sp.label}
                </button>
              `).join('')}
            </div>

            <!-- Row 3: Results Meta Line -->
            <div class="network-results-bar">
              <div>
                <strong id="network-count-num">${list.length}</strong> verified doctors
              </div>
              <div>
                <span style="color:#64748b; margin-right:4px;">Sorted by</span>
                <select class="network-sort-select" onchange="window.MedSphereDirectory.handleSortChange(this.value)">
                  <option value="recent">Recently joined</option>
                  <option value="experience">Years of experience</option>
                  <option value="rating">Highest rated</option>
                </select>
              </div>
            </div>

          </section>

          <!-- 4-COLUMN DOCTORS GRID -->
          <div class="network-doctors-grid" id="network-doctors-grid">
            ${this.renderDoctorCards(list)}
          </div>

          <!-- Centered Load More Profiles Button -->
          <div class="network-load-more-wrap">
            <button type="button" class="network-load-more-btn" onclick="window.MedSphereDirectory.handleLoadMore()">
              Load more profiles
            </button>
          </div>

          <!-- PROFILE SPOTLIGHT SECTION -->
          <section class="network-spotlight-section" id="profile-spotlight">
            <div class="network-spotlight-label">PROFILE SPOTLIGHT</div>
            <h2 class="network-spotlight-title">What a verified MedSphere profile looks like.</h2>

            <div class="network-spotlight-grid">
              
              <!-- Left Column: Large Showcase Card -->
              <div class="spotlight-main-card">
                
                <!-- Doctor Header -->
                <div class="spotlight-header-row">
                  <div class="spotlight-avatar-lg" style="background:${spotlightProf.monogramColor || '#0d9488'};">
                    ${spotlightProf.monogram || 'EV'}
                  </div>
                  <div style="flex:1;">
                    <h3 class="spotlight-doctor-name">
                      <span>${spotlightProf.name}</span>
                      <i class="fa-solid fa-shield-halved" style="color:#0080ff; font-size:1.05rem;" title="Identity & License Verified"></i>
                    </h3>
                    <div class="spotlight-doctor-sub">
                      ${spotlightProf.title} · ${spotlightProf.organization}
                    </div>
                    <div class="spotlight-badges-row">
                      <span class="network-tag-role">${spotlightProf.tags?.[0] || 'Open to roles'}</span>
                      <span class="network-tag-global">Speaks English, Spanish, Arabic</span>
                      <span class="network-card-joined" style="margin-left:auto;">${spotlightProf.joinedText || 'Joined 14 hours ago'}</span>
                    </div>
                  </div>
                </div>

                <!-- 4 Metrics Stats Row -->
                <div class="spotlight-stats-row">
                  <div class="spotlight-stat-item">
                    <span class="spotlight-stat-num">${spotlightProf.stats?.years || '14'}</span>
                    <span class="spotlight-stat-lbl">years' practice</span>
                  </div>
                  <div class="spotlight-stat-item">
                    <span class="spotlight-stat-num">${spotlightProf.stats?.cases || '1,700+'}</span>
                    <span class="spotlight-stat-lbl">cases</span>
                  </div>
                  <div class="spotlight-stat-item">
                    <span class="spotlight-stat-num">${spotlightProf.stats?.publications || '28'}</span>
                    <span class="spotlight-stat-lbl">publications</span>
                  </div>
                  <div class="spotlight-stat-item">
                    <span class="spotlight-stat-num">${spotlightProf.stats?.peerRating || '98%'}</span>
                    <span class="spotlight-stat-lbl">peer rating</span>
                  </div>
                </div>

                <!-- Tabs Row -->
                <div class="spotlight-tabs-row">
                  <button type="button" class="spotlight-tab-btn ${this.activeSpotlightTab === 'overview' ? 'active' : ''}" onclick="window.MedSphereDirectory.switchSpotlightTab('overview')">
                    Overview
                  </button>
                  <button type="button" class="spotlight-tab-btn ${this.activeSpotlightTab === 'publications' ? 'active' : ''}" onclick="window.MedSphereDirectory.switchSpotlightTab('publications')">
                    Publications
                  </button>
                  <button type="button" class="spotlight-tab-btn ${this.activeSpotlightTab === 'cases' ? 'active' : ''}" onclick="window.MedSphereDirectory.switchSpotlightTab('cases')">
                    Cases
                  </button>
                  <button type="button" class="spotlight-tab-btn ${this.activeSpotlightTab === 'cme' ? 'active' : ''}" onclick="window.MedSphereDirectory.switchSpotlightTab('cme')">
                    CME
                  </button>
                </div>

                <!-- Tab Dynamic Content -->
                <div id="spotlight-tab-content">
                  ${this.renderSpotlightTabContent(spotlightProf)}
                </div>

              </div>

              <!-- Right Column: Verified Facts & Connect Card -->
              <div class="spotlight-right-sidebar">
                
                <!-- Card 1: Verified Facts -->
                <div class="spotlight-facts-card">
                  <div class="spotlight-facts-title">Verified facts</div>
                  <div class="spotlight-facts-table">
                    <div class="spotlight-facts-row">
                      <span class="spotlight-fact-key">Identity</span>
                      <span class="spotlight-fact-val" style="color:#16a34a;"><i class="fa-solid fa-circle-check" style="font-size:11px; margin-right:4px;"></i>${spotlightProf.verifiedFacts?.identity || 'Government ID matched'}</span>
                    </div>
                    <div class="spotlight-facts-row">
                      <span class="spotlight-fact-key">Specialty</span>
                      <span class="spotlight-fact-val">${spotlightProf.verifiedFacts?.specialty || spotlightProf.specialty}</span>
                    </div>
                    <div class="spotlight-facts-row">
                      <span class="spotlight-fact-key">Board</span>
                      <span class="spotlight-fact-val">${spotlightProf.verifiedFacts?.board || 'ABIM, FACC'}</span>
                    </div>
                    <div class="spotlight-facts-row">
                      <span class="spotlight-fact-key">Affiliation</span>
                      <span class="spotlight-fact-val">${spotlightProf.organization}</span>
                    </div>
                    <div class="spotlight-facts-row">
                      <span class="spotlight-fact-key">Location</span>
                      <span class="spotlight-fact-val">${spotlightProf.location} · Global</span>
                    </div>
                  </div>
                  <div class="spotlight-facts-foot">
                    Verified by MedSphere on ${spotlightProf.verifiedFacts?.verifiedDate || 'Oct 14, 2025'}
                  </div>
                </div>

                <!-- Card 2: Connect with Doctor -->
                <div class="spotlight-connect-card">
                  <div class="spotlight-connect-title">Connect with ${spotlightProf.name.split(',')[0]}</div>
                  <div class="spotlight-connect-desc">
                    Send a message, share an article, or request a peer review - all through your verified MedSphere profile.
                  </div>
                  <div class="spotlight-connect-actions">
                    <button type="button" class="spotlight-btn-connect" onclick="window.MedSphereModals.open('modal-connect', { id: '${spotlightProf.id}', name: '${spotlightProf.name}', title: '${spotlightProf.title}', organization: '${spotlightProf.organization}', avatar: '${spotlightProf.avatar}' })">
                      ${store.isLoggedIn() ? 'Message Colleague' : 'Create account to connect'}
                    </button>
                    <a href="#profile?id=${spotlightProf.id}" class="spotlight-btn-profile">
                      View Full Profile
                    </a>
                  </div>
                </div>

              </div>

            </div>
          </section>

        </div>
      </div>
    `;
  },

  // Helper: Card generation for 4-column grid
  renderDoctorCards(list) {
    if (!list.length) {
      return `
        <div style="grid-column: 1 / -1; background:#f8fafc; border:1px dashed #cbd5e1; border-radius:16px; padding:3.5rem 1.5rem; text-align:center;">
          <i class="fa-solid fa-user-doctor" style="font-size:2.5rem; color:#94a3b8; margin-bottom:1rem;"></i>
          <h3 style="font-size:1.15rem; color:#0c2340; margin-bottom:0.5rem;">No verified doctors found matching criteria</h3>
          <p style="color:#64748b; font-size:0.875rem; margin-bottom:1.25rem;">Try selecting 'All' or clearing your search filters to explore our clinical community.</p>
          <button type="button" class="btn-pill-primary" onclick="window.MedSphereDirectory.resetFilters()">Clear Filters</button>
        </div>
      `;
    }

    return list.slice(0, this.visibleCount).map(p => {
      const tag1 = p.tags?.[0] || 'Open to roles';
      const tag2 = p.tags?.[1] || 'Global';
      const isNew = p.isNewlyCreated;
      const isYou = p.isCurrentUser;
      const badgeHtml = isNew
        ? `<span style="background:#10b981; color:#fff; font-size:0.65rem; font-weight:700; padding:2px 6px; border-radius:4px; margin-left:6px; letter-spacing:0.5px;">NEW</span>`
        : (isYou
          ? `<span style="background:#0080ff; color:#fff; font-size:0.65rem; font-weight:700; padding:2px 6px; border-radius:4px; margin-left:6px; letter-spacing:0.5px;">YOU</span>`
          : '');

      const mono = p.monogram || (p.name ? p.name.replace(/^Dr\.?\s*/i, '').substring(0, 2).toUpperCase() : 'DR');

      return `
        <div class="network-doctor-card ${isNew ? 'network-card-highlighted' : ''}" style="${isNew ? 'border:1.5px solid #10b981; box-shadow:0 4px 14px rgba(16,185,129,0.12);' : ''}">
          <div>
            <div class="network-card-header">
              <div class="network-monogram" style="background:${p.monogramColor || '#0d9488'};">
                ${mono}
              </div>
              <div class="network-doctor-info">
                <h4 class="network-doctor-name">
                  <a href="#profile?id=${p.id}" onclick="event.preventDefault(); window.MedSphereDirectory.spotlightDoctor('${p.id}');">
                    ${p.name}
                  </a>
                  <i class="fa-solid fa-shield-halved" style="color:#0080ff; font-size:0.8rem;" title="Verified Physician"></i>
                  ${badgeHtml}
                </h4>
                <div class="network-doctor-sub" title="${p.specialty} · ${p.organization}">
                  ${p.specialty} · ${p.organization}
                </div>
              </div>
            </div>

            <div class="network-card-tags">
              <span class="network-tag-role">${tag1}</span>
              <span class="network-tag-global">${tag2}</span>
            </div>
          </div>

          <div class="network-card-footer">
            <span class="network-card-joined">${p.joinedText || 'Joined recently'}</span>
            <a href="#profile?id=${p.id}" class="network-card-view-btn" onclick="event.preventDefault(); window.MedSphereDirectory.spotlightDoctor('${p.id}');">
              View profile
            </a>
          </div>
        </div>
      `;
    }).join('');
  },

  // Helper: Content tabs for Spotlight card
  renderSpotlightTabContent(prof) {
    if (this.activeSpotlightTab === 'publications') {
      return `
        <div>
          <div class="spotlight-heading-sm">Peer-Reviewed Publications & Clinical Studies</div>
          <div style="margin-top:0.75rem; display:flex; flex-direction:column; gap:0.65rem;">
            <div style="padding:0.75rem; border-radius:10px; background:#f8fafc; border:1px solid #e2e8f0;">
              <div style="font-weight:700; font-size:0.85rem; color:#0c2340;">1. Transcatheter Aortic Valve Replacement (TAVR) Long-Term Outcomes in Multicenter Registry</div>
              <div style="font-size:0.75rem; color:#64748b; margin-top:2px;">Journal of the American College of Cardiology · 2025 · 420 citations</div>
            </div>
            <div style="padding:0.75rem; border-radius:10px; background:#f8fafc; border:1px solid #e2e8f0;">
              <div style="font-weight:700; font-size:0.85rem; color:#0c2340;">2. AI-Assisted Fractional Flow Reserve (FFR) Angiography for Coronary Microvascular Disease</div>
              <div style="font-size:0.75rem; color:#64748b; margin-top:2px;">New England Journal of Medicine · 2024 · 310 citations</div>
            </div>
          </div>
        </div>
      `;
    }

    if (this.activeSpotlightTab === 'cases') {
      return `
        <div>
          <div class="spotlight-heading-sm">Verified Clinical Cases & Grand Rounds</div>
          <div style="margin-top:0.75rem; display:flex; flex-direction:column; gap:0.65rem;">
            <div style="padding:0.75rem; border-radius:10px; background:#f8fafc; border:1px solid #e2e8f0;">
              <div style="font-weight:700; font-size:0.85rem; color:#0c2340;">Emergency Percutaneous Coronary Intervention in Acute Cardiogenic Shock</div>
              <div style="font-size:0.75rem; color:#64748b; margin-top:2px;">Treated with Impella CP circulatory support · 98% patient recovery rate</div>
            </div>
          </div>
        </div>
      `;
    }

    if (this.activeSpotlightTab === 'cme') {
      return `
        <div>
          <div class="spotlight-heading-sm">Accredited Continuing Medical Education (CME)</div>
          <div style="margin-top:0.75rem; display:flex; flex-direction:column; gap:0.65rem;">
            <div style="padding:0.75rem; border-radius:10px; background:#f8fafc; border:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <div style="font-weight:700; font-size:0.85rem; color:#0c2340;">Complex Structural Heart Masterclass 2026</div>
                <div style="font-size:0.75rem; color:#64748b; margin-top:2px;">Course Director & Lead Faculty</div>
              </div>
              <span style="font-weight:700; color:#0080ff; font-size:0.825rem;">+15 AMA PRA Cat 1</span>
            </div>
          </div>
        </div>
      `;
    }

    // Default 'overview'
    return `
      <div>
        <div class="spotlight-heading-sm">About</div>
        <p class="spotlight-para">
          ${prof.bio || 'Verified specialist doctor on MedSphere with a public profile designed to demonstrate real institutional affiliation, current clinical practice, and continuous professional development without exposing private records.'}
        </p>

        <div class="spotlight-heading-sm">Recent activity</div>
        <div style="margin-top:0.65rem;">
          <div class="spotlight-activity-item">
            <span class="spotlight-activity-dot" style="background:#0080ff;"></span>
            <span><strong>Published</strong> ${prof.specialty} evidence update for frontline teams · 4 days ago · 340 reads</span>
          </div>
          <div class="spotlight-activity-item">
            <span class="spotlight-activity-dot" style="background:#16a34a;"></span>
            <span><strong>Joined CME</strong> Advanced Clinical Updates 2026 · 1 week ago · 5 credits earned</span>
          </div>
          <div class="spotlight-activity-item">
            <span class="spotlight-activity-dot" style="background:#9333ea;"></span>
            <span><strong>Shared</strong> ${prof.specialty} clinical protocol discussion · 2 weeks ago</span>
          </div>
        </div>
      </div>
    `;
  },

  // Convert a raw backend profile (from /api/profiles) into directory card format
  _mapBackendProfile(p) {
    const name = p.full_name || 'Unknown Doctor';
    const cleanName = name.replace(/^Dr\.?\s*/i, '').trim();
    const parts = cleanName.split(/\s+/).filter(Boolean);
    let monogram = 'DR';
    if (parts.length >= 2) monogram = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    else if (parts.length === 1 && parts[0].length >= 2) monogram = parts[0].substring(0, 2).toUpperCase();

    // Exclude admin accounts from directory
    if (p.role === 'admin' || (p.specialty || '').toLowerCase().includes('admin')) return null;

    const expYears = p.experience_years || 0;
    const drName = name.match(/^Dr\.?\s/i) ? name : 'Dr. ' + name;

    return {
      id: p.id,
      name: drName,
      monogram,
      monogramColor: '#0080ff',
      title: p.professional_title || 'Attending Physician',
      profession: 'Doctor',
      specialty: p.specialty || 'General Medicine',
      organization: p.organization || 'MedSphere Health Network',
      location: p.location || 'Global',
      experience: expYears ? (expYears + ' yrs') : 'Joining',
      verified: p.user_verified === 1 || p.user_verified === true,
      isCurrentUser: false,
      rating: 5.0,
      reviewsCount: 1,
      avatar: p.avatar_url || 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
      bio: p.bio || 'Verified healthcare professional on MedSphere.',
      tags: ['Open to roles', 'Global'],
      joinedText: 'Verified Member',
      stats: {
        years: expYears,
        cases: expYears > 5 ? (expYears * 120) + '+' : '100+',
        publications: Math.max(1, Math.floor(expYears / 2)),
        peerRating: '98%'
      },
      verifiedFacts: {
        identity: 'Verified Government ID & License',
        specialty: p.specialty || 'General Medicine',
        board: 'Board Certified Specialist',
        affiliation: p.organization || 'MedSphere Health Network',
        location: (p.location || 'Global') + ' · Verified',
        verifiedDate: 'Active'
      },
      availableFor: ['Consultations', 'Peer Review', 'Clinical Collaboration']
    };
  },

  // Get all professionals: backend real profiles + locally created profiles (session)
  getAllProfessionals() {
    const store = window.MedSphereStore;
    const createdProfs = (store && store.getCreatedProfiles) ? store.getCreatedProfiles() : [];

    // Map cached backend profiles
    const backendMapped = (this._backendProfiles || []).map(p => this._mapBackendProfile(p)).filter(Boolean);

    // Merge: created (from form) first, then backend real accounts
    const merged = [...createdProfs, ...backendMapped];

    const seen = new Set();
    const result = [];
    for (const p of merged) {
      if (p && p.id && !seen.has(p.id)) {
        seen.add(p.id);
        result.push(p);
      }
    }
    return result;
  },

  // Fetch real profiles from /api/profiles and refresh the grid
  async loadRealProfiles() {
    if (this._profilesLoading) return;
    this._profilesLoading = true;
    try {
      let profiles = [];
      if (window.MedSphereAPI && window.MedSphereAPI.getProfiles) {
        profiles = await window.MedSphereAPI.getProfiles({ limit: 100 });
      } else {
        const res = await fetch('/api/profiles?limit=100');
        profiles = await res.json();
      }
      if (Array.isArray(profiles)) {
        this._backendProfiles = profiles;
        // Refresh hero count
        const allList = this.getAllProfessionals();
        const heroCount = document.getElementById('network-hero-count');
        if (heroCount) heroCount.textContent = allList.length;
        // If grid is visible, refresh it
        const grid = document.getElementById('network-doctors-grid');
        if (grid) {
          this.updateGridAndMeta();
          // Set first real profile as spotlight if not set
          if (!this.activeSpotlightId && allList.length > 0) {
            this.activeSpotlightId = allList[0].id;
            this.spotlightDoctor(allList[0].id);
          }
        }
      }
    } catch (e) {
      console.warn('MedSphereDirectory: failed to load profiles from API', e);
    } finally {
      this._profilesLoading = false;
    }
  },

  // Interactive Filter Handlers
  getFilteredProfessionals() {
    let list = this.getAllProfessionals();

    // Filter by Specialty
    if (this.activeSpecialty !== 'all') {
      if (this.activeSpecialty === 'Others') {
        const majorSpecs = ['Cardiology', 'Anatomical Pathology', 'Anesthesiology', 'Internal Medicine', 'Emergency Medicine', 'Surgical Oncology', 'Pediatrics', 'Neurology', 'Critical Care'];
        list = list.filter(p => !majorSpecs.some(s => (p.specialty || '').toLowerCase().includes(s.toLowerCase())));
      } else {
        list = list.filter(p => (p.specialty || '').toLowerCase().includes(this.activeSpecialty.toLowerCase()));
      }
    }

    // Filter by Search Query
    if (this.activeSearchQuery.trim()) {
      const q = this.activeSearchQuery.trim().toLowerCase();
      list = list.filter(p => {
        const str = `${p.name || ''} ${p.title || ''} ${p.specialty || ''} ${p.organization || ''} ${p.location || ''}`.toLowerCase();
        return str.includes(q);
      });
    }

    // Filter by Location
    if (this.activeLocation !== 'all') {
      list = list.filter(p => (p.location || '').toLowerCase().includes(this.activeLocation.toLowerCase()));
    }

    // Filter by Availability
    if (this.activeAvailability !== 'all') {
      list = list.filter(p => (p.tags || []).some(t => t.toLowerCase().includes(this.activeAvailability.toLowerCase())));
    }

    // Sorting
    if (this.activeSort === 'rating') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (this.activeSort === 'experience') {
      list.sort((a, b) => parseInt(b.experience || 0) - parseInt(a.experience || 0));
    }

    return list;
  },

  handleSpecialtyPillClick(specialtyId) {
    this.activeSpecialty = specialtyId;
    const select = document.getElementById('network-spec-select');
    if (select) select.value = specialtyId;
    this.updateGridAndMeta();
    this.updatePillsUI();
  },

  handleSpecialtySelect(specialty) {
    this.activeSpecialty = specialty;
    this.updateGridAndMeta();
    this.updatePillsUI();
  },

  handleSearchInput(query) {
    this.activeSearchQuery = query;
    this.updateGridAndMeta();
  },

  handleLocationSelect(location) {
    this.activeLocation = location;
    this.updateGridAndMeta();
  },

  handleAvailabilitySelect(availability) {
    this.activeAvailability = availability;
    this.updateGridAndMeta();
  },

  handleSortChange(sortBy) {
    this.activeSort = sortBy;
    this.updateGridAndMeta();
  },

  resetFilters() {
    this.activeSpecialty = 'all';
    this.activeSearchQuery = '';
    this.activeLocation = 'all';
    this.activeAvailability = 'all';

    const searchInput = document.getElementById('network-search-input');
    if (searchInput) searchInput.value = '';

    const specSelect = document.getElementById('network-spec-select');
    if (specSelect) specSelect.value = 'all';

    const locSelect = document.getElementById('network-loc-select');
    if (locSelect) locSelect.value = 'all';

    const availSelect = document.getElementById('network-avail-select');
    if (availSelect) availSelect.value = 'all';

    this.updatePillsUI();
    this.updateGridAndMeta();
    window.MedSphereToast.show('Filters Reset', 'Showing all verified healthcare doctors.', 'info');
  },

  updatePillsUI() {
    const pills = document.querySelectorAll('.network-spec-pill');
    pills.forEach(pill => {
      const match = pill.textContent.trim().toLowerCase() === this.activeSpecialty.toLowerCase() ||
                    (this.activeSpecialty === 'Critical Care / ICU' && pill.textContent.trim().toLowerCase() === 'critical care');
      pill.classList.toggle('active', match);
    });
  },

  updateGridAndMeta() {
    const list = this.getFilteredProfessionals();
    const gridEl = document.getElementById('network-doctors-grid');
    if (gridEl) {
      gridEl.innerHTML = this.renderDoctorCards(list);
    }
    const countEl = document.getElementById('network-count-num');
    if (countEl) {
      countEl.textContent = list.length;
    }
    const heroCount = document.getElementById('network-hero-count');
    if (heroCount) {
      heroCount.textContent = list.length;
    }
  },

  spotlightDoctor(profId) {
    this.activeSpotlightId = profId;
    const spotlightSection = document.getElementById('profile-spotlight');
    if (spotlightSection) {
      const allProfs = this.getAllProfessionals();
      const prof = allProfs.find(p => p.id === profId) || allProfs[0] || (window.MEDSPHERE_DATA && window.MEDSPHERE_DATA.professionals && window.MEDSPHERE_DATA.professionals[0]);
      if (!prof) return;
      
      // Update spotlight main card
      const mainCard = spotlightSection.querySelector('.spotlight-main-card');
      if (mainCard) {
        mainCard.innerHTML = `
          <!-- Doctor Header -->
          <div class="spotlight-header-row">
            <div class="spotlight-avatar-lg" style="background:${prof.monogramColor || '#0d9488'};">
              ${prof.monogram || 'DR'}
            </div>
            <div style="flex:1;">
              <h3 class="spotlight-doctor-name">
                <span>${prof.name}</span>
                <i class="fa-solid fa-shield-halved" style="color:#0080ff; font-size:1.05rem;" title="Identity & License Verified"></i>
              </h3>
              <div class="spotlight-doctor-sub">
                ${prof.title} · ${prof.organization}
              </div>
              <div class="spotlight-badges-row">
                <span class="network-tag-role">${prof.tags?.[0] || 'Open to roles'}</span>
                <span class="network-tag-global">Speaks English, Spanish</span>
                <span class="network-card-joined" style="margin-left:auto;">${prof.joinedText || 'Joined recently'}</span>
              </div>
            </div>
          </div>

          <!-- 4 Metrics Stats Row -->
          <div class="spotlight-stats-row">
            <div class="spotlight-stat-item">
              <span class="spotlight-stat-num">${prof.stats?.years || prof.experience?.replace(/\D/g,'') || '10'}</span>
              <span class="spotlight-stat-lbl">years' practice</span>
            </div>
            <div class="spotlight-stat-item">
              <span class="spotlight-stat-num">${prof.stats?.cases || '1,200+'}</span>
              <span class="spotlight-stat-lbl">cases</span>
            </div>
            <div class="spotlight-stat-item">
              <span class="spotlight-stat-num">${prof.stats?.publications || '14'}</span>
              <span class="spotlight-stat-lbl">publications</span>
            </div>
            <div class="spotlight-stat-item">
              <span class="spotlight-stat-num">${prof.stats?.peerRating || '97%'}</span>
              <span class="spotlight-stat-lbl">peer rating</span>
            </div>
          </div>

          <!-- Tabs Row -->
          <div class="spotlight-tabs-row">
            <button type="button" class="spotlight-tab-btn ${this.activeSpotlightTab === 'overview' ? 'active' : ''}" onclick="window.MedSphereDirectory.switchSpotlightTab('overview')">
              Overview
            </button>
            <button type="button" class="spotlight-tab-btn ${this.activeSpotlightTab === 'publications' ? 'active' : ''}" onclick="window.MedSphereDirectory.switchSpotlightTab('publications')">
              Publications
            </button>
            <button type="button" class="spotlight-tab-btn ${this.activeSpotlightTab === 'cases' ? 'active' : ''}" onclick="window.MedSphereDirectory.switchSpotlightTab('cases')">
              Cases
            </button>
            <button type="button" class="spotlight-tab-btn ${this.activeSpotlightTab === 'cme' ? 'active' : ''}" onclick="window.MedSphereDirectory.switchSpotlightTab('cme')">
              CME
            </button>
          </div>

          <!-- Tab Content -->
          <div id="spotlight-tab-content">
            ${this.renderSpotlightTabContent(prof)}
          </div>
        `;
      }

      // Update Facts & Connect cards
      const factsCard = spotlightSection.querySelector('.spotlight-facts-card');
      if (factsCard) {
        factsCard.innerHTML = `
          <div class="spotlight-facts-title">Verified facts</div>
          <div class="spotlight-facts-table">
            <div class="spotlight-facts-row">
              <span class="spotlight-fact-key">Identity</span>
              <span class="spotlight-fact-val" style="color:#16a34a;"><i class="fa-solid fa-circle-check" style="font-size:11px; margin-right:4px;"></i>${prof.verifiedFacts?.identity || 'Government ID matched'}</span>
            </div>
            <div class="spotlight-facts-row">
              <span class="spotlight-fact-key">Specialty</span>
              <span class="spotlight-fact-val">${prof.verifiedFacts?.specialty || prof.specialty}</span>
            </div>
            <div class="spotlight-facts-row">
              <span class="spotlight-fact-key">Board</span>
              <span class="spotlight-fact-val">${prof.verifiedFacts?.board || 'Board Certified'}</span>
            </div>
            <div class="spotlight-facts-row">
              <span class="spotlight-fact-key">Affiliation</span>
              <span class="spotlight-fact-val">${prof.organization}</span>
            </div>
            <div class="spotlight-facts-row">
              <span class="spotlight-fact-key">Location</span>
              <span class="spotlight-fact-val">${prof.location} · Global</span>
            </div>
          </div>
          <div class="spotlight-facts-foot">
            Verified by MedSphere on ${prof.verifiedFacts?.verifiedDate || 'Jan 15, 2026'}
          </div>
        `;
      }

      const connectCard = spotlightSection.querySelector('.spotlight-connect-card');
      if (connectCard) {
        connectCard.innerHTML = `
          <div class="spotlight-connect-title">Connect with ${prof.name.split(',')[0]}</div>
          <div class="spotlight-connect-desc">
            Send a message, share an article, or request a peer review - all through your verified MedSphere profile.
          </div>
          <div class="spotlight-connect-actions">
            <button type="button" class="spotlight-btn-connect" onclick="window.MedSphereModals.open('modal-connect', { id: '${prof.id}', name: '${prof.name}', title: '${prof.title}', organization: '${prof.organization}', avatar: '${prof.avatar}' })">
              ${window.MedSphereStore.isLoggedIn() ? 'Message Colleague' : 'Create account to connect'}
            </button>
            <a href="#profile?id=${prof.id}" class="spotlight-btn-profile">
              View Full Profile
            </a>
          </div>
        `;
      }

      spotlightSection.scrollIntoView({ behavior: 'smooth' });
    }
  },

  switchSpotlightTab(tabName) {
    this.activeSpotlightTab = tabName;
    const tabBtns = document.querySelectorAll('.spotlight-tab-btn');
    tabBtns.forEach(btn => {
      btn.classList.toggle('active', btn.textContent.trim().toLowerCase() === tabName.toLowerCase());
    });
    // Use the live list instead of the now-empty data.professionals
    const allProfs = this.getAllProfessionals();
    const prof = allProfs.find(p => p.id === this.activeSpotlightId) || allProfs[0] || {};
    const container = document.getElementById('spotlight-tab-content');
    if (container) {
      container.innerHTML = this.renderSpotlightTabContent(prof);
    }
  },

  handleLoadMore() {
    this.visibleCount += 8;
    this.updateGridAndMeta();
    window.MedSphereToast.show('Profiles Loaded', 'Additional verified clinical profiles displayed.', 'info');
  },

  // 2. DocTak-Style Clinical Profile View (MedSphere Theme)
  activeProfileTab: 'about',

  switchProfileTab(tabName) {
    this.activeProfileTab = tabName;
    document.querySelectorAll('.doctak-nav-tab').forEach(tab => {
      if (tab.dataset.tab === tabName) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    const panes = document.querySelectorAll('.doctak-tab-pane');
    panes.forEach(pane => {
      if (pane.id === `tab-pane-${tabName}`) {
        pane.style.display = 'block';
      } else {
        pane.style.display = 'none';
      }
    });

    // Smooth scroll to content
    const container = document.querySelector('.doctak-center-panes');
    if (container) {
      container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  },

  handleAvatarUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      const avatarImg = document.querySelector('.doctak-avatar-img');
      if (avatarImg) avatarImg.src = base64;
      if (window.MedSphereStore) {
        window.MedSphereStore.updateCurrentUser({ avatar: base64 });
      }
      window.MedSphereToast.show('Avatar Updated', 'Profile photo successfully changed.', 'success');
    };
    reader.readAsDataURL(file);
  },

  handleCoverUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      const coverImg = document.querySelector('.doctak-cover-banner img');
      if (coverImg) coverImg.src = base64;
      if (window.MedSphereStore) {
        window.MedSphereStore.updateCurrentUser({ cover: base64 });
      }
      window.MedSphereToast.show('Cover Photo Updated', 'Profile banner successfully changed.', 'success');
    };
    reader.readAsDataURL(file);
  },

  // DocTak-Style Inline Details & About Editing
  inlineEditingFields: {},
  isEditingAllDetails: false,

  escapeAttr(str = '') {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  },

  getCurrentProfile() {
    const data = window.MEDSPHERE_DATA;
    const store = window.MedSphereStore;
    return (store && store.getState().currentUser) || data.currentUser;
  },

  getProfileDetailsDefinition(customProf) {
    const p = customProf || this.getCurrentProfile();
    const city = p.city || (p.location ? p.location.split(',')[0].trim() : '');
    const state = p.state || (p.location && p.location.split(',')[1] ? p.location.split(',')[1].trim() : '');
    const emailVal = p.contact?.email || p.email || '';
    const phoneVal = p.contact?.phone || p.phone || '';
    const officeVal = p.contact?.office || p.address || '';
    const collegeVal = (p.education && p.education[0]?.institution) || p.college || '';
    const licenseVal = p.license || (p.npi ? 'MA #' + p.npi.slice(0, 6) : '');

    return [
      { key: 'title', label: 'TITLE', val: p.title || '', display: p.title || 'Not added', empty: !p.title },
      { key: 'email', label: 'EMAIL', val: emailVal, display: emailVal || 'Not added', empty: !emailVal },
      { key: 'phone', label: 'PHONE', val: phoneVal, display: phoneVal || 'Phone not added', empty: !phoneVal },
      { key: 'gender', label: 'GENDER', val: p.gender || '', display: p.gender || 'Not added', empty: !p.gender },
      { key: 'license', label: 'LICENSE', val: licenseVal, display: licenseVal || 'Not added', empty: !licenseVal },
      { key: 'clinic', label: 'CLINIC', val: p.organization || '', display: p.organization || 'Not added', empty: !p.organization },
      { key: 'college', label: 'COLLEGE', val: collegeVal, display: collegeVal || 'Not added', empty: !collegeVal },
      { key: 'city', label: 'CITY', val: city, display: city || 'Not added', empty: !city },
      { key: 'state', label: 'STATE', val: state, display: state || 'Not added', empty: !state },
      { key: 'country', label: 'COUNTRY', val: p.country || 'United States', display: p.country || 'United States', empty: false },
      { key: 'address', label: 'ADDRESS', val: officeVal, display: officeVal || 'Not added', empty: !officeVal },
      { key: 'languages', label: 'LANGUAGES', val: p.languages || 'English, Spanish', display: p.languages || 'English, Spanish', empty: false },
      { key: 'birthplace', label: 'BIRTHPLACE', val: p.birthplace || '', display: p.birthplace || 'Not added', empty: !p.birthplace },
      { key: 'livesIn', label: 'LIVES IN', val: p.location || '', display: p.location || 'Not added', empty: !p.location }
    ];
  },

  renderDetailRowInner(field, isEditing = false) {
    if (isEditing) {
      return `
        <div class="doctak-inline-edit-wrap">
          <label class="doctak-detail-key">${field.label}</label>
          <input type="text" class="doctak-inline-input" id="doctak-input-${field.key}" value="${this.escapeAttr(field.val)}" 
                 onkeydown="if(event.key==='Enter') window.MedSphereDirectory.saveInlineField('${field.key}'); if(event.key==='Escape') window.MedSphereDirectory.cancelInlineField('${field.key}');" />
          <div class="doctak-inline-actions">
            <button type="button" class="btn-doctak-save" onclick="window.MedSphereDirectory.saveInlineField('${field.key}')">Save</button>
            <button type="button" class="btn-doctak-cancel" onclick="window.MedSphereDirectory.cancelInlineField('${field.key}')">Cancel</button>
          </div>
        </div>
      `;
    }
    return `
      <span class="doctak-detail-key">${field.label}</span>
      <div class="doctak-detail-val-wrap">
        <span class="doctak-detail-val ${field.empty ? 'empty' : ''}" title="${this.escapeAttr(field.display)}">${field.display}</span>
        <i class="fa-solid fa-pen doctak-detail-edit-icon" onclick="window.MedSphereDirectory.startInlineEdit('${field.key}')" title="Edit ${field.label}"></i>
      </div>
    `;
  },

  startInlineEdit(key) {
    this.inlineEditingFields[key] = true;
    const rowEl = document.getElementById('doctak-row-' + key);
    if (!rowEl) return;
    const defs = this.getProfileDetailsDefinition();
    const field = defs.find(f => f.key === key);
    if (!field) return;

    rowEl.classList.add('is-editing');
    rowEl.innerHTML = this.renderDetailRowInner(field, true);
    const input = document.getElementById('doctak-input-' + key);
    if (input) {
      input.focus();
      input.select();
    }
  },

  cancelInlineField(key) {
    delete this.inlineEditingFields[key];
    const rowEl = document.getElementById('doctak-row-' + key);
    if (!rowEl) return;
    const defs = this.getProfileDetailsDefinition();
    const field = defs.find(f => f.key === key);
    if (!field) return;

    rowEl.classList.remove('is-editing');
    rowEl.innerHTML = this.renderDetailRowInner(field, false);
  },

  saveInlineField(key) {
    const input = document.getElementById('doctak-input-' + key);
    const val = input ? input.value.trim() : '';
    const store = window.MedSphereStore;
    const curUser = this.getCurrentProfile();
    let patch = {};

    if (key === 'email') {
      patch = { email: val, contact: { ...(curUser.contact || {}), email: val } };
      const leftEmail = document.querySelectorAll('.doctak-contact-val')[0];
      if (leftEmail) leftEmail.innerText = val || 'Not added';
    } else if (key === 'phone') {
      patch = { phone: val, contact: { ...(curUser.contact || {}), phone: val } };
      const leftPhone = document.querySelectorAll('.doctak-contact-val')[1];
      if (leftPhone) leftPhone.innerText = val || 'Phone not added';
    } else if (key === 'title') {
      patch = { title: val };
      const heroSub = document.querySelector('.doctak-identity-subtitle');
      if (heroSub) heroSub.innerText = val || curUser.specialty || '';
    } else if (key === 'gender') {
      patch = { gender: val };
    } else if (key === 'license') {
      patch = { license: val };
    } else if (key === 'clinic') {
      patch = { organization: val };
    } else if (key === 'college') {
      const existingEdu = (curUser.education && curUser.education.length) ? curUser.education : [{ degree: 'Doctor of Medicine', year: '2016' }];
      patch = { education: [{ ...existingEdu[0], institution: val }, ...existingEdu.slice(1)] };
    } else if (key === 'city') {
      const state = curUser.location && curUser.location.split(',')[1] ? curUser.location.split(',')[1].trim() : 'MA';
      patch = { city: val, location: val ? `${val}, ${state}` : state };
    } else if (key === 'state') {
      const city = curUser.location ? curUser.location.split(',')[0].trim() : 'Boston';
      patch = { state: val, location: val ? `${city}, ${val}` : city };
    } else if (key === 'country') {
      patch = { country: val };
    } else if (key === 'address') {
      patch = { address: val, contact: { ...(curUser.contact || {}), office: val } };
    } else if (key === 'languages') {
      patch = { languages: val };
    } else if (key === 'birthplace') {
      patch = { birthplace: val };
    } else if (key === 'livesIn') {
      patch = { location: val };
    }

    if (store && store.updateCurrentUser) {
      store.updateCurrentUser(patch);
    }
    if (window.MEDSPHERE_DATA && window.MEDSPHERE_DATA.currentUser) {
      Object.assign(window.MEDSPHERE_DATA.currentUser, patch);
    }

    delete this.inlineEditingFields[key];

    const rowEl = document.getElementById('doctak-row-' + key);
    if (rowEl) {
      const defs = this.getProfileDetailsDefinition();
      const updatedField = defs.find(f => f.key === key);
      rowEl.classList.remove('is-editing');
      if (updatedField) {
        rowEl.innerHTML = this.renderDetailRowInner(updatedField, false);
      }
    }

    window.MedSphereToast.show('Saved', 'Profile detail updated successfully.', 'success');
  },

  toggleEditAll() {
    if (window.MedSphereModals) {
      window.MedSphereModals.open('modal-edit-profile');
    }
  },

  startInlineAbout() {
    const content = document.getElementById('doctak-about-content');
    if (!content) return;
    const curUser = this.getCurrentProfile();
    content.innerHTML = `
      <div class="doctak-inline-edit-wrap">
        <textarea class="doctak-inline-input doctak-inline-textarea" id="doctak-input-about" rows="3" placeholder="Add a professional summary for your profile...">${this.escapeAttr(curUser.bio || '')}</textarea>
        <div class="doctak-inline-actions">
          <button type="button" class="btn-doctak-save" onclick="window.MedSphereDirectory.saveInlineAbout()">Save</button>
          <button type="button" class="btn-doctak-cancel" onclick="window.MedSphereDirectory.cancelInlineAbout()">Cancel</button>
        </div>
      </div>
    `;
    const textarea = document.getElementById('doctak-input-about');
    if (textarea) {
      textarea.focus();
    }
  },

  cancelInlineAbout() {
    const content = document.getElementById('doctak-about-content');
    if (!content) return;
    const curUser = this.getCurrentProfile();
    content.innerHTML = `
      <p class="doctak-about-body">
        ${curUser.bio || 'Add a professional summary for your profile.'}
      </p>
    `;
  },

  saveInlineAbout() {
    const textarea = document.getElementById('doctak-input-about');
    const val = textarea ? textarea.value.trim() : '';
    const store = window.MedSphereStore;
    if (store && store.updateCurrentUser) {
      store.updateCurrentUser({ bio: val });
    }
    if (window.MEDSPHERE_DATA && window.MEDSPHERE_DATA.currentUser) {
      window.MEDSPHERE_DATA.currentUser.bio = val;
    }
    const content = document.getElementById('doctak-about-content');
    if (content) {
      content.innerHTML = `
        <p class="doctak-about-body">
          ${val || 'Add a professional summary for your profile.'}
        </p>
      `;
    }
    const badge = document.getElementById('doctak-about-badge');
    if (badge) {
      badge.innerText = val ? '100%' : '0%';
    }
    window.MedSphereToast.show('Saved', 'Professional summary updated.', 'success');
  },

  toggleFocusInput(forceShow) {
    const wrap = document.getElementById('doctak-focus-input-wrap');
    if (!wrap) return;
    const shouldShow = forceShow !== undefined ? forceShow : wrap.style.display === 'none';
    wrap.style.display = shouldShow ? 'block' : 'none';
    if (shouldShow) {
      const inp = document.getElementById('doctak-focus-new-input');
      if (inp) {
        inp.value = '';
        setTimeout(() => inp.focus(), 60);
      }
    }
  },

  saveNewFocusArea() {
    const inp = document.getElementById('doctak-focus-new-input');
    if (!inp) return;
    const val = inp.value.trim();
    if (!val) return;

    const curUser = this.getCurrentProfile();
    const existing = curUser.specialties || curUser.focusAreas || [
      curUser.specialty || 'Anatomical Pathology',
      'Clinical Pathology',
      'Histopathology',
      'Diagnostic Cytopathology',
      'Molecular Genetics',
      'Autopsy & Forensic Pathology'
    ];

    if (existing.map(s => s.toLowerCase()).includes(val.toLowerCase())) {
      window.MedSphereToast.show('Already Added', 'This focus area is already in your profile.', 'info');
      this.toggleFocusInput(false);
      return;
    }

    const updated = [...existing, val];
    curUser.specialties = updated;
    curUser.focusAreas = updated;

    if (window.MedSphereStore) {
      window.MedSphereStore.updateCurrentUser({ specialties: updated, focusAreas: updated });
    }
    if (window.MedSphereAPI && window.MedSphereAPI.updateProfile) {
      window.MedSphereAPI.updateProfile({ specialties: updated }).catch(() => {});
    }

    this.renderFocusTags(updated);
    this.toggleFocusInput(false);
    window.MedSphereToast.show('Focus Area Added', `"${val}" added to your clinical focus areas.`, 'success');
  },

  removeFocusArea(tag) {
    const curUser = this.getCurrentProfile();
    const existing = curUser.specialties || curUser.focusAreas || [];
    const updated = existing.filter(t => t.toLowerCase() !== tag.toLowerCase());
    curUser.specialties = updated;
    curUser.focusAreas = updated;

    if (window.MedSphereStore) {
      window.MedSphereStore.updateCurrentUser({ specialties: updated, focusAreas: updated });
    }
    if (window.MedSphereAPI && window.MedSphereAPI.updateProfile) {
      window.MedSphereAPI.updateProfile({ specialties: updated }).catch(() => {});
    }

    this.renderFocusTags(updated);
    window.MedSphereToast.show('Focus Area Removed', `"${tag}" removed.`, 'info');
  },

  renderFocusTags(list) {
    const container = document.getElementById('doctak-focus-tags-list');
    if (!container) return;
    container.innerHTML = (list || []).map(tag => `
      <span class="doctak-focus-tag">
        ${this.escapeAttr(tag)}
        <i class="fa-solid fa-xmark doctak-focus-tag-del" onclick="event.stopPropagation(); window.MedSphereDirectory.removeFocusArea('${this.escapeAttr(tag)}')" title="Remove"></i>
      </span>
    `).join('');
  },

  isPreviewMode: false,

  togglePreviewMode() {
    this.isPreviewMode = !this.isPreviewMode;
    const wrap = document.querySelector('.doctak-profile-wrap');
    if (!wrap) return;

    if (this.isPreviewMode) {
      wrap.classList.add('is-preview-mode');
      let bar = document.getElementById('doctak-preview-bar');
      if (!bar) {
        bar = document.createElement('div');
        bar.id = 'doctak-preview-bar';
        bar.style.cssText = 'position:sticky; top:68px; z-index:900; background:linear-gradient(135deg, #0c2340 0%, #1e40af 100%); color:#fff; padding:0.65rem 1.25rem; display:flex; justify-content:space-between; align-items:center; font-size:0.88rem; box-shadow:0 4px 12px rgba(0,0,0,0.15);';
        bar.innerHTML = `
          <div style="display:flex; align-items:center; gap:8px;">
            <i class="fa-solid fa-eye" style="color:#60a5fa;"></i>
            <span><strong>Public Preview Mode:</strong> This is how your verified profile appears to colleagues, hospital recruiters, and patients.</span>
          </div>
          <button type="button" onclick="window.MedSphereDirectory.togglePreviewMode()" style="background:#fff; color:#0c2340; border:none; padding:4px 14px; border-radius:6px; font-weight:700; font-size:0.8rem; cursor:pointer;">Exit Preview</button>
        `;
        wrap.prepend(bar);
      } else {
        bar.style.display = 'flex';
      }
      window.MedSphereToast.show('Preview Active', 'Viewing profile in public preview mode.', 'info');
    } else {
      wrap.classList.remove('is-preview-mode');
      const bar = document.getElementById('doctak-preview-bar');
      if (bar) bar.style.display = 'none';
      window.MedSphereToast.show('Preview Exited', 'Returned to editable profile mode.', 'info');
    }
  },

  copyOrMail(email) {
    if (!email || email === 'Not added') return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email);
      window.MedSphereToast.show('Email Copied', email, 'success');
    }
  },

  copyOrCall(phone) {
    if (!phone || phone === 'Phone not added') return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(phone);
      window.MedSphereToast.show('Phone Copied', phone, 'success');
    }
  },

  copyProfileLink(id) {
    const url = window.location.origin + window.location.pathname + '#profile' + (id ? '?id=' + id : '');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        window.MedSphereToast.show('Link Copied', 'Profile link copied to clipboard.', 'success');
      }).catch(() => {
        window.MedSphereToast.show('Profile Link', url, 'info');
      });
    } else {
      window.MedSphereToast.show('Profile Link', url, 'info');
    }
  },

  shareProfile(id, name) {
    const url = window.location.origin + window.location.pathname + '#profile' + (id ? '?id=' + id : '');
    if (navigator.share) {
      navigator.share({
        title: (name || 'Doctor') + ' — MedSphere Clinical Profile',
        text: 'View verified clinical profile and medical credentials on MedSphere.',
        url: url
      }).catch(() => {});
    } else {
      this.copyProfileLink(id);
    }
  },

  renderProfile(params = {}) {
    const data = window.MEDSPHERE_DATA;
    const store = window.MedSphereStore;
    const curUser = store.getState().currentUser || data.currentUser;
    const profId = params.id;
    
    // Find professional in live list (real backend accounts + created profiles)
    let prof;
    if (profId && profId !== curUser.id) {
      const allProfs = this.getAllProfessionals();
      prof = allProfs.find(p => p.id === profId) || curUser;
    } else {
      prof = curUser;
    }

    const contactEmail = prof.contact?.email || prof.email || 'expertdeveloper091@gmail.com';
    const contactPhone = prof.contact?.phone || 'Phone not added';
    const userSlug = (prof.name || 'doctor').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const focusAreas = prof.specialties || prof.focusAreas || [
      prof.specialty || 'Anatomical Pathology',
      'Clinical Pathology',
      'Histopathology',
      'Diagnostic Cytopathology',
      'Molecular Genetics',
      'Autopsy & Forensic Pathology'
    ];

    const basicChecks = [prof.name, prof.contact?.email || prof.email, prof.contact?.phone || prof.phone, prof.location].filter(Boolean).length;
    const basicScore = Math.min(100, Math.round((basicChecks / 4) * 100));

    const profChecks = [prof.title || prof.specialty, prof.organization, prof.license].filter(Boolean).length;
    const profScore = Math.min(100, Math.round((profChecks / 3) * 100));

    const aboutScore = (prof.bio && prof.bio.trim().length > 5) ? 100 : 0;

    const photoChecks = [prof.avatar, prof.cover].filter(Boolean).length;
    const photoScore = Math.min(100, Math.round((photoChecks / 2) * 100));

    const socialScore = (prof.social && Object.keys(prof.social).length > 0) ? 100 : (prof.website ? 80 : 50);

    const skillScore = (focusAreas && focusAreas.length >= 3) ? 100 : Math.round((focusAreas.length / 3) * 100);

    const strengthPercent = Math.min(100, Math.max(10, Math.round((basicScore + profScore + aboutScore + photoScore + socialScore + skillScore) / 6)));
    const circumference = 251.2;
    const strokeDashoffset = (circumference * (1 - strengthPercent / 100)).toFixed(1);

    const expCount = (prof.experience && prof.experience.length) || 0;
    const eduCount = (prof.education && prof.education.length) || 0;
    const certCount = (prof.certifications && prof.certifications.length) || 0;

    const city = prof.city || (prof.location ? prof.location.split(',')[0].trim() : 'Boston');
    const state = prof.state || (prof.location && prof.location.split(',')[1] ? prof.location.split(',')[1].trim() : 'MA');

    return `
      <div class="doctak-profile-wrap">
        <div class="doctak-profile-container">
          
          <!-- Hidden File Inputs for Banner & Avatar Uploads -->
          <input type="file" id="doctak-cover-input" style="display:none;" accept="image/*" onchange="window.MedSphereDirectory.handleCoverUpload(event)">
          <input type="file" id="doctak-avatar-input" style="display:none;" accept="image/*" onchange="window.MedSphereDirectory.handleAvatarUpload(event)">

          <!-- 1. Hero Card (Banner, Avatar, Name, Actions, Stats) -->
          <div class="doctak-hero-card">
            <!-- Cover Banner -->
            <div class="doctak-cover-banner">
              <img src="${prof.cover || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1400&q=80'}" alt="Clinical Cover Banner">
              <button type="button" class="doctak-cover-cam-btn" title="Change Cover Photo" onclick="document.getElementById('doctak-cover-input').click()">
                <i class="fa-solid fa-camera"></i>
              </button>
            </div>

            <!-- Hero Body with Avatar and Action Row -->
            <div class="doctak-hero-body">
              <div class="doctak-avatar-row">
                <div class="doctak-avatar-wrap">
                  <img src="${prof.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80'}" alt="${prof.name}" class="doctak-avatar-img">
                  <button type="button" class="doctak-avatar-cam-btn" title="Change Profile Picture" onclick="document.getElementById('doctak-avatar-input').click()">
                    <i class="fa-solid fa-camera"></i>
                  </button>
                </div>

                <div class="doctak-hero-actions">
                  <button type="button" class="doctak-btn-preview" onclick="window.MedSphereDirectory.togglePreviewMode()">
                    <i class="fa-regular fa-eye"></i> Preview
                  </button>
                  <button type="button" class="doctak-btn-edit" onclick="window.MedSphereModals.open('modal-edit-profile')">
                    <i class="fa-solid fa-pen-to-square"></i> Edit profile
                  </button>
                </div>
              </div>

              <!-- Doctor Identity -->
              <div class="doctak-identity-info">
                <h1 class="doctak-identity-name">
                  ${prof.name || 'Dr Anees'}
                  <span class="doctak-verified-pill">
                    <i class="fa-solid fa-circle-check"></i> Verified License
                  </span>
                </h1>
                <p class="doctak-identity-subtitle">
                  ${prof.specialty || prof.title || 'Anatomical Pathology'}
                </p>
              </div>

              <!-- 6 Stats Strip -->
              <div class="doctak-stats-strip">
                <div class="doctak-stat-item" onclick="window.MedSphereDirectory.switchProfileTab('social')" style="cursor:pointer;" title="View Verified Peer Connections">
                  <span class="doctak-stat-val">${prof.connectionsCount || 12}</span>
                  <span class="doctak-stat-lbl">Connections</span>
                </div>
                <div class="doctak-stat-item" onclick="window.MedSphereDirectory.switchProfileTab('statistics')" style="cursor:pointer;" title="View Reach & Followers">
                  <span class="doctak-stat-val">24</span>
                  <span class="doctak-stat-lbl">Followers</span>
                </div>
                <div class="doctak-stat-item" onclick="window.MedSphereDirectory.switchProfileTab('social')" style="cursor:pointer;" title="View Following">
                  <span class="doctak-stat-val">18</span>
                  <span class="doctak-stat-lbl">Following</span>
                </div>
                <div class="doctak-stat-item" onclick="window.MedSphereDirectory.switchProfileTab('posts')" style="cursor:pointer;" title="View Clinical Posts">
                  <span class="doctak-stat-val">4</span>
                  <span class="doctak-stat-lbl">Posts</span>
                </div>
                <div class="doctak-stat-item" onclick="window.MedSphereDirectory.switchProfileTab('statistics')" style="cursor:pointer;" title="View Profile Impressions">
                  <span class="doctak-stat-val">128</span>
                  <span class="doctak-stat-lbl">Profile Views</span>
                </div>
                <div class="doctak-stat-item" onclick="window.MedSphereDirectory.switchProfileTab('research')" style="cursor:pointer;" title="View Research Publications">
                  <span class="doctak-stat-val">1</span>
                  <span class="doctak-stat-lbl">Publications</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. Horizontal Nav Tab Strip -->
          <div class="doctak-nav-strip">
            <button type="button" class="doctak-nav-tab active" data-tab="about" onclick="window.MedSphereDirectory.switchProfileTab('about')">
              <i class="fa-regular fa-user"></i> About
            </button>
            <button type="button" class="doctak-nav-tab" data-tab="statistics" onclick="window.MedSphereDirectory.switchProfileTab('statistics')">
              <i class="fa-solid fa-chart-column"></i> Statistics
            </button>
            <button type="button" class="doctak-nav-tab" data-tab="experience" onclick="window.MedSphereDirectory.switchProfileTab('experience')">
              <i class="fa-solid fa-briefcase"></i> Experience
            </button>
            <button type="button" class="doctak-nav-tab" data-tab="education" onclick="window.MedSphereDirectory.switchProfileTab('education')">
              <i class="fa-solid fa-graduation-cap"></i> Education
            </button>
            <button type="button" class="doctak-nav-tab" data-tab="portfolio" onclick="window.MedSphereDirectory.switchProfileTab('portfolio')">
              <i class="fa-regular fa-folder"></i> Portfolio
            </button>
            <button type="button" class="doctak-nav-tab" data-tab="research" onclick="window.MedSphereDirectory.switchProfileTab('research')">
              <i class="fa-solid fa-microscope"></i> Research
            </button>
            <button type="button" class="doctak-nav-tab" data-tab="availability" onclick="window.MedSphereDirectory.switchProfileTab('availability')">
              <i class="fa-solid fa-calendar-check"></i> Availability
            </button>
            <button type="button" class="doctak-nav-tab" data-tab="social" onclick="window.MedSphereDirectory.switchProfileTab('social')">
              <i class="fa-solid fa-link"></i> Social
            </button>
            <button type="button" class="doctak-nav-tab" data-tab="posts" onclick="window.MedSphereDirectory.switchProfileTab('posts')">
              <i class="fa-regular fa-newspaper"></i> Posts
            </button>
            <button type="button" class="doctak-nav-tab" data-tab="surveys" onclick="window.MedSphereDirectory.switchProfileTab('surveys')">
              <i class="fa-solid fa-square-poll-vertical"></i> Surveys
            </button>
          </div>

          <!-- 3. 3-Column Profile Grid -->
          <div class="doctak-main-grid">
            
            <!-- LEFT COLUMN (Strength, Contact info, Share profile, Public profile) -->
            <div class="doctak-col-left">
              
              <!-- Card 1: Profile strength -->
              <div class="doctak-card">
                <div class="doctak-card-header">
                  <h3 class="doctak-card-title">Profile strength</h3>
                  <span class="doctak-chip-percent" style="font-weight:700;">${strengthPercent}%</span>
                </div>
                <div class="doctak-strength-gauge-wrap">
                  <svg class="doctak-gauge-circle" viewBox="0 0 100 100">
                    <circle class="doctak-gauge-bg" cx="50" cy="50" r="40"></circle>
                    <circle class="doctak-gauge-fill" cx="50" cy="50" r="40" stroke-dasharray="${circumference}" stroke-dashoffset="${strokeDashoffset}"></circle>
                  </svg>
                  <div class="doctak-gauge-text">${strengthPercent}%</div>
                </div>
                <p class="doctak-strength-text">
                  Keep contact details and credentials current so peers can review your profile quickly.
                </p>
                <button type="button" class="doctak-btn-verify" onclick="window.MedSphereModals.open('modal-verify')">
                  Finish verification
                </button>
              </div>

              <!-- Card 2: Contact info -->
              <div class="doctak-card">
                <h3 class="doctak-card-title" style="margin-bottom:1rem;">Contact info</h3>
                <div class="doctak-contact-row" onclick="window.MedSphereDirectory.copyOrMail('${this.escapeAttr(contactEmail)}')" style="cursor:pointer;" title="Click to copy email">
                  <div class="doctak-icon-box">
                    <i class="fa-regular fa-envelope"></i>
                  </div>
                  <div>
                    <div class="doctak-contact-val" title="${contactEmail}">${contactEmail}</div>
                    <div class="doctak-contact-lbl">Email · click to copy</div>
                  </div>
                </div>
                <div class="doctak-contact-row" onclick="window.MedSphereDirectory.copyOrCall('${this.escapeAttr(contactPhone)}')" style="cursor:pointer;" title="Click to copy phone">
                  <div class="doctak-icon-box">
                    <i class="fa-solid fa-phone"></i>
                  </div>
                  <div>
                    <div class="doctak-contact-val">${contactPhone}</div>
                    <div class="doctak-contact-lbl">Phone · primary</div>
                  </div>
                </div>
              </div>

              <!-- Card 3: Share profile -->
              <div class="doctak-card">
                <h3 class="doctak-card-title" style="margin-bottom:0.4rem;">Share profile</h3>
                <p class="doctak-share-desc">
                  Send your public profile to collaborators, peers, and referral partners.
                </p>
                <div class="doctak-link-pill" onclick="window.MedSphereDirectory.copyProfileLink('${prof.id}')" style="cursor:pointer;" title="Click to copy">
                  <i class="fa-solid fa-link" style="color:var(--slate-400); font-size:12px;"></i>
                  <span>medsphere.health/u/${userSlug}</span>
                </div>
                <div class="doctak-share-btn-group">
                  <button type="button" class="doctak-btn-copy" onclick="window.MedSphereDirectory.copyProfileLink('${prof.id}')">
                    <i class="fa-regular fa-copy" style="margin-right:4px;"></i> Copy link
                  </button>
                  <button type="button" class="doctak-btn-share" onclick="window.MedSphereDirectory.shareProfile('${prof.id}', '${this.escapeAttr(prof.name || 'Doctor')}')">
                    <i class="fa-solid fa-share-nodes" style="margin-right:4px;"></i> Share profile
                  </button>
                </div>
              </div>

              <!-- Card 4: Public profile -->
              <div class="doctak-card">
                <h3 class="doctak-card-title" style="margin-bottom:0.5rem;">Public profile</h3>
                <div class="doctak-public-item" onclick="window.MedSphereDirectory.copyProfileLink('${prof.id}')" style="cursor:pointer;" title="Click to copy profile URL">
                  <div class="doctak-icon-box" style="width:32px; height:32px; font-size:12px;">
                    <i class="fa-regular fa-user" style="color:var(--primary-600);"></i>
                  </div>
                  <div>
                    <strong>Main public link</strong>
                    <a href="#profile?id=${prof.id}" onclick="event.preventDefault(); window.MedSphereDirectory.copyProfileLink('${prof.id}')">https://medsphere.health/u/${userSlug}</a>
                  </div>
                </div>
                <div class="doctak-public-item" onclick="window.MedSphereDirectory.copyProfileLink('${prof.id}')" style="cursor:pointer;" title="Click to copy custom URL">
                  <div class="doctak-icon-box" style="width:32px; height:32px; font-size:12px;">
                    <i class="fa-solid fa-link" style="color:var(--primary-600);"></i>
                  </div>
                  <div>
                    <strong>Custom profile link</strong>
                    <a href="#profile?id=${prof.id}" onclick="event.preventDefault(); window.MedSphereDirectory.copyProfileLink('${prof.id}')">https://medsphere.health/dr/${userSlug}</a>
                  </div>
                </div>
                <div class="doctak-public-item" onclick="window.MedSphereDirectory.startInlineEdit('title')" style="cursor:pointer;" title="Click to edit clinical title">
                  <div class="doctak-icon-box" style="width:32px; height:32px; font-size:12px;">
                    <i class="fa-solid fa-briefcase" style="color:var(--primary-600);"></i>
                  </div>
                  <div>
                    <strong>${prof.specialty || prof.title || 'Anatomical Pathology'}</strong>
                    <span class="loc" style="display:block;">${prof.location || 'Location not added'}</span>
                  </div>
                </div>
              </div>

            </div>

            <!-- CENTER COLUMN (About, Focus areas, Add sections, Detailed Timelines) -->
            <div class="doctak-col-center doctak-center-panes">
              
              <!-- Tab 1: About (Default Overview) -->
              <div class="doctak-tab-pane" id="tab-pane-about" style="display:block;">
                
                <!-- About Summary Card -->
                <div class="doctak-card" id="doctak-card-about">
                  <div class="doctak-card-header">
                    <div style="display:flex; align-items:center; gap:0.5rem;">
                      <h3 class="doctak-card-title">About</h3>
                      <span class="doctak-chip-percent" id="doctak-about-badge">${prof.bio ? '100%' : '0%'}</span>
                    </div>
                    <button type="button" class="doctak-btn-icon-subtle" title="Edit About" onclick="window.MedSphereDirectory.startInlineAbout()">
                      <i class="fa-solid fa-pen"></i>
                    </button>
                  </div>
                  <div id="doctak-about-content">
                    <p class="doctak-about-body">
                      ${prof.bio || 'Add a professional summary for your profile.'}
                    </p>
                  </div>
                </div>

                <!-- Focus areas Card -->
                <div class="doctak-card" id="doctak-card-focus-areas">
                  <div class="doctak-card-header">
                    <h3 class="doctak-card-title">Focus areas</h3>
                    <button type="button" class="doctak-btn-icon-subtle" title="Add Focus Area" onclick="window.MedSphereDirectory.toggleFocusInput()">
                      <i class="fa-solid fa-plus"></i>
                    </button>
                  </div>

                  <!-- Inline Add Focus Area Input -->
                  <div id="doctak-focus-input-wrap" style="display:none; margin-bottom:0.85rem; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:0.65rem 0.75rem;">
                    <div style="display:flex; gap:8px; align-items:center;">
                      <input type="text" id="doctak-focus-new-input" placeholder="Type clinical focus area (e.g. Pediatric Surgery)..." style="flex:1; padding:0.45rem 0.75rem; border:1px solid #cbd5e1; border-radius:6px; font-size:0.85rem; outline:none;" onkeydown="if(event.key==='Enter'){event.preventDefault(); window.MedSphereDirectory.saveNewFocusArea();}">
                      <button type="button" class="btn-doctak-save" onclick="window.MedSphereDirectory.saveNewFocusArea()" style="padding:0.45rem 0.85rem; font-size:0.82rem; background:#003bb3; color:#fff; border:none; border-radius:6px; font-weight:600; cursor:pointer;">Add</button>
                      <button type="button" class="btn-doctak-cancel" onclick="window.MedSphereDirectory.toggleFocusInput(false)" style="padding:0.45rem 0.65rem; font-size:0.82rem; background:transparent; border:none; color:#64748b; cursor:pointer;">Cancel</button>
                    </div>
                  </div>

                  <div class="doctak-focus-tags" id="doctak-focus-tags-list">
                    ${focusAreas.map(tag => `
                      <span class="doctak-focus-tag">
                        ${this.escapeAttr(tag)}
                        <i class="fa-solid fa-xmark doctak-focus-tag-del" onclick="event.stopPropagation(); window.MedSphereDirectory.removeFocusArea('${this.escapeAttr(tag)}')" title="Remove"></i>
                      </span>
                    `).join('')}
                  </div>
                </div>

                <!-- Add profile sections (2x2 Grid) -->
                <div class="doctak-card">
                  <h3 class="doctak-card-title" style="margin-bottom:1rem;">Add profile sections</h3>
                  <div class="doctak-section-grid">
                    
                    <!-- Tile 1: Experience -->
                    <div class="doctak-section-tile" onclick="window.MedSphereDirectory.switchProfileTab('experience')">
                      <div class="doctak-tile-top">
                        <div class="doctak-tile-title-wrap">
                          <i class="fa-solid fa-briefcase"></i>
                          <span>Experience</span>
                        </div>
                        <span class="doctak-tile-badge">${expCount} items</span>
                      </div>
                      <p class="doctak-tile-desc">Clinical roles, hospitals, and practice history.</p>
                    </div>

                    <!-- Tile 2: Education -->
                    <div class="doctak-section-tile" onclick="window.MedSphereDirectory.switchProfileTab('education')">
                      <div class="doctak-tile-top">
                        <div class="doctak-tile-title-wrap">
                          <i class="fa-solid fa-graduation-cap"></i>
                          <span>Education</span>
                        </div>
                        <span class="doctak-tile-badge">${eduCount} items</span>
                      </div>
                      <p class="doctak-tile-desc">Degrees, institutions, and formal training.</p>
                    </div>

                    <!-- Tile 3: Medical Licenses -->
                    <div class="doctak-section-tile" onclick="window.MedSphereModals.open('modal-verify')">
                      <div class="doctak-tile-top">
                        <div class="doctak-tile-title-wrap">
                          <i class="fa-solid fa-shield-halved"></i>
                          <span>Medical Licenses</span>
                        </div>
                        <span class="doctak-tile-badge">1 item</span>
                      </div>
                      <p class="doctak-tile-desc">Licensure, issuing bodies, and active registration.</p>
                    </div>

                    <!-- Tile 4: Certifications -->
                    <div class="doctak-section-tile" onclick="window.MedSphereDirectory.switchProfileTab('education')">
                      <div class="doctak-tile-top">
                        <div class="doctak-tile-title-wrap">
                          <i class="fa-solid fa-award"></i>
                          <span>Certifications</span>
                        </div>
                        <span class="doctak-tile-badge">${certCount} items</span>
                      </div>
                      <p class="doctak-tile-desc">Board credentials, courses, and specialist proof.</p>
                    </div>

                  </div>
                </div>

                <!-- Structured Clinical Timelines -->
                <div class="doctak-detail-card">
                  <div class="doctak-card-header">
                    <h3 class="doctak-card-title">Clinical Experience & Practice History</h3>
                    <button type="button" class="doctak-btn-icon-subtle" title="Add Experience" onclick="window.MedSphereModals.open('modal-add-experience')">
                      <i class="fa-solid fa-plus"></i>
                    </button>
                  </div>
                  <div class="timeline-list">
                    ${prof.experience && prof.experience.length ? prof.experience.map(exp => `
                      <div class="timeline-item">
                        <span class="timeline-dot"></span>
                        <div class="timeline-role">${exp.role}</div>
                        <div class="timeline-org">${exp.organization}</div>
                        <div class="timeline-period">${exp.period}</div>
                        <p class="timeline-body">${exp.description || 'Clinical consultations, surgical operations, and healthcare administration.'}</p>
                      </div>
                    `).join('') : `
                      <div class="timeline-item">
                        <span class="timeline-dot"></span>
                        <div class="timeline-role">${prof.title || 'Anatomical Pathology Specialist'}</div>
                        <div class="timeline-org">${prof.organization || "St. Luke's Medical Center"} · Full-time</div>
                        <div class="timeline-period">2021 — Present · 5 yrs</div>
                        <p class="timeline-body">Leading clinical diagnosis, surgical pathology biopsies, interdisciplinary tumor boards, and resident training.</p>
                      </div>
                    `}
                  </div>
                </div>

                <!-- Education & Training Timeline -->
                <div class="doctak-detail-card">
                  <div class="doctak-card-header">
                    <h3 class="doctak-card-title">Education & Formal Training</h3>
                    <button type="button" class="doctak-btn-icon-subtle" title="Add Education" onclick="window.MedSphereModals.open('modal-add-education')">
                      <i class="fa-solid fa-plus"></i>
                    </button>
                  </div>
                  <div class="timeline-list">
                    ${prof.education && prof.education.length ? prof.education.map(edu => `
                      <div class="timeline-item">
                        <span class="timeline-dot"></span>
                        <div class="timeline-role">${edu.degree}</div>
                        <div class="timeline-org">${edu.institution}</div>
                        <div class="timeline-period">Class of ${edu.year || '2016'} ${edu.honors ? '· ' + edu.honors : ''}</div>
                      </div>
                    `).join('') : `
                      <div class="timeline-item">
                        <span class="timeline-dot"></span>
                        <div class="timeline-role">Doctor of Medicine (MD)</div>
                        <div class="timeline-org">Johns Hopkins University School of Medicine</div>
                        <div class="timeline-period">Class of 2012 · Alpha Omega Alpha (AOA) Honor Medical Society</div>
                      </div>
                      <div class="timeline-item">
                        <span class="timeline-dot"></span>
                        <div class="timeline-role">Bachelor of Science in Biomedical Science</div>
                        <div class="timeline-org">Massachusetts Institute of Technology (MIT)</div>
                        <div class="timeline-period">Class of 2008 · Summa Cum Laude</div>
                      </div>
                    `}
                  </div>
                </div>

              </div>

              <!-- Tab 2: Statistics -->
              <div class="doctak-tab-pane" id="tab-pane-statistics" style="display:none;">
                <div class="doctak-card">
                  <h3 class="doctak-card-title" style="margin-bottom:1rem;">Profile Performance & Reach</h3>
                  <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:1rem; text-align:center;">
                    <div style="background:#f8fafc; padding:1.25rem; border-radius:10px; border:1px solid #e2e8f0;">
                      <div style="font-size:1.6rem; font-weight:700; color:var(--primary-600);">${prof.connectionsCount || 842}</div>
                      <div style="font-size:0.75rem; color:#64748b; font-weight:600; margin-top:4px;">VERIFIED PEERS</div>
                    </div>
                    <div style="background:#f8fafc; padding:1.25rem; border-radius:10px; border:1px solid #e2e8f0;">
                      <div style="font-size:1.6rem; font-weight:700; color:var(--navy-900);">1,280</div>
                      <div style="font-size:0.75rem; color:#64748b; font-weight:600; margin-top:4px;">TOTAL FOLLOWERS</div>
                    </div>
                    <div style="background:#f8fafc; padding:1.25rem; border-radius:10px; border:1px solid #e2e8f0;">
                      <div style="font-size:1.6rem; font-weight:700; color:var(--emerald-600);">5,420</div>
                      <div style="font-size:0.75rem; color:#64748b; font-weight:600; margin-top:4px;">MONTHLY IMPRESSIONS</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Tab 3: Experience (Dedicated Tab View) -->
              <div class="doctak-tab-pane" id="tab-pane-experience" style="display:none;">
                <div class="doctak-card">
                  <div class="doctak-card-header">
                    <h3 class="doctak-card-title">Clinical Positions & Hospital Affiliations</h3>
                    <button type="button" class="btn btn-primary btn-sm" onclick="window.MedSphereModals.open('modal-add-experience')">
                      <i class="fa-solid fa-plus"></i> Add Position
                    </button>
                  </div>
                  <div class="timeline-list mt-3">
                    ${prof.experience && prof.experience.length ? prof.experience.map(exp => `
                      <div class="timeline-item">
                        <span class="timeline-dot"></span>
                        <div class="timeline-role">${exp.role}</div>
                        <div class="timeline-org">${exp.organization}</div>
                        <div class="timeline-period">${exp.period}</div>
                        <p class="timeline-body">${exp.description || 'Clinical consultations, surgical operations, and healthcare administration.'}</p>
                      </div>
                    `).join('') : `
                      <div class="timeline-item">
                        <span class="timeline-dot"></span>
                        <div class="timeline-role">${prof.title || 'Anatomical Pathology Specialist'}</div>
                        <div class="timeline-org">${prof.organization || "St. Luke's Medical Center"} · Full-time</div>
                        <div class="timeline-period">2021 — Present · 5 yrs</div>
                        <p class="timeline-body">Leading surgical pathology specimen evaluations, specialized molecular biopsies, tumor board presentations, and mentoring pathology residents.</p>
                      </div>
                      <div class="timeline-item">
                        <span class="timeline-dot"></span>
                        <div class="timeline-role">Attending Pathologist & Clinical Associate</div>
                        <div class="timeline-org">Boston Academic Medical Center</div>
                        <div class="timeline-period">2016 — 2021 · 5 yrs</div>
                        <p class="timeline-body">Conducted rapid frozen section consultations and published multidisciplinary retrospective studies in clinical journals.</p>
                      </div>
                    `}
                  </div>
                </div>
              </div>

              <!-- Tab 4: Education (Dedicated Tab View) -->
              <div class="doctak-tab-pane" id="tab-pane-education" style="display:none;">
                <div class="doctak-card">
                  <div class="doctak-card-header">
                    <h3 class="doctak-card-title">Academic Background & Credentials</h3>
                    <button type="button" class="btn btn-primary btn-sm" onclick="window.MedSphereModals.open('modal-add-education')">
                      <i class="fa-solid fa-plus"></i> Add Degree
                    </button>
                  </div>
                  <div class="timeline-list mt-3">
                    ${prof.education && prof.education.length ? prof.education.map(edu => `
                      <div class="timeline-item">
                        <span class="timeline-dot"></span>
                        <div class="timeline-role">${edu.degree}</div>
                        <div class="timeline-org">${edu.institution}</div>
                        <div class="timeline-period">Class of ${edu.year || '2016'} ${edu.honors ? '· ' + edu.honors : ''}</div>
                      </div>
                    `).join('') : `
                      <div class="timeline-item">
                        <span class="timeline-dot"></span>
                        <div class="timeline-role">Doctor of Medicine (MD)</div>
                        <div class="timeline-org">Johns Hopkins University School of Medicine</div>
                        <div class="timeline-period">Class of 2012 · Alpha Omega Alpha (AOA) Honor Medical Society</div>
                      </div>
                      <div class="timeline-item">
                        <span class="timeline-dot"></span>
                        <div class="timeline-role">Bachelor of Science in Biomedical Science</div>
                        <div class="timeline-org">Massachusetts Institute of Technology (MIT)</div>
                        <div class="timeline-period">Class of 2008 · Summa Cum Laude</div>
                      </div>
                    `}
                  </div>
                </div>
              </div>

              <!-- Tab 5: Portfolio / Cases -->
              <div class="doctak-tab-pane" id="tab-pane-portfolio" style="display:none;">
                <div class="doctak-card">
                  <h3 class="doctak-card-title" style="margin-bottom:0.75rem;">Clinical Case Portfolio</h3>
                  <p class="text-sm text-muted">De-identified clinical presentations and diagnostic case studies shared with peer network.</p>
                  <div style="background:#f8fafc; border:1px dashed #cbd5e1; border-radius:10px; padding:2rem; text-align:center; margin-top:1rem;">
                    <i class="fa-regular fa-folder-open" style="font-size:2rem; color:var(--primary-600); margin-bottom:0.5rem;"></i>
                    <p style="font-size:0.85rem; color:#64748b;">No public case studies added to portfolio yet.</p>
                    <button class="btn btn-primary btn-sm mt-2" onclick="window.MedSphereModals.open('modal-create-post')"><i class="fa-solid fa-plus"></i> Publish Clinical Case</button>
                  </div>
                </div>
              </div>

              <!-- Tab 6: Research -->
              <div class="doctak-tab-pane" id="tab-pane-research" style="display:none;">
                <div class="doctak-card">
                  <h3 class="doctak-card-title" style="margin-bottom:0.75rem;">Peer-Reviewed Research & Publications</h3>
                  <div class="timeline-list mt-3">
                    <div class="timeline-item">
                      <span class="timeline-dot"></span>
                      <div class="timeline-role">Artificial Intelligence in Automated Histopathological Tissue Segmentation</div>
                      <div class="timeline-org">Journal of Clinical Pathology & Laboratory Medicine · 2025</div>
                      <p class="timeline-body">Prospective evaluation of deep learning models in detecting micro-metastatic margins in specimen biopsy samples.</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Tab 7: Availability -->
              <div class="doctak-tab-pane" id="tab-pane-availability" style="display:none;">
                <div class="doctak-card">
                  <h3 class="doctak-card-title" style="margin-bottom:1rem;">Clinical & Consulting Availability</h3>
                  <div style="display:flex; flex-direction:column; gap:0.75rem; font-size:0.875rem;">
                    <div style="display:flex; align-items:center; gap:8px;">
                      <span style="width:8px; height:8px; border-radius:50%; background:var(--emerald-500);"></span>
                      <span>Second Opinion Diagnostic Pathology Consults</span>
                    </div>
                    <div style="display:flex; align-items:center; gap:8px;">
                      <span style="width:8px; height:8px; border-radius:50%; background:var(--emerald-500);"></span>
                      <span>Clinical Pathology Mentorship</span>
                    </div>
                    <div style="display:flex; align-items:center; gap:8px;">
                      <span style="width:8px; height:8px; border-radius:50%; background:var(--emerald-500);"></span>
                      <span>Multicenter Biomarker Clinical Trials</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Tab 8: Social -->
              <div class="doctak-tab-pane" id="tab-pane-social" style="display:none;">
                <div class="doctak-card">
                  <h3 class="doctak-card-title" style="margin-bottom:1rem;">Verified Clinical Links</h3>
                  <div style="display:flex; flex-direction:column; gap:0.75rem; font-size:0.85rem;">
                    <div style="display:flex; align-items:center; justify-content:space-between; padding:0.5rem; background:#f8fafc; border-radius:8px;">
                      <span><i class="fa-solid fa-graduation-cap" style="color:var(--primary-600); margin-right:8px;"></i> PubMed / NCBI Author Profile</span>
                      <a href="#" style="color:var(--primary-600); font-weight:600;">View Profile</a>
                    </div>
                    <div style="display:flex; align-items:center; justify-content:space-between; padding:0.5rem; background:#f8fafc; border-radius:8px;">
                      <span><i class="fa-solid fa-id-card" style="color:var(--primary-600); margin-right:8px;"></i> NPI Registry Profile</span>
                      <span style="color:#64748b; font-weight:600;">1892847291</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Tab 9: Posts -->
              <div class="doctak-tab-pane" id="tab-pane-posts" style="display:none;">
                <div class="doctak-card">
                  <h3 class="doctak-card-title" style="margin-bottom:1rem;">Recent Clinical Updates</h3>
                  <p class="text-sm text-muted">Updates, case pearls, and insights published by ${prof.name || 'doctor'}.</p>
                  <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:1.25rem; margin-top:1rem;">
                    <p style="font-size:0.875rem; color:#334155; line-height:1.5;">Welcome to my MedSphere profile! Looking forward to connecting with fellow pathologists and clinical colleagues across the network.</p>
                    <span style="font-size:0.72rem; color:#64748b; margin-top:0.5rem; display:block;">Posted 2 days ago</span>
                  </div>
                </div>
              </div>

              <!-- Tab 10: Surveys -->
              <div class="doctak-tab-pane" id="tab-pane-surveys" style="display:none;">
                <div class="doctak-card">
                  <h3 class="doctak-card-title" style="margin-bottom:1rem;">Clinical Surveys & Polls</h3>
                  <p class="text-sm text-muted">Participate in accredited clinical polls to influence healthcare guidelines.</p>
                  <div style="padding:1.5rem; text-align:center; background:#f8fafc; border-radius:10px; border:1px dashed #cbd5e1; margin-top:1rem;">
                    <i class="fa-solid fa-square-poll-vertical" style="font-size:2rem; color:var(--primary-600); margin-bottom:0.5rem;"></i>
                    <p style="font-size:0.85rem; color:#64748b;">No active surveys assigned at this time.</p>
                  </div>
                </div>
              </div>

            </div>

            <!-- RIGHT COLUMN (Profile details & Profile health) -->
            <div class="doctak-col-right">
              
              <!-- Card 1: Profile details -->
              <div class="doctak-card">
                <div class="doctak-card-header">
                  <h3 class="doctak-card-title">Profile details</h3>
                  <button type="button" class="doctak-edit-all-link" id="doctak-btn-edit-all" onclick="window.MedSphereModals.open('modal-edit-profile')">Edit all</button>
                </div>

                <div id="doctak-profile-details-list">
                  ${this.getProfileDetailsDefinition(prof).map(f => `
                    <div class="doctak-detail-row ${this.inlineEditingFields[f.key] ? 'is-editing' : ''}" id="doctak-row-${f.key}">
                      ${this.renderDetailRowInner(f, Boolean(this.inlineEditingFields[f.key]))}
                    </div>
                  `).join('')}
                </div>

              </div>

              <!-- Card 2: Profile health -->
              <div class="doctak-card">
                <h3 class="doctak-card-title" style="margin-bottom:0.35rem;">Profile health</h3>
                <p class="doctak-health-subtitle">
                  Six checks that influence how often your profile surfaces.
                </p>

                <!-- Check 1: Basic Info -->
                <div class="doctak-health-item">
                  <div class="doctak-health-top">
                    <span class="doctak-health-name">Basic Info</span>
                    <span class="doctak-health-badge ${basicScore >= 80 ? 'green' : (basicScore > 0 ? 'amber' : 'red')}">${basicScore}%</span>
                  </div>
                  <p class="doctak-health-desc">Identity, contact details, and the essentials that anchor the profile.</p>
                </div>

                <!-- Check 2: Professional -->
                <div class="doctak-health-item">
                  <div class="doctak-health-top">
                    <span class="doctak-health-name">Professional</span>
                    <span class="doctak-health-badge ${profScore >= 80 ? 'green' : (profScore > 0 ? 'amber' : 'red')}">${profScore}%</span>
                  </div>
                  <p class="doctak-health-desc">Specialty, clinic, and credentials that establish your practice.</p>
                </div>

                <!-- Check 3: About Me -->
                <div class="doctak-health-item">
                  <div class="doctak-health-top">
                    <span class="doctak-health-name">About Me</span>
                    <span class="doctak-health-badge ${aboutScore >= 80 ? 'green' : (aboutScore > 0 ? 'amber' : 'red')}">${aboutScore}%</span>
                  </div>
                  <p class="doctak-health-desc">Your summary, voice, and the context behind your professional work.</p>
                </div>

                <!-- Check 4: Photo -->
                <div class="doctak-health-item">
                  <div class="doctak-health-top">
                    <span class="doctak-health-name">Photo</span>
                    <span class="doctak-health-badge ${photoScore >= 80 ? 'green' : (photoScore > 0 ? 'amber' : 'red')}">${photoScore}%</span>
                  </div>
                  <p class="doctak-health-desc">Profile and cover imagery that make the page recognizable and credible.</p>
                </div>

                <!-- Check 5: Social Links -->
                <div class="doctak-health-item">
                  <div class="doctak-health-top">
                    <span class="doctak-health-name">Social Links</span>
                    <span class="doctak-health-badge ${socialScore >= 80 ? 'green' : (socialScore > 0 ? 'amber' : 'red')}">${socialScore}%</span>
                  </div>
                  <p class="doctak-health-desc">External links that help patients and peers verify your presence.</p>
                </div>

                <!-- Check 6: Skills -->
                <div class="doctak-health-item">
                  <div class="doctak-health-top">
                    <span class="doctak-health-name">Skills</span>
                    <span class="doctak-health-badge ${skillScore >= 80 ? 'green' : (skillScore > 0 ? 'amber' : 'red')}">${skillScore}%</span>
                  </div>
                  <p class="doctak-health-desc">Areas of expertise that show range, focus, and confidence.</p>
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    `;
  },

  // 3. Hospitals Directory
  renderHospitals() {
    const hospitals = window.MEDSPHERE_DATA.hospitals;

    return `
      <div class="page-hero-banner">
        <div class="container">
          <div class="breadcrumbs">
            <a href="#home">Home</a> <span>/</span> <span>Hospitals & Health Systems</span>
          </div>
          <h1 class="page-title">Hospitals & Healthcare Organizations</h1>
          <p class="section-subtitle">
            Explore premier academic medical centers, health systems, and specialized clinical facilities across our global network.
          </p>
        </div>
      </div>

      <div class="container" style="padding-top:3rem; padding-bottom:5rem;">
        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(360px, 1fr)); gap:2rem;">
          ${hospitals.map(h => `
            <div class="card card-hover" style="display:flex; flex-direction:column;">
              <div style="height:180px; margin:-1.75rem -1.75rem 1.25rem -1.75rem; overflow:hidden; border-radius:var(--radius-lg) var(--radius-lg) 0 0;">
                <img src="${h.cover}" alt="${h.name}" style="width:100%; height:100%; object-fit:cover;">
              </div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.5rem;">
                <span class="badge badge-green">${h.accreditation}</span>
                <span class="text-xs text-muted"><i class="fa-solid fa-location-dot" style="margin-right:4px;"></i> ${h.location}</span>
              </div>
              <h3 style="font-size:1.35rem; margin-bottom:0.35rem;">
                <a href="#hospital?id=${h.id}">${h.name}</a>
              </h3>
              <div class="text-sm text-muted" style="margin-bottom:0.85rem;">${h.type} · ${h.beds}</div>
              <p class="text-sm" style="margin-bottom:1.25rem; flex-grow:1;">${h.overview}</p>

              <div style="display:flex; flex-wrap:wrap; gap:0.4rem; margin-bottom:1.25rem;">
                ${h.specialties.slice(0, 3).map(s => `<span class="badge badge-blue">${s}</span>`).join('')}
              </div>

              <div style="display:flex; align-items:center; justify-content:space-between; padding-top:1rem; border-top:1px solid var(--border-subtle); margin-top:auto;">
                <span style="font-size:0.875rem; font-weight:700; color:var(--primary-800);">${h.openJobsCount} Open Positions</span>
                <a href="#hospital?id=${h.id}" class="btn btn-outline btn-sm">View System Profile</a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  // 4. Hospital Profile View
  renderHospitalProfile(params = {}) {
    const hosp = window.MEDSPHERE_DATA.hospitals.find(h => h.id === params.id) || window.MEDSPHERE_DATA.hospitals[0];

    return `
      <div class="profile-view-wrap">
        <div class="profile-cover-banner" style="height:320px;">
          <img src="${hosp.cover}" alt="${hosp.name}">
        </div>

        <div class="container">
          <div class="profile-header-card">
            <div class="profile-header-top">
              <div>
                <span class="badge badge-green" style="margin-bottom:0.5rem;">${hosp.accreditation}</span>
                <h1 style="font-size:2.25rem; margin-bottom:0.35rem;">${hosp.name}</h1>
                <div style="font-size:1.1rem; color:var(--slate-600);">${hosp.type} · ${hosp.location}</div>
                <div style="display:flex; gap:1.5rem; margin-top:0.75rem; font-size:0.9rem; color:var(--primary-900); font-weight:600;">
                  <span><i class="fa-solid fa-bed" style="margin-right:4px; color:var(--primary-700);"></i> ${hosp.beds}</span>
                  <span><i class="fa-solid fa-users" style="margin-right:4px; color:var(--primary-700);"></i> ${hosp.staff}</span>
                  <span><i class="fa-solid fa-briefcase" style="margin-right:4px; color:var(--primary-700);"></i> ${hosp.openJobsCount} Active Jobs</span>
                </div>
              </div>

              <div class="profile-header-actions">
                <a href="#jobs" class="btn btn-primary">View Open Positions</a>
                <button class="btn btn-outline" onclick="window.MedSphereToast.show('Contact Hospital', 'Routing message to St. Luke\\'s Clinical Recruiter office...', 'info')">Contact Credentialing</button>
              </div>
            </div>
          </div>

          <div class="profile-main-grid">
            <div class="profile-main-col">
              <div class="profile-card-section">
                <h3 class="profile-section-title">Institutional Overview</h3>
                <p style="font-size:1rem; line-height:1.7;">${hosp.overview}</p>
                <p style="font-size:1rem; line-height:1.7; margin-top:1rem;">
                  Equipped with 14 hybrid operating suites, level 1 trauma certification, pediatric ICU, and extensive graduate medical education affiliations with Harvard Medical School and Boston University.
                </p>
              </div>

              <div class="profile-card-section">
                <h3 class="profile-section-title">Clinical Centers of Excellence</h3>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                  ${hosp.specialties.map(s => `
                    <div style="padding:1rem; background:var(--primary-50); border:1px solid var(--border-subtle); border-radius:var(--radius-md);">
                      <strong style="color:var(--primary-900);">${s}</strong>
                      <p class="text-xs text-muted" style="margin-top:4px;">Ranked in top 1% nationally for clinical outcomes and low complication rates.</p>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>

            <aside class="profile-sidebar-col">
              <div class="profile-card-section">
                <h4 style="font-size:1.1rem; margin-bottom:1rem;">Campus Location</h4>
                <p class="text-sm">750 Washington St<br>Boston, MA 02111<br>Main Switchboard: +1 (617) 636-5000</p>
                <div style="margin-top:1rem;">
                  <button class="btn btn-secondary btn-sm w-100" onclick="window.MedSphereToast.show('Directions', 'Opening campus maps...', 'info')">Campus Directions & Parking</button>
                </div>
              </div>

              <div class="profile-card-section">
                <h4 style="font-size:1.1rem; margin-bottom:1rem;">Accreditation & Badges</h4>
                <div style="display:flex; flex-direction:column; gap:0.5rem; font-size:0.875rem;">
                  <div><i class="fa-solid fa-circle-check" style="color:var(--emerald-600); margin-right:6px;"></i> Joint Commission Gold Seal of Approval</div>
                  <div><i class="fa-solid fa-circle-check" style="color:var(--emerald-600); margin-right:6px;"></i> Magnet Nursing Recognition (ANCC)</div>
                  <div><i class="fa-solid fa-circle-check" style="color:var(--emerald-600); margin-right:6px;"></i> ACGME Residency Accredited</div>
                  <div><i class="fa-solid fa-circle-check" style="color:var(--emerald-600); margin-right:6px;"></i> Leapfrog Grade 'A' Patient Safety</div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    `;
  },

  // 5. Pharmaceutical & MedTech Companies Directory
  renderCompanies() {
    const companies = window.MEDSPHERE_DATA.companies;

    return `
      <div class="page-hero-banner">
        <div class="container">
          <div class="breadcrumbs">
            <a href="#home">Home</a> <span>/</span> <span>Pharmaceutical & MedTech</span>
          </div>
          <h1 class="page-title">Pharmaceutical Companies & MedTech</h1>
          <p class="section-subtitle">
            Connect directly with verified biopharmaceutical developers, diagnostic manufacturers, and medical device innovators.
          </p>
        </div>
      </div>

      <div class="container" style="padding-top:3rem; padding-bottom:5rem;">
        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(350px, 1fr)); gap:2rem;">
          ${companies.map(c => `
            <div class="card card-hover">
              <div style="display:flex; align-items:center; gap:1rem; margin-bottom:1rem;">
                <img src="${c.logo}" alt="${c.name}" style="width:56px; height:56px; border-radius:var(--radius-md); object-fit:cover;">
                <div>
                  <h3 style="font-size:1.25rem;">
                    <a href="#company?id=${c.id}">${c.name}</a>
                  </h3>
                  <div class="text-xs text-muted">${c.category} · ${c.headquarters}</div>
                </div>
              </div>
              <p class="text-sm text-muted" style="margin-bottom:1.25rem;">${c.overview}</p>
              <div style="display:flex; justify-content:space-between; padding:0.75rem; background:var(--primary-50); border-radius:var(--radius-md); margin-bottom:1.25rem; font-size:0.8125rem;">
                <span><strong>${c.productsCount}</strong> Therapeutics</span>
                <span><strong>${c.activeTrials}</strong> Phase 3 Trials</span>
              </div>
              <a href="#company?id=${c.id}" class="btn btn-outline btn-sm w-100">View Pipeline & Products</a>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  // 6. Company Detail View
  renderCompanyProfile(params = {}) {
    const comp = window.MEDSPHERE_DATA.companies.find(c => c.id === params.id) || window.MEDSPHERE_DATA.companies[0];

    return `
      <div class="page-hero-banner">
        <div class="container">
          <div class="breadcrumbs">
            <a href="#home">Home</a> <span>/</span> <a href="#companies">Pharmaceuticals</a> <span>/</span> <span>${comp.name}</span>
          </div>
          <div style="display:flex; align-items:center; gap:1.5rem; margin-top:1rem;">
            <img src="${comp.logo}" alt="${comp.name}" style="width:80px; height:80px; border-radius:var(--radius-lg); object-fit:cover;">
            <div>
              <h1 style="font-size:2.25rem; margin-bottom:0.25rem;">${comp.name}</h1>
              <div style="font-size:1rem; color:var(--slate-600);">${comp.category} · Headquartered in ${comp.headquarters}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="container" style="padding-top:3rem; padding-bottom:5rem;">
        <div class="profile-main-grid">
          <div class="profile-main-col">
            <div class="profile-card-section">
              <h3 class="profile-section-title">Corporate Mission</h3>
              <p style="font-size:1rem; line-height:1.7;">${comp.overview}</p>
            </div>

            <div class="profile-card-section">
              <h3 class="profile-section-title">Active Clinical Pipeline (${comp.pipelineSize})</h3>
              <div style="display:flex; flex-direction:column; gap:1rem;">
                <div style="padding:1rem; background:var(--slate-50); border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
                  <div style="display:flex; justify-content:space-between;">
                    <strong>Compound PF-9481 (Targeted Kinase Inhibitor)</strong>
                    <span class="badge badge-blue">Phase III Global Trial</span>
                  </div>
                  <p class="text-sm text-muted mt-1">Indication: Non-Small Cell Lung Carcinoma (NSCLC) with EGFR exon 20 insertion mutations.</p>
                </div>

                <div style="padding:1rem; background:var(--slate-50); border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
                  <div style="display:flex; justify-content:space-between;">
                    <strong>CardioShield mRNA Monoclonal Vector</strong>
                    <span class="badge badge-green">FDA Fast Track</span>
                  </div>
                  <p class="text-sm text-muted mt-1">Indication: Prevention of post-infarction myocardial scar expansion and heart failure.</p>
                </div>
              </div>
            </div>
          </div>

          <aside class="profile-sidebar-col">
            <div class="profile-card-section">
              <h4 style="font-size:1.1rem; margin-bottom:1rem;">Medical Affairs Contact</h4>
              <p class="text-sm">For investigational brochure inquiries, investigator-sponsored research, and commercial distribution:</p>
              <div style="margin-top:1rem;">
                <button class="btn btn-primary btn-sm w-100" onclick="window.MedSphereToast.show('Contact BD', 'Opening clinical inquiry portal...', 'info')">Connect with Medical Affairs</button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    `;
  }
};

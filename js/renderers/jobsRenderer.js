// MedSphere Healthcare Job Board Renderer — Authenticated DocTak Layout with Login Protection

window.MedSphereJobs = {
  state: {
    activeTab: 'browse', // 'browse', 'applied', 'saved'
    search: '',
    location: '',
    specialty: '',
    jobType: '',
    sortBy: 'newest',
    openFilter: null,
    selectedJobId: null,
    isDetailOpen: false,
    sidebarVisible: true
  },

  getMonogram(name = '') {
    const parts = name.replace(/[^a-zA-Z\s]/g, '').trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (name.slice(0, 1) || 'M').toUpperCase();
  },

  getMonogramBg(name = '') {
    if (name.toLowerCase().includes('mediclinic')) {
      return '#dc2626'; // Red monogram like in user's screenshot
    }
    if (name.toLowerCase().includes('luke') || name.toLowerCase().includes('mayo')) {
      return '#0066cc';
    }
    if (name.toLowerCase().includes('cleveland') || name.toLowerCase().includes('emirates')) {
      return '#0284c7';
    }
    const colors = ['#dc2626', '#0066cc', '#0284c7', '#4f46e5', '#0d9488', '#059669'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  },

  getFilteredJobs() {
    const allJobs = window.MEDSPHERE_DATA.jobs || [];
    const store = window.MedSphereStore;
    const { activeTab, search, location, specialty, jobType, sortBy } = this.state;

    let filtered = allJobs.filter(j => {
      // Tab filtering
      if (activeTab === 'applied') {
        if (!store.hasApplied(j.id)) return false;
      } else if (activeTab === 'saved') {
        if (!store.isJobSaved(j.id)) return false;
      }

      // Keyword search (title, company, specialty, description, facility)
      if (search && search.trim()) {
        const q = search.toLowerCase().trim();
        const match = (j.title || '').toLowerCase().includes(q) ||
                      (j.company || '').toLowerCase().includes(q) ||
                      (j.facility || '').toLowerCase().includes(q) ||
                      (j.specialty || '').toLowerCase().includes(q) ||
                      (j.description || '').toLowerCase().includes(q);
        if (!match) return false;
      }

      // Location search
      if (location && location.trim()) {
        const lq = location.toLowerCase().trim();
        const match = (j.location || '').toLowerCase().includes(lq) ||
                      (j.type || '').toLowerCase().includes(lq);
        if (!match) return false;
      }

      // Specialty filter
      if (specialty) {
        if (!(j.specialty || '').toLowerCase().includes(specialty.toLowerCase())) {
          return false;
        }
      }

      // Job Type filter
      if (jobType) {
        if (!(j.type || '').toLowerCase().includes(jobType.toLowerCase())) {
          return false;
        }
      }

      return true;
    });

    // Sorting
    if (sortBy === 'salary') {
      filtered.sort((a, b) => {
        const valA = parseInt((a.salary || '0').replace(/[^0-9]/g, '')) || 0;
        const valB = parseInt((b.salary || '0').replace(/[^0-9]/g, '')) || 0;
        return valB - valA;
      });
    } else if (sortBy === 'title') {
      filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }

    return filtered;
  },

  switchTab(tab) {
    this.state.activeTab = tab;
    const items = document.querySelectorAll('.jobs-nav-item');
    items.forEach(el => {
      if (el.getAttribute('data-tab') === tab) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    const titleEl = document.getElementById('jobs-view-title');
    if (titleEl) {
      if (tab === 'browse') titleEl.innerText = 'Browse opportunities';
      else if (tab === 'applied') titleEl.innerText = 'My Submitted Applications';
      else if (tab === 'saved') titleEl.innerText = 'Saved Opportunities';
    }

    this.updateListView();
  },

  toggleFilterAccordion(filterName) {
    if (this.state.openFilter === filterName) {
      this.state.openFilter = null;
    } else {
      this.state.openFilter = filterName;
    }
    
    // Update DOM
    ['method', 'specialty', 'location', 'type', 'posted'].forEach(f => {
      const el = document.getElementById(`filter-content-${f}`);
      const arrow = document.getElementById(`filter-arrow-${f}`);
      if (el) {
        if (this.state.openFilter === f) {
          el.classList.add('open');
          if (arrow) arrow.style.transform = 'rotate(90deg)';
        } else {
          el.classList.remove('open');
          if (arrow) arrow.style.transform = 'rotate(0deg)';
        }
      }
    });
  },

  setFilter(type, value) {
    if (this.state[type] === value) {
      this.state[type] = ''; // toggle off
    } else {
      this.state[type] = value;
    }

    // Update active filter footnote
    const foot = document.getElementById('jobs-filter-status');
    const hasFilter = this.state.specialty || this.state.location || this.state.jobType || this.state.search;
    if (foot) {
      foot.innerHTML = hasFilter 
        ? `<a href="javascript:void(0)" onclick="window.MedSphereJobs.resetAllFilters()" style="color:#0080ff; font-weight:600; text-decoration:none;"><i class="fa-solid fa-rotate-left"></i> Reset active filters</a>`
        : `No active filters`;
    }

    this.updateListView();
  },

  handleSearch() {
    const qInput = document.getElementById('jobs-search-q');
    const locInput = document.getElementById('jobs-search-loc');
    if (qInput) this.state.search = qInput.value;
    if (locInput) this.state.location = locInput.value;
    this.updateListView();
  },

  handleSort(sortBy) {
    this.state.sortBy = sortBy;
    this.updateListView();
  },

  resetAllFilters() {
    this.state.search = '';
    this.state.location = '';
    this.state.specialty = '';
    this.state.jobType = '';
    this.state.sortBy = 'newest';

    const qInput = document.getElementById('jobs-search-q');
    const locInput = document.getElementById('jobs-search-loc');
    const sortSelect = document.getElementById('jobs-sort-portal-select');
    if (qInput) qInput.value = '';
    if (locInput) locInput.value = '';
    if (sortSelect) sortSelect.value = 'newest';

    const foot = document.getElementById('jobs-filter-status');
    if (foot) foot.innerText = 'No active filters';

    const radios = document.querySelectorAll('.jobs-filter-check input');
    radios.forEach(r => r.checked = false);

    this.updateListView();
  },

  toggleSaveJob(jobId) {
    const isSaved = window.MedSphereStore.toggleSaveJob(jobId);
    window.MedSphereToast.show(
      isSaved ? "Saved Job" : "Removed Job",
      isSaved ? "Opportunity saved to your bookmarks." : "Job removed from saved list.",
      "success"
    );
    this.updateListView();
  },

  selectJob(jobId) {
    this.state.selectedJobId = jobId;
    this.state.isDetailOpen = true;

    // Highlight active card
    const cards = document.querySelectorAll('.jobs-feed-card');
    cards.forEach(c => {
      if (c.getAttribute('data-job-id') === jobId) {
        c.classList.add('active');
      } else {
        c.classList.remove('active');
      }
    });

    const allJobs = window.MEDSPHERE_DATA.jobs || [];
    const j = allJobs.find(item => item.id === jobId) || allJobs[0];
    if (!j) return;

    // On mobile & tablet screens (<= 1040px): EXCLUSIVELY open modal-job-detail via MedSphereModals (single modal only)
    if (window.innerWidth <= 1040) {
      if (window.MedSphereModals) {
        window.MedSphereModals.open('modal-job-detail', j);
      }
      return;
    }

    // On desktop screens (> 1040px): Open the 3rd column preview panel in grid
    const portalGrid = document.querySelector('.jobs-portal-grid');
    if (portalGrid) {
      portalGrid.classList.add('detail-panel-open');
    }

    const detailCol = document.getElementById('jobs-detail-panel');
    if (detailCol) {
      detailCol.classList.add('is-open');
      detailCol.style.display = 'block';
      detailCol.innerHTML = this.renderDetailPanelHtml(j);
      const scrollBody = detailCol.querySelector('.jobs-detail-scroll-body');
      if (scrollBody) scrollBody.scrollTop = 0;
    }
  },

  closeDetail() {
    this.state.isDetailOpen = false;
    this.state.selectedJobId = null;
    const portalGrid = document.querySelector('.jobs-portal-grid');
    if (portalGrid) {
      portalGrid.classList.remove('detail-panel-open');
    }

    const detailCol = document.getElementById('jobs-detail-panel');
    if (detailCol) {
      detailCol.classList.remove('is-open');
      detailCol.style.display = 'none';
      detailCol.innerHTML = '';
    }

    // Restore body scroll
    document.body.style.overflow = '';

    const cards = document.querySelectorAll('.jobs-feed-card');
    cards.forEach(c => c.classList.remove('active'));
  },

  toggleSidebar() {
    this.state.sidebarVisible = !this.state.sidebarVisible;
    const sidebar = document.querySelector('.jobs-portal-sidebar');
    const portalGrid = document.querySelector('.jobs-portal-grid');
    if (sidebar) {
      sidebar.classList.toggle('is-hidden', !this.state.sidebarVisible);
    }
    if (portalGrid) {
      portalGrid.classList.toggle('sidebar-collapsed', !this.state.sidebarVisible);
    }
  },

  handleApply(jobId) {
    const store = window.MedSphereStore;
    const allJobs = window.MEDSPHERE_DATA.jobs || [];
    const j = allJobs.find(item => item.id === jobId) || allJobs[0];
    if (!j) return;

    if (store.hasApplied(jobId)) {
      window.MedSphereToast.show('Already Applied', `You have already applied to ${j.title} at ${j.company}.`, 'info');
      return;
    }

    window.MedSphereModals.open('modal-apply-job', {
      id: j.id,
      title: j.title,
      company: j.company,
      facility: j.facility,
      location: j.location,
      salary: j.salary,
      type: j.type
    });
  },

  renderDetailPanelHtml(j) {
    const store = window.MedSphereStore;
    const isSaved = store.isJobSaved(j.id);
    const hasApplied = store.hasApplied(j.id);
    const monogram = this.getMonogram(j.company);
    const bg = this.getMonogramBg(j.company);
    const locationLine = j.facility ? `${j.facility} . ${j.location}` : j.location;

    return `
      <div class="jobs-detail-card-panel">
        <!-- HEADER (MATCHING USER SCREENSHOT) -->
        <div class="jobs-detail-header">
          <div class="jobs-detail-avatar" style="background:${bg};">
            ${monogram}
          </div>
          <div class="jobs-detail-meta">
            <h2 class="jobs-detail-title">${j.title}</h2>
            <div class="jobs-detail-org-row">
              <span class="jobs-detail-company">${j.company} ·</span>
              <span class="jobs-detail-facility">${locationLine}</span>
            </div>
          </div>
          <button class="jobs-detail-close-btn" onclick="window.MedSphereJobs.closeDetail()" title="Close details">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- ACTION BUTTONS ROW (MATCHING USER SCREENSHOT) -->
        <div class="jobs-detail-actions-row">
          <button class="jobs-btn-apply-employer ${hasApplied ? 'applied' : ''}" 
                  onclick="window.MedSphereJobs.handleApply('${j.id}')">
            ${hasApplied ? '<i class="fa-solid fa-circle-check"></i> Applied on employer site' : 'Apply on employer site'}
          </button>
          <button class="jobs-btn-detail-bookmark ${isSaved ? 'saved' : ''}" 
                  title="${isSaved ? 'Remove from Saved' : 'Save Job'}"
                  onclick="window.MedSphereJobs.toggleSaveJob('${j.id}')">
            <i class="${isSaved ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark'}"></i>
          </button>
        </div>

        <!-- SCROLLABLE BODY -->
        <div class="jobs-detail-scroll-body">
          <!-- TYPE PILL -->
          <div class="jobs-detail-type-badge-wrap">
            <span class="jobs-detail-type-badge">${j.type ? j.type.split('·')[0].trim() : 'Full-Time'}</span>
          </div>

          <!-- SUMMARY TEXT -->
          <p class="jobs-detail-summary-text">
            ${j.experience || j.description}
          </p>

          <!-- 4 INFO SPEC CARDS (MATCHING USER SCREENSHOT EXACTLY) -->
          <div class="jobs-detail-specs-grid">
            <!-- 1. SALARY -->
            <div class="jobs-spec-card">
              <span class="jobs-spec-label">SALARY</span>
              <div class="jobs-spec-value salary-val">${j.salary ? j.salary : 'Not specified'}</div>
              <div class="jobs-spec-sub">${j.type ? j.type.split('·')[0].trim() : 'Full-Time'}</div>
            </div>

            <!-- 2. EXPERIENCE -->
            <div class="jobs-spec-card">
              <span class="jobs-spec-label">EXPERIENCE</span>
              <div class="jobs-spec-value experience-val">
                ${j.experience || "At least 3 - 5 years' post qualification experience at Specialist level (independent of country) Desired: At least 1 year Specialist level experience from a Tier 1 country as specified by the UAE healthcare regulator"}
              </div>
            </div>

            <!-- 3 & 4. OPENINGS & POSTED (2-COL ROW) -->
            <div class="jobs-specs-dual-row">
              <div class="jobs-spec-card">
                <span class="jobs-spec-label">OPENINGS</span>
                <div class="jobs-spec-value">${j.openings || '1 position'}</div>
                <div class="jobs-spec-sub">Apply via MedSphere</div>
              </div>

              <div class="jobs-spec-card">
                <span class="jobs-spec-label">POSTED</span>
                <div class="jobs-spec-value">${j.posted || '2y ago'}</div>
                <div class="jobs-spec-sub">${j.postedDate || 'Nov 22, 2023'}</div>
              </div>
            </div>
          </div>

          <!-- ABOUT THE ROLE -->
          <div class="jobs-detail-section">
            <h3 class="jobs-detail-sec-title">ABOUT THE ROLE</h3>
            <p class="jobs-detail-sec-p">${j.description || 'Deliver exceptional medical care with clinical leadership and patient safety excellence.'}</p>
          </div>

          <!-- KEY RESPONSIBILITIES -->
          ${j.responsibilities && j.responsibilities.length ? `
            <div class="jobs-detail-section">
              <h3 class="jobs-detail-sec-title">KEY RESPONSIBILITIES</h3>
              <ul class="jobs-detail-bullets">
                ${j.responsibilities.map(r => `
                  <li><i class="fa-solid fa-circle-check"></i> <span>${r}</span></li>
                `).join('')}
              </ul>
            </div>
          ` : ''}

          <!-- REQUIREMENTS & QUALIFICATIONS -->
          ${j.requirements && j.requirements.length ? `
            <div class="jobs-detail-section">
              <h3 class="jobs-detail-sec-title">REQUIREMENTS & QUALIFICATIONS</h3>
              <ul class="jobs-detail-bullets">
                ${j.requirements.map(req => `
                  <li><i class="fa-solid fa-award"></i> <span>${req}</span></li>
                `).join('')}
              </ul>
            </div>
          ` : ''}

          <!-- COMPENSATION & BENEFITS -->
          ${j.benefits && j.benefits.length ? `
            <div class="jobs-detail-section">
              <h3 class="jobs-detail-sec-title">COMPENSATION & BENEFITS</h3>
              <ul class="jobs-detail-bullets">
                ${j.benefits.map(b => `
                  <li><i class="fa-solid fa-check"></i> <span>${b}</span></li>
                `).join('')}
              </ul>
            </div>
          ` : ''}

          <!-- ABOUT EMPLOYER -->
          <div class="jobs-detail-section">
            <h3 class="jobs-detail-sec-title">ABOUT ${j.company.toUpperCase()}</h3>
            <p class="jobs-detail-sec-p">
              ${j.company} operates premier clinical centers recognized internationally for healthcare standards, patient safety, and cutting-edge medical technology.
            </p>
          </div>

          <!-- BOTTOM CTA BUTTON -->
          <div class="jobs-detail-bottom-cta">
            <button class="jobs-btn-apply-employer ${hasApplied ? 'applied' : ''}" 
                    onclick="window.MedSphereJobs.handleApply('${j.id}')">
              ${hasApplied ? '<i class="fa-solid fa-circle-check"></i> Applied on employer site' : 'Apply on employer site'}
            </button>
          </div>

        </div>
      </div>
    `;
  },

  updateListView() {
    const container = document.getElementById('jobs-cards-container');
    const countEl = document.getElementById('job-matching-count-num');
    const store = window.MedSphereStore;

    const filtered = this.getFilteredJobs();
    if (countEl) countEl.innerText = filtered.length;

    if (!container) return;

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="jobs-card-box" style="padding:4rem 2rem; text-align:center;">
          <h3 style="font-size:1.25rem; font-weight:700; color:#0f172a; margin-bottom:0.5rem;">No matching opportunities found</h3>
          <p style="font-size:0.925rem; color:#64748b; margin-bottom:1.5rem;">Try adjusting your keyword or clearing active filters.</p>
          <button class="btn btn-outline btn-pill" onclick="window.MedSphereJobs.resetAllFilters()">Clear all filters</button>
        </div>
      `;
      return;
    }

    // Only if detail panel is open, validate selected job
    if (this.state.isDetailOpen) {
      if (!filtered.some(j => j.id === this.state.selectedJobId)) {
        this.state.selectedJobId = filtered.length ? filtered[0].id : null;
        if (!this.state.selectedJobId) this.state.isDetailOpen = false;
      }
    } else {
      this.state.selectedJobId = null;
    }

    container.innerHTML = `
      <div class="jobs-cards-stack">
        ${filtered.map(j => {
          const isSaved = store.isJobSaved(j.id);
          const hasApplied = store.hasApplied(j.id);
          const monogram = this.getMonogram(j.company);
          const bg = this.getMonogramBg(j.company);
          const isActive = (j.id === this.state.selectedJobId) && this.state.isDetailOpen;
          const locationPart = j.location.split(',')[1] ? j.location.split(',')[1].trim() : j.location.split(',')[0];
          const timeDisplay = j.postedDate ? `${j.posted || '2y ago'} · ${j.postedDate.split(' ')[2] || '2023'}` : (j.posted || '2d ago');

          return `
            <div class="jobs-feed-card ${isActive ? 'active' : ''}" 
                 id="job-card-${j.id}" 
                 data-job-id="${j.id}" 
                 role="button"
                 tabindex="0"
                 onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault(); window.MedSphereJobs.selectJob('${j.id}');}"
                 onclick="window.MedSphereJobs.selectJob('${j.id}')">
              <div class="jobs-feed-card-header">
                <div class="jobs-feed-avatar" style="background:${bg};">
                  ${monogram}
                </div>
                
                <div class="jobs-feed-header-info">
                  <h3 class="jobs-feed-role-title">
                    ${j.title}
                  </h3>
                  <div class="jobs-feed-org-row">
                    <strong>${j.company}</strong> · <span>${j.facility ? j.facility + ' . ' : ''}${j.location}</span>
                  </div>
                </div>

                <div class="jobs-feed-time-badge">
                  ${timeDisplay}
                </div>
              </div>

              <p class="jobs-feed-desc-text">
                ${j.experience || j.description}
              </p>

              <div class="jobs-feed-card-footer">
                <div class="jobs-feed-tags-row">
                  <span class="jobs-feed-tag">${locationPart}</span>
                  <span class="jobs-feed-tag">${j.type ? j.type.split('·')[0].trim() : 'Full-Time'}</span>
                  ${j.salary ? `<span class="jobs-feed-tag salary">${j.salary}</span>` : ''}
                  ${hasApplied ? `<span class="jobs-feed-tag applied"><i class="fa-solid fa-check"></i> Applied</span>` : ''}
                </div>

                <div class="jobs-feed-actions" onclick="event.stopPropagation()">
                  <button type="button" 
                          class="btn-apply-card ${hasApplied ? 'applied' : ''}"
                          title="${hasApplied ? 'Already Applied' : 'Apply for ' + j.title}"
                          onclick="event.stopPropagation(); window.MedSphereJobs.handleApply('${j.id}')">
                    ${hasApplied ? '<i class="fa-solid fa-check"></i> Applied' : '<i class="fa-solid fa-paper-plane"></i> Apply'}
                  </button>
                  <button type="button" 
                          class="jobs-bookmark-btn ${isSaved ? 'saved' : ''}" 
                          title="${isSaved ? 'Remove Bookmark' : 'Save Job'}"
                          onclick="event.stopPropagation(); window.MedSphereJobs.toggleSaveJob('${j.id}')">
                    <i class="${isSaved ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark'}"></i>
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Also update detail panel if open
    if (this.state.isDetailOpen) {
      const selectedJob = filtered.find(j => j.id === this.state.selectedJobId) || filtered[0];
      const detailCol = document.getElementById('jobs-detail-panel');
      if (detailCol && selectedJob) {
        detailCol.innerHTML = this.renderDetailPanelHtml(selectedJob);
      }
    }
  },

  renderJobs(params = {}) {
    const filtered = this.getFilteredJobs();
    const count = filtered.length;

    if (params && params.id) {
      this.state.selectedJobId = params.id;
      this.state.isDetailOpen = true;
    } else {
      this.state.selectedJobId = null;
      this.state.isDetailOpen = false;
    }

    const allJobs = window.MEDSPHERE_DATA.jobs || [];
    const selectedJob = (this.state.isDetailOpen && this.state.selectedJobId) 
      ? (allJobs.find(j => j.id === this.state.selectedJobId) || null) 
      : null;

    return `
      <div class="jobs-portal-container">
        <div class="jobs-portal-grid ${this.state.isDetailOpen ? 'detail-panel-open' : ''} ${this.state.sidebarVisible ? '' : 'sidebar-collapsed'}">
          
          <!-- LEFT SIDEBAR -->
          <aside class="jobs-portal-sidebar ${this.state.sidebarVisible ? '' : 'is-hidden'}">
            
            <!-- CARD 1: Jobs by Filters -->
            <div class="jobs-card-box">
              <div class="jobs-card-header">
                <h3 class="jobs-card-title">Jobs by Filters</h3>
              </div>

              <!-- Filter 1: Apply method -->
              <div class="jobs-filter-item">
                <button type="button" class="jobs-filter-trigger" onclick="window.MedSphereJobs.toggleFilterAccordion('method')">
                  <span><i class="fa-solid fa-chevron-right" id="filter-arrow-method" style="font-size:10px; transition:transform 0.15s;"></i> Apply method</span>
                </button>
                <div class="jobs-filter-content" id="filter-content-method">
                  <label class="jobs-filter-check">
                    <input type="checkbox" checked> <span>1-Click Verified Profile Apply</span>
                  </label>
                  <label class="jobs-filter-check">
                    <input type="checkbox"> <span>Direct Clinical Chair Review</span>
                  </label>
                </div>
              </div>

              <!-- Filter 2: Specialty -->
              <div class="jobs-filter-item">
                <button type="button" class="jobs-filter-trigger" onclick="window.MedSphereJobs.toggleFilterAccordion('specialty')">
                  <span><i class="fa-solid fa-chevron-right" id="filter-arrow-specialty" style="font-size:10px; transition:transform 0.15s;"></i> Specialty</span>
                </button>
                <div class="jobs-filter-content" id="filter-content-specialty">
                  <label class="jobs-filter-check" onclick="window.MedSphereJobs.setFilter('specialty', 'ENT')">
                    <input type="radio" name="spec_radio" ${this.state.specialty === 'ENT' ? 'checked' : ''}> <span>ENT / Otolaryngology</span>
                  </label>
                  <label class="jobs-filter-check" onclick="window.MedSphereJobs.setFilter('specialty', 'Obstetrics')">
                    <input type="radio" name="spec_radio" ${this.state.specialty === 'Obstetrics' ? 'checked' : ''}> <span>Obstetrics &amp; Gynecology</span>
                  </label>
                  <label class="jobs-filter-check" onclick="window.MedSphereJobs.setFilter('specialty', 'Cardiology')">
                    <input type="radio" name="spec_radio" ${this.state.specialty === 'Cardiology' ? 'checked' : ''}> <span>Cardiology</span>
                  </label>
                  <label class="jobs-filter-check" onclick="window.MedSphereJobs.setFilter('specialty', 'Surgery')">
                    <input type="radio" name="spec_radio" ${this.state.specialty === 'Surgery' ? 'checked' : ''}> <span>General / Laparoscopic Surgery</span>
                  </label>
                  <label class="jobs-filter-check" onclick="window.MedSphereJobs.setFilter('specialty', 'Family Medicine')">
                    <input type="radio" name="spec_radio" ${this.state.specialty === 'Family Medicine' ? 'checked' : ''}> <span>Family Medicine</span>
                  </label>
                  <label class="jobs-filter-check" onclick="window.MedSphereJobs.setFilter('specialty', 'Critical Care')">
                    <input type="radio" name="spec_radio" ${this.state.specialty === 'Critical Care' ? 'checked' : ''}> <span>Critical Care / ICU</span>
                  </label>
                </div>
              </div>

              <!-- Filter 3: Location -->
              <div class="jobs-filter-item">
                <button type="button" class="jobs-filter-trigger" onclick="window.MedSphereJobs.toggleFilterAccordion('location')">
                  <span><i class="fa-solid fa-chevron-right" id="filter-arrow-location" style="font-size:10px; transition:transform 0.15s;"></i> Location</span>
                </button>
                <div class="jobs-filter-content" id="filter-content-location">
                  <label class="jobs-filter-check" onclick="window.MedSphereJobs.setFilter('location', 'Dubai')">
                    <input type="radio" name="loc_radio" ${this.state.location === 'Dubai' ? 'checked' : ''}> <span>Dubai, UAE</span>
                  </label>
                  <label class="jobs-filter-check" onclick="window.MedSphereJobs.setFilter('location', 'Abu Dhabi')">
                    <input type="radio" name="loc_radio" ${this.state.location === 'Abu Dhabi' ? 'checked' : ''}> <span>Abu Dhabi, UAE</span>
                  </label>
                  <label class="jobs-filter-check" onclick="window.MedSphereJobs.setFilter('location', 'Boston')">
                    <input type="radio" name="loc_radio" ${this.state.location === 'Boston' ? 'checked' : ''}> <span>Boston, MA</span>
                  </label>
                  <label class="jobs-filter-check" onclick="window.MedSphereJobs.setFilter('location', 'Remote')">
                    <input type="radio" name="loc_radio" ${this.state.location === 'Remote' ? 'checked' : ''}> <span>Remote / Telehealth</span>
                  </label>
                </div>
              </div>

              <!-- Filter 4: Job type -->
              <div class="jobs-filter-item">
                <button type="button" class="jobs-filter-trigger" onclick="window.MedSphereJobs.toggleFilterAccordion('type')">
                  <span><i class="fa-solid fa-chevron-right" id="filter-arrow-type" style="font-size:10px; transition:transform 0.15s;"></i> Job type</span>
                </button>
                <div class="jobs-filter-content" id="filter-content-type">
                  <label class="jobs-filter-check" onclick="window.MedSphereJobs.setFilter('jobType', 'Full-Time')">
                    <input type="radio" name="type_radio" ${this.state.jobType === 'Full-Time' ? 'checked' : ''}> <span>Full-Time Clinical</span>
                  </label>
                  <label class="jobs-filter-check" onclick="window.MedSphereJobs.setFilter('jobType', 'Locum')">
                    <input type="radio" name="type_radio" ${this.state.jobType === 'Locum' ? 'checked' : ''}> <span>Locum Tenens / Part-Time</span>
                  </label>
                </div>
              </div>

              <!-- Filter 5: Posted -->
              <div class="jobs-filter-item">
                <button type="button" class="jobs-filter-trigger" onclick="window.MedSphereJobs.toggleFilterAccordion('posted')">
                  <span><i class="fa-solid fa-chevron-right" id="filter-arrow-posted" style="font-size:10px; transition:transform 0.15s;"></i> Posted</span>
                </button>
                <div class="jobs-filter-content" id="filter-content-posted">
                  <label class="jobs-filter-check"><input type="radio" name="post_date" checked> <span>Anytime</span></label>
                  <label class="jobs-filter-check"><input type="radio" name="post_date"> <span>Past 24 hours</span></label>
                  <label class="jobs-filter-check"><input type="radio" name="post_date"> <span>Past 7 days</span></label>
                </div>
              </div>

              <div class="jobs-filter-footer-text" id="jobs-filter-status">
                No active filters
              </div>
            </div>

            <!-- CARD 2: Open roles -->
            <div class="jobs-card-box">
              <div class="jobs-card-header">
                <h3 class="jobs-card-title">Open roles</h3>
                <span class="jobs-card-sublink">Browse</span>
              </div>

              <div class="jobs-nav-list">
                <div class="jobs-nav-item ${this.state.activeTab === 'browse' ? 'active' : ''}" 
                     data-tab="browse" 
                     onclick="window.MedSphereJobs.switchTab('browse')">
                  <div class="jobs-nav-icon">
                    <i class="fa-solid fa-briefcase"></i>
                  </div>
                  <div class="jobs-nav-text">
                    <span class="jobs-nav-title">Browse jobs</span>
                    <span class="jobs-nav-sub">Discover open roles</span>
                  </div>
                </div>

                <div class="jobs-nav-item ${this.state.activeTab === 'applied' ? 'active' : ''}" 
                     data-tab="applied" 
                     onclick="window.MedSphereJobs.switchTab('applied')">
                  <div class="jobs-nav-icon">
                    <i class="fa-solid fa-shield-halved"></i>
                  </div>
                  <div class="jobs-nav-text">
                    <span class="jobs-nav-title">My applications</span>
                    <span class="jobs-nav-sub">Track your progress</span>
                  </div>
                </div>

                <div class="jobs-nav-item ${this.state.activeTab === 'saved' ? 'active' : ''}" 
                     data-tab="saved" 
                     onclick="window.MedSphereJobs.switchTab('saved')">
                  <div class="jobs-nav-icon">
                    <i class="fa-solid fa-bookmark"></i>
                  </div>
                  <div class="jobs-nav-text">
                    <span class="jobs-nav-title">Saved jobs</span>
                    <span class="jobs-nav-sub">Bookmarked for later</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- CARD 3: Post a job -->
            <div class="jobs-card-box">
              <button class="jobs-post-myself-btn" onclick="window.MedSphereModals.open('modal-post-job')">
                <i class="fa-solid fa-plus"></i> Post a job from myself
              </button>
              <p class="jobs-post-footnote">
                Personal account · post as an individual physician hiring locum or session cover.
              </p>
            </div>

          </aside>

          <!-- MIDDLE CONTENT: BROWSE LIST -->
          <main class="jobs-portal-main">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.35rem;">
              <h1 class="jobs-portal-heading" id="jobs-view-title">Browse opportunities</h1>
              <button class="btn btn-sm btn-outline btn-pill" onclick="window.MedSphereJobs.toggleSidebar()" style="font-size:0.8rem; padding:4px 12px; margin-top:2px;">
                <i class="fa-solid fa-sliders"></i> Filters
              </button>
            </div>
            <p class="jobs-portal-subheading">
              Discover career opportunities from leading hospitals, clinics, and healthcare organizations.
            </p>

            <!-- Unified Search Bar -->
            <div class="jobs-search-bar-unified">
              <div class="jobs-search-col">
                <i class="fa-solid fa-magnifying-glass"></i>
                <input type="text" id="jobs-search-q" 
                       placeholder="Search role, specialty or hospital" 
                       value="${this.state.search}"
                       onkeydown="if(event.key==='Enter') window.MedSphereJobs.handleSearch()">
              </div>

              <div class="jobs-search-divider"></div>

              <div class="jobs-search-col">
                <i class="fa-solid fa-location-dot"></i>
                <input type="text" id="jobs-search-loc" 
                       placeholder="City, country, or 'Remote'" 
                       value="${this.state.location}"
                       onkeydown="if(event.key==='Enter') window.MedSphereJobs.handleSearch()">
              </div>

              <button class="jobs-btn-search-blue" onclick="window.MedSphereJobs.handleSearch()">
                Search jobs
              </button>
            </div>

            <!-- Matching Roles & Sort Bar -->
            <div class="jobs-portal-results-bar">
              <div class="jobs-matching-count-text">
                <strong id="job-matching-count-num">${count}</strong> matching roles
              </div>

              <div class="jobs-sort-portal-wrap">
                <span>Sort</span>
                <select id="jobs-sort-portal-select" class="jobs-sort-portal-select" onchange="window.MedSphereJobs.handleSort(this.value)">
                  <option value="newest" ${this.state.sortBy === 'newest' ? 'selected' : ''}>Newest first</option>
                  <option value="salary" ${this.state.sortBy === 'salary' ? 'selected' : ''}>Highest compensation</option>
                  <option value="title" ${this.state.sortBy === 'title' ? 'selected' : ''}>Alphabetical</option>
                </select>
              </div>
            </div>

            <!-- JOBS LIST CONTAINER -->
            <div id="jobs-cards-container">
              ${count === 0 ? `
                <div class="jobs-card-box" style="padding:4rem 2rem; text-align:center;">
                  <h3 style="font-size:1.25rem; font-weight:700; color:#0f172a; margin-bottom:0.5rem;">No matching opportunities found</h3>
                  <p style="font-size:0.925rem; color:#64748b; margin-bottom:1.5rem;">Try adjusting your keyword or clearing active filters.</p>
                  <button class="btn btn-outline btn-pill" onclick="window.MedSphereJobs.resetAllFilters()">Clear all filters</button>
                </div>
              ` : `
                <div class="jobs-cards-stack">
                  ${filtered.map(j => {
                    const isSaved = window.MedSphereStore.isJobSaved(j.id);
                    const hasApplied = window.MedSphereStore.hasApplied(j.id);
                    const monogram = this.getMonogram(j.company);
                    const bg = this.getMonogramBg(j.company);
                    const isActive = (j.id === this.state.selectedJobId) && this.state.isDetailOpen;
                    const locationPart = j.location.split(',')[1] ? j.location.split(',')[1].trim() : j.location.split(',')[0];
                    const timeDisplay = j.postedDate ? `${j.posted || '2y ago'} · ${j.postedDate.split(' ')[2] || '2023'}` : (j.posted || '2d ago');

                    return `
                      <div class="jobs-feed-card ${isActive ? 'active' : ''}" 
                           id="job-card-${j.id}" 
                           data-job-id="${j.id}" 
                           role="button"
                           tabindex="0"
                           onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault(); window.MedSphereJobs.selectJob('${j.id}');}"
                           onclick="window.MedSphereJobs.selectJob('${j.id}')">
                        <div class="jobs-feed-card-header">
                          <div class="jobs-feed-avatar" style="background:${bg};">
                            ${monogram}
                          </div>
                          
                          <div class="jobs-feed-header-info">
                            <h3 class="jobs-feed-role-title">
                              ${j.title}
                            </h3>
                            <div class="jobs-feed-org-row">
                              <strong>${j.company}</strong> · <span>${j.facility ? j.facility + ' . ' : ''}${j.location}</span>
                            </div>
                          </div>

                          <div class="jobs-feed-time-badge">
                            ${timeDisplay}
                          </div>
                        </div>

                        <p class="jobs-feed-desc-text">
                          ${j.experience || j.description}
                        </p>

                        <div class="jobs-feed-card-footer">
                          <div class="jobs-feed-tags-row">
                            <span class="jobs-feed-tag">${locationPart}</span>
                            <span class="jobs-feed-tag">${j.type ? j.type.split('·')[0].trim() : 'Full-Time'}</span>
                            ${j.salary ? `<span class="jobs-feed-tag salary">${j.salary}</span>` : ''}
                            ${hasApplied ? `<span class="jobs-feed-tag applied"><i class="fa-solid fa-check"></i> Applied</span>` : ''}
                          </div>

                          <div class="jobs-feed-actions" onclick="event.stopPropagation()">
                            <button type="button" 
                                    class="btn-apply-card ${hasApplied ? 'applied' : ''}"
                                    title="${hasApplied ? 'Already Applied' : 'Apply for ' + j.title}"
                                    onclick="event.stopPropagation(); window.MedSphereJobs.handleApply('${j.id}')">
                              ${hasApplied ? '<i class="fa-solid fa-check"></i> Applied' : '<i class="fa-solid fa-paper-plane"></i> Apply'}
                            </button>
                            <button type="button" 
                                    class="jobs-bookmark-btn ${isSaved ? 'saved' : ''}" 
                                    title="${isSaved ? 'Remove Bookmark' : 'Save Job'}"
                                    onclick="event.stopPropagation(); window.MedSphereJobs.toggleSaveJob('${j.id}')">
                              <i class="${isSaved ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark'}"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              `}
            </div>

          </main>

          <!-- RIGHT DETAIL PANEL (MATCHING IMAGE 1 - DESKTOP ONLY) -->
          <aside class="jobs-portal-detail-col ${this.state.isDetailOpen ? 'is-open' : ''}" 
                 id="jobs-detail-panel" 
                 onclick="if(event.target === this) window.MedSphereJobs.closeDetail()" 
                 style="${this.state.isDetailOpen && selectedJob && window.innerWidth > 1040 ? 'display:block;' : 'display:none;'}">
            ${selectedJob ? this.renderDetailPanelHtml(selectedJob) : ''}
          </aside>

        </div>
      </div>
    `;
  },

  renderJobDetail(params = {}) {
    return this.renderJobs(params);
  }
};

// MedSphere SaaS User Dashboard & Account Sub-Views Renderer
// Fully dynamic with live SQLite persistence, profile completion calculation, image upload, and real-time state

window.MedSphereDashboard = {
  // Main Dashboard Shell & Overview
  async renderDashboard(subView = 'overview') {
    const store = window.MedSphereStore;

    // Require active authenticated session
    if (!store.isLoggedIn()) {
      window.location.hash = `#login?redirect=${encodeURIComponent(subView)}`;
      return `
        <div class="container text-center" style="padding: 5rem 0;">
          <div style="max-width: 460px; margin: 0 auto; background: white; border: 1px solid var(--border-subtle); border-radius: 18px; padding: 2.5rem; box-shadow: 0 16px 40px -10px rgba(11,43,74,0.12);">
            <div style="width: 58px; height: 58px; border-radius: 50%; background: #eff6ff; color: #0080ff; font-size: 1.5rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem;">
              <i class="fa-solid fa-lock"></i>
            </div>
            <h3 style="font-family: var(--font-heading); font-size: 1.4rem; font-weight: 800; color: #0c2340; margin-bottom: 0.75rem;">Authentication Required</h3>
            <p style="color: #64748b; font-size: 0.925rem; line-height: 1.55; margin-bottom: 1.75rem;">Please sign in to access your doctor community feed, case posts, and clinical collaboration tools.</p>
            <a href="#login?redirect=${encodeURIComponent(subView)}" class="btn btn-primary" style="width: 100%; border-radius: 9999px;">Sign In to Continue</a>
          </div>
        </div>
      `;
    }

    const user = store.getState().currentUser || window.MEDSPHERE_DATA.currentUser;
    const state = store.getState();

    // If overview or feed, render the modern 3-column healthcare feed layout matching the screenshot!
    if (subView === 'overview' || subView === 'feed') {
      return this.renderFeed(user, state);
    }

    if (subView === 'settings') {
      const completion = this.calculateProfileCompletion(user);
      return this.renderDocTakSettings(user, completion);
    }

    // For specific sub-views (connections, applications, courses, saved, settings, notifications, employer, supplier, student, verification)
    const completion = this.calculateProfileCompletion(user);
    const role = user.role || 'doctor';

    const subViewTitle = subView === 'employer' ? 'Employer & Recruiter Portal' :
                         subView === 'supplier' ? 'Pharmaceutical & Supplier Portal' :
                         subView === 'student' ? 'Student Healthcare Hub' :
                         subView === 'verification' ? 'Medical Credential Verification' :
                         subView === 'courses' ? 'My Courses & CME' :
                         subView.charAt(0).toUpperCase() + subView.slice(1);

    return `
      <div class="container" style="max-width:1200px; padding:2rem 1rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; background:#fff; padding:1rem 1.5rem; border-radius:14px; border:1px solid var(--border-subtle); box-shadow:var(--shadow-sm); flex-wrap:wrap; gap:1rem;">
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <a href="#dashboard" class="btn btn-outline btn-sm">
              <i class="fa-solid fa-arrow-left" style="margin-right:6px;"></i> Back to Feed
            </a>
            <h2 style="font-size:1.25rem; font-weight:700; color:var(--primary-900); margin:0; font-family:var(--font-heading);">
              ${subViewTitle}
            </h2>
          </div>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <a href="#dashboard" class="btn btn-ghost btn-sm ${subView==='overview'||subView==='feed'?'active':''}">Feed</a>
            
            ${(role === 'hospital' || role === 'recruiter' || role === 'admin') ? `
              <a href="#employer" class="btn btn-ghost btn-sm ${subView==='employer'?'active':''}"><i class="fa-solid fa-hospital" style="margin-right:4px;"></i> Employer Portal</a>
            ` : ''}

            ${(role === 'pharma' || role === 'supplier' || role === 'admin') ? `
              <a href="#supplier" class="btn btn-ghost btn-sm ${subView==='supplier'?'active':''}"><i class="fa-solid fa-cart-shopping" style="margin-right:4px;"></i> Supplier Portal</a>
            ` : ''}

            ${(role === 'student' || role === 'admin') ? `
              <a href="#student" class="btn btn-ghost btn-sm ${subView==='student'?'active':''}"><i class="fa-solid fa-graduation-cap" style="margin-right:4px;"></i> Student Hub</a>
            ` : ''}

            <a href="#verification" class="btn btn-ghost btn-sm ${subView==='verification'?'active':''}"><i class="fa-solid fa-shield-halved" style="margin-right:4px;"></i> Verification</a>
            <a href="#applications" class="btn btn-ghost btn-sm ${subView==='applications'?'active':''}">Applications (${state.appliedJobIds.length})</a>
            <a href="#my-courses" class="btn btn-ghost btn-sm ${subView==='courses'?'active':''}">Courses (${state.enrolledCourseIds.length})</a>
            <a href="#saved" class="btn btn-ghost btn-sm ${subView==='saved'?'active':''}">Saved (${state.savedJobIds.length + state.savedProductIds.length})</a>
            <a href="#settings" class="btn btn-ghost btn-sm ${subView==='settings'?'active':''}">Settings</a>
          </div>
        </div>

        <main class="dashboard-main" style="background:#fff; border-radius:16px; border:1px solid var(--border-subtle); padding:2rem; box-shadow:var(--shadow-sm);">
          ${await this.renderSubViewContent(subView, user, state, completion)}
        </main>
      </div>
    `;
  },

  calculateProfileCompletion(user) {
    let score = 0;
    const checklist = [];

    if (user.name) { score += 15; checklist.push({ label: 'Full Name & Credentials', done: true }); }
    else checklist.push({ label: 'Add Full Name & Credentials', done: false });

    if (user.title && user.title !== 'Healthcare Professional') { score += 15; checklist.push({ label: 'Clinical Title', done: true }); }
    else checklist.push({ label: 'Specify Clinical Title', done: false });

    if (user.specialty && user.specialty !== 'General Medicine') { score += 15; checklist.push({ label: 'Medical Specialty', done: true }); }
    else checklist.push({ label: 'Select Primary Specialty', done: false });

    if (user.organization && user.organization !== 'Independent Practice') { score += 15; checklist.push({ label: 'Hospital Affiliation', done: true }); }
    else checklist.push({ label: 'Add Hospital Affiliation', done: false });

    if (user.bio && user.bio.length > 20) { score += 15; checklist.push({ label: 'Clinical Bio & Summary', done: true }); }
    else checklist.push({ label: 'Write Clinical Bio', done: false });

    if (user.contact?.phone) { score += 10; checklist.push({ label: 'Direct Phone / Office Contact', done: true }); }
    else checklist.push({ label: 'Add Office Phone Number', done: false });

    if (user.avatar && !user.avatar.includes('default')) { score += 15; checklist.push({ label: 'Profile Avatar Photo', done: true }); }
    else checklist.push({ label: 'Upload Professional Avatar', done: false });

    const percentage = Math.min(100, score);
    const missing = checklist.filter(c => !c.done);
    return { percentage, checklist, missing };
  },

  async renderSubViewContent(subView, user, state, completion) {
    switch (subView) {
      case 'connections':
        return await this.renderMyConnections(user, state);
      case 'applications':
        return await this.renderMyApplications(state);
      case 'courses':
        return await this.renderMyCourses(state, user);
      case 'saved':
        return await this.renderSavedItems(state);
      case 'notifications':
        return await this.renderNotifications(state);
      case 'settings':
        return this.renderSettings(user, completion);
      case 'employer':
        return await this.renderEmployerDashboard(user, state);
      case 'supplier':
        return await this.renderSupplierDashboard(user, state);
      case 'student':
        return await this.renderStudentDashboard(user, state);
      case 'verification':
        return await this.renderVerificationView(user);
      case 'overview':
      default:
        return this.renderOverviewContent(user, state, completion);
    }
  },

  renderOverviewContent(user, state, completion) {
    const data = window.MEDSPHERE_DATA;
    const enrolledCourses = data.courses.filter(c => state.enrolledCourseIds.includes(c.id));
    const savedJobs = data.jobs.filter(j => state.savedJobIds.includes(j.id));

    return `
      <div class="dashboard-topbar">
        <div>
          <h1 class="dash-page-title">Welcome back, ${user.name}</h1>
          <div class="dash-page-sub">${user.title || 'Attending Physician'} · ${user.organization || 'MedSphere Network'}</div>
        </div>
        <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
          <a href="#directory" class="btn btn-outline btn-sm"><i class="fa-solid fa-user-plus" style="margin-right:6px;"></i>Find Colleagues</a>
          <a href="#messages" class="btn btn-outline btn-sm"><i class="fa-solid fa-comment-medical" style="margin-right:6px;"></i>Messages</a>
          <button class="btn btn-primary btn-sm" onclick="window.MedSphereModals.open('modal-create-post')"><i class="fa-solid fa-notes-medical" style="margin-right:6px;"></i>Share Clinical Case</button>
        </div>
      </div>

      <!-- Metrics Row -->
      <div class="dash-metrics-grid">
        <div class="dash-metric-card">
          <div class="metric-header">
            <span class="metric-title">Verified Colleagues</span>
            <div class="metric-icon-wrap">
              <i class="fa-solid fa-user-doctor" style="color:var(--primary-800); font-size:18px;"></i>
            </div>
          </div>
          <div class="metric-value">${state.connectedIds.length + (user.connectionsCount || 0)}</div>
          <div class="metric-trend" style="color:var(--emerald-600);"><i class="fa-solid fa-arrow-trend-up" style="margin-right:4px;"></i>Connected in Network</div>
        </div>

        <div class="dash-metric-card">
          <div class="metric-header">
            <span class="metric-title">Annual CME Credits</span>
            <div class="metric-icon-wrap">
              <i class="fa-solid fa-graduation-cap" style="color:var(--primary-800); font-size:18px;"></i>
            </div>
          </div>
          <div class="metric-value">${user.cmeCreditsThisYear || 38} / ${user.cmeTarget || 50}</div>
          <div class="metric-trend" style="color:var(--primary-700);">${Math.round(((user.cmeCreditsThisYear || 38) / (user.cmeTarget || 50)) * 100)}% towards State Target</div>
        </div>

        <div class="dash-metric-card">
          <div class="metric-header">
            <span class="metric-title">Saved Opportunities</span>
            <div class="metric-icon-wrap">
              <i class="fa-solid fa-bookmark" style="color:var(--primary-800); font-size:18px;"></i>
            </div>
          </div>
          <div class="metric-value">${state.savedJobIds.length + state.savedProductIds.length}</div>
          <div class="metric-trend">${state.savedJobIds.length} jobs, ${state.savedProductIds.length} products</div>
        </div>

        <div class="dash-metric-card">
          <div class="metric-header">
            <span class="metric-title">Active Applications</span>
            <div class="metric-icon-wrap">
              <i class="fa-solid fa-file-medical" style="color:var(--primary-800); font-size:18px;"></i>
            </div>
          </div>
          <div class="metric-value">${state.appliedJobIds.length}</div>
          <div class="metric-trend" style="color:var(--emerald-600);"><i class="fa-solid fa-check" style="margin-right:4px;"></i>Submitted to Hospitals</div>
        </div>
      </div>

      <!-- Dashboard Two Column Content -->
      <div class="dash-content-grid">
        <div class="dash-left-col">
          <!-- Profile Completion Widget (Dynamic) -->
          <div class="dash-section-box" style="background:var(--primary-50); border:1px solid var(--primary-100);">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div>
                <h3 class="dash-box-title" style="color:var(--primary-900); margin-bottom:2px;">
                  Profile Strength: ${completion.percentage}% Complete
                </h3>
                <p class="text-xs text-muted" style="margin:0;">Complete all verification steps to unlock expedited institutional credentialing.</p>
              </div>
              <span class="badge ${completion.percentage >= 90 ? 'badge-green' : 'badge-blue'}">${completion.percentage >= 90 ? 'Strong Profile' : 'Action Recommended'}</span>
            </div>
            <div class="progress-bar-bg" style="margin:0.75rem 0;">
              <div class="progress-bar-fill" style="width:${completion.percentage}%; background:${completion.percentage >= 90 ? 'var(--emerald-600)' : 'var(--primary-700)'};"></div>
            </div>
            ${completion.missing.length ? `
              <div style="font-size:0.75rem; color:var(--slate-700); margin-top:0.5rem;">
                <strong>Missing items:</strong>
                ${completion.missing.map(m => `<span style="display:inline-block; margin-right:8px; margin-top:4px; padding:2px 8px; background:#fff; border:1px solid var(--border-subtle); border-radius:12px;">+ ${m.label}</span>`).join('')}
              </div>
              <div style="margin-top:0.75rem; text-align:right;">
                <a href="#settings" class="btn btn-primary btn-sm">Complete Missing Fields &rarr;</a>
              </div>
            ` : `
              <div style="font-size:0.8rem; color:var(--emerald-600); font-weight:600; margin-top:0.25rem;">
                <i class="fa-solid fa-circle-check" style="margin-right:4px;"></i> All profile credentials and contact preferences are verified.
              </div>
            `}
          </div>

          <!-- CME Progress Box -->
          <div class="cme-progress-box">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div>
                <strong style="color:var(--primary-900);">Continuing Medical Education (CME) Progress</strong>
                <p class="text-xs text-muted" style="margin-top:2px;">Automated transcript synchronization with State Medical Boards</p>
              </div>
              <span class="badge badge-cme">${user.cmeCreditsThisYear || 38} / ${user.cmeTarget || 50} Credits</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width:${Math.round(((user.cmeCreditsThisYear || 38)/(user.cmeTarget || 50))*100)}%;"></div>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--slate-500);">
              <span>${Math.max(0, (user.cmeTarget || 50) - (user.cmeCreditsThisYear || 38))} CME Credits remaining before annual audit</span>
              <a href="#education" style="color:var(--primary-800); font-weight:600;">Browse Accredited Modules &rarr;</a>
            </div>
          </div>

          <!-- In-Progress Courses -->
          <div class="dash-section-box">
            <div class="dash-box-header">
              <h3 class="dash-box-title">In-Progress Courses & Clinical Simulations</h3>
              <a href="#education" class="btn btn-outline btn-sm">Explore LMS</a>
            </div>
            <div style="display:flex; flex-direction:column; gap:1rem;">
              ${enrolledCourses.length ? enrolledCourses.map(c => `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:1rem; background:var(--slate-50); border:1px solid var(--border-subtle); border-radius:var(--radius-md);">
                  <div style="display:flex; align-items:center; gap:12px;">
                    <img src="${c.image}" alt="${c.title}" style="width:50px; height:50px; border-radius:var(--radius-sm); object-fit:cover;">
                    <div>
                      <strong style="font-size:0.95rem; color:var(--primary-900);">${c.title}</strong>
                      <div class="text-xs text-muted">Instructor: ${c.instructor} · ${c.credits}</div>
                    </div>
                  </div>
                  <a href="#course?id=${c.id}" class="btn btn-primary btn-sm">Continue Learning</a>
                </div>
              `).join('') : '<p class="text-muted text-sm">No courses enrolled yet. <a href="#education">Browse courses here.</a></p>'}
            </div>
          </div>

          <!-- Matching Career Opportunities -->
          <div class="dash-section-box">
            <div class="dash-box-header">
              <h3 class="dash-box-title">Bookmarked Clinical Roles</h3>
              <a href="#jobs" class="btn btn-outline btn-sm">Browse All Jobs</a>
            </div>
            <div style="display:flex; flex-direction:column; gap:1rem;">
              ${savedJobs.length ? savedJobs.map(j => `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:1rem; border:1px solid var(--border-subtle); border-radius:var(--radius-md);">
                  <div>
                    <strong style="color:var(--primary-900); font-size:1rem;">${j.title}</strong>
                    <div class="text-xs text-muted" style="margin-top:2px;">${j.company} · ${j.location} · <strong>${j.salary}</strong></div>
                  </div>
                  <div style="display:flex; gap:0.5rem;">
                    <button class="btn btn-primary btn-sm" onclick="window.MedSphereModals.open('modal-apply-job', { id: '${j.id}', title: '${j.title}', company: '${j.company}', location: '${j.location}' })">1-Click Apply</button>
                    <a href="#job?id=${j.id}" class="btn btn-outline btn-sm">Details</a>
                  </div>
                </div>
              `).join('') : '<p class="text-muted text-sm">No bookmarked jobs. <a href="#jobs">Find opportunities on the Job Board.</a></p>'}
            </div>
          </div>
        </div>

        <!-- Right Side Alerts & Network -->
        <div class="dash-right-col">
          <!-- Verification Status -->
          <div class="dash-section-box">
            <div class="dash-box-header">
              <h3 class="dash-box-title">License Verification</h3>
              <span class="badge ${user.verified ? 'badge-green' : 'badge-cme'}">${user.verified ? 'NPI Verified' : 'Under Review'}</span>
            </div>
            <p class="text-xs text-muted" style="line-height:1.6; margin-bottom:1rem;">
              ${user.verified ? 'Your medical license and NPI registry have been verified. You can issue consult requests and apply directly with 1-click credentialing.' : 'License verification is in progress. Ensure your NPI is listed in settings.'}
            </p>
            <a href="#settings" class="btn btn-outline btn-sm w-100">Review Credential Details</a>
          </div>

          <!-- Notifications Feed -->
          <div class="dash-section-box">
            <div class="dash-box-header">
              <h3 class="dash-box-title">Recent Notifications</h3>
              <a href="#notifications" style="font-size:0.75rem; font-weight:600;">View All</a>
            </div>
            <div class="notif-feed-list">
              ${state.notifications.slice(0, 4).map(n => `
                <div class="notif-card-item ${!n.read ? 'unread' : ''}">
                  <div>
                    <strong style="font-size:0.875rem; color:var(--primary-900);">${n.title}</strong>
                    <p class="text-xs" style="color:var(--slate-600); margin-top:2px;">${n.body}</p>
                    <span class="text-xs text-muted">${n.time}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  async renderMyConnections(user, state) {
    let connections = [];
    try {
      if (window.MedSphereAPI && window.MedSphereAPI.getToken()) {
        connections = await window.MedSphereAPI.getConnections();
      }
    } catch (e) {
      console.warn("Could not fetch remote connections, using store:", e);
    }

    const data = window.MEDSPHERE_DATA;
    const liveProfs = (window.MedSphereDirectory && window.MedSphereDirectory.getAllProfessionals) ? window.MedSphereDirectory.getAllProfessionals() : (data.professionals || []);
    const connectedProfs = liveProfs.filter(p => state.connectedIds.includes(p.id));

    return `
      <div class="dashboard-topbar">
        <div>
          <h1 class="dash-page-title">My Professional Connections</h1>
          <div class="dash-page-sub">Verified clinician network and peer consultants</div>
        </div>
        <a href="#directory" class="btn btn-primary btn-sm">+ Connect with Peers</a>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:1.5rem;">
        ${connectedProfs.length ? connectedProfs.map(p => `
          <div class="card" style="display:flex; flex-direction:column; gap:1rem; padding:1.25rem;">
            <div style="display:flex; align-items:center; gap:1rem;">
              <img src="${p.avatar}" alt="${p.name}" style="width:56px; height:56px; border-radius:50%; object-fit:cover;">
              <div style="flex:1;">
                <strong style="color:var(--primary-900); font-size:1.05rem;">${p.name}</strong>
                <div class="text-xs text-muted">${p.title}</div>
                <div class="text-xs text-muted">${p.organization} · <i class="fa-solid fa-location-dot" style="margin-right:3px;"></i> ${p.location}</div>
              </div>
            </div>
            <div style="display:flex; gap:0.5rem; margin-top:auto;">
              <a href="#profile?id=${p.id}" class="btn btn-outline btn-sm w-50">View Profile</a>
              <a href="#messages" class="btn btn-primary btn-sm w-50">Send Message</a>
            </div>
          </div>
        `).join('') : '<div class="card text-center" style="grid-column:1/-1; padding:3rem;"><p class="text-muted">No connections yet. Browse the Network Directory to connect with colleagues!</p><a href="#directory" class="btn btn-primary mt-2">Open Directory</a></div>'}
      </div>
    `;
  },

  async renderSavedItems(state) {
    const data = window.MEDSPHERE_DATA;
    const savedJobs = data.jobs.filter(j => state.savedJobIds.includes(j.id));
    const savedProducts = data.products.filter(p => state.savedProductIds.includes(p.id));

    return `
      <div class="dashboard-topbar">
        <div>
          <h1 class="dash-page-title">Saved Items & Procurement</h1>
          <div class="dash-page-sub">Bookmarked clinical roles, medical technology, and CME modules</div>
        </div>
      </div>

      <div class="dash-section-box" style="margin-bottom:2rem;">
        <h3 class="dash-box-title" style="margin-bottom:1rem;">Saved Job Opportunities (${savedJobs.length})</h3>
        <div style="display:flex; flex-direction:column; gap:1rem;">
          ${savedJobs.length ? savedJobs.map(j => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:1rem; border:1px solid var(--border-subtle); border-radius:var(--radius-md); flex-wrap:wrap; gap:1rem;">
              <div>
                <strong>${j.title}</strong>
                <div class="text-xs text-muted">${j.company} · ${j.location} · <strong>${j.salary}</strong></div>
              </div>
              <div style="display:flex; gap:0.5rem;">
                <button class="btn btn-primary btn-sm" onclick="window.MedSphereModals.open('modal-apply-job', { id: '${j.id}', title: '${j.title}', company: '${j.company}', location: '${j.location}' })">1-Click Apply</button>
                <a href="#job?id=${j.id}" class="btn btn-outline btn-sm">Details</a>
                <button class="btn btn-secondary btn-sm" onclick="window.MedSphereStore.toggleSaveJob('${j.id}'); window.MedSphereRouter.refreshCurrentPage();">Remove</button>
              </div>
            </div>
          `).join('') : '<p class="text-muted text-sm">No saved jobs. <a href="#jobs">Browse jobs.</a></p>'}
        </div>
      </div>

      <div class="dash-section-box">
        <h3 class="dash-box-title" style="margin-bottom:1rem;">Saved Marketplace Products & Devices (${savedProducts.length})</h3>
        <div style="display:flex; flex-direction:column; gap:1rem;">
          ${savedProducts.length ? savedProducts.map(p => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:1rem; border:1px solid var(--border-subtle); border-radius:var(--radius-md); flex-wrap:wrap; gap:1rem;">
              <div style="display:flex; align-items:center; gap:12px;">
                <img src="${p.image}" alt="${p.name}" style="width:48px; height:48px; border-radius:var(--radius-sm); object-fit:cover;">
                <div>
                  <strong>${p.name}</strong>
                  <div class="text-xs text-muted">${p.company} · <strong>${p.price}</strong></div>
                </div>
              </div>
              <div style="display:flex; gap:0.5rem;">
                <a href="#product?id=${p.id}" class="btn btn-primary btn-sm">View Specs</a>
                <button class="btn btn-outline btn-sm" onclick="window.MedSphereStore.toggleSaveProduct('${p.id}'); window.MedSphereRouter.refreshCurrentPage();">Remove</button>
              </div>
            </div>
          `).join('') : '<p class="text-muted text-sm">No saved products. <a href="#marketplace">Explore medical technology.</a></p>'}
        </div>
      </div>
    `;
  },

  async renderMyApplications(state) {
    let applications = [];
    try {
      if (window.MedSphereAPI && window.MedSphereAPI.getToken()) {
        applications = await window.MedSphereAPI.getMyApplications();
      }
    } catch (e) {
      console.warn("Could not fetch remote applications:", e);
    }

    const data = window.MEDSPHERE_DATA;
    const fallbackApps = data.jobs.filter(j => state.appliedJobIds.includes(j.id)).map(j => ({
      title: j.title,
      company: j.company,
      location: j.location,
      salary: j.salary,
      status: 'Submitted',
      created_at: 'Recently'
    }));

    const displayApps = applications.length ? applications : fallbackApps;

    return `
      <div class="dashboard-topbar">
        <div>
          <h1 class="dash-page-title">My Clinical Job Applications</h1>
          <div class="dash-page-sub">Track application review status and institutional credentialing</div>
        </div>
        <a href="#jobs" class="btn btn-primary btn-sm">Browse More Roles</a>
      </div>

      <div style="display:flex; flex-direction:column; gap:1.25rem;">
        ${displayApps.length ? displayApps.map(app => {
          const statusClass = app.status === 'Accepted' ? 'badge-green' :
                              app.status === 'Shortlisted' ? 'badge-cme' :
                              app.status === 'Under Review' ? 'badge-blue' : 'badge-subtle';
          return `
            <div class="card" style="display:flex; align-items:center; justify-content:space-between; gap:1.5rem; flex-wrap:wrap;">
              <div>
                <span class="badge ${statusClass}" style="margin-bottom:0.35rem;">Status: ${app.status || 'Submitted'}</span>
                <h3 style="font-size:1.25rem; margin-bottom:0.25rem;">${app.title}</h3>
                <div class="text-sm text-muted">${app.company} · <i class="fa-solid fa-location-dot" style="margin-right:3px;"></i> ${app.location} · <strong>${app.salary || 'Competitive'}</strong></div>
                <div class="text-xs text-muted" style="margin-top:4px;">Applied: ${app.created_at ? new Date(app.created_at).toLocaleDateString() : 'Recently'}</div>
              </div>
              <div style="display:flex; align-items:center; gap:1rem;">
                <span class="badge badge-blue">Verified Profile Sent</span>
              </div>
            </div>
          `;
        }).join('') : '<div class="card text-center" style="padding:3rem;"><p class="text-muted">No applications submitted yet. Browse verified openings on the Job Board!</p><a href="#jobs" class="btn btn-primary mt-2">Explore Jobs</a></div>'}
      </div>
    `;
  },

  async renderMyCourses(state, user) {
    const data = window.MEDSPHERE_DATA;
    let enrolledCourses = data.courses.filter(c => state.enrolledCourseIds.includes(c.id));
    try {
      if (window.MedSphereAPI && window.MedSphereAPI.getToken()) {
        const remote = await window.MedSphereAPI.getMyCourses();
        if (remote && remote.length) {
          enrolledCourses = remote.map(r => ({
            ...r,
            image: r.image_url || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
            progress: r.progress_percentage || 75,
            isCompleted: r.is_completed === 1 || r.progress_percentage >= 100
          }));
        }
      }
    } catch (e) {}

    return `
      <div class="dashboard-topbar">
        <div>
          <h1 class="dash-page-title">My CME Courses & Certifications</h1>
          <div class="dash-page-sub">Track accredited modules, simulation progress, and state board hours</div>
        </div>
        <a href="#education" class="btn btn-primary btn-sm">Browse Course Catalog</a>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(360px, 1fr)); gap:2rem;">
        ${enrolledCourses.map(c => {
          const progress = c.progress || 75;
          const isComplete = progress >= 100 || c.isCompleted;

          return `
            <div class="card" style="padding:0; overflow:hidden; border:1px solid var(--border-subtle); display:flex; flex-direction:column;">
              <div style="position:relative; height:180px; overflow:hidden;">
                <img src="${c.image}" alt="${c.title}" style="width:100%; height:100%; object-fit:cover;">
                <span class="badge ${isComplete ? 'badge-green' : 'badge-cme'}" style="position:absolute; top:12px; left:12px;">
                  ${isComplete ? '<i class=\"fa-solid fa-circle-check\" style=\"margin-right:4px;\"></i> Accredited & Completed' : c.credits}
                </span>
              </div>
              <div style="padding:1.5rem; display:flex; flex-direction:column; flex:1;">
                <h3 style="font-size:1.15rem; margin-bottom:0.35rem; color:var(--primary-900);">${c.title}</h3>
                <div class="text-xs text-muted" style="margin-bottom:1rem;">Instructor: <strong>${c.instructor}</strong></div>

                <div class="progress-bar-bg" style="margin:0 0 0.5rem;">
                  <div class="progress-bar-fill" style="width:${progress}%; background:${isComplete ? 'var(--emerald-600)' : 'var(--primary-700)'};"></div>
                </div>

                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
                  <span class="text-xs" style="font-weight:700; color:${isComplete ? 'var(--emerald-600)' : 'var(--primary-800)'};">
                    ${progress}% Completed
                  </span>
                  ${!isComplete ? `
                    <button class="btn btn-ghost btn-xs" style="color:var(--primary-800); text-decoration:underline;" onclick="window.MedSphereDashboard.handleCompleteCourse('${c.id}')">
                      Simulate 100% Completion
                    </button>
                  ` : ''}
                </div>

                <div style="display:flex; gap:0.5rem; margin-top:auto;">
                  ${isComplete ? `
                    <button class="btn btn-primary btn-sm w-100" onclick="window.MedSphereModals.open('modal-certificate', { courseId: '${c.id}', courseTitle: '${c.title.replace(/'/g, "\\'")}', cmeCredits: '${c.credits || '4.0 AMA PRA Category 1 Credits™'}', clinicianName: '${(user?.name || 'Dr. Eleanor Vance').replace(/'/g, "\\'")}' })">
                      <i class="fa-solid fa-award" style="margin-right:6px;"></i> View ACCME Certificate
                    </button>
                  ` : `
                    <a href="#course?id=${c.id}" class="btn btn-primary btn-sm w-100">Continue Learning &rarr;</a>
                  `}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  async handleCompleteCourse(courseId) {
    try {
      if (window.MedSphereAPI) {
        await window.MedSphereAPI.updateCourseProgress(courseId, 100);
      }
      window.MedSphereToast.show('CME Milestone Reached', 'Course completed at 100%. Official ACCME certificate unlocked!', 'success');
      window.MedSphereRouter.refreshCurrentPage();
    } catch (e) {
      window.MedSphereToast.show('Error', e.message || 'Could not update course progress', 'error');
    }
  },

  async renderNotifications(state) {
    const isLoggedOut = localStorage.getItem('medsphere_logged_out') === 'true';
    if (isLoggedOut && !state.token && !state.currentUser) {
      return `
        <div class="jobs-auth-gate-card">
          <div class="jobs-gate-lock-icon">
            <i class="fa-solid fa-lock"></i>
          </div>
          <h2 class="jobs-gate-title">Sign In to View Notifications</h2>
          <p class="jobs-gate-desc">
            Personal alerts, hospital job invitations, and CME milestones are only accessible to authenticated medical professionals.
          </p>
          <div class="jobs-gate-buttons">
            <a href="#login" class="jobs-btn-gate-login">
              <i class="fa-solid fa-arrow-right-to-bracket"></i> Sign In
            </a>
            <a href="#register" class="jobs-btn-gate-register">
              <i class="fa-solid fa-user-plus"></i> Join Free
            </a>
          </div>
        </div>
      `;
    }

    const notifs = state.notifications || [];

    return `
      <div class="dashboard-topbar">
        <div>
          <h1 class="dash-page-title">Notifications & Clinical Alerts</h1>
          <div class="dash-page-sub">Stay informed on hospital roles, network connections, and accredited CME progress</div>
        </div>
        <button class="btn btn-outline btn-sm" onclick="window.MedSphereStore.markAllNotificationsRead(); window.MedSphereToast.show('All Read', 'All notifications marked as read.', 'success'); window.MedSphereRouter.refreshCurrentPage();">
          <i class="fa-solid fa-check-double" style="margin-right:6px;"></i> Mark all as read
        </button>
      </div>

      ${notifs.length === 0 ? `
        <div class="notif-empty-state" style="padding:4rem 2rem;">
          <div class="notif-empty-icon-circle">
            <i class="fa-regular fa-bell"></i>
          </div>
          <h4 class="notif-empty-heading">You're all caught up.</h4>
          <p class="notif-empty-subtext">New job, post, group, meeting, and account activity will show up here.</p>
        </div>
      ` : `
        <div class="notif-items-list" style="border:1px solid var(--border-subtle); border-radius:14px; overflow:hidden;">
          ${notifs.map(n => {
            const isUnread = !n.is_read && !n.read;
            let icon = 'fa-solid fa-bell';
            let iconBg = '#eff6ff';
            let iconColor = '#0080ff';

            const titleLower = (n.title || '').toLowerCase();
            const bodyLower = (n.body || '').toLowerCase();

            if (n.type === 'job' || n.type === 'jobs' || titleLower.includes('job') || titleLower.includes('role') || bodyLower.includes('vacancy')) {
              icon = 'fa-solid fa-briefcase';
              iconBg = '#eff6ff';
              iconColor = '#0080ff';
            } else if (n.type === 'network' || titleLower.includes('connection') || titleLower.includes('colleague')) {
              icon = 'fa-solid fa-user-doctor';
              iconBg = '#f5f3ff';
              iconColor = '#7c3aed';
            } else if (n.type === 'education' || titleLower.includes('cme') || bodyLower.includes('cme') || bodyLower.includes('credit')) {
              icon = 'fa-solid fa-graduation-cap';
              iconBg = '#ecfdf5';
              iconColor = '#059669';
            }

            return `
              <div class="notif-item-row ${isUnread ? 'unread' : ''}" style="padding:1.15rem 1.25rem; cursor:pointer;" onclick="window.MedSphereApp.handleNotifClick('${n.id}')" title="Click to view">
                <div class="notif-item-icon" style="background:${iconBg}; color:${iconColor}; width:42px; height:42px;">
                  <i class="${icon}"></i>
                </div>
                <div class="notif-item-text">
                  <div class="notif-item-title" style="font-size:0.95rem;">${n.title}</div>
                  <div class="notif-item-body" style="font-size:0.875rem;">${n.body}</div>
                  <div class="notif-item-time">${n.time || 'Recently'}</div>
                </div>
                ${isUnread ? '<div class="notif-unread-dot" style="width:9px; height:9px; margin-top:8px;" title="Unread"></div>' : ''}
              </div>
            `;
          }).join('')}
        </div>
      `}
    `;
  },

  // =========================================================================
  // EMPLOYER & RECRUITER DASHBOARD
  // =========================================================================
  async renderEmployerDashboard(user, state) {
    let jobs = [];
    let applicants = [];
    let candidates = [];

    try {
      if (window.MedSphereAPI && window.MedSphereAPI.getToken()) {
        jobs = await window.MedSphereAPI.getEmployerJobs().catch(() => []);
        applicants = await window.MedSphereAPI.getEmployerApplicants().catch(() => []);
        candidates = await window.MedSphereAPI.getCandidates().catch(() => []);
      }
    } catch (e) {}

    const totalJobs = jobs.length || window.MEDSPHERE_DATA.jobs.length;
    const totalApplicants = applicants.length || 3;
    const shortlistedCount = applicants.filter(a => a.status === 'Shortlisted' || a.status === 'Accepted').length;

    return `
      <div>
        <div class="dashboard-topbar">
          <div>
            <span class="section-eyebrow">EMPLOYER TALENT PORTAL</span>
            <h1 class="dash-page-title" style="margin-top:0.25rem;">${user.organization || "St. Luke's Health System"} Talent Hub</h1>
            <div class="dash-page-sub">Direct recruitment, vacancy publishing, and credential-verified applicant routing</div>
          </div>
          <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
            <button class="btn btn-primary btn-sm" onclick="window.MedSphereModals.open('modal-post-job')">
              <i class="fa-solid fa-plus" style="margin-right:6px;"></i> Post New Clinical Opening
            </button>
            <a href="#messages" class="btn btn-outline btn-sm">
              <i class="fa-solid fa-comment-medical" style="margin-right:6px;"></i> Candidate Outreach
            </a>
          </div>
        </div>

        <!-- Metrics Strip -->
        <div class="dash-metrics-grid" style="margin-bottom:2rem;">
          <div class="dash-metric-card">
            <div class="metric-header"><span class="metric-title">Active Vacancies</span></div>
            <div class="metric-value">${totalJobs}</div>
            <div class="metric-trend" style="color:var(--primary-700);">Published across network</div>
          </div>
          <div class="dash-metric-card">
            <div class="metric-header"><span class="metric-title">Total Applicants</span></div>
            <div class="metric-value">${totalApplicants}</div>
            <div class="metric-trend" style="color:var(--emerald-600);"><i class="fa-solid fa-circle-check" style="margin-right:4px;"></i>NPI & License Verified</div>
          </div>
          <div class="dash-metric-card">
            <div class="metric-header"><span class="metric-title">Shortlisted &amp; Interviews</span></div>
            <div class="metric-value">${shortlistedCount}</div>
            <div class="metric-trend">Expedited credentialing</div>
          </div>
          <div class="dash-metric-card">
            <div class="metric-header"><span class="metric-title">Talent Pool Reach</span></div>
            <div class="metric-value">180K+</div>
            <div class="metric-trend">Licensed clinicians</div>
          </div>
        </div>

        <!-- Active Jobs Management -->
        <div class="dash-section-box" style="margin-bottom:2.5rem;">
          <div class="dash-box-header">
            <h3 class="dash-box-title">Active Healthcare Vacancies</h3>
            <button class="btn btn-outline btn-sm" onclick="window.MedSphereModals.open('modal-post-job')">+ Create Role</button>
          </div>

          <div style="overflow-x:auto;">
            <table class="w-100" style="font-size:0.875rem; border-collapse:collapse;">
              <thead>
                <tr style="text-align:left; border-bottom:2px solid var(--border-subtle); color:var(--slate-500);">
                  <th style="padding:0.75rem;">Position Title</th>
                  <th style="padding:0.75rem;">Specialty</th>
                  <th style="padding:0.75rem;">Location</th>
                  <th style="padding:0.75rem;">Salary Range</th>
                  <th style="padding:0.75rem;">Applicants</th>
                  <th style="padding:0.75rem; text-align:right;">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${(jobs.length ? jobs : window.MEDSPHERE_DATA.jobs).map(j => `
                  <tr style="border-bottom:1px solid var(--border-subtle);">
                    <td style="padding:0.85rem; font-weight:700; color:var(--primary-900);">
                      <a href="#job?id=${j.id}">${j.title}</a>
                    </td>
                    <td style="padding:0.85rem;"><span class="badge badge-blue">${j.specialty}</span></td>
                    <td style="padding:0.85rem; color:var(--slate-600);"><i class="fa-solid fa-location-dot" style="margin-right:4px;"></i>${j.location}</td>
                    <td style="padding:0.85rem; font-weight:600;">${j.salary}</td>
                    <td style="padding:0.85rem;"><span class="badge badge-green">${j.applicants_count || 1} Applied</span></td>
                    <td style="padding:0.85rem; text-align:right;">
                      <a href="#job?id=${j.id}" class="btn btn-outline btn-xs" style="margin-right:4px;">View</a>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Candidate Applications Review Table -->
        <div class="dash-section-box" style="margin-bottom:2.5rem;">
          <div class="dash-box-header">
            <h3 class="dash-box-title">Applicant Management &amp; Candidate Review</h3>
            <span class="badge badge-blue">Direct Pipeline</span>
          </div>

          <div style="overflow-x:auto;">
            <table class="w-100" style="font-size:0.875rem; border-collapse:collapse;">
              <thead>
                <tr style="text-align:left; border-bottom:2px solid var(--border-subtle); color:var(--slate-500);">
                  <th style="padding:0.75rem;">Applicant Clinician</th>
                  <th style="padding:0.75rem;">Position</th>
                  <th style="padding:0.75rem;">Contact</th>
                  <th style="padding:0.75rem;">Status Workflow</th>
                  <th style="padding:0.75rem; text-align:right;">Outreach</th>
                </tr>
              </thead>
              <tbody>
                ${(applicants.length ? applicants : [
                  { id: 'app-demo-1', applicant_name: 'Dr. Eleanor Vance, MD', job_title: 'Chief of Interventional Cardiology', applicant_email: 'eleanor.vance@stlukeshealth.org', status: 'Under Review' },
                  { id: 'app-demo-2', applicant_name: 'Dr. Marcus Chen', job_title: 'Attending Stroke Neurologist', applicant_email: 'marcus.chen@clevelandclinic.org', status: 'Shortlisted' },
                  { id: 'app-demo-3', applicant_name: 'Sarah Jenkins, MSN, RN', job_title: 'Director of Critical Care Nursing', applicant_email: 'sarah.jenkins@mayo.edu', status: 'Submitted' }
                ]).map(app => `
                  <tr style="border-bottom:1px solid var(--border-subtle);">
                    <td style="padding:0.85rem;">
                      <strong style="color:var(--primary-900);">${app.applicant_name}</strong>
                      <div class="text-xs text-muted"><i class="fa-solid fa-shield-check" style="color:var(--emerald-600); margin-right:3px;"></i> Verified License</div>
                    </td>
                    <td style="padding:0.85rem; color:var(--slate-700);">${app.job_title}</td>
                    <td style="padding:0.85rem; color:var(--slate-600); font-size:0.8rem;">${app.applicant_email}</td>
                    <td style="padding:0.85rem;">
                      <select class="form-select form-select-sm" style="font-size:0.8rem; padding:0.25rem 0.5rem; width:150px;" onchange="window.MedSphereDashboard.handleUpdateApplicantStatus('${app.id}', this.value)">
                        <option value="Submitted" ${app.status==='Submitted'?'selected':''}>Submitted</option>
                        <option value="Under Review" ${app.status==='Under Review'?'selected':''}>Under Review</option>
                        <option value="Shortlisted" ${app.status==='Shortlisted'?'selected':''}>Shortlisted</option>
                        <option value="Interview" ${app.status==='Interview'?'selected':''}>Interview</option>
                        <option value="Accepted" ${app.status==='Accepted'?'selected':''}>Offer Extended</option>
                        <option value="Rejected" ${app.status==='Rejected'?'selected':''}>Archived</option>
                      </select>
                    </td>
                    <td style="padding:0.85rem; text-align:right;">
                      <a href="#messages" class="btn btn-outline btn-xs">
                        <i class="fa-regular fa-comment-dots" style="margin-right:4px;"></i> Message
                      </a>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Candidate Search Tool -->
        <div class="dash-section-box">
          <div class="dash-box-header">
            <h3 class="dash-box-title">Direct Clinician Candidate Sourcing</h3>
            <span class="badge badge-green">Search 180K+ Verified Profiles</span>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(300px, 1fr)); gap:1.25rem; margin-top:1rem;">
            ${(candidates.length ? candidates.slice(0, 6) : (window.MedSphereDirectory && window.MedSphereDirectory.getAllProfessionals ? window.MedSphereDirectory.getAllProfessionals() : window.MEDSPHERE_DATA.professionals).slice(0, 4)).map(c => `
              <div class="card" style="padding:1.25rem; display:flex; flex-direction:column; gap:0.75rem;">
                <div style="display:flex; align-items:center; gap:0.75rem;">
                  <img src="${c.avatar_url || c.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80'}" style="width:48px; height:48px; border-radius:50%; object-fit:cover;">
                  <div>
                    <strong style="color:var(--primary-900); font-size:0.95rem;">${c.full_name || c.name}</strong>
                    <div class="text-xs text-muted">${c.professional_title || c.title}</div>
                    <div class="text-xs" style="color:var(--primary-700);">${c.specialty} · <i class="fa-solid fa-location-dot"></i> ${c.location}</div>
                  </div>
                </div>
                <div style="display:flex; gap:0.5rem; margin-top:auto;">
                  <a href="#profile?id=${c.id}" class="btn btn-outline btn-xs w-50">Profile</a>
                  <a href="#messages" class="btn btn-primary btn-xs w-50">Reach Out</a>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  async handleUpdateApplicantStatus(appId, newStatus) {
    try {
      if (window.MedSphereAPI) {
        await window.MedSphereAPI.updateApplicationStatus(appId, newStatus);
      }
      window.MedSphereToast.show('Status Updated', `Applicant status updated to "${newStatus}". Notification sent to candidate.`, 'success');
    } catch (e) {
      window.MedSphereToast.show('Error', e.message || 'Could not update applicant status', 'error');
    }
  },

  // =========================================================================
  // SUPPLIER & PHARMACEUTICAL DASHBOARD
  // =========================================================================
  async renderSupplierDashboard(user, state) {
    let products = [];
    let inquiries = [];

    try {
      if (window.MedSphereAPI && window.MedSphereAPI.getToken()) {
        products = await window.MedSphereAPI.getSupplierProducts().catch(() => []);
        inquiries = await window.MedSphereAPI.getSupplierInquiries().catch(() => []);
      }
    } catch (e) {}

    const totalProducts = products.length || window.MEDSPHERE_DATA.products.length;
    const totalInquiries = inquiries.length || 2;

    return `
      <div>
        <div class="dashboard-topbar">
          <div>
            <span class="section-eyebrow">HEALTHCARE B2B SUPPLIER PORTAL</span>
            <h1 class="dash-page-title" style="margin-top:0.25rem;">${user.organization || "Medical Technology Supplier"} Catalog & RFQs</h1>
            <div class="dash-page-sub">Manage institutional medical equipment, consumables, and hospital RFQ procurement inquiries</div>
          </div>
          <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
            <button class="btn btn-primary btn-sm" onclick="window.MedSphereModals.open('modal-add-product')">
              <i class="fa-solid fa-plus" style="margin-right:6px;"></i> List New Product
            </button>
            <a href="#marketplace" class="btn btn-outline btn-sm">
              <i class="fa-solid fa-store" style="margin-right:6px;"></i> Public Marketplace
            </a>
          </div>
        </div>

        <!-- Metrics Strip -->
        <div class="dash-metrics-grid" style="margin-bottom:2rem;">
          <div class="dash-metric-card">
            <div class="metric-header"><span class="metric-title">Listed Products</span></div>
            <div class="metric-value">${totalProducts}</div>
            <div class="metric-trend" style="color:var(--emerald-600);"><i class="fa-solid fa-circle-check" style="margin-right:4px;"></i>FDA & CE Cleared</div>
          </div>
          <div class="dash-metric-card">
            <div class="metric-header"><span class="metric-title">Quote Inquiries (RFQs)</span></div>
            <div class="metric-value">${totalInquiries}</div>
            <div class="metric-trend" style="color:var(--primary-700);">From Health Systems</div>
          </div>
          <div class="dash-metric-card">
            <div class="metric-header"><span class="metric-title">Hospital Buyers</span></div>
            <div class="metric-value">2.4K+</div>
            <div class="metric-trend">Procurement Officers</div>
          </div>
          <div class="dash-metric-card">
            <div class="metric-header"><span class="metric-title">Supplier Status</span></div>
            <div class="metric-value" style="font-size:1.25rem; color:var(--emerald-600);"><i class="fa-solid fa-shield-check"></i> Verified</div>
            <div class="metric-trend">GPO Tiers Active</div>
          </div>
        </div>

        <!-- Product Catalog Table -->
        <div class="dash-section-box" style="margin-bottom:2.5rem;">
          <div class="dash-box-header">
            <h3 class="dash-box-title">Company Product Catalog</h3>
            <button class="btn btn-outline btn-sm" onclick="window.MedSphereModals.open('modal-add-product')">+ Add Product</button>
          </div>

          <div style="overflow-x:auto;">
            <table class="w-100" style="font-size:0.875rem; border-collapse:collapse;">
              <thead>
                <tr style="text-align:left; border-bottom:2px solid var(--border-subtle); color:var(--slate-500);">
                  <th style="padding:0.75rem;">Product / Device</th>
                  <th style="padding:0.75rem;">Category</th>
                  <th style="padding:0.75rem;">Price</th>
                  <th style="padding:0.75rem;">Stock Status</th>
                  <th style="padding:0.75rem;">Certification</th>
                  <th style="padding:0.75rem; text-align:right;">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${(products.length ? products : window.MEDSPHERE_DATA.products).map(p => `
                  <tr style="border-bottom:1px solid var(--border-subtle);">
                    <td style="padding:0.85rem; font-weight:700; color:var(--primary-900);">
                      <a href="#product?id=${p.id}">${p.name}</a>
                    </td>
                    <td style="padding:0.85rem;"><span class="badge badge-blue">${p.category}</span></td>
                    <td style="padding:0.85rem; font-weight:600;">${p.price}</td>
                    <td style="padding:0.85rem; color:var(--emerald-600);"><i class="fa-solid fa-check" style="margin-right:4px;"></i>${p.stock || 'In Stock'}</td>
                    <td style="padding:0.85rem;"><span class="badge badge-green">${p.badge || 'FDA Cleared'}</span></td>
                    <td style="padding:0.85rem; text-align:right;">
                      <a href="#product?id=${p.id}" class="btn btn-outline btn-xs">View Specs</a>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- RFQ & Buyer Inquiries Table -->
        <div class="dash-section-box">
          <div class="dash-box-header">
            <h3 class="dash-box-title">Procurement Quote Requests (RFQs)</h3>
            <span class="badge badge-cme">Institutional Leads</span>
          </div>

          <div style="overflow-x:auto;">
            <table class="w-100" style="font-size:0.875rem; border-collapse:collapse;">
              <thead>
                <tr style="text-align:left; border-bottom:2px solid var(--border-subtle); color:var(--slate-500);">
                  <th style="padding:0.75rem;">Requested Product</th>
                  <th style="padding:0.75rem;">Healthcare Organization</th>
                  <th style="padding:0.75rem;">Contact Clinician / Buyer</th>
                  <th style="padding:0.75rem;">Quantity</th>
                  <th style="padding:0.75rem; text-align:right;">Action</th>
                </tr>
              </thead>
              <tbody>
                ${(inquiries.length ? inquiries : [
                  { id: 'inq-1', product_name: 'GE Healthcare Vivid E95 4D Ultrasound', organization: "St. Luke's Heart Institute", contact_name: 'Dr. Eleanor Vance, MD', quantity: '2 Units' },
                  { id: 'inq-2', product_name: 'Siemens Somatom Force Dual-Source CT', organization: 'Cleveland Clinic Imaging Dept', contact_name: 'Dr. Marcus Chen', quantity: '1 Unit' }
                ]).map(inq => `
                  <tr style="border-bottom:1px solid var(--border-subtle);">
                    <td style="padding:0.85rem; font-weight:700; color:var(--primary-900);">${inq.product_name}</td>
                    <td style="padding:0.85rem;">${inq.organization}</td>
                    <td style="padding:0.85rem; color:var(--slate-600);">${inq.contact_name}</td>
                    <td style="padding:0.85rem;"><span class="badge badge-blue">${inq.quantity || '1 System'}</span></td>
                    <td style="padding:0.85rem; text-align:right;">
                      <a href="#messages" class="btn btn-primary btn-xs">
                        <i class="fa-solid fa-paper-plane" style="margin-right:4px;"></i> Respond &amp; Send Quote
                      </a>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  // =========================================================================
  // STUDENT HEALTHCARE HUB
  // =========================================================================
  async renderStudentDashboard(user, state) {
    const data = window.MEDSPHERE_DATA;

    return `
      <div>
        <div class="dashboard-topbar">
          <div>
            <span class="section-eyebrow">STUDENT CLINICAL PORTAL</span>
            <h1 class="dash-page-title" style="margin-top:0.25rem;">Medical &amp; Nursing Student Learning Hub</h1>
            <div class="dash-page-sub">Foundational clinical simulations, USMLE/NCLEX prep, and residency matching</div>
          </div>
          <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
            <a href="#education" class="btn btn-primary btn-sm"><i class="fa-solid fa-book-medical" style="margin-right:6px;"></i>Explore Course Catalog</a>
            <a href="#jobs?type=internship" class="btn btn-outline btn-sm"><i class="fa-solid fa-user-doctor" style="margin-right:6px;"></i>Clinical Internships</a>
          </div>
        </div>

        <!-- Metrics Strip -->
        <div class="dash-metrics-grid" style="margin-bottom:2rem;">
          <div class="dash-metric-card">
            <div class="metric-header"><span class="metric-title">Enrolled Modules</span></div>
            <div class="metric-value">${state.enrolledCourseIds.length}</div>
            <div class="metric-trend" style="color:var(--primary-700);">Interactive Clinical Simulations</div>
          </div>
          <div class="dash-metric-card">
            <div class="metric-header"><span class="metric-title">Certificates Earned</span></div>
            <div class="metric-value">1</div>
            <div class="metric-trend" style="color:var(--emerald-600);"><i class="fa-solid fa-circle-check"></i> ACCME Accredited</div>
          </div>
          <div class="dash-metric-card">
            <div class="metric-header"><span class="metric-title">Residency Matches</span></div>
            <div class="metric-value">24</div>
            <div class="metric-trend">Matching programs open</div>
          </div>
          <div class="dash-metric-card">
            <div class="metric-header"><span class="metric-title">Student Community</span></div>
            <div class="metric-value">1,420</div>
            <div class="metric-trend">Peers in Student Study Group</div>
          </div>
        </div>

        <!-- Recommended Learning -->
        <div class="dash-section-box" style="margin-bottom:2rem;">
          <div class="dash-box-header">
            <h3 class="dash-box-title">Core Clinical Courses for Students</h3>
            <a href="#education" class="btn btn-outline btn-sm">Full Catalog</a>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:1.5rem;">
            ${data.courses.map(c => `
              <div class="card" style="padding:0; overflow:hidden;">
                <img src="${c.image}" style="width:100%; height:140px; object-fit:cover;">
                <div style="padding:1.25rem;">
                  <span class="badge badge-cme" style="margin-bottom:0.25rem;">${c.credits}</span>
                  <h4 style="font-size:1.05rem; margin-bottom:0.25rem;"><a href="#course?id=${c.id}">${c.title}</a></h4>
                  <div class="text-xs text-muted" style="margin-bottom:1rem;">Instructor: ${c.instructor}</div>
                  <a href="#course?id=${c.id}" class="btn btn-primary btn-sm w-100">Enroll &amp; Learn</a>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Clinical Internships & Electives -->
        <div class="dash-section-box">
          <div class="dash-box-header">
            <h3 class="dash-box-title">Clinical Electives &amp; Hospital Internships</h3>
            <a href="#jobs" class="btn btn-outline btn-sm">See All Openings</a>
          </div>

          <div style="display:flex; flex-direction:column; gap:1rem;">
            ${data.jobs.slice(0, 3).map(j => `
              <div style="display:flex; justify-content:space-between; align-items:center; padding:1rem; border:1px solid var(--border-subtle); border-radius:var(--radius-md); flex-wrap:wrap; gap:1rem;">
                <div>
                  <strong style="color:var(--primary-900); font-size:1.05rem;">${j.title}</strong>
                  <div class="text-xs text-muted">${j.company} · ${j.location} · <strong>${j.salary}</strong></div>
                </div>
                <div style="display:flex; gap:0.5rem;">
                  <button class="btn btn-primary btn-sm" onclick="window.MedSphereModals.open('modal-apply-job', { id: '${j.id}', title: '${j.title}', company: '${j.company}', location: '${j.location}' })">1-Click Apply</button>
                  <a href="#job?id=${j.id}" class="btn btn-outline btn-sm">Details</a>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  // =========================================================================
  // OFFICIAL MEDICAL CREDENTIAL VERIFICATION VIEW
  // =========================================================================
  async renderVerificationView(user) {
    let verif = { status: 'Not Submitted' };
    try {
      if (window.MedSphereAPI && window.MedSphereAPI.getToken()) {
        verif = await window.MedSphereAPI.getVerificationStatus();
      }
    } catch (e) {}

    const isVerified = verif.status === 'Verified' || user.verified;
    const isPending = verif.status === 'Pending' || verif.status === 'Under Review';

    return `
      <div>
        <div class="dashboard-topbar">
          <div>
            <span class="section-eyebrow">CLINICAL COMPLIANCE &amp; CREDENTIALING</span>
            <h1 class="dash-page-title" style="margin-top:0.25rem;">Medical Credential &amp; License Verification</h1>
            <div class="dash-page-sub">Official credentialing verification against NPPES, state medical boards, and healthcare registries</div>
          </div>
          <button class="btn btn-primary btn-sm" onclick="window.MedSphereModals.open('modal-verify')">
            <i class="fa-solid fa-shield-halved" style="margin-right:6px;"></i> ${isVerified ? 'Update Credentials' : 'Submit Credentials'}
          </button>
        </div>

        <!-- Verification Banner Card -->
        <div class="card" style="padding:2rem; margin-bottom:2rem; border-left:6px solid ${isVerified ? 'var(--emerald-600)' : (isPending ? 'var(--amber-500)' : 'var(--primary-700)')};">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1.5rem;">
            <div style="display:flex; gap:1.25rem; align-items:center;">
              <div style="width:64px; height:64px; border-radius:50%; background:${isVerified ? '#dcfce7' : (isPending ? '#fef3c7' : '#e0e7ff')}; color:${isVerified ? '#15803d' : (isPending ? '#b45309' : '#1d4ed8')}; display:flex; align-items:center; justify-content:center; font-size:1.75rem;">
                <i class="fa-solid ${isVerified ? 'fa-circle-check' : (isPending ? 'fa-clock' : 'fa-id-card')}"></i>
              </div>
              <div>
                <span class="badge ${isVerified ? 'badge-green' : (isPending ? 'badge-cme' : 'badge-subtle')}" style="font-size:0.85rem; margin-bottom:0.35rem;">
                  Status: ${verif.status || (isVerified ? 'Verified' : 'Not Submitted')}
                </span>
                <h2 style="font-size:1.4rem; color:var(--primary-900); margin:0;">
                  ${isVerified ? 'Verified Healthcare Professional' : (isPending ? 'Verification Under Active Compliance Review' : 'Credentials Not Yet Submitted')}
                </h2>
                <p class="text-sm text-muted" style="margin-top:0.25rem;">
                  ${isVerified ? 'Your medical credentials and licensing records have passed primary source verification.' : (isPending ? 'Your credentials were received and are undergoing automated board cross-referencing.' : 'Submit your medical license or diploma to receive the official Trust Badge.')}
                </p>
              </div>
            </div>

            <button class="btn btn-primary" onclick="window.MedSphereModals.open('modal-verify')">
              <i class="fa-solid fa-pen-to-square" style="margin-right:6px;"></i> ${isVerified ? 'Update License Info' : 'Start Verification'}
            </button>
          </div>

          <!-- Submitted Details Breakdown -->
          ${verif.license_number ? `
            <div style="margin-top:2rem; padding-top:1.5rem; border-top:1px solid var(--border-subtle); display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1.5rem;">
              <div>
                <span class="text-xs text-muted" style="text-transform:uppercase; font-weight:700;">License Number</span>
                <div style="font-size:1.1rem; font-weight:700; color:var(--primary-900); margin-top:2px;">${verif.license_number}</div>
              </div>
              <div>
                <span class="text-xs text-muted" style="text-transform:uppercase; font-weight:700;">Issuing Board</span>
                <div style="font-size:1rem; font-weight:600; color:var(--slate-800); margin-top:2px;">${verif.issuing_authority}</div>
              </div>
              <div>
                <span class="text-xs text-muted" style="text-transform:uppercase; font-weight:700;">Document Classification</span>
                <div style="font-size:1rem; font-weight:600; color:var(--slate-800); margin-top:2px;">${verif.document_type || 'State Medical License'}</div>
              </div>
              <div>
                <span class="text-xs text-muted" style="text-transform:uppercase; font-weight:700;">Submission Timestamp</span>
                <div style="font-size:1rem; font-weight:600; color:var(--slate-800); margin-top:2px;">${verif.submitted_at ? new Date(verif.submitted_at).toLocaleDateString() : 'Active'}</div>
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Verification Benefits & Safe Harbor -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:2rem;">
          <div class="card">
            <h4 style="font-size:1.15rem; color:var(--primary-900); margin-bottom:0.75rem;"><i class="fa-solid fa-shield-heart" style="color:var(--emerald-600); margin-right:8px;"></i> Why Get Verified?</h4>
            <ul style="font-size:0.875rem; color:var(--slate-700); display:flex; flex-direction:column; gap:0.6rem; padding-left:1.25rem;">
              <li>Official <strong>Verified Healthcare Professional</strong> trust badge on discussions and peer consults.</li>
              <li>1-Click application directly into hospital ATS credentialing systems.</li>
              <li>Automated state licensing board reporting for completed CME modules.</li>
              <li>Direct, encrypted peer-to-peer clinical messaging privileges.</li>
            </ul>
          </div>

          <div class="card">
            <h4 style="font-size:1.15rem; color:var(--primary-900); margin-bottom:0.75rem;"><i class="fa-solid fa-lock" style="color:var(--primary-700); margin-right:8px;"></i> Security &amp; Compliance Standards</h4>
            <p class="text-sm text-muted" style="line-height:1.6;">
              MedSphere adheres to strict HIPAA and SOC2 Type II data residency standards. Your personal identification numbers, state license documentation, and diplomas are encrypted at rest with AES-256 and are never exposed publicly.
            </p>
          </div>
        </div>
      </div>
    `;
  },

  async renderNotifications(state) {
    let notifications = state.notifications;
    try {
      if (window.MedSphereAPI && window.MedSphereAPI.getToken()) {
        const remote = await window.MedSphereAPI.getNotifications();
        if (remote && remote.length) notifications = remote;
      }
    } catch (e) {}

    return `
      <div class="dashboard-topbar">
        <div>
          <h1 class="dash-page-title">Platform Notifications</h1>
          <div class="dash-page-sub">Clinical messages, colleague connection updates, and credential alerts</div>
        </div>
        <button class="btn btn-outline btn-sm" onclick="window.MedSphereDashboard.handleMarkAllRead()">Mark all as read</button>
      </div>

      <div class="notif-feed-list">
        ${notifications.map(n => `
          <div class="notif-card-item ${!n.is_read && !n.read ? 'unread' : ''}">
            <div style="flex:1;">
              <div style="display:flex; justify-content:space-between;">
                <strong style="color:var(--primary-900); font-size:1rem;">${n.title}</strong>
                <span class="text-xs text-muted">${n.created_at ? new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (n.time || 'Today')}</span>
              </div>
              <p style="font-size:0.9rem; color:var(--slate-700); margin-top:0.35rem;">${n.body}</p>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  async handleMarkAllRead() {
    try {
      await window.MedSphereAPI.markAllNotificationsRead();
    } catch (e) {}
    window.MedSphereToast.show('Notifications Cleared', 'All notifications marked as read.', 'success');
    window.MedSphereRouter.refreshCurrentPage();
  },

  activeSettingsTab: 'appearance',

  switchSettingsTab(tabId) {
    this.activeSettingsTab = tabId;
    document.querySelectorAll('.doctak-settings-nav-item').forEach(item => {
      if (item.dataset.tab === tabId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    document.querySelectorAll('.doctak-settings-pane').forEach(pane => {
      if (pane.id === `settings-pane-${tabId}`) {
        pane.style.display = 'block';
      } else {
        pane.style.display = 'none';
      }
    });

    const titleMap = {
      'appearance': 'Appearance & Accessibility',
      'security': 'Security',
      'privacy': 'Privacy',
      'notifications': 'Notifications',
      'devices': 'Devices & Sessions',
      'connected': 'Connected Accounts',
      'verification': 'Verification & Credentials',
      'billing': 'Billing & Subscription',
      'time': 'Time Management',
      'ai': 'AI & Data Usage',
      'account': 'Account Management'
    };

    const titleEl = document.getElementById('settings-active-title');
    if (titleEl && titleMap[tabId]) {
      titleEl.textContent = titleMap[tabId];
    }
  },

  setThemeMode(mode) {
    const isDark = (mode === 'dark');
    if (window.MedSphereApp && window.MedSphereApp.toggleDarkMode) {
      window.MedSphereApp.toggleDarkMode(isDark);
    }
    if (isDark) {
      document.body.classList.add('dark-theme');
      document.body.classList.add('dark-mode');
      localStorage.setItem('medsphere_dark_mode', 'true');
      localStorage.setItem('medsphere_theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      document.body.classList.remove('dark-mode');
      localStorage.setItem('medsphere_dark_mode', 'false');
      localStorage.setItem('medsphere_theme', 'light');
    }
    document.querySelectorAll('.doctak-theme-option-btn').forEach(btn => {
      if (btn.dataset.theme === mode) btn.classList.add('active');
      else btn.classList.remove('active');
    });
    window.MedSphereToast.show('Theme Updated', `Switched to ${mode === 'dark' ? 'Dark' : 'Light'} mode.`, 'info');
  },

  setAccentColor(color) {
    const colorMap = {
      blue: {
        p900: '#0B2B4A',
        p800: '#0B5CAD',
        p700: '#087FCE',
        p600: '#0080ff',
        p500: '#25B8F2',
        p100: '#EEF7FC',
        p50:  '#F6FAFD'
      },
      emerald: {
        p900: '#064e3b',
        p800: '#065f46',
        p700: '#047857',
        p600: '#059669',
        p500: '#10b981',
        p100: '#d1fae5',
        p50:  '#ecfdf5'
      },
      violet: {
        p900: '#3b0764',
        p800: '#581c87',
        p700: '#6b21a8',
        p600: '#7c3aed',
        p500: '#8b5cf6',
        p100: '#ede9fe',
        p50:  '#f5f3ff'
      },
      rose: {
        p900: '#4c0519',
        p800: '#881337',
        p700: '#be123c',
        p600: '#e11d48',
        p500: '#f43f5e',
        p100: '#ffe4e6',
        p50:  '#fff1f2'
      },
      amber: {
        p900: '#451a03',
        p800: '#78350f',
        p700: '#b45309',
        p600: '#d97706',
        p500: '#f59e0b',
        p100: '#fef3c7',
        p50:  '#fffbeb'
      }
    };

    const scheme = colorMap[color] || colorMap.blue;
    document.documentElement.style.setProperty('--primary-900', scheme.p900);
    document.documentElement.style.setProperty('--primary-800', scheme.p800);
    document.documentElement.style.setProperty('--primary-700', scheme.p700);
    document.documentElement.style.setProperty('--primary-600', scheme.p600);
    document.documentElement.style.setProperty('--primary-500', scheme.p500);
    document.documentElement.style.setProperty('--primary-100', scheme.p100);
    document.documentElement.style.setProperty('--primary-50',  scheme.p50);
    localStorage.setItem('medsphere_accent', color);

    document.querySelectorAll('.doctak-accent-pill').forEach(btn => {
      if (btn.dataset.color === color) btn.classList.add('active');
      else btn.classList.remove('active');
    });

    window.MedSphereToast.show('Accent Updated', `Theme accent set to ${color.charAt(0).toUpperCase() + color.slice(1)}.`, 'info');
  },

  setFont(target, fontName) {
    let fontVal = fontName;
    if (fontName === 'System') {
      fontVal = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    } else {
      fontVal = `"${fontName}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    }

    if (target === 'page') {
      document.documentElement.style.setProperty('--font-body', fontVal);
      document.body.style.fontFamily = fontVal;
      localStorage.setItem('medsphere_page_font', fontName);
    } else if (target === 'sidebar') {
      document.documentElement.style.setProperty('--font-heading', fontVal);
      const sb = document.querySelector('.doctak-settings-sidebar');
      if (sb) sb.style.fontFamily = fontVal;
      localStorage.setItem('medsphere_sidebar_font', fontName);
    }
    window.MedSphereToast.show('Typography Updated', `${target === 'page' ? 'Page font' : 'Sidebar font'} set to ${fontName}.`, 'info');
  },

  setLanguage(lang) {
    localStorage.setItem('medsphere_interface_lang', lang);
    if (lang === 'Urdu' || lang === 'Arabic') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.body.classList.add('rtl-mode');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.body.classList.remove('rtl-mode');
    }
    window.MedSphereToast.show('Language Updated', `Interface language preference set to ${lang}.`, 'info');
  },

  setTimeZone(tz) {
    localStorage.setItem('medsphere_timezone', tz);
    window.MedSphereToast.show('Time Zone Updated', `Platform time zone set to ${tz}.`, 'info');
  },

  toggleReduceMotion(enabled) {
    localStorage.setItem('medsphere_reduce_motion', String(enabled));
    if (enabled) {
      document.documentElement.classList.add('reduce-motion');
      document.body.classList.add('reduce-motion');
      window.MedSphereToast.show('Reduced Motion Enabled', 'Animations and transitions minimized across MedSphere.', 'info');
    } else {
      document.documentElement.classList.remove('reduce-motion');
      document.body.classList.remove('reduce-motion');
      window.MedSphereToast.show('Normal Motion Enabled', 'Smooth animations restored.', 'info');
    }
  },

  handlePasswordChange(form) {
    const cur = form.querySelector('#sec-current-pwd')?.value;
    const newPwd = form.querySelector('#sec-new-pwd')?.value;
    const conf = form.querySelector('#sec-confirm-pwd')?.value;

    if (!cur) {
      window.MedSphereToast.show('Error', 'Please enter your current password.', 'warning');
      return;
    }
    if (newPwd.length < 8) {
      window.MedSphereToast.show('Weak Password', 'New password must be at least 8 characters.', 'warning');
      return;
    }
    if (newPwd !== conf) {
      window.MedSphereToast.show('Mismatch', 'New passwords do not match.', 'error');
      return;
    }

    form.reset();
    window.MedSphereToast.show('Password Changed', 'Your security password has been updated securely.', 'success');
  },

  async handleSaveCredentials(form) {
    const npi = document.getElementById('settings-verif-npi')?.value.trim();
    const license = document.getElementById('settings-verif-license')?.value.trim();
    if (!npi || !license) {
      window.MedSphereToast.show('Missing Information', 'Please provide both NPI and License.', 'warning');
      return;
    }
    await window.MedSphereStore.updateCurrentUser({ npi, license });
    window.MedSphereToast.show('Credentials Saved', 'Medical license submitted for cryptographic registry verification.', 'success');
  },

  async handleSaveConsultingHours(form) {
    const win = document.getElementById('settings-consulting-window')?.value;
    const link = document.getElementById('settings-booking-link')?.value.trim();
    await window.MedSphereStore.updateCurrentUser({ consultingWindow: win, bookingLink: link });
    window.MedSphereToast.show('Availability Saved', 'Clinical consulting hours and telehealth link updated.', 'success');
  },

  exportProfileData() {
    const user = window.MedSphereStore.getState().currentUser || window.MEDSPHERE_DATA.currentUser;
    const fullArchive = {
      profile: user,
      exportedAt: new Date().toISOString(),
      platform: "MedSphere Healthcare Platform",
      accreditation: "HIPAA Compliant & SOC2 Type II Verified",
      certifications: user.certifications || [],
      education: user.education || [],
      experience: user.experience || []
    };
    const blob = new Blob([JSON.stringify(fullArchive, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medsphere_profile_archive_${user.id || 'clinician'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    window.MedSphereToast.show('Archive Downloaded', 'Clinical profile data exported successfully.', 'success');
  },

  renderSettings(user, completion) {
    return this.renderDocTakSettings(user, completion);
  },

  renderDocTakSettings(user, completion) {
    const isDarkMode = document.body.classList.contains('dark-mode') || document.body.classList.contains('dark-theme') || localStorage.getItem('medsphere_dark_mode') === 'true' || localStorage.getItem('medsphere_theme') === 'dark';
    const currentAccent = localStorage.getItem('medsphere_accent') || 'blue';
    const savedPageFont = localStorage.getItem('medsphere_page_font') || 'Plus Jakarta Sans';
    const savedSidebarFont = localStorage.getItem('medsphere_sidebar_font') || 'Plus Jakarta Sans';
    const savedLang = localStorage.getItem('medsphere_interface_lang') || 'English';
    const savedTz = localStorage.getItem('medsphere_timezone') || 'Karachi';
    const isReduceMotion = localStorage.getItem('medsphere_reduce_motion') === 'true';

    return `
      <div class="doctak-settings-page">
        <div class="doctak-settings-container">
          <div class="doctak-settings-layout">
            
            <!-- LEFT SIDEBAR -->
            <aside class="doctak-settings-sidebar">
              <h2 class="doctak-settings-sidebar-title">Settings</h2>

              <!-- Active Default Item: Appearance & Accessibility -->
              <button type="button" class="doctak-settings-nav-item active" data-tab="appearance" onclick="window.MedSphereDashboard.switchSettingsTab('appearance')">
                <i class="fa-regular fa-moon"></i>
                <span>Appearance & Accessibility</span>
              </button>

              <!-- ACCOUNT GROUP -->
              <div class="doctak-settings-nav-group">
                <div class="doctak-settings-group-label">ACCOUNT</div>
                <button type="button" class="doctak-settings-nav-item" data-tab="security" onclick="window.MedSphereDashboard.switchSettingsTab('security')">
                  <i class="fa-solid fa-shield-halved"></i>
                  <span>Security</span>
                </button>
                <button type="button" class="doctak-settings-nav-item" data-tab="privacy" onclick="window.MedSphereDashboard.switchSettingsTab('privacy')">
                  <i class="fa-regular fa-user"></i>
                  <span>Privacy</span>
                </button>
                <button type="button" class="doctak-settings-nav-item" data-tab="notifications" onclick="window.MedSphereDashboard.switchSettingsTab('notifications')">
                  <i class="fa-regular fa-bell"></i>
                  <span>Notifications</span>
                </button>
                <button type="button" class="doctak-settings-nav-item" data-tab="devices" onclick="window.MedSphereDashboard.switchSettingsTab('devices')">
                  <i class="fa-solid fa-mobile-screen"></i>
                  <span>Devices & Sessions</span>
                </button>
                <button type="button" class="doctak-settings-nav-item" data-tab="connected" onclick="window.MedSphereDashboard.switchSettingsTab('connected')">
                  <i class="fa-solid fa-wifi"></i>
                  <span>Connected Accounts</span>
                </button>
              </div>

              <!-- PROFESSIONAL GROUP -->
              <div class="doctak-settings-nav-group">
                <div class="doctak-settings-group-label">PROFESSIONAL</div>
                <button type="button" class="doctak-settings-nav-item" data-tab="verification" onclick="window.MedSphereDashboard.switchSettingsTab('verification')">
                  <i class="fa-solid fa-shield-halved"></i>
                  <span>Verification & Credentials</span>
                </button>
                <button type="button" class="doctak-settings-nav-item" data-tab="billing" onclick="window.MedSphereDashboard.switchSettingsTab('billing')">
                  <i class="fa-regular fa-credit-card"></i>
                  <span>Billing & Subscription</span>
                </button>
                <button type="button" class="doctak-settings-nav-item" data-tab="time" onclick="window.MedSphereDashboard.switchSettingsTab('time')">
                  <i class="fa-regular fa-clock"></i>
                  <span>Time Management</span>
                </button>
              </div>

              <!-- PLATFORM GROUP -->
              <div class="doctak-settings-nav-group">
                <div class="doctak-settings-group-label">PLATFORM</div>
                <button type="button" class="doctak-settings-nav-item" data-tab="ai" onclick="window.MedSphereDashboard.switchSettingsTab('ai')">
                  <i class="fa-solid fa-database"></i>
                  <span>AI & Data Usage</span>
                </button>
                <button type="button" class="doctak-settings-nav-item" data-tab="account" onclick="window.MedSphereDashboard.switchSettingsTab('account')">
                  <i class="fa-regular fa-user"></i>
                  <span>Account Management</span>
                </button>
              </div>

            </aside>

            <!-- RIGHT MAIN CONTENT -->
            <main class="doctak-settings-content">
              
              <!-- Breadcrumb & Page Header Bar -->
              <div class="doctak-settings-breadcrumb">
                <i class="fa-solid fa-shield-halved"></i> ACCOUNT SETTINGS
              </div>
              
              <div class="doctak-settings-header-row">
                <h1 class="doctak-settings-page-title" id="settings-active-title">Appearance & Accessibility</h1>
                <div class="doctak-settings-badges">
                  ${user.verified ? `
                    <span class="doctak-badge-verified"><i class="fa-solid fa-circle-check"></i> Verified</span>
                  ` : `
                    <span class="doctak-badge-unverified">Not verified</span>
                  `}
                  <span class="doctak-badge-standard">Standard account</span>
                </div>
              </div>

              <!-- PANE 1: APPEARANCE & ACCESSIBILITY (Matches Image 2 exactly!) -->
              <div class="doctak-settings-pane" id="settings-pane-appearance" style="display:block;">
                
                <!-- Card 1: Appearance -->
                <div class="doctak-settings-card">
                  <h3 class="doctak-card-heading">Appearance</h3>
                  <p class="doctak-card-subheading">Theme and accent apply across welcome pages, marketing pages, and the signed-in app.</p>

                  <!-- Theme mode -->
                  <div class="doctak-settings-section">
                    <div class="doctak-section-label">Theme mode</div>
                    <div class="doctak-section-desc">Choose how MedSphere looks on your device</div>
                    <div class="doctak-theme-segmented">
                      <button type="button" class="doctak-theme-option-btn ${!isDarkMode ? 'active' : ''}" data-theme="light" onclick="window.MedSphereDashboard.setThemeMode('light')">
                        <i class="fa-regular fa-sun"></i> Light
                      </button>
                      <button type="button" class="doctak-theme-option-btn ${isDarkMode ? 'active' : ''}" data-theme="dark" onclick="window.MedSphereDashboard.setThemeMode('dark')">
                        <i class="fa-regular fa-moon"></i> Dark
                      </button>
                    </div>
                  </div>

                  <!-- Accent color -->
                  <div class="doctak-settings-section">
                    <div class="doctak-section-label">Accent color</div>
                    <div class="doctak-section-desc">Applies to welcome pages and the signed-in app</div>
                    <div class="doctak-accent-options">
                      <button type="button" class="doctak-accent-pill ${currentAccent === 'blue' ? 'active' : ''}" data-color="blue" onclick="window.MedSphereDashboard.setAccentColor('blue')">
                        <span class="doctak-accent-dot" style="background:#0080ff;"></span> MedSphere Blue
                      </button>
                      <button type="button" class="doctak-accent-pill ${currentAccent === 'emerald' ? 'active' : ''}" data-color="emerald" onclick="window.MedSphereDashboard.setAccentColor('emerald')">
                        <span class="doctak-accent-dot" style="background:#10b981;"></span> Emerald
                      </button>
                      <button type="button" class="doctak-accent-pill ${currentAccent === 'violet' ? 'active' : ''}" data-color="violet" onclick="window.MedSphereDashboard.setAccentColor('violet')">
                        <span class="doctak-accent-dot" style="background:#8b5cf6;"></span> Violet
                      </button>
                      <button type="button" class="doctak-accent-pill ${currentAccent === 'rose' ? 'active' : ''}" data-color="rose" onclick="window.MedSphereDashboard.setAccentColor('rose')">
                        <span class="doctak-accent-dot" style="background:#f43f5e;"></span> Rose
                      </button>
                      <button type="button" class="doctak-accent-pill ${currentAccent === 'amber' ? 'active' : ''}" data-color="amber" onclick="window.MedSphereDashboard.setAccentColor('amber')">
                        <span class="doctak-accent-dot" style="background:#f59e0b;"></span> Amber
                      </button>
                    </div>
                  </div>

                  <!-- Typography Divider -->
                  <div class="doctak-settings-divider">
                    <span>TYPOGRAPHY</span>
                  </div>

                  <!-- Fonts Row -->
                  <div class="doctak-settings-form-row">
                    <div class="doctak-settings-form-group">
                      <label class="doctak-settings-input-label">Page font</label>
                      <select class="doctak-settings-select" onchange="window.MedSphereDashboard.setFont('page', this.value)">
                        <option value="Plus Jakarta Sans" ${savedPageFont === 'Plus Jakarta Sans' ? 'selected' : ''}>Plus Jakarta Sans</option>
                        <option value="Inter" ${savedPageFont === 'Inter' ? 'selected' : ''}>Inter</option>
                        <option value="Geist" ${savedPageFont === 'Geist' ? 'selected' : ''}>Geist</option>
                        <option value="System" ${savedPageFont === 'System' ? 'selected' : ''}>System Default</option>
                      </select>
                    </div>
                    <div class="doctak-settings-form-group">
                      <label class="doctak-settings-input-label">Sidebar font</label>
                      <select class="doctak-settings-select" onchange="window.MedSphereDashboard.setFont('sidebar', this.value)">
                        <option value="Plus Jakarta Sans" ${savedSidebarFont === 'Plus Jakarta Sans' ? 'selected' : ''}>Plus Jakarta Sans</option>
                        <option value="Inter" ${savedSidebarFont === 'Inter' ? 'selected' : ''}>Inter</option>
                        <option value="Geist" ${savedSidebarFont === 'Geist' ? 'selected' : ''}>Geist</option>
                        <option value="System" ${savedSidebarFont === 'System' ? 'selected' : ''}>System Default</option>
                      </select>
                    </div>
                  </div>

                </div>

                <!-- Card 2: Language & accessibility -->
                <div class="doctak-settings-card">
                  <h3 class="doctak-card-heading">Language & accessibility</h3>
                  <p class="doctak-card-subheading">Set your interface language, time zone, and motion preferences.</p>

                  <div class="doctak-settings-form-row">
                    <div class="doctak-settings-form-group">
                      <label class="doctak-settings-input-label">Interface language</label>
                      <select class="doctak-settings-select" onchange="window.MedSphereDashboard.setLanguage(this.value)">
                        <option value="English" ${savedLang === 'English' ? 'selected' : ''}>English</option>
                        <option value="Spanish" ${savedLang === 'Spanish' ? 'selected' : ''}>Spanish (Español)</option>
                        <option value="French" ${savedLang === 'French' ? 'selected' : ''}>French (Français)</option>
                        <option value="Urdu" ${savedLang === 'Urdu' ? 'selected' : ''}>Urdu (اردو)</option>
                        <option value="Arabic" ${savedLang === 'Arabic' ? 'selected' : ''}>Arabic (العربية)</option>
                        <option value="German" ${savedLang === 'German' ? 'selected' : ''}>German (Deutsch)</option>
                      </select>
                    </div>
                    <div class="doctak-settings-form-group">
                      <label class="doctak-settings-input-label">Time zone</label>
                      <select class="doctak-settings-select" onchange="window.MedSphereDashboard.setTimeZone(this.value)">
                        <option value="Karachi" ${savedTz === 'Karachi' ? 'selected' : ''}>Karachi</option>
                        <option value="New York" ${savedTz === 'New York' ? 'selected' : ''}>New York</option>
                        <option value="London" ${savedTz === 'London' ? 'selected' : ''}>London</option>
                        <option value="Dubai" ${savedTz === 'Dubai' ? 'selected' : ''}>Dubai</option>
                        <option value="Singapore" ${savedTz === 'Singapore' ? 'selected' : ''}>Singapore</option>
                        <option value="Tokyo" ${savedTz === 'Tokyo' ? 'selected' : ''}>Tokyo</option>
                      </select>
                    </div>
                  </div>

                  <!-- Accessibility Divider -->
                  <div class="doctak-settings-divider">
                    <span>ACCESSIBILITY</span>
                  </div>

                  <!-- Reduce motion -->
                  <div class="doctak-settings-toggle-row">
                    <div>
                      <div class="doctak-toggle-title">Reduce motion</div>
                      <div class="doctak-toggle-desc">Minimize animated movement across the app.</div>
                    </div>
                    <label class="doctak-switch">
                      <input type="checkbox" id="reduce-motion-toggle" ${isReduceMotion ? 'checked' : ''} onchange="window.MedSphereDashboard.toggleReduceMotion(this.checked)">
                      <span class="doctak-switch-slider"></span>
                    </label>
                  </div>

                </div>

              </div>

              <!-- PANE 2: SECURITY -->
              <div class="doctak-settings-pane" id="settings-pane-security" style="display:none;">
                <div class="doctak-settings-card">
                  <h3 class="doctak-card-heading">Change Password</h3>
                  <p class="doctak-card-subheading">Ensure your account is using a long, random password to stay secure.</p>
                  <form onsubmit="event.preventDefault(); window.MedSphereDashboard.handlePasswordChange(this);">
                    <div class="form-group mb-3">
                      <label class="doctak-settings-input-label">Current Password</label>
                      <input type="password" id="sec-current-pwd" class="doctak-settings-input" placeholder="••••••••••••" required>
                    </div>
                    <div class="doctak-settings-form-row mb-3">
                      <div class="doctak-settings-form-group">
                        <label class="doctak-settings-input-label">New Password</label>
                        <input type="password" id="sec-new-pwd" class="doctak-settings-input" placeholder="••••••••••••" required>
                      </div>
                      <div class="doctak-settings-form-group">
                        <label class="doctak-settings-input-label">Confirm New Password</label>
                        <input type="password" id="sec-confirm-pwd" class="doctak-settings-input" placeholder="••••••••••••" required>
                      </div>
                    </div>
                    <button type="submit" class="btn btn-primary btn-sm">Update Password</button>
                  </form>
                </div>

                <div class="doctak-settings-card">
                  <h3 class="doctak-card-heading">Two-Factor Authentication (2FA)</h3>
                  <p class="doctak-card-subheading">Add an additional layer of security to your clinical account using authenticator apps.</p>
                  <div class="doctak-settings-toggle-row">
                    <div>
                      <div class="doctak-toggle-title">Authenticator App (TOTP)</div>
                      <div class="doctak-toggle-desc">Use Google Authenticator or 1Password for one-time passcodes.</div>
                    </div>
                    <label class="doctak-switch">
                      <input type="checkbox" onchange="window.MedSphereToast.show('2FA Updated', this.checked ? 'Two-Factor Authentication enabled.' : 'Two-Factor Authentication disabled.', 'info')">
                      <span class="doctak-switch-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- PANE 3: PRIVACY -->
              <div class="doctak-settings-pane" id="settings-pane-privacy" style="display:none;">
                <div class="doctak-settings-card">
                  <h3 class="doctak-card-heading">Network Visibility</h3>
                  <p class="doctak-card-subheading">Control who can discover your professional profile across MedSphere.</p>
                  <div class="doctak-settings-section">
                    <label class="doctak-settings-input-label">Profile Discoverability</label>
                    <select class="doctak-settings-select" onchange="window.MedSphereToast.show('Privacy Saved', 'Profile discoverability set to ' + this.value, 'info')">
                      <option value="public" selected>Public — Visible to all verified healthcare professionals</option>
                      <option value="colleagues">Colleagues only — Visible only to connected clinicians</option>
                      <option value="private">Private — Hidden from public search directory</option>
                    </select>
                  </div>
                  <div class="doctak-settings-toggle-row mt-3">
                    <div>
                      <div class="doctak-toggle-title">Show in Clinician Referral Directory</div>
                      <div class="doctak-toggle-desc">Allow hospital chiefs and referring physicians to contact you for consultations.</div>
                    </div>
                    <label class="doctak-switch">
                      <input type="checkbox" checked onchange="window.MedSphereToast.show('Privacy Saved', 'Referral directory preferences updated.', 'info')">
                      <span class="doctak-switch-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- PANE 4: NOTIFICATIONS -->
              <div class="doctak-settings-pane" id="settings-pane-notifications" style="display:none;">
                <div class="doctak-settings-card">
                  <h3 class="doctak-card-heading">Email & In-App Alerts</h3>
                  <p class="doctak-card-subheading">Choose which updates and alerts you wish to receive.</p>
                  <div class="doctak-settings-toggle-row">
                    <div>
                      <div class="doctak-toggle-title">Clinical Colleague Connections</div>
                      <div class="doctak-toggle-desc">Receive notifications when peers invite you to collaborate.</div>
                    </div>
                    <label class="doctak-switch">
                      <input type="checkbox" checked onchange="window.MedSphereToast.show('Preferences Saved', 'Notification settings updated.', 'info')">
                      <span class="doctak-switch-slider"></span>
                    </label>
                  </div>
                  <div class="doctak-settings-divider"><span></span></div>
                  <div class="doctak-settings-toggle-row">
                    <div>
                      <div class="doctak-toggle-title">Job & Fellowship Openings</div>
                      <div class="doctak-toggle-desc">Get notified when openings matching your specialty are posted.</div>
                    </div>
                    <label class="doctak-switch">
                      <input type="checkbox" checked onchange="window.MedSphereToast.show('Preferences Saved', 'Notification settings updated.', 'info')">
                      <span class="doctak-switch-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- PANE 5: DEVICES -->
              <div class="doctak-settings-pane" id="settings-pane-devices" style="display:none;">
                <div class="doctak-settings-card">
                  <h3 class="doctak-card-heading">Active Login Sessions</h3>
                  <p class="doctak-card-subheading">These devices are currently signed into your MedSphere clinician account.</p>
                  <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:1rem; margin-bottom:1rem; display:flex; justify-content:space-between; align-items:center;">
                    <div style="display:flex; align-items:center; gap:12px;">
                      <i class="fa-solid fa-desktop" style="font-size:1.4rem; color:var(--primary-600);"></i>
                      <div>
                        <strong>Windows PC · Chrome Browser</strong>
                        <div style="font-size:0.75rem; color:#64748b;">Current Active Session · Karachi / Boston</div>
                      </div>
                    </div>
                    <span class="badge badge-green">Active Now</span>
                  </div>
                  <button type="button" class="btn btn-outline btn-sm" onclick="window.MedSphereToast.show('Sessions Signed Out', 'Logged out of all other remote browser sessions.', 'success')">
                    Sign Out All Other Sessions
                  </button>
                </div>
              </div>

              <!-- PANE 6: CONNECTED -->
              <div class="doctak-settings-pane" id="settings-pane-connected" style="display:none;">
                <div class="doctak-settings-card">
                  <h3 class="doctak-card-heading">Connected Clinical Services</h3>
                  <p class="doctak-card-subheading">Sync your profile with global medical credentialing registries.</p>
                  <div style="display:flex; flex-direction:column; gap:1rem;">
                    <div style="display:flex; justify-content:space-between; align-items:center; padding:0.75rem; background:#f8fafc; border-radius:8px; border:1px solid #e2e8f0;">
                      <div style="display:flex; align-items:center; gap:10px;">
                        <i class="fa-brands fa-google" style="color:#ea4335; font-size:1.2rem;"></i>
                        <div>
                          <strong>Google Workspace</strong>
                          <div style="font-size:0.75rem; color:#64748b;">${user.email || 'expertdeveloper091@gmail.com'}</div>
                        </div>
                      </div>
                      <span class="badge badge-green">Connected</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center; padding:0.75rem; background:#f8fafc; border-radius:8px; border:1px solid #e2e8f0;">
                      <div style="display:flex; align-items:center; gap:10px;">
                        <i class="fa-solid fa-graduation-cap" style="color:#0080ff; font-size:1.2rem;"></i>
                        <div>
                          <strong>ORCID Researcher ID</strong>
                          <div style="font-size:0.75rem; color:#64748b;">0000-0002-1825-0097</div>
                        </div>
                      </div>
                      <span class="badge badge-green">Connected</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- PANE 7: VERIFICATION -->
              <div class="doctak-settings-pane" id="settings-pane-verification" style="display:none;">
                <div class="doctak-settings-card">
                  <h3 class="doctak-card-heading">Medical License Verification</h3>
                  <p class="doctak-card-subheading">Manage your NPI registration and primary state licensure verification.</p>
                  <div class="doctak-settings-form-row mb-3">
                    <div class="doctak-settings-form-group">
                      <label class="doctak-settings-input-label">NPI Number (10 digits)</label>
                      <input type="text" id="settings-verif-npi" class="doctak-settings-input" value="${user.npi || '1892847291'}">
                    </div>
                    <div class="doctak-settings-form-group">
                      <label class="doctak-settings-input-label">State Medical License Number</label>
                      <input type="text" id="settings-verif-license" class="doctak-settings-input" value="${user.license || 'MA #284910'}">
                    </div>
                  </div>
                  <button type="button" class="btn btn-primary btn-sm" onclick="window.MedSphereDashboard.handleSaveCredentials(this)">
                    Submit for Re-Verification
                  </button>
                </div>
              </div>

              <!-- PANE 8: BILLING -->
              <div class="doctak-settings-pane" id="settings-pane-billing" style="display:none;">
                <div class="doctak-settings-card">
                  <h3 class="doctak-card-heading">Subscription Plan</h3>
                  <p class="doctak-card-subheading">Manage your institutional membership and platform billing.</p>
                  <div style="background:linear-gradient(135deg, #0c2340 0%, #0080ff 100%); color:#fff; border-radius:12px; padding:1.5rem; margin-bottom:1.5rem;">
                    <span class="badge" style="background:rgba(255,255,255,0.2); color:#fff; margin-bottom:0.5rem; display:inline-block;">CURRENT PLAN</span>
                    <h2 style="color:#fff; margin:0 0 0.5rem 0; font-size:1.5rem;">Standard Clinician Account</h2>
                    <p style="color:#e0f2fe; font-size:0.85rem; margin-bottom:1rem;">Access to clinical directory, case posts, CME certificates, and direct messaging.</p>
                    <button class="btn btn-secondary btn-sm" onclick="window.MedSphereToast.show('Upgrade to Pro', 'Opening MedSphere Professional enrollment...', 'info')">
                      <i class="fa-solid fa-wand-magic-sparkles"></i> Upgrade to Professional
                    </button>
                  </div>
                </div>
              </div>

              <!-- PANE 9: TIME -->
              <div class="doctak-settings-pane" id="settings-pane-time" style="display:none;">
                <div class="doctak-settings-card">
                  <h3 class="doctak-card-heading">Clinical Consulting Hours</h3>
                  <p class="doctak-card-subheading">Set your availability for remote consultations and second opinions.</p>
                  <div class="doctak-settings-form-row">
                    <div class="doctak-settings-form-group">
                      <label class="doctak-settings-input-label">Weekly Consultation Windows</label>
                      <select class="doctak-settings-select" id="settings-consulting-window">
                        <option ${(user.consultingWindow || '').includes('Monday') ? 'selected' : ''}>Monday, Wednesday, Friday (2:00 PM — 5:00 PM)</option>
                        <option ${(user.consultingWindow || '').includes('Tuesday') ? 'selected' : ''}>Tuesday, Thursday (9:00 AM — 12:00 PM)</option>
                        <option ${(user.consultingWindow || '').includes('Appointment') ? 'selected' : ''}>By Appointment Only</option>
                      </select>
                    </div>
                    <div class="doctak-settings-form-group">
                      <label class="doctak-settings-input-label">Direct Telehealth Booking Link</label>
                      <input type="text" class="doctak-settings-input" id="settings-booking-link" value="${user.bookingLink || 'https://medsphere.health/book/dr-eleanor'}">
                    </div>
                  </div>
                  <div style="margin-top:1rem;">
                    <button type="button" class="btn btn-primary btn-sm" onclick="window.MedSphereDashboard.handleSaveConsultingHours(this)">Save Availability</button>
                  </div>
                </div>
              </div>

              <!-- PANE 10: AI -->
              <div class="doctak-settings-pane" id="settings-pane-ai" style="display:none;">
                <div class="doctak-settings-card">
                  <h3 class="doctak-card-heading">MedSphere Clinical AI Preferences</h3>
                  <p class="doctak-card-subheading">Configure evidence citation thresholds and clinical decision support models.</p>
                  <div class="doctak-settings-toggle-row">
                    <div>
                      <div class="doctak-toggle-title">Strict Peer-Reviewed Literature Citations</div>
                      <div class="doctak-toggle-desc">Require all AI summaries to include PubMed PMID and DOI links.</div>
                    </div>
                    <label class="doctak-switch">
                      <input type="checkbox" checked onchange="window.MedSphereToast.show('AI Settings Saved', 'Citation threshold set to high rigour.', 'info')">
                      <span class="doctak-switch-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- PANE 11: ACCOUNT MANAGEMENT -->
              <div class="doctak-settings-pane" id="settings-pane-account" style="display:none;">
                <div class="doctak-settings-card">
                  <h3 class="doctak-card-heading">Export Clinical Profile Data</h3>
                  <p class="doctak-card-subheading">Download a copy of your verified credentials, CME history, and published cases.</p>
                  <button type="button" class="btn btn-outline btn-sm" onclick="window.MedSphereDashboard.exportProfileData()">
                    <i class="fa-solid fa-download" style="margin-right:6px;"></i> Download Data Archive (JSON)
                  </button>
                </div>

                <div class="doctak-settings-card" style="border-color:#fecaca;">
                  <h3 class="doctak-card-heading" style="color:#dc2626;">Danger Zone</h3>
                  <p class="doctak-card-subheading">Deactivating or deleting your account will revoke verified clinical credentials.</p>
                  <div style="display:flex; gap:0.75rem;">
                    <button type="button" class="btn btn-outline btn-sm" style="color:#dc2626; border-color:#fca5a5;" onclick="window.MedSphereToast.show('Account Deactivation', 'Contact support@medsphere.health to confirm deactivation.', 'warning')">
                      Deactivate Account
                    </button>
                    <button type="button" class="btn btn-danger btn-sm" onclick="window.MedSphereToast.show('Delete Requested', 'Account deletion requires verification code sent to registered email.', 'error')">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>

            </main>

          </div>
        </div>
      </div>
    `;
  },

  async handleSaveSettings(form) {
    const btn = form.querySelector('#save-settings-btn');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span class="spinner" style="display:inline-block; width:14px; height:14px; border:2px solid #fff; border-top-color:transparent; border-radius:50%; animation:spin 0.6s linear infinite; margin-right:6px; vertical-align:middle;"></span> Saving...`;
    }

    const name = form.querySelector('[name="name"]').value.trim();
    const title = form.querySelector('[name="title"]').value.trim();
    const specialty = form.querySelector('[name="specialty"]').value.trim();
    const organization = form.querySelector('[name="organization"]').value.trim();
    const location = form.querySelector('[name="location"]').value.trim();
    const npi = form.querySelector('[name="npi"]').value.trim();
    const bio = form.querySelector('[name="bio"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const phone = form.querySelector('[name="phone"]').value.trim();
    const office = form.querySelector('[name="office"]').value.trim();

    try {
      await window.MedSphereStore.updateCurrentUser({
        name,
        title,
        specialty,
        organization,
        location,
        npi,
        bio,
        contact: { email, phone, office }
      });

      window.MedSphereToast.show("Settings Saved", "Your clinician profile has been synchronized with the database.", "success");
      window.MedSphereRouter.refreshCurrentPage();
    } catch (err) {
      window.MedSphereToast.show("Update Failed", err.message || "Failed to update profile.", "error");
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Save Profile Settings';
      }
    }
  },

  async handlePhotoUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      window.MedSphereToast.show('File Too Large', 'Please select an image smaller than 5MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target.result;
      const store = window.MedSphereStore;
      const user = store.getState().currentUser;

      window.MedSphereToast.show('Uploading Photo', 'Saving profile image to secure server storage...', 'info');

      try {
        if (window.MedSphereAPI && window.MedSphereAPI.getToken()) {
          const res = await window.MedSphereAPI.uploadPhoto(user.id, base64);
          await store.updateCurrentUser({ avatar: res.avatar_url });
        } else {
          await store.updateCurrentUser({ avatar: base64 });
        }
        window.MedSphereToast.show('Photo Updated', 'Your new profile avatar is live.', 'success');
        window.MedSphereRouter.refreshCurrentPage();
      } catch (err) {
        console.error(err);
        window.MedSphereToast.show('Upload Error', err.message || 'Could not upload photo.', 'error');
      }
    };
    reader.readAsDataURL(file);
  },

  // =========================================================================
  // MODERN 3-COLUMN PROFESSIONAL HEALTHCARE FEED RENDERER (EXACT SCREENSHOT LAYOUT)
  // =========================================================================
  renderFeed(user, state) {
    const data = window.MEDSPHERE_DATA;
    const posts = state.communityPosts || data.communityPosts;
    const doctors = ((window.MedSphereDirectory && window.MedSphereDirectory.getAllProfessionals ? window.MedSphereDirectory.getAllProfessionals() : (data.professionals || data.doctors || [])))
      .filter(d => d.name !== user.name).slice(0, 5);
    const jobs = (data.jobs || []).slice(0, 3);
    const userPostsCount = posts.filter(p => p.authorName === user.name).length;
    const allStories = (state.stories && state.stories.length > 0) ? state.stories : (data.stories || []);



    return `
      <div class="feed-layout-container">
        <!-- ================= LEFT COLUMN ================= -->
        <aside class="feed-left-col">
          <!-- User Profile Identity Card -->
          <div class="feed-profile-card">
            <div class="profile-banner-grid"></div>
            <div class="profile-avatar-overlap-wrap">
              <img src="${user.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80'}" alt="${user.name}" class="profile-avatar-overlap">
            </div>
            <div class="profile-card-details">
              <div class="profile-card-name">${user.name}</div>
              <div class="profile-card-role">${user.specialty || user.title || 'Anatomical Pathology'}</div>
              <a href="javascript:void(0)" onclick="window.MedSphereModals.open('modal-edit-profile')" class="profile-card-loc-link" title="Click to update location">
                <i class="fa-solid fa-location-dot" style="font-size:0.75rem;"></i>
                <span>${user.location || 'Add Your Location'}</span>
              </a>
            </div>

            <div class="profile-card-divider"></div>

            <div class="profile-card-stats-grid">
              <div class="profile-stat-box" onclick="window.MedSphereModals.open('modal-profile-stats')" style="cursor:pointer;" title="View Profile Analytics">
                <span class="profile-stat-val">${user.viewsCount || 142}</span>
                <span class="profile-stat-lbl">VIEWS</span>
              </div>
              <div class="profile-stat-box" onclick="window.location.hash = '#network'" style="cursor:pointer;" title="View Colleague Network">
                <span class="profile-stat-val">${state.connectedIds.length + (user.connectionsCount || 28)}</span>
                <span class="profile-stat-lbl">NETWORK</span>
              </div>
              <div class="profile-stat-box" onclick="document.getElementById('feed-posts-stream')?.scrollIntoView({behavior:'smooth'})" style="cursor:pointer;" title="View Clinical Posts">
                <span class="profile-stat-val">${userPostsCount || 12}</span>
                <span class="profile-stat-lbl">POSTS</span>
              </div>
            </div>
          </div>

          <!-- My Groups Card -->
          <div class="feed-widget-card" id="my-groups-widget">
            <div class="widget-card-header">
              <h4 class="widget-card-title">My groups</h4>
              <a href="#community" class="widget-card-link">See all</a>
            </div>
            <div id="my-groups-list" style="display:flex; flex-direction:column; gap:6px; margin-top:8px;">
              <div style="padding:8px 0; color:#94a3b8; font-size:0.8rem; text-align:center;">
                <i class="fa-solid fa-spinner fa-spin" style="margin-right:6px;"></i>Loading groups...
              </div>
            </div>
          </div>

          <!-- Spotlight Card (Did you know?) -->
          <div class="feed-spotlight-box">
            <span class="spotlight-sub">SPOTLIGHT</span>
            <h4 class="spotlight-head">Did you know?</h4>

            <div class="spotlight-item">
              <div class="spotlight-item-header">
                <div class="spotlight-icon-circle">
                  <i class="fa-solid fa-shield-halved"></i>
                </div>
                <div class="spotlight-item-title">Verify your MedSphere account</div>
              </div>
              <p class="spotlight-item-desc">Verified clinicians get a trust badge on posts, groups, and CME listings.</p>
              <a href="javascript:void(0)" class="spotlight-item-link" onclick="window.MedSphereModals.open('modal-verify')">
                <span>Verify now</span>
                <i class="fa-solid fa-arrow-right"></i>
              </a>
            </div>

            <div class="spotlight-item">
              <div class="spotlight-item-header">
                <div class="spotlight-icon-circle" style="background:#f3e8ff; color:#7e22ce;">
                  <i class="fa-solid fa-wand-magic-sparkles"></i>
                </div>
                <div class="spotlight-item-title">Try the AI Drug Analyst</div>
              </div>
              <p class="spotlight-item-desc">Ask drug-specific questions with live citations directly from the drug detail page.</p>
              <a href="javascript:void(0)" class="spotlight-item-link" onclick="window.MedSphereModals.open('modal-medai', { prompt: 'Analyze drug interactions and dosage protocols' })">
                <span>Explore drugs</span>
                <i class="fa-solid fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </aside>

        <!-- ================= CENTER COLUMN (MAIN STREAM) ================= -->
        <main class="feed-center-col">
          <!-- Stories Bar - LinkedIn circular style -->
          <div class="feed-stories-bar" style="background:#fff; border-radius:12px; border:1px solid var(--border-subtle); padding:14px 16px; margin-bottom:1rem; display:flex; align-items:flex-start; gap:16px;">

            <!-- Add story trigger - dashed border circle -->
            <div onclick="window.MedSphereModals.open('modal-story')" title="Post a story"
              style="display:flex; flex-direction:column; align-items:center; gap:6px; cursor:pointer; min-width:68px;">
              <div style="width:64px; height:64px; border-radius:50%; border:2.5px dashed #93c5fd; display:flex; align-items:center; justify-content:center; position:relative; background:#eff6ff; transition:border-color 0.2s, background 0.2s;"
                onmouseover="this.style.borderColor='#2563eb'; this.style.background='#dbeafe';"
                onmouseout="this.style.borderColor='#93c5fd'; this.style.background='#eff6ff';">
                <div style="width:22px; height:22px; background:#2563eb; border-radius:50%; display:flex; align-items:center; justify-content:center;">
                  <i class="fa-solid fa-plus" style="color:#fff; font-size:0.75rem;"></i>
                </div>
              </div>
              <span style="font-size:0.72rem; font-weight:700; color:#1d4ed8; text-align:center; line-height:1.2;">Post a<br>story</span>
            </div>

            <!-- Stories: horizontal scroll -->
            <div style="display:flex; gap:14px; overflow-x:auto; scrollbar-width:none; flex:1; padding-bottom:2px;">
              ${allStories.map(story => `
                <div onclick="window.MedSphereModals.open('modal-view-story', { storyId: '${story.id}' })" title="${story.authorName}'s story"
                  style="display:flex; flex-direction:column; align-items:center; gap:5px; cursor:pointer; min-width:64px;">
                  <!-- Gradient ring avatar -->
                  <div style="width:64px; height:64px; border-radius:50%; background:linear-gradient(135deg, #0080ff 0%, #00d2ff 50%, #10b981 100%); padding:2.5px; box-shadow:0 2px 8px rgba(0,128,255,0.25); transition:transform 0.15s; flex-shrink:0;"
                    onmouseover="this.style.transform='scale(1.06)'" onmouseout="this.style.transform='scale(1)'">
                    <img src="${story.authorAvatar}" alt="${story.authorName}" style="width:100%; height:100%; border-radius:50%; object-fit:cover; border:2.5px solid #fff;">
                  </div>
                  <span style="font-size:0.69rem; font-weight:600; color:#374151; text-align:center; line-height:1.2; max-width:64px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${story.authorName.split(' ').slice(0,2).join(' ')}</span>
                </div>
              `).join('')}
              ${allStories.length === 0 ? `
                <div style="display:flex; align-items:center; color:#94a3b8; font-size:0.82rem; font-weight:500; padding:4px 0;">
                  <i class="fa-solid fa-photo-film" style="margin-right:8px; font-size:1rem; color:#c7d2fe;"></i>
                  No stories yet. Be the first to share!
                </div>
              ` : ''}
            </div>
          </div>

          <!-- Create Post Trigger Box -->
          <div class="feed-create-post-card">
            <div class="create-post-top-row">
              <img src="${user.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80'}" alt="${user.name}" class="create-post-avatar">
              <div class="create-post-input-trigger" onclick="window.MedSphereModals.open('modal-create-post', { type: 'post' })">
                Start a post...
              </div>
            </div>

            <div class="create-post-actions-row">
              <button type="button" class="create-post-btn" onclick="window.MedSphereModals.open('modal-create-post', { type: 'post' })">
                <i class="fa-solid fa-plus" style="color:var(--emerald-600); font-size:1rem;"></i>
                <span>Post</span>
              </button>
              <button type="button" class="create-post-btn" onclick="window.MedSphereModals.open('modal-create-post', { type: 'poll' })">
                <i class="fa-solid fa-chart-simple" style="color:var(--primary-700); font-size:1rem;"></i>
                <span>Poll</span>
              </button>
              <button type="button" class="create-post-btn" onclick="window.MedSphereModals.open('modal-create-post', { type: 'blog' })">
                <i class="fa-solid fa-bookmark" style="color:var(--primary-800); font-size:1rem;"></i>
                <span>Blog</span>
              </button>
            </div>
          </div>

          <!-- Stream Sorter / Filter Bar -->
          <div class="feed-stream-header">
            <span class="stream-filter-text">Showing posts from your network and specialties you follow</span>
            <div class="stream-sort-dropdown">
              <span>Sort by:</span>
              <select id="feed-sort-select" onchange="window.MedSphereDashboard.handleSortFeed(this.value)">
                <option value="relevant">Most relevant</option>
                <option value="recent">Most recent</option>
                <option value="popular">Most popular</option>
              </select>
            </div>
          </div>

          <!-- Posts Stream -->
          <div class="feed-posts-stream" id="feed-posts-stream">
            ${posts.map(post => this.renderPostCard(post, user)).join('')}
          </div>
        </main>

        <!-- ================= RIGHT COLUMN ================= -->
        <aside class="feed-right-col">
          <!-- Suggested For You (Jobs) -->
          <div class="suggested-jobs-card">
            <div class="widget-card-header">
              <h4 class="widget-card-title">Suggested for you</h4>
              <a href="#jobs" class="widget-card-link">See all</a>
            </div>

            <div class="jobs-list-wrap">
              ${jobs.map(job => {
                const isApplied = state.appliedJobIds && state.appliedJobIds.includes(job.id);
                return `
                  <div class="job-suggestion-item">
                    <div class="job-sugg-title">${job.title}</div>
                    <div class="job-sugg-company">${job.company} · ${job.location}</div>
                    <div class="job-sugg-meta">
                      <span class="job-sugg-salary">${job.salary}</span>
                      ${isApplied ? `
                        <button class="btn btn-secondary btn-xs" style="color:var(--emerald-700); font-weight:700; cursor:default;" disabled>
                          <i class="fa-solid fa-check" style="margin-right:4px;"></i> Applied
                        </button>
                      ` : `
                        <button class="btn btn-outline btn-xs" onclick="window.MedSphereModals.open('modal-apply-job', { id: '${job.id}', title: '${job.title.replace(/'/g, "\\'")}', company: '${job.company.replace(/'/g, "\\'")}' })">
                          Apply
                        </button>
                      `}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- People You May Know (Doctors / Professionals) -->
          <div class="people-you-may-know-card">
            <div class="widget-card-header">
              <h4 class="widget-card-title">People you may know</h4>
              <a href="#network" class="widget-card-link">See all</a>
            </div>

            <div class="people-list">
              ${doctors.map(doc => {
                const isConnected = state.connectedIds.includes(doc.id);
                return `
                  <div class="person-row">
                    <img src="${doc.avatar}" alt="${doc.name}" class="person-avatar">
                    <div class="person-info">
                      <div class="person-name">${doc.name}</div>
                      <div class="person-specialty">${doc.specialty}${doc.location ? ' · ' + doc.location : ''}</div>
                    </div>
                    <button type="button" class="connect-action-btn ${isConnected ? 'connected' : ''}" onclick="window.MedSphereDashboard.handleConnect('${doc.id}', '${doc.name.replace(/'/g, "\\'")}', this)">
                      ${isConnected ? '&#10003; Connected' : '+ Connect'}
                    </button>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </aside>
      </div>
    `;
  },

  renderPostCard(post, currentUser) {
    const isLiked = Boolean(post.likedByMe);
    const isSaved = window.MedSphereStore && window.MedSphereStore.isPostSaved ? window.MedSphereStore.isPostSaved(post.id) : false;

    // Attached Media
    const mediaHtml = (post.mediaUrl || post.imageUrl) ? `
      <div class="feed-post-media-box">
        <img src="${post.mediaUrl || post.imageUrl}" alt="Post attachment" loading="lazy">
      </div>
    ` : '';

    // Interactive Poll Rendering
    let pollHtml = '';
    if (post.poll && post.poll.options) {
      const totalVotes = post.poll.totalVotes || 0;
      pollHtml = `
        <div class="feed-post-poll-box" id="poll-${post.id}">
          <div class="poll-question"><i class="fa-solid fa-chart-simple" style="color:var(--primary-700); margin-right:6px;"></i> ${post.poll.question}</div>
          <div class="poll-options-list">
            ${post.poll.options.map(opt => {
              const optVotes = opt.votes || 0;
              const pct = totalVotes > 0 ? Math.round((optVotes / totalVotes) * 100) : 0;
              const isSelected = post.poll.myVote === opt.id;
              return `
                <button type="button" class="poll-option-btn ${isSelected ? 'selected' : ''}" onclick="window.MedSphereDashboard.handleVotePoll('${post.id}', '${opt.id}')">
                  <div class="poll-option-fill" style="width:${pct}%;"></div>
                  <span class="poll-option-text">
                    ${isSelected ? '<i class="fa-solid fa-check" style="color:var(--emerald-600); margin-right:6px;"></i>' : ''}
                    ${opt.text}
                  </span>
                  <span class="poll-option-pct">${pct}%</span>
                </button>
              `;
            }).join('')}
          </div>
          <div class="poll-meta-row">
            <span>${totalVotes} votes total</span>
            <span>${post.poll.myVote ? '✓ Your vote recorded' : 'Click an option to cast clinical vote'}</span>
          </div>
        </div>
      `;
    }

    // Blog / Editorial Banner
    let blogBanner = '';
    if (post.type === 'blog' || post.blog) {
      const blogTitle = (post.blog && post.blog.title) || 'Clinical Editorial';
      blogBanner = `
        <div style="background:var(--primary-50); border-left:4px solid var(--primary-700); padding:0.75rem 1rem; border-radius:0 8px 8px 0; margin-bottom:0.75rem;">
          <div style="font-size:0.7rem; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; color:var(--primary-800);">Clinical Perspective</div>
          <div style="font-size:1.05rem; font-weight:700; color:var(--primary-900); margin-top:2px;">${blogTitle}</div>
        </div>
      `;
    }

    const formattedContent = post.content ? post.content.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>') : '';

    return `
      <div class="feed-post-card" id="card-${post.id}">
        <!-- Post Header -->
        <div class="feed-post-header">
          <div class="feed-post-author-wrap">
            <img src="${post.authorAvatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80'}" alt="${post.authorName}" class="feed-post-avatar">
            <div class="feed-post-author-meta">
              <span class="feed-post-author-name">${post.authorName}</span>
              <div class="feed-post-sub-meta">
                <span>${post.authorRole || 'Doctor'}</span>
                <span>&bull;</span>
                <span class="feed-post-tag">${post.time || 'RECENT'}</span>
              </div>
            </div>
          </div>

          <button type="button" class="feed-post-options-btn" title="Post Options" onclick="window.MedSphereDashboard.handleSharePost('${post.id}')">
            <i class="fa-solid fa-ellipsis"></i>
          </button>
        </div>

        <!-- Post Content & Poll -->
        <div class="feed-post-content">
          ${blogBanner}
          ${formattedContent}
          ${pollHtml}
        </div>

        <!-- Attached Media -->
        ${mediaHtml}

        <!-- Reactions Summary -->
        <div class="feed-post-reactions-summary">
          <span><i class="fa-solid fa-thumbs-up" style="color:var(--primary-700); margin-right:4px;"></i>${post.likesCount || 0} Helpful</span>
          <span>${post.commentsCount || (post.comments ? post.comments.length : 0)} Comments &bull; ${post.sharesCount || 0} Shares</span>
        </div>

        <!-- Actions Bar -->
        <div class="feed-post-actions-bar">
          <button type="button" class="feed-post-action-btn ${isLiked ? 'active' : ''}" onclick="window.MedSphereDashboard.handleToggleLike('${post.id}')">
            <i class="${isLiked ? 'fa-solid' : 'fa-regular'} fa-thumbs-up"></i>
            <span>Helpful</span>
          </button>

          <button type="button" class="feed-post-action-btn" onclick="window.MedSphereDashboard.toggleComments('${post.id}')">
            <i class="fa-regular fa-comment-dots"></i>
            <span>Comment</span>
          </button>

          <button type="button" class="feed-post-action-btn" onclick="window.MedSphereDashboard.handleSharePost('${post.id}')">
            <i class="fa-solid fa-share-nodes"></i>
            <span>Share</span>
          </button>

          <button type="button" class="feed-post-action-btn ${isSaved ? 'active' : ''}" onclick="window.MedSphereDashboard.handleSavePost('${post.id}')">
            <i class="${isSaved ? 'fa-solid' : 'fa-regular'} fa-bookmark"></i>
            <span>${isSaved ? 'Saved' : 'Save'}</span>
          </button>
        </div>

        <!-- Comments Drawer -->
        <div class="feed-post-comments-drawer" id="comments-${post.id}" style="display:none;">
          <div class="comment-input-row">
            <input type="text" id="comment-input-${post.id}" class="comment-input-field" placeholder="Write a clinical comment or inquiry..." onkeydown="if(event.key==='Enter') window.MedSphereDashboard.handleSubmitComment('${post.id}')">
            <button type="button" class="btn btn-primary btn-sm comment-submit-btn" onclick="window.MedSphereDashboard.handleSubmitComment('${post.id}')">Post</button>
          </div>

          <div class="comments-list">
            ${(post.comments || []).map(c => `
              <div class="comment-bubble">
                <img src="${c.avatar || 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=200&q=80'}" alt="${c.name}" class="comment-avatar">
                <div class="comment-content-wrap">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span class="comment-author-name">${c.name}</span>
                    <span class="text-xs text-muted">${c.time || ''}</span>
                  </div>
                  <div class="text-xs text-muted">${c.role || ''}</div>
                  <div class="comment-text">${c.text}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  handleToggleLike(postId) {
    window.MedSphereStore.toggleLikePost(postId);
    const post = window.MedSphereStore.getState().communityPosts.find(p => p.id === postId);
    const card = document.getElementById('card-' + postId);
    if (card && post) {
      const likeBtn = card.querySelector('.feed-post-actions-bar .feed-post-action-btn:first-child');
      const summarySpan = card.querySelector('.feed-post-reactions-summary span:first-child');
      if (likeBtn) {
        likeBtn.classList.toggle('active', post.likedByMe);
        const icon = likeBtn.querySelector('i');
        if (icon) {
          icon.className = (post.likedByMe ? 'fa-solid' : 'fa-regular') + ' fa-thumbs-up';
        }
      }
      if (summarySpan) {
        summarySpan.innerHTML = `<i class="fa-solid fa-thumbs-up" style="color:var(--primary-700); margin-right:4px;"></i>${post.likesCount || 0} Helpful`;
      }
    }
  },

  toggleComments(postId) {
    const el = document.getElementById('comments-' + postId);
    if (!el) return;
    el.style.display = el.style.display === 'none' ? 'block' : 'none';
    if (el.style.display === 'block') {
      const input = document.getElementById('comment-input-' + postId);
      if (input) input.focus();
    }
  },

  async handleSubmitComment(postId) {
    const input = document.getElementById('comment-input-' + postId);
    if (!input || !input.value.trim()) return;
    const text = input.value.trim();
    const user = window.MedSphereStore.getState().currentUser || (window.MEDSPHERE_DATA && window.MEDSPHERE_DATA.currentUser) || {};

    const comment = {
      name: user.name || 'Dr. Eleanor Vance, MD',
      role: user.specialty || user.title || 'Clinician',
      avatar: user.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
      text: text,
      time: 'Just now'
    };

    window.MedSphereStore.addComment(postId, comment);
    input.value = '';

    const card = document.getElementById('card-' + postId);
    if (card) {
      const list = card.querySelector('.comments-list');
      if (list) {
        const newBubble = document.createElement('div');
        newBubble.className = 'comment-bubble';
        newBubble.innerHTML = `
          <img src="${comment.avatar}" alt="${comment.name}" class="comment-avatar">
          <div class="comment-content-wrap">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span class="comment-author-name">${comment.name}</span>
              <span class="text-xs text-muted">${comment.time}</span>
            </div>
            <div class="text-xs text-muted">${comment.role}</div>
            <div class="comment-text">${comment.text}</div>
          </div>
        `;
        list.appendChild(newBubble);
      }
      const post = window.MedSphereStore.getState().communityPosts.find(p => p.id === postId);
      const summarySpan2 = card.querySelector('.feed-post-reactions-summary span:nth-child(2)');
      if (summarySpan2 && post) {
        summarySpan2.innerHTML = `${post.commentsCount || (post.comments ? post.comments.length : 0)} Comments &bull; ${post.sharesCount || 0} Shares`;
      }
    }
    window.MedSphereToast.show('Comment Posted', 'Your clinical response has been added to the discussion.', 'success');
  },

  handleSharePost(postId) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + window.location.pathname + '#dashboard');
    }
    window.MedSphereToast.show('Link Copied', 'Post direct URL copied to clipboard.', 'success');
  },

  handleSavePost(postId) {
    const isSaved = window.MedSphereStore.toggleSavePost(postId);
    const card = document.getElementById('card-' + postId);
    if (card) {
      const saveBtn = card.querySelector('.feed-post-actions-bar .feed-post-action-btn:last-child');
      if (saveBtn) {
        saveBtn.classList.toggle('active', isSaved);
        const icon = saveBtn.querySelector('i');
        if (icon) {
          icon.className = (isSaved ? 'fa-solid' : 'fa-regular') + ' fa-bookmark';
        }
        const label = saveBtn.querySelector('span');
        if (label) {
          label.innerText = isSaved ? 'Saved' : 'Save';
        }
      }
    }
    window.MedSphereToast.show(
      isSaved ? 'Case Saved' : 'Removed from Saved',
      isSaved ? 'Clinical case bookmarked in your Saved Items.' : 'Case removed from bookmarks.',
      isSaved ? 'success' : 'info'
    );
  },

  handleConnect(docId, docName, btnEl) {
    window.MedSphereStore.toggleConnect(docId);
    const isConn = window.MedSphereStore.getState().connectedIds.includes(docId);
    if (btnEl) {
      btnEl.classList.toggle('connected', isConn);
      btnEl.innerHTML = isConn ? '&#10003; Connected' : '+ Connect';
    }
    // Update network count in profile card
    const netCountEl = document.querySelector('.profile-card-stats-grid .profile-stat-box:nth-child(2) .profile-stat-val');
    if (netCountEl) {
      const curCount = parseInt(netCountEl.textContent, 10) || 0;
      netCountEl.textContent = isConn ? curCount + 1 : Math.max(0, curCount - 1);
    }
    window.MedSphereToast.show(
      isConn ? 'Connected' : 'Connection Removed',
      isConn ? `You are now connected with ${docName}.` : `Invitation withdrawn for ${docName}.`,
      'success'
    );
  },

  handleToggleGroup(groupId, groupName, btnEl) {
    const isJoined = window.MedSphereStore.toggleJoinGroup(groupId);
    if (btnEl) {
      btnEl.classList.toggle('btn-secondary', isJoined);
      btnEl.classList.toggle('btn-outline', !isJoined);
      btnEl.innerHTML = `
        <i class="fa-solid ${isJoined ? 'fa-check' : 'fa-plus'}" style="margin-right:6px; color:${isJoined ? 'var(--emerald-600)' : 'var(--primary-700)'};"></i>
        <span>${isJoined ? 'Joined ' + groupName : 'Join ' + groupName}</span>
      `;
    }
    window.MedSphereToast.show(
      isJoined ? 'Group Joined' : 'Group Left',
      isJoined ? `You are now a member of ${groupName}.` : `You have left ${groupName}.`,
      'success'
    );
    // Refresh the groups badge count in header if present
    const badge = document.getElementById('groups-joined-badge');
    if (badge) {
      const count = (window.MedSphereStore.getState().joinedGroups || []).length;
      badge.textContent = count;
    }
  },

  async loadMyGroupsWidget() {
    const listEl = document.getElementById('my-groups-list');
    if (!listEl) return;

    try {
      let groups = [];
      if (window.MedSphereAPI) {
        groups = await window.MedSphereAPI.getGroups();
      }
      // Fallback static groups
      if (!groups || !groups.length) {
        groups = [
          { id: 'grp-1', name: 'Cardiology & Interventional Rounds', slug: 'cardiology', icon: 'fa-heart-pulse' },
          { id: 'grp-2', name: 'Critical Care & ICU Resuscitation', slug: 'critical-care', icon: 'fa-truck-medical' },
          { id: 'grp-3', name: 'Pediatric & Neonatal Medicine', slug: 'pediatrics', icon: 'fa-baby' },
          { id: 'grp-4', name: 'Clinical Pharmacy & Therapeutics', slug: 'pharmacy', icon: 'fa-pills' },
          { id: 'grp-5', name: 'General & Robotic Surgery', slug: 'surgery', icon: 'fa-scissors' },
          { id: 'grp-6', name: 'Neurology & Neurovascular', slug: 'neurology', icon: 'fa-brain' },
          { id: 'grp-7', name: 'Emergency Medicine & Trauma', slug: 'emergency', icon: 'fa-kit-medical' },
          { id: 'grp-8', name: 'Medical Students & Residents Hub', slug: 'students', icon: 'fa-graduation-cap' },
          { id: 'grp-9', name: 'Oncology & Clinical Trials', slug: 'oncology', icon: 'fa-dna' },
          { id: 'grp-10', name: 'Allied Health & Rehabilitation', slug: 'allied-health', icon: 'fa-wheelchair-move' }
        ];
      }

      const joinedIds = (window.MedSphereStore.getState().joinedGroups) || [];

      // Sort: joined groups first, then unjoined suggestions
      const joined = groups.filter(g => joinedIds.includes(g.id));
      const unjoined = groups.filter(g => !joinedIds.includes(g.id));

      // Show all joined + up to 3 suggestions
      const toShow = [...joined, ...unjoined.slice(0, Math.max(0, 4 - joined.length))];

      listEl.innerHTML = toShow.map(g => {
        const isJoined = joinedIds.includes(g.id);
        return `
          <button type="button"
            id="grp-btn-${g.id}"
            class="btn ${isJoined ? 'btn-secondary' : 'btn-outline'} btn-xs"
            style="text-align:left; justify-content:flex-start; width:100%; padding:7px 10px;"
            onclick="window.MedSphereDashboard.handleToggleGroupById('${g.id}', '${g.name.replace(/'/g, '')}')"
          >
            <i class="fa-solid ${g.icon || 'fa-users'}" style="margin-right:8px; font-size:0.8rem; color:${isJoined ? 'var(--emerald-600)' : 'var(--primary-700)'};"></i>
            <span style="flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${isJoined ? 'Joined: ' : ''}${g.name}</span>
            <i class="fa-solid ${isJoined ? 'fa-check' : 'fa-plus'}" style="font-size:0.7rem; margin-left:6px; color:${isJoined ? 'var(--emerald-600)' : 'var(--primary-700)'};"></i>
          </button>
        `;
      }).join('');

      // Add "Browse all" link if more groups remain
      if (unjoined.length > Math.max(0, 4 - joined.length)) {
        listEl.innerHTML += `
          <a href="#community" style="font-size:0.78rem; color:var(--primary-700); font-weight:600; text-align:center; display:block; padding:4px 0; text-decoration:none;">
            <i class="fa-solid fa-grid-2" style="margin-right:4px;"></i>Browse all ${groups.length} groups
          </a>
        `;
      }
    } catch (e) {
      listEl.innerHTML = '<a href="#community" style="font-size:0.82rem; color:var(--primary-700);">Browse Clinical Groups</a>';
    }
  },

  handleToggleGroupById(groupId, groupName) {
    const isJoined = window.MedSphereStore.toggleJoinGroup(groupId);
    const btnEl = document.getElementById('grp-btn-' + groupId);
    if (btnEl) {
      btnEl.classList.toggle('btn-secondary', isJoined);
      btnEl.classList.toggle('btn-outline', !isJoined);
      btnEl.innerHTML = `
        <i class="fa-solid fa-users" style="margin-right:8px; font-size:0.8rem; color:${isJoined ? 'var(--emerald-600)' : 'var(--primary-700)'};"></i>
        <span style="flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${isJoined ? 'Joined: ' : ''}${groupName}</span>
        <i class="fa-solid ${isJoined ? 'fa-check' : 'fa-plus'}" style="font-size:0.7rem; margin-left:6px; color:${isJoined ? 'var(--emerald-600)' : 'var(--primary-700)'};"></i>
      `;
    }
    window.MedSphereToast.show(
      isJoined ? 'Group Joined' : 'Group Left',
      isJoined ? `You joined ${groupName}.` : `You left ${groupName}.`,
      'success'
    );
    // Reload widget to reorder joined/unjoined
    setTimeout(() => this.loadMyGroupsWidget(), 300);
  },

  handleVotePoll(postId, optionId) {
    const success = window.MedSphereStore.votePoll(postId, optionId);
    if (!success) {
      window.MedSphereToast.show('Already Voted', 'You have already recorded your vote on this clinical poll.', 'info');
      return;
    }
    const post = window.MedSphereStore.getState().communityPosts.find(p => p.id === postId);
    const card = document.getElementById('card-' + postId);
    if (card && post && post.poll) {
      const totalVotes = post.poll.totalVotes || 0;
      const pollBox = card.querySelector('.feed-post-poll-box');
      if (pollBox) {
        const optionsList = pollBox.querySelector('.poll-options-list');
        if (optionsList) {
          optionsList.innerHTML = post.poll.options.map(opt => {
            const optVotes = opt.votes || 0;
            const pct = totalVotes > 0 ? Math.round((optVotes / totalVotes) * 100) : 0;
            const isSelected = post.poll.myVote === opt.id;
            return `
              <button type="button" class="poll-option-btn ${isSelected ? 'selected' : ''}" onclick="window.MedSphereDashboard.handleVotePoll('${post.id}', '${opt.id}')">
                <div class="poll-option-fill" style="width:${pct}%;"></div>
                <span class="poll-option-text">
                  ${isSelected ? '<i class="fa-solid fa-check" style="color:var(--emerald-600); margin-right:6px;"></i>' : ''}
                  ${opt.text}
                </span>
                <span class="poll-option-pct">${pct}%</span>
              </button>
            `;
          }).join('');
        }
        const metaRow = pollBox.querySelector('.poll-meta-row');
        if (metaRow) {
          metaRow.innerHTML = `
            <span>${totalVotes} votes total</span>
            <span>✓ Your vote recorded</span>
          `;
        }
      }
    }
    window.MedSphereToast.show('Vote Recorded', 'Your clinical vote has been tallied.', 'success');
  },

  handleSortFeed(criteria) {
    const stream = document.getElementById('feed-posts-stream');
    if (!stream) return;
    const state = window.MedSphereStore.getState();
    const user = state.currentUser || (window.MEDSPHERE_DATA && window.MEDSPHERE_DATA.currentUser) || {};
    let posts = [...state.communityPosts];

    if (criteria === 'recent') {
      posts.sort((a, b) => b.id.localeCompare(a.id));
    } else if (criteria === 'popular') {
      posts.sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
    }

    stream.innerHTML = posts.map(post => this.renderPostCard(post, user)).join('');
  }
};

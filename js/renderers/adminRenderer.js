// MedSphere Admin Oversight & Moderation Dashboard Renderer

window.MedSphereAdmin = {
  activeTab: 'users',
  usersList: [],
  stats: null,

  async renderAdmin() {
    const store = window.MedSphereStore;
    const currentUser = store.getState().currentUser;

    // Check if user is admin (or prompt to switch to admin demo)
    const isAdmin = currentUser.role === 'admin' || currentUser.email === 'admin@medsphere.health';

    let stats = { totalUsers: 6, activeJobs: 3, activeCourses: 2, activeProducts: 3, totalApplications: 1, totalPosts: 2, demoRequests: 1 };
    let users = [];
    let verifications = [];

    try {
      if (window.MedSphereAPI) {
        stats = await window.MedSphereAPI.getAdminStats().catch(() => stats);
        users = await window.MedSphereAPI.getAdminUsers().catch(() => []);
        verifications = await window.MedSphereAPI.getAdminVerifications().catch(() => []);
      }
    } catch (e) {}

    this.stats = stats;
    this.usersList = users;
    this.verificationsList = verifications;

    return `
      <div class="dashboard-container">
        <!-- Admin Sidebar -->
        <aside class="dashboard-sidebar">
          <div class="dash-user-profile-badge">
            <img src="${currentUser.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}" alt="Admin" class="dash-avatar">
            <div class="dash-user-meta">
              <div class="dash-user-name">${currentUser.name || 'Admin'}</div>
              <span class="badge badge-cme" style="font-size:0.7rem; margin-top:2px;">Platform Admin</span>
            </div>
          </div>

          <nav class="dash-nav-menu">
            <button class="dash-nav-item ${this.activeTab==='users'?'active':''}" style="width:100%; border:none; background:transparent; cursor:pointer;" onclick="window.MedSphereAdmin.switchTab('users')">
              <i class="fa-solid fa-users" style="font-size:1.1rem; width:20px; text-align:center;"></i>
              <span>User Directory</span>
            </button>
            <button class="dash-nav-item ${this.activeTab==='verifications'?'active':''}" style="width:100%; border:none; background:transparent; cursor:pointer;" onclick="window.MedSphereAdmin.switchTab('verifications')">
              <i class="fa-solid fa-certificate" style="font-size:1.1rem; width:20px; text-align:center;"></i>
              <span>Verification Queue (${verifications.filter(v => v.status==='Pending').length})</span>
            </button>
            <button class="dash-nav-item ${this.activeTab==='jobs'?'active':''}" style="width:100%; border:none; background:transparent; cursor:pointer;" onclick="window.MedSphereAdmin.switchTab('jobs')">
              <i class="fa-solid fa-briefcase" style="font-size:1.1rem; width:20px; text-align:center;"></i>
              <span>Jobs & Vacancies</span>
            </button>
            <button class="dash-nav-item ${this.activeTab==='marketplace'?'active':''}" style="width:100%; border:none; background:transparent; cursor:pointer;" onclick="window.MedSphereAdmin.switchTab('marketplace')">
              <i class="fa-solid fa-cart-shopping" style="font-size:1.1rem; width:20px; text-align:center;"></i>
              <span>Marketplace Products</span>
            </button>
            <button class="dash-nav-item ${this.activeTab==='moderation'?'active':''}" style="width:100%; border:none; background:transparent; cursor:pointer;" onclick="window.MedSphereAdmin.switchTab('moderation')">
              <i class="fa-solid fa-shield-halved" style="font-size:1.1rem; width:20px; text-align:center;"></i>
              <span>Community Moderation</span>
            </button>
            <button class="dash-nav-item ${this.activeTab==='demos'?'active':''}" style="width:100%; border:none; background:transparent; cursor:pointer;" onclick="window.MedSphereAdmin.switchTab('demos')">
              <i class="fa-solid fa-envelope" style="font-size:1.1rem; width:20px; text-align:center;"></i>
              <span>Demo Requests</span>
            </button>
            <a href="#dashboard" class="dash-nav-item" style="margin-top:1rem; border-top:1px solid var(--border-subtle); padding-top:1rem;">
              <span><i class="fa-solid fa-arrow-left" style="margin-right:6px;"></i> Clinician Dashboard</span>
            </a>
          </nav>
        </aside>

        <!-- Main Content -->
        <main class="dashboard-main">
          <div class="dashboard-topbar">
            <div>
              <span class="section-eyebrow">MEDSPHERE ENTERPRISE OVERSIGHT</span>
              <h1 class="dash-page-title" style="margin-top:0.35rem;">Platform Administration & Governance</h1>
              <p class="dash-page-sub">Manage user licensing, clinical vacancies, and platform compliance.</p>
            </div>
          </div>

          <!-- Stats Strip -->
          <div class="dash-metrics-grid">
            <div class="dash-metric-card">
              <div class="metric-header">
                <span class="metric-title">Registered Clinicians</span>
              </div>
              <div class="metric-value">${stats.totalUsers}</div>
              <div class="metric-trend">Verified Database</div>
            </div>
            <div class="dash-metric-card">
              <div class="metric-header">
                <span class="metric-title">Clinical Openings</span>
              </div>
              <div class="metric-value">${stats.activeJobs}</div>
              <div class="metric-trend">Active hospital postings</div>
            </div>
            <div class="dash-metric-card">
              <div class="metric-header">
                <span class="metric-title">CME Modules</span>
              </div>
              <div class="metric-value">${stats.activeCourses}</div>
              <div class="metric-trend">Accredited curricula</div>
            </div>
            <div class="dash-metric-card">
              <div class="metric-header">
                <span class="metric-title">Marketplace Catalog</span>
              </div>
              <div class="metric-value">${stats.activeProducts}</div>
              <div class="metric-trend">Certified devices</div>
            </div>
          </div>

          <!-- Content Tab View -->
          ${this.renderActiveTab(this.activeTab, users)}
        </main>
      </div>
    `;
  },

  renderActiveTab(tab, users) {
    if (tab === 'verifications') {
      const verifications = this.verificationsList || [];
      return `
        <div class="dash-section-box">
          <div class="dash-box-header">
            <div>
              <h3 class="dash-box-title">Healthcare Credential Verification Queue</h3>
              <p class="text-xs text-muted" style="margin:2px 0 0 0;">Primary source review of medical licenses, NPI registries, and specialty board diplomas</p>
            </div>
            <span class="badge badge-cme">${verifications.filter(v => v.status === 'Pending').length} Pending Compliance Review</span>
          </div>

          <div style="overflow-x:auto;">
            <table class="w-100" style="font-size:0.875rem; border-collapse:collapse;">
              <thead>
                <tr style="text-align:left; border-bottom:2px solid var(--border-subtle); color:var(--slate-500);">
                  <th style="padding:0.75rem;">Clinician Name</th>
                  <th style="padding:0.75rem;">Specialty &amp; Org</th>
                  <th style="padding:0.75rem;">License Number</th>
                  <th style="padding:0.75rem;">Issuing Authority</th>
                  <th style="padding:0.75rem;">Document Type</th>
                  <th style="padding:0.75rem;">Status</th>
                  <th style="padding:0.75rem; text-align:right;">Compliance Action</th>
                </tr>
              </thead>
              <tbody>
                ${verifications.length ? verifications.map(v => `
                  <tr style="border-bottom:1px solid var(--border-subtle);">
                    <td style="padding:0.85rem;">
                      <strong style="color:var(--primary-900);">${v.full_name || 'Clinician'}</strong>
                      <div class="text-xs text-muted">${v.email}</div>
                    </td>
                    <td style="padding:0.85rem;">
                      <div>${v.specialty || 'Medicine'}</div>
                      <div class="text-xs text-muted">${v.organization || 'Independent'}</div>
                    </td>
                    <td style="padding:0.85rem; font-family:monospace; font-weight:700; color:var(--primary-900);">${v.license_number}</td>
                    <td style="padding:0.85rem; color:var(--slate-700); font-size:0.8125rem;">${v.issuing_authority}</td>
                    <td style="padding:0.85rem;"><span class="badge badge-blue">${v.document_type || 'License'}</span></td>
                    <td style="padding:0.85rem;">
                      <span class="badge ${v.status === 'Verified' ? 'badge-green' : (v.status === 'Rejected' ? 'badge' : 'badge-cme')}" style="${v.status === 'Rejected' ? 'background:var(--red-100, #fee2e2); color:var(--red-700, #b91c1c);' : ''}">
                        ${v.status}
                      </span>
                    </td>
                    <td style="padding:0.85rem; text-align:right;">
                      <div style="display:flex; justify-content:flex-end; gap:0.4rem;">
                        <button class="btn btn-primary btn-xs" onclick="window.MedSphereAdmin.handleReviewVerification('${v.id}', 'Verified')">
                          <i class="fa-solid fa-check" style="margin-right:3px;"></i> Verify
                        </button>
                        <button class="btn btn-outline btn-xs" style="color:var(--red-600, #dc2626);" onclick="window.MedSphereAdmin.handleReviewVerification('${v.id}', 'Rejected')">
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                `).join('') : `
                  <tr>
                    <td colspan="7" class="text-center" style="padding:2.5rem; color:var(--slate-500);">
                      No pending credential submissions in queue.
                    </td>
                  </tr>
                `}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    if (tab === 'jobs') {
      const jobs = window.MEDSPHERE_DATA.jobs;
      return `
        <div class="dash-section-box">
          <div class="dash-box-header">
            <h3 class="dash-box-title">Hospital Job Postings Management</h3>
            <button class="btn btn-primary btn-sm" onclick="window.MedSphereModals.open('modal-post-job')">+ Post New Role</button>
          </div>
          <table class="w-100" style="font-size:0.875rem; border-collapse:collapse;">
            <thead>
              <tr style="text-align:left; border-bottom:2px solid var(--border-subtle); color:var(--slate-500);">
                <th style="padding:0.75rem;">Title</th>
                <th style="padding:0.75rem;">Health System</th>
                <th style="padding:0.75rem;">Specialty</th>
                <th style="padding:0.75rem;">Salary</th>
                <th style="padding:0.75rem;">Status</th>
                <th style="padding:0.75rem; text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${jobs.map(j => `
                <tr style="border-bottom:1px solid var(--border-subtle);">
                  <td style="padding:0.85rem; font-weight:700;">${j.title}</td>
                  <td style="padding:0.85rem;">${j.company}</td>
                  <td style="padding:0.85rem;"><span class="badge badge-blue">${j.specialty}</span></td>
                  <td style="padding:0.85rem;">${j.salary}</td>
                  <td style="padding:0.85rem;"><span class="badge badge-green">Active</span></td>
                  <td style="padding:0.85rem; text-align:right;">
                    <a href="#job?id=${j.id}" class="btn btn-outline btn-sm">Inspect</a>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    if (tab === 'marketplace') {
      const products = window.MEDSPHERE_DATA.products;
      return `
        <div class="dash-section-box">
          <div class="dash-box-header">
            <h3 class="dash-box-title">Healthcare Marketplace Catalog Moderation</h3>
            <button class="btn btn-primary btn-sm" onclick="window.MedSphereModals.open('modal-add-product')">+ Add Device</button>
          </div>
          <table class="w-100" style="font-size:0.875rem; border-collapse:collapse;">
            <thead>
              <tr style="text-align:left; border-bottom:2px solid var(--border-subtle); color:var(--slate-500);">
                <th style="padding:0.75rem;">Product</th>
                <th style="padding:0.75rem;">Manufacturer</th>
                <th style="padding:0.75rem;">Category</th>
                <th style="padding:0.75rem;">Price</th>
                <th style="padding:0.75rem;">Certification</th>
                <th style="padding:0.75rem; text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${products.map(p => `
                <tr style="border-bottom:1px solid var(--border-subtle);">
                  <td style="padding:0.85rem; font-weight:700;">${p.name}</td>
                  <td style="padding:0.85rem;">${p.company}</td>
                  <td style="padding:0.85rem;"><span class="badge badge-blue">${p.category}</span></td>
                  <td style="padding:0.85rem; font-weight:600;">${p.price}</td>
                  <td style="padding:0.85rem;"><span class="badge badge-green">${p.badge || 'FDA Cleared'}</span></td>
                  <td style="padding:0.85rem; text-align:right;">
                    <a href="#product?id=${p.id}" class="btn btn-outline btn-sm">View</a>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    if (tab === 'moderation') {
      const posts = window.MedSphereStore.getState().communityPosts;
      return `
        <div class="dash-section-box">
          <div class="dash-box-header">
            <h3 class="dash-box-title">Clinical Community Moderation &amp; HIPAA Compliance</h3>
            <span class="badge badge-green">Safe Harbor Protocol</span>
          </div>
          <div style="display:flex; flex-direction:column; gap:1rem;">
            ${posts.map(p => `
              <div style="padding:1rem; border:1px solid var(--border-subtle); border-radius:10px; background:#fff; display:flex; justify-content:space-between; align-items:flex-start; gap:1rem;">
                <div>
                  <div style="display:flex; align-items:center; gap:8px;">
                    <strong style="color:var(--primary-900); font-size:0.95rem;">${p.authorName}</strong>
                    <span class="badge badge-blue">${p.specialtyTag}</span>
                    <span class="text-xs text-muted">${p.time}</span>
                  </div>
                  <p style="font-size:0.875rem; color:var(--slate-800); margin:0.5rem 0; line-height:1.5;">${p.content}</p>
                </div>
                <button class="btn btn-outline btn-xs" style="color:var(--red-600, #dc2626);" onclick="window.MedSphereToast.show('Moderated', 'Post marked for HIPAA review.', 'info')">
                  Moderate
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (tab === 'demos') {
      return `
        <div class="dash-section-box">
          <div class="dash-box-header">
            <h3 class="dash-box-title">Hospital Enterprise Demo Requests</h3>
            <span class="badge badge-blue">Direct Health System Inbound</span>
          </div>
          <div style="display:flex; flex-direction:column; gap:1rem;">
            <div style="padding:1rem; background:var(--primary-50); border:1px solid var(--border-subtle); border-radius:var(--radius-md); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
              <div>
                <strong style="color:var(--primary-900);">St. Luke's Medical Center</strong>
                <p class="text-sm text-muted">Contact: Dr. Jane Doe (jane@hospital.org) · Type: Academic Health System</p>
                <p class="text-xs" style="margin-top:4px;">"Looking to onboard 450 attending physicians and streamline cath-lab device procurement."</p>
              </div>
              <button class="btn btn-primary btn-sm" onclick="window.MedSphereToast.show('Contacted', 'Outreach email scheduled.', 'success')">Schedule Demo Call</button>
            </div>
          </div>
        </div>
      `;
    }

    // Default: Users & License Verification
    return `
      <div class="dash-section-box">
        <div class="dash-box-header">
          <h3 class="dash-box-title">Registered Users & Medical License Verification</h3>
          <div style="font-size:0.8125rem; color:var(--slate-500);">Direct SQLite synchronization</div>
        </div>

        <table class="w-100" style="font-size:0.875rem; border-collapse:collapse;">
          <thead>
            <tr style="text-align:left; border-bottom:2px solid var(--border-subtle); color:var(--slate-500);">
              <th style="padding:0.75rem;">Clinician Name</th>
              <th style="padding:0.75rem;">Email</th>
              <th style="padding:0.75rem;">Specialty / Role</th>
              <th style="padding:0.75rem;">Organization</th>
              <th style="padding:0.75rem;">Verification Status</th>
              <th style="padding:0.75rem; text-align:right;">Oversight Action</th>
            </tr>
          </thead>
          <tbody>
            ${users.map(u => `
              <tr style="border-bottom:1px solid var(--border-subtle);">
                <td style="padding:0.85rem; font-weight:700;">${u.full_name || 'Clinician'}</td>
                <td style="padding:0.85rem; color:var(--slate-600);">${u.email}</td>
                <td style="padding:0.85rem;"><span class="badge badge-blue">${u.specialty || u.role}</span></td>
                <td style="padding:0.85rem;">${u.organization || 'Independent'}</td>
                <td style="padding:0.85rem;">
                  ${u.is_verified ? '<span class="badge badge-green"><i class="fa-solid fa-circle-check" style="margin-right:4px;"></i> Verified License</span>' : '<span class="badge" style="background:var(--slate-200);">Unverified</span>'}
                </td>
                <td style="padding:0.85rem; text-align:right;">
                  <button class="btn ${u.is_verified ? 'btn-outline' : 'btn-primary'} btn-sm" onclick="window.MedSphereAdmin.toggleVerification('${u.id}', ${!u.is_verified})">
                    ${u.is_verified ? 'Revoke License' : 'Verify NPI License'}
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  switchTab(tab) {
    this.activeTab = tab;
    window.MedSphereRouter.refreshCurrentPage();
  },

  async toggleVerification(userId, newStatus) {
    try {
      await window.MedSphereAPI.verifyUser(userId, newStatus);
      window.MedSphereToast.show("Verification Updated", `Clinician status updated to ${newStatus ? 'Verified' : 'Unverified'}.`, "success");
      window.MedSphereRouter.refreshCurrentPage();
    } catch (e) {
      window.MedSphereToast.show("Error", e.message || "Failed to update verification", "error");
    }
  },

  async handleReviewVerification(verificationId, status) {
    try {
      await window.MedSphereAPI.reviewVerification(verificationId, {
        status: status,
        admin_notes: `Reviewed and approved by MedSphere Compliance Officer on ${new Date().toLocaleDateString()}`
      });
      window.MedSphereToast.show('Verification Updated', `Credential record marked as ${status}. User status updated in database.`, 'success');
      window.MedSphereRouter.refreshCurrentPage();
    } catch (e) {
      window.MedSphereToast.show('Error', e.message || 'Could not review verification', 'error');
    }
  }
};

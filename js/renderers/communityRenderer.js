// MedSphere Community, Insights, About, Events & Pricing Renderer

window.MedSphereCommunity = {
  // 1. Community Discussion Feed & Specialty Groups
  async renderCommunity(params = {}) {
    const store = window.MedSphereStore;
    const allPosts = store.getState().communityPosts;
    const tagFilter = params.tag || params.group || '';

    let groups = [];
    try {
      if (window.MedSphereAPI) {
        groups = await window.MedSphereAPI.getGroups();
      }
    } catch (e) {}

    const posts = tagFilter ? allPosts.filter(p => (p.specialtyTag || '').toLowerCase().includes(tagFilter.toLowerCase())) : allPosts;

    return `
      <div class="page-hero-banner">
        <div class="container">
          <div class="breadcrumbs">
            <a href="#home">Home</a> <span>/</span> <span>Clinical Community</span>
          </div>
          <h1 class="page-title">Healthcare Community & Clinical Case Rounds</h1>
          <p class="section-subtitle">
            Peer-to-peer clinical problem solving, grand rounds discussion, and 10 verified medical specialty groups in a HIPAA-safe environment.
          </p>
        </div>
      </div>

      <div class="container">
        <!-- 10 Medical Specialty Groups Grid -->
        <div style="margin-bottom:2.5rem; background:#fff; padding:1.5rem; border-radius:14px; border:1px solid var(--border-subtle); box-shadow:var(--shadow-sm);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
            <div>
              <h3 style="font-size:1.15rem; color:var(--primary-900); margin:0;">Clinical Specialty Groups (10 Communities)</h3>
              <p class="text-xs text-muted" style="margin:2px 0 0 0;">Join verified peer sub-specialties to exchange protocols, ECGs, and surgical techniques</p>
            </div>
            ${tagFilter ? `<a href="#community" class="btn btn-outline btn-xs"><i class="fa-solid fa-xmark" style="margin-right:4px;"></i> Clear Filter: ${tagFilter}</a>` : ''}
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(220px, 1fr)); gap:1rem;">
            ${(groups.length ? groups : [
              { id: 'grp-cardio', name: 'Cardiology', slug: 'cardiology', icon: 'fa-heart-pulse', description: 'Coronary, structural heart, EP', members_count: 420 },
              { id: 'grp-icu', name: 'Critical Care / ICU', slug: 'icu', icon: 'fa-hospital', description: 'Hemodynamics, sepsis, ECMO', members_count: 310 },
              { id: 'grp-peds', name: 'Pediatrics', slug: 'pediatrics', icon: 'fa-baby', description: 'Neonatal & pediatric medicine', members_count: 260 },
              { id: 'grp-surgery', name: 'Surgery', slug: 'surgery', icon: 'fa-scalpel', description: 'Operative pearls & minimally invasive', members_count: 380 },
              { id: 'grp-students', name: 'Medical Students', slug: 'students', icon: 'fa-graduation-cap', description: 'USMLE, clinical rotations, matching', members_count: 540 }
            ]).map(g => {
              const isActive = tagFilter && tagFilter.toLowerCase() === g.slug.toLowerCase();
              return `
                <div style="border:1px solid ${isActive ? 'var(--primary-700)' : 'var(--border-subtle)'}; background:${isActive ? 'var(--primary-50)' : 'var(--slate-50)'}; border-radius:10px; padding:0.85rem; display:flex; flex-direction:column; justify-content:space-between; gap:0.5rem;">
                  <div>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                      <i class="fa-solid ${g.icon || 'fa-user-doctor'}" style="color:var(--primary-700); font-size:1.1rem;"></i>
                      <span class="text-xs text-muted"><i class="fa-solid fa-users" style="margin-right:3px;"></i>${g.members_count || 100}</span>
                    </div>
                    <strong style="font-size:0.9rem; color:var(--primary-900); display:block; margin-top:4px;">
                      <a href="#community?group=${g.slug}" style="color:inherit;">${g.name}</a>
                    </strong>
                    <p class="text-xs text-muted" style="margin:2px 0 0 0; line-height:1.4;">${g.description || ''}</p>
                  </div>
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
                    <a href="#community?group=${g.slug}" class="text-xs" style="color:var(--primary-700); font-weight:600;">Feed</a>
                    <button class="btn ${g.is_member ? 'btn-secondary' : 'btn-outline'} btn-xs" onclick="window.MedSphereCommunity.handleToggleGroup('${g.id}')">
                      ${g.is_member ? '&#10003; Joined' : '+ Join'}
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div class="community-feed-grid">
          <!-- Left Channel Nav -->
          <aside>
            <div class="filter-widget">
              <h4 class="filter-widget-title">Filter by Channel</h4>
              <div class="filter-checkbox-list">
                <a href="#community" class="filter-pill ${!tagFilter ? 'active' : ''}" style="text-align:center;">All Discussions</a>
                <a href="#community?tag=cardiology" class="filter-pill ${tagFilter === 'cardiology' ? 'active' : ''}" style="text-align:center;"><i class="fa-solid fa-heart-pulse" style="margin-right:6px; color:var(--red-500, #ef4444);"></i> Cardiology</a>
                <a href="#community?tag=icu" class="filter-pill ${tagFilter === 'icu' ? 'active' : ''}" style="text-align:center;"><i class="fa-solid fa-hospital" style="margin-right:6px; color:var(--primary-600);"></i> Critical Care / ICU</a>
                <a href="#community?tag=pediatrics" class="filter-pill ${tagFilter === 'pediatrics' ? 'active' : ''}" style="text-align:center;"><i class="fa-solid fa-baby" style="margin-right:6px; color:var(--amber-500, #f59e0b);"></i> Pediatrics</a>
                <a href="#community?tag=surgery" class="filter-pill ${tagFilter === 'surgery' ? 'active' : ''}" style="text-align:center;"><i class="fa-solid fa-stethoscope" style="margin-right:6px; color:var(--emerald-600);"></i> Surgery</a>
                <a href="#community?tag=pharmacy" class="filter-pill ${tagFilter === 'pharmacy' ? 'active' : ''}" style="text-align:center;"><i class="fa-solid fa-capsules" style="margin-right:6px; color:var(--primary-700);"></i> Pharmacy</a>
                <a href="#community?tag=students" class="filter-pill ${tagFilter === 'students' ? 'active' : ''}" style="text-align:center;"><i class="fa-solid fa-graduation-cap" style="margin-right:6px; color:var(--primary-600);"></i> Medical Students</a>
              </div>
            </div>

            <div class="filter-widget" style="margin-top:1.5rem;">
              <h4 class="filter-widget-title">Clinical Guidelines</h4>
              <p class="text-xs text-muted" style="line-height:1.6;">All discussions are moderated by verified board-certified physicians. Case presentations must be de-identified according to Safe Harbor HIPAA rules.</p>
              <div style="margin-top:0.75rem;">
                <span class="badge badge-green"><i class="fa-solid fa-shield-check" style="margin-right:4px;"></i> HIPAA De-identification Active</span>
              </div>
            </div>
          </aside>

          <!-- Middle Feed -->
          <main>
            <!-- Create Discussion Trigger Box -->
            <div class="create-post-card">
              <img src="${store.getState().currentUser?.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80'}" alt="My Avatar" class="avatar" style="width:44px; height:44px; border-radius:50%; object-fit:cover;">
              <button class="btn btn-outline w-100" style="text-align:left; justify-content:flex-start; color:var(--slate-500); background:var(--slate-50);" onclick="window.MedSphereModals.open('modal-create-post')">
                Share a clinical scenario, ECG, or research inquiry with verified peers...
              </button>
            </div>

            <!-- Feed Posts -->
            <div class="community-posts-list">
              ${posts.map(p => `
                <div class="post-card">
                  <div class="post-header">
                    <div class="post-author-wrap">
                      <img src="${p.authorAvatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80'}" alt="${p.authorName}" style="width:44px; height:44px; border-radius:50%; object-fit:cover;">
                      <div>
                        <strong style="color:var(--primary-900); font-size:0.95rem;">${p.authorName}</strong>
                        <div class="text-xs text-muted">${p.authorRole || 'Clinician'} · ${p.time || 'Recent'}</div>
                      </div>
                    </div>
                    <span class="badge badge-blue">${p.specialtyTag}</span>
                  </div>

                  <p style="font-size:0.95rem; line-height:1.65; color:var(--slate-800); white-space:pre-line; margin-bottom:1.25rem;">
                    ${p.content}
                  </p>

                  <div class="post-actions-bar">
                    <button class="post-action-btn ${p.likedByMe ? 'active' : ''}" onclick="window.MedSphereStore.toggleLikePost('${p.id}'); window.MedSphereRouter.refreshCurrentPage();">
                      <i class="${p.likedByMe ? 'fa-solid' : 'fa-regular'} fa-thumbs-up" style="font-size:1rem; margin-right:4px;"></i>
                      <span>${p.likesCount} Helpful</span>
                    </button>

                    <button class="post-action-btn">
                      <i class="fa-regular fa-comment-dots" style="font-size:1rem; margin-right:4px;"></i>
                      <span>${p.commentsCount || (p.comments ? p.comments.length : 0)} Responses</span>
                    </button>

                    <button class="post-action-btn" onclick="window.MedSphereToast.show('Share', 'Post link copied to clipboard.', 'success')">
                      <i class="fa-solid fa-share-nodes" style="font-size:1rem; margin-right:4px;"></i>
                      <span>Share</span>
                    </button>
                  </div>

                  <!-- Comments Subthread -->
                  ${p.comments && p.comments.length ? `
                    <div style="margin-top:1.25rem; padding-top:1rem; border-top:1px solid var(--border-subtle); display:flex; flex-direction:column; gap:0.85rem;">
                      ${p.comments.map(c => `
                        <div style="display:flex; gap:0.75rem; background:var(--slate-50); padding:0.75rem; border-radius:var(--radius-md);">
                          <img src="${c.avatar || 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=200&q=80'}" alt="${c.name}" style="width:32px; height:32px; border-radius:50%; object-fit:cover;">
                          <div style="flex:1;">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                              <strong style="font-size:0.8125rem; color:var(--primary-900);">${c.name}</strong>
                              <span class="text-xs text-muted">${c.time || ''}</span>
                            </div>
                            <div class="text-xs text-muted">${c.role || ''}</div>
                            <p class="text-xs" style="margin-top:4px; color:var(--slate-700);">${c.text}</p>
                          </div>
                        </div>
                      `).join('')}
                    </div>
                  ` : ''}

                  <!-- Add Comment Form -->
                  <div style="display:flex; gap:0.5rem; margin-top:1rem;">
                    <input type="text" id="comment-input-${p.id}" class="form-control" style="padding:0.45rem 0.85rem; font-size:0.8125rem;" placeholder="Add clinical perspective..." onkeyup="if(event.key==='Enter') window.MedSphereCommunity.submitComment('${p.id}')">
                    <button class="btn btn-secondary btn-sm" onclick="window.MedSphereCommunity.submitComment('${p.id}')">Reply</button>
                  </div>
                </div>
              `).join('')}
            </div>
          </main>

          <!-- Right Column -->
          <aside>
            <div class="filter-widget">
              <h4 class="filter-widget-title">CME & Learning</h4>
              <p class="text-xs text-muted">Earn accredited clinical education hours &amp; AMA PRA certificates.</p>
              <a href="#education" class="btn btn-outline btn-sm w-100" style="margin-top:0.75rem;">
                <i class="fa-solid fa-graduation-cap" style="margin-right:6px;"></i> Browse CME Courses
              </a>
            </div>

            <div class="filter-widget" style="margin-top:1.5rem;">
              <h4 class="filter-widget-title">Trending Clinical Topics</h4>
              <div style="display:flex; flex-direction:column; gap:0.5rem; font-size:0.875rem;">
                <a href="#community?tag=cardiology">#OcclusionMI (OMI vs STEMI)</a>
                <a href="#community?tag=icu">#PediatricECMO</a>
                <a href="#community?tag=cardiology">#TAVRClinicalTrials</a>
                <a href="#community?tag=surgery">#RoboticSurgicalOutcomes</a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    `;
  },

  async handleToggleGroup(groupId) {
    try {
      if (window.MedSphereAPI) {
        const res = await window.MedSphereAPI.toggleGroup(groupId);
        window.MedSphereToast.show(res.joined ? 'Joined Group' : 'Left Group', res.joined ? 'You are now a member of this specialty community.' : 'You have left this specialty community.', 'success');
        window.MedSphereRouter.refreshCurrentPage();
      }
    } catch (e) {
      window.MedSphereToast.show('Error', e.message || 'Could not update group membership', 'error');
    }
  },

  submitComment(postId) {
    const input = document.getElementById(`comment-input-${postId}`);
    if (input && input.value.trim()) {
      window.MedSphereStore.addCommentToPost(postId, input.value.trim());
      input.value = '';
      window.MedSphereToast.show("Comment Added", "Your response has been added to the clinical thread.", "success");
      window.MedSphereRouter.refreshCurrentPage();
    }
  },

  // 2. Knowledge Center & Articles Listing
  renderArticles() {
    const articles = window.MEDSPHERE_DATA.articles;

    return `
      <div class="page-hero-banner">
        <div class="container">
          <div class="breadcrumbs">
            <a href="#home">Home</a> <span>/</span> <span>Knowledge Center</span>
          </div>
          <h1 class="page-title">Medical Knowledge Center & Clinical Insights</h1>
          <p class="section-subtitle">
            Evidence-based clinical reviews, medical career playbooks, and healthcare technology analysis authored by leading practitioners.
          </p>
        </div>
      </div>

      <div class="container" style="padding-top:3rem; padding-bottom:5rem;">
        <div class="articles-grid">
          ${articles.map(art => `
            <div class="article-card">
              <div class="article-img-wrap">
                <img src="${art.image}" alt="${art.title}">
              </div>
              <div class="article-body">
                <span class="article-cat-pill">${art.category}</span>
                <h3 class="article-title" style="font-size:1.2rem;">
                  <a href="#article?id=${art.id}">${art.title}</a>
                </h3>
                <div class="text-xs text-muted" style="margin-bottom:0.75rem;">By ${art.author} · ${art.date} · ${art.readTime}</div>
                <p class="article-excerpt">${art.excerpt}</p>
                <a href="#article?id=${art.id}" class="article-read-link">
                  Read Full Article &rarr;
                </a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  // 3. Article Detail View
  renderArticleDetail(params = {}) {
    const art = window.MEDSPHERE_DATA.articles.find(a => a.id === params.id) || window.MEDSPHERE_DATA.articles[0];

    return `
      <div class="page-hero-banner">
        <div class="container container-narrow">
          <div class="breadcrumbs">
            <a href="#home">Home</a> <span>/</span> <a href="#articles">Articles</a> <span>/</span> <span>${art.title}</span>
          </div>
          <span class="article-cat-pill" style="margin-top:0.5rem;">${art.category}</span>
          <h1 class="page-title" style="margin-top:0.5rem; font-size:2.5rem; line-height:1.2;">${art.title}</h1>
          <div style="font-size:0.95rem; color:var(--slate-600); margin-top:1rem;">
            Authored by <strong>${art.author}</strong> · Published ${art.date} · ${art.readTime}
          </div>
        </div>
      </div>

      <div class="container container-narrow" style="padding-top:3rem; padding-bottom:5rem;">
        <div style="height:380px; overflow:hidden; border-radius:var(--radius-xl); margin-bottom:2.5rem; box-shadow:var(--shadow-md);">
          <img src="${art.image}" alt="${art.title}" style="width:100%; height:100%; object-fit:cover;">
        </div>

        <div class="article-prose" style="font-size:1.1rem; line-height:1.8; color:var(--slate-800);">
          <p style="font-size:1.2rem; font-weight:500; color:var(--slate-700); margin-bottom:2rem; border-left:4px solid var(--primary-700); padding-left:1.25rem;">
            ${art.excerpt}
          </p>
          <div style="white-space:pre-line;">
            ${art.content}
          </div>
        </div>

        <div style="margin-top:3.5rem; padding-top:2rem; border-top:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center;">
          <a href="#articles" class="btn btn-outline">&larr; Back to Knowledge Center</a>
          <button class="btn btn-secondary" onclick="window.MedSphereToast.show('Saved', 'Article bookmarked in your Knowledge vault.', 'success')">Bookmark Article</button>
        </div>
      </div>
    `;
  },

  // 4. Industry & CME Events
  renderEvents() {
    const events = window.MEDSPHERE_DATA.events;

    return `
      <div class="page-hero-banner">
        <div class="container">
          <div class="breadcrumbs">
            <a href="#home">Home</a> <span>/</span> <span>Medical Events</span>
          </div>
          <h1 class="page-title">Healthcare Congresses, Grand Rounds & Webinars</h1>
          <p class="section-subtitle">
            Participate in accredited international medical conferences, clinical masterclasses, and hands-on simulation symposiums.
          </p>
        </div>
      </div>

      <div class="container" style="padding-top:3rem; padding-bottom:5rem;">
        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(420px, 1fr)); gap:2rem;">
          ${events.map(ev => `
            <div class="card card-hover" style="display:flex; flex-direction:column; padding:0; overflow:hidden;">
              <div style="height:200px; overflow:hidden; position:relative;">
                <img src="${ev.image}" alt="${ev.title}" style="width:100%; height:100%; object-fit:cover;">
                <span class="badge badge-cme" style="position:absolute; top:12px; left:12px;">${ev.cmeCredits}</span>
              </div>
              <div style="padding:1.75rem; display:flex; flex-direction:column; flex-grow:1;">
                <div class="text-xs text-muted" style="margin-bottom:0.35rem;"><i class="fa-regular fa-calendar" style="margin-right:4px;"></i> ${ev.date} · <i class="fa-solid fa-location-dot" style="margin-right:4px; margin-left:4px;"></i> ${ev.location}</div>
                <h3 style="font-size:1.3rem; margin-bottom:0.5rem;">${ev.title}</h3>
                <div class="text-xs text-muted" style="margin-bottom:1rem;">Host: <strong>${ev.organizer}</strong> · ${ev.attendees}</div>
                <p class="text-sm text-muted" style="line-height:1.6; margin-bottom:1.5rem; flex-grow:1;">${ev.description}</p>
                <button class="btn btn-primary w-100" onclick="window.MedSphereModals.open('modal-event-register', { id: '${ev.id}', title: '${ev.title.replace(/'/g, "\\'")}', date: '${ev.date}', location: '${ev.location}', cme_credits: '${ev.cmeCredits}' })">
                  <i class="fa-solid fa-ticket" style="margin-right:6px;"></i> Register for Conference (${ev.cmeCredits})
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  // 5. About MedSphere
  renderAbout() {
    return `
      <div class="page-hero-banner">
        <div class="container container-narrow text-center">
          <span class="section-eyebrow">ABOUT MEDSPHERE</span>
          <h1 class="page-title" style="font-size:2.75rem; margin-top:0.5rem;">Unifying the Global Healthcare Ecosystem</h1>
          <p class="section-subtitle" style="margin:0 auto; max-width:680px;">
            MedSphere was founded on a simple truth: healthcare functions best when verified clinicians, academic institutions, and medical innovators are seamlessly connected.
          </p>
        </div>
      </div>

      <div class="container container-narrow" style="padding-top:4rem; padding-bottom:5rem;">
        <div class="card" style="margin-bottom:2.5rem;">
          <h3 style="font-size:1.5rem; margin-bottom:1rem; color:var(--primary-900);">Our Mission</h3>
          <p style="font-size:1.05rem; line-height:1.7;">
            We are building the definitive digital backbone for the healthcare workforce. Rather than isolated hospital intranets or generic social networks, MedSphere combines professional credential verification, accredited continuing medical education, high-impact clinical recruitment, and B2B medical marketplace procurement into one unified environment.
          </p>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:2rem; margin-bottom:3rem;">
          <div class="card">
            <h4 style="font-size:1.2rem; margin-bottom:0.5rem; color:var(--primary-800);">100% License Verification</h4>
            <p class="text-sm">Every physician, nurse, and pharmacist on MedSphere is verified against national medical licensing databases (NPI in the US, GMC in the UK, AHPRA in Australia).</p>
          </div>
          <div class="card">
            <h4 style="font-size:1.2rem; margin-bottom:0.5rem; color:var(--primary-800);">HIPAA & Privacy Safe</h4>
            <p class="text-sm">All community peer consultations and clinical discussions adhere strictly to patient privacy standards, preventing unauthorized PHI dissemination.</p>
          </div>
        </div>

        <div class="text-center" style="padding:3rem 0; border-top:1px solid var(--border-subtle);">
          <h3>Ready to join 180,000+ clinicians?</h3>
          <p class="text-muted" style="margin-top:0.5rem; margin-bottom:1.5rem;">Create your verified professional profile in less than two minutes.</p>
          <a href="#register" class="btn btn-primary btn-lg">Join MedSphere Network</a>
        </div>
      </div>
    `;
  },

  // 6. Pricing (Removed)
  renderPricing() {
    window.location.hash = '#home';
    return this.renderLanding();
  },

  // 7. Contact Us
  renderContact() {
    return `
      <div class="page-hero-banner">
        <div class="container">
          <div class="breadcrumbs">
            <a href="#home">Home</a> <span>/</span> <span>Contact Us</span>
          </div>
          <h1 class="page-title">Contact MedSphere Global Headquarters</h1>
          <p class="section-subtitle">
            Our clinical advisory, support, and institutional partnerships teams are ready to help.
          </p>
        </div>
      </div>

      <div class="container" style="padding-top:3.5rem; padding-bottom:5rem;">
        <div class="demo-split-card">
          <div class="demo-info-panel">
            <div>
              <h3>Get in touch with us</h3>
              <p>Have inquiries regarding clinical verification, hospital procurement partnerships, or press releases?</p>
              
              <div class="demo-direct-contacts" style="margin-top:2rem;">
                <div class="contact-row-item">
                  <span><i class="fa-solid fa-envelope" style="color:#25B8F2; margin-right:8px;"></i> support@medsphere.health</span>
                </div>
                <div class="contact-row-item">
                  <span><i class="fa-solid fa-phone" style="color:#25B8F2; margin-right:8px;"></i> +1 (415) 555-0123</span>
                </div>
                <div class="contact-row-item">
                  <span><i class="fa-solid fa-location-dot" style="color:#25B8F2; margin-right:8px;"></i> 500 Howard St, San Francisco, CA 94105</span>
                </div>
              </div>
            </div>

            <div style="font-size:0.8125rem; color:var(--slate-400);">
              Official Hours: Monday — Friday 8:00 AM – 6:00 PM EST<br>Clinical emergency support 24/7/365.
            </div>
          </div>

          <div class="demo-form-panel">
            <h3 style="font-size:1.6rem; color:var(--primary-900); margin-bottom:1.5rem;">Send a Message</h3>
            <form onsubmit="event.preventDefault(); window.MedSphereCommunity.handleContactSubmit(this);">
              <div class="form-group">
                <label class="form-label">Your Name *</label>
                <input type="text" name="name" class="form-control" required placeholder="Dr. Sarah Johnson">
              </div>
              <div class="form-group">
                <label class="form-label">Email Address *</label>
                <input type="email" name="email" class="form-control" required placeholder="sarah@clinic.org">
              </div>
              <div class="form-group">
                <label class="form-label">Department / Purpose</label>
                <select name="department" class="form-select">
                  <option>Physician & License Credentialing</option>
                  <option>Hospital Recruitment & Staffing</option>
                  <option>Medical Education & CME Accreditation</option>
                  <option>Marketplace Vendor Sourcing</option>
                  <option>Technical Support</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Your Message *</label>
                <textarea name="message" class="form-control" rows="4" placeholder="How can our clinical team support your practice?" required></textarea>
              </div>
              <button type="submit" id="contact-submit-btn" class="btn btn-primary w-100">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    `;
  },

  async handleContactSubmit(form) {
    const btn = form.querySelector('#contact-submit-btn');
    const name = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const department = form.querySelector('[name="department"]').value;
    const message = form.querySelector('[name="message"]').value.trim();

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span class="spinner" style="display:inline-block; width:14px; height:14px; border:2px solid #fff; border-top-color:transparent; border-radius:50%; animation:spin 0.6s linear infinite; margin-right:6px; vertical-align:middle;"></span> Sending...`;
    }

    try {
      if (window.MedSphereAPI) {
        await window.MedSphereAPI.submitContact({ name, email, department, message });
      }
      window.MedSphereToast.show('Message Sent', 'Thank you for reaching out. We will respond within 4 hours.', 'success');
      form.reset();
    } catch (e) {
      window.MedSphereToast.show('Submission Error', e.message || 'Could not send inquiry.', 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Send Message';
      }
    }
  },

  // 8. Request a Demo Page
  renderDemo() {
    return window.MedSphereHome.render().match(/<!-- 12\. TALK TO OUR TEAM [\s\S]*?<\/section>/)?.[0] || window.MedSphereCommunity.renderContact();
  }
};

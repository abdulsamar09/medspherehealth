// MedSphere Medical Education & CME Platform Renderer

window.MedSphereEducation = {
  renderEducation(params = {}) {
    const courses = window.MEDSPHERE_DATA.courses;
    const store = window.MedSphereStore;

    return `
      <div class="page-hero-banner">
        <div class="container">
          <div class="breadcrumbs">
            <a href="#home">Home</a> <span>/</span> <span>Medical Education & CME</span>
          </div>
          <h1 class="page-title">Medical Education Hub & Accredited CME</h1>
          <p class="section-subtitle">
            Earn AMA PRA Category 1 Credits™ and ANCC nursing contact hours with world-class faculty and interactive clinical simulations.
          </p>

          <div style="margin-top:1.5rem; display:flex; gap:0.65rem; flex-wrap:wrap;">
            <button class="filter-pill active">All Programs</button>
            <button class="filter-pill">Cardiovascular Medicine</button>
            <button class="filter-pill">Pediatrics & Neonatal</button>
            <button class="filter-pill">Critical Care Nursing</button>
            <button class="filter-pill">AI & Radiology</button>
            <button class="filter-pill">Midwifery & Maternal Health</button>
          </div>
        </div>
      </div>

      <div class="container" style="padding-top:3rem; padding-bottom:5rem;">
        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(360px, 1fr)); gap:2rem;">
          ${courses.map(c => {
            const isEnrolled = store.isEnrolled(c.id);
            return `
              <div class="card card-hover" style="display:flex; flex-direction:column; padding:0; overflow:hidden;">
                <div style="height:200px; position:relative; overflow:hidden;">
                  <img src="${c.image}" alt="${c.title}" style="width:100%; height:100%; object-fit:cover;">
                  <span class="badge badge-cme" style="position:absolute; top:12px; left:12px;">Accredited CME</span>
                </div>

                <div style="padding:1.5rem; display:flex; flex-direction:column; flex-grow:1;">
                  <div class="text-xs text-muted" style="text-transform:uppercase; font-weight:700; color:var(--primary-700); margin-bottom:0.35rem;">
                    ${c.category} · ${c.level}
                  </div>
                  <h3 style="font-size:1.2rem; line-height:1.35; margin-bottom:0.5rem;">
                    <a href="#course?id=${c.id}">${c.title}</a>
                  </h3>
                  <div class="text-xs text-muted" style="margin-bottom:0.85rem;">
                    Lead Instructor: <strong>${c.instructor}</strong>
                  </div>

                  <p class="text-sm text-muted" style="line-height:1.55; margin-bottom:1.25rem; flex-grow:1;">
                    ${c.overview.substring(0, 110)}...
                  </p>

                  <div style="padding:0.75rem; background:var(--primary-50); border-radius:var(--radius-md); font-size:0.8125rem; margin-bottom:1.25rem;">
                    <div style="color:var(--primary-900); font-weight:700;"><i class="fa-solid fa-award" style="color:var(--primary-700); margin-right:4px;"></i> ${c.credits}</div>
                    <div class="text-muted" style="margin-top:2px;"><i class="fa-solid fa-clock" style="margin-right:4px;"></i> ${c.duration} · <i class="fa-solid fa-star" style="color:var(--amber-400); margin-right:4px;"></i> ${c.rating} (${c.studentsCount} enrolled)</div>
                  </div>

                  <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-top:auto;">
                    <button class="btn ${isEnrolled ? 'btn-secondary' : 'btn-primary'}" onclick="window.MedSphereModals.open('modal-enroll-course', { id: '${c.id}', title: '${c.title}', instructor: '${c.instructor}', credits: '${c.credits}', duration: '${c.duration}' })">
                      ${isEnrolled ? '<i class="fa-solid fa-circle-check"></i> Enrolled' : '<i class="fa-solid fa-graduation-cap"></i> Enroll Now'}
                    </button>
                    <a href="#course?id=${c.id}" class="btn btn-outline">Syllabus</a>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  renderCourseDetail(params = {}) {
    const c = window.MEDSPHERE_DATA.courses.find(item => item.id === params.id) || window.MEDSPHERE_DATA.courses[0];
    const isEnrolled = window.MedSphereStore.isEnrolled(c.id);

    return `
      <div class="page-hero-banner">
        <div class="container">
          <div class="breadcrumbs">
            <a href="#home">Home</a> <span>/</span> <a href="#education">Education</a> <span>/</span> <span>${c.title}</span>
          </div>
          <span class="badge badge-cme" style="margin-top:0.5rem;">${c.credits}</span>
          <h1 class="page-title" style="margin-top:0.5rem; font-size:2.25rem;">${c.title}</h1>
          <p class="section-subtitle">Instructor: ${c.instructor} (${c.instructorRole})</p>
        </div>
      </div>

      <div class="container" style="padding-top:3rem; padding-bottom:5rem;">
        <div class="profile-main-grid">
          <div class="profile-main-col">
            <div class="profile-card-section">
              <h3 class="profile-section-title">Course Overview</h3>
              <p style="font-size:1.05rem; line-height:1.7;">${c.overview}</p>
            </div>

            <div class="profile-card-section">
              <h3 class="profile-section-title">Curriculum & Interactive Clinical Modules</h3>
              <div style="display:flex; flex-direction:column; gap:0.85rem;">
                ${c.curriculum.map((m, idx) => `
                  <div style="display:flex; justify-content:space-between; align-items:center; padding:1rem; background:var(--primary-50); border:1px solid var(--border-subtle); border-radius:var(--radius-md);">
                    <div style="display:flex; align-items:center; gap:12px;">
                      <span style="width:28px; height:28px; border-radius:50%; background:var(--primary-800); color:white; font-size:12px; font-weight:700; display:flex; align-items:center; justify-content:center;">${idx+1}</span>
                      <strong style="color:var(--primary-900);">${m.title}</strong>
                    </div>
                    <span class="badge badge-blue">${m.duration}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="profile-card-section">
              <h3 class="profile-section-title">Accreditation Statement</h3>
              <p class="text-sm" style="line-height:1.7;">
                This activity has been planned and implemented in accordance with the accreditation requirements and policies of the Accreditation Council for Continuing Medical Education (ACCME) through the joint providership of MedSphere Health and Harvard Medical School Postgraduate Medical Education.
              </p>
            </div>
          </div>

          <aside class="profile-sidebar-col">
            <div class="profile-card-section">
              <div style="height:180px; overflow:hidden; border-radius:var(--radius-md); margin-bottom:1rem;">
                <img src="${c.image}" alt="${c.title}" style="width:100%; height:100%; object-fit:cover;">
              </div>
              <div style="font-size:0.875rem; margin-bottom:1.25rem;">
                <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                  <span class="text-muted">Credits:</span>
                  <strong>${c.credits}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                  <span class="text-muted">Modules:</span>
                  <strong>${c.duration}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                  <span class="text-muted">Format:</span>
                  <strong>100% Online & Mobile</strong>
                </div>
              </div>

              <button class="btn ${isEnrolled ? 'btn-secondary' : 'btn-primary'} w-100" onclick="window.MedSphereModals.open('modal-enroll-course', { id: '${c.id}', title: '${c.title}', instructor: '${c.instructor}', credits: '${c.credits}', duration: '${c.duration}' })">
                ${isEnrolled ? '<i class="fa-solid fa-circle-play"></i> Continue Learning' : '<i class="fa-solid fa-graduation-cap"></i> Enroll Now'}
              </button>
            </div>
          </aside>
        </div>
      </div>
    `;
  }
};

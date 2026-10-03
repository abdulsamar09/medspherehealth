// MedSphere Interactive Modal System

window.MedSphereModals = {
  activeModal: null,

  open(modalId, contextData = {}) {
    this.close(); // Close any currently open modal
    
    // For dynamic data-driven modals, remove existing DOM element to ensure fresh data rendering
    const dynamicModals = ['modal-apply-job', 'modal-job-detail', 'modal-connect', 'modal-order-success', 'modal-cme-enroll'];
    if (dynamicModals.includes(modalId)) {
      const oldModal = document.getElementById(modalId);
      if (oldModal) oldModal.remove();
    }

    let modalEl = document.getElementById(modalId);
    if (!modalEl) {
      modalEl = this.buildDynamicModal(modalId, contextData);
    } else {
      this.populateModal(modalEl, contextData);
    }

    if (modalEl) {
      modalEl.classList.add("modal-visible");
      document.body.classList.add("modal-open");
      this.activeModal = modalEl;

      const firstInput = modalEl.querySelector("input, textarea, select, button.btn-primary");
      if (firstInput) setTimeout(() => firstInput.focus(), 100);
    }
  },

  close() {
    if (this.activeModal) {
      this.activeModal.classList.remove("modal-visible");
      this.activeModal = null;
    }
    document.body.classList.remove("modal-open");
  },

  buildDynamicModal(modalId, data) {
    const backdrop = document.createElement("div");
    backdrop.id = modalId;
    backdrop.className = "medsphere-modal-backdrop";

    let modalHtml = '';

    if (modalId === 'modal-connect') {
      modalHtml = `
        <div class="modal-dialog">
          <div class="modal-header">
            <div class="modal-title-wrap">
              <span class="modal-badge">Professional Network</span>
              <h3 class="modal-title">Connect with ${data.name || 'Colleague'}</h3>
            </div>
            <button class="modal-close-btn" onclick="MedSphereModals.close()"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="modal-body">
            <div class="modal-user-preview">
              <img src="${data.avatar || ''}" alt="${data.name}" class="modal-preview-avatar">
              <div>
                <strong>${data.name}</strong>
                <p class="text-muted text-sm">${data.title} · ${data.organization || ''}</p>
              </div>
            </div>
            <div class="form-group mt-3">
              <label class="form-label">Personalized Connection Note (Optional)</label>
              <textarea id="connect-note" class="form-control" rows="3" placeholder="Hi ${data.name ? data.name.split(' ')[0] : 'colleague'}, I'd love to connect on MedSphere to collaborate on clinical protocols and shared cases..."></textarea>
            </div>
            <div class="modal-note-pill">
              <i class="fa-solid fa-shield-halved" style="color:var(--primary-700); font-size:1rem; margin-right:4px;"></i>
              <span>Verified Clinical Network — Both profiles will share verified credentials.</span>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" onclick="MedSphereModals.close()">Cancel</button>
            <button class="btn btn-primary" onclick="MedSphereModals.submitConnect('${data.id}', '${data.name}')">Send Invitation</button>
          </div>
        </div>
      `;
    } else if (modalId === 'modal-edit-profile') {
      const cur = (window.MedSphereStore && window.MedSphereStore.getState().currentUser) || (window.MEDSPHERE_DATA && window.MEDSPHERE_DATA.currentUser) || {};
      const esc = (str) => String(str || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      
      const nameParts = (cur.name || 'Dr Anees').trim().split(/\s+/);
      const firstName = cur.firstName || nameParts[0] || 'Dr';
      const lastName = cur.lastName || nameParts.slice(1).join(' ') || (nameParts.length > 1 ? '' : 'Anees');

      const titleVal = cur.title || cur.specialty || '';
      const emailVal = cur.contact?.email || cur.email || '';
      const phoneVal = cur.contact?.phone || cur.phone || '';
      const genderVal = cur.gender || '';
      const dobVal = cur.dob || '2000-02-02';
      const licenseVal = cur.license || (cur.npi ? 'MA #' + cur.npi.slice(0, 6) : '');
      const orgVal = cur.organization || '';
      const collegeVal = (cur.education && cur.education[0]?.institution) || cur.college || '';
      const cityVal = cur.city || (cur.location ? cur.location.split(',')[0].trim() : '');
      const stateVal = cur.state || (cur.location && cur.location.split(',')[1] ? cur.location.split(',')[1].trim() : '');
      const countryVal = cur.country || 'United States';
      const addressVal = cur.contact?.office || cur.address || '';
      const langVal = cur.languages || 'English, Spanish';
      const livesInVal = cur.location || '';

      modalHtml = `
        <div class="modal-dialog doctak-edit-modal-dialog" style="max-width:680px; width:100%; border-radius:16px;">
          <!-- Header (Matching Image 1) -->
          <div class="doctak-modal-header">
            <div>
              <div class="doctak-modal-pretitle">PROFILE</div>
              <h2 class="doctak-modal-title">Edit profile</h2>
              <p class="doctak-modal-subtitle">Keep the profile concise, factual, and easy for patients to scan.</p>
            </div>
            <button type="button" class="doctak-modal-close-btn" onclick="MedSphereModals.close()" title="Close">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <!-- Body (Matching Image 1) -->
          <div class="doctak-modal-body">
            <p class="doctak-modal-note">
              Update only the details that should appear publicly and keep the wording neutral, precise, and easy to verify.
            </p>

            <div class="doctak-modal-section-title">IDENTITY</div>

            <div class="doctak-modal-form-grid">
              <!-- First Name -->
              <div class="doctak-modal-field">
                <label class="doctak-modal-label" for="edit-profile-fname">FIRST NAME</label>
                <input type="text" id="edit-profile-fname" class="doctak-popup-input" value="${esc(firstName)}" placeholder="First name">
              </div>

              <!-- Last Name -->
              <div class="doctak-modal-field">
                <label class="doctak-modal-label" for="edit-profile-lname">LAST NAME</label>
                <input type="text" id="edit-profile-lname" class="doctak-popup-input" value="${esc(lastName)}" placeholder="Last name">
              </div>

              <!-- Title -->
              <div class="doctak-modal-field">
                <label class="doctak-modal-label" for="edit-profile-title">TITLE</label>
                <input type="text" id="edit-profile-title" class="doctak-popup-input" value="${esc(titleVal)}" placeholder="e.g. Anatomical Pathology Specialist">
              </div>

              <!-- Email -->
              <div class="doctak-modal-field">
                <label class="doctak-modal-label" for="edit-profile-email">EMAIL</label>
                <input type="email" id="edit-profile-email" class="doctak-popup-input" value="${esc(emailVal)}" placeholder="Email address">
              </div>

              <!-- Phone -->
              <div class="doctak-modal-field">
                <label class="doctak-modal-label" for="edit-profile-phone">PHONE</label>
                <input type="text" id="edit-profile-phone" class="doctak-popup-input" value="${esc(phoneVal)}" placeholder="Phone number">
              </div>

              <!-- Gender -->
              <div class="doctak-modal-field">
                <label class="doctak-modal-label" for="edit-profile-gender">GENDER</label>
                <div style="position:relative;">
                  <select id="edit-profile-gender" class="doctak-popup-input" style="appearance:none; -webkit-appearance:none; padding-right:2rem; cursor:pointer;">
                    <option value="" ${!genderVal ? 'selected' : ''}>Select gender</option>
                    <option value="Male" ${genderVal === 'Male' ? 'selected' : ''}>Male</option>
                    <option value="Female" ${genderVal === 'Female' ? 'selected' : ''}>Female</option>
                    <option value="Other" ${genderVal === 'Other' ? 'selected' : ''}>Other</option>
                    <option value="Prefer not to say" ${genderVal === 'Prefer not to say' ? 'selected' : ''}>Prefer not to say</option>
                  </select>
                  <i class="fa-solid fa-chevron-down" style="position:absolute; right:12px; top:50%; transform:translateY(-50%); pointer-events:none; font-size:11px; color:#64748b;"></i>
                </div>
              </div>

              <!-- Date of Birth -->
              <div class="doctak-modal-field">
                <label class="doctak-modal-label" for="edit-profile-dob">DATE OF BIRTH</label>
                <input type="date" id="edit-profile-dob" class="doctak-popup-input" value="${esc(dobVal)}">
              </div>

              <!-- License -->
              <div class="doctak-modal-field">
                <label class="doctak-modal-label" for="edit-profile-license">LICENSE</label>
                <input type="text" id="edit-profile-license" class="doctak-popup-input" value="${esc(licenseVal)}" placeholder="Medical License or NPI">
              </div>

              <!-- Clinic -->
              <div class="doctak-modal-field">
                <label class="doctak-modal-label" for="edit-profile-org">CLINIC / HOSPITAL</label>
                <input type="text" id="edit-profile-org" class="doctak-popup-input" value="${esc(orgVal)}" placeholder="Clinic affiliation">
              </div>

              <!-- College -->
              <div class="doctak-modal-field">
                <label class="doctak-modal-label" for="edit-profile-college">COLLEGE</label>
                <input type="text" id="edit-profile-college" class="doctak-popup-input" value="${esc(collegeVal)}" placeholder="Medical college or university">
              </div>

              <!-- City -->
              <div class="doctak-modal-field">
                <label class="doctak-modal-label" for="edit-profile-city">CITY</label>
                <input type="text" id="edit-profile-city" class="doctak-popup-input" value="${esc(cityVal)}" placeholder="City">
              </div>

              <!-- State -->
              <div class="doctak-modal-field">
                <label class="doctak-modal-label" for="edit-profile-state">STATE</label>
                <input type="text" id="edit-profile-state" class="doctak-popup-input" value="${esc(stateVal)}" placeholder="State">
              </div>

              <!-- Country -->
              <div class="doctak-modal-field">
                <label class="doctak-modal-label" for="edit-profile-country">COUNTRY</label>
                <input type="text" id="edit-profile-country" class="doctak-popup-input" value="${esc(countryVal)}" placeholder="Country">
              </div>

              <!-- Address -->
              <div class="doctak-modal-field">
                <label class="doctak-modal-label" for="edit-profile-address">ADDRESS</label>
                <input type="text" id="edit-profile-address" class="doctak-popup-input" value="${esc(addressVal)}" placeholder="Clinic street address">
              </div>

              <!-- Languages -->
              <div class="doctak-modal-field">
                <label class="doctak-modal-label" for="edit-profile-languages">LANGUAGES</label>
                <input type="text" id="edit-profile-languages" class="doctak-popup-input" value="${esc(langVal)}" placeholder="English, Spanish">
              </div>

              <!-- Lives In -->
              <div class="doctak-modal-field">
                <label class="doctak-modal-label" for="edit-profile-livesin">LIVES IN</label>
                <input type="text" id="edit-profile-livesin" class="doctak-popup-input" value="${esc(livesInVal)}" placeholder="Current location">
              </div>
            </div>
          </div>

          <!-- Footer (Matching Image 1) -->
          <div class="doctak-modal-footer">
            <div class="doctak-modal-footer-note">Changes update the live profile after you save.</div>
            <div class="doctak-modal-footer-actions">
              <button type="button" class="btn-doctak-modal-cancel" onclick="MedSphereModals.close()">Cancel</button>
              <button type="button" class="btn-doctak-modal-save" onclick="MedSphereModals.submitEditProfile()">Save</button>
            </div>
          </div>
        </div>
      `;
    } else if (modalId === 'modal-add-experience') {
      modalHtml = `
        <div class="modal-dialog doctak-edit-modal-dialog" style="max-width:580px; width:100%; border-radius:16px;">
          <div class="doctak-modal-header">
            <div>
              <div class="doctak-modal-pretitle">EXPERIENCE</div>
              <h2 class="doctak-modal-title" style="font-size:1.35rem;">Add Clinical Position</h2>
              <p class="doctak-modal-subtitle">Add hospital affiliation, clinical appointment, or residency position.</p>
            </div>
            <button type="button" class="doctak-modal-close-btn" onclick="MedSphereModals.close()">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="doctak-modal-body" style="padding:1.5rem;">
            <div class="form-group" style="margin-bottom:1rem;">
              <label class="doctak-modal-label">ROLE / POSITION TITLE</label>
              <input type="text" id="add-exp-role" class="doctak-popup-input" placeholder="e.g. Attending Pathologist & Clinical Associate">
            </div>
            <div class="form-group" style="margin-bottom:1rem;">
              <label class="doctak-modal-label">HOSPITAL / ORGANIZATION</label>
              <input type="text" id="add-exp-org" class="doctak-popup-input" placeholder="e.g. Boston Academic Medical Center">
            </div>
            <div class="form-row" style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:1rem;">
              <div>
                <label class="doctak-modal-label">EMPLOYMENT TYPE</label>
                <select id="add-exp-type" class="doctak-popup-input">
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Fellowship">Fellowship</option>
                  <option value="Consultant">Consultant</option>
                </select>
              </div>
              <div>
                <label class="doctak-modal-label">PERIOD / YEARS</label>
                <input type="text" id="add-exp-period" class="doctak-popup-input" placeholder="e.g. 2023 — Present">
              </div>
            </div>
            <div class="form-group">
              <label class="doctak-modal-label">CLINICAL DESCRIPTION & RESPONSIBILITIES</label>
              <textarea id="add-exp-desc" class="doctak-popup-input" rows="3" placeholder="Brief overview of clinical duties, procedures, or achievements..."></textarea>
            </div>
          </div>
          <div class="doctak-modal-footer">
            <div class="doctak-modal-footer-note">Appears on your verified CV timeline.</div>
            <div class="doctak-modal-footer-actions">
              <button type="button" class="btn-doctak-modal-cancel" onclick="MedSphereModals.close()">Cancel</button>
              <button type="button" class="btn-doctak-modal-save" onclick="MedSphereModals.saveNewExperience()">Add Position</button>
            </div>
          </div>
        </div>
      `;
    } else if (modalId === 'modal-add-education') {
      modalHtml = `
        <div class="modal-dialog doctak-edit-modal-dialog" style="max-width:580px; width:100%; border-radius:16px;">
          <div class="doctak-modal-header">
            <div>
              <div class="doctak-modal-pretitle">EDUCATION</div>
              <h2 class="doctak-modal-title" style="font-size:1.35rem;">Add Academic Credential</h2>
              <p class="doctak-modal-subtitle">Add medical degree, residency training, or university education.</p>
            </div>
            <button type="button" class="doctak-modal-close-btn" onclick="MedSphereModals.close()">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="doctak-modal-body" style="padding:1.5rem;">
            <div class="form-group" style="margin-bottom:1rem;">
              <label class="doctak-modal-label">DEGREE / CREDENTIAL</label>
              <input type="text" id="add-edu-degree" class="doctak-popup-input" placeholder="e.g. Doctor of Medicine (MD)">
            </div>
            <div class="form-group" style="margin-bottom:1rem;">
              <label class="doctak-modal-label">INSTITUTION / UNIVERSITY</label>
              <input type="text" id="add-edu-institution" class="doctak-popup-input" placeholder="e.g. Johns Hopkins University School of Medicine">
            </div>
            <div class="form-row" style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:1rem;">
              <div>
                <label class="doctak-modal-label">GRADUATION YEAR / CLASS</label>
                <input type="text" id="add-edu-year" class="doctak-popup-input" placeholder="e.g. Class of 2016">
              </div>
              <div>
                <label class="doctak-modal-label">HONORS / DISTINCTIONS (OPTIONAL)</label>
                <input type="text" id="add-edu-honors" class="doctak-popup-input" placeholder="e.g. Summa Cum Laude, AOA">
              </div>
            </div>
          </div>
          <div class="doctak-modal-footer">
            <div class="doctak-modal-footer-note">Verified against primary medical registries.</div>
            <div class="doctak-modal-footer-actions">
              <button type="button" class="btn-doctak-modal-cancel" onclick="MedSphereModals.close()">Cancel</button>
              <button type="button" class="btn-doctak-modal-save" onclick="MedSphereModals.saveNewEducation()">Add Degree</button>
            </div>
          </div>
        </div>
      `;
    } else if (modalId === 'modal-apply-job') {
      const cur = (window.MedSphereStore && window.MedSphereStore.getState().currentUser) || (window.MEDSPHERE_DATA && window.MEDSPHERE_DATA.currentUser) || {
        name: 'Dr. Eleanor Vance, MD',
        contact: { phone: '+971 50 123 4567', email: 'vance.md@hospital.org' }
      };
      const phone = cur.contact?.phone || '+971 50 123 4567';
      const email = cur.contact?.email || 'vance.md@hospital.org';

      modalHtml = `
        <div class="modal-dialog modal-dialog-lg" style="max-width:620px;">
          <div class="modal-header">
            <div class="modal-title-wrap">
              <span class="modal-badge badge-blue">Official Employer Application</span>
              <h3 class="modal-title">Apply for ${data.title || 'Position'}</h3>
              <p class="text-muted text-sm">${data.company || ''} ${data.facility ? '· ' + data.facility : ''} · ${data.location || ''}</p>
            </div>
            <button class="modal-close-btn" onclick="MedSphereModals.close()"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="modal-body" style="max-height:72vh; overflow-y:auto; padding:1.25rem 1.5rem;">
            
            <div class="verified-profile-banner" style="background:linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%); border:1px solid #bfdbfe; border-radius:12px; padding:1rem 1.25rem; display:flex; gap:12px; align-items:center; margin-bottom:1.25rem;">
              <div class="banner-icon" style="color:#0066cc; font-size:1.5rem;">
                <i class="fa-solid fa-shield-halved"></i>
              </div>
              <div class="banner-text">
                <strong style="color:#0f172a; font-size:0.95rem;">Applying as ${cur.name}</strong>
                <p style="margin:2px 0 0; font-size:0.825rem; color:#475569;">Verified Medical Credentials, NPI & Board certifications will be routed directly to ${data.company || 'the Employer'} Clinical Chair & HR.</p>
              </div>
            </div>

            <!-- Application Method Switch -->
            <div class="form-group mb-3">
              <label class="form-label" style="font-weight:700; font-size:0.875rem; color:#1e293b; margin-bottom:0.5rem; display:block;">Select Application Method</label>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                <label style="border:2px solid #0080ff; background:#f0f7ff; border-radius:10px; padding:10px 12px; cursor:pointer; display:flex; flex-direction:column; gap:4px;">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <input type="radio" name="apply_route" value="direct" checked style="accent-color:#0080ff;">
                    <strong style="font-size:0.875rem; color:#005bb5;">Fast 1-Click Apply</strong>
                  </div>
                  <span style="font-size:0.775rem; color:#475569; margin-left:22px;">Direct review by Clinical Chair</span>
                </label>
                <label style="border:1px solid #cbd5e1; background:#ffffff; border-radius:10px; padding:10px 12px; cursor:pointer; display:flex; flex-direction:column; gap:4px;">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <input type="radio" name="apply_route" value="external" style="accent-color:#0080ff;">
                    <strong style="font-size:0.875rem; color:#1e293b;">Employer Site ATS</strong>
                  </div>
                  <span style="font-size:0.775rem; color:#64748b; margin-left:22px;">Official hospital careers portal</span>
                </label>
              </div>
            </div>

            <div class="form-row" style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
              <div class="form-group">
                <label class="form-label" style="font-size:0.825rem; font-weight:600; color:#334155;">Primary Contact Phone</label>
                <input type="text" id="apply-job-phone" class="form-control" value="${phone}">
              </div>
              <div class="form-group">
                <label class="form-label" style="font-size:0.825rem; font-weight:600; color:#334155;">Primary Email Address</label>
                <input type="email" id="apply-job-email" class="form-control" value="${email}">
              </div>
            </div>

            <div class="form-group mt-2">
              <label class="form-label" style="font-size:0.825rem; font-weight:600; color:#334155;">Clinical Highlights & Note to Hiring Chair (Optional)</label>
              <textarea class="form-control" rows="3" placeholder="Highlight relevant post-qualification experience, sub-specialty fellowships, procedural volumes, or earliest clinical availability..."></textarea>
            </div>

            <div class="form-group mt-2">
              <label class="form-label" style="font-size:0.825rem; font-weight:600; color:#334155;">Attached Medical Curriculum Vitae (CV)</label>
              <div class="file-upload-box" style="border:1px dashed #94a3b8; background:#f8fafc; border-radius:10px; padding:10px 14px; display:flex; align-items:center; gap:10px;">
                <i class="fa-solid fa-file-pdf" style="font-size:1.4rem; color:#dc2626;"></i>
                <div style="flex:1; min-width:0;">
                  <strong style="font-size:0.85rem; color:#0f172a; display:block; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">Dr_Eleanor_Vance_Clinical_CV_2026.pdf</strong>
                  <span style="font-size:0.75rem; color:#059669; font-weight:600;"><i class="fa-solid fa-check"></i> Verified Profile Attachment</span>
                </div>
                <button type="button" class="btn btn-sm btn-outline btn-pill" style="font-size:0.75rem; padding:3px 10px;">Replace</button>
              </div>
            </div>

          </div>
          <div class="modal-footer" style="padding:1rem 1.5rem; border-top:1px solid #f1f5f9; display:flex; justify-content:space-between; align-items:center;">
            <button class="btn btn-outline btn-pill" onclick="MedSphereModals.close()">Cancel</button>
            <button class="btn btn-pill" style="background:#005bb5; color:#ffffff; font-weight:700; padding:0.65rem 1.75rem; border:none; border-radius:9999px; box-shadow:0 2px 8px rgba(0,91,181,0.25);" 
                    onclick="MedSphereModals.submitJobApplication('${data.id}', '${data.title}', '${data.company}')">
              <i class="fa-solid fa-paper-plane" style="margin-right:6px;"></i> Apply on Employer Site
            </button>
          </div>
        </div>
      `;
    } else if (modalId === 'modal-job-detail') {
      const store = window.MedSphereStore;
      const isSaved = store ? store.isJobSaved(data.id) : false;
      const hasApplied = store ? store.hasApplied(data.id) : false;
      const comp = data.company || 'Healthcare Provider';
      const parts = comp.replace(/[^a-zA-Z\s]/g, '').trim().split(/\s+/);
      const monogram = parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : (comp.slice(0, 1) || 'M').toUpperCase();
      const bg = comp.toLowerCase().includes('mediclinic') ? '#dc2626' : (comp.toLowerCase().includes('luke') || comp.toLowerCase().includes('mayo') ? '#0066cc' : '#0284c7');
      const locationLine = data.facility ? `${data.facility} · ${data.location}` : (data.location || '');

      modalHtml = `
        <div class="modal-dialog modal-dialog-lg modal-job-detail-dialog" style="display:flex; flex-direction:column; padding:0; overflow:hidden;">
          <!-- Header -->
          <div style="padding:1.25rem 1.5rem; border-bottom:1px solid #e2e8f0; display:flex; align-items:flex-start; justify-content:space-between; gap:12px; background:#ffffff;">
            <div style="display:flex; align-items:flex-start; gap:12px;">
              <div style="width:48px; height:48px; border-radius:10px; background:${bg}; color:#fff; font-weight:800; font-size:1.15rem; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                ${monogram}
              </div>
              <div>
                <h3 style="font-size:1.2rem; font-weight:700; color:#0f172a; margin:0 0 4px 0; line-height:1.3;">${data.title}</h3>
                <p style="font-size:0.875rem; color:#475569; margin:0;">
                  <strong>${data.company}</strong> · <span>${locationLine}</span>
                </p>
              </div>
            </div>
            <button class="modal-close-btn" onclick="MedSphereModals.close()" style="background:#f1f5f9; border:none; border-radius:8px; width:32px; height:32px; display:flex; align-items:center; justify-content:center; cursor:pointer;"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <!-- Action CTA Bar -->
          <div style="padding:0.85rem 1.5rem; background:#f8fafc; border-bottom:1px solid #e2e8f0; display:flex; align-items:center; gap:10px;">
            <button type="button" 
                    class="btn btn-primary" 
                    style="flex:1; padding:0.65rem 1.5rem; font-weight:700; font-size:0.95rem; border-radius:9999px; background:#0080ff; color:#fff; border:none; box-shadow:0 2px 8px rgba(0,128,255,0.25);"
                    onclick="MedSphereModals.open('modal-apply-job', window.MEDSPHERE_DATA.jobs.find(j => j.id === '${data.id}') || {})">
              ${hasApplied ? '<i class=\"fa-solid fa-circle-check\"></i> Applied on employer site' : '<i class=\"fa-solid fa-paper-plane\"></i> Apply on employer site'}
            </button>
            <button type="button" 
                    class="jobs-bookmark-btn ${isSaved ? 'saved' : ''}" 
                    style="width:42px; height:42px; border:1px solid #cbd5e1; border-radius:10px; background:#ffffff; display:flex; align-items:center; justify-content:center; font-size:1.1rem; cursor:pointer;"
                    onclick="window.MedSphereJobs.toggleSaveJob('${data.id}'); MedSphereModals.open('modal-job-detail', window.MEDSPHERE_DATA.jobs.find(j => j.id === '${data.id}') || {});">
              <i class="${isSaved ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark'}"></i>
            </button>
          </div>

          <!-- Scrollable Detail Body -->
          <div style="padding:1.5rem; overflow-y:auto; flex:1; -webkit-overflow-scrolling:touch;">
            <!-- Specs Grid -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:1.25rem;">
              <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:0.85rem 1rem;">
                <span style="font-size:0.75rem; font-weight:700; color:#64748b; letter-spacing:0.05em; display:block; margin-bottom:4px;">SALARY</span>
                <strong style="color:#0080ff; font-size:0.95rem; display:block;">${data.salary || 'Competitive'}</strong>
                <span style="font-size:0.75rem; color:#64748b;">${data.type || 'Full-Time'}</span>
              </div>
              <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:0.85rem 1rem;">
                <span style="font-size:0.75rem; font-weight:700; color:#64748b; letter-spacing:0.05em; display:block; margin-bottom:4px;">OPENINGS</span>
                <strong style="color:#0f172a; font-size:0.95rem; display:block;">${data.openings || '1 position'}</strong>
                <span style="font-size:0.75rem; color:#64748b;">Posted ${data.posted || '2y ago'}</span>
              </div>
            </div>

            <!-- Experience -->
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:0.85rem 1rem; margin-bottom:1.25rem;">
              <span style="font-size:0.75rem; font-weight:700; color:#64748b; letter-spacing:0.05em; display:block; margin-bottom:4px;">EXPERIENCE</span>
              <p style="font-size:0.875rem; color:#1e293b; margin:0; line-height:1.5;">${data.experience || data.description}</p>
            </div>

            <!-- Description -->
            <div style="margin-bottom:1.25rem;">
              <h4 style="font-size:0.85rem; font-weight:700; color:#0f172a; letter-spacing:0.05em; margin-bottom:0.5rem;">ABOUT THE ROLE</h4>
              <p style="font-size:0.9rem; color:#334155; line-height:1.6; margin:0;">${data.description}</p>
            </div>

            <!-- Responsibilities -->
            ${data.responsibilities && data.responsibilities.length ? `
              <div style="margin-bottom:1.25rem;">
                <h4 style="font-size:0.85rem; font-weight:700; color:#0f172a; letter-spacing:0.05em; margin-bottom:0.5rem;">KEY RESPONSIBILITIES</h4>
                <ul style="padding-left:0; list-style:none; margin:0;">
                  ${data.responsibilities.map(r => `
                    <li style="display:flex; align-items:flex-start; gap:8px; margin-bottom:8px; font-size:0.875rem; color:#334155; line-height:1.5;">
                      <i class="fa-solid fa-circle-check" style="color:#059669; margin-top:3px; flex-shrink:0;"></i>
                      <span>${r}</span>
                    </li>
                  `).join('')}
                </ul>
              </div>
            ` : ''}

            <!-- Requirements -->
            ${data.requirements && data.requirements.length ? `
              <div style="margin-bottom:1.25rem;">
                <h4 style="font-size:0.85rem; font-weight:700; color:#0f172a; letter-spacing:0.05em; margin-bottom:0.5rem;">REQUIREMENTS &amp; QUALIFICATIONS</h4>
                <ul style="padding-left:0; list-style:none; margin:0;">
                  ${data.requirements.map(req => `
                    <li style="display:flex; align-items:flex-start; gap:8px; margin-bottom:8px; font-size:0.875rem; color:#334155; line-height:1.5;">
                      <i class="fa-solid fa-award" style="color:#0080ff; margin-top:3px; flex-shrink:0;"></i>
                      <span>${req}</span>
                    </li>
                  `).join('')}
                </ul>
              </div>
            ` : ''}

            <!-- Benefits -->
            ${data.benefits && data.benefits.length ? `
              <div style="margin-bottom:1.25rem;">
                <h4 style="font-size:0.85rem; font-weight:700; color:#0f172a; letter-spacing:0.05em; margin-bottom:0.5rem;">COMPENSATION &amp; BENEFITS</h4>
                <ul style="padding-left:0; list-style:none; margin:0;">
                  ${data.benefits.map(b => `
                    <li style="display:flex; align-items:flex-start; gap:8px; margin-bottom:8px; font-size:0.875rem; color:#334155; line-height:1.5;">
                      <i class="fa-solid fa-check" style="color:#059669; margin-top:3px; flex-shrink:0;"></i>
                      <span>${b}</span>
                    </li>
                  `).join('')}
                </ul>
              </div>
            ` : ''}

            <!-- Bottom Apply CTA -->
            <div style="margin-top:1.5rem; padding-top:1rem; border-top:1px solid #e2e8f0;">
              <button type="button" 
                      class="btn btn-primary w-100" 
                      style="padding:0.75rem 1.5rem; font-weight:700; font-size:1rem; border-radius:9999px; background:#0080ff; color:#fff; border:none; box-shadow:0 4px 12px rgba(0,128,255,0.3);"
                      onclick="MedSphereModals.open('modal-apply-job', window.MEDSPHERE_DATA.jobs.find(j => j.id === '${data.id}') || {})">
                Apply on employer site
              </button>
            </div>
          </div>
        </div>
      `;
    } else if (modalId === 'modal-enroll-course') {
      modalHtml = `
        <div class="modal-dialog">
          <div class="modal-header">
            <div class="modal-title-wrap">
              <span class="modal-badge badge-cme">Accredited CME</span>
              <h3 class="modal-title">Enroll in Course</h3>
            </div>
            <button class="modal-close-btn" onclick="MedSphereModals.close()"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="modal-body">
            <h4>${data.title || 'Medical Course'}</h4>
            <p class="text-muted text-sm mt-1">Instructor: ${data.instructor || ''}</p>
            <div class="course-modal-specs mt-3">
              <div class="spec-row">
                <span>Accreditation:</span>
                <strong>${data.credits || 'AMA PRA Category 1 Credits™'}</strong>
              </div>
              <div class="spec-row">
                <span>Modules & Simulations:</span>
                <strong>${data.duration || 'Full Access'}</strong>
              </div>
              <div class="spec-row">
                <span>Certificate:</span>
                <strong>Official Verified Digital Credential</strong>
              </div>
            </div>
            <div class="modal-enroll-benefit mt-3">
              <p class="text-sm">Upon enrollment, course progress will synchronize automatically with your state medical board CME reporting log.</p>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" onclick="MedSphereModals.close()">Review Syllabus</button>
            <button class="btn btn-primary" onclick="MedSphereModals.submitCourseEnrollment('${data.id}', '${data.title}')">Confirm & Start Learning</button>
          </div>
        </div>
      `;
    } else if (modalId === 'modal-create-profile') {
      const curUser = (window.MedSphereStore && window.MedSphereStore.getState().currentUser) || (window.MEDSPHERE_DATA && window.MEDSPHERE_DATA.currentUser) || {};
      const initialName = curUser.name ? (curUser.name.startsWith('Dr') ? curUser.name : 'Dr. ' + curUser.name) : '';
      const initialTitle = curUser.title || curUser.specialty || 'Consultant Specialist';
      const initialOrg = curUser.organization || '';
      const initialLoc = curUser.location || 'Boston, MA';
      const initialAvatar = curUser.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80';

      modalHtml = `
        <div class="modal-dialog modal-dialog-lg" style="max-width:680px; width:100%; border-radius:18px;">
          <div class="modal-header">
            <div class="modal-title-wrap">
              <span class="modal-badge"><i class="fa-solid fa-user-doctor" style="margin-right:4px;"></i> Medical Directory</span>
              <h3 class="modal-title">Create Healthcare Professional Profile</h3>
              <p class="text-xs text-muted" style="margin-top:2px;">Publish your verified doctor profile to the MedSphere global clinical network.</p>
            </div>
            <button class="modal-close-btn" onclick="MedSphereModals.close()"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="modal-body" style="padding:1.5rem; max-height:calc(85vh - 140px); overflow-y:auto;">
            <form id="create-doctor-profile-form" onsubmit="event.preventDefault(); MedSphereModals.submitCreateDoctorProfile();">
              <div class="form-row">
                <div class="form-group col-6">
                  <label class="form-label">Full Name with Credentials *</label>
                  <input type="text" id="create-prof-name" class="form-control" placeholder="e.g. Dr. Abdul Samad, MD" value="${initialName}" required>
                </div>
                <div class="form-group col-6">
                  <label class="form-label">Clinical / Professional Title *</label>
                  <input type="text" id="create-prof-title" class="form-control" placeholder="e.g. Chief of Interventional Cardiology" value="${initialTitle}" required>
                </div>
              </div>

              <div class="form-row mt-3">
                <div class="form-group col-6">
                  <label class="form-label">Primary Medical Specialty *</label>
                  <select id="create-prof-specialty" class="form-control" required>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Critical Care / ICU">Critical Care / ICU</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Emergency Medicine">Emergency Medicine</option>
                    <option value="General Surgery">General Surgery</option>
                    <option value="Internal Medicine">Internal Medicine</option>
                    <option value="Surgical Oncology">Surgical Oncology</option>
                    <option value="Anesthesiology">Anesthesiology</option>
                    <option value="Family Medicine">Family Medicine</option>
                    <option value="Anatomical Pathology">Anatomical Pathology</option>
                    <option value="Dermatology">Dermatology</option>
                  </select>
                </div>
                <div class="form-group col-6">
                  <label class="form-label">Hospital / Medical Center Affiliation *</label>
                  <input type="text" id="create-prof-org" class="form-control" placeholder="e.g. Mayo Clinic or St. Luke's Health" value="${initialOrg}" required>
                </div>
              </div>

              <div class="form-row mt-3">
                <div class="form-group col-6">
                  <label class="form-label">City, Country Location *</label>
                  <input type="text" id="create-prof-loc" class="form-control" placeholder="e.g. Boston, MA or Dubai, UAE" value="${initialLoc}" required>
                </div>
                <div class="form-group col-6">
                  <label class="form-label">Years of Clinical Experience *</label>
                  <input type="text" id="create-prof-exp" class="form-control" placeholder="e.g. 10 yrs" value="10 yrs" required>
                </div>
              </div>

              <div class="form-row mt-3">
                <div class="form-group col-6">
                  <label class="form-label">Board Certification / Medical License</label>
                  <input type="text" id="create-prof-board" class="form-control" placeholder="e.g. ABIM, FACC or State Medical License" value="Board Certified Specialist">
                </div>
                <div class="form-group col-6">
                  <label class="form-label">Accent Monogram Badge Color</label>
                  <select id="create-prof-color" class="form-control">
                    <option value="#0d9488">Teal (Primary Care / Cardiology)</option>
                    <option value="#0c2340">Navy (Neurology / Executive)</option>
                    <option value="#2563eb">Royal Blue (Critical Care / ICU)</option>
                    <option value="#7c3aed">Purple (Pediatrics / Research)</option>
                    <option value="#c026d3">Magenta (Surgical Oncology)</option>
                    <option value="#15803d">Emerald (Emergency &amp; Trauma)</option>
                  </select>
                </div>
              </div>

              <div class="form-group mt-3">
                <label class="form-label">Professional Avatar / Photo</label>
                <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap; margin-bottom:8px;">
                  <div class="prof-avatar-pick-option selected" onclick="document.querySelectorAll('.prof-avatar-pick-option').forEach(el=>el.classList.remove('selected')); this.classList.add('selected'); document.getElementById('create-prof-avatar').value='https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80';" style="cursor:pointer; border:2px solid #0080ff; border-radius:50%; width:44px; height:44px; overflow:hidden;">
                    <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80" style="width:100%; height:100%; object-fit:cover;">
                  </div>
                  <div class="prof-avatar-pick-option" onclick="document.querySelectorAll('.prof-avatar-pick-option').forEach(el=>el.classList.remove('selected')); this.classList.add('selected'); document.getElementById('create-prof-avatar').value='https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80';" style="cursor:pointer; border:1px solid #cbd5e1; border-radius:50%; width:44px; height:44px; overflow:hidden;">
                    <img src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80" style="width:100%; height:100%; object-fit:cover;">
                  </div>
                  <div class="prof-avatar-pick-option" onclick="document.querySelectorAll('.prof-avatar-pick-option').forEach(el=>el.classList.remove('selected')); this.classList.add('selected'); document.getElementById('create-prof-avatar').value='https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80';" style="cursor:pointer; border:1px solid #cbd5e1; border-radius:50%; width:44px; height:44px; overflow:hidden;">
                    <img src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=200&q=80" style="width:100%; height:100%; object-fit:cover;">
                  </div>
                  <div class="prof-avatar-pick-option" onclick="document.querySelectorAll('.prof-avatar-pick-option').forEach(el=>el.classList.remove('selected')); this.classList.add('selected'); document.getElementById('create-prof-avatar').value='https://images.unsplash.com/photo-1594824813515-546059e13d92?auto=format&fit=crop&w=400&q=80';" style="cursor:pointer; border:1px solid #cbd5e1; border-radius:50%; width:44px; height:44px; overflow:hidden;">
                    <img src="https://images.unsplash.com/photo-1594824813515-546059e13d92?auto=format&fit=crop&w=200&q=80" style="width:100%; height:100%; object-fit:cover;">
                  </div>
                </div>
                <input type="text" id="create-prof-avatar" class="form-control" value="${initialAvatar}" placeholder="Or paste custom professional image URL">
              </div>

              <div class="form-group mt-3">
                <label class="form-label">Clinical Bio &amp; Practice Focus *</label>
                <textarea id="create-prof-bio" class="form-control" rows="3" placeholder="Describe your clinical practice, surgical focus, clinical research, or procedural specialties..." required>Dedicated clinical specialist focused on delivering evidence-based, compassionate patient care and collaborating with healthcare colleagues.</textarea>
              </div>

              <div class="form-group mt-3">
                <label class="form-label">Availability &amp; Collaboration Badges</label>
                <div style="display:flex; gap:12px; flex-wrap:wrap; margin-top:4px;">
                  <label style="display:flex; align-items:center; gap:6px; font-size:0.85rem; cursor:pointer;">
                    <input type="checkbox" id="tag-roles" checked> <span>Open to roles</span>
                  </label>
                  <label style="display:flex; align-items:center; gap:6px; font-size:0.85rem; cursor:pointer;">
                    <input type="checkbox" id="tag-research" checked> <span>Open to research</span>
                  </label>
                  <label style="display:flex; align-items:center; gap:6px; font-size:0.85rem; cursor:pointer;">
                    <input type="checkbox" id="tag-cme"> <span>Speaking / CME</span>
                  </label>
                  <label style="display:flex; align-items:center; gap:6px; font-size:0.85rem; cursor:pointer;">
                    <input type="checkbox" id="tag-telehealth"> <span>Telehealth</span>
                  </label>
                </div>
              </div>

              <div class="modal-hipaa-alert" style="margin-top:1.25rem;">
                <i class="fa-solid fa-shield-halved" style="font-size:1.15rem; color:#0B5CAD; margin-right:8px;"></i>
                <span>Instant Directory Sync: Once published, your profile will immediately appear in the verified doctor directory.</span>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" onclick="MedSphereModals.close()">Cancel</button>
            <button class="btn btn-primary" onclick="MedSphereModals.submitCreateDoctorProfile()">Publish Profile to Directory</button>
          </div>
        </div>
      `;
    } else if (modalId === 'modal-create-post') {
      const type = data.type || 'post';

      if (type === 'poll') {
        modalHtml = `
          <div class="modal-dialog modal-dialog-lg" style="max-width:620px;">
            <div class="modal-header">
              <div class="modal-title-wrap">
                <span class="modal-badge"><i class="fa-solid fa-chart-simple" style="margin-right:4px;"></i> Colleague Clinical Poll</span>
                <h3 class="modal-title">Create Clinical Poll</h3>
              </div>
              <button class="modal-close-btn" onclick="MedSphereModals.close()"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label class="form-label">Poll Specialty / Focus Area</label>
                <select id="poll-specialty" class="form-control">
                  <option value="Cardiology &amp; Hemodynamics">Cardiology &amp; Hemodynamics</option>
                  <option value="Emergency &amp; Trauma Medicine">Emergency &amp; Trauma Medicine</option>
                  <option value="Critical Care / ICU">Critical Care / ICU</option>
                  <option value="Surgical Protocols">Surgical Protocols</option>
                  <option value="Pediatrics &amp; Neonatology">Pediatrics &amp; Neonatology</option>
                  <option value="Neurology &amp; Stroke">Neurology &amp; Stroke</option>
                </select>
              </div>
              <div class="form-group mt-3">
                <label class="form-label">Clinical Scenario &amp; Context</label>
                <textarea id="poll-context" class="form-control" rows="3" placeholder="Provide background clinical scenario (e.g. Patient vitals, presentation, lab values)..."></textarea>
              </div>
              <div class="form-group mt-3">
                <label class="form-label">Poll Question *</label>
                <input type="text" id="poll-question" class="form-control" placeholder="e.g. What would be your first-line intervention?" required>
              </div>
              <div class="form-group mt-3">
                <label class="form-label">Poll Options (Provide at least 2 choices)</label>
                <div style="display:flex; flex-direction:column; gap:8px;">
                  <input type="text" id="poll-opt-1" class="form-control" placeholder="Option 1 (e.g. Immediate mechanical thrombectomy)" required>
                  <input type="text" id="poll-opt-2" class="form-control" placeholder="Option 2 (e.g. IV Thrombolytic therapy only)" required>
                  <input type="text" id="poll-opt-3" class="form-control" placeholder="Option 3 (Optional - e.g. Conservative ICU monitoring)">
                </div>
              </div>
              <div class="modal-hipaa-alert" style="margin-top:1rem;">
                <i class="fa-solid fa-shield-halved" style="font-size:1.15rem; color:#0B5CAD; margin-right:8px;"></i>
                <span>HIPAA Standards: De-identify all patient scenarios before publishing to the verified community.</span>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-outline" onclick="MedSphereModals.close()">Cancel</button>
              <button class="btn btn-primary" onclick="MedSphereModals.submitCreatePost('poll')">Launch Clinical Poll</button>
            </div>
          </div>
        `;
      } else if (type === 'blog') {
        modalHtml = `
          <div class="modal-dialog modal-dialog-lg" style="max-width:680px;">
            <div class="modal-header">
              <div class="modal-title-wrap">
                <span class="modal-badge"><i class="fa-solid fa-bookmark" style="margin-right:4px;"></i> Clinical Perspective / Editorial</span>
                <h3 class="modal-title">Publish Medical Article &amp; Blog</h3>
              </div>
              <button class="modal-close-btn" onclick="MedSphereModals.close()"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label class="form-label">Article Headline *</label>
                <input type="text" id="blog-title" class="form-control" placeholder="e.g. Emerging Paradigms in Transcatheter Aortic Valve Replacement" required>
              </div>
              <div class="form-row mt-3">
                <div class="form-group col-6">
                  <label class="form-label">Medical Specialty</label>
                  <select id="blog-specialty" class="form-control">
                    <option value="Cardiology Review">Cardiology Review</option>
                    <option value="Critical Care Medicine">Critical Care Medicine</option>
                    <option value="Emergency Protocols">Emergency Protocols</option>
                    <option value="Healthcare Innovation">Healthcare Innovation</option>
                    <option value="Medical Education">Medical Education</option>
                  </select>
                </div>
                <div class="form-group col-6">
                  <label class="form-label">Estimated Read Time</label>
                  <input type="text" id="blog-read-time" class="form-control" value="5 min read">
                </div>
              </div>
              <div class="form-group mt-3">
                <label class="form-label">Full Clinical Article / Commentary *</label>
                <textarea id="blog-body" class="form-control" rows="7" placeholder="Write your clinical perspective, evidence-based review, or procedural findings..." required></textarea>
              </div>
              <div class="modal-hipaa-alert" style="margin-top:1rem;">
                <i class="fa-solid fa-shield-halved" style="font-size:1.15rem; color:#0B5CAD; margin-right:8px;"></i>
                <span>Peer-Reviewed Visibility: Articles are indexed in the MedSphere Clinical Knowledge Center.</span>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-outline" onclick="MedSphereModals.close()">Cancel</button>
              <button class="btn btn-primary" onclick="MedSphereModals.submitCreatePost('blog')">Publish Medical Article</button>
            </div>
          </div>
        `;
      } else {
        const user = (window.MedSphereStore && window.MedSphereStore.getState().currentUser) || (window.MEDSPHERE_DATA && window.MEDSPHERE_DATA.currentUser) || {};
        const userAvatar = user.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80';
        const userName = user.name || 'Dr. Clinician';
        const userSpec = user.specialty || user.title || 'Healthcare Professional';

        modalHtml = `
          <div class="modal-dialog" style="max-width:540px; border-radius:12px; overflow:hidden;">

            <!-- Header -->
            <div style="display:flex; align-items:center; justify-content:space-between; padding:18px 20px 14px; border-bottom:1px solid #e5e7eb;">
              <h3 style="font-size:1.05rem; font-weight:700; color:#111827; margin:0;">Create a post</h3>
              <button onclick="MedSphereModals.close()" style="background:none; border:none; cursor:pointer; color:#6b7280; font-size:1.1rem; padding:4px; border-radius:50%; display:flex; align-items:center; justify-content:center; transition:background 0.15s;" onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='none'">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>

            <!-- Author Row -->
            <div style="display:flex; align-items:center; gap:10px; padding:14px 20px 0;">
              <img src="${userAvatar}" alt="${userName}" style="width:44px; height:44px; border-radius:50%; object-fit:cover; border:2px solid #e5e7eb; flex-shrink:0;">
              <div>
                <div style="font-weight:700; font-size:0.925rem; color:#111827;">${userName}</div>
                <div style="font-size:0.78rem; color:#6b7280; margin-top:1px;">${userSpec}</div>
                <div style="display:inline-flex; align-items:center; gap:4px; background:#f1f5f9; border:1px solid #e2e8f0; border-radius:5px; padding:1px 7px; font-size:0.68rem; color:#475569; font-weight:600; margin-top:3px;">
                  <i class="fa-solid fa-globe" style="font-size:0.6rem;"></i> Personal profile
                </div>
              </div>
            </div>

            <!-- Text Area -->
            <div style="padding:10px 20px 0;">
              <textarea id="post-content"
                style="width:100%; border:none; outline:none; font-size:0.95rem; color:#111827; resize:none; min-height:110px; font-family:inherit; background:transparent; box-sizing:border-box; line-height:1.5;"
                placeholder="Share a case, update, publication, or question..."
                oninput="this.style.height='auto'; this.style.height=Math.max(110,this.scrollHeight)+'px';"
              ></textarea>
            </div>

            <!-- Photo Preview (hidden by default) -->
            <div id="post-photo-preview-wrap" style="display:none; padding:0 20px 10px;">
              <div style="position:relative; border-radius:10px; overflow:hidden;">
                <img id="post-photo-preview-img" src="" style="width:100%; max-height:220px; object-fit:cover; border-radius:10px; border:1px solid #e5e7eb;">
                <button onclick="MedSphereModals.postRemovePhoto()" style="position:absolute; top:6px; right:6px; background:rgba(0,0,0,0.55); border:none; color:#fff; border-radius:50%; width:28px; height:28px; cursor:pointer; font-size:0.8rem; display:flex; align-items:center; justify-content:center;">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>

            <!-- Bottom bar: media + privacy + divider -->
            <div style="border-top:1px solid #e5e7eb; margin:8px 20px 0; padding-top:10px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; padding-bottom:10px;">
              <!-- Media buttons -->
              <div style="display:flex; gap:6px; align-items:center;">
                <button type="button" onclick="MedSphereModals.postAddPhoto()"
                  style="display:flex; align-items:center; gap:5px; background:#f1f5f9; border:1px solid #e2e8f0; border-radius:8px; padding:6px 12px; cursor:pointer; font-size:0.8rem; font-weight:600; color:#374151; transition:background 0.15s;"
                  onmouseover="this.style.background='#e2e8f0'" onmouseout="this.style.background='#f1f5f9'">
                  <i class="fa-regular fa-image" style="color:#16a34a; font-size:0.9rem;"></i>
                  Add photo
                </button>
                <button type="button" onclick="MedSphereModals.postAddVideo()"
                  style="display:flex; align-items:center; gap:5px; background:#f1f5f9; border:1px solid #e2e8f0; border-radius:8px; padding:6px 12px; cursor:pointer; font-size:0.8rem; font-weight:600; color:#374151; transition:background 0.15s;"
                  onmouseover="this.style.background='#e2e8f0'" onmouseout="this.style.background='#f1f5f9'">
                  <i class="fa-solid fa-video" style="color:#2563eb; font-size:0.9rem;"></i>
                  Add video
                </button>
              </div>
              <!-- Privacy selector -->
              <div style="display:flex; align-items:center; gap:6px; font-size:0.8rem; color:#374151; font-weight:600;">
                <span style="color:#6b7280;">Privacy</span>
                <select id="post-privacy" style="border:1px solid #d1d5db; border-radius:7px; padding:4px 8px; font-size:0.8rem; color:#111827; background:#fff; cursor:pointer; outline:none;">
                  <option value="public">Public</option>
                  <option value="network">Network only</option>
                  <option value="specialty">My specialty</option>
                </select>
              </div>
            </div>

            <!-- Hidden inputs -->
            <input type="hidden" id="post-image-url" value="">
            <input type="hidden" id="post-specialty" value="Clinical Discussion">

            <!-- Footer -->
            <div style="display:flex; justify-content:flex-end; gap:8px; padding:12px 20px; border-top:1px solid #e5e7eb;">
              <button onclick="MedSphereModals.close()" style="background:none; border:1px solid #d1d5db; border-radius:8px; padding:8px 20px; cursor:pointer; font-size:0.9rem; font-weight:600; color:#374151; transition:all 0.15s;" onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='none'">Cancel</button>
              <button onclick="MedSphereModals.submitCreatePost('post')" style="background:#1d4ed8; color:#fff; border:none; border-radius:8px; padding:8px 24px; cursor:pointer; font-size:0.9rem; font-weight:700; transition:background 0.15s;" onmouseover="this.style.background='#1e40af'" onmouseout="this.style.background='#1d4ed8'">Publish</button>
            </div>
          </div>
        `;
      }
    } else if (modalId === 'modal-request-quote') {
      modalHtml = `
        <div class="modal-dialog">
          <div class="modal-header">
            <div class="modal-title-wrap">
              <span class="modal-badge">Marketplace Procurement</span>
              <h3 class="modal-title">Request Quote & Institutional Pricing</h3>
            </div>
            <button class="modal-close-btn" onclick="MedSphereModals.close()"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="modal-body">
            <div class="quote-item-summary">
              <strong>${data.name || 'Medical Product'}</strong>
              <p class="text-sm text-muted">Manufacturer: ${data.company || ''} · List Price: ${data.price || ''}</p>
            </div>
            <div class="form-group mt-3">
              <label class="form-label">Estimated Quantity Needed</label>
              <input type="text" id="quote-qty" class="form-control" placeholder="e.g. 5 units or 20 cases">
            </div>
            <div class="form-group mt-2">
              <label class="form-label">Hospital / Purchasing Organization</label>
              <input type="text" id="quote-org" class="form-control" value="${window.MedSphereStore.getState().currentUser.organization}">
            </div>
            <div class="form-group mt-2">
              <label class="form-label">Special Delivery / Clinical Requirement</label>
              <textarea id="quote-notes" class="form-control" rows="3" placeholder="Specify department, demo evaluation requirements, or GPO contract tiers..."></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" onclick="MedSphereModals.close()">Cancel</button>
            <button class="btn btn-primary" onclick="MedSphereModals.submitQuoteRequest('${data.name}', '${data.company}')">Send Procurement Request</button>
          </div>
        </div>
      `;
    } else if (modalId === 'modal-medai') {
      const initialPrompt = data.prompt || 'Summarize latest clinical guidelines for acute coronary syndromes';
      modalHtml = `
        <div class="modal-dialog modal-dialog-lg" style="max-width:700px;">
          <div class="modal-header" style="background:linear-gradient(135deg, #161230 0%, #2b1150 100%); color:#fff; border-radius:16px 16px 0 0;">
            <div class="modal-title-wrap">
              <span class="modal-badge" style="background:rgba(255,255,255,0.15); color:#e0e7ff;"><i class="fa-solid fa-wand-magic-sparkles" style="margin-right:4px;"></i> MedSphere Clinical AI</span>
              <h3 class="modal-title" style="color:#fff; font-size:1.25rem;">Evidence-Based Clinical Intelligence</h3>
              <p class="text-xs" style="color:#c7d2fe; margin-top:2px;">Answers cite peer-reviewed literature, ACC/AHA guidelines, and pharmacological databases.</p>
            </div>
            <button class="modal-close-btn" style="color:#fff;" onclick="MedSphereModals.close()"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="modal-body" style="padding:1.5rem;">
            <div style="display:flex; flex-wrap:wrap; gap:0.4rem; margin-bottom:1rem;">
              <button type="button" class="ai-chip-pill" style="background:var(--slate-100); color:var(--slate-800); border:1px solid var(--border-subtle);" onclick="document.getElementById('ai-query-input').value='Summarize ACC/AHA 2026 STEMI & NSTEMI reperfusion protocols'; MedSphereModals.runMedAiQuery();">Guideline summary</button>
              <button type="button" class="ai-chip-pill" style="background:var(--slate-100); color:var(--slate-800); border:1px solid var(--border-subtle);" onclick="document.getElementById('ai-query-input').value='Analyze high-resolution chest radiograph for bilateral alveolar infiltrates'; MedSphereModals.runMedAiQuery();">Image read</button>
              <button type="button" class="ai-chip-pill" style="background:var(--slate-100); color:var(--slate-800); border:1px solid var(--border-subtle);" onclick="document.getElementById('ai-query-input').value='Check drug interactions: Apixaban + Clopidogrel + Amiodarone'; MedSphereModals.runMedAiQuery();">Drug check</button>
            </div>

            <div class="form-group">
              <label class="form-label" style="font-weight:700;">Clinical Question or Case Presentation</label>
              <div style="display:flex; gap:0.5rem;">
                <input type="text" id="ai-query-input" class="form-control" value="${initialPrompt}" placeholder="Enter clinical inquiry..." onkeydown="if(event.key==='Enter') MedSphereModals.runMedAiQuery()">
                <button type="button" class="btn btn-primary" onclick="MedSphereModals.runMedAiQuery()"><i class="fa-solid fa-paper-plane"></i></button>
              </div>
            </div>

            <div id="ai-response-area" style="margin-top:1.25rem; padding:1.25rem; border-radius:12px; background:var(--primary-50); border:1px solid var(--primary-100);">
              <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem; color:var(--primary-800); font-weight:700; font-size:0.875rem;">
                <i class="fa-solid fa-circle-check"></i>
                <span>Clinical Synthesis &amp; Recommendations</span>
              </div>
              <p id="ai-response-text" style="font-size:0.875rem; line-height:1.6; color:var(--slate-800); margin:0;">
                <strong>Clinical Guideline Consensus:</strong> In patients presenting with acute coronary syndromes (ACS), immediate dual antiplatelet therapy (DAPT) with Aspirin and a potent P2Y12 inhibitor is strongly recommended (Class I, Level of Evidence A). Diagnostic coronary angiography within 24 hours provides definitive anatomical risk stratification.<br><br>
                <em style="color:var(--slate-600); font-size:0.775rem;">Verified Citations: JACC 2025;83(14):1452–1478 &bull; NEJM 2026;394:821–833 &bull; ACC/AHA STEMI Guidelines.</em>
              </p>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" onclick="MedSphereModals.close()">Close</button>
            <button class="btn btn-primary" onclick="window.MedSphereToast.show('Saved to Notes', 'Clinical guidelines copied to clinician study notes.', 'success'); MedSphereModals.close();">Save to Clinical Notes</button>
          </div>
        </div>
      `;
    } else if (modalId === 'modal-story') {
      const user = (window.MedSphereStore && window.MedSphereStore.getState().currentUser) || (window.MEDSPHERE_DATA && window.MEDSPHERE_DATA.currentUser) || {};
      const userAvatar = user.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80';
      const userName = user.name || 'Dr. Clinician';
      const userSpec = user.specialty || user.title || 'Healthcare Professional';

      modalHtml = `
        <div class="modal-dialog" style="max-width:520px; border-radius:12px; overflow:hidden;">
          <!-- Header -->
          <div style="display:flex; align-items:center; justify-content:space-between; padding:18px 20px 14px; border-bottom:1px solid #e5e7eb;">
            <h3 style="font-size:1.05rem; font-weight:700; color:#111827; margin:0;">Create a story</h3>
            <button onclick="MedSphereModals.close()" style="background:none; border:none; cursor:pointer; color:#6b7280; font-size:1.1rem; padding:4px; border-radius:50%; display:flex; align-items:center; justify-content:center;">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <!-- Author Row -->
          <div style="display:flex; align-items:center; gap:10px; padding:14px 20px 0;">
            <div style="position:relative;">
              <img src="${userAvatar}" alt="${userName}" style="width:44px; height:44px; border-radius:50%; object-fit:cover; border:2px solid #e5e7eb;">
            </div>
            <div>
              <div style="font-weight:700; font-size:0.925rem; color:#111827;">${userName}</div>
              <div style="font-size:0.78rem; color:#6b7280; margin-top:1px;">${userSpec}</div>
              <div style="display:inline-flex; align-items:center; gap:4px; background:#f1f5f9; border:1px solid #e2e8f0; border-radius:5px; padding:1px 7px; font-size:0.68rem; color:#475569; font-weight:600; margin-top:3px;">
                <i class="fa-solid fa-globe" style="font-size:0.6rem;"></i> Personal profile
              </div>
            </div>
          </div>

          <!-- Text Area -->
          <div style="padding:12px 20px 0;">
            <div id="story-bg-preview" style="border-radius:10px; transition:background 0.25s; padding:2px;">
              <textarea id="story-caption-input"
                style="width:100%; border:1.5px solid #e5e7eb; border-radius:9px; padding:12px 14px; font-size:0.9rem; color:#111827; resize:none; outline:none; min-height:100px; font-family:inherit; background:transparent; box-sizing:border-box; transition:border-color 0.2s;"
                placeholder="Share a quick update..."
                oninput="this.style.height='auto'; this.style.height=this.scrollHeight+'px';"
                onfocus="this.style.borderColor='#0080ff';"
                onblur="this.style.borderColor='#e5e7eb';"
              ></textarea>
            </div>
          </div>

          <!-- Media Buttons -->
          <div style="display:flex; gap:8px; padding:10px 20px;">
            <button type="button" onclick="MedSphereModals.storyAddPhoto()" style="display:flex; align-items:center; gap:6px; background:#f1f5f9; border:1px solid #e2e8f0; border-radius:8px; padding:7px 14px; cursor:pointer; font-size:0.82rem; font-weight:600; color:#374151; transition:all 0.15s;" onmouseover="this.style.background='#e2e8f0'" onmouseout="this.style.background='#f1f5f9'">
              <i class="fa-solid fa-image" style="color:#16a34a; font-size:0.9rem;"></i>
              Add photo
            </button>
            <button type="button" onclick="MedSphereModals.storyAddVideo()" style="display:flex; align-items:center; gap:6px; background:#f1f5f9; border:1px solid #e2e8f0; border-radius:8px; padding:7px 14px; cursor:pointer; font-size:0.82rem; font-weight:600; color:#374151; transition:all 0.15s;" onmouseover="this.style.background='#e2e8f0'" onmouseout="this.style.background='#f1f5f9'">
              <i class="fa-solid fa-video" style="color:#2563eb; font-size:0.9rem;"></i>
              Add video
            </button>
          </div>

          <!-- Photo Preview (hidden by default) -->
          <div id="story-photo-preview-wrap" style="display:none; padding:0 20px 10px;">
            <div style="position:relative; border-radius:10px; overflow:hidden;">
              <img id="story-photo-preview-img" src="" style="width:100%; max-height:180px; object-fit:cover; border-radius:10px; border:1px solid #e5e7eb;">
              <button onclick="MedSphereModals.storyRemovePhoto()" style="position:absolute; top:6px; right:6px; background:rgba(0,0,0,0.55); border:none; color:#fff; border-radius:50%; width:26px; height:26px; cursor:pointer; font-size:0.75rem; display:flex; align-items:center; justify-content:center;">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>

          <!-- Background Color Swatches -->
          <div style="padding:4px 20px 14px;">
            <div style="display:flex; gap:8px; align-items:center;">
              <div onclick="MedSphereModals.storySetBg('none', this)" class="story-color-swatch active" style="width:28px; height:28px; border-radius:50%; background:linear-gradient(135deg, #f97316, #ef4444); cursor:pointer; border:2px solid #f97316; box-shadow:0 0 0 2px #fff, 0 0 0 4px #f97316; transition:all 0.15s;" title="Warm gradient"></div>
              <div onclick="MedSphereModals.storySetBg('navy', this)" class="story-color-swatch" style="width:28px; height:28px; border-radius:50%; background:#0f172a; cursor:pointer; border:2px solid #0f172a; transition:all 0.15s;" title="Navy dark"></div>
              <div onclick="MedSphereModals.storySetBg('pink', this)" class="story-color-swatch" style="width:28px; height:28px; border-radius:50%; background:linear-gradient(135deg, #ec4899, #f43f5e); cursor:pointer; border:2px solid #ec4899; transition:all 0.15s;" title="Pink"></div>
              <div onclick="MedSphereModals.storySetBg('green', this)" class="story-color-swatch" style="width:28px; height:28px; border-radius:50%; background:linear-gradient(135deg, #10b981, #059669); cursor:pointer; border:2px solid #10b981; transition:all 0.15s;" title="Emerald"></div>
              <div onclick="MedSphereModals.storySetBg('lavender', this)" class="story-color-swatch" style="width:28px; height:28px; border-radius:50%; background:linear-gradient(135deg, #a78bfa, #c4b5fd); cursor:pointer; border:2px solid #a78bfa; transition:all 0.15s;" title="Lavender"></div>
              <div onclick="MedSphereModals.storySetBg('crimson', this)" class="story-color-swatch" style="width:28px; height:28px; border-radius:50%; background:linear-gradient(135deg, #e11d48, #be123c); cursor:pointer; border:2px solid #e11d48; transition:all 0.15s;" title="Crimson"></div>
            </div>
          </div>

          <!-- Hidden image input and bg tracker -->
          <input type="hidden" id="story-img-url" value="">
          <input type="hidden" id="story-bg-color" value="none">

          <!-- Footer -->
          <div style="display:flex; justify-content:flex-end; gap:8px; padding:12px 20px; border-top:1px solid #e5e7eb;">
            <button onclick="MedSphereModals.close()" style="background:none; border:1px solid #d1d5db; border-radius:8px; padding:8px 20px; cursor:pointer; font-size:0.9rem; font-weight:600; color:#374151; transition:all 0.15s;" onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='none'">Cancel</button>
            <button onclick="MedSphereModals.submitStory()" style="background:#1d4ed8; color:#fff; border:none; border-radius:8px; padding:8px 22px; cursor:pointer; font-size:0.9rem; font-weight:700; transition:background 0.15s;" onmouseover="this.style.background='#1e40af'" onmouseout="this.style.background='#1d4ed8'">Publish story</button>
          </div>
        </div>
      `;
    } else if (modalId === 'modal-view-story') {
      const state = window.MedSphereStore.getState();
      const allStories = (state.stories && state.stories.length > 0) ? state.stories : (window.MEDSPHERE_DATA.stories || []);
      const story = allStories.find(s => s.id === data.storyId) || allStories[0] || {
        authorName: "Dr. Eleanor Vance",
        authorRole: "Chief of Interventional Cardiology",
        authorAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
        image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
        title: "Cath Lab Rounds",
        caption: "Successful TAVR deployment with zero paravalvular leak. Outstanding interventional hemodynamics team coordination today!",
        time: "2h ago",
        views: 89
      };

      modalHtml = `
        <div class="modal-dialog story-viewer-dialog">
          <!-- Story Progress Bar -->
          <div class="story-progress-bar-wrap">
            <div class="story-progress-bar-fill"></div>
          </div>

          <!-- Header overlay -->
          <div style="position:absolute; top:20px; left:16px; right:16px; display:flex; align-items:center; justify-content:space-between; z-index:20;">
            <div style="display:flex; align-items:center; gap:10px;">
              <img src="${story.authorAvatar}" alt="${story.authorName}" style="width:38px; height:38px; border-radius:50%; object-fit:cover; border:2px solid #00d2ff;">
              <div>
                <div style="font-weight:700; font-size:0.875rem; color:#fff; text-shadow:0 1px 4px rgba(0,0,0,0.8);">${story.authorName}</div>
                <div style="font-size:0.7rem; color:#cbd5e1; text-shadow:0 1px 3px rgba(0,0,0,0.8);">${story.authorRole} &bull; ${story.time || '2h ago'}</div>
              </div>
            </div>
            <button type="button" onclick="MedSphereModals.close()" style="background:rgba(0,0,0,0.4); border:none; color:#fff; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:1rem;">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <!-- Story Visual -->
          <div style="height:440px; position:relative; overflow:hidden;">
            <img src="${story.image}" alt="${story.title || 'Clinical Story'}" style="width:100%; height:100%; object-fit:cover;">
            <div style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.85) 100%);"></div>

            <!-- Floating Caption -->
            <div style="position:absolute; bottom:16px; left:16px; right:16px; z-index:15;">
              <div style="display:inline-block; background:rgba(0,128,255,0.7); backdrop-filter:blur(6px); color:#fff; font-size:0.675rem; font-weight:800; padding:2px 8px; border-radius:9999px; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:6px;">
                ${story.title || 'Clinical Case'}
              </div>
              <p style="color:#ffffff; font-size:0.875rem; line-height:1.45; margin:0; text-shadow:0 2px 4px rgba(0,0,0,0.8);">
                ${story.caption}
              </p>
              <div style="display:flex; align-items:center; gap:6px; color:#94a3b8; font-size:0.725rem; margin-top:8px;">
                <i class="fa-regular fa-eye"></i>
                <span>${story.views || 89} verified colleagues viewed</span>
              </div>
            </div>
          </div>

          <!-- Bottom Interaction Tray -->
          <div style="padding:12px 16px; background:#0f172a; border-top:1px solid rgba(255,255,255,0.1); z-index:20;">
            <!-- Reaction Emojis -->
            <div style="display:flex; justify-content:space-around; margin-bottom:10px;">
              <button type="button" class="story-react-btn" onclick="MedSphereModals.reactStory('❤️', '${story.authorName}')" title="Love this case">❤️ <span style="font-size:0.7rem; color:#cbd5e1;">Helpful</span></button>
              <button type="button" class="story-react-btn" onclick="MedSphereModals.reactStory('🩺', '${story.authorName}')" title="Clinical excellence">🩺 <span style="font-size:0.7rem; color:#cbd5e1;">Clinical</span></button>
              <button type="button" class="story-react-btn" onclick="MedSphereModals.reactStory('💡', '${story.authorName}')" title="Insightful">💡 <span style="font-size:0.7rem; color:#cbd5e1;">Insight</span></button>
              <button type="button" class="story-react-btn" onclick="MedSphereModals.reactStory('👏', '${story.authorName}')" title="Great procedure">👏 <span style="font-size:0.7rem; color:#cbd5e1;">Bravo</span></button>
            </div>

            <!-- Reply Input -->
            <div style="display:flex; gap:8px;">
              <input type="text" id="story-reply-input" placeholder="Reply to ${story.authorName.split(' ')[0]}..." style="flex:1; background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.2); border-radius:9999px; padding:8px 14px; color:#fff; font-size:0.825rem; outline:none;" onkeydown="if(event.key==='Enter') MedSphereModals.replyStory('${story.authorName}')">
              <button type="button" class="btn btn-primary btn-sm" style="border-radius:9999px; padding:0 14px;" onclick="MedSphereModals.replyStory('${story.authorName}')">
                <i class="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    } else if (modalId === 'modal-verify') {
      const curUser = window.MedSphereStore.getState().currentUser || {};
      modalHtml = `
        <div class="modal-dialog modal-dialog-lg" style="max-width:620px;">
          <div class="modal-header">
            <div class="modal-title-wrap">
              <span class="modal-badge badge-green"><i class="fa-solid fa-shield-halved" style="margin-right:4px;"></i> Official Credential Verification</span>
              <h3 class="modal-title">Submit Professional Medical Credentials</h3>
              <p class="text-xs text-muted" style="margin-top:2px;">Under HIPAA & state licensing board compliance protocols</p>
            </div>
            <button class="modal-close-btn" onclick="MedSphereModals.close()"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="modal-body" style="padding:1.5rem;">
            <div style="background:var(--primary-50); border:1px solid var(--primary-100); border-radius:12px; padding:1rem; margin-bottom:1.25rem; display:flex; gap:0.75rem; align-items:flex-start;">
              <i class="fa-solid fa-circle-info" style="color:var(--primary-800); margin-top:2px; font-size:1.1rem;"></i>
              <div style="font-size:0.8125rem; color:var(--slate-700); line-height:1.5;">
                MedSphere verifies credentials against primary sources (NPPES, State Medical Boards, and National Healthcare Directories). Once approved by compliance, you receive the <strong>Verified Healthcare Professional</strong> trust badge.
              </div>
            </div>

            <form id="credential-verification-form" onsubmit="event.preventDefault(); MedSphereModals.submitVerificationForm(this);">
              <div class="form-row">
                <div class="form-group col-6">
                  <label class="form-label">Full Legal Name on License *</label>
                  <input type="text" id="verif-name" class="form-control" value="${curUser.name || ''}" required>
                </div>
                <div class="form-group col-6">
                  <label class="form-label">National Provider Identifier (NPI 10-digit)</label>
                  <input type="text" id="verif-npi" class="form-control" value="${curUser.npi || '1841295482'}" placeholder="e.g. 1841295482" maxlength="10">
                </div>
              </div>

              <div class="form-row">
                <div class="form-group col-6">
                  <label class="form-label">Medical License Number *</label>
                  <input type="text" id="verif-license" class="form-control" value="MA-MD-849204" placeholder="e.g. MD-7829104" required>
                </div>
                <div class="form-group col-6">
                  <label class="form-label">Issuing Authority / State Board *</label>
                  <input type="text" id="verif-authority" class="form-control" value="Massachusetts Board of Registration in Medicine" placeholder="e.g. California Medical Board" required>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group col-6">
                  <label class="form-label">Document Type *</label>
                  <select id="verif-doc-type" class="form-select">
                    <option value="Medical License">State Medical License (MD/DO/MBBS)</option>
                    <option value="Nursing License">Registered Nurse / APRN License</option>
                    <option value="Pharmacy License">Registered Pharmacist License (RPh/PharmD)</option>
                    <option value="Board Certification">Specialty Board Certification (ABMS)</option>
                    <option value="Diploma">Medical Degree Diploma / Educational ECFMG</option>
                    <option value="Hospital Credential">Hospital Clinical Staff Appointment</option>
                  </select>
                </div>
                <div class="form-group col-6">
                  <label class="form-label">Issuing State / Jurisdiction</label>
                  <input type="text" id="verif-jurisdiction" class="form-control" value="Massachusetts, USA" placeholder="e.g. New York, USA">
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Additional Credential Notes / License Registry URL</label>
                <textarea id="verif-details" class="form-control" rows="2" placeholder="Provide online registry verification link or clinical appointment verification reference..."></textarea>
              </div>

              <div style="font-size:0.75rem; color:var(--slate-500); margin-top:0.5rem; display:flex; align-items:center; gap:6px;">
                <i class="fa-solid fa-lock" style="color:var(--emerald-600);"></i>
                Private verification documents are encrypted and never exposed publicly.
              </div>

              <div class="modal-footer" style="padding:1.25rem 0 0 0; margin-top:1rem; border-top:1px solid var(--border-subtle);">
                <button type="button" class="btn btn-outline" onclick="MedSphereModals.close()">Cancel</button>
                <button type="submit" id="submit-verif-btn" class="btn btn-primary">
                  <i class="fa-solid fa-shield-check" style="margin-right:6px;"></i> Submit for Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      `;
    } else if (modalId === 'modal-post-job') {
      const curUser = window.MedSphereStore.getState().currentUser || {};
      modalHtml = `
        <div class="modal-dialog modal-dialog-lg" style="max-width:720px;">
          <div class="modal-header">
            <div class="modal-title-wrap">
              <span class="modal-badge badge-blue"><i class="fa-solid fa-hospital" style="margin-right:4px;"></i> Healthcare Employer Portal</span>
              <h3 class="modal-title">Post New Clinical Career Vacancy</h3>
              <p class="text-xs text-muted">Post directly to 180,000+ verified healthcare practitioners</p>
            </div>
            <button class="modal-close-btn" onclick="MedSphereModals.close()"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="modal-body" style="padding:1.5rem;">
            <form id="post-job-form" onsubmit="event.preventDefault(); MedSphereModals.submitPostJobForm(this);">
              <div class="form-row">
                <div class="form-group col-6">
                  <label class="form-label">Position / Job Title *</label>
                  <input type="text" id="job-title" class="form-control" placeholder="e.g. Attending Interventional Cardiologist" required>
                </div>
                <div class="form-group col-6">
                  <label class="form-label">Hospital / Healthcare Organization *</label>
                  <input type="text" id="job-company" class="form-control" value="${curUser.organization || 'St. Lukes Health System'}" required>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group col-6">
                  <label class="form-label">Specialty Category *</label>
                  <select id="job-specialty" class="form-select" required>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Critical Care">Critical Care / ICU</option>
                    <option value="Emergency Medicine">Emergency Medicine</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Surgery">General / Cardiothoracic Surgery</option>
                    <option value="Oncology">Hematology / Oncology</option>
                    <option value="Nursing">Advanced Practice Nursing</option>
                    <option value="Pharmacy">Clinical Pharmacy</option>
                    <option value="Allied Health">Allied Health</option>
                  </select>
                </div>
                <div class="form-group col-6">
                  <label class="form-label">Employment Type *</label>
                  <select id="job-employment-type" class="form-select">
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Contract">Contract / Locum Tenens</option>
                    <option value="Per Diem">Per Diem</option>
                    <option value="Travel">Travel Healthcare</option>
                    <option value="Fellowship">Fellowship</option>
                    <option value="Residency">Residency</option>
                    <option value="Internship">Clinical Internship</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group col-4">
                  <label class="form-label">Location (City, State) *</label>
                  <input type="text" id="job-location" class="form-control" placeholder="e.g. Boston, MA" required>
                </div>
                <div class="form-group col-4">
                  <label class="form-label">Compensation / Salary Range *</label>
                  <input type="text" id="job-salary" class="form-control" placeholder="e.g. $420,000 - $490,000" required>
                </div>
                <div class="form-group col-4">
                  <label class="form-label">Sign-On Bonus</label>
                  <input type="text" id="job-bonus" class="form-control" placeholder="e.g. $50,000 Sign-on Bonus">
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Clinical Overview & Department Description *</label>
                <textarea id="job-description" class="form-control" rows="3" placeholder="Describe the clinical unit, patient volumes, call schedule, and procedural facilities..." required></textarea>
              </div>

              <div class="form-row">
                <div class="form-group col-6">
                  <label class="form-label">Core Responsibilities</label>
                  <textarea id="job-responsibilities" class="form-control" rows="2" placeholder="Inpatient rounding, cath-lab procedures, fellow supervision..."></textarea>
                </div>
                <div class="form-group col-6">
                  <label class="form-label">Required Qualifications & License</label>
                  <textarea id="job-requirements" class="form-control" rows="2" placeholder="MD/DO, Board Certified, active state license, BLS/ACLS..."></textarea>
                </div>
              </div>

              <div class="modal-footer" style="padding:1.25rem 0 0 0; margin-top:1rem; border-top:1px solid var(--border-subtle);">
                <button type="button" class="btn btn-outline" onclick="MedSphereModals.close()">Cancel</button>
                <button type="submit" id="submit-job-btn" class="btn btn-primary">
                  <i class="fa-solid fa-paper-plane" style="margin-right:6px;"></i> Publish Job Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      `;
    } else if (modalId === 'modal-add-product') {
      const curUser = window.MedSphereStore.getState().currentUser || {};
      modalHtml = `
        <div class="modal-dialog modal-dialog-lg" style="max-width:680px;">
          <div class="modal-header">
            <div class="modal-title-wrap">
              <span class="modal-badge badge-cme"><i class="fa-solid fa-cart-shopping" style="margin-right:4px;"></i> Supplier Catalog Portal</span>
              <h3 class="modal-title">List New Medical Device / Pharmaceutical</h3>
              <p class="text-xs text-muted">Direct procurement showcase for hospitals, clinics &amp; labs</p>
            </div>
            <button class="modal-close-btn" onclick="MedSphereModals.close()"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="modal-body" style="padding:1.5rem;">
            <form id="add-product-form" onsubmit="event.preventDefault(); MedSphereModals.submitAddProductForm(this);">
              <div class="form-row">
                <div class="form-group col-6">
                  <label class="form-label">Product / Device Name *</label>
                  <input type="text" id="prod-name" class="form-control" placeholder="e.g. UltraSound EchoPro 4D Imaging System" required>
                </div>
                <div class="form-group col-6">
                  <label class="form-label">Manufacturer / Supplier Company *</label>
                  <input type="text" id="prod-company" class="form-control" value="${curUser.organization || 'Siemens Healthineers'}" required>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group col-6">
                  <label class="form-label">Marketplace Category *</label>
                  <select id="prod-category" class="form-select" required>
                    <option value="Medical Equipment">Medical Equipment</option>
                    <option value="Medical Devices">Medical Devices &amp; Implants</option>
                    <option value="Pharmaceuticals">Pharmaceuticals &amp; Vaccines</option>
                    <option value="Laboratory Supplies">Laboratory &amp; Diagnostics</option>
                    <option value="PPE">PPE &amp; Infection Control</option>
                    <option value="Hospital Supplies">Hospital &amp; Surgical Supplies</option>
                    <option value="Healthcare Software">Healthcare AI &amp; Software</option>
                  </select>
                </div>
                <div class="form-group col-6">
                  <label class="form-label">Certification Badge</label>
                  <input type="text" id="prod-badge" class="form-control" value="FDA Cleared" placeholder="e.g. FDA 510(k) Cleared, CE Mark">
                </div>
              </div>

              <div class="form-row">
                <div class="form-group col-4">
                  <label class="form-label">List Price / Starting At *</label>
                  <input type="text" id="prod-price" class="form-control" placeholder="e.g. $48,500" required>
                </div>
                <div class="form-group col-4">
                  <label class="form-label">Pricing Unit</label>
                  <input type="text" id="prod-unit" class="form-control" value="Per System" placeholder="e.g. Per Unit, Per Box of 100">
                </div>
                <div class="form-group col-4">
                  <label class="form-label">Stock Status</label>
                  <input type="text" id="prod-stock" class="form-control" value="In Stock (Direct Ship)">
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Product Overview &amp; Clinical Application *</label>
                <textarea id="prod-description" class="form-control" rows="3" placeholder="Provide clinical indications, diagnostic sensitivity, and hospital integration features..." required></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">Technical Specifications</label>
                <input type="text" id="prod-specs" class="form-control" value="DICOM 3.0 Compatible · 24-bit TrueColor · 128 Channel Transducer" placeholder="Key technical specifications">
              </div>

              <div class="modal-footer" style="padding:1.25rem 0 0 0; margin-top:1rem; border-top:1px solid var(--border-subtle);">
                <button type="button" class="btn btn-outline" onclick="MedSphereModals.close()">Cancel</button>
                <button type="submit" id="submit-prod-btn" class="btn btn-primary">
                  <i class="fa-solid fa-plus" style="margin-right:6px;"></i> List in Marketplace
                </button>
              </div>
            </form>
          </div>
        </div>
      `;
    } else if (modalId === 'modal-certificate') {
      const curUser = window.MedSphereStore.getState().currentUser || {};
      const certId = data.certificateId || ('CME-ACCME-' + Math.random().toString(36).substring(2, 10).toUpperCase());
      const clinician = data.clinicianName || curUser.name || 'Dr. Eleanor Vance, MD';
      const course = data.courseTitle || 'Advanced Cardiovascular Life Support & Hemodynamics';
      const credits = data.cmeCredits || '4.0 AMA PRA Category 1 Credits™';
      const date = data.issueDate || new Date().toISOString().split('T')[0];

      modalHtml = `
        <div class="modal-dialog modal-dialog-lg" style="max-width:800px;">
          <div class="modal-header" style="background:#073b6f; color:#fff; border-radius:16px 16px 0 0;">
            <div class="modal-title-wrap">
              <span class="modal-badge" style="background:rgba(255,255,255,0.15); color:#93c5fd;">OFFICIAL ACCREDITED RECORD</span>
              <h3 class="modal-title" style="color:#fff;">Continuing Medical Education Certificate</h3>
            </div>
            <button class="modal-close-btn" style="color:#fff;" onclick="MedSphereModals.close()"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="modal-body" style="padding:2rem; background:#fafbfc;" id="certificate-print-area">
            <div style="border:4px double #0B5CAD; padding:2.5rem; background:#fff; text-align:center; position:relative; box-shadow:var(--shadow-sm); border-radius:8px;">
              <!-- Header / Watermark -->
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; border-bottom:2px solid #e2e8f0; padding-bottom:1rem;">
                <div style="text-align:left;">
                  <strong style="color:#073b6f; font-size:1.4rem; font-family:var(--font-heading); display:flex; align-items:center; gap:8px;">
                    <i class="fa-solid fa-circle-nodes" style="color:#0B5CAD;"></i> MedSphere Medical Institute
                  </strong>
                  <div style="font-size:0.75rem; color:#64748b;">Accreditation Provider ID: ACCME-MS-782194</div>
                </div>
                <div style="text-align:right;">
                  <span class="badge badge-green" style="font-size:0.8rem;"><i class="fa-solid fa-circle-check" style="margin-right:4px;"></i> Verified ACCME Accredited</span>
                  <div style="font-size:0.75rem; color:#64748b; margin-top:4px;">Serial: <strong>${certId}</strong></div>
                </div>
              </div>

              <div style="font-size:0.9rem; text-transform:uppercase; letter-spacing:2px; color:#64748b; margin-bottom:0.5rem;">Certificate of Continuing Medical Education</div>
              <h2 style="font-size:1.6rem; color:#073b6f; font-family:var(--font-heading); margin-bottom:1rem;">This certifies that</h2>
              
              <div style="font-size:2rem; font-weight:800; color:#0B5CAD; font-family:var(--font-heading); margin-bottom:0.5rem; text-decoration:underline; text-decoration-color:#93c5fd; text-underline-offset:6px;">
                ${clinician}
              </div>
              <div style="font-size:0.95rem; color:#475569; margin-bottom:1.5rem;">has successfully completed the accredited clinical curriculum and examination for</div>

              <div style="font-size:1.35rem; font-weight:700; color:#0f172a; margin-bottom:1rem; background:#f0fdf4; padding:0.75rem; border-radius:8px; display:inline-block; border:1px solid #bbf7d0;">
                ${course}
              </div>

              <p style="font-size:0.9rem; color:#475569; max-width:600px; margin:1rem auto; line-height:1.6;">
                The MedSphere Institute certifies that the clinician designated above has completed educational activity designated for <strong>${credits}</strong>.
              </p>

              <!-- Signatures & Verification seal -->
              <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:2.5rem; padding-top:1.5rem; border-top:1px solid #e2e8f0;">
                <div style="text-align:left;">
                  <div style="font-family:'Courier New', monospace; font-size:1rem; color:#0B5CAD; font-weight:700;">Dr. Arthur Campbell, MD</div>
                  <div style="font-size:0.75rem; color:#64748b; border-top:1px solid #94a3b8; padding-top:4px;">Director of Medical Education &amp; CME</div>
                </div>

                <div style="text-align:center;">
                  <div style="width:68px; height:68px; border-radius:50%; border:2px dashed #0B5CAD; display:flex; align-items:center; justify-content:center; margin:0 auto; color:#073b6f;">
                    <i class="fa-solid fa-award" style="font-size:2rem; color:#d97706;"></i>
                  </div>
                  <span style="font-size:0.7rem; color:#64748b; display:block; margin-top:4px;">OFFICIAL SEAL</span>
                </div>

                <div style="text-align:right;">
                  <div style="font-weight:700; color:#0f172a; font-size:0.95rem;">${date}</div>
                  <div style="font-size:0.75rem; color:#64748b; border-top:1px solid #94a3b8; padding-top:4px;">Date of Issue &amp; Reporting</div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer" style="display:flex; justify-content:space-between;">
            <button class="btn btn-outline" onclick="MedSphereModals.close()">Close</button>
            <div style="display:flex; gap:0.5rem;">
              <button class="btn btn-secondary" onclick="window.print()"><i class="fa-solid fa-print" style="margin-right:6px;"></i> Print / Save PDF</button>
              <button class="btn btn-primary" onclick="window.MedSphereToast.show('Certificate Saved', 'CME verification transcript saved to your platform dashboard.', 'success'); MedSphereModals.close();">Add to CME Vault</button>
            </div>
          </div>
        </div>
      `;
    } else if (modalId === 'modal-event-register') {
      modalHtml = `
        <div class="modal-dialog">
          <div class="modal-header">
            <div class="modal-title-wrap">
              <span class="modal-badge badge-cme">Event Registration</span>
              <h3 class="modal-title">Confirm Medical Event Badge</h3>
            </div>
            <button class="modal-close-btn" onclick="MedSphereModals.close()"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="modal-body">
            <div style="margin-bottom:1rem; padding:1rem; background:var(--slate-50); border-radius:10px; border:1px solid var(--border-subtle);">
              <h4 style="font-size:1.1rem; color:var(--primary-900); margin-bottom:0.25rem;">${data.title || 'Medical Conference'}</h4>
              <div class="text-xs text-muted" style="margin-bottom:0.5rem;"><i class="fa-regular fa-calendar" style="margin-right:4px;"></i> ${data.date || 'Upcoming'} &bull; ${data.location || 'Virtual'}</div>
              <span class="badge badge-green">${data.cme_credits ? data.cme_credits + ' CME Credits' : 'Accredited'}</span>
            </div>
            <p class="text-xs text-muted">Your badge will be registered under your verified profile name and institutional affiliation. Confirmation calendar invite will be generated.</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" onclick="MedSphereModals.close()">Cancel</button>
            <button class="btn btn-primary" onclick="MedSphereModals.submitEventRegistration('${data.id}', '${(data.title || '').replace(/'/g, "\\'")}')">Confirm Registration</button>
          </div>
        </div>
      `;
    } else if (modalId === 'modal-profile-stats') {
      modalHtml = `
        <div class="modal-dialog">
          <div class="modal-header">
            <div class="modal-title-wrap">
              <span class="modal-badge">Analytics</span>
              <h3 class="modal-title">Profile Statistics</h3>
              <p class="text-xs text-muted">Past 30 days clinical reach and engagement</p>
            </div>
            <button class="modal-close-btn" onclick="MedSphereModals.close()"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="modal-body">
            <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:1rem; margin-bottom:1.5rem;">
              <div style="background:var(--slate-50); border:1px solid var(--border-subtle); padding:1rem; border-radius:12px; text-align:center;">
                <div style="font-size:1.5rem; font-weight:800; color:var(--primary-800);">142</div>
                <div style="font-size:0.75rem; color:var(--slate-500); font-weight:600;">PROFILE VIEWS</div>
                <div style="font-size:0.7rem; color:var(--emerald-600); margin-top:4px;"><i class="fa-solid fa-arrow-trend-up"></i> +28% this month</div>
              </div>
              <div style="background:var(--slate-50); border:1px solid var(--border-subtle); padding:1rem; border-radius:12px; text-align:center;">
                <div style="font-size:1.5rem; font-weight:800; color:var(--primary-800);">1,420</div>
                <div style="font-size:0.75rem; color:var(--slate-500); font-weight:600;">POST IMPRESSIONS</div>
                <div style="font-size:0.7rem; color:var(--emerald-600); margin-top:4px;"><i class="fa-solid fa-arrow-trend-up"></i> +45% across network</div>
              </div>
              <div style="background:var(--slate-50); border:1px solid var(--border-subtle); padding:1rem; border-radius:12px; text-align:center;">
                <div style="font-size:1.5rem; font-weight:800; color:var(--primary-800);">86</div>
                <div style="font-size:0.75rem; color:var(--slate-500); font-weight:600;">SEARCH APPEARANCES</div>
                <div style="font-size:0.7rem; color:var(--primary-700); margin-top:4px;">Cardiology &amp; Surgery</div>
              </div>
              <div style="background:var(--slate-50); border:1px solid var(--border-subtle); padding:1rem; border-radius:12px; text-align:center;">
                <div style="font-size:1.5rem; font-weight:800; color:var(--primary-800);">38 hrs</div>
                <div style="font-size:0.75rem; color:var(--slate-500); font-weight:600;">CME ACCREDITED</div>
                <div style="font-size:0.7rem; color:var(--emerald-600); margin-top:4px;">76% state target</div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary w-100" onclick="MedSphereModals.close()">Done</button>
          </div>
        </div>
      `;
    } else if (modalId === 'modal-activity-log') {
      modalHtml = `
        <div class="modal-dialog">
          <div class="modal-header">
            <div class="modal-title-wrap">
              <span class="modal-badge">Audit Trail</span>
              <h3 class="modal-title">Activity Log</h3>
            </div>
            <button class="modal-close-btn" onclick="MedSphereModals.close()"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="modal-body">
            <div style="display:flex; flex-direction:column; gap:0.85rem;">
              <div style="display:flex; gap:0.75rem; padding:0.65rem; background:var(--slate-50); border-radius:8px;">
                <i class="fa-solid fa-shield-halved" style="color:var(--emerald-600); margin-top:2px;"></i>
                <div>
                  <strong style="font-size:0.825rem;">Session Authenticated</strong>
                  <p class="text-xs text-muted" style="margin:0;">Logged in from Chrome on Windows (127.0.0.1) &bull; Just now</p>
                </div>
              </div>
              <div style="display:flex; gap:0.75rem; padding:0.65rem; background:var(--slate-50); border-radius:8px;">
                <i class="fa-solid fa-graduation-cap" style="color:var(--primary-700); margin-top:2px;"></i>
                <div>
                  <strong style="font-size:0.825rem;">CME Module Enrolled</strong>
                  <p class="text-xs text-muted" style="margin:0;">Advanced Echocardiography &bull; Yesterday</p>
                </div>
              </div>
              <div style="display:flex; gap:0.75rem; padding:0.65rem; background:var(--slate-50); border-radius:8px;">
                <i class="fa-solid fa-circle-nodes" style="color:var(--primary-700); margin-top:2px;"></i>
                <div>
                  <strong style="font-size:0.825rem;">New Colleague Connected</strong>
                  <p class="text-xs text-muted" style="margin:0;">Dr. Marcus Chen accepted your clinical connection &bull; 2 days ago</p>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary w-100" onclick="MedSphereModals.close()">Close</button>
          </div>
        </div>
      `;
    }

    backdrop.innerHTML = modalHtml;
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) MedSphereModals.close();
    });

    document.body.appendChild(backdrop);
    return backdrop;
  },

  populateModal(modalEl, data) {
    // Dynamic population if modal is pre-rendered
  },

  submitConnect(id, name) {
    window.MedSphereStore.toggleConnect(id);
    MedSphereToast.show("Connection Sent", `Invitation sent to ${name || 'colleague'}.`, "success");
    this.close();
  },

  submitJobApplication(id, title, company) {
    window.MedSphereStore.applyToJob(id, { title, company });
    MedSphereToast.show("Application Submitted!", `Successfully applied to ${title} at ${company}. Track in My applications.`, "success");
    this.close();
    if (window.MedSphereJobs) {
      window.MedSphereJobs.state.selectedJobId = id;
      window.MedSphereJobs.updateListView();
      window.MedSphereJobs.selectJob(id);
    } else if (window.MedSphereRouter) {
      window.MedSphereRouter.refreshCurrentPage();
    }
  },

  submitCourseEnrollment(id, title) {
    window.MedSphereStore.enrollInCourse(id);
    MedSphereToast.show("Enrolled Successfully", `You are now enrolled in "${title}". CME tracking is active.`, "success");
    this.close();
    if (window.MedSphereRouter) window.MedSphereRouter.refreshCurrentPage();
  },

  submitCreatePost(type = 'post') {
    if (type === 'poll') {
      const questionEl = document.getElementById("poll-question");
      const opt1El = document.getElementById("poll-opt-1");
      const opt2El = document.getElementById("poll-opt-2");
      const opt3El = document.getElementById("poll-opt-3");
      const contextEl = document.getElementById("poll-context");
      const specialtyEl = document.getElementById("poll-specialty");

      if (!questionEl || !questionEl.value.trim() || !opt1El || !opt1El.value.trim() || !opt2El || !opt2El.value.trim()) {
        alert("Please provide the poll question and at least 2 options.");
        return;
      }

      const options = [
        { id: "opt-1", text: opt1El.value.trim(), votes: 1 },
        { id: "opt-2", text: opt2El.value.trim(), votes: 0 }
      ];
      if (opt3El && opt3El.value.trim()) {
        options.push({ id: "opt-3", text: opt3El.value.trim(), votes: 0 });
      }

      window.MedSphereStore.addCommunityPost({
        type: 'poll',
        specialtyTag: specialtyEl ? specialtyEl.value : 'Clinical Poll',
        content: contextEl ? contextEl.value.trim() : '',
        poll: {
          question: questionEl.value.trim(),
          totalVotes: 1,
          myVote: "opt-1",
          options: options
        }
      });

      MedSphereToast.show("Poll Launched", "Your clinical poll has been published to the verified feed.", "success");
      this.close();
      if (window.MedSphereRouter) window.MedSphereRouter.refreshCurrentPage();
      return;
    }

    if (type === 'blog') {
      const titleEl = document.getElementById("blog-title");
      const bodyEl = document.getElementById("blog-body");
      const specialtyEl = document.getElementById("blog-specialty");
      const readTimeEl = document.getElementById("blog-read-time");

      if (!titleEl || !titleEl.value.trim() || !bodyEl || !bodyEl.value.trim()) {
        alert("Please enter the article title and clinical content.");
        return;
      }

      window.MedSphereStore.addCommunityPost({
        type: 'blog',
        specialtyTag: specialtyEl ? specialtyEl.value : 'Clinical Perspective',
        content: bodyEl.value.trim(),
        blog: {
          title: titleEl.value.trim(),
          readTime: readTimeEl ? readTimeEl.value.trim() : '5 min read'
        }
      });

      MedSphereToast.show("Article Published", "Your medical editorial is now live in the community feed.", "success");
      this.close();
      if (window.MedSphereRouter) window.MedSphereRouter.refreshCurrentPage();
      return;
    }

    // Standard clinical post
    const contentEl = document.getElementById("post-content");
    const imageEl = document.getElementById("post-image-url");
    const privacyEl = document.getElementById("post-privacy");
    if (!contentEl || !contentEl.value.trim()) {
      window.MedSphereToast.show('Post Required', 'Please write something to share with your network.', 'warning');
      if (contentEl) contentEl.focus();
      return;
    }
    window.MedSphereStore.addCommunityPost({
      type: 'standard',
      specialtyTag: 'Clinical Discussion',
      content: contentEl.value.trim(),
      imageUrl: imageEl && imageEl.value.trim() ? imageEl.value.trim() : null,
      privacy: privacyEl ? privacyEl.value : 'public'
    });
    MedSphereToast.show("Post Published!", "Your update has been shared with your network.", "success");
    this.close();
    if (window.MedSphereRouter) window.MedSphereRouter.refreshCurrentPage();
  },

  postAddPhoto() {
    const existing = document.getElementById('post-file-input');
    if (existing) existing.remove();
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.id = 'post-file-input';
    fileInput.style.display = 'none';
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target.result;
        const imgEl = document.getElementById('post-image-url');
        if (imgEl) imgEl.value = dataUrl;
        const wrap = document.getElementById('post-photo-preview-wrap');
        const previewImg = document.getElementById('post-photo-preview-img');
        if (wrap && previewImg) {
          previewImg.src = dataUrl;
          wrap.style.display = 'block';
        }
      };
      reader.readAsDataURL(file);
    };
    document.body.appendChild(fileInput);
    fileInput.click();
  },

  postRemovePhoto() {
    const wrap = document.getElementById('post-photo-preview-wrap');
    if (wrap) wrap.style.display = 'none';
    const imgEl = document.getElementById('post-image-url');
    if (imgEl) imgEl.value = '';
    const previewImg = document.getElementById('post-photo-preview-img');
    if (previewImg) previewImg.src = '';
  },

  postAddVideo() {
    window.MedSphereToast.show('Video Coming Soon', 'Video post support is being rolled out. Use a photo for now!', 'info');
  },

  submitStory() {
    const captionEl = document.getElementById("story-caption-input");
    const imgEl = document.getElementById("story-img-url");
    const bgColor = document.getElementById("story-bg-color")?.value || 'none';

    const caption = captionEl ? captionEl.value.trim() : "";
    if (!caption) {
      window.MedSphereToast.show('Caption Required', 'Please write something to share with your network.', 'warning');
      if (captionEl) captionEl.focus();
      return;
    }

    // Background color maps
    const bgMap = {
      none:     'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
      navy:     'https://images.unsplash.com/photo-1561505457-3bcad021f8ee?auto=format&fit=crop&w=800&q=80',
      pink:     'https://images.unsplash.com/photo-1557683311-eac922347aa1?auto=format&fit=crop&w=800&q=80',
      green:    'https://images.unsplash.com/photo-1530908295418-a12e326966ba?auto=format&fit=crop&w=800&q=80',
      lavender: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
      crimson:  'https://images.unsplash.com/photo-1518050947974-4be8c7469f0c?auto=format&fit=crop&w=800&q=80'
    };

    const selectedImg = (imgEl && imgEl.value && imgEl.value.startsWith('http'))
      ? imgEl.value
      : (bgMap[bgColor] || bgMap.none);

    window.MedSphereStore.addStory({
      title: caption.length > 40 ? caption.substring(0, 40) + '...' : caption,
      caption: caption,
      image: selectedImg,
      bgColor: bgColor
    });

    MedSphereToast.show("Story Published!", "Your story is now live for your network to see.", "success");
    this.close();
    if (window.MedSphereRouter) window.MedSphereRouter.refreshCurrentPage();
  },

  storySetBg(colorKey, el) {
    // Update hidden input
    const bgInput = document.getElementById('story-bg-color');
    if (bgInput) bgInput.value = colorKey;

    // Update active swatch styling
    document.querySelectorAll('.story-color-swatch').forEach(s => {
      s.style.boxShadow = '';
      s.style.transform = 'scale(1)';
    });
    if (el) {
      el.style.boxShadow = '0 0 0 2px #fff, 0 0 0 4px ' + el.style.borderColor;
      el.style.transform = 'scale(1.15)';
    }

    // Visual preview on textarea wrapper
    const preview = document.getElementById('story-bg-preview');
    const textarea = document.getElementById('story-caption-input');
    if (preview && textarea) {
      const bgStyles = {
        none:     { wrapper: '', text: '#111827', bg: '#fff' },
        navy:     { wrapper: 'background:#0f172a; border-radius:10px; padding:8px;', text: '#f1f5f9', bg: 'transparent' },
        pink:     { wrapper: 'background:linear-gradient(135deg,#ec4899,#f43f5e); border-radius:10px; padding:8px;', text: '#fff', bg: 'transparent' },
        green:    { wrapper: 'background:linear-gradient(135deg,#10b981,#059669); border-radius:10px; padding:8px;', text: '#fff', bg: 'transparent' },
        lavender: { wrapper: 'background:linear-gradient(135deg,#a78bfa,#c4b5fd); border-radius:10px; padding:8px;', text: '#fff', bg: 'transparent' },
        crimson:  { wrapper: 'background:linear-gradient(135deg,#e11d48,#be123c); border-radius:10px; padding:8px;', text: '#fff', bg: 'transparent' }
      };
      const style = bgStyles[colorKey] || bgStyles.none;
      preview.setAttribute('style', 'border-radius:10px; transition:background 0.25s; padding:2px; ' + style.wrapper);
      textarea.style.color = style.text;
      textarea.style.background = style.bg;
      textarea.style.borderColor = colorKey === 'none' ? '#e5e7eb' : 'transparent';
      textarea.setAttribute('placeholder', colorKey === 'none' ? 'Share a quick update...' : 'Type your story here...');
      if (colorKey !== 'none') {
        textarea.style.caretColor = '#fff';
      } else {
        textarea.style.caretColor = '';
      }
    }
  },

  storyAddPhoto() {
    // Create hidden file input and click it
    const existing = document.getElementById('story-file-input');
    if (existing) existing.remove();
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.id = 'story-file-input';
    fileInput.style.display = 'none';
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target.result;
        const imgEl = document.getElementById('story-img-url');
        if (imgEl) imgEl.value = dataUrl;
        const wrap = document.getElementById('story-photo-preview-wrap');
        const previewImg = document.getElementById('story-photo-preview-img');
        if (wrap && previewImg) {
          previewImg.src = dataUrl;
          wrap.style.display = 'block';
        }
        // Reset bg to none since photo selected
        const bgInput = document.getElementById('story-bg-color');
        if (bgInput) bgInput.value = 'none';
      };
      reader.readAsDataURL(file);
    };
    document.body.appendChild(fileInput);
    fileInput.click();
  },

  storyRemovePhoto() {
    const wrap = document.getElementById('story-photo-preview-wrap');
    if (wrap) wrap.style.display = 'none';
    const imgEl = document.getElementById('story-img-url');
    if (imgEl) imgEl.value = '';
    const previewImg = document.getElementById('story-photo-preview-img');
    if (previewImg) previewImg.src = '';
  },

  storyAddVideo() {
    window.MedSphereToast.show('Video Coming Soon', 'Video story support is being rolled out. Use a photo for now!', 'info');
  },

  reactStory(emoji, authorName) {
    MedSphereToast.show("Reaction Sent", `You reacted ${emoji} to ${authorName}'s story.`, "success");
  },

  replyStory(authorName) {
    const input = document.getElementById("story-reply-input");
    if (!input || !input.value.trim()) return;
    input.value = "";
    MedSphereToast.show("Message Delivered", `Your clinical response was sent to ${authorName}.`, "success");
    setTimeout(() => this.close(), 600);
  },

  async submitQuoteRequest(productName, company) {
    const qty = document.getElementById("quote-qty")?.value || '1 unit';
    const org = document.getElementById("quote-org")?.value || '';
    const notes = document.getElementById("quote-notes")?.value || '';
    const user = window.MedSphereStore.getState().currentUser;

    try {
      if (window.MedSphereAPI) {
        await window.MedSphereAPI.submitInquiry({
          product_name: productName,
          company: company,
          contact_name: user.name,
          contact_email: user.contact.email,
          organization: org || user.organization,
          quantity: qty,
          notes: notes
        });
      }
    } catch (e) {
      console.warn("Could not save remote inquiry:", e);
    }

    MedSphereToast.show("Quote Request Sent", `Your procurement inquiry for ${productName} has been recorded and routed to ${company}.`, "success");
    this.close();
  },

  runMedAiQuery() {
    const input = document.getElementById('ai-query-input');
    const respText = document.getElementById('ai-response-text');
    if (!input || !respText) return;
    const q = input.value.trim().toLowerCase();

    if (q.includes('drug') || q.includes('apixaban') || q.includes('dose') || q.includes('interaction')) {
      respText.innerHTML = `<strong>Pharmacological Safety Alert:</strong> Co-administration of Apixaban (DOAC) with potent P2Y12 inhibitors increases bleeding hazard (HR 1.48). When triple therapy is clinically required post-PCI in atrial fibrillation, guidelines strongly recommend dropping aspirin after 1 to 4 weeks and maintaining DOAC + Clopidogrel 75mg daily.<br><br><em style="color:var(--slate-600); font-size:0.775rem;">Verified Citations: Circulation 2025;149:892–905 &bull; FDA Prescribing Information &bull; ESC AF DAPT Consensus.</em>`;
    } else if (q.includes('image') || q.includes('x-ray') || q.includes('ct') || q.includes('radiograph')) {
      respText.innerHTML = `<strong>Diagnostic Imaging Readout:</strong> Alveolar bilateral bat-wing infiltrates with Kerley B lines and cardiomegaly are pathognomonic for acute hydrostatic pulmonary edema secondary to left ventricular decompensation. Non-cardiogenic ARDS typically demonstrates peripheral sparing.<br><br><em style="color:var(--slate-600); font-size:0.775rem;">Verified Citations: Radiology 2026;308:e23041 &bull; ACR Appropriateness Criteria.</em>`;
    } else {
      respText.innerHTML = `<strong>ACC/AHA Clinical Consensus:</strong> Reperfusion therapy is indicated in all patients with symptoms of ischemia of &le;12 hours duration and persistent ST-segment elevation. Primary PCI remains the preferred strategy if door-to-balloon time is &lt;90 minutes.<br><br><em style="color:var(--slate-600); font-size:0.775rem;">Verified Citations: JACC 2025;83(14):1452–1478 &bull; NEJM 2026;394:821–833.</em>`;
    }
  },

  async submitVerificationForm(form) {
    const btn = form.querySelector('#submit-verif-btn');
    const license = form.querySelector('#verif-license')?.value.trim();
    const authority = form.querySelector('#verif-authority')?.value.trim();
    const docType = form.querySelector('#verif-doc-type')?.value;
    const details = form.querySelector('#verif-details')?.value.trim();
    const jurisdiction = form.querySelector('#verif-jurisdiction')?.value.trim();

    if (!license || !authority) {
      window.MedSphereToast.show('Validation Error', 'License number and issuing authority are required.', 'error');
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span class="spinner" style="display:inline-block; width:14px; height:14px; border:2px solid #fff; border-top-color:transparent; border-radius:50%; animation:spin 0.6s linear infinite; margin-right:6px; vertical-align:middle;"></span> Encrypting & Submitting...`;
    }

    try {
      if (window.MedSphereAPI) {
        await window.MedSphereAPI.submitVerification({
          license_number: license,
          issuing_authority: authority + (jurisdiction ? ` (${jurisdiction})` : ''),
          document_type: docType,
          document_details: details
        });
      }
      window.MedSphereToast.show('Credentials Submitted', 'Your license and credentials are under review by MedSphere compliance.', 'success');
      this.close();
      if (window.MedSphereRouter) window.MedSphereRouter.refreshCurrentPage();
    } catch (e) {
      window.MedSphereToast.show('Submission Error', e.message || 'Failed to submit verification.', 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<i class="fa-solid fa-shield-check" style="margin-right:6px;"></i> Submit for Verification`;
      }
    }
  },

  async submitPostJobForm(form) {
    const btn = form.querySelector('#submit-job-btn');
    const title = form.querySelector('#job-title')?.value.trim();
    const company = form.querySelector('#job-company')?.value.trim();
    const specialty = form.querySelector('#job-specialty')?.value;
    const employment_type = form.querySelector('#job-employment-type')?.value;
    const location = form.querySelector('#job-location')?.value.trim();
    const salary = form.querySelector('#job-salary')?.value.trim();
    const bonus = form.querySelector('#job-bonus')?.value.trim();
    const description = form.querySelector('#job-description')?.value.trim();
    const responsibilities = form.querySelector('#job-responsibilities')?.value.trim();
    const requirements = form.querySelector('#job-requirements')?.value.trim();

    if (!title || !company || !location || !salary) {
      window.MedSphereToast.show('Validation Error', 'Please complete all required fields.', 'error');
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span class="spinner" style="display:inline-block; width:14px; height:14px; border:2px solid #fff; border-top-color:transparent; border-radius:50%; animation:spin 0.6s linear infinite; margin-right:6px; vertical-align:middle;"></span> Publishing...`;
    }

    try {
      if (window.MedSphereAPI) {
        await window.MedSphereAPI.postJob({
          title, company, specialty, employment_type, location, salary, sign_on_bonus: bonus,
          description, responsibilities, requirements, benefits: 'Full Health, Dental, Vision & 401(k) Match'
        });
      }
      window.MedSphereToast.show('Job Posted', `${title} vacancy has been published live to the MedSphere Jobs Board!`, 'success');
      this.close();
      if (window.MedSphereRouter) window.MedSphereRouter.refreshCurrentPage();
    } catch (e) {
      window.MedSphereToast.show('Error', e.message || 'Failed to publish job vacancy.', 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<i class="fa-solid fa-paper-plane" style="margin-right:6px;"></i> Publish Job Listing`;
      }
    }
  },

  async submitAddProductForm(form) {
    const btn = form.querySelector('#submit-prod-btn');
    const name = form.querySelector('#prod-name')?.value.trim();
    const company = form.querySelector('#prod-company')?.value.trim();
    const category = form.querySelector('#prod-category')?.value;
    const badge = form.querySelector('#prod-badge')?.value.trim();
    const price = form.querySelector('#prod-price')?.value.trim();
    const unit = form.querySelector('#prod-unit')?.value.trim();
    const stock = form.querySelector('#prod-stock')?.value.trim();
    const description = form.querySelector('#prod-description')?.value.trim();
    const specs = form.querySelector('#prod-specs')?.value.trim();

    if (!name || !company || !price) {
      window.MedSphereToast.show('Validation Error', 'Product name, company, and price are required.', 'error');
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span class="spinner" style="display:inline-block; width:14px; height:14px; border:2px solid #fff; border-top-color:transparent; border-radius:50%; animation:spin 0.6s linear infinite; margin-right:6px; vertical-align:middle;"></span> Listing...`;
    }

    try {
      if (window.MedSphereAPI) {
        await window.MedSphereAPI.addSupplierProduct({
          name, company, category, badge, price, unit, stock, description, specs
        });
      }
      window.MedSphereToast.show('Product Listed', `${name} is now listed in the MedSphere Healthcare Marketplace!`, 'success');
      this.close();
      if (window.MedSphereRouter) window.MedSphereRouter.refreshCurrentPage();
    } catch (e) {
      window.MedSphereToast.show('Error', e.message || 'Failed to list product.', 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<i class="fa-solid fa-plus" style="margin-right:6px;"></i> List in Marketplace`;
      }
    }
  },

  async submitEditProfile() {
    try {
      const store = window.MedSphereStore;
      const cur = store.getState().currentUser || window.MEDSPHERE_DATA.currentUser;
      
      const fname = document.getElementById('edit-profile-fname')?.value.trim() || '';
      const lname = document.getElementById('edit-profile-lname')?.value.trim() || '';
      const fullName = (fname || lname) ? (fname + ' ' + lname).trim() : (cur.name || 'Dr Anees');

      const title = document.getElementById('edit-profile-title')?.value.trim() || cur.title || cur.specialty || '';
      const email = document.getElementById('edit-profile-email')?.value.trim() || cur.contact?.email || cur.email || '';
      const phone = document.getElementById('edit-profile-phone')?.value.trim() || cur.contact?.phone || cur.phone || '';
      const gender = document.getElementById('edit-profile-gender')?.value || cur.gender || '';
      const dob = document.getElementById('edit-profile-dob')?.value || cur.dob || '';
      const license = document.getElementById('edit-profile-license')?.value.trim() || cur.license || '';
      const organization = document.getElementById('edit-profile-org')?.value.trim() || cur.organization || '';
      const college = document.getElementById('edit-profile-college')?.value.trim() || cur.college || '';
      const city = document.getElementById('edit-profile-city')?.value.trim() || cur.city || '';
      const state = document.getElementById('edit-profile-state')?.value.trim() || cur.state || '';
      const country = document.getElementById('edit-profile-country')?.value.trim() || cur.country || 'United States';
      const address = document.getElementById('edit-profile-address')?.value.trim() || cur.contact?.office || cur.address || '';
      const languages = document.getElementById('edit-profile-languages')?.value.trim() || cur.languages || 'English, Spanish';
      const livesIn = document.getElementById('edit-profile-livesin')?.value.trim() || cur.location || '';

      const updatedLocation = [city, state].filter(Boolean).join(', ') || livesIn || cur.location;

      const updatedFields = {
        name: fullName,
        firstName: fname,
        lastName: lname,
        title: title,
        specialty: title,
        organization: organization,
        location: updatedLocation,
        city: city,
        state: state,
        country: country,
        gender: gender,
        dob: dob,
        license: license,
        college: college,
        address: address,
        languages: languages,
        contact: {
          ...(cur.contact || {}),
          email: email,
          phone: phone,
          office: address
        },
        email: email,
        phone: phone
      };

      await store.updateCurrentUser(updatedFields);
      this.close();
      window.MedSphereToast.show('Profile Updated', 'Your professional profile changes have been saved.', 'success');
      
      // Sync to backend API if available
      if (window.MedSphereAPI && window.MedSphereAPI.updateProfile) {
        window.MedSphereAPI.updateProfile(updatedFields).catch(() => {});
      }

      if (window.MedSphereRouter) {
        window.MedSphereRouter.refreshCurrentPage();
      }
    } catch (err) {
      window.MedSphereToast.show('Update Failed', err.message || 'Could not update profile.', 'error');
    }
  },

  async submitEventRegistration(eventId, title) {
    try {
      if (window.MedSphereAPI) {
        await window.MedSphereAPI.registerEvent(eventId);
      }
      window.MedSphereToast.show('Registration Confirmed', `You are registered for "${title}". Event pass generated in your notifications.`, 'success');
      this.close();
      if (window.MedSphereRouter) window.MedSphereRouter.refreshCurrentPage();
    } catch (e) {
      window.MedSphereToast.show('Registration Error', e.message || 'Could not register for event.', 'error');
    }
  },

  async saveNewExperience() {
    try {
      const role = document.getElementById('add-exp-role')?.value.trim();
      const org = document.getElementById('add-exp-org')?.value.trim();
      const type = document.getElementById('add-exp-type')?.value;
      const period = document.getElementById('add-exp-period')?.value.trim() || '2023 — Present';
      const desc = document.getElementById('add-exp-desc')?.value.trim() || '';

      if (!role || !org) {
        window.MedSphereToast.show('Missing Information', 'Please provide both role and hospital/organization name.', 'warning');
        return;
      }

      const store = window.MedSphereStore;
      const cur = store.getState().currentUser || window.MEDSPHERE_DATA.currentUser;
      const currentList = Array.isArray(cur.experience) ? [...cur.experience] : [];
      
      currentList.unshift({
        id: 'exp-' + Date.now(),
        role: role,
        organization: org + (type ? ' · ' + type : ''),
        period: period,
        description: desc
      });

      await store.updateCurrentUser({ experience: currentList });
      this.close();
      window.MedSphereToast.show('Position Added', `Added ${role} at ${org} to your profile.`, 'success');
      if (window.MedSphereRouter) window.MedSphereRouter.refreshCurrentPage();
    } catch (err) {
      window.MedSphereToast.show('Error', err.message || 'Failed to add experience.', 'error');
    }
  },

  async saveNewEducation() {
    try {
      const degree = document.getElementById('add-edu-degree')?.value.trim();
      const institution = document.getElementById('add-edu-institution')?.value.trim();
      const year = document.getElementById('add-edu-year')?.value.trim() || '2020';
      const honors = document.getElementById('add-edu-honors')?.value.trim() || '';

      if (!degree || !institution) {
        window.MedSphereToast.show('Missing Information', 'Please provide both degree and institution name.', 'warning');
        return;
      }

      const store = window.MedSphereStore;
      const cur = store.getState().currentUser || window.MEDSPHERE_DATA.currentUser;
      const currentList = Array.isArray(cur.education) ? [...cur.education] : [];

      currentList.unshift({
        id: 'edu-' + Date.now(),
        degree: degree,
        institution: institution,
        year: year.replace(/[^0-9]/g, '') || year,
        honors: honors
      });

      await store.updateCurrentUser({ education: currentList });
      this.close();
      window.MedSphereToast.show('Education Added', `Added ${degree} from ${institution}.`, 'success');
      if (window.MedSphereRouter) window.MedSphereRouter.refreshCurrentPage();
    } catch (err) {
      window.MedSphereToast.show('Error', err.message || 'Failed to add education.', 'error');
    }
  },

  async submitCreateDoctorProfile() {
    try {
      const nameInput = document.getElementById('create-prof-name');
      const titleInput = document.getElementById('create-prof-title');
      const specInput = document.getElementById('create-prof-specialty');
      const orgInput = document.getElementById('create-prof-org');
      const locInput = document.getElementById('create-prof-loc');
      const expInput = document.getElementById('create-prof-exp');
      const boardInput = document.getElementById('create-prof-board');
      const colorInput = document.getElementById('create-prof-color');
      const avatarInput = document.getElementById('create-prof-avatar');
      const bioInput = document.getElementById('create-prof-bio');

      const name = nameInput ? nameInput.value.trim() : '';
      const title = titleInput ? titleInput.value.trim() : '';
      const specialty = specInput ? specInput.value : 'General Medicine';
      const organization = orgInput ? orgInput.value.trim() : 'Independent Practice';
      const location = locInput ? locInput.value.trim() : 'Global';
      const experience = expInput ? expInput.value.trim() : '10 yrs';
      const board = boardInput ? boardInput.value.trim() : 'Board Certified Specialist';
      const monogramColor = colorInput ? colorInput.value : '#0d9488';
      const avatar = (avatarInput && avatarInput.value.trim()) ? avatarInput.value.trim() : 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80';
      const bio = bioInput ? bioInput.value.trim() : 'Dedicated clinical specialist focused on delivering evidence-based patient care.';

      if (!name) {
        window.MedSphereToast.show('Missing Name', 'Please enter your physician / clinician name.', 'warning');
        if (nameInput) nameInput.focus();
        return;
      }

      if (!title) {
        window.MedSphereToast.show('Missing Title', 'Please enter your clinical title or designation.', 'warning');
        if (titleInput) titleInput.focus();
        return;
      }

      // Compute initials monogram
      const cleanName = name.replace(/^Dr\.?\s*/i, '').trim();
      const parts = cleanName.split(/\s+/).filter(Boolean);
      let monogram = 'DR';
      if (parts.length >= 2) {
        monogram = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      } else if (parts.length === 1 && parts[0].length >= 2) {
        monogram = parts[0].substring(0, 2).toUpperCase();
      }

      // Collect availability tags
      const tags = [];
      if (document.getElementById('tag-roles')?.checked) tags.push('Open to roles');
      if (document.getElementById('tag-research')?.checked) tags.push('Open to research');
      if (document.getElementById('tag-cme')?.checked) tags.push('Speaking / CME');
      if (document.getElementById('tag-telehealth')?.checked) tags.push('Telehealth');
      if (!tags.length) tags.push('Open to roles', 'Global');
      else if (!tags.includes('Global') && tags.length < 2) tags.push('Global');

      const newId = 'prof-custom-' + Date.now();
      const newProfile = {
        id: newId,
        name: name,
        monogram: monogram,
        monogramColor: monogramColor,
        title: title,
        profession: 'Doctor',
        specialty: specialty,
        organization: organization,
        location: location,
        experience: experience.includes('yr') ? experience : (experience + ' yrs'),
        verified: true,
        rating: 5.0,
        reviewsCount: 1,
        avatar: avatar,
        bio: bio,
        tags: tags,
        joinedText: 'Joined just now',
        isNewlyCreated: true,
        stats: {
          years: parseInt(experience) || 10,
          cases: '500+',
          publications: 2,
          peerRating: '100%'
        },
        verifiedFacts: {
          identity: 'Government ID & Medical License Matched',
          specialty: specialty,
          board: board,
          affiliation: organization,
          location: location + ' · Global',
          verifiedDate: 'Today'
        },
        availableFor: ['Consultations', 'Peer Review', 'Clinical Collaboration']
      };

      // Add to persistent store
      if (window.MedSphereStore && window.MedSphereStore.addCreatedProfile) {
        window.MedSphereStore.addCreatedProfile(newProfile);
      }

      this.close();
      window.MedSphereToast.show('Profile Published!', `${name} is now live in the verified doctor directory.`, 'success');

      // Update directory state
      if (window.MedSphereDirectory) {
        window.MedSphereDirectory.activeSpecialty = 'all';
        window.MedSphereDirectory.activeSearchQuery = '';
        window.MedSphereDirectory.activeSpotlightId = newId;
        if (window.MedSphereDirectory.updateGridAndMeta) {
          window.MedSphereDirectory.updateGridAndMeta();
        }
        if (window.MedSphereDirectory.spotlightDoctor) {
          window.MedSphereDirectory.spotlightDoctor(newId);
        }
        // Reload backend profiles so newly registered accounts appear automatically
        if (window.MedSphereDirectory.loadRealProfiles) {
          window.MedSphereDirectory._profilesLoading = false; // reset lock
          window.MedSphereDirectory.loadRealProfiles();
        }
      }

      // Check current route: if not on #network, switch to it, or refresh
      if (window.location.hash !== '#network') {
        window.location.hash = '#network';
      } else if (window.MedSphereRouter && window.MedSphereRouter.refreshCurrentPage) {
        window.MedSphereRouter.refreshCurrentPage();
      }

      // Smooth scroll to the results grid
      setTimeout(() => {
        const grid = document.getElementById('network-doctors-grid') || document.getElementById('network-browse');
        if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 250);

    } catch (err) {
      console.error('Error submitting doctor profile:', err);
      window.MedSphereToast.show('Error', err.message || 'Failed to publish doctor profile.', 'error');
    }
  }
};


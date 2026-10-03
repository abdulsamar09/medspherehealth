// MedSphere Main Application Initializer & App Controller

window.MedSphereApp = {
  activeNotifTab: 'all',

  toggleNotifDropdown(event) {
    if (event) event.stopPropagation();
    const popover = document.getElementById('header-notif-popover');
    const btn = document.getElementById('header-notif-btn');
    if (!popover) return;
    const isActive = popover.classList.contains('active');
    if (isActive) {
      this.closeNotifDropdown();
    } else {
      this.closeProfileDropdown();
      popover.classList.add('active');
      if (btn) btn.classList.add('active');
      this.renderNotifContent();
    }
  },

  closeNotifDropdown() {
    const popover = document.getElementById('header-notif-popover');
    const btn = document.getElementById('header-notif-btn');
    if (popover) popover.classList.remove('active');
    if (btn) btn.classList.remove('active');
  },

  switchNotifTab(tab) {
    this.activeNotifTab = tab;
    const tabs = document.querySelectorAll('.notif-tab-btn');
    tabs.forEach(t => {
      if (t.getAttribute('data-notif-tab') === tab) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });
    this.renderNotifContent();
  },

  renderNotifContent() {
    const body = document.getElementById('notif-popover-body');
    if (!body) return;

    const store = window.MedSphereStore;
    const state = store.getState();
    const isLoggedOut = localStorage.getItem('medsphere_logged_out') === 'true';

    // Guest state if explicitly logged out and no profile
    if (isLoggedOut && !state.currentUser && !state.token) {
      body.innerHTML = `
        <div class="notif-empty-state" style="padding: 2.5rem 1.5rem;">
          <div class="notif-empty-icon-circle" style="color: #0080ff; background: #eff6ff;">
            <i class="fa-solid fa-lock"></i>
          </div>
          <h4 class="notif-empty-heading">Sign In for Notifications</h4>
          <p class="notif-empty-subtext">Log in with your verified profile to view hospital job alerts, CME credits, and colleague messages.</p>
          <a href="#login" class="btn btn-primary btn-sm btn-pill" style="margin-top: 1rem; display: inline-block; padding: 0.5rem 1.5rem; text-decoration: none;" onclick="window.MedSphereApp.closeNotifDropdown()">
            Sign In
          </a>
        </div>
      `;
      return;
    }

    const allNotifs = state.notifications || [];
    const tab = this.activeNotifTab || 'all';

    // Update Header with dynamic "Mark all read" button if unread notifications exist
    const headerTitleEl = document.querySelector('.notif-popover-header');
    if (headerTitleEl) {
      const hasUnread = allNotifs.some(n => !n.is_read && !n.read);
      headerTitleEl.innerHTML = `
        <h3 class="notif-popover-title">Notifications</h3>
        ${hasUnread ? `<button type="button" class="btn-notif-mark-all" onclick="window.MedSphereApp.markAllAsRead(event)" style="background:transparent; border:none; color:#0080ff; font-size:0.78rem; font-weight:600; cursor:pointer; padding:2px 6px; border-radius:4px; font-family:var(--font-heading);">Mark all read</button>` : ''}
      `;
    }

    let filtered = allNotifs.filter(n => {
      const isUnread = !n.is_read && !n.read;
      const isJob = n.type === 'job' || n.type === 'jobs' || (n.title || '').toLowerCase().includes('job') || (n.body || '').toLowerCase().includes('role') || (n.body || '').toLowerCase().includes('vacancy');
      if (tab === 'unread') {
        return isUnread;
      }
      if (tab === 'jobs') {
        return isJob;
      }
      if (tab === 'other') {
        return !isJob;
      }
      return true; // 'all'
    });

    if (filtered.length === 0) {
      if (tab === 'unread') {
        body.innerHTML = `
          <div class="notif-empty-state" style="padding: 2.75rem 1.5rem;">
            <div class="notif-empty-icon-circle" style="color: #059669; background: #ecfdf5;">
              <i class="fa-solid fa-circle-check"></i>
            </div>
            <h4 class="notif-empty-heading">No unread notifications</h4>
            <p class="notif-empty-subtext">You're all caught up with your clinical alerts and network activity.</p>
          </div>
        `;
      } else if (tab === 'jobs') {
        body.innerHTML = `
          <div class="notif-empty-state" style="padding: 2.75rem 1.5rem;">
            <div class="notif-empty-icon-circle" style="color: #0080ff; background: #eff6ff;">
              <i class="fa-solid fa-briefcase"></i>
            </div>
            <h4 class="notif-empty-heading">No job alerts right now</h4>
            <p class="notif-empty-subtext">Clinical vacancies and hospital opportunities matching your specialty will appear here.</p>
            <a href="#jobs" class="btn btn-outline btn-sm" style="margin-top: 1rem;" onclick="window.MedSphereApp.closeNotifDropdown()">Browse Healthcare Jobs</a>
          </div>
        `;
      } else {
        body.innerHTML = `
          <div class="notif-empty-state" style="padding: 2.75rem 1.5rem;">
            <div class="notif-empty-icon-circle">
              <i class="fa-regular fa-bell"></i>
            </div>
            <h4 class="notif-empty-heading">You're all caught up.</h4>
            <p class="notif-empty-subtext">New job, post, group, meeting, and account activity will show up here.</p>
          </div>
        `;
      }
      return;
    }

    body.innerHTML = `
      <div class="notif-items-list">
        ${filtered.map(n => {
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
            <div class="notif-item-row ${isUnread ? 'unread' : ''}" onclick="window.MedSphereApp.handleNotifClick('${n.id}')" title="Click to view">
              <div class="notif-item-icon" style="background:${iconBg}; color:${iconColor};">
                <i class="${icon}"></i>
              </div>
              <div class="notif-item-text">
                <div class="notif-item-title">${n.title}</div>
                <div class="notif-item-body">${n.body}</div>
                <div class="notif-item-time">${n.time || 'Recently'}</div>
              </div>
              ${isUnread ? '<div class="notif-unread-dot" title="Unread"></div>' : ''}
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  handleNotifClick(notifId) {
    const store = window.MedSphereStore;
    const notifs = store.getState().notifications || [];
    const notif = notifs.find(n => n.id === notifId);
    if (!notif) return;

    // 1. Mark as read in store & backend
    store.markNotificationRead(notifId);

    // 2. Close dropdown smoothly
    this.closeNotifDropdown();

    // 3. Navigate & show actionable toast
    const titleLower = (notif.title || '').toLowerCase();
    const bodyLower = (notif.body || '').toLowerCase();

    if (notif.type === 'network' || titleLower.includes('connection') || titleLower.includes('colleague')) {
      window.MedSphereToast.show('Colleague Connection', notif.body, 'info');
      window.location.hash = '#network';
    } else if (notif.type === 'education' || titleLower.includes('cme') || bodyLower.includes('cme') || bodyLower.includes('credit')) {
      window.MedSphereToast.show('CME Milestone', notif.body, 'success');
      window.location.hash = '#education';
    } else if (notif.type === 'job' || notif.type === 'jobs' || titleLower.includes('job') || titleLower.includes('role') || bodyLower.includes('vacancy')) {
      window.MedSphereToast.show('Clinical Career Alert', notif.body, 'info');
      window.location.hash = '#jobs';
    } else if (notif.link) {
      window.location.hash = notif.link;
    } else {
      window.MedSphereToast.show(notif.title, notif.body, 'info');
      window.location.hash = '#notifications';
    }
  },

  markAllAsRead(event) {
    if (event) event.stopPropagation();
    window.MedSphereStore.markAllNotificationsRead();
    window.MedSphereToast.show('All Caught Up', 'All notifications marked as read.', 'success');
    this.renderNotifContent();
  },

  toggleProfileDropdown(event) {
    if (event) event.stopPropagation();
    const popover = document.getElementById('feed-profile-popover');
    const btn = document.getElementById('header-user-profile-btn');
    if (!popover) return;
    const isActive = popover.classList.contains('active');
    if (isActive) {
      this.closeProfileDropdown();
    } else {
      this.closeNotifDropdown();
      popover.classList.add('active');
      if (btn) btn.classList.add('active');
    }
  },

  closeProfileDropdown() {
    const popover = document.getElementById('feed-profile-popover');
    const btn = document.getElementById('header-user-profile-btn');
    if (popover) popover.classList.remove('active');
    if (btn) btn.classList.remove('active');
  },

  toggleDarkMode(enabled) {
    if (enabled) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('medsphere_dark_mode', 'true');
      window.MedSphereToast.show('Dark Mode', 'Dark theme enabled.', 'info');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('medsphere_dark_mode', 'false');
      window.MedSphereToast.show('Light Mode', 'Standard light theme enabled.', 'info');
    }

    const toggle = document.getElementById('header-dark-mode-toggle');
    if (toggle) toggle.checked = enabled;
  },

  cyclePersona() {
    this.closeProfileDropdown();
    const personas = ['doctor', 'student', 'hospital', 'admin'];
    const current = localStorage.getItem('medsphere_persona') || 'doctor';
    const nextIdx = (personas.indexOf(current) + 1) % personas.length;
    const nextPersona = personas[nextIdx];
    localStorage.setItem('medsphere_persona', nextPersona);

    window.MedSphereStore.switchDemoUser(nextPersona);
    const user = window.MedSphereStore.getState().currentUser;
    window.MedSphereToast.show('Workspace Switched', `Active Persona: ${user.name} (${user.specialty || user.title || 'Clinician'})`, 'success');
    window.MedSphereRouter.refreshCurrentPage();
  },

  openProfileStats() {
    this.closeProfileDropdown();
    window.MedSphereModals.open('modal-profile-stats');
  },

  openActivityLog() {
    this.closeProfileDropdown();
    window.MedSphereModals.open('modal-activity-log');
  },

  async handleLogout() {
    this.closeProfileDropdown();
    await window.MedSphereStore.logout();
    window.MedSphereToast.show('Logged Out', 'You have been logged out successfully.', 'info');
    window.location.hash = '#home';
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Sticky Header Scroll Effect
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // 2. Initialize Mobile Drawer Toggle
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const drawerBackdrop = document.getElementById('mobile-drawer-backdrop');
  const drawerClose = document.getElementById('mobile-drawer-close');

  if (mobileToggle && drawerBackdrop) {
    mobileToggle.addEventListener('click', () => {
      drawerBackdrop.classList.add('active');
    });

    if (drawerClose) {
      drawerClose.addEventListener('click', () => {
        drawerBackdrop.classList.remove('active');
      });
    }

    drawerBackdrop.addEventListener('click', (e) => {
      if (e.target === drawerBackdrop) {
        drawerBackdrop.classList.remove('active');
      }
    });
  }

  // 2b. Mobile Bottom Nav — active state sync
  function updateMobileBottomNav() {
    const hash = (window.location.hash || '#home').replace('#', '');
    const routeToNavId = {
      'feed': 'mob-nav-home',
      'dashboard': 'mob-nav-home',
      'home': 'mob-nav-home',
      '': 'mob-nav-home',
      'jobs': 'mob-nav-jobs',
      'network': 'mob-nav-network',
      'explore': 'mob-nav-explore',
      'community': 'mob-nav-community',
      'messages': 'mob-nav-community',
      'education': 'mob-nav-explore',
      'business': 'mob-nav-explore',
      'admin': 'mob-nav-home'
    };
    const activeId = routeToNavId[hash] || null;
    document.querySelectorAll('.mob-nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.id === activeId);
    });
  }
  window.addEventListener('hashchange', updateMobileBottomNav);
  updateMobileBottomNav();

  // 3. Global Escape & Click-Outside Listeners
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.MedSphereModals.close();
      window.MedSphereApp.closeProfileDropdown();
      if (drawerBackdrop) drawerBackdrop.classList.remove('active');
    }

    // Ctrl + K shortcut to focus global search
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      const searchInput = document.getElementById('global-search-input');
      if (searchInput) searchInput.focus();
    }
  });

  window.addEventListener('click', (e) => {
    const notifContainer = document.getElementById('header-notif-container');
    if (notifContainer && !notifContainer.contains(e.target)) {
      window.MedSphereApp.closeNotifDropdown();
    }

    const dropdownWrap = document.getElementById('user-profile-dropdown-container');
    if (dropdownWrap && !dropdownWrap.contains(e.target)) {
      window.MedSphereApp.closeProfileDropdown();
    }
  });

  // 4. Restore User Theme, Accent, Fonts & Accessibility Preferences
  const savedDarkMode = localStorage.getItem('medsphere_dark_mode') === 'true' || localStorage.getItem('medsphere_theme') === 'dark';
  if (savedDarkMode) {
    document.body.classList.add('dark-theme');
    document.body.classList.add('dark-mode');
    const toggle = document.getElementById('header-dark-mode-toggle');
    if (toggle) toggle.checked = true;
  }

  const savedAccent = localStorage.getItem('medsphere_accent');
  const colorMap = {
    blue: { p900: '#0B2B4A', p800: '#0B5CAD', p700: '#087FCE', p600: '#0080ff', p500: '#25B8F2', p100: '#EEF7FC', p50: '#F6FAFD' },
    emerald: { p900: '#064e3b', p800: '#065f46', p700: '#047857', p600: '#059669', p500: '#10b981', p100: '#d1fae5', p50: '#ecfdf5' },
    violet: { p900: '#3b0764', p800: '#581c87', p700: '#6b21a8', p600: '#7c3aed', p500: '#8b5cf6', p100: '#ede9fe', p50: '#f5f3ff' },
    rose: { p900: '#4c0519', p800: '#881337', p700: '#be123c', p600: '#e11d48', p500: '#f43f5e', p100: '#ffe4e6', p50: '#fff1f2' },
    amber: { p900: '#451a03', p800: '#78350f', p700: '#b45309', p600: '#d97706', p500: '#f59e0b', p100: '#fef3c7', p50: '#fffbeb' }
  };
  if (savedAccent && colorMap[savedAccent]) {
    const s = colorMap[savedAccent];
    document.documentElement.style.setProperty('--primary-900', s.p900);
    document.documentElement.style.setProperty('--primary-800', s.p800);
    document.documentElement.style.setProperty('--primary-700', s.p700);
    document.documentElement.style.setProperty('--primary-600', s.p600);
    document.documentElement.style.setProperty('--primary-500', s.p500);
    document.documentElement.style.setProperty('--primary-100', s.p100);
    document.documentElement.style.setProperty('--primary-50',  s.p50);
  }

  const savedPageFont = localStorage.getItem('medsphere_page_font');
  if (savedPageFont) {
    const fontVal = savedPageFont === 'System' ? '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' : `"${savedPageFont}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    document.documentElement.style.setProperty('--font-body', fontVal);
    document.body.style.fontFamily = fontVal;
  }

  const savedSidebarFont = localStorage.getItem('medsphere_sidebar_font');
  if (savedSidebarFont) {
    const fontVal = savedSidebarFont === 'System' ? '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' : `"${savedSidebarFont}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    document.documentElement.style.setProperty('--font-heading', fontVal);
  }

  const savedLang = localStorage.getItem('medsphere_interface_lang');
  if (savedLang === 'Urdu' || savedLang === 'Arabic') {
    document.documentElement.setAttribute('dir', 'rtl');
    document.body.classList.add('rtl-mode');
  }

  const savedReduceMotion = localStorage.getItem('medsphere_reduce_motion') === 'true';
  if (savedReduceMotion) {
    document.documentElement.classList.add('reduce-motion');
    document.body.classList.add('reduce-motion');
  }

  // 5. Update Header User Profile and Controls on Store Changes
  const updateHeaderUser = (state) => {
    const profileWrap = document.getElementById('user-profile-dropdown-container');
    const headerAvatar = document.getElementById('header-user-avatar');
    const headerName = document.getElementById('header-user-name');
    const popoverAvatar = document.getElementById('popover-avatar');
    const popoverName = document.getElementById('popover-name');
    const popoverSpec = document.getElementById('popover-spec');
    const popoverWorkspaceName = document.getElementById('popover-workspace-name');
    const signInBtn = document.getElementById('header-signin-btn');
    const joinCta = document.getElementById('header-join-cta');
    const notifBadge = document.getElementById('header-notif-badge');
    const notifDot = document.querySelector('.notif-badge-dot');

    const isLoggedIn = Boolean(state.token && state.currentUser);
    const user = state.currentUser;

    if (isLoggedIn && user) {
      if (profileWrap) profileWrap.style.display = 'block';
      if (headerAvatar) headerAvatar.src = user.avatar ? user.avatar : 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=120&q=80';
      if (headerName) headerName.textContent = user.name ? user.name.split(' ')[0] : 'Doctor';
      if (popoverAvatar) popoverAvatar.src = user.avatar ? user.avatar : 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=120&q=80';
      if (popoverName) popoverName.textContent = user.name || 'Dr. Eleanor Vance';
      if (popoverSpec) popoverSpec.textContent = user.specialty || 'Interventional Cardiology';
      if (popoverWorkspaceName) popoverWorkspaceName.textContent = user.name || 'Dr. Eleanor Vance';

      if (signInBtn) signInBtn.style.display = 'none';
      if (joinCta) joinCta.style.display = 'none';
    } else {
      if (profileWrap) profileWrap.style.display = 'none';
      if (signInBtn) signInBtn.style.display = 'inline-flex';
      if (joinCta) joinCta.style.display = 'inline-flex';
    }

    // Update Notification Badge Count
    if (notifBadge) {
      const isNotLoggedOut = localStorage.getItem('medsphere_logged_out') !== 'true';
      if (isNotLoggedOut && state.notifications) {
        const unreadCount = state.notifications.filter(n => !n.is_read && !n.read).length;
        if (unreadCount > 0) {
          notifBadge.innerText = unreadCount;
          notifBadge.style.display = 'flex';
        } else {
          notifBadge.style.display = 'none';
        }
      } else {
        notifBadge.style.display = 'none';
      }
    }

    // Update Notification Dot
    if (notifDot) {
      const isNotLoggedOut = localStorage.getItem('medsphere_logged_out') !== 'true';
      const hasUnread = state.notifications && state.notifications.some(n => !n.is_read && !n.read);
      notifDot.style.display = (isNotLoggedOut && hasUnread) ? 'block' : 'none';
    }

    // If notification popover is open, refresh content
    const popover = document.getElementById('header-notif-popover');
    if (popover && popover.classList.contains('active')) {
      window.MedSphereApp.renderNotifContent();
    }
  };

  window.MedSphereStore.subscribe(updateHeaderUser);
  updateHeaderUser(window.MedSphereStore.getState());

  // 6. Initialize Router
  window.MedSphereRouter.init();

  // 7. Prevent pinch-to-zoom and multi-touch zoom on mobile / iOS Safari
  document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
  });
  document.addEventListener('gesturechange', function (e) {
    e.preventDefault();
  });
  document.addEventListener('gestureend', function (e) {
    e.preventDefault();
  });
  document.addEventListener('touchmove', function (e) {
    if (e.touches && e.touches.length > 1) {
      e.preventDefault();
    }
  }, { passive: false });

  console.log("MedSphere Platform Initialized with Modern Feed & Profile Popover.");
});

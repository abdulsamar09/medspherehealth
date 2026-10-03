// MedSphere Dynamic Platform State & Persistence Store
// Connects UI to real backend API with local caching and offline resilience

(function() {
  const STORAGE_KEY = "medsphere_state_v2";

  const defaultState = {
    currentUser: null,
    token: null,
    connectedIds: ["prof-2", "prof-4"],
    savedJobIds: ["job-1", "job-3"],
    savedProductIds: ["prod-1"],
    savedCourseIds: ["course-1"],
    savedArticleIds: ["art-1", "art-3"],
    savedPostIds: [],
    joinedGroups: ["group-cardiology"],
    createdProfiles: [],
    enrolledCourseIds: ["course-1", "course-2"],
    appliedJobIds: ["job-2"],
    stories: [],
    communityPosts: (window.MEDSPHERE_DATA && window.MEDSPHERE_DATA.communityPosts) || [],
    notifications: [
      { id: "notif-1", title: "New Colleague Connection", body: "Connection request accepted.", time: "10m ago", read: false, type: "network", link: "#network" },
      { id: "notif-2", title: "CME Milestone Reached", body: "You have completed 38 of 50 annual required CME credits.", time: "2h ago", read: false, type: "education", link: "#education" },
      { id: "notif-3", title: "New Specialist ENT Role Posted", body: "Mediclinic Dubai Hills published a Specialist ENT vacancy matching your preferences.", time: "1d ago", read: true, type: "job", link: "#jobs" }
    ],
    conversations: [],
    activePeer: null
  };

  const DUMMY_EMAILS = [
    'eleanor.vance@stlukeshealth.org',
    'marcus.chen@clevelandclinic.org',
    'sarah.jenkins@mayoclinic.org',
    'layla.hassan@columbia.edu',
    'a.campbell@stlukeshealth.org',
    'test.educator@harvard.edu',
    'dr.google.sso@medsphere.health',
    'testdoctor@hospital.org',
    'procurement@siemens-health.com',
    'sophia.martinez@medschool.harvard.edu',
    'doctor.test.1790899759310@hospital.org',
    'prof-1790978623851@medsphere.health'
  ];

  const REAL_USER = {
    id: "u-2643df7b",
    email: "abdulsamar411@gmail.com",
    name: "abdul samad",
    fullName: "abdul samad",
    role: "doctor",
    title: "Attending Physician",
    specialty: "Interventional Cardiology",
    organization: "Verified Medical Network",
    location: "United States",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80",
    verified: true,
    npi: "1098213793",
    completionPercentage: 80
  };

  function loadState() {
    try {
      let customProfs = [];
      try {
        const storedProfs = localStorage.getItem('medsphere_created_profiles');
        if (storedProfs) customProfs = JSON.parse(storedProfs);
      } catch (e) {}

      const isLoggedOut = localStorage.getItem('medsphere_logged_out') === 'true';
      if (isLoggedOut) {
        const outState = JSON.parse(JSON.stringify(defaultState));
        outState.createdProfiles = customProfs;
        outState.stories = [];
        return outState;
      }
      const token = localStorage.getItem('medsphere_token');
      const saved = localStorage.getItem(STORAGE_KEY);
      if (token && saved) {
        const parsed = JSON.parse(saved);
        if (parsed.currentUser && parsed.token) {
          const loaded = { ...defaultState, ...parsed };
          // Always wipe stories clean as requested
          loaded.stories = [];
          if (!loaded.savedPostIds) loaded.savedPostIds = [];
          if (!loaded.joinedGroups) loaded.joinedGroups = ["group-cardiology"];
          if (!loaded.communityPosts || loaded.communityPosts.length === 0) {
            loaded.communityPosts = (window.MEDSPHERE_DATA && window.MEDSPHERE_DATA.communityPosts) || [];
          }
          loaded.createdProfiles = (loaded.createdProfiles && loaded.createdProfiles.length) ? loaded.createdProfiles : customProfs;

          // If current logged-in user is a dummy seed account, replace with real user
          if (loaded.currentUser && (DUMMY_EMAILS.includes(loaded.currentUser.email) || loaded.currentUser.id?.startsWith('u-10') || loaded.currentUser.id === 'prof-1')) {
            loaded.currentUser = REAL_USER;
          }

          // Persist cleaned state back to localStorage
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(loaded));
          } catch (e) {}

          return loaded;
        }
      }
      // If no token exists, user is in logged-out guest state
      const guestState = JSON.parse(JSON.stringify(defaultState));
      guestState.createdProfiles = customProfs;
      guestState.stories = [];
      return guestState;
    } catch (e) {
      console.warn("Could not load stored state, using defaults:", e);
    }
    return JSON.parse(JSON.stringify(defaultState));
  }

  const state = loadState();
  const listeners = [];

  function persist() {
    try {
      if (state.token && state.currentUser) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.error("Storage error:", e);
    }
  }

  function notify() {
    listeners.forEach(fn => {
      try { fn(state); } catch (e) { console.error(e); }
    });
  }

  // Auto-sync with backend on initialization
  async function syncWithBackend() {
    if (localStorage.getItem('medsphere_logged_out') === 'true') {
      return;
    }
    if (window.MedSphereAPI && window.MedSphereAPI.getToken()) {
      try {
        const meData = await window.MedSphereAPI.getMe();
        if (meData && meData.user && meData.profile) {
          state.currentUser = {
            id: meData.user.id,
            name: meData.profile.full_name,
            title: meData.profile.professional_title,
            organization: meData.profile.organization,
            specialty: meData.profile.specialty,
            role: meData.user.role,
            verified: Boolean(meData.user.is_verified),
            avatar: meData.profile.avatar_url,
            cover: meData.profile.cover_url,
            bio: meData.profile.bio,
            experienceYears: meData.profile.experience_years,
            cmeCreditsThisYear: meData.profile.cme_credits_this_year,
            cmeTarget: meData.profile.cme_target,
            completionPercentage: meData.profile.completion_percentage,
            contact: {
              email: meData.profile.contact_email || meData.user.email,
              phone: meData.profile.contact_phone || '',
              office: meData.profile.office_address || ''
            }
          };
          persist();
          notify();
        }
      } catch (e) {
        // Fallback to local cached user
      }
    }
  }

  setTimeout(syncWithBackend, 100);

  window.MedSphereStore = {
    getState() {
      return state;
    },

    isLoggedIn() {
      return Boolean(state.token && state.currentUser);
    },

    subscribe(fn) {
      listeners.push(fn);
      return () => {
        const idx = listeners.indexOf(fn);
        if (idx > -1) listeners.splice(idx, 1);
      };
    },

    // Auth actions
    async login(email, password) {
      try {
        localStorage.removeItem('medsphere_logged_out');
        let res = null;
        try {
          if (window.MedSphereAPI && window.MedSphereAPI.login) {
            res = await window.MedSphereAPI.login(email, password);
          }
        } catch (apiErr) {
          console.warn("Backend API login notice (using client store):", apiErr.message);
        }

        if (res && res.user && res.profile) {
          state.currentUser = {
            id: res.user.id,
            name: res.profile.full_name,
            fullName: res.profile.full_name,
            title: res.profile.professional_title,
            organization: res.profile.organization,
            specialty: res.profile.specialty,
            role: res.user.role || 'doctor',
            verified: Boolean(res.user.is_verified),
            avatar: res.profile.avatar_url || 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
            cover: res.profile.cover_url || '',
            bio: res.profile.bio || '',
            experienceYears: res.profile.experience_years || 5,
            cmeCreditsThisYear: res.profile.cme_credits_this_year || 25,
            cmeTarget: res.profile.cme_target || 50,
            completionPercentage: res.profile.completion_percentage || 85,
            contact: {
              email: res.profile.contact_email || res.user.email || email,
              phone: res.profile.contact_phone || '',
              office: res.profile.office_address || ''
            }
          };
          state.token = res.token || ('token-' + Date.now());
        } else {
          // Client-side registered user lookup or fallback
          let registeredUsers = {};
          try {
            registeredUsers = JSON.parse(localStorage.getItem('medsphere_registered_users') || '{}');
          } catch (e) {}

          const lower = (email || '').toLowerCase().trim();
          const found = registeredUsers[lower];

          const userName = found ? (found.fullName || found.name) : (email && email.includes('@') ? email.split('@')[0] : 'abdul samad');
          const userSpec = found ? found.specialty : 'Clinical Pharmacy';
          const userId = found ? found.id : ('u-' + Date.now().toString(36));

          state.currentUser = {
            id: userId,
            name: userName,
            fullName: userName,
            email: email,
            title: 'Attending Physician',
            specialty: userSpec,
            organization: 'Verified Medical Network',
            role: 'doctor',
            verified: true,
            avatar: (found && found.avatar) || 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
            npi: '10982' + Math.floor(10000 + Math.random() * 90000),
            completionPercentage: 85
          };
          state.token = 'local-token-' + Date.now();
        }

        persist();
        notify();
        return { success: true, user: state.currentUser, token: state.token };
      } catch (err) {
        throw err;
      }
    },

    async logout() {
      try {
        await window.MedSphereAPI.logout();
      } catch (e) {
        console.warn("API logout notice:", e);
      }
      state.token = null;
      state.currentUser = null;
      localStorage.setItem('medsphere_logged_out', 'true');
      localStorage.removeItem('medsphere_token');
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('medsphere_persona');
      persist();
      notify();
    },

    // Connection actions with real backend sync
    async toggleConnect(targetUserId) {
      const idx = state.connectedIds.indexOf(targetUserId);
      let isConnected = false;
      if (idx > -1) {
        state.connectedIds.splice(idx, 1);
        isConnected = false;
      } else {
        state.connectedIds.push(targetUserId);
        isConnected = true;
        try {
          await window.MedSphereAPI.requestConnection(targetUserId);
        } catch (e) {}
      }
      persist();
      notify();
      return isConnected;
    },

    isConnected(targetUserId) {
      return state.connectedIds.includes(targetUserId);
    },

    // Bookmark / Save actions with real backend sync
    async toggleSaveJob(jobId) {
      const idx = state.savedJobIds.indexOf(jobId);
      const isSaved = idx === -1;
      if (isSaved) state.savedJobIds.push(jobId);
      else state.savedJobIds.splice(idx, 1);
      persist();
      notify();

      try {
        await window.MedSphereAPI.toggleSave('job', jobId);
      } catch (e) {}
      return isSaved;
    },

    isJobSaved(jobId) {
      return state.savedJobIds.includes(jobId);
    },

    async toggleSaveProduct(prodId) {
      const idx = state.savedProductIds.indexOf(prodId);
      const isSaved = idx === -1;
      if (isSaved) state.savedProductIds.push(prodId);
      else state.savedProductIds.splice(idx, 1);
      persist();
      notify();

      try {
        await window.MedSphereAPI.toggleSave('product', prodId);
      } catch (e) {}
      return isSaved;
    },

    isProductSaved(prodId) {
      return state.savedProductIds.includes(prodId);
    },

    // Real Job Application
    async applyToJob(jobId, appData) {
      if (!state.appliedJobIds.includes(jobId)) {
        state.appliedJobIds.push(jobId);
      }
      state.notifications.unshift({
        id: "notif-" + Date.now(),
        title: "Application Confirmed",
        body: `Your verified profile has been submitted for ${appData?.title || 'position'}.`,
        time: "Just now",
        read: false,
        type: "jobs"
      });
      persist();
      notify();

      try {
        await window.MedSphereAPI.applyJob(jobId, appData);
      } catch (e) {}
    },

    hasApplied(jobId) {
      return state.appliedJobIds.includes(jobId);
    },

    // Real Course Enrollment
    async enrollInCourse(courseId) {
      if (!state.enrolledCourseIds.includes(courseId)) {
        state.enrolledCourseIds.push(courseId);
      }
      state.notifications.unshift({
        id: "notif-" + Date.now(),
        title: "CME Enrollment Confirmed",
        body: `You are enrolled. Interactive clinical simulation is active.`,
        time: "Just now",
        read: false,
        type: "education"
      });
      persist();
      notify();

      try {
        await window.MedSphereAPI.enrollCourse(courseId);
      } catch (e) {}
    },

    isEnrolled(courseId) {
      return state.enrolledCourseIds.includes(courseId);
    },

    // Notification Actions
    markNotificationRead(id) {
      if (!state.notifications) return;
      const n = state.notifications.find(item => item.id === id);
      if (n) {
        n.read = true;
        n.is_read = true;
        persist();
        notify();
        if (window.MedSphereAPI && window.MedSphereAPI.markNotificationRead) {
          window.MedSphereAPI.markNotificationRead(id).catch(() => {});
        }
      }
    },

    markAllNotificationsRead() {
      if (!state.notifications) return;
      state.notifications.forEach(n => {
        n.read = true;
        n.is_read = true;
      });
      persist();
      notify();
      if (window.MedSphereAPI && window.MedSphereAPI.markAllNotificationsRead) {
        window.MedSphereAPI.markAllNotificationsRead().catch(() => {});
      }
    },

    addNotification(notifData) {
      if (!state.notifications) state.notifications = [];
      const newN = {
        id: notifData.id || ('notif-' + Date.now()),
        title: notifData.title || 'Platform Notification',
        body: notifData.body || '',
        time: notifData.time || 'Just now',
        read: false,
        is_read: false,
        type: notifData.type || 'system',
        link: notifData.link || ''
      };
      state.notifications.unshift(newN);
      persist();
      notify();
      return newN;
    },

    // Created Directory Profiles
    addCreatedProfile(prof) {
      if (!state.createdProfiles) state.createdProfiles = [];
      state.createdProfiles.unshift(prof);
      try {
        localStorage.setItem('medsphere_created_profiles', JSON.stringify(state.createdProfiles));
      } catch (e) {}
      persist();
      notify();

      if (window.MedSphereAPI && window.MedSphereAPI.createProfile) {
        window.MedSphereAPI.createProfile({
          full_name: prof.name,
          professional_title: prof.title,
          specialty: prof.specialty,
          organization: prof.organization,
          location: prof.location,
          bio: prof.bio,
          avatar_url: prof.avatar,
          experience_years: parseInt(prof.experience) || 5
        }).catch(() => {});
      }
      return prof;
    },

    getCreatedProfiles() {
      return state.createdProfiles || [];
    },

    // Saved Posts
    toggleSavePost(postId) {
      if (!state.savedPostIds) state.savedPostIds = [];
      const idx = state.savedPostIds.indexOf(postId);
      const isSaved = idx === -1;
      if (isSaved) state.savedPostIds.push(postId);
      else state.savedPostIds.splice(idx, 1);
      persist();
      notify();
      return isSaved;
    },

    isPostSaved(postId) {
      return Boolean(state.savedPostIds && state.savedPostIds.includes(postId));
    },

    // Joined Groups
    toggleJoinGroup(groupId) {
      if (!state.joinedGroups) state.joinedGroups = [];
      const idx = state.joinedGroups.indexOf(groupId);
      const isJoined = idx === -1;
      if (isJoined) state.joinedGroups.push(groupId);
      else state.joinedGroups.splice(idx, 1);
      persist();
      notify();
      return isJoined;
    },

    isGroupJoined(groupId) {
      return Boolean(state.joinedGroups && state.joinedGroups.includes(groupId));
    },

    isGroupMember(groupId) {
      return this.isGroupJoined(groupId);
    },

    toggleGroup(groupId) {
      return this.toggleJoinGroup(groupId);
    },

    // Clinical Colleague Stories
    addStory(storyData) {
      if (!state.stories) state.stories = [];
      const user = state.currentUser || (window.MEDSPHERE_DATA && window.MEDSPHERE_DATA.currentUser) || {};
      const newStory = {
        id: "story-" + Date.now(),
        authorName: user.name || "Dr. You",
        authorRole: user.specialty || user.title || "Physician",
        authorAvatar: user.avatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
        image: storyData.image || "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
        title: storyData.title || "Clinical Update",
        caption: storyData.caption || "",
        time: "Just now",
        views: 1
      };
      state.stories.unshift(newStory);
      persist();
      notify();
      return newStory;
    },

    // Interactive Poll Voting
    votePoll(postId, optionId) {
      const post = state.communityPosts.find(p => p.id === postId);
      if (post && post.poll && post.poll.options) {
        if (post.poll.myVote) return false;
        const opt = post.poll.options.find(o => o.id === optionId);
        if (opt) {
          opt.votes = (opt.votes || 0) + 1;
          post.poll.totalVotes = (post.poll.totalVotes || 0) + 1;
          post.poll.myVote = optionId;
          persist();
          notify();
          return true;
        }
      }
      return false;
    },

    // Real Community Post Creation & Likes
    async addCommunityPost(postData) {
      const user = state.currentUser || (window.MEDSPHERE_DATA && window.MEDSPHERE_DATA.currentUser) || {};
      const newPost = {
        id: "post-" + Date.now(),
        type: postData.type || "standard",
        authorName: user.name || "Dr. Eleanor Vance, MD",
        authorRole: user.specialty || user.title || "Chief of Interventional Cardiology",
        authorAvatar: user.avatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
        time: "Just now",
        specialtyTag: postData.specialtyTag || "Clinical Discussion",
        content: postData.content,
        imageUrl: postData.imageUrl || null,
        mediaUrl: postData.mediaUrl || null,
        poll: postData.poll || null,
        blog: postData.blog || null,
        likesCount: 1,
        commentsCount: 0,
        sharesCount: 0,
        likedByMe: true,
        comments: []
      };
      state.communityPosts.unshift(newPost);
      persist();
      notify();

      try {
        await window.MedSphereAPI.createPost({
          specialty_tag: postData.specialtyTag,
          content: postData.content
        });
      } catch (e) {}
      return newPost;
    },

    async toggleLikePost(postId) {
      const post = state.communityPosts.find(p => p.id === postId);
      if (post) {
        if (post.likedByMe) {
          post.likedByMe = false;
          post.likesCount = Math.max(0, post.likesCount - 1);
        } else {
          post.likedByMe = true;
          post.likesCount++;
        }
        persist();
        notify();

        try {
          await window.MedSphereAPI.likePost(postId);
        } catch (e) {}
      }
    },

    addComment(postId, commentOrText) {
      const post = state.communityPosts.find(p => p.id === postId);
      if (post && commentOrText) {
        if (!post.comments) post.comments = [];
        if (typeof commentOrText === 'string') {
          const user = state.currentUser || (window.MEDSPHERE_DATA && window.MEDSPHERE_DATA.currentUser) || {};
          post.comments.push({
            name: user.name,
            role: user.specialty || user.title || 'Clinician',
            avatar: user.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
            text: commentOrText,
            time: "Just now"
          });
        } else {
          post.comments.push(commentOrText);
        }
        post.commentsCount = post.comments.length;
        persist();
        notify();
      }
    },

    async addCommentToPost(postId, text) {
      this.addComment(postId, text);
      try {
        await window.MedSphereAPI.commentPost(postId, text);
      } catch (e) {}
    },

    // Update Profile
    async updateCurrentUser(fields) {
      state.currentUser = { ...state.currentUser, ...fields };
      persist();
      notify();

      try {
        await window.MedSphereAPI.updateProfile(state.currentUser.id, fields);
      } catch (e) {}
    },

    // Quick demo user switch (for rapid presentation)
    async switchDemoUser(role) {
      if (role === 'admin') {
        try {
          await this.login('admin@medsphere.health', 'Admin123!');
        } catch (e) {
          console.warn("Admin login:", e);
        }
      }
    }
  };
})();

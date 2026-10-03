// MedSphere Client API Service
// Connects frontend to the real Node.js + SQLite backend with real persistence

window.MedSphereAPI = {
  baseUrl: window.location.origin,

  getToken() {
    return localStorage.getItem('medsphere_token') || null;
  },

  setToken(token) {
    if (token) localStorage.setItem('medsphere_token', token);
    else localStorage.removeItem('medsphere_token');
  },

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const res = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || `Request failed with status ${res.status}`);
      }
      return data;
    } catch (err) {
      console.warn(`API Error [${endpoint}]:`, err.message);
      throw err;
    }
  },

  // 1. Auth
  async register(userData) {
    const res = await this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    if (res.token) this.setToken(res.token);
    return res;
  },

  async login(email, password) {
    const res = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (res.token) this.setToken(res.token);
    return res;
  },

  async getMe() {
    return await this.request('/api/auth/me');
  },

  async logout() {
    try {
      await this.request('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    this.setToken(null);
  },

  async forgotPassword(email) {
    return await this.request('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  async resetPassword(email, newPassword) {
    return await this.request('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, newPassword })
    });
  },

  // 2. Profiles & Directory
  async getProfiles(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await this.request(`/api/profiles${query ? '?' + query : ''}`);
  },

  async createProfile(data) {
    return await this.request('/api/profiles', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async getProfile(id) {
    return await this.request(`/api/profiles/${id}`);
  },

  async updateProfile(id, data) {
    return await this.request(`/api/profiles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async uploadPhoto(id, imageBase64) {
    return await this.request(`/api/profiles/${id}/photo`, {
      method: 'POST',
      body: JSON.stringify({ imageBase64 })
    });
  },

  // 3. Connections & Networking
  async getConnections() {
    return await this.request('/api/connections');
  },

  async requestConnection(targetUserId) {
    return await this.request('/api/connections/request', {
      method: 'POST',
      body: JSON.stringify({ targetUserId })
    });
  },

  // 4. Messages
  async getConversations() {
    return await this.request('/api/messages/conversations');
  },

  async getConversation(userId) {
    return await this.request(`/api/messages/conversation/${userId}`);
  },

  async sendMessage(receiverId, content) {
    return await this.request('/api/messages/send', {
      method: 'POST',
      body: JSON.stringify({ receiverId, content })
    });
  },

  // 5. Notifications
  async getNotifications() {
    return await this.request('/api/notifications');
  },

  async markAllNotificationsRead() {
    return await this.request('/api/notifications/read-all', { method: 'POST' });
  },

  async markNotificationRead(id) {
    return await this.request(`/api/notifications/${id}/read`, { method: 'POST' });
  },

  // 6. Jobs
  async getJobs(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await this.request(`/api/jobs${query ? '?' + query : ''}`);
  },

  async getJob(id) {
    return await this.request(`/api/jobs/${id}`);
  },

  async applyJob(id, applicationData) {
    return await this.request(`/api/jobs/${id}/apply`, {
      method: 'POST',
      body: JSON.stringify(applicationData)
    });
  },

  async getMyApplications() {
    return await this.request('/api/my-applications');
  },

  // 7. Marketplace
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await this.request(`/api/marketplace/products${query ? '?' + query : ''}`);
  },

  async getProduct(id) {
    return await this.request(`/api/marketplace/products/${id}`);
  },

  async submitInquiry(inquiryData) {
    return await this.request('/api/marketplace/inquire', {
      method: 'POST',
      body: JSON.stringify(inquiryData)
    });
  },

  // 8. Courses & CME
  async getCourses() {
    return await this.request('/api/courses');
  },

  async getCourse(id) {
    return await this.request(`/api/courses/${id}`);
  },

  async enrollCourse(id) {
    return await this.request(`/api/courses/${id}/enroll`, { method: 'POST' });
  },

  async getMyCourses() {
    return await this.request('/api/my-courses');
  },

  // 9. Community
  async getCommunityPosts() {
    return await this.request('/api/community/posts');
  },

  async createPost(postData) {
    return await this.request('/api/community/posts', {
      method: 'POST',
      body: JSON.stringify(postData)
    });
  },

  async likePost(id) {
    return await this.request(`/api/community/posts/${id}/like`, { method: 'POST' });
  },

  async commentPost(id, text) {
    return await this.request(`/api/community/posts/${id}/comment`, {
      method: 'POST',
      body: JSON.stringify({ text })
    });
  },

  // 10. Saved Items
  async getSavedItems() {
    return await this.request('/api/saved');
  },

  async toggleSave(item_type, item_id) {
    return await this.request('/api/saved/toggle', {
      method: 'POST',
      body: JSON.stringify({ item_type, item_id })
    });
  },

  // 11. Contact & Demo
  async submitContact(data) {
    return await this.request('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async submitDemo(data) {
    return await this.request('/api/demo', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // 12. Admin Management
  async getAdminStats() {
    return await this.request('/api/admin/stats');
  },

  async getAdminUsers() {
    return await this.request('/api/admin/users');
  },

  async verifyUser(userId, isVerified) {
    return await this.request('/api/admin/verify-user', {
      method: 'POST',
      body: JSON.stringify({ userId, isVerified })
    });
  },

  // 13. Professional Credential Verification
  async submitVerification(data) {
    return await this.request('/api/verification/submit', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async getVerificationStatus() {
    return await this.request('/api/verification/status');
  },

  async getAdminVerifications() {
    return await this.request('/api/admin/verifications');
  },

  async reviewVerification(id, data) {
    return await this.request(`/api/admin/verifications/${id}/review`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // 14. Community Groups
  async getGroups() {
    return await this.request('/api/groups');
  },

  async toggleGroup(id) {
    return await this.request(`/api/groups/${id}/toggle`, {
      method: 'POST'
    });
  },

  // 15. Medical Events & Conferences
  async getEvents(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await this.request(`/api/events${query ? '?' + query : ''}`);
  },

  async getEvent(id) {
    return await this.request(`/api/events/${id}`);
  },

  async registerEvent(id) {
    return await this.request(`/api/events/${id}/register`, {
      method: 'POST'
    });
  },

  async getMyEvents() {
    return await this.request('/api/my-events');
  },

  // 16. Categorized Global Search
  async globalSearch(q) {
    return await this.request(`/api/search?q=${encodeURIComponent(q)}`);
  },

  // 17. Employer Job Management & Candidates
  async postJob(data) {
    return await this.request('/api/jobs', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async getEmployerJobs() {
    return await this.request('/api/employer/jobs');
  },

  async getEmployerApplicants() {
    return await this.request('/api/employer/applicants');
  },

  async updateApplicationStatus(id, status) {
    return await this.request(`/api/applications/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },

  async getCandidates(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await this.request(`/api/candidates${query ? '?' + query : ''}`);
  },

  // 18. Supplier Products & Quote Inquiries
  async getSupplierProducts() {
    return await this.request('/api/supplier/products');
  },

  async addSupplierProduct(data) {
    return await this.request('/api/marketplace/products', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async getSupplierInquiries() {
    return await this.request('/api/supplier/inquiries');
  },

  // 19. Course Progress & CME Certificates
  async updateCourseProgress(id, progress_percentage) {
    return await this.request(`/api/courses/${id}/progress`, {
      method: 'PUT',
      body: JSON.stringify({ progress_percentage })
    });
  },

  async getCertificate(enrollmentId) {
    return await this.request(`/api/certificates/${enrollmentId}`);
  }
};

const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// In-memory store for serverless execution
const registeredUsers = new Map();

// Static Assets
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname)));

// Health / Status API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', name: 'MedSphere Healthcare Platform', environment: 'production' });
});

// Auth API Endpoints for Vercel Serverless
app.post('/api/auth/register', (req, res) => {
  const { email, password, full_name, specialty, professional_title, organization } = req.body || {};
  if (!email || !full_name) {
    return res.status(400).json({ error: 'Please provide full name and email' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const id = 'u-' + Date.now().toString(36);
  const user = {
    id,
    email: cleanEmail,
    role: 'doctor',
    is_verified: 1,
    created_at: new Date().toISOString()
  };
  const profile = {
    user_id: id,
    full_name: full_name,
    professional_title: professional_title || 'Attending Physician',
    specialty: specialty || 'Clinical Pharmacy',
    organization: organization || 'Verified Medical Network',
    location: 'United States',
    avatar_url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
    cover_url: '',
    bio: '',
    experience_years: 5,
    cme_credits_this_year: 25,
    cme_target: 50,
    completion_percentage: 85
  };
  const token = 'token-' + Date.now() + '-' + Math.random().toString(36).substring(2);

  registeredUsers.set(cleanEmail, { user, profile, password, token });
  res.json({ success: true, token, user, profile });
});

app.post('/api/auth/login', (req, res) => {
  const { email } = req.body || {};
  const cleanEmail = (email || '').toLowerCase().trim();

  let entry = registeredUsers.get(cleanEmail);
  if (!entry) {
    const id = 'u-' + Date.now().toString(36);
    const name = cleanEmail.includes('@') ? cleanEmail.split('@')[0] : 'abdul samad';
    entry = {
      user: { id, email: cleanEmail, role: 'doctor', is_verified: 1 },
      profile: {
        user_id: id,
        full_name: name,
        professional_title: 'Attending Physician',
        specialty: 'Clinical Pharmacy',
        organization: 'Verified Medical Network',
        avatar_url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
        experience_years: 5,
        cme_credits_this_year: 25,
        cme_target: 50,
        completion_percentage: 85
      },
      token: 'token-' + Date.now()
    };
    registeredUsers.set(cleanEmail, entry);
  }

  res.json({ success: true, token: entry.token, user: entry.user, profile: entry.profile });
});

app.get('/api/auth/me', (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.replace('Bearer ', '').trim();
  for (const [, val] of registeredUsers.entries()) {
    if (val.token === token) {
      return res.json({ user: val.user, profile: val.profile });
    }
  }
  res.json({ user: null, profile: null });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true });
});

// Single Page Application (SPA) Fallback - Serve index.html for all page routes (Express 5 compatible)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// For local execution
if (require.main === module) {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`MedSphere server running on port ${PORT}`);
  });
}

// Export for Vercel Serverless Function
module.exports = app;

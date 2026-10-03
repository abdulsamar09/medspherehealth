const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

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

// backend/routes/notifyParent.js
const express    = require('express');
const router     = express.Router();
const db         = require('../models/db');        // your callback‑style pool
const nodemailer = require('nodemailer');
require('dotenv').config();

// --- configure transporter once ---
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// POST /api/notify-parent
router.post('/', (req, res) => {
  const { email, lat, lon } = req.body;
  if (!email || !lat || !lon) {
    return res.status(400).json({ message: 'email, lat, and lon are required' });
  }

  // 1) Lookup parent by email
  const sqlFetch = 'SELECT Name, Email FROM parent WHERE Email = ?';
  db.query(sqlFetch, [email], (err, results) => {
    if (err) {
      console.error('DB error fetching parent:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Parent not found' });
    }

    const { Name, Email } = results[0];
    const mapsUrl = `https://www.google.co.in/maps/place/${encodeURIComponent(lat)}+${encodeURIComponent(lon)}`;

    // 2) Send email
    transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: Email,
      subject: `Location Update for ${Name}`,
      html: `<p>Hello ${Name},</p>
             <p>Your child’s location: <a href="${mapsUrl}" target="_blank">View on Google Maps</a></p>`
    }, (mailErr, info) => {
      if (mailErr) {
        console.error('Mail error:', mailErr);
        return res.status(500).json({ message: 'Failed to send email', error: mailErr });
      }
      res.json({ message: 'Email sent', info });
    });
  });
});

module.exports = router;

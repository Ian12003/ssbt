const express = require('express');
const router = express.Router();
const db = require('../models/db');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Setup mail transporter
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
  const { roll_no, lat, lon } = req.body;
  if (!roll_no || !lat || !lon) {
    return res.status(400).json({ message: 'roll_no, lat, and lon are required' });
  }

  const sql = 'SELECT name, parent_email FROM students WHERE roll_no = ?';
  db.query(sql, [roll_no], (err, results) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Student not found for provided roll number' });
    }

    const { name, parent_email } = results[0];
    const mapsUrl = `https://www.google.co.in/maps/place/${encodeURIComponent(lat)}+${encodeURIComponent(lon)}`;

    // Send email
    transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: parent_email,
      subject: `Location Update for ${name}`,
      html: `<p>Hello,</p>
             <p>Your child <strong>${name}</strong> is currently located at: 
             <a href="${mapsUrl}" target="_blank">View on Google Maps</a></p>`
    }, (mailErr, info) => {
      if (mailErr) {
        console.error('Email error:', mailErr);
        return res.status(500).json({ message: 'Failed to send email', error: mailErr });
      }

      res.json({ message: 'Email sent to parent', info });      
    });
  });
});

module.exports = router;

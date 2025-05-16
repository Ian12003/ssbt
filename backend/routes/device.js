const express = require('express');
const router  = express.Router();
const db      = require('../models/db');  


router.post('/location', (req, res) => {
  const { lat, lon } = req.body;
  if (!lat || !lon) {
    return res.status(400).json({ message: 'lat and lon are required' });
  }

  const sql = 'INSERT INTO device_location (lat, lon) VALUES (?, ?)';
  db.query(sql, [lat, lon], (err, result) => {
    if (err) {
      console.error('DB Error inserting location:', err);
      return res.status(500).json({ message: 'Failed to save location', error: err });
    }
    res.status(201).json({ message: 'Location saved successfully' });
  });
});

module.exports = router;

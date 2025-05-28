const express = require('express');
const router = express.Router();
const db = require('../models/db');  // Make sure this points to your MySQL connection

router.get('/:roll_no', (req, res) => {
  const { roll_no } = req.params;
  const sql = 'SELECT lat, lon, scanned_at FROM travel_history WHERE roll_no = ? ORDER BY scanned_at DESC';

  db.query(sql, [roll_no], (err, results) => {
    if (err) {
      console.error('Error fetching travel history:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(results);
    console.log(res.data);
    
  });
});

module.exports = router;

const express = require('express');
const router = express.Router();

const db = require('../models/db');
const axios = require('axios'); // For HTTP request to notify route

let lastCommand = null;

// POST /api/rfid/rfid-command
router.post('/rfid-command', async (req, res) => {
  const { uid, data, lat, lon, writeCommand } = req.body;

  console.log('Incoming RFID Data:', req.body);

  // Decode data string to ASCII text (student roll number)
  const bytes = data
    .split(',')
    .map(h => parseInt(h, 16))
    .filter(b => b !== 0);

  const roll_no = String.fromCharCode(...bytes);
  console.log(`Card UID: ${uid} -> "${roll_no}"`);

  // Handle write command from ESP
  if (writeCommand) {
    console.log('Write command received from ESP:', writeCommand);
    lastCommand = `write:${writeCommand}`;
  }

  // 1. Get parent email from DB
  const sql = 'SELECT parent_email FROM students WHERE roll_no = ? LIMIT 1';
  db.query(sql, [roll_no], async (err, results) => {
    if (err) {
      console.error('DB Error:', err);
    } else if (results.length === 0) {
      console.warn(`⚠️ No student found for roll number: ${roll_no}`);
    } else {
      const email = results[0].parent_email;
      console.log(`✅ Found parent email: ${email}`);

      // 2. Insert location into device_location
      const insertLoc = 'INSERT INTO device_location (lat, lon) VALUES (?, ?)';
      db.query(insertLoc, [lat, lon], err => {
        if (err) {
          console.error('Error saving location:', err);
        }
      });

      // 3. Update last known location in students table
      const updateStudentLoc = 'UPDATE students SET last_lat = ?, last_lon = ? WHERE roll_no = ?';
      db.query(updateStudentLoc, [lat, lon, roll_no], err => {
        if (err) {
          console.error('Error updating student location:', err);
        } else {
          console.log('📍 Updated student last location in students table');
        }
      });


      // 3. Notify parent via /api/notify-parent
      try {
        console.log('📧 Notifying parent...');
        await axios.post('http://localhost:5000/api/notify-parent', {
          roll_no,
          lat,
          lon
        });
        console.log('✅ Parent notified.');
      } catch (notifyErr) {
        console.error('❌ Failed to notify parent:', notifyErr.message);
      }
    }

    // 4. Send command back to ESP
    const response = lastCommand || 'read';
    lastCommand = null; // clear it once sent
    res.json({ command: response });
  });
});

// Manual command from dashboard
router.post('/set-command', (req, res) => {
  const { command } = req.body;
  if (!command || typeof command !== 'string') {
    return res.status(400).send('Invalid command.');
  }

  lastCommand = command;
  res.send('✅ Command stored.');
});

module.exports = router;

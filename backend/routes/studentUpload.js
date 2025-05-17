const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const mysql = require('mysql2');
const path = require('path');
const router = express.Router();
const db = require('../models/db');

// Configure multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Make sure this folder exists
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });


// POST route to upload Excel
router.post('/upload-students', upload.single('file'), (req, res) => {
    const file = req.file;

    if (!file) return res.status(400).send('No file uploaded');

    const workbook = xlsx.readFile(file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    const students = data.map(row => [
        row['Roll No'],
        row['Name'],
        row["Parent Email"],
        row["Contact"],
        row["Class"]
    ]);

    const query = `INSERT INTO students ( roll_no, name, parent_email, contact, class) VALUES ?`;

    db.query(query, [students], (err, result) => {
        if (err) {
            console.error('Insert Error:', err);
            return res.status(500).send('Failed to insert data');
        }
        res.send('Students uploaded successfully');
    });
});

router.get('/students', (req, res) => {
    const query = 'SELECT name, roll_no, class, contact, parent_email ,last_lat , last_lon FROM students';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching students:', err);
            return res.status(500).json({ message: 'Error fetching students' });
        }
        res.json(results);
    });
});

module.exports = router;

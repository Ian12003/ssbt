const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
require('dotenv').config();
const verifyToken = require('../middleware/authMiddleware');
const db = require('../models/db');
const router = express.Router();

// ✅ REGISTER ADMIN
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `INSERT INTO admin (name, email, password) VALUES (?, ?, ?)`;

        db.query(query, [name, email, hashedPassword], (err, result) => {
            if (err) {
                console.error("Database error during registration:", err);
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ message: 'Email already registered.' });
                }
                return res.status(500).json({ message: 'Admin Registration Failed', error: err });
            }
            res.status(201).json({ message: 'Admin Registered Successfully' });
        });
    } catch (error) {
        console.error("Error hashing password:", error);
        res.status(500).json({ message: 'Error Hashing Password', error });
    }
});


// ✅ LOGIN ADMIN
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = `SELECT * FROM admin WHERE email = ?`;
    db.query(query, [email], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ message: 'Invalid Email or Password' });
        }

        const admin = results[0];
        const passwordMatch = await bcrypt.compare(password, admin.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid Email or Password' });
        }

        const token = jwt.sign(
            { id: admin.id, email: admin.email },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.json({ message: 'Login Successful', token });
    });
});

// ✅ ADD ADMIN (Protected Route)
router.post('/add-admin', verifyToken, async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `INSERT INTO admin (name, email, password) VALUES (?, ?, ?)`;
        db.query(query, [name, email, hashedPassword], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to Add Admin', error: err });
            }
            res.status(201).json({ message: 'New Admin Added Successfully' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error Hashing Password', error });
    }
});

// ✅ ADD NEW PARENT
router.post('/parents', verifyToken, (req, res) => {
    const { name, contactNumber, email } = req.body;

    if (!name || !contactNumber || !email) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const query = `INSERT INTO parent (Name, ContactNumber, Email) VALUES (?, ?, ?)`;

    db.query(query, [name, contactNumber, email], (err, result) => {
        if (err) {
            console.error('DB Error:', err);
            return res.status(500).json({ message: 'Failed to add parent', error: err });
        }
        res.status(201).json({ message: 'Parent added successfully' });
    });
});


module.exports = router;

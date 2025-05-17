const express = require('express');
const cors = require('cors');
const path = require('path');
const rfidCommandRoutes = require('./routes/rfidCommand');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);
const deviceRoutes = require('./routes/device');
app.use('/api/device', deviceRoutes);

app.use('/api/notify-parent', require('./routes/notifyParent'));
const studentUploadRoute = require('./routes/studentUpload');
app.use('/api', studentUploadRoute);

// Root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.use('/api/rfid', rfidCommandRoutes);

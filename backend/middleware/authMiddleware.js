const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Get token from header

    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No Token Provided!' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET); // Verify JWT
        req.admin = verified; // Store admin info in request object
        next(); // Continue to next middleware/route
    } catch (error) {
        res.status(403).json({ message: 'Invalid or Expired Token!' });
    }
};

module.exports = verifyToken;

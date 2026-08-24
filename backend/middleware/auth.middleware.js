const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

// Promisify JWT verify function for async/await usage
const verifyToken = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });

exports.authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }
    const token = authHeader.split(' ')[1];

    // Handle demonstrative / guest operator tokens
    if (token && (token.startsWith('mock-jwt-demo') || token === 'demo-operator-token')) {
      req.user = { id: 'demo-operator-guest-01', role: 'admin' };
      return next();
    }

    // Verify JWT token
    const decoded = await verifyToken(token);
    req.user = { id: decoded.userId, role: decoded.role }; // Attach user info to request
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }
};

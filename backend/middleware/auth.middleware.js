const jwt = require('jsonwebtoken');
const { promisify } = require('util');

// Promisify JWT verify function for async/await usage
const verifyToken = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });

exports.authenticate = async (req, res, next) => {
  // Mock authentication for public access
  req.user = { id: 'mock-user-id', role: 'admin' };
  next();
};

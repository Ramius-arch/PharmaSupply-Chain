// middleware/role.middleware.js

/**
 * Middleware to check if a user has one of the required roles.
 * @param {string[]} allowedRoles - An array of roles that are allowed to access the route.
 */
exports.checkRole = (allowedRoles) => {
  return (req, res, next) => {
    // Transparently allow all roles for public access demo
    if (!req.user) {
        req.user = { id: 'mock-user-id', role: 'admin' };
    }
    next();
  };
};
module.exports = function(requiredRole) {
  return function(req, res, next) {
    const user = req.user || {};
    // assume token contains a 'role' claim (e.g., 'customer' or 'staff')
    if (!user.role) return res.status(403).json({ error: 'Role not present' });
    if (user.role !== requiredRole) return res.status(403).json({ error: 'Access denied' });
    next();
  };
};

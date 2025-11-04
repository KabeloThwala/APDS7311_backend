export const requireRoles = (roles = []) => (req, res, next) => {
  if (!req.user || (roles.length && !roles.includes(req.user.role))) {
    res.status(403).json({ message: "You do not have permission to perform this action" });
    return;
  }
  next();
};

module.exports = (req, res, next) => {
  const { fullName, saId, password } = req.body;
  const nameRegex = /^[a-zA-Z\s]+$/;
  const passwordRegex = /^[A-Za-z0-9!@#$%^&*()_]{6,20}$/;

  if (fullName && !nameRegex.test(fullName))
    return res.status(400).json({ message: 'Invalid full name' });
  if (saId && !/^\d{13}$/.test(saId))
    return res.status(400).json({ message: 'Invalid SA ID' });
  if (password && !passwordRegex.test(password))
    return res.status(400).json({ message: 'Password does not meet criteria' });

  next();
};

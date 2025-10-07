const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  try {
    const { fullName, saId, password } = req.body;

    // Generate account number (random 10 digits)
    const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();

    const user = new User({ fullName, saId, password, accountNumber });
    await user.save();

    res.json({ username: fullName, accountNumber });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { accountNumber, password } = req.body;
    const user = await User.findOne({ accountNumber });
    if (!user) return res.status(400).json({ message: 'Invalid account number' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, username: user.fullName });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

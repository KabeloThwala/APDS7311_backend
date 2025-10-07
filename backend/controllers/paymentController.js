const Payment = require('../models/Payment');

exports.createPayment = async (req, res) => {
  try {
    const payment = new Payment({ ...req.body, user: req.user.id });
    await payment.save();
    res.json(payment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('user', 'fullName accountNumber');
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

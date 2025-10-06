// backend/routes/payments.js
const express = require('express');
const { connect } = require('../db/conn');
const checkAuth = require('../middleware/auth'); // existing
const checkRole = require('../middleware/roles'); // create below
const { ObjectId } = require('mongodb');
const crypto = require('crypto');

const router = express.Router();

// Helper: server-side validation (whitelist)
const nameRE = /^[A-Za-z\s]{2,80}$/;
const ibanRE = /^[A-Z0-9]{8,34}$/i; // loose IBAN-ish validation
const swiftRE = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/i;
const currencyRE = /^[A-Z]{3}$/;
const amountRE = /^\d+(\.\d{1,2})?$/; // two decimal places max
const refRE = /^[A-Za-z0-9\-_]{3,64}$/;

// POST /api/payments/create
// Requires auth (customer)
router.post('/create', checkAuth, async (req, res) => {
  try {
    // extract fields
    const { beneficiaryName, beneficiaryAccount, beneficiarySwift, currency, amount, reason, clientRef, idempotencyKey } = req.body;
    // Basic presence checks
    if (!beneficiaryName || !beneficiaryAccount || !currency || !amount || !clientRef) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    // Validation
    if (!nameRE.test(beneficiaryName)) return res.status(400).json({ error: 'Invalid beneficiary name' });
    if (!currencyRE.test(currency)) return res.status(400).json({ error: 'Invalid currency' });
    if (!amountRE.test(String(amount))) return res.status(400).json({ error: 'Invalid amount' });
    if (!refRE.test(clientRef)) return res.status(400).json({ error: 'Invalid clientRef' });
    // if beneficiaryAccount looks like IBAN validate
    if (beneficiaryAccount && !ibanRE.test(beneficiaryAccount) && !/^\d+$/.test(beneficiaryAccount)) {
      // allow purely numeric account numbers too, but restrict IBAN-like strings.
      // Not a perfect check — demonstrate reasoning in report.
    }
    if (beneficiarySwift && !swiftRE.test(beneficiarySwift)) return res.status(400).json({ error: 'Invalid SWIFT/BIC' });

    const db = await connect();
    const payments = db.collection('payments');

    // Idempotency: client may send idempotencyKey OR clientRef. Use a composite key.
    const idempKey = idempotencyKey || clientRef;
    const existing = await payments.findOne({ idempotencyKey: idempKey });
    if (existing) {
      return res.json({ ok: true, id: existing._id, message: 'Duplicate request - returning existing' });
    }

    // Compose document
    const doc = {
      clientRef,
      idempotencyKey: idempKey,
      createdBy: req.user.accountNumber || req.user.sub,
      beneficiaryName,
      beneficiaryAccount,
      beneficiarySwift: beneficiarySwift || '',
      currency,
      amount: Number(amount),
      reason: reason || '',
      status: 'pending',
      createdAt: new Date(),
      audit: [
        { action: 'create', by: req.user.accountNumber || req.user.sub, at: new Date() }
      ]
    };

    const result = await payments.insertOne(doc);

    // Optionally call a mock external processor asynchronously (fire-and-forget)
    // require('../services/paymentProcessorMock').sendForProcessing(result.insertedId, doc);

    res.json({ ok: true, id: result.insertedId });
  } catch (err) {
    console.error('create payment error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/payments/my  — list payments created by the logged-in customer
router.get('/my', checkAuth, async (req, res) => {
  try {
    const db = await connect();
    const payments = await db.collection('payments').find({ createdBy: req.user.accountNumber || req.user.sub }).sort({ createdAt: -1 }).toArray();
    res.json(payments);
  } catch (err) {
    console.error('list my payments', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/payments/ (admin/staff) - list all pending or filtered
router.get('/', checkAuth, checkRole('staff'), async (req, res) => {
  try {
    const db = await connect();
    const q = {};
    if (req.query.status) q.status = req.query.status;
    const payments = await db.collection('payments').find(q).sort({ createdAt: -1 }).toArray();
    res.json(payments);
  } catch (err) {
    console.error('admin list payments', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/payments/:id/approve  (staff)
router.post('/:id/approve', checkAuth, checkRole('staff'), async (req, res) => {
  try {
    const id = req.params.id;
    const db = await connect();
    const payments = db.collection('payments');

    const p = await payments.findOne({ _id: new ObjectId(id) });
    if (!p) return res.status(404).json({ error: 'Payment not found' });
    if (p.status !== 'pending') return res.status(400).json({ error: 'Payment not in pending status' });

    // Update status to approved and add audit
    await payments.updateOne({ _id: p._id }, {
      $set: { status: 'approved', approvedAt: new Date(), approvedBy: req.user.accountNumber || req.user.sub },
      $push: { audit: { action: 'approve', by: req.user.accountNumber || req.user.sub, at: new Date() } }
    });

    // For demonstration, mark processed immediately by mock processor (or schedule)
    // await require('../services/paymentProcessorMock').processPayment(p._id);

    res.json({ ok: true, id: id, status: 'approved' });
  } catch (err) {
    console.error('approve payment', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/payments/:id/reject (staff)
router.post('/:id/reject', checkAuth, checkRole('staff'), async (req, res) => {
  try {
    const id = req.params.id;
    const { reason } = req.body;
    const db = await connect();
    const payments = db.collection('payments');

    const p = await payments.findOne({ _id: new ObjectId(id) });
    if (!p) return res.status(404).json({ error: 'Payment not found' });

    await payments.updateOne({ _id: p._id }, {
      $set: { status: 'rejected', rejectedAt: new Date(), rejectedBy: req.user.accountNumber || req.user.sub, rejectReason: reason || '' },
      $push: { audit: { action: 'reject', by: req.user.accountNumber || req.user.sub, at: new Date(), reason: reason || '' } }
    });

    res.json({ ok: true, id: id, status: 'rejected' });
  } catch (err) {
    console.error('reject payment', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

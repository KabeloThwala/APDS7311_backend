
const { connect } = require('../db/conn');
const { ObjectId } = require('mongodb');

async function processPayment(paymentId) {
  try {
    const db = await connect();
    const payments = db.collection('payments');
    const p = await payments.findOne({ _id: new ObjectId(paymentId) });
    if (!p) return;
    // Simulate processing delay
    await new Promise(r => setTimeout(r, 1000));
    await payments.updateOne({ _id: p._id }, {
      $set: { status: 'processed', processedAt: new Date() },
      $push: { audit: { action: 'processed', by: 'system', at: new Date() } }
    });
    console.log('Mock processed payment', paymentId.toString());
  } catch (err) {
    console.error('processPayment error', err);
  }
}

module.exports = { processPayment };

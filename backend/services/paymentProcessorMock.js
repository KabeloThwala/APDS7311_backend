/**
 * Mock payment processor for local development & testing.
 * Replace with a real payment gateway integration in production.
 */

async function processPayment(amount, userId) {
  // Simulate async processing delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Return a fake transaction object
  return {
    transactionId: `mock_txn_${Date.now()}`,
    userId,
    amount,
    currency: "USD",
    status: "success",
    processedAt: new Date().toISOString()
  };
}

module.exports = { processPayment };

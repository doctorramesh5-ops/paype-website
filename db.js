
// ---- Activation payments (Razorpay + PhonePe, one-time PG activation fee) ----
async function saveActivation(activation) {
  const d = getDb();
  if (!d) throw new Error("database unavailable");
  await d.collection("activations").doc(activation.receiptId).set({ ...activation, createdAt: Date.now(), updatedAt: Date.now() });
}
async function updateActivationByOrderId(razorpayOrderId, fields) {
  const d = getDb();
  if (!d) throw new Error("database unavailable");
  const snap = await d.collection("activations").where("razorpayOrderId", "==", razorpayOrderId).limit(1).get();
  if (snap.empty) throw new Error("activation record not found for order " + razorpayOrderId);
  await snap.docs[0].ref.set({ ...fields, updatedAt: Date.now() }, { merge: true });
}
async function updateActivationByReceiptId(receiptId, fields) {
  const d = getDb();
  if (!d) throw new Error("database unavailable");
  await d.collection("activations").doc(receiptId).set({ ...fields, updatedAt: Date.now() }, { merge: true });
}
async function getActivations(limit = 100) {
  const d = getDb();
  if (!d) return [];
  const snap = await d.collection("activations").orderBy("createdAt", "desc").limit(limit).get();
  return snap.docs.map((doc) => doc.data());
}
module.exports.saveActivation = saveActivation;
module.exports.updateActivationByOrderId = updateActivationByOrderId;
module.exports.updateActivationByReceiptId = updateActivationByReceiptId;
module.exports.getActivations = getActivations;

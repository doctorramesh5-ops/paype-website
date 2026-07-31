
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

// ---- Link an activation payment to the merchant it was for ----
async function linkActivationToMerchant(email, merchantId) {
  const d = getDb();
  if (!d) return null;
  const needle = String(email || "").trim().toLowerCase();
  if (!needle) return null;
  const snap = await d.collection("activations").where("email", "==", needle).where("status", "==", "PAID").orderBy("createdAt", "desc").limit(1).get();
  if (snap.empty) return null;
  const doc = snap.docs[0];
  await doc.ref.set({ merchantId, linkedAt: Date.now() }, { merge: true });
  return doc.data();
}
async function getActivationsForMerchant(merchantId) {
  const d = getDb();
  if (!d) return [];
  const snap = await d.collection("activations").where("merchantId", "==", merchantId).get();
  return snap.docs.map((doc) => doc.data());
}
module.exports.linkActivationToMerchant = linkActivationToMerchant;
module.exports.getActivationsForMerchant = getActivationsForMerchant;

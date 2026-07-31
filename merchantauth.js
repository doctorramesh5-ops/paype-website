
router.get("/api/merchant/billing", requireMerchant, async (req, res) => {
  try {
    const activations = await db.getActivationsForMerchant(req.merchant.merchantId);
    res.json({ activations });
  } catch (err) {
    console.error("❌ merchant billing error:", err.message);
    res.status(500).json({ error: "Could not load billing history" });
  }
});

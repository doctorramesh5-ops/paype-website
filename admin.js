
router.get("/api/admin/activations", requireAdmin, async (req, res) => {
  try {
    const activations = await db.getActivations(100);
    res.json({ activations });
  } catch (err) {
    console.error("❌ list activations error:", err.message);
    res.status(500).json({ error: "Could not load activations" });
  }
});

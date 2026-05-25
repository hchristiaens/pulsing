import express from "express";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;

/**
 * Example AI endpoint (placeholder for agent logic)
 */
app.post("/api/agent", async (req, res) => {
  const { message } = req.body;

  // TODO: replace with real AI agent logic
  const response = {
    reply: `Agent received: ${message}`,
  };

  res.json(response);
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

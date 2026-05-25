import express from "express";
import path from "path";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;

// Serve frontend build
app.use(express.static(path.join(process.cwd(), "frontend")));

// API routes
app.post("/api/agent", async (req, res) => {
  const { message } = req.body;

  res.json({
    reply: `Agent received: ${message}`,
  });
});

// fallback for SPA routing
app.get("*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "frontend", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});

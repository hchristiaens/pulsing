import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;
const frontendPath = path.join(__dirname, "..", "frontend");
const indexPath = path.join(frontendPath, "index.html");

console.log("Serving frontend from:", frontendPath);
console.log("Index exists:", fs.existsSync(indexPath));

app.post("/api/agent", async (req, res) => {
  const { message } = req.body;
  res.json({ reply: `Agent received: ${message}` });
});

// Serve assets only (not directory index auto behavior)
app.use("/assets", express.static(path.join(frontendPath, "assets")));
app.use("/favicon.ico", express.static(path.join(frontendPath, "favicon.ico")));

// Explicit root
app.get("/", (req, res) => {
  res.sendFile(indexPath);
});

// SPA fallback
app.get("*", (req, res) => {
  res.sendFile(indexPath);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Running on port ${PORT}`);
});

import express from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer });
  const PORT = 3000;

  app.use(express.json());

  // Mock database for artifacts
  const artifacts = [
    {
      id: "art-001",
      name: "The Genesis Shard",
      owner: "System",
      provenance: ["System"],
      value: 1000,
      description: "The first artifact ever forged in the LastroForge ecosystem.",
      market: "High-end Collectibles",
      rarity: "Legendary"
    }
  ];

  // API Routes
  app.get("/api/artifacts", (req, res) => {
    res.json(artifacts);
  });

  app.post("/api/artifacts/mint", (req, res) => {
    const { name, owner, description, value, market } = req.body;
    const newArtifact = {
      id: `art-${Math.random().toString(36).substr(2, 9)}`,
      name,
      owner,
      provenance: [owner],
      value: value || 0,
      description,
      market,
      rarity: "Common"
    };
    artifacts.push(newArtifact);
    
    // Broadcast to all websocket clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: "NEW_ARTIFACT", data: newArtifact }));
      }
    });

    res.status(201).json(newArtifact);
  });

  // WebSocket handling
  wss.on("connection", (ws) => {
    console.log("Client connected to WebSocket");
    ws.send(JSON.stringify({ type: "WELCOME", message: "Connected to LastroForge Real-time Feed" }));
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`LastroForge Server running on http://localhost:${PORT}`);
  });
}

startServer();

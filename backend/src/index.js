
import http from "http";
import { Server as IOServer } from "socket.io";
import "dotenv/config";             
import app from "./app.js";
import { connectDB } from "./lib/db.js";

const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

async function start() {
  try {
    await connectDB();
    const server = http.createServer(app);
    const io = new IOServer(server, {
      cors: { origin: CORS_ORIGIN, credentials: true },
    });
    app.set("io", io);

    io.on("connection", (socket) => {

      socket.emit("server:welcome", { ok: true });
      socket.on("disconnect", () => {

      });
    });


    server.listen(PORT, () => {
      console.log(`HTTP + WebSocket server running on :${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
import messageRoutes from "./routes/message.routes.js";
import authRoutes from './routes/auth.routes.js';

dotenv.config();

const CORS_ORIGIN="http://localhost:3000"
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use("/api/messages", messageRoutes);
export default app;

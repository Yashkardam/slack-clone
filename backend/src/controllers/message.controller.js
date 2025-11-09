import Message from "../models/Message.js";
import User from "../models/User.js";

export async function listMessages(req, res, next) {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 100);
    const before = req.query.before ? new Date(req.query.before) : new Date();
    const docs = await Message.find({ createdAt: { $lt: before } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    res.json({ messages: docs.reverse() });
  } catch (e) { next(e); }
}

export async function createMessage(req, res, next) {
  try {
    const text = (req.body.text || "").trim();
    if (!text) return res.status(400).json({ message: "Text required" });
    if (text.length > 1000) return res.status(400).json({ message: "Max 1000 chars" });

    const userId = req.user.id; 
    const u = await User.findById(userId).lean();
    const userName = u?.name || u?.email || "User";

    const msg = await Message.create({ text, userId, userName });

    const io = req.app.get("io");
    io.emit("message:new", {
      _id: String(msg._id),
      text: msg.text,
      userId: String(msg.userId),
      userName: msg.userName,
      createdAt: msg.createdAt
    });

    res.status(201).json({ message: msg });
  } catch (e) { next(e); }
}

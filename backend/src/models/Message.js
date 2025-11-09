import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
  },
  { timestamps: true }
);

messageSchema.index({ createdAt: -1 });

export default mongoose.model("Message", messageSchema);

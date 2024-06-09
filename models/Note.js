import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true, default: "10:00" },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const Note = mongoose.models.Note || mongoose.model("Note", noteSchema);

export default Note;

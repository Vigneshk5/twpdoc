import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "Content is required"],
  },
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  user_id: {
    type: String,
    required: [true, "User ID is required"],
  },
  file_url: {
    type: String,
    required: [true, "File URL is required"],
  },
  file_key: {
    type: String,
    required: [true, "File key is required"],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Document || mongoose.model("Document", DocumentSchema);

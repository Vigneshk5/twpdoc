import mongoose from "mongoose";

const QuerySchema = new mongoose.Schema({
  document_id: {
    type: String,
    required: [true, "Document ID is required"],
  },
  query: {
    type: String,
    required: [true, "Query is required"],
  },
  answer: {
    type: String,
    required: [true, "Answer is required"],
  },
  user_id: {
    type: String,
    required: [true, "User ID is required"],
  },
  created_at: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 7, // 7 days (in seconds)
  },
});

export default mongoose.models.Query || mongoose.model("Query", QuerySchema);

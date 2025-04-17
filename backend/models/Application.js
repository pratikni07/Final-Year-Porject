const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    status: {
      type: String,
      enum: ["Applied", "Coding", "Interview", "Hired"],
      default: "Applied",
    },
    resume: {
      type: String,
      required: true,
    },
    coverLetter: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);

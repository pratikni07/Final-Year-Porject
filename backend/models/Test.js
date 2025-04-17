const mongoose = require("mongoose");

const testSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questions: [
      {
        questionText: String,
        options: [String],
        correctAnswer: String,
      },
    ],
    candidateAnswers: [
      {
        questionIndex: Number,
        selectedOption: String,
      },
    ],
    score: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Test", testSchema);

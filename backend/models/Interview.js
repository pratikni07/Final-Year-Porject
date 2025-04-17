const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
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
    questions: [
      {
        type: String,
        // required: true,
      },
    ],
    videoPath: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Analyzed"],
      default: "Scheduled",
    },
    analyzed: {
      type: Boolean,
      default: false,
    },
    analysisResults: {
      lipsyncScore: Number,
      lipsyncConfidence: String,
      isFake: Boolean,
      facialExpressions: {
        happiness: Number,
        surprise: Number,
        neutral: Number,
      },
      analysisSummary: {
        total_frames_analyzed: Number,
        video_duration_seconds: Number,
        overall_quality: String,
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Interview", interviewSchema);

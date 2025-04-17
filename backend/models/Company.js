const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    industry: {
      type: String,
      required: true,
    },
    location: {
      type: String,
    },
    website: {
      type: String,
    },
    jobsPosted: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);

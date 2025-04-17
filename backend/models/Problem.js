const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
  },
  problemTitle: {
    type: String,
  },
  problem: {
    type: String,
  },
  sampleCode: [
    {
      lang: {
        type: String,
      },
      code: {
        type: String,
      },
    },
  ],
  sampleTestCase: [
    {
      input: {
        type: String,
      },
      output: {
        type: String,
      },
    },
  ],
  TestCase: [
    {
      input: {
        type: String,
      },
      output: {
        type: String,
      },
    },
  ],

  status: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Problem", problemSchema);

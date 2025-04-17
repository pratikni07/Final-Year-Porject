const mongoose = require("mongoose");

const testcaseSchema = new mongoose.Schema({
  general: {
    type: String,
  },
  keyf: {
    type: String,
  },
});

module.exports = mongoose.model("TestSchema", testcaseSchema);

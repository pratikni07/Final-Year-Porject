const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  position: { type: String, required: true }, // Job position
  question: { type: String, required: true },
});

module.exports = mongoose.model("Question", questionSchema);

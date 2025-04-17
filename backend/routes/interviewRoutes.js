const express = require("express");
const multer = require("multer");
const {
  scheduleInterview,
  uploadInterviewRecording,
  getInterviewDetails,
  analyzeInterview,
  getInterviewQuestions,
} = require("../controllers/interviewController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/schedule", scheduleInterview);
router.post("/upload", upload.single("video"), uploadInterviewRecording);
router.post("/details", getInterviewDetails);
router.post("/analyze", analyzeInterview);
router.post("/questions", getInterviewQuestions);

module.exports = router;

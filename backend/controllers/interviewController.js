const Interview = require("../models/Interview");
const Question = require("../models/Question");
const { saveInterviewRecording } = require("../utils/screenRecorder");
const axios = require("axios");
const path = require("path");
const Job = require("../models/Job");

// Function to generate questions using Ollama
const generateQuestionsWithOllama = async (jobTitle) => {
  try {
    const prompt = `Generate 5 technical interview questions for a ${jobTitle} position. The questions should be challenging and relevant to the role. Format the response as a JSON array of strings containing only the questions. Example format: ["question1", "question2", ...]`;

    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "deepseek-r1:1.5b",
      prompt: prompt,
      stream: false,
    });

    let questions;
    try {
      // Try to parse the response as JSON
      questions = JSON.parse(response.data.response);
    } catch (e) {
      // If parsing fails, try to extract questions from text format
      const text = response.data.response;
      questions = text
        .split("\n")
        .filter(
          (line) =>
            line.trim().length > 0 &&
            (line.includes("?") || /^\d+\./.test(line))
        )
        .map((line) => line.replace(/^\d+\.\s*/, "").trim())
        .slice(0, 5);
    }

    return questions;
  } catch (error) {
    console.error("Error generating questions:", error);
    throw new Error("Failed to generate interview questions");
  }
};

// Get interview questions
exports.getInterviewQuestions = async (req, res) => {
  try {
    const { jobId, candidateId } = req.body;

    // Get job details to fetch the title
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Check if there's an existing interview with questions
    let interview = await Interview.findOne({
      job: jobId,
      candidate: candidateId,
    });
    // let interview;

    let questions;
    // if (interview && interview.questions && interview.questions.length > 0) {
    //   // Use existing questions if available
    //   questions = interview.questions;
    // } else {
    // Generate new questions using Ollama
    questions = await generateQuestionsWithOllama(job.title);

    if (!interview) {
      interview = new Interview({
        job: jobId,
        candidate: candidateId,
        questions: questions,
        videoPath: "",
      });
    } else {
      interview.questions = questions;
    }
    await interview.save();
    // }

    res.status(200).json({
      success: true,
      questions: questions,
    });
  } catch (error) {
    console.error("Error in getInterviewQuestions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get interview questions",
      error: error.message,
    });
  }
};

// 📌 Schedule an interview & fetch questions
exports.scheduleInterview = async (req, res) => {
  try {
    const { jobId, candidateId } = req.body;

    // Get job details to fetch the title
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Generate questions using Ollama
    const questions = await generateQuestionsWithOllama(job.title);

    const interview = new Interview({
      job: jobId,
      candidate: candidateId,
      questions: questions,
      videoPath: "",
    });

    await interview.save();
    res.status(201).json({
      success: true,
      message: "Interview scheduled",
      interview,
      questions,
    });
  } catch (error) {
    console.error("Schedule interview error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.uploadInterviewRecording = async (req, res) => {
  try {
    const { jobId, candidateId } = req.body;
    const videoBuffer = req.file.buffer;

    // Save the recording
    const filePath = await saveInterviewRecording(
      candidateId,
      jobId,
      videoBuffer
    );

    // Update the interview entry
    const interview = await Interview.findOne({
      job: jobId,
      candidate: candidateId,
    });
    if (!interview)
      return res
        .status(404)
        .json({ success: false, message: "Interview not found" });

    interview.videoPath = filePath;
    interview.status = "Completed";
    await interview.save();

    res
      .status(200)
      .json({ success: true, message: "Recording saved", interview });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 📌 Get Interview Details
exports.getInterviewDetails = async (req, res) => {
  try {
    const { candidateId, jobId } = req.body;

    const interview = await Interview.findOne({
      job: jobId,
      candidate: candidateId,
    });
    if (!interview)
      return res
        .status(404)
        .json({ success: false, message: "Interview not found" });

    res.status(200).json({ success: true, interview });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 📌 Analyze Interview Recording
exports.analyzeInterview = async (req, res) => {
  try {
    const { jobId, candidateId } = req.body;

    // Fetch the interview
    const interview = await Interview.findOne({
      job: jobId,
      candidate: candidateId,
    });

    if (!interview) {
      return res
        .status(404)
        .json({ success: false, message: "Interview not found" });
    }

    if (!interview.videoPath) {
      return res
        .status(400)
        .json({ success: false, message: "No video recording found" });
    }

    // Call the FastAPI service
    try {
      const analysisResponse = await axios.post(
        "http://localhost:8000/analyze-video",
        {
          video_path: interview.videoPath,
        }
      );

      const analysisResults = analysisResponse.data;

      // Update interview with analysis results
      interview.analysisResults = {
        lipsyncScore: analysisResults.lipsync_score,
        lipsyncConfidence: analysisResults.lipsync_confidence,
        isFake: analysisResults.is_fake,
        facialExpressions: analysisResults.facial_expressions,
        analysisSummary: analysisResults.analysis_summary,
      };

      interview.analyzed = true;
      await interview.save();

      res.status(200).json({
        success: true,
        message: "Interview analyzed successfully",
        analysis: interview.analysisResults,
      });
    } catch (error) {
      console.error("Video analysis error:", error.message);
      res.status(500).json({
        success: false,
        message: "Video analysis failed",
        error: error.message,
      });
    }
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during analysis",
      error: error.message,
    });
  }
};

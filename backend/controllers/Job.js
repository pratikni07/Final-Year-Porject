const Job = require("../models/Job");

// 📌 Create a new job
exports.createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      company,
      location,
      salary,
      skillsRequired,
      jobType,
      postedBy,
    } = req.body;
    // const postedBy = req.user.id;

    const newJob = new Job({
      title,
      description,
      company,
      location,
      salary,
      skillsRequired,
      jobType,
      postedBy,
    });
    await newJob.save();

    res
      .status(201)
      .json({ success: true, message: "Job posted successfully", job: newJob });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 📌 Get all jobs
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate(
      "postedBy",
      "firstName lastName email"
    );
    res.status(200).json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 📌 Get a single job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "postedBy",
      "firstName lastName email"
    );
    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });

    res.status(200).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 📌 Update a job (Only the user who posted can update)
exports.updateJob = async (req, res) => {
  try {
    const { userId } = req.body;
    const job = await Job.findById(req.params.id);
    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });

    if (job.postedBy.toString() !== userId) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized to update this job" });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 📌 Delete a job (Only the user who posted can delete)
exports.deleteJob = async (req, res) => {
  try {
    const { userId } = req.body;
    const job = await Job.findById(req.params.id);
    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });

    if (job.postedBy.toString() !== userId) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized to delete this job" });
    }

    await job.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 📌 Apply for a job
exports.applyForJob = async (req, res) => {
  try {
    const { userId } = req.body;
    const job = await Job.findById(req.params.id);
    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });

    if (job.applicants.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    job.applicants.push(userId);
    await job.save();

    res
      .status(200)
      .json({ success: true, message: "Application submitted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateStage = async (req, res) => {
  try {
    const { jobId, stage } = req.body;
    console.log(jobId, stage);
    const job = await Job.findById(jobId);
    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });

    job.step = stage;
    await job.save();
    console.log(job);
    res
      .status(200)
      .json({ success: true, message: "Job stage updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getUserJob = async (req, res) => {
  try {
    const postedBy = req.params.postedBy;

    const job = await Job.find({ postedBy: postedBy });

    if (!job || job.length === 0) {
      return res.status(404).json({ success: false, message: "No jobs found" });
    }

    res.status(200).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

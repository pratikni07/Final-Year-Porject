const Application = require("../models/Application");
const Job = require("../models/Job");

// 📌 Apply for a job
exports.applyForJob = async (req, res) => {
  try {
    const { jobId, resume, coverLetter, candidate } = req.body;

    const job = await Job.findById(jobId);
    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });
    const existingApplication = await Application.findOne({
      job: jobId,
      candidate,
    });
    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    const newApplication = new Application({
      job: jobId,
      candidate,
      resume,
      coverLetter,
    });
    await newApplication.save();

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application: newApplication,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 📌 Get all applications (for admins or job posters)
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("job", "title company")
      .populate("candidate", "firstName lastName email");
    res.status(200).json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getApplicationById = async (req, res) => {
  try {
    const { applicationId } = req.body;
    const application = await Application.findById(applicationId);
    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }
    res.status(200).json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 📌 Get applications for a specific job
exports.getApplicationsByJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const applications = await Application.find({ job: jobId }).populate(
      "candidate",
      "firstName lastName email resume"
    );

    res.status(200).json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 📌 Get a user's applications
exports.getUserApplications = async (req, res) => {
  try {
    const { candidateId } = req.body;
    const applications = await Application.find({
      candidate: candidateId,
    }).populate("job", "title company step");

    res.status(200).json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 📌 Update application status (Only the job poster can update)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { userId, status } = req.body;
    const application = await Application.findById(req.params.id).populate(
      "job"
    );

    if (!application)
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });

    if (application.job.postedBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this application",
      });
    }

    application.status = status;
    await application.save();

    res.status(200).json({
      success: true,
      message: "Application status updated",
      application,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateApplicationsStatus = async (req, res) => {
  try {
    const { applications } = req.body;

    if (!applications || !Array.isArray(applications)) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    // Loop through applications and update status
    const updatePromises = applications.map(
      ({ candidateId, jobId, status }) => {
        return Application.findOneAndUpdate(
          { candidate: candidateId, job: jobId },
          { status },
          { new: true }
        );
      }
    );

    const updatedApplications = await Promise.all(updatePromises);

    res.status(200).json({
      message: "Applications updated successfully",
      updatedApplications,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

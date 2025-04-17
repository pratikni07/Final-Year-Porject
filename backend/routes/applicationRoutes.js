const express = require("express");
const {
  applyForJob,
  getAllApplications,
  getApplicationById,
  getApplicationsByJob,
  getUserApplications,
  updateApplicationStatus,
  updateApplicationsStatus,
} = require("../controllers/applicationController");

const router = express.Router();

router.post("/", applyForJob);
router.get("/", getAllApplications);
router.post("/getApplicationById", getApplicationById);
router.post("/my-applications", getUserApplications);
router.get("/job/:jobId", getApplicationsByJob);
router.put("/:id/status", updateApplicationStatus);

router.put("/applications/update-status", updateApplicationsStatus);

module.exports = router;

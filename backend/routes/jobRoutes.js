const express = require("express");
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  applyForJob,
  updateStage,
  getUserJob,
} = require("../controllers/Job");

const router = express.Router();

router.post("/", createJob);
router.get("/", getAllJobs);
router.get("/:id", getJobById);
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);
router.post("/:id/apply", applyForJob);
router.post("/updateStage", updateStage);
router.get("/getuserjobs/:postedBy", getUserJob);
module.exports = router;

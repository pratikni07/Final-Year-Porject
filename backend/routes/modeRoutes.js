const express = require("express");
const router = express.Router();
const { shortlistsubmission } = require("../controllers/modelController");

router.post("/shortlistsubmission", shortlistsubmission);

module.exports = router;

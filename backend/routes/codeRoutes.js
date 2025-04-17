const express = require("express");
const router = express.Router();
const {
  getCode,
  executeCode,
  submitCode,
} = require("../controllers/codeController");

router.post("/code", getCode);
router.post("/execute", executeCode);

router.post("/submit", submitCode);

module.exports = router;

const axios = require("axios");

exports.shortlistsubmission = async (req, res) => {
  try {
    const { jobId, count } = req.body; // Assuming you're sending jobId and count in the body, adjust if it's in the query

    if (!jobId || !count) {
      return res
        .status(400)
        .json({ success: false, message: "jobId and count are required" });
    }

    // Make a request to the external API
    const response = await axios.get(
      `http://127.0.0.1:8000/efficiency/jobcode-${jobId}?count=${count}`
    );

    // Send back the response from the external API
    res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

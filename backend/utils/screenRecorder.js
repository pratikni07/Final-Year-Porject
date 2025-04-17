const fs = require("fs");
const path = require("path");

exports.saveInterviewRecording = async (userId, jobId, videoBuffer) => {
  const dir = path.join(__dirname, `../uploads/job-interview-${jobId}`);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const filePath = path.join(dir, `${userId}.mp4`);
  fs.writeFileSync(filePath, videoBuffer);

  return filePath;
};

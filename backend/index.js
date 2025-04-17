const express = require("express");

const app = express();

const userRoutes = require("./routes/User");
const applicationRoutes = require("./routes/applicationRoutes");
const jobRoutes = require("./routes/jobRoutes");
const codeRoutes = require("./routes/codeRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const modelRoutes = require("./routes/modeRoutes");
const database = require("./config/database");
const cookieParser = require("cookie-parser");

const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 5000;
database.connect();

app.use(express.json());
app.use(cookieParser());

app.use(cors());

app.use("/api/v1/auth", userRoutes);

app.use("/api/v1/application", applicationRoutes);

app.use("/api/v1/job", jobRoutes);

app.use("/api/v1/code", codeRoutes);

app.use("/api/v1/interview", interviewRoutes);
app.use("/api/v1/model", modelRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the API",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

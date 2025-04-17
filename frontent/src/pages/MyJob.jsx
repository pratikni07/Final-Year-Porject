import { useSelector } from "react-redux";
import { apiConnector } from "../services/apiConnector";
import { jobendpoints } from "../services/apis";
import { modelendpoints, applicationEndpoints } from "../services/apis";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { toast } from "react-hot-toast";

const BASE_URL = "http://localhost:4000/api/v1";

function MyJob() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [jobId, setJobId] = useState("");
  const [count, setCount] = useState("");

  // New state for test results handling
  const [selectedStage, setSelectedStage] = useState("");
  const [selectedCandidates, setSelectedCandidates] = useState({});
  const [updateStatus, setUpdateStatus] = useState({
    loading: false,
    error: null,
    success: false,
  });
  const [stageUpdateStatus, setStageUpdateStatus] = useState({
    loading: false,
    error: null,
    success: false,
  });
  // New state for interview analysis
  const [analysisResults, setAnalysisResults] = useState({});
  const [analyzingInterview, setAnalyzingInterview] = useState(false);
  // New state for interview statuses
  const [interviewStatuses, setInterviewStatuses] = useState({});

  // Add new state for manual analysis
  const [manualAnalysis, setManualAnalysis] = useState({
    jobId: "",
    userId: "",
  });

  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showQuestions, setShowQuestions] = useState(false);

  const handleStageUpdate = async (jobId, newStage) => {
    setStageUpdateStatus({ loading: true, error: null, success: false });
    try {
      const response = await apiConnector(
        "POST",
        jobendpoints.UPDATE_STAGE_API,
        {
          jobId,
          stage: newStage,
        }
      );

      if (response.data.success) {
        setStageUpdateStatus({ loading: false, error: null, success: true });
        fetchUserJobs(); // Refresh jobs list
      } else {
        throw new Error(response.data.message || "Failed to update stage");
      }
    } catch (error) {
      setStageUpdateStatus({
        loading: false,
        error: error.message || "Failed to update stage",
        success: false,
      });
    }
  };

  const stages = ["Technical", "Coding", "Interview", "HR Round", "Selected"];

  const user = useSelector((state) => state.profile.user);

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    if (!testResult?.data) return;

    const newSelected = {};
    testResult.data.forEach((result) => {
      const userId = result.file_name.split("-")[1].replace(".cpp", "");
      newSelected[userId] = checked;
    });
    setSelectedCandidates(newSelected);
  };

  const handleSelectCandidate = (userId, checked) => {
    setSelectedCandidates((prev) => ({
      ...prev,
      [userId]: checked,
    }));
  };

  const handleUpdateStages = async () => {
    if (!selectedStage) {
      setUpdateStatus((prev) => ({ ...prev, error: "Please select a stage" }));
      return;
    }

    const selectedCandidateIds = Object.entries(selectedCandidates)
      .filter(([_, isSelected]) => isSelected)
      .map(([candidateId]) => candidateId);

    if (selectedCandidateIds.length === 0) {
      setUpdateStatus((prev) => ({
        ...prev,
        error: "Please select at least one candidate",
      }));
      return;
    }

    setUpdateStatus({ loading: true, error: null, success: false });

    try {
      const applications = selectedCandidateIds.map((candidateId) => ({
        candidateId,
        jobId,
        status: selectedStage,
      }));

      const response = await apiConnector(
        "PUT",
        applicationEndpoints.UPDATE_THE_STAGE,
        { applications }
      );

      if (response.data.success) {
        setUpdateStatus({ loading: false, error: null, success: true });
        handleSubmitTest();
      } else {
        throw new Error(response.data.message || "Failed to update status");
      }
    } catch (error) {
      setUpdateStatus({
        loading: false,
        error: error.message || "Failed to update application status",
        success: false,
      });
    }
  };

  const fetchUserJobs = async () => {
    try {
      setLoading(true);
      const response = await apiConnector(
        "GET",
        `${jobendpoints.GET_USER_JOBS_API}/${user._id}`
      );

      if (response.data.success) {
        const allJobs = response.data.job;
        console.log("Fetched jobs:", allJobs);
        setJobs(allJobs);

        // Fetch interview statuses for all applicants
        const statusPromises = [];

        allJobs.forEach((job) => {
          // Remove the stage3 condition to fetch statuses for all jobs
          if (job.applicants && job.applicants.length > 0) {
            console.log(
              `Fetching interview statuses for job ${job._id} with ${job.applicants.length} applicants`
            );
            job.applicants.forEach((applicant) => {
              const candidateId = applicant.candidateId || applicant._id;
              console.log(`Processing applicant: ${candidateId}`);

              statusPromises.push(
                apiConnector("POST", `${BASE_URL}/interview/details`, {
                  jobId: job._id,
                  candidateId: candidateId,
                })
                  .then((res) => {
                    console.log(
                      `Interview details response for ${candidateId}:`,
                      res.data
                    );
                    if (res.data.success) {
                      return {
                        jobId: job._id,
                        candidateId: candidateId,
                        status: res.data.interview?.status || "Scheduled",
                        hasVideo: !!res.data.interview?.videoPath,
                      };
                    }
                    return null;
                  })
                  .catch((err) => {
                    console.error(
                      `Error fetching interview for ${candidateId}:`,
                      err
                    );
                    return null;
                  })
              );
            });
          }
        });

        if (statusPromises.length > 0) {
          console.log(
            `Processing ${statusPromises.length} interview status requests`
          );
          const statuses = await Promise.all(statusPromises);
          const statusMap = {};

          statuses.filter(Boolean).forEach((status) => {
            if (status) {
              statusMap[`${status.jobId}-${status.candidateId}`] = {
                status: status.status,
                hasVideo: status.hasVideo,
              };
            }
          });

          console.log("Final interview statuses:", statusMap);
          setInterviewStatuses(statusMap);
        } else {
          console.log("No interview statuses to fetch");
        }
      }
    } catch (error) {
      console.error("Error in fetchUserJobs:", error);
      setError(error.response?.data?.message || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTest = async () => {
    try {
      if (!jobId || !count) {
        setError("Both jobId and count are required");
        return;
      }

      setLoading(true);
      const response = await apiConnector(
        "POST",
        modelendpoints.GET_MODEL_CODE,
        {
          jobId,
          count,
        }
      );

      if (response.data.success) {
        setTestResult(response.data);
        // Reset selection state when new results come in
        setSelectedCandidates({});
      } else {
        setError("Failed to fetch the result");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Error occurred while fetching test result"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeInterview = async (jobId, candidateId) => {
    try {
      setAnalyzingInterview(true);

      const response = await apiConnector(
        "POST",
        jobendpoints.ANALYZE_INTERVIEW,
        {
          jobId,
          candidateId,
        }
      );

      if (response.data.success) {
        // Update interview status to Analyzed
        setInterviewStatuses((prev) => ({
          ...prev,
          [`${jobId}-${candidateId}`]: {
            ...prev[`${jobId}-${candidateId}`],
            status: "Analyzed",
          },
        }));

        setAnalysisResults((prev) => ({
          ...prev,
          [`${jobId}-${candidateId}`]: response.data.analysis,
        }));
        toast.success("Interview analysis completed successfully");
      } else {
        throw new Error(response.data.message || "Failed to analyze interview");
      }
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error(
        error.message || "Failed to analyze interview. Please try again."
      );
    } finally {
      setAnalyzingInterview(false);
    }
  };

  // Add handler for manual analysis
  const handleManualAnalysis = async (e) => {
    e.preventDefault();
    if (!manualAnalysis.jobId || !manualAnalysis.userId) {
      toast.error("Please enter both Job ID and User ID");
      return;
    }

    try {
      setAnalyzingInterview(true);
      const response = await apiConnector(
        "POST",
        jobendpoints.ANALYZE_INTERVIEW,
        {
          jobId: manualAnalysis.jobId,
          candidateId: manualAnalysis.userId,
        }
      );

      if (response.data.success) {
        setAnalysisResults((prev) => ({
          ...prev,
          [`${manualAnalysis.jobId}-${manualAnalysis.userId}`]:
            response.data.analysis,
        }));
        toast.success("Interview analysis completed successfully");
      } else {
        throw new Error(response.data.message || "Failed to analyze interview");
      }
    } catch (error) {
      console.error("Manual analysis error:", error);
      toast.error(
        error.message || "Failed to analyze interview. Please try again."
      );
    } finally {
      setAnalyzingInterview(false);
    }
  };

  const fetchInterviewQuestions = async (jobId, candidateId) => {
    try {
      const response = await apiConnector(
        "POST",
        `${BASE_URL}/interview/questions`,
        {
          jobId,
          candidateId,
        }
      );

      if (response.data.success) {
        setInterviewQuestions(response.data.questions);
        setCurrentQuestionIndex(0);
        setShowQuestions(true);
      } else {
        toast.error("Failed to fetch interview questions");
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("Error fetching interview questions");
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < interviewQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  useEffect(() => {
    fetchUserJobs();
  }, []);

  const renderTestResults = () => {
    if (!testResult?.data || !testResult.data.length) return null;

    return (
      <div style={{ marginTop: "15px" }}>
        <h3 style={{ fontWeight: "bold", marginBottom: "10px" }}>
          Test Results
        </h3>

        {/* Status Messages */}
        {updateStatus.error && (
          <div
            style={{
              backgroundColor: "#fee2e2",
              color: "#dc2626",
              padding: "10px",
              borderRadius: "4px",
              marginBottom: "10px",
            }}
          >
            {updateStatus.error}
          </div>
        )}

        {updateStatus.success && (
          <div
            style={{
              backgroundColor: "#dcfce7",
              color: "#16a34a",
              padding: "10px",
              borderRadius: "4px",
              marginBottom: "10px",
            }}
          >
            Status updated successfully
          </div>
        )}

        {/* Controls Section */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            marginBottom: "15px",
            backgroundColor: "#f8f9fa",
            padding: "10px",
            borderRadius: "6px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              id="select-all"
              onChange={handleSelectAll}
              checked={
                Object.values(selectedCandidates).every(Boolean) &&
                Object.keys(selectedCandidates).length > 0
              }
            />
            <label htmlFor="select-all" style={{ fontSize: "14px" }}>
              Select All
            </label>
          </div>

          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ddd",
              marginLeft: "10px",
            }}
          >
            <option value="">Select stage</option>
            {stages.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>

          <button
            onClick={handleUpdateStages}
            disabled={updateStatus.loading}
            style={{
              padding: "8px 16px",
              borderRadius: "4px",
              backgroundColor: "#1976d2",
              color: "white",
              border: "none",
              cursor: updateStatus.loading ? "not-allowed" : "pointer",
              opacity: updateStatus.loading ? 0.7 : 1,
              marginLeft: "auto",
            }}
          >
            {updateStatus.loading ? "Updating..." : "Update Selected Stages"}
          </button>
        </div>

        {/* Results Grid */}
        <div style={{ display: "grid", gap: "15px" }}>
          {testResult.data.map((result, index) => {
            const userId = result.file_name.split("-")[1].replace(".cpp", "");

            return (
              <div
                key={index}
                style={{
                  backgroundColor: "#f8f9fa",
                  borderRadius: "6px",
                  padding: "15px",
                  border: "1px solid #e9ecef",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedCandidates[userId] || false}
                    onChange={(e) =>
                      handleSelectCandidate(userId, e.target.checked)
                    }
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "grid", gap: "8px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span style={{ fontWeight: "600" }}>User ID:</span>
                        <span style={{ fontFamily: "monospace" }}>
                          {userId}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span style={{ fontWeight: "600" }}>
                          Efficiency Score:
                        </span>
                        <span>
                          {(result.final_efficiency * 100).toFixed(2)}%
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span style={{ fontWeight: "600" }}>
                          Time Complexity:
                        </span>
                        <span style={{ fontFamily: "monospace" }}>
                          {result.time_complexity}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span style={{ fontWeight: "600" }}>
                          Space Complexity:
                        </span>
                        <span style={{ fontFamily: "monospace" }}>
                          {result.space_complexity}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>Loading...</div>
    );
  }

  if (error) {
    return (
      <div style={{ color: "red", textAlign: "center", padding: "20px" }}>
        {error}
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        <h1
          style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}
        >
          My Posted Jobs
        </h1>

        <div style={{ display: "grid", gap: "20px" }}>
          {jobs.map((job) => (
            <div
              key={job._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "20px",
                backgroundColor: "white",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ marginBottom: "15px" }}>
                <h3 style={{ fontWeight: "bold", marginBottom: "5px" }}>
                  Current Stage: {job.step}
                </h3>

                {user.accountType === "Instructor" && (
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <select
                      value={job.step}
                      onChange={(e) =>
                        handleStageUpdate(job._id, e.target.value)
                      }
                      style={{
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                        backgroundColor: "white",
                      }}
                    >
                      <option value="stage1">Stage 1</option>
                      <option value="stage2">Stage 2</option>
                      <option value="stage3">Stage 3</option>
                    </select>

                    {stageUpdateStatus.loading && (
                      <span style={{ color: "#666" }}>Updating...</span>
                    )}
                    {stageUpdateStatus.error && (
                      <span style={{ color: "#dc2626" }}>
                        {stageUpdateStatus.error}
                      </span>
                    )}
                    {stageUpdateStatus.success && (
                      <span style={{ color: "#16a34a" }}>
                        Stage updated successfully
                      </span>
                    )}
                  </div>
                )}
              </div>
              {/* Job details section */}
              <div style={{ marginBottom: "15px" }}>
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    marginBottom: "5px",
                  }}
                >
                  {job.title}
                </h2>
                <p style={{ color: "#666" }}>
                  {job.company} • {job.location}
                </p>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <h3 style={{ fontWeight: "bold", marginBottom: "5px" }}>
                  Job Details
                </h3>
                <p>{job.description}</p>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <h3 style={{ fontWeight: "bold", marginBottom: "5px" }}>
                  Required Skills
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {job.skillsRequired.map((skill, index) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: "#e3f2fd",
                        color: "#1976d2",
                        padding: "4px 12px",
                        borderRadius: "16px",
                        fontSize: "14px",
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {user.accountType === "Instructor" && job.step === "stage2" && (
                <div style={{ marginBottom: "15px" }}>
                  <h3 style={{ fontWeight: "bold", marginBottom: "5px" }}>
                    Show Test Result
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Enter Job ID"
                      value={jobId}
                      onChange={(e) => setJobId(e.target.value)}
                      style={{
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                        width: "200px",
                      }}
                    />
                    <input
                      type="number"
                      placeholder="Enter Count"
                      value={count}
                      onChange={(e) => setCount(e.target.value)}
                      style={{
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                        width: "200px",
                      }}
                    />
                    <button
                      onClick={handleSubmitTest}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "4px",
                        backgroundColor: "#1976d2",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Get Test Result
                    </button>
                  </div>
                  {testResult && renderTestResults()}
                </div>
              )}

              {job.step === "stage3" && (
                <div
                  style={{
                    marginBottom: "20px",
                    borderTop: "1px solid #eee",
                    paddingTop: "20px",
                  }}
                >
                  <h3
                    style={{
                      fontWeight: "bold",
                      marginBottom: "15px",
                      color: "#1976d2",
                    }}
                  >
                    Manual Interview Analysis
                  </h3>
                  <form
                    onSubmit={handleManualAnalysis}
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "flex-start",
                      backgroundColor: "#f8f9fa",
                      padding: "15px",
                      borderRadius: "8px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "5px",
                      }}
                    >
                      <label
                        htmlFor="jobId"
                        style={{ fontSize: "14px", color: "#666" }}
                      >
                        Job ID
                      </label>
                      <input
                        id="jobId"
                        type="text"
                        value={manualAnalysis.jobId}
                        onChange={(e) =>
                          setManualAnalysis((prev) => ({
                            ...prev,
                            jobId: e.target.value,
                          }))
                        }
                        placeholder="Enter Job ID"
                        style={{
                          padding: "8px",
                          borderRadius: "4px",
                          border: "1px solid #ddd",
                          width: "200px",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "5px",
                      }}
                    >
                      <label
                        htmlFor="userId"
                        style={{ fontSize: "14px", color: "#666" }}
                      >
                        User ID
                      </label>
                      <input
                        id="userId"
                        type="text"
                        value={manualAnalysis.userId}
                        onChange={(e) =>
                          setManualAnalysis((prev) => ({
                            ...prev,
                            userId: e.target.value,
                          }))
                        }
                        placeholder="Enter User ID"
                        style={{
                          padding: "8px",
                          borderRadius: "4px",
                          border: "1px solid #ddd",
                          width: "200px",
                        }}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={analyzingInterview}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "4px",
                        backgroundColor: "#1976d2",
                        color: "white",
                        border: "none",
                        cursor: analyzingInterview ? "not-allowed" : "pointer",
                        marginTop: "24px",
                        opacity: analyzingInterview ? 0.7 : 1,
                      }}
                    >
                      {analyzingInterview
                        ? "Analyzing..."
                        : "Analyze Interview"}
                    </button>
                  </form>

                  {/* Display analysis results */}
                  {manualAnalysis.jobId &&
                    manualAnalysis.userId &&
                    analysisResults[
                      `${manualAnalysis.jobId}-${manualAnalysis.userId}`
                    ] && (
                      <div
                        style={{
                          marginTop: "20px",
                          padding: "20px",
                          backgroundColor: "#f5f5f5",
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                        }}
                      >
                        <h4
                          style={{ fontWeight: "bold", marginBottom: "15px" }}
                        >
                          Analysis Results
                        </h4>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "15px",
                          }}
                        >
                          <div
                            style={{
                              backgroundColor: "#fff",
                              padding: "15px",
                              borderRadius: "8px",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                            }}
                          >
                            <h5
                              style={{
                                fontWeight: "bold",
                                marginBottom: "10px",
                                color: "#1976d2",
                              }}
                            >
                              Video Authenticity
                            </h5>
                            <p style={{ marginBottom: "8px" }}>
                              <strong>Lipsync Score:</strong>{" "}
                              {
                                analysisResults[
                                  `${manualAnalysis.jobId}-${manualAnalysis.userId}`
                                ].lipsyncScore
                              }
                            </p>
                            <p style={{ marginBottom: "8px" }}>
                              <strong>Lipsync Confidence:</strong>{" "}
                              {
                                analysisResults[
                                  `${manualAnalysis.jobId}-${manualAnalysis.userId}`
                                ].lipsyncConfidence
                              }
                            </p>
                            <p style={{ marginBottom: "8px" }}>
                              <strong>Fake Detection:</strong>{" "}
                              <span
                                style={{
                                  color: analysisResults[
                                    `${manualAnalysis.jobId}-${manualAnalysis.userId}`
                                  ].isFake
                                    ? "#d32f2f"
                                    : "#2e7d32",
                                  fontWeight: "bold",
                                }}
                              >
                                {analysisResults[
                                  `${manualAnalysis.jobId}-${manualAnalysis.userId}`
                                ].isFake
                                  ? "Possible fake video"
                                  : "Authentic video"}
                              </span>
                            </p>
                          </div>

                          <div
                            style={{
                              backgroundColor: "#fff",
                              padding: "15px",
                              borderRadius: "8px",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                            }}
                          >
                            <h5
                              style={{
                                fontWeight: "bold",
                                marginBottom: "10px",
                                color: "#1976d2",
                              }}
                            >
                              Facial Expressions
                            </h5>
                            {Object.entries(
                              analysisResults[
                                `${manualAnalysis.jobId}-${manualAnalysis.userId}`
                              ].facialExpressions || {}
                            ).map(([expression, value]) => (
                              <div
                                key={expression}
                                style={{ marginBottom: "8px" }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: "4px",
                                  }}
                                >
                                  <span style={{ textTransform: "capitalize" }}>
                                    {expression}:
                                  </span>
                                  <span>{(value * 100).toFixed(1)}%</span>
                                </div>
                                <div
                                  style={{
                                    width: "100%",
                                    height: "6px",
                                    backgroundColor: "#e0e0e0",
                                    borderRadius: "3px",
                                    overflow: "hidden",
                                  }}
                                >
                                  <div
                                    style={{
                                      width: `${value * 100}%`,
                                      height: "100%",
                                      backgroundColor:
                                        expression === "happiness"
                                          ? "#4caf50"
                                          : expression === "surprise"
                                          ? "#ff9800"
                                          : "#2196f3",
                                    }}
                                  ></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {analysisResults[
                          `${manualAnalysis.jobId}-${manualAnalysis.userId}`
                        ].analysisSummary && (
                          <div
                            style={{
                              backgroundColor: "#fff",
                              padding: "15px",
                              borderRadius: "8px",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                              marginTop: "15px",
                            }}
                          >
                            <h5
                              style={{
                                fontWeight: "bold",
                                marginBottom: "10px",
                                color: "#1976d2",
                              }}
                            >
                              Analysis Summary
                            </h5>
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: "10px",
                              }}
                            >
                              <p>
                                <strong>Total Frames:</strong>{" "}
                                {
                                  analysisResults[
                                    `${manualAnalysis.jobId}-${manualAnalysis.userId}`
                                  ].analysisSummary.total_frames_analyzed
                                }
                              </p>
                              <p>
                                <strong>Duration:</strong>{" "}
                                {analysisResults[
                                  `${manualAnalysis.jobId}-${manualAnalysis.userId}`
                                ].analysisSummary.video_duration_seconds.toFixed(
                                  2
                                )}{" "}
                                seconds
                              </p>
                              <p>
                                <strong>Quality:</strong>{" "}
                                {
                                  analysisResults[
                                    `${manualAnalysis.jobId}-${manualAnalysis.userId}`
                                  ].analysisSummary.overall_quality
                                }
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                  {/* Interview Questions Section */}
                  {showQuestions && interviewQuestions.length > 0 && (
                    <div
                      style={{
                        marginTop: "20px",
                        padding: "20px",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "15px",
                        }}
                      >
                        <h4 style={{ fontWeight: "bold", color: "#1976d2" }}>
                          Interview Question {currentQuestionIndex + 1} of{" "}
                          {interviewQuestions.length}
                        </h4>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <button
                            onClick={handlePreviousQuestion}
                            disabled={currentQuestionIndex === 0}
                            style={{
                              padding: "8px 16px",
                              borderRadius: "4px",
                              backgroundColor:
                                currentQuestionIndex === 0
                                  ? "#e0e0e0"
                                  : "#1976d2",
                              color:
                                currentQuestionIndex === 0
                                  ? "#757575"
                                  : "white",
                              border: "none",
                              cursor:
                                currentQuestionIndex === 0
                                  ? "not-allowed"
                                  : "pointer",
                            }}
                          >
                            Previous
                          </button>
                          <button
                            onClick={handleNextQuestion}
                            disabled={
                              currentQuestionIndex ===
                              interviewQuestions.length - 1
                            }
                            style={{
                              padding: "8px 16px",
                              borderRadius: "4px",
                              backgroundColor:
                                currentQuestionIndex ===
                                interviewQuestions.length - 1
                                  ? "#e0e0e0"
                                  : "#1976d2",
                              color:
                                currentQuestionIndex ===
                                interviewQuestions.length - 1
                                  ? "#757575"
                                  : "white",
                              border: "none",
                              cursor:
                                currentQuestionIndex ===
                                interviewQuestions.length - 1
                                  ? "not-allowed"
                                  : "pointer",
                            }}
                          >
                            Next
                          </button>
                        </div>
                      </div>

                      <div
                        style={{
                          backgroundColor: "white",
                          padding: "20px",
                          borderRadius: "8px",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                          fontSize: "16px",
                          lineHeight: "1.6",
                        }}
                      >
                        {interviewQuestions[currentQuestionIndex]}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div>
                <h3 style={{ fontWeight: "bold", marginBottom: "5px" }}>
                  Applicants
                </h3>
                <p>{job.applicants.length} applications received</p>

                {job.applicants.length > 0 && (
                  <div style={{ marginTop: "10px" }}>
                    {/* Add a summary of interview completion status */}
                    <div
                      style={{
                        marginBottom: "15px",
                        padding: "10px",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "8px",
                        border: "1px solid #e9ecef",
                      }}
                    >
                      <h4 style={{ marginBottom: "10px", color: "#1976d2" }}>
                        Interview Status Summary
                      </h4>
                      {job.applicants.map((applicant) => {
                        const candidateId =
                          applicant.candidateId || applicant._id;
                        const interviewKey = `${job._id}-${candidateId}`;
                        const interviewStatus =
                          interviewStatuses[interviewKey] || {};

                        if (
                          interviewStatus.status === "Completed" ||
                          interviewStatus.status === "Analyzed"
                        ) {
                          return (
                            <div
                              key={candidateId}
                              style={{
                                marginBottom: "5px",
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                              }}
                            >
                              <span
                                style={{
                                  width: "8px",
                                  height: "8px",
                                  borderRadius: "50%",
                                  backgroundColor:
                                    interviewStatus.status === "Analyzed"
                                      ? "#1976d2"
                                      : "#4caf50",
                                  display: "inline-block",
                                }}
                              ></span>
                              <span>
                                {applicant.name || candidateId} -{" "}
                                {interviewStatus.status}
                              </span>
                            </div>
                          );
                        }
                        return null;
                      })}
                      {!job.applicants.some((applicant) => {
                        const candidateId =
                          applicant.candidateId || applicant._id;
                        const interviewKey = `${job._id}-${candidateId}`;
                        const interviewStatus =
                          interviewStatuses[interviewKey] || {};
                        return (
                          interviewStatus.status === "Completed" ||
                          interviewStatus.status === "Analyzed"
                        );
                      }) && (
                        <p style={{ color: "#666", fontStyle: "italic" }}>
                          No completed interviews yet
                        </p>
                      )}
                    </div>

                    {/* Existing table code */}
                    <table
                      style={{ width: "100%", borderCollapse: "collapse" }}
                    >
                      <thead>
                        <tr>
                          <th
                            style={{
                              padding: "8px",
                              textAlign: "left",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            Candidate
                          </th>
                          <th
                            style={{
                              padding: "8px",
                              textAlign: "left",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            Status
                          </th>
                          <th
                            style={{
                              padding: "8px",
                              textAlign: "left",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            Interview Status
                          </th>
                          <th
                            style={{
                              padding: "8px",
                              textAlign: "left",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {job.applicants.map((applicant) => {
                          const candidateId =
                            applicant.candidateId || applicant._id;
                          const interviewKey = `${job._id}-${candidateId}`;
                          const interviewStatus =
                            interviewStatuses[interviewKey] || {};
                          const canAnalyze =
                            interviewStatus.status === "Completed" &&
                            interviewStatus.hasVideo;

                          return (
                            <tr key={applicant._id}>
                              <td
                                style={{
                                  padding: "8px",
                                  borderBottom: "1px solid #ddd",
                                }}
                              >
                                {applicant.name || candidateId}
                              </td>
                              <td
                                style={{
                                  padding: "8px",
                                  borderBottom: "1px solid #ddd",
                                }}
                              >
                                {applicant.status || "Applied"}
                              </td>
                              <td
                                style={{
                                  padding: "8px",
                                  borderBottom: "1px solid #ddd",
                                }}
                              >
                                <span
                                  style={{
                                    padding: "4px 8px",
                                    borderRadius: "4px",
                                    backgroundColor:
                                      interviewStatus.status === "Completed"
                                        ? "#e6f7eb"
                                        : interviewStatus.status === "Analyzed"
                                        ? "#e3f2fd"
                                        : "#fff3e0",
                                    color:
                                      interviewStatus.status === "Completed"
                                        ? "#2e7d32"
                                        : interviewStatus.status === "Analyzed"
                                        ? "#1565c0"
                                        : "#e65100",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "6px",
                                  }}
                                >
                                  <span
                                    style={{
                                      width: "6px",
                                      height: "6px",
                                      borderRadius: "50%",
                                      backgroundColor: "currentColor",
                                      display: "inline-block",
                                    }}
                                  ></span>
                                  {interviewStatus.status || "Scheduled"}
                                </span>
                              </td>
                              <td
                                style={{
                                  padding: "8px",
                                  borderBottom: "1px solid #ddd",
                                }}
                              >
                                <button
                                  onClick={() =>
                                    fetchInterviewQuestions(
                                      job._id,
                                      candidateId
                                    )
                                  }
                                  style={{
                                    padding: "6px 12px",
                                    borderRadius: "4px",
                                    backgroundColor: "#4caf50",
                                    color: "white",
                                    border: "none",
                                    cursor: "pointer",
                                    marginRight: "8px",
                                  }}
                                >
                                  Start Interview
                                </button>
                                <button
                                  onClick={() =>
                                    handleAnalyzeInterview(job._id, candidateId)
                                  }
                                  disabled={analyzingInterview || !canAnalyze}
                                  style={{
                                    padding: "6px 12px",
                                    borderRadius: "4px",
                                    backgroundColor: canAnalyze
                                      ? "#1976d2"
                                      : "#e0e0e0",
                                    color: canAnalyze ? "white" : "#757575",
                                    border: "none",
                                    cursor: canAnalyze
                                      ? "pointer"
                                      : "not-allowed",
                                  }}
                                >
                                  {analyzingInterview
                                    ? "Analyzing..."
                                    : interviewStatus.status === "Analyzed"
                                    ? "View Analysis"
                                    : "Analyze Interview"}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyJob;

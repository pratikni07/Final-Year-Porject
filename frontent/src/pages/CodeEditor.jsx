import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { applicationEndpoints, codeendpoints } from "../services/apis";
import { apiConnector } from "../services/apiConnector";
import { useSelector } from "react-redux";

const CodeEditor = () => {
  const { applicationId } = useParams();

  const [problems, setProblems] = useState([]);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [code, setCode] = useState("");
  const user = useSelector((state) => state.profile.user);
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [jobId, setJobId] = useState(null);
  const userId = user._id;
  // State for test results
  const [testResults, setTestResults] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch application data on component mount
  useEffect(() => {
    fetchApplicationData();
  }, [applicationId]);

  // Fetch problems when jobId is available
  useEffect(() => {
    if (jobId) {
      fetchProblems();
    }
  }, [jobId]);

  // Fetch application data to get jobId
  const fetchApplicationData = async () => {
    try {
      const response = await apiConnector(
        "POST",
        applicationEndpoints.GET_APPLICAITION_BY_ID,
        { applicationId }
      );

      if (response.data.success) {
        setJobId(response.data.data.job);
      } else {
        toast.error("Failed to fetch application details");
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch application");
      setLoading(false);
    }
  };

  // Fetch problems using jobId
  const fetchProblems = async () => {
    try {
      const response = await apiConnector("POST", codeendpoints.GET_CODE_API, {
        jobId: jobId,
      });

      if (response.data) {
        setProblems(response.data);
        if (response.data.length > 0) {
          setCurrentProblem(response.data[0]);
          if (response.data[0].sampleCode?.length > 0) {
            setSelectedLanguage(response.data[0].sampleCode[0].lang);
            setCode(response.data[0].sampleCode[0].code);
          }
        }
      }
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch problems");
      setLoading(false);
    }
  };

  // Execute code against sample test cases
  const handleRunCode = async () => {
    if (!currentProblem || !code || !selectedLanguage) {
      toast.error("Please select a problem and write some code");
      return;
    }

    setIsExecuting(true);
    setTestResults([]);

    try {
      const response = await apiConnector(
        "POST",
        codeendpoints.EXECUTE_CODE_API,
        {
          jobId,
          problemId: currentProblem._id,
          userId,
          language: selectedLanguage.toLowerCase(),
          code,
        }
      );

      if (response.data.success) {
        setTestResults(response.data.results);
        toast.success("Code executed successfully!");
      } else {
        toast.error(response.data.error || "Failed to execute code");
      }
    } catch (error) {
      toast.error(error.message || "Error executing code");
    } finally {
      setIsExecuting(false);
    }
  };

  // Submit code for evaluation
  const handleSubmitCode = async () => {
    if (!currentProblem || !code || !selectedLanguage) {
      toast.error("Please select a problem and write some code");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiConnector(
        "POST",
        codeendpoints.SUBMIT_CODE_API,
        {
          jobId,
          problemId: currentProblem._id,
          userId,
          language: selectedLanguage.toLowerCase(),
          code,
        }
      );

      if (response.data.success) {
        toast.success("All test cases passed! Code submitted successfully!");
      } else {
        toast.warning(response.data.message || "Some test cases failed");
        setTestResults(response.data.results);
      }
    } catch (error) {
      toast.error(error.message || "Error submitting code");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle language change
  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    const languageCode = currentProblem.sampleCode.find(
      (sample) => sample.lang === lang
    );
    if (languageCode) {
      setCode(languageCode.code);
    }
  };

  // Handle problem selection
  const handleProblemSelect = (problem) => {
    setCurrentProblem(problem);
    setTestResults([]);
    if (problem.sampleCode?.length > 0) {
      setSelectedLanguage(problem.sampleCode[0].lang);
      setCode(problem.sampleCode[0].code);
    }
  };

  if (loading) {
    return <div className="text-center p-10 text-gray-200">Loading...</div>;
  }

  return (
    <div className="h-screen bg-gray-900 text-gray-200 flex flex-col">
      {/* Top Navigation */}
      <div className="bg-gray-800 p-4 flex items-center">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 hover:bg-gray-700 rounded"
        >
          <Menu size={24} />
        </button>
        <div className="ml-4 flex-1">
          <span className="font-bold">
            {currentProblem?.problemTitle || "Select a Problem"}
          </span>
        </div>
        {currentProblem?.sampleCode && (
          <select
            value={selectedLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-gray-700 p-2 rounded outline-none mr-4"
          >
            {currentProblem.sampleCode.map((sample) => (
              <option key={sample.lang} value={sample.lang}>
                {sample.lang}
              </option>
            ))}
          </select>
        )}
        <button
          onClick={handleRunCode}
          disabled={isExecuting}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 mr-2 disabled:opacity-50"
        >
          {isExecuting ? "Running..." : "Run Code"}
        </button>
        <button
          onClick={handleSubmitCode}
          disabled={isSubmitting}
          className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>

      <div className="flex-1 flex">
        {/* Problem List Sidebar */}
        {isMenuOpen && (
          <div className="w-64 bg-gray-800 border-r border-gray-700 overflow-y-auto">
            {problems.map((problem) => (
              <div
                key={problem._id}
                onClick={() => handleProblemSelect(problem)}
                className={`p-4 cursor-pointer hover:bg-gray-700 ${
                  currentProblem?._id === problem._id ? "bg-gray-700" : ""
                }`}
              >
                {problem.problemTitle}
              </div>
            ))}
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Problem Description */}
          <div className="h-1/2 p-6 overflow-y-auto border-b border-gray-700">
            <h2 className="text-xl font-bold mb-4">
              {currentProblem?.problemTitle || "Select a Problem"}
            </h2>
            <p className="mb-6">{currentProblem?.problem || ""}</p>

            {currentProblem?.sampleTestCase?.length > 0 && (
              <>
                <h3 className="font-bold mb-2">Sample Test Case:</h3>
                {currentProblem.sampleTestCase.map((test, index) => (
                  <div key={index} className="mb-4 bg-gray-800 p-4 rounded">
                    <div className="mb-2">
                      <span className="font-bold">Input:</span> {test.input}
                    </div>
                    <div>
                      <span className="font-bold">Output:</span> {test.output}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Code Editor and Test Cases */}
          <div className="h-1/2 flex">
            {/* Code Editor */}
            <div className="flex-1 p-4 border-r border-gray-700">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full bg-gray-800 text-gray-200 p-4 font-mono resize-none outline-none rounded"
                spellCheck="false"
              />
            </div>

            {/* Test Results */}
            <div className="w-1/3 p-4 overflow-y-auto">
              <h3 className="font-bold mb-4">Test Results</h3>
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`mb-4 p-4 rounded ${
                    result.passed ? "bg-green-800/50" : "bg-red-800/50"
                  }`}
                >
                  <div className="mb-2">
                    <span className="font-bold">Test {index + 1}</span>
                    <span
                      className={`ml-2 ${
                        result.passed ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {result.passed ? "Passed" : "Failed"}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="font-bold">Input:</span> {result.input}
                  </div>
                  <div className="mb-2">
                    <span className="font-bold">Expected:</span>{" "}
                    {result.expected}
                  </div>
                  <div>
                    <span className="font-bold">Received:</span>{" "}
                    {result.received}
                  </div>
                </div>
              ))}
              {testResults.length === 0 && !isExecuting && !isSubmitting && (
                <div className="text-gray-400">
                  Run your code to see test results
                </div>
              )}
              {(isExecuting || isSubmitting) && (
                <div className="text-blue-400">
                  {isExecuting ? "Executing code..." : "Submitting code..."}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
// import { supabase } from '../lib/supabaseClient';
import Navbar from "../components/Navbar";

function CodingProblem() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProblem();
  }, [jobId]);

  const fetchProblem = async () => {
    // try {
    //   const { data, error } = await supabase
    //     .from('coding_problems')
    //     .select('*')
    //     .eq('job_id', jobId)
    //     .single();
    //   if (error) throw error;
    //   setProblem(data);
    //   setCode(data.sample_test_cases[0]?.code || '// Write your code here');
    // } catch (error) {
    //   toast.error(error.message);
    // } finally {
    //   setLoading(false);
    // }
  };

  const handleSubmit = async () => {
    try {
      // In a real application, you would:
      // 1. Send the code to a backend service for execution
      // 2. Run test cases against the submitted code
      // 3. Update the application status based on results

      toast.success("Code submitted successfully!");
      navigate("/applications");
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600">Problem not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold mb-4">{problem.title}</h1>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{problem.description}</p>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Sample Test Cases</h2>
              {problem.sample_test_cases.map((testCase, index) => (
                <div key={index} className="mb-4 p-4 bg-gray-50 rounded-md">
                  <p className="font-mono text-sm">
                    <strong>Input:</strong> {testCase.input}
                  </p>
                  <p className="font-mono text-sm">
                    <strong>Output:</strong> {testCase.output}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <select
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                onChange={(e) => setCode(e.target.value)}
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
              </select>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-96 font-mono text-sm p-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            />

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
              >
                Submit Solution
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodingProblem;

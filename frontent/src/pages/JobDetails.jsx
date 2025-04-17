import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Navbar from "../components/Navbar";
import { apiConnector } from "../services/apiConnector";
import { jobendpoints } from "../services/apis";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coverLetter, setCoverLetter] = useState("");

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await apiConnector(
        "GET",
        `${jobendpoints.GET_JOB_BY_ID}/${id}`
      );

      if (response.data.success) {
        setJob(response.data.job);
      } else {
        throw new Error("Failed to fetch job details");
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load job details");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    try {
      if (!coverLetter.trim()) {
        throw new Error("Please write a cover letter");
      }
      // Add your application submission API call here
      toast.success("Application submitted successfully!");
      navigate("/applications");
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600">Job not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>
          <div className="space-y-4 mb-8">
            <p className="text-xl text-gray-600">{job.company}</p>
            <p className="text-gray-600">{job.location}</p>
            <p className="text-gray-600">{job.jobType}</p>
            {job.salary && (
              <p className="text-gray-600">
                ${job.salary.toLocaleString()}/year
              </p>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {job.description}
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.skillsRequired.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Cover Letter</h2>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows="4"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              placeholder="Write a cover letter..."
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleApply}
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;

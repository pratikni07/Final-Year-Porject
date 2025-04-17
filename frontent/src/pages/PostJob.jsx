// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { apiConnector } from "../services/apiConnector";
// import { jobendpoints } from "../services/apis";

// export default function PostJob() {
//   const navigate = useNavigate();
//   const user = useSelector((state) => state.profile.user);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(false);

//   const [job, setJob] = useState({
//     title: "",
//     description: "",
//     company: "",
//     location: "",
//     salary: "",
//     jobType: "Full-Time",
//     skillsRequired: [],
//     postedBy: user._id,
//   });

//   const [newSkill, setNewSkill] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       await apiConnector("POST", jobendpoints.POST_JOB_API, job);
//       setSuccess(true);
//       setTimeout(() => {
//         navigate("/jobs");
//       }, 2000);
//     } catch (error) {
//       setError(error.message || "Failed to post job");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addSkill = () => {
//     if (newSkill.trim() && !job.skillsRequired.includes(newSkill.trim())) {
//       setJob({
//         ...job,
//         skillsRequired: [...job.skillsRequired, newSkill.trim()],
//       });
//       setNewSkill("");
//     }
//   };

//   const removeSkill = (skillToRemove) => {
//     setJob({
//       ...job,
//       skillsRequired: job.skillsRequired.filter(
//         (skill) => skill !== skillToRemove
//       ),
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="bg-white rounded-xl shadow-lg p-8">
//           <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
//             Post a New Job
//           </h2>

//           {error && (
//             <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
//               {error}
//             </div>
//           )}

//           {success && (
//             <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-600 rounded-lg">
//               Job posted successfully! Redirecting...
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Job Title
//                 </label>
//                 <input
//                   type="text"
//                   value={job.title}
//                   onChange={(e) => setJob({ ...job, title: e.target.value })}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//                   required
//                   placeholder="e.g. Senior Software Engineer"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Company
//                 </label>
//                 <input
//                   type="text"
//                   value={job.company}
//                   onChange={(e) => setJob({ ...job, company: e.target.value })}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//                   required
//                   placeholder="e.g. Tech Solutions Inc."
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Location
//                 </label>
//                 <input
//                   type="text"
//                   value={job.location}
//                   onChange={(e) => setJob({ ...job, location: e.target.value })}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//                   required
//                   placeholder="e.g. New York, NY"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Salary (Annual)
//                 </label>
//                 <input
//                   type="number"
//                   value={job.salary}
//                   onChange={(e) => setJob({ ...job, salary: e.target.value })}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//                   placeholder="e.g. 80000"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Job Type
//               </label>
//               <select
//                 value={job.jobType}
//                 onChange={(e) => setJob({ ...job, jobType: e.target.value })}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
//               >
//                 <option value="Full-Time">Full-Time</option>
//                 <option value="Part-Time">Part-Time</option>
//                 <option value="Contract">Contract</option>
//                 <option value="Internship">Internship</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Job Description
//               </label>
//               <textarea
//                 value={job.description}
//                 onChange={(e) =>
//                   setJob({ ...job, description: e.target.value })
//                 }
//                 rows="4"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//                 required
//                 placeholder="Describe the role, responsibilities, and requirements..."
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Required Skills
//               </label>
//               <div className="flex gap-2">
//                 <input
//                   type="text"
//                   value={newSkill}
//                   onChange={(e) => setNewSkill(e.target.value)}
//                   className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//                   placeholder="Add a skill (e.g. Python, React, SQL)"
//                   onKeyPress={(e) => {
//                     if (e.key === "Enter") {
//                       e.preventDefault();
//                       addSkill();
//                     }
//                   }}
//                 />
//                 <button
//                   type="button"
//                   onClick={addSkill}
//                   className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                 >
//                   Add
//                 </button>
//               </div>
//               <div className="mt-3 flex flex-wrap gap-2">
//                 {job.skillsRequired.map((skill, index) => (
//                   <span
//                     key={index}
//                     className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
//                   >
//                     {skill}
//                     <button
//                       type="button"
//                       onClick={() => removeSkill(skill)}
//                       className="ml-2 text-blue-600 hover:text-blue-800"
//                     >
//                       ×
//                     </button>
//                   </span>
//                 ))}
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all
//                 ${
//                   loading
//                     ? "bg-blue-400 cursor-not-allowed"
//                     : "bg-blue-600 hover:bg-blue-700"
//                 }`}
//             >
//               {loading ? "Posting..." : "Post Job"}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { apiConnector } from "../services/apiConnector";
import { jobendpoints } from "../services/apis";
import Navbar from "../components/Navbar";

export default function PostJob() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.profile.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [job, setJob] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    salary: "",
    jobType: "Full-Time",
    skillsRequired: [],
    postedBy: user._id,
  });

  const [newSkill, setNewSkill] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await apiConnector("POST", jobendpoints.POST_JOB_API, job);
      setSuccess(true);
      setTimeout(() => {
        navigate("/jobs");
      }, 2000);
    } catch (error) {
      setError(error.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !job.skillsRequired.includes(newSkill.trim())) {
      setJob({
        ...job,
        skillsRequired: [...job.skillsRequired, newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setJob({
      ...job,
      skillsRequired: job.skillsRequired.filter(
        (skill) => skill !== skillToRemove
      ),
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
          <h2 className="text-3xl font-bold text-black mb-8 text-center">
            Post a New Job
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-600 rounded-lg">
              Job posted successfully! Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  value={job.title}
                  onChange={(e) => setJob({ ...job, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all"
                  required
                  placeholder="e.g. Senior Software Engineer"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  value={job.company}
                  onChange={(e) => setJob({ ...job, company: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all"
                  required
                  placeholder="e.g. Tech Solutions Inc."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={job.location}
                  onChange={(e) => setJob({ ...job, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all"
                  required
                  placeholder="e.g. New York, NY"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Salary (Annual)
                </label>
                <input
                  type="number"
                  value={job.salary}
                  onChange={(e) => setJob({ ...job, salary: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all"
                  placeholder="e.g. 80000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Job Type
              </label>
              <select
                value={job.jobType}
                onChange={(e) => setJob({ ...job, jobType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all bg-white"
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Job Description
              </label>
              <textarea
                value={job.description}
                onChange={(e) =>
                  setJob({ ...job, description: e.target.value })
                }
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all"
                required
                placeholder="Describe the role, responsibilities, and requirements..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Required Skills
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all"
                  placeholder="Add a skill (e.g. Python, React, SQL)"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {job.skillsRequired.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-2 text-gray-600 hover:text-black"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all
                ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-800"
                }`}
            >
              {loading ? "Posting..." : "Post Job"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

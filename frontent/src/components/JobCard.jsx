// import React, { useState } from "react";
// import {
//   FaMapMarkerAlt,
//   FaBriefcase,
//   FaMoneyBillWave,
//   FaTimes,
// } from "react-icons/fa";
// import { useSelector } from "react-redux";
// import { apiConnector } from "../services/apiConnector";
// import { applicationEndpoints } from "../services/apis";

// function ApplicationModal({ isOpen, onClose, job, onSuccess }) {
//   const user = useSelector((state) => state.profile.user);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [formData, setFormData] = useState({
//     resume: "",
//     coverLetter: "",
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const response = await apiConnector(
//         "POST",
//         applicationEndpoints.APPLY_JOB_API,
//         {
//           jobId: job._id,
//           candidate: user._id,
//           resume: formData.resume,
//           coverLetter: formData.coverLetter,
//         }
//       );

//       if (response.data.success) {
//         onSuccess();
//         onClose();
//       }
//     } catch (error) {
//       setError(error.response?.data?.message || "Failed to submit application");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
//         >
//           <FaTimes />
//         </button>

//         <h2 className="text-2xl font-bold mb-4">Apply for {job.title}</h2>
//         <p className="text-gray-600 mb-6">{job.company}</p>

//         {error && (
//           <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg border border-red-200">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Resume Link*
//             </label>
//             <input
//               type="url"
//               required
//               value={formData.resume}
//               onChange={(e) =>
//                 setFormData({ ...formData, resume: e.target.value })
//               }
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//               placeholder="Enter your resume URL (Google Drive, Dropbox, etc.)"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Cover Letter
//             </label>
//             <textarea
//               value={formData.coverLetter}
//               onChange={(e) =>
//                 setFormData({ ...formData, coverLetter: e.target.value })
//               }
//               rows="4"
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//               placeholder="Write a brief cover letter (optional)"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-2 px-4 rounded-lg text-white font-medium transition-all ${
//               loading
//                 ? "bg-blue-400 cursor-not-allowed"
//                 : "bg-blue-600 hover:bg-blue-700"
//             }`}
//           >
//             {loading ? "Submitting..." : "Submit Application"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// function JobCard({ job }) {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [applicationSuccess, setApplicationSuccess] = useState(false);

//   const handleApplyClick = () => {
//     setIsModalOpen(true);
//   };

//   const handleApplicationSuccess = () => {
//     setApplicationSuccess(true);
//     setTimeout(() => setApplicationSuccess(false), 3000);
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
//       <h2 className="text-xl font-semibold text-gray-800 mb-2">{job.title}</h2>
//       <p className="text-gray-600 mb-4">{job.company}</p>

//       <div className="space-y-2 mb-4">
//         <div className="flex items-center text-gray-600">
//           <FaMapMarkerAlt className="mr-2" />
//           <span>{job.location}</span>
//         </div>
//         <div className="flex items-center text-gray-600">
//           <FaBriefcase className="mr-2" />
//           <span>{job.jobType}</span>
//         </div>
//         {job.salary && (
//           <div className="flex items-center text-gray-600">
//             <FaMoneyBillWave className="mr-2" />
//             <span>${job.salary.toLocaleString()}/year</span>
//           </div>
//         )}
//       </div>

//       <div className="mb-4">
//         <h3 className="font-semibold text-gray-700 mb-2">Required Skills:</h3>
//         <div className="flex flex-wrap gap-2">
//           {job.skillsRequired.map((skill, index) => (
//             <span
//               key={index}
//               className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
//             >
//               {skill}
//             </span>
//           ))}
//         </div>
//       </div>

//       {applicationSuccess && (
//         <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg border border-green-200">
//           Application submitted successfully!
//         </div>
//       )}

//       <button
//         className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
//         onClick={handleApplyClick}
//       >
//         Apply Now
//       </button>

//       <ApplicationModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         job={job}
//         onSuccess={handleApplicationSuccess}
//       />
//     </div>
//   );
// }

// export default JobCard;

import React, { useState } from "react";
import {
  FaMapMarkerAlt,
  FaBriefcase,
  FaMoneyBillWave,
  FaTimes,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { apiConnector } from "../services/apiConnector";
import { applicationEndpoints } from "../services/apis";

function ApplicationModal({ isOpen, onClose, job, onSuccess }) {
  const user = useSelector((state) => state.profile.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    resume: "",
    coverLetter: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await apiConnector(
        "POST",
        applicationEndpoints.APPLY_JOB_API,
        {
          jobId: job._id,
          candidate: user._id,
          resume: formData.resume,
          coverLetter: formData.coverLetter,
        }
      );

      if (response.data.success) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors"
        >
          <FaTimes />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-black">{job.title}</h2>
        <p className="text-gray-600 mb-6">{job.company}</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resume Link*
            </label>
            <input
              type="url"
              required
              value={formData.resume}
              onChange={(e) =>
                setFormData({ ...formData, resume: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none"
              placeholder="Enter your resume URL (Google Drive, Dropbox, etc.)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cover Letter
            </label>
            <textarea
              value={formData.coverLetter}
              onChange={(e) =>
                setFormData({ ...formData, coverLetter: e.target.value })
              }
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none"
              placeholder="Write a brief cover letter (optional)"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-lg text-white font-medium transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-800"
            }`}
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}

function JobCard({ job }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);

  const handleApplyClick = () => {
    setIsModalOpen(true);
  };

  const handleApplicationSuccess = () => {
    setApplicationSuccess(true);
    setTimeout(() => setApplicationSuccess(false), 3000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow border border-gray-100">
      <h2 className="text-xl font-semibold text-black mb-2">{job.title}</h2>
      <p className="text-gray-600 mb-4">{job.company}</p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600">
          <FaMapMarkerAlt className="mr-2" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <FaBriefcase className="mr-2" />
          <span>{job.jobType}</span>
        </div>
        {job.salary && (
          <div className="flex items-center text-gray-600">
            <FaMoneyBillWave className="mr-2" />
            <span>₹{job.salary.toLocaleString()}/year</span>
          </div>
        )}
      </div>

      <div className="mb-4">
        <h3 className="font-semibold text-gray-700 mb-2">Required Skills:</h3>
        <div className="flex flex-wrap gap-2">
          {job.skillsRequired.map((skill, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full border border-gray-200"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {applicationSuccess && (
        <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg border border-green-200">
          Application submitted successfully!
        </div>
      )}

      <button
        className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
        onClick={handleApplyClick}
      >
        Apply Now
      </button>

      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        job={job}
        onSuccess={handleApplicationSuccess}
      />
    </div>
  );
}

export default JobCard;

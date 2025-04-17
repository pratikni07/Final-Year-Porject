// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { toast } from "react-hot-toast";
// import { apiConnector } from "../services/apiConnector";
// import { applicationEndpoints } from "../services/apis";
// import Navbar from "../components/Navbar";

// function Applications() {
//   const [applications, setApplications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const user = useSelector((state) => state.profile.user);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchApplications();
//   }, []);

//   const fetchApplications = async () => {
//     try {
//       const response = await apiConnector(
//         "POST",
//         `${applicationEndpoints.GET_APPLICAITION_BY_USERID}`,
//         { candidateId: user._id }
//       );

//       if (response.data.success) {
//         setApplications(response.data.applications);
//       } else {
//         toast.error("Failed to fetch applications");
//       }
//     } catch (error) {
//       toast.error(error.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Applied":
//         return "bg-yellow-100 text-yellow-800";
//       case "Shortlisted":
//         return "bg-blue-100 text-blue-800";
//       case "Rejected":
//         return "bg-red-100 text-red-800";
//       case "Hired":
//         return "bg-green-100 text-green-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   const getStageButton = (application) => {
//     switch (application.status) {
//       case "Applied":
//         return (
//           <div className="px-4 py-2 bg-gray-100 rounded text-gray-600 text-sm">
//             Application Submitted
//           </div>
//         );
//       case "Shortlisted":
//         return null; // No button for shortlisted
//       case "Interview":
//         return (
//           <button
//             onClick={() => navigate(`/interview/${application.job._id}`)}
//             className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm font-medium"
//           >
//             Take Interview →
//           </button>
//         );
//       case "Coding Round":
//         return (
//           <button
//             onClick={() => navigate(`/codeeditor/${application._id}`)}
//             className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm font-medium"
//           >
//             Take Coding Round →
//           </button>
//         );
//       default:
//         return null;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-100">
//         <Navbar />
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="animate-pulse space-y-6">
//             {[1, 2, 3].map((i) => (
//               <div key={i} className="bg-white rounded-lg shadow-md p-6">
//                 <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
//                 <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
//                 <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Navbar />
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-8">
//           My Applications
//         </h1>

//         {applications.length === 0 ? (
//           <div className="text-center py-12">
//             <p className="text-gray-600 text-lg mb-4">No applications found</p>
//             <Link
//               to="/jobs"
//               className="text-blue-600 hover:text-blue-800 font-medium"
//             >
//               Browse Jobs →
//             </Link>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {applications.map((application) => (
//               <div
//                 key={application._id}
//                 className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
//               >
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h2 className="text-xl font-semibold text-gray-900">
//                       {application.job.title}
//                     </h2>
//                     <p className="text-gray-600 mt-1">
//                       {application.job.company}
//                     </p>
//                   </div>
//                   <div className="flex items-center space-x-4">
//                     <span
//                       className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
//                         application.status
//                       )}`}
//                     >
//                       {application.status}
//                     </span>
//                     {getStageButton(application)}
//                   </div>
//                 </div>

//                 <div className="mt-4 space-y-2">
//                   <p className="text-sm text-gray-600">
//                     Applied on: {formatDate(application.createdAt)}
//                   </p>

//                   {application.resume && (
//                     <a
//                       href={application.resume}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
//                     >
//                       View Resume →
//                     </a>
//                   )}

//                   {application.coverLetter && (
//                     <p className="text-sm text-gray-600">
//                       <span className="font-medium">Cover Letter:</span>{" "}
//                       {application.coverLetter}
//                     </p>
//                   )}
//                 </div>

//                 <div className="mt-4">
//                   <Link
//                     to={`/jobs/${application.job._id}`}
//                     className="text-blue-600 hover:text-blue-800 text-sm font-medium"
//                   >
//                     View Job Details →
//                   </Link>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Applications;
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { apiConnector } from "../services/apiConnector";
import { applicationEndpoints } from "../services/apis";
import Navbar from "../components/Navbar";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.profile.user);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await apiConnector(
        "POST",
        `${applicationEndpoints.GET_APPLICAITION_BY_USERID}`,
        { candidateId: user._id }
      );
      if (response.data.success) {
        setApplications(response.data.applications);
      } else {
        toast.error("Failed to fetch applications");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Applied":
        return "bg-gray-100 text-gray-800 border border-gray-200";
      case "Shortlisted":
        return "bg-gray-800 text-white";
      case "Rejected":
        return "bg-black text-white";
      case "Hired":
        return "bg-gray-900 text-white";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStageButton = (application) => {
    const { job, status } = application;

    // Stage 1: Show "Applied"
    if (job.step === "stage1") {
      return (
        <div className="px-4 py-2 bg-gray-100 rounded text-gray-600 text-sm border border-gray-200">
          Applied
        </div>
      );
    }

    // Stage 2: Show "Take Coding Round"
    if (job.step === "stage2") {
      return (
        <button
          onClick={() => navigate(`/codeeditor/${application._id}`)}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors text-sm font-medium"
        >
          Take Coding Round →
        </button>
      );
    }

    // Stage 3: Show "Take Interview" if status is Interview
    if (job.step === "stage3" && status === "Interview") {
      return (
        <button
          onClick={() => navigate(`/interview/${job._id}`)}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors text-sm font-medium"
        >
          Take Interview →
        </button>
      );
    }

    // Default case: no button
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
              >
                <div className="h-6 bg-gray-100 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-100 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-black mb-8">My Applications</h1>
        {applications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">No applications found</p>
            <Link
              to="/jobs"
              className="text-black hover:text-gray-800 font-medium"
            >
              Browse Jobs →
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => (
              <div
                key={application._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-100"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-black">
                      {application.job.title}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {application.job.company}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        application.status
                      )}`}
                    >
                      {application.status}
                    </span>
                    {getStageButton(application)}
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-600">
                    Applied on: {formatDate(application.createdAt)}
                  </p>
                  {application.resume && (
                    <a
                      href={application.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-black hover:text-gray-800 flex items-center"
                    >
                      View Resume →
                    </a>
                  )}
                  {application.coverLetter && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Cover Letter:</span>{" "}
                      {application.coverLetter}
                    </p>
                  )}
                </div>
                <div className="mt-4">
                  <Link
                    to={`/jobs/${application.job._id}`}
                    className="text-black hover:text-gray-800 text-sm font-medium"
                  >
                    View Job Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Applications;

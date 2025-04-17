// import { useState, useEffect } from "react";

// import JobCard from "../components/JobCard";
// import Navbar from "../components/Navbar";
// import { jobendpoints } from "../services/apis";
// import { apiConnector } from "../services/apiConnector";

// function Home() {
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchJobs();
//   }, []);

//   const fetchJobs = async () => {
//     try {
//       const response = await apiConnector("GET", jobendpoints.GET_JOB_API);
//       console.log(response.data.jobs);
//       setJobs(response.data.jobs);
//     } catch (error) {
//       console.error("Error fetching jobs:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Navbar />
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-8">
//           Available Jobs
//         </h1>
//         {loading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {jobs.map((job) => (
//               <JobCard key={job.id} job={job} />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Home;

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import JobCard from "../components/JobCard";
import Navbar from "../components/Navbar";
import { jobendpoints } from "../services/apis";
import { apiConnector } from "../services/apiConnector";

function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await apiConnector("GET", jobendpoints.GET_JOB_API);
      setJobs(response.data.jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Dream Job
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Discover thousands of job opportunities with top companies
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative">
              <input
                type="text"
                placeholder="Search jobs by title or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 rounded-full shadow-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-500 bg-white"
              />
              <Search
                className="absolute right-4 top-4 text-gray-400"
                size={24}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-black">Available Positions</h2>
          <span className="text-gray-600">
            {filteredJobs.length} jobs found
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent"></div>
            <p className="text-gray-600">Loading amazing opportunities...</p>
          </div>
        ) : (
          <>
            {filteredJobs.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-xl font-medium text-black mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search terms or check back later
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer Section */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600">
            Find the perfect job that matches your skills and aspirations
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;

// import { useNavigate, Link } from "react-router-dom";

// function Navbar() {
//   const navigate = useNavigate();

//   const handleLogout = async () => {};

//   return (
//     <nav className="bg-white shadow-md">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           <div className="flex items-center space-x-4">
//             <Link to="/" className="text-xl font-bold text-blue-600">
//               JobPortal
//             </Link>
//             <Link to="/jobs" className="text-gray-600 hover:text-blue-600">
//               Jobs
//             </Link>
//             <Link
//               to="/applications"
//               className="text-gray-600 hover:text-blue-600"
//             >
//               Applications
//             </Link>
//             <Link to="/post-job" className="text-gray-600 hover:text-blue-600">
//               Post Job
//             </Link>
//           </div>
//           <div className="flex items-center space-x-4">
//             <Link to="/profile" className="text-gray-600 hover:text-blue-600">
//               Profile
//             </Link>
//             <button
//               onClick={handleLogout}
//               className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;

import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const user = useSelector((state) => state.profile.user);

  const handleLogout = async () => {};

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="text-xl font-bold text-black hover:text-gray-800"
            >
              JobPortal
            </Link>
            <Link
              to="/jobs"
              className="text-gray-600 hover:text-black transition-colors"
            >
              Jobs
            </Link>
            <Link
              to="/applications"
              className="text-gray-600 hover:text-black transition-colors"
            >
              Applications
            </Link>
            {user && user.accountType === "Instructor" && (
              <Link
                to="/post-job"
                className="text-gray-600 hover:text-black transition-colors"
              >
                Post Job
              </Link>
            )}
            {user && user.accountType === "Instructor" && (
              <Link
                to="/myjob"
                className="text-gray-600 hover:text-black transition-colors"
              >
                My Jobs
              </Link>
            )}
          </div>
          <div className="flex items-center space-x-6">
            <Link
              to="/profile"
              className="text-gray-600 hover:text-black transition-colors"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

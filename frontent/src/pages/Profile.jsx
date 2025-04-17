import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserCircle,
  Phone,
  Calendar,
  Users,
  Briefcase,
  Star,
  Info,
} from "lucide-react";
import Navbar from "../components/Navbar";

function Profile() {
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const {
    firstName,
    lastName,
    email,
    accountType,
    image,
    additionalDetails = {},
  } = user;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 transform transition-all hover:scale-[1.01]">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            {image ? (
              <img
                src={image}
                alt={`${firstName} ${lastName}`}
                className="h-24 w-24 rounded-full border-4 border-gray-100 shadow-md"
              />
            ) : (
              <UserCircle className="h-24 w-24 text-gray-400" />
            )}
            <div className="text-center sm:text-left">
              <h2 className="text-3xl font-bold text-black">
                {firstName} {lastName}
              </h2>
              <p className="text-gray-600 mt-1">{email}</p>
              <span className="inline-block bg-black text-white text-sm px-4 py-1.5 rounded-full mt-2">
                {accountType}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-all hover:scale-[1.01]">
              <div className="flex items-center space-x-2 mb-6">
                <Info className="h-6 w-6 text-black" />
                <h3 className="text-xl font-bold text-black">
                  Personal Information
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Contact</p>
                    <p className="text-black">
                      {additionalDetails.contactNumber || "Not provided"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Date of Birth
                    </p>
                    <p className="text-black">
                      {additionalDetails.dateOfBirth || "Not provided"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Gender</p>
                    <p className="text-black">
                      {additionalDetails.gender || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 h-full transform transition-all hover:scale-[1.01]">
              <div className="flex items-center space-x-2 mb-4">
                <UserCircle className="h-6 w-6 text-black" />
                <h3 className="text-xl font-bold text-black">About</h3>
              </div>
              <p className="text-gray-700">
                {additionalDetails.about || "No information provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Applied Jobs Section */}
        {additionalDetails.appliedJob &&
          additionalDetails.appliedJob.length > 0 && (
            <div className="mt-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-all hover:scale-[1.01]">
                <div className="flex items-center space-x-2 mb-6">
                  <Briefcase className="h-6 w-6 text-black" />
                  <h3 className="text-xl font-bold text-black">Applied Jobs</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {additionalDetails.appliedJob.map((job, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      <p className="text-gray-900">{job}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        {/* Shortlisted Section */}
        {additionalDetails.shortlisted &&
          additionalDetails.shortlisted.length > 0 && (
            <div className="mt-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-all hover:scale-[1.01]">
                <div className="flex items-center space-x-2 mb-6">
                  <Star className="h-6 w-6 text-black" />
                  <h3 className="text-xl font-bold text-black">Shortlisted</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {additionalDetails.shortlisted.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      <p className="text-gray-900">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

export default Profile;

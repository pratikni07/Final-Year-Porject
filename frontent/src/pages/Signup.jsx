import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Mail, Lock, User, ArrowRight, Send } from "lucide-react";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Implement your signup logic here
      setShowOtpInput(true);
      toast.success("Please check your email for OTP");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const verifyOtp = async () => {
    try {
      // Implement OTP verification here
      toast.success("Email verified successfully!");
      navigate("/login");
    } catch (error) {
      toast.error("Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8 transform transition-all hover:scale-[1.01]">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-black">Create Account</h2>
          <p className="text-gray-600 mt-2">
            Please fill in your details to sign up
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                First Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-colors text-black placeholder-gray-400"
                  placeholder="First"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Last Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-colors text-black placeholder-gray-400"
                  placeholder="Last"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-colors text-black placeholder-gray-400"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-colors text-black placeholder-gray-400"
                placeholder="Create a password"
                required
              />
            </div>
          </div>

          {showOtpInput ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-colors text-black placeholder-gray-400"
                  placeholder="Enter OTP sent to your email"
                  required
                />
              </div>
              <button
                type="button"
                onClick={verifyOtp}
                className="w-full bg-black text-white py-3 px-4 rounded-xl hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors flex items-center justify-center space-x-2 group"
              >
                <span>Verify OTP</span>
                <Send className="h-5 w-5 transform transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          ) : (
            <button
              type="submit"
              className="w-full bg-black text-white py-3 px-4 rounded-xl hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors flex items-center justify-center space-x-2 group"
            >
              <span>Create Account</span>
              <ArrowRight className="h-5 w-5 transform transition-transform group-hover:translate-x-1" />
            </button>
          )}
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-black font-medium hover:underline transition-all"
            >
              Sign In
            </Link>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-center space-x-4">
            <button className="text-sm text-gray-600 hover:text-black transition-colors">
              Privacy Policy
            </button>
            <span className="text-gray-300">•</span>
            <button className="text-sm text-gray-600 hover:text-black transition-colors">
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;

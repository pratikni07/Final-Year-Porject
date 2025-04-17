import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../services/operations/authAPI";
import { Mail, Lock, ArrowRight } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData.email, formData.password, navigate));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8 transform transition-all hover:scale-[1.01]">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-black">Welcome Back</h2>
          <p className="text-gray-600 mt-2">
            Please enter your details to sign in
          </p>
        </div>

        <form onSubmit={handleOnSubmit} className="space-y-6">
          <div className="space-y-4">
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
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 px-4 rounded-xl hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors flex items-center justify-center space-x-2 group"
          >
            <span>Sign In</span>
            <ArrowRight className="h-5 w-5 transform transition-transform group-hover:translate-x-1" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-black font-medium hover:underline transition-all"
            >
              Create Account
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

export default Login;

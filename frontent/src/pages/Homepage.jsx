import React from "react";
import {
  Briefcase,
  Building2,
  Users,
  TrendingUp,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import Navbar from "../components/Navbar";

const Homepage = () => {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-black">
        <div className="container mx-auto px-4 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Find Your Dream Job Today
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Connect with top companies and discover opportunities that match
              your skills
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-black px-8 py-3 rounded-md hover:bg-gray-200 transition font-semibold">
                Get Started
              </button>
              <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-md hover:bg-white hover:text-black transition font-semibold">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 text-center">
            <div className="inline-block p-3 bg-gray-800 rounded-full mb-4">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">10,000+</h3>
            <p className="text-gray-400">Active Job Listings</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 text-center">
            <div className="inline-block p-3 bg-gray-800 rounded-full mb-4">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">5,000+</h3>
            <p className="text-gray-400">Companies</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 text-center">
            <div className="inline-block p-3 bg-gray-800 rounded-full mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">1M+</h3>
            <p className="text-gray-400">Active Users</p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-white mb-12">
          Why Choose Our Platform
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="mb-4">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Career Growth
            </h3>
            <p className="text-gray-400">
              Access top opportunities from leading companies and advance your
              career
            </p>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Professional Network
            </h3>
            <p className="text-gray-400">
              Connect with industry professionals and expand your network
            </p>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="mb-4">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Personalized Matches
            </h3>
            <p className="text-gray-400">
              Get job recommendations that match your skills and preferences
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 border-t border-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-white">
              Ready to Start Your Job Search?
            </h2>
            <p className="text-gray-400 mb-8">
              Join thousands of professionals who've found their dream jobs
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button className="bg-white text-black px-8 py-3 rounded-md hover:bg-gray-200 transition">
                Post a Job
              </button>
              <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-md hover:bg-white hover:text-black transition">
                Upload Resume
              </button>
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-gray-900 border-t border-gray-800 pt-12">
        <div className="container mx-auto px-4">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8">
            {/* Company Info */}
            <div>
              <h3 className="text-white text-xl font-bold mb-4">JobPortal</h3>
              <p className="text-gray-400 mb-4">
                Connecting talented professionals with amazing opportunities
                worldwide.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Find Jobs
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Post a Job
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Create Resume
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Career Advice
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Browse Companies
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">
                Resources
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">
                Contact Us
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-400">
                  <Mail className="w-5 h-5" />
                  <span>support@jobportal.com</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <Phone className="w-5 h-5" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <MapPin className="w-5 h-5" />
                  <span>
                    123 Business Ave, Suite 100
                    <br />
                    New York, NY 10001
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-800 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
              <p>© 2025 JobPortal. All rights reserved.</p>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <a href="#" className="hover:text-white transition">
                  Privacy
                </a>
                <a href="#" className="hover:text-white transition">
                  Terms
                </a>
                <a href="#" className="hover:text-white transition">
                  Cookies
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;

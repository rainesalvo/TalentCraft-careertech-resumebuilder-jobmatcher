import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

function Home() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
    } else {
      // Simulate loading for animation
      setTimeout(() => setIsLoading(false), 800);
    }
  }, [navigate]);

  // Card animations
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Main Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden border border-white/50"
          >
            {/* Header Section */}
            <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 p-8 md:p-12 text-center">
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-white/10"></div>
                <div className="absolute -bottom-16 -right-16 w-32 h-32 rounded-full bg-white/10"></div>
                <div className="absolute top-1/3 right-1/4 w-12 h-12 rounded-full bg-white/20"></div>
              </div>
              
              <div className="relative z-10 flex flex-col items-center justify-center">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/20 backdrop-blur-md p-3 rounded-full inline-block mb-6"
                >
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-full">
                    <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                  </div>
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight"
                >
                  Welcome to TalentCraft
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-blue-100 font-medium max-w-md mx-auto"
                >
                  Your professional career companion
                </motion.p>
              </div>
            </div>
            
            {/* Content Section */}
            <div className="p-6 md:p-10">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center mb-10 md:mb-12"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-2">You are now authenticated</h2>
                <p className="text-gray-600 font-medium">What would you like to do today?</p>
              </motion.div>
              
              {/* Action Grid */}
              <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {/* Upload Resume Card */}
                <motion.div variants={item}>
                  <Link
                    to="/upload"
                    className="group block h-full bg-gradient-to-br from-white to-blue-50 hover:from-blue-50 hover:to-blue-100 border border-blue-100 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 relative overflow-hidden"
                  >
                    <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full bg-blue-100 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <div className="flex items-start">
                      <div className="bg-blue-600 p-2.5 rounded-lg mr-4 group-hover:bg-blue-700 transition-colors">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"></path>
                        </svg>
                      </div>
                      <div className="text-left">
                        <span className="block font-bold text-gray-800 group-hover:text-blue-700 transition-colors">Upload Your Resume</span>
                        <span className="block text-sm text-gray-600 mt-1">Parse and extract your skills and experience</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>

                {/* Training Dashboard Card */}
                <motion.div variants={item}>
                  <Link
                    to="/training"
                    className="group block h-full bg-gradient-to-br from-white to-orange-50 hover:from-orange-50 hover:to-orange-100 border border-orange-100 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 relative overflow-hidden"
                  >
                    <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full bg-orange-100 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <div className="flex items-start">
                      <div className="bg-orange-600 p-2.5 rounded-lg mr-4 group-hover:bg-orange-700 transition-colors">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422A12.083 12.083 0 0112 21.5 12.083 12.083 0 015.84 10.578L12 14z"></path>
                        </svg>
                      </div>
                      <div className="text-left">
                        <span className="block font-bold text-gray-800 group-hover:text-orange-700 transition-colors">Special Training</span>
                        <span className="block text-sm text-gray-600 mt-1">Close skill gaps with guided modules</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
                
                {/* Job Matches Card */}
                <motion.div variants={item}>
                  <Link
                    to="/job-matches"
                    className="group block h-full bg-gradient-to-br from-white to-green-50 hover:from-green-50 hover:to-green-100 border border-green-100 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 relative overflow-hidden"
                  >
                    <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full bg-green-100 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <div className="flex items-start">
                      <div className="bg-green-600 p-2.5 rounded-lg mr-4 group-hover:bg-green-700 transition-colors">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                      <div className="text-left">
                        <span className="block font-bold text-gray-800 group-hover:text-green-700 transition-colors">View Matching Jobs</span>
                        <span className="block text-sm text-gray-600 mt-1">Find positions that match your profile</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
                
                {/* Manage Profiles Card */}
                <motion.div variants={item}>
                  <Link
                    to="/profiles"
                    className="group block h-full bg-gradient-to-br from-white to-indigo-50 hover:from-indigo-50 hover:to-indigo-100 border border-indigo-100 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 relative overflow-hidden"
                  >
                    <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full bg-indigo-100 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <div className="flex items-start">
                      <div className="bg-indigo-600 p-2.5 rounded-lg mr-4 group-hover:bg-indigo-700 transition-colors">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path>
                        </svg>
                      </div>
                      <div className="text-left">
                        <span className="block font-bold text-gray-800 group-hover:text-indigo-700 transition-colors">Manage Profiles</span>
                        <span className="block text-sm text-gray-600 mt-1">Select and update your profile</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
                
                {/* Resume Builder Card */}
                <motion.div variants={item}>
                  <Link
                    to="/ResumeBuilder"
                    className="group block h-full bg-gradient-to-br from-white to-purple-50 hover:from-purple-50 hover:to-purple-100 border border-purple-100 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 relative overflow-hidden"
                  >
                    <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full bg-purple-100 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <div className="flex items-start">
                      <div className="bg-purple-600 p-2.5 rounded-lg mr-4 group-hover:bg-purple-700 transition-colors">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h2"></path>
                        </svg>
                      </div>
                      <div className="text-left">
                        <span className="block font-bold text-gray-800 group-hover:text-purple-700 transition-colors">Resume Builder</span>
                        <span className="block text-sm text-gray-600 mt-1">Build a professional resume quickly</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
                
                {/* HR Interview Card */}
                <motion.div variants={item}>
                  <Link
                    to="/HR"
                    className="group block h-full bg-gradient-to-br from-white to-blue-50 hover:from-blue-50 hover:to-blue-100 border border-blue-100 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 relative overflow-hidden"
                  >
                    <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full bg-blue-100 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <div className="flex items-start">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2.5 rounded-lg mr-4">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5.121 17.804A5.002 5.002 0 0110 15h4a5.002 5.002 0 014.879 2.804M15 11a3 3 0 10-6 0 3 3 0 006 0z"
                          />
                        </svg>
                      </div>
                      <div className="text-left">
                        <span className="block font-bold text-gray-800 group-hover:text-blue-700 transition-colors">HR Interview Practice</span>
                        <span className="block text-sm text-gray-600 mt-1">Practice with 100+ HR Questions</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
                
                {/* Profile Card */}
                <motion.div variants={item}>
                  <Link
                    to="/me"
                    className="group block h-full bg-gradient-to-br from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 relative overflow-hidden"
                  >
                    <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full bg-gray-100 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <div className="flex items-start">
                      <div className="bg-gray-600 p-2.5 rounded-lg mr-4 group-hover:bg-gray-700 transition-colors">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A9.953 9.953 0 0112 15c2.21 0 4.245.713 5.879 1.904M15 10a3 3 0 11-6 0 3 3 0 016 0zM12 2a10 10 0 100 20 10 10 0 000-20z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <span className="block font-bold text-gray-800 group-hover:text-gray-700 transition-colors">My Profile</span>
                        <span className="block text-sm text-gray-600 mt-1">View and manage your account</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </motion.div>
              
              {/* Sign Out Section */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-12 pt-8 border-t border-gray-200 text-center"
              >
                <button
                  onClick={() => {
                    localStorage.removeItem("access_token");
                    navigate("/");
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-white to-gray-50 hover:from-red-50 hover:to-red-100 border border-gray-300 rounded-xl text-gray-700 font-medium transition-all duration-300 hover:shadow-md hover:border-red-200 hover:text-red-600 flex items-center justify-center mx-auto"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                  Sign Out
                </button>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Footer */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-8 text-center text-gray-500 text-sm"
          >
            <p>&copy; 2025 TalentCraft. All rights reserved.</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Home;
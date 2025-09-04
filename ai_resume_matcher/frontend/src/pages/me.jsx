"use client"

import { useState, useEffect } from "react"
import axiosInstance from "../api/axiosInstance"
import { User, Mail, Calendar, Loader2 } from "lucide-react"
import { Link } from "react-router-dom"

function Me() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get("/user/me/")
        console.log(response.data)
        setUser(response.data)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  if (loading) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 animate-pulse">
      {/* Fixed Loader Circle */}
      <div className="relative w-44 h-44  overflow-hidden transition-all duration-500">
        <div className="absolute inset-0 bg-blue-400 blur-xl opacity-20 animate-ping"></div>
        <Loader2 className="w-16 h-16 text-blue-600 animate-spin relative z-10 mx-auto my-auto" />
      </div>

      <p className="mt-6 text-xl font-semibold text-gray-700 animate-fade-in">Loading your profile...</p>
      <div className="mt-2 w-48 h-1 bg-gray-200 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 animate-pulse"></div>
      </div>
    </div>
  )
}


  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="p-10 text-center bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 transform hover:scale-105 transition-all duration-300">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800 mb-2">User not found</p>
          <p className="text-gray-600 mb-6">Please log in to view your profile.</p>
          <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4 animate-fade-in">
      <div className="flex justify-center">
        <div className="w-full max-w-4xl bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20 transform hover:shadow-3xl transition-all duration-500">
          {/* Header Section */}
          <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 py-8 px-8 overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
            <h1 className="text-3xl font-bold text-white relative z-10 animate-slide-down">Your Profile</h1>
            <p className="text-blue-100 mt-2 relative z-10 animate-slide-down animation-delay-100">
              Manage your account information
            </p>
          </div>

          <div className="flex flex-col lg:flex-row">
            {/* Profile Image Section */}
            <div className="p-8 flex flex-col items-center bg-gradient-to-b from-gray-50 to-white lg:w-80">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="relative w-44 h-44 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full overflow-hidden border-4 border-white shadow-2xl transform group-hover:scale-105 transition-all duration-300">
                  <img
                    src="/p.avif"
                    alt="Profile"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              </div>

              <div className="mt-6 px-6 py-3 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full text-sm font-semibold text-center shadow-lg border border-green-200 animate-bounce-subtle">
                <div className="flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Account Active
                </div>
              </div>
            </div>

            {/* User Information Section */}
            <div className="flex-1 p-8">
              <div className="space-y-8">
                {/* Username */}
                <div className="group p-6 rounded-2xl bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-xl mr-4 group-hover:bg-blue-200 transition-colors duration-200">
                      <User className="text-blue-600 w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <span className="text-gray-500 font-medium text-sm uppercase tracking-wide">Username</span>
                      <p className="font-bold text-gray-800 text-lg mt-1">{user.username}</p>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="group p-6 rounded-2xl bg-gradient-to-r from-gray-50 to-indigo-50 border border-gray-100 hover:border-indigo-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center">
                    <div className="p-3 bg-indigo-100 rounded-xl mr-4 group-hover:bg-indigo-200 transition-colors duration-200">
                      <Mail className="text-indigo-600 w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <span className="text-gray-500 font-medium text-sm uppercase tracking-wide">Email Address</span>
                      <p className="font-bold text-gray-800 text-lg mt-1 break-all">{user.email}</p>
                    </div>
                  </div>
                </div>

                {/* Date Joined */}
                <div className="group p-6 rounded-2xl bg-gradient-to-r from-gray-50 to-purple-50 border border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 rounded-xl mr-4 group-hover:bg-purple-200 transition-colors duration-200">
                      <Calendar className="text-purple-600 w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <span className="text-gray-500 font-medium text-sm uppercase tracking-wide">Member Since</span>
                      <p className="font-bold text-gray-800 text-lg mt-1">
                        {new Date(user.date_joined).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-10 pt-8 border-t border-gray-200">
                <div className="flex flex-wrap gap-4">
                  <Link to="/home" className="flex-1 min-w-fit">
                    <button className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300">
                      <span className="flex items-center justify-center">
                        View Home
                        <svg
                          className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </span>
                    </button>
                  </Link>

                  <Link to="/profiles" className="flex-1 min-w-fit">
                    <button className="w-full px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-semibold hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-300">
                      <span className="flex items-center justify-center">
                        My Profiles
                        <svg
                          className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
  /* Fade in for subtle appearance */
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  /* Slide down for header elements */
  @keyframes slide-down {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Subtle bounce for status indicators */
  @keyframes bounce-subtle {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-2px);
    }
  }

  /* Utility animation classes */
  .animate-fade-in {
    animation: fade-in 0.5s ease-out forwards;
  }

  .animate-slide-down {
    animation: slide-down 0.6s ease-out forwards;
  }

  .animation-delay-100 {
    animation-delay: 0.1s;
  }

  .animate-bounce-subtle {
    animation: bounce-subtle 3s ease-in-out infinite;
  }

  .shadow-3xl {
    box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
  }
`}</style>

    </div>
  )
}

export default Me
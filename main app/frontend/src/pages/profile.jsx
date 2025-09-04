import { useState, useEffect } from "react"
import axiosInstance from "../api/axiosInstance"
import { jwtDecode } from "jwt-decode"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"

const Profile = () => {
  const [profiles, setProfile] = useState([])
  const [currentProfile, setCurrentProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const token = localStorage.getItem("access_token")

  useEffect(() => {
    if (!token) {
      setError("No token found. Please log in.")
      setLoading(false)
      return
    }

    const decoded = jwtDecode(token)
    if (decoded.exp * 1000 < Date.now()) {
      setError("Your session has expired. Please log in again.")
      setLoading(false)
      return
    }

    fetchProfile()
  }, [token])

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get("/profiles/")
      console.log("response", response.data)
      setProfile(response.data)
    } catch (error) {
      setError("Failed to fetch profiles.")
    } finally {
      setLoading(false)
    }
  }

  const handleChooseProfile = async (profileId) => {
    try {
      await axiosInstance.post("/set-current-profile/", {
        profile_id: profileId,
      })
      const selected = profiles.find((p) => p.id === Number.parseInt(profileId))
      setCurrentProfile(selected)
    } catch (error) {
      setError("Failed to set current profile.")
    }
  }

  const ProfileSection = ({ title, content }) => {
    if (!content) return null
    return (
      <div className="mb-8 group">
        <h4 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center">
          <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-3 group-hover:h-6 transition-all duration-300"></div>
          {title}
        </h4>
        <div className="text-slate-700 leading-relaxed pl-4 border-l-2 border-slate-100 hover:border-blue-200 transition-colors duration-300">
          {content}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 py-8 px-4">
      <div className="container mx-auto">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 animate-fade-in bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-blue-100/50 p-8 border border-white/20 mb-8 hover:shadow-2xl hover:shadow-blue-200/30 transition-all duration-500 transform">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl lg:text-5xl font-bold text-indigo-600 bg-clip-text mb-3 pb-2">
                Profile Management
              </h1>
              <p className="text-slate-600 text-lg font-medium">Select and manage your professional profiles</p>
            </div>
            <div className="flex justify-start lg:justify-end">
              <Link
                to="/home"
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span>Back to Dashboard</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>

          {/* Main Content */}
          {loading ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-16 flex justify-center items-center animate-pulse-gentle">
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin"></div>
                  <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
                </div>
                <span className="text-xl font-semibold text-slate-700 ml-4">Loading profiles...</span>
              </div>
            </div>
          ) : error ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-red-100 p-8 border-l-8 border-l-red-500 animate-slide-up">
              <div className="flex items-start">
                <div className="bg-red-100 rounded-full p-3 mr-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Something went wrong</h3>
                  <p className="text-slate-600 mb-4">{error}</p>
                  <Link
                    to="/login"
                    className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-200"
                  >
                    Go to Login
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Profile Selection Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-500 animate-slide-up">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm"></div>
                  <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-2">Profile Selection</h2>
                    <p className="text-blue-100 font-medium">Choose which profile to use for job matching</p>
                  </div>
                  <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full"></div>
                  <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/5 rounded-full"></div>
                </div>

                <div className="p-8">
                  {profiles.length === 0 ? (
                    <div className="text-center py-12 animate-fade-in">
                      <div className="bg-gradient-to-br from-slate-100 to-blue-50 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                        <svg className="h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                          ></path>
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-3">No profiles available</h3>
                      <p className="text-slate-600 mb-6 text-lg">Upload a resume to create your first profile</p>
                      <Link
                        to="/upload"
                        className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                      >
                        Upload Resume
                      </Link>
                    </div>
                  ) : (
                    <div className="animate-fade-in">
                      <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">
                        Select a profile
                      </label>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                        <div className="relative flex-grow">
                          <select
                            className="block w-full pl-4 pr-12 py-4 text-base border-2 border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 rounded-2xl shadow-sm bg-white hover:border-slate-300 transition-all duration-300 appearance-none cursor-pointer"
                            onChange={(e) => handleChooseProfile(e.target.value)}
                            value={currentProfile?.id || ""}
                          >
                            <option value="" disabled>
                              -- Select Profile --
                            </option>
                            {profiles.map((profile) => (
                              <option key={profile.id} value={profile.id}>
                                {profile.name}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                        <Link
                          to="/upload"
                          className="inline-flex items-center px-6 py-4 border-2 border-slate-200 shadow-sm text-base font-semibold rounded-2xl text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 transform hover:-translate-y-0.5"
                        >
                          <svg className="-ml-1 mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            ></path>
                          </svg>
                          Add New
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Current Profile Display */}
              {currentProfile && (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-500 animate-slide-up">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm"></div>
                    <div className="relative z-10">
                      <h2 className="text-2xl font-bold mb-2">{currentProfile.name}'s Profile</h2>
                      <p className="text-purple-100 font-medium">Currently selected profile</p>
                    </div>
                    <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full"></div>
                    <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/5 rounded-full"></div>
                  </div>

                  <div className="p-8">
                    {/* Profile Header */}
                    <div className="flex items-center mb-8 pb-6 border-b-2 border-slate-100">
                      <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-4 mr-6 shadow-lg">
                        <svg
                          className="h-10 w-10 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          ></path>
                        </svg>
                      </div>
                      <div className="flex-grow">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-3">
                          <h3 className="text-2xl font-bold text-slate-800">{currentProfile.name}</h3>
                          {currentProfile.email && (
                            <span className="inline-flex items-center bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-sm px-4 py-2 rounded-full font-semibold shadow-sm">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                              Active Profile
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:gap-8 space-y-2 sm:space-y-0">
                          {currentProfile.email && (
                            <a
                              href={`mailto:${currentProfile.email}`}
                              className="text-blue-600 hover:text-blue-800 flex items-center font-medium transition-colors duration-200 group"
                            >
                              <div className="bg-blue-100 rounded-lg p-1 mr-3 group-hover:bg-blue-200 transition-colors duration-200">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                  ></path>
                                </svg>
                              </div>
                              {currentProfile.email}
                            </a>
                          )}
                          {currentProfile.phone && (
                            <span className="text-slate-600 flex items-center font-medium">
                              <div className="bg-slate-100 rounded-lg p-1 mr-3">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                  ></path>
                                </svg>
                              </div>
                              {currentProfile.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Profile Details Grid */}
                    <div className="grid lg:grid-cols-2 gap-x-12 gap-y-6">
                      <div className="lg:col-span-2">
                        <ProfileSection title="Professional Summary" content={currentProfile.summery} />
                      </div>
                      <ProfileSection title="Skills" content={currentProfile.skills} />
                      <ProfileSection title="Education" content={currentProfile.education} />
                      <div className="lg:col-span-2">
                        <ProfileSection title="Experience" content={currentProfile.expirence} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 animate-fade-in">
                <Link
                  to="/upload"
                  className="px-8 py-4 text-slate-700 bg-white/80 backdrop-blur-sm border-2 border-slate-200 rounded-2xl shadow-lg hover:shadow-xl font-semibold transition-all duration-300 transform hover:-translate-y-0.5 hover:border-slate-300 text-center"
                >
                  Upload New Resume
                </Link>

                {currentProfile && (
                  <Link
                    to="/job-matcher"
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                      ></path>
                    </svg>
                    Go to Job Matcher
                  </Link>
                )}
              </div>
            </div>
          )}
          <footer className="mt-20 text-center py-6 border-t border-slate-200">
            <p className="text-slate-600 font-medium">
              © {2025} TalentCraft. All rights reserved.
            </p>
          </footer>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-gentle {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }

        .animate-pulse-gentle {
          animation: pulse-gentle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default Profile

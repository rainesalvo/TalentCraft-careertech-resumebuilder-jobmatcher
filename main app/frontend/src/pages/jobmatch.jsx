import { useState } from "react"
import axiosInstance from "../api/axiosInstance"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react";

const JobMatcher = () => {
  const [jobDsc, setJobDsc] = useState("")
  const [matchResult, setMatchResult] = useState("")
  const [suggested, setSuggested] = useState(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (!jobDsc.trim()) {
      setError("Please enter a job description")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await axiosInstance.post("/match/match-job-description/", {
        job_description: jobDsc,
      })
      setMatchResult(response.data)
      const suggest = await axiosInstance.post('/training/suggest/', { job_description: jobDsc })
      setSuggested(suggest.data)
      setError("")
    } catch (err) {
      setError("Error matching job description. Please try again.")
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return "from-emerald-500 to-green-600"
    if (percentage >= 60) return "from-amber-500 to-orange-600"
    return "from-red-500 to-rose-600"
  }

  const getScoreTextColor = (percentage) => {
    if (percentage >= 80) return "text-emerald-600"
    if (percentage >= 60) return "text-amber-600"
    return "text-red-600"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-blue-100/50 p-8 border border-white/20 mb-8 hover:shadow-2xl hover:shadow-blue-200/30 transition-all duration-500 transform">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-indigo-600 bg-clip-text mb-3">
                Job Description Matcher
              </h2>
              <p className="text-slate-600 text-md font-medium">
                Analyze how well your profile matches job requirements
              </p>
            </div>
            {/* Back to Dashboard */}
          <div className="flex justify-end mt-4">
              <Link
                to="/home"
                className="group inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-2xl font-semibold transition-all duration-300 shadow-md"
              >
                <span>Back to Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>

          
        </div>

        {/* Main Content Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-500 animate-slide-up">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">Job Analysis</h3>
              <p className="text-blue-100 font-medium">Paste your job description below for instant matching</p>
            </div>
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full"></div>
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/5 rounded-full"></div>
          </div>

          <div className="p-8">
            {/* Job Description Input */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">
                Paste Job Description
              </label>
              <div className="relative">
                <textarea
                  value={jobDsc}
                  onChange={(e) => setJobDsc(e.target.value)}
                  className="w-full p-6 border-2 border-slate-200 rounded-2xl mb-6 h-64 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 resize-none bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-slate-300 text-slate-700 placeholder-slate-400"
                  placeholder="Paste the complete job description here including requirements, responsibilities, and qualifications..."
                />
                <div className="absolute bottom-8 right-6 text-sm text-slate-400 font-medium">
                  {jobDsc.length} characters
                </div>
              </div>

              {jobDsc.trim() && (
                <div className="animate-fade-in">
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className={`group relative overflow-hidden px-8 py-4 rounded-2xl text-white font-semibold text-lg shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 ${
                      isLoading
                        ? "bg-slate-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      {isLoading ? (
                        <>
                          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                          <span>Analyzing Match...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                            ></path>
                          </svg>
                          <span>Match Job Description</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-2xl text-red-700 animate-slide-up">
                <div className="flex items-center">
                  <div className="bg-red-100 rounded-full p-2 mr-4">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Error</h4>
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Match Results */}
            {matchResult && (
              <div className="space-y-8 animate-slide-up">
                {/* Match Score Card */}
                <div className="bg-gradient-to-br from-white to-slate-50 p-8 border-2 border-slate-100 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                    <div className="mb-4 lg:mb-0">
                      <h3 className="text-2xl font-bold text-slate-800 mb-2">Match Analysis</h3>
                      <p className="text-slate-600">Your profile compatibility score</p>
                    </div>
                    <div className="flex items-center">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-slate-200 to-slate-300 flex items-center justify-center">
                          <div
                            className={`w-20 h-20 rounded-full bg-gradient-to-r ${getScoreColor(
                              matchResult.match_percentage,
                            )} flex items-center justify-center shadow-lg`}
                          >
                            <span className="text-2xl font-bold text-white">{matchResult.match_percentage}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Match Reasons */}
                  <div className="mb-6">
                    <h4 className="text-lg font-bold text-slate-700 mb-4 flex items-center">
                      <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full mr-3"></div>
                      Match Strengths
                    </h4>
                    <div className="space-y-3">
                      {matchResult.reasons &&
                        matchResult.reasons.map((reason, idx) => (
                          <div
                            key={idx}
                            className="flex items-start p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:shadow-md transition-all duration-300"
                          >
                            <div className="bg-gradient-to-r from-green-500 to-emerald-600 w-3 h-3 rounded-full mr-4 mt-2 flex-shrink-0 shadow-sm"></div>
                            <span className="text-slate-700 font-medium leading-relaxed">{reason}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Missing Skills Card */}
                {matchResult.missing_skills && matchResult.missing_skills.length > 0 && (
                  <div className="bg-gradient-to-br from-white to-slate-50 p-8 border-2 border-slate-100 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <h4 className="text-lg font-bold text-slate-700 mb-6 flex items-center">
                      <div className="w-1 h-6 bg-gradient-to-b from-red-500 to-rose-600 rounded-full mr-3"></div>
                      Skills to Develop
                    </h4>
                    <div className="space-y-3">
                      {matchResult.missing_skills.map((skill, idx) => (
                        <div
                          key={idx}
                          className="flex items-start p-4 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl border border-red-100 hover:shadow-md transition-all duration-300"
                        >
                          <div className="bg-gradient-to-r from-red-500 to-rose-600 w-3 h-3 rounded-full mr-4 mt-2 flex-shrink-0 shadow-sm"></div>
                          <span className="text-slate-700 font-medium leading-relaxed">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Improvement Suggestions Card */}
                {matchResult.suggestions && matchResult.suggestions.length > 0 && (
                  <div className="bg-gradient-to-br from-white to-slate-50 p-8 border-2 border-slate-100 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <h4 className="text-lg font-bold text-slate-700 mb-6 flex items-center">
                      <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-3"></div>
                      Improvement Recommendations
                    </h4>
                    <div className="space-y-3">
                      {matchResult.suggestions.map((tip, idx) => (
                        <div
                          key={idx}
                          className="flex items-start p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100 hover:shadow-md transition-all duration-300"
                        >
                          <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-3 h-3 rounded-full mr-4 mt-2 flex-shrink-0 shadow-sm"></div>
                          <span className="text-slate-700 font-medium leading-relaxed">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Training */}
                {suggested && (
                  <div className="bg-white/90 backdrop-blur-sm border-2 border-blue-100 rounded-3xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-bold text-slate-700">Suggested Training</h4>
                      <a href="/training" className="text-blue-600 text-sm">Open Training</a>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                      {suggested.suggested_modules?.slice(0,4).map((m) => (
                        <div key={m.id} className="p-3 border rounded-xl">
                          <div className="font-medium text-gray-800">{m.title}</div>
                          <div className="text-xs text-gray-500 capitalize">{m.level}</div>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {(m.skills_covered||[]).slice(0,4).map(s => (
                              <span key={s} className="px-2 py-0.5 text-[10px] bg-blue-50 text-blue-700 rounded">{s}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                      {(!suggested.suggested_modules || suggested.suggested_modules.length === 0) && (
                        <div className="text-sm text-gray-500">No suggestions yet.</div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    onClick={() => {
                      setJobDsc("")
                      setMatchResult("")
                      setError("")
                    }}
                    className="px-8 py-4 text-slate-700 bg-white/80 backdrop-blur-sm border-2 border-slate-200 rounded-2xl shadow-lg hover:shadow-xl font-semibold transition-all duration-300 transform hover:-translate-y-0.5 hover:border-slate-300"
                  >
                    Try Another Job
                  </button>
                  <Link
                    to="/profile"
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 text-center"
                  >
                    Update Profile
                  </Link>
                </div>
              </div>
            )}
            {/* Simple Footer */}
          <footer className="mt-20 text-center py-6 border-t border-slate-200">
            <p className="text-slate-600 font-medium">
              © {2025} TalentCraft. All rights reserved.
            </p>
          </footer>
          </div>
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

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
      `}</style>
    </div>
  )
}

export default JobMatcher

import { useState, useEffect } from "react"
import axiosInstance from "../api/axiosInstance"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"

const JobMatche = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedJob, setExpandedJob] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axiosInstance.get("jobs/matching-jobs/")
        setJobs(res.data.matches)
        setError(null)
      } catch (err) {
        console.error(err)
        setError("Unable to load matching jobs. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  const truncateDescription = (description, maxLines) => {
    if (!description) return ""
    const lines = description.split("\n")
    if (lines.length <= maxLines) {
      return description
    }
    return lines.slice(0, maxLines).join("\n") + " ..."
  }

  const toggleDescription = (jobId) => {
    setExpandedJob(expandedJob === jobId ? null : jobId)
  }

  const getScoreClass = (score) => {
    if (score >= 80) return "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border border-emerald-200"
    if (score >= 60) return "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border border-amber-200"
    return "bg-gradient-to-r from-rose-50 to-red-50 text-rose-700 border border-rose-200"
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 min-h-screen py-8 transition-all duration-500">
      <div className="max-w-5xl mx-auto px-4">
        <header className="mb-8 animate-fade-in">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-blue-100/50 p-8 border border-white/20 mb-8 hover:shadow-2xl hover:shadow-blue-200/30 transition-all duration-500 transform">
            <div className="flex items-center justify-between mb-2">
              <div className="space-y-2">
                <h1 className="text-5xl font-bold text-indigo-600 bg-clip-text">
                  Job Matches
                </h1>
                <p className="text-slate-600 text-lg font-medium">Opportunities matching your professional profile</p>
              </div>

              <Link
                to="/home"
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-103" 
              >
                <span>Back to Dashboard</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </header>

        {error && (
          <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/50 rounded-2xl p-6 mb-8 text-red-700 shadow-lg shadow-red-100/50 animate-slide-down">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6 mr-3 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <div className="font-medium">{error}</div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-16 flex flex-col items-center justify-center animate-pulse">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-blue-200 rounded-full"></div>
              <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            <p className="mt-6 text-slate-600 font-semibold text-lg">Finding your matching jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-16 text-center animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 mb-6 shadow-inner">
              <svg
                className="w-10 h-10 text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-700 mb-3">No matching jobs found</h2>
            <p className="text-slate-500 text-lg">We couldn't find any jobs that match your profile at this time.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {jobs.map((job, idx) => (
              <div
                key={idx}
                className="group bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg shadow-slate-200/50 overflow-hidden border border-white/20 hover:shadow-2xl hover:shadow-slate-300/30 transition-all duration-500 transform hover:-translate-y-2 animate-slide-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1 space-y-2">
                      <h2 className="text-2xl font-bold text-slate-800 group-hover:text-blue-700 transition-colors duration-300">
                        {job.job_title}
                      </h2>
                      <div className="flex items-center text-slate-600 text-base font-medium">
                        <span className="bg-slate-100 px-3 py-1 rounded-full">{job.employer_name}</span>
                        <span className="mx-3 text-slate-400">•</span>
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                          {job.job_employment_type}
                        </span>
                      </div>
                    </div>

                    <div className="ml-6 flex-shrink-0">
                      <div
                        className={`inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold shadow-lg transform transition-all duration-300 hover:scale-105 ${getScoreClass(
                          job.score,
                        )}`}
                      >
                        {job.score}% Match
                      </div>
                    </div>
                  </div>

                  {job.employer_logo && (
                    <div className="mb-6 p-4 bg-gradient-to-br from-slate-50 to-slate-100 inline-block rounded-2xl shadow-inner border border-slate-200/50">
                      <img
                        src={job.employer_logo || "/placeholder.svg"}
                        alt={`${job.employer_name} Logo`}
                        className="h-14 object-contain filter drop-shadow-sm"
                      />
                    </div>
                  )}

                  <div className="bg-gradient-to-br from-slate-50/80 to-slate-100/50 rounded-2xl p-6 mb-6 border border-slate-200/30 backdrop-blur-sm">
                    <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
                      <p className="whitespace-pre-line text-base">
                        {expandedJob === job.job_id ? job.job_description : truncateDescription(job.job_description, 4)}
                      </p>
                    </div>

                    {job.job_description && job.job_description.split("\n").length > 4 && (
                      <button
                        className="mt-4 group/btn inline-flex items-center text-blue-600 font-semibold bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-2xl transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5"
                        onClick={() => toggleDescription(job.job_id)}
                      >
                        {expandedJob === job.job_id ? (
                          <>
                            <span>Read Less</span>
                            <svg
                              className="w-4 h-4 ml-2 group-hover/btn:-translate-y-0.5 transition-transform duration-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 15l7-7 7 7"
                              ></path>
                            </svg>
                          </>
                        ) : (
                          <>
                            <span>Read More</span>
                            <svg
                              className="w-4 h-4 ml-2 group-hover/btn:translate-y-0.5 transition-transform duration-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                              ></path>
                            </svg>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {job.apply_options && job.apply_options.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="font-bold text-slate-700 text-lg">Application Options</h3>
                      <div className="flex flex-wrap gap-3">
                        {job.apply_options.map((option, index) => (
                          <a
                            key={index}
                            href={option.apply_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/apply inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-semibold transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transform hover:-translate-y-1 hover:scale-105"
                          >
                            <span>{option.publisher}</span>
                            <svg
                              className="w-4 h-4 ml-2 group-hover/apply:translate-x-1 group-hover/apply:-translate-y-0.5 transition-transform duration-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              ></path>
                            </svg>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <footer className="mt-20 text-center py-4 border-t border-slate-200">
            <p className="text-slate-600 font-medium">
              © {2025} TalentCraft. All rights reserved.
            </p>
          </footer>
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

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-down {
          animation: slide-down 0.5s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out both;
        }
      `}</style>
    </div>
  )
}

export default JobMatche

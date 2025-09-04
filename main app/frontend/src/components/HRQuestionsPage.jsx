import { useState, useEffect } from "react"

function HRQuestionsPage({ questions }) {
  const [visibleQuestions, setVisibleQuestions] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading and stagger question appearance
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
      questions.forEach((_, index) => {
        setTimeout(() => {
          setVisibleQuestions((prev) => [...prev, index])
        }, index * 100)
      })
    }, 300)

    return () => clearTimeout(timer)
  }, [questions])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            HR Interview Questions
          </h1>
          <p className="text-gray-600 text-lg">Comprehensive collection of frequently asked HR questions and answers</p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="space-y-4">
          {questions.length > 0 ? (
            questions.map((q, index) => (
              <div
                key={q.id}
                className={`group bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500 
                  transform transition-all duration-500 ease-out hover:shadow-xl hover:scale-[1.02] 
                  hover:border-l-8 hover:border-indigo-500 backdrop-blur-sm bg-white/90
                  ${visibleQuestions.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
                  hover:bg-gradient-to-r hover:from-white hover:to-blue-50/30
                  relative overflow-hidden`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  boxShadow:
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(255, 255, 255, 0.05)",
                }}
              >
                {/* Subtle gradient overlay */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/20 to-transparent 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                ></div>

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-2">
                    <h3
                      className="text-xl font-bold text-gray-800 group-hover:text-blue-700 
                      transition-colors duration-300 leading-tight pr-4"
                    >
                      {q.question}
                    </h3>
                    {q.category && (
                      <span
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium
                        group-hover:bg-blue-200 group-hover:text-blue-900 transition-all duration-300
                        transform group-hover:scale-105 shadow-sm whitespace-nowrap"
                      >
                        {q.category}
                      </span>
                    )}
                  </div>

                  <div
                    className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent 
                    my-4 group-hover:via-blue-300 transition-colors duration-300"
                  ></div>

                  <p
                    className="text-gray-700 mt-3 leading-relaxed group-hover:text-gray-800 
                    transition-colors duration-300 text-base"
                  >
                    {q.answer}
                  </p>
                </div>

                {/* Hover indicator */}
                <div
                  className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 
                  transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                ></div>
              </div>
            ))
          ) : (
            <div
              className="text-center py-12 bg-white rounded-lg shadow backdrop-blur-sm bg-white/90
              transform transition-all duration-500 hover:shadow-lg"
            >
              {isLoading ? (
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-indigo-400 rounded-full animate-spin animate-reverse"></div>
                  </div>
                  <p className="text-gray-600 animate-pulse">Loading questions...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div
                    className="w-16 h-16 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full 
                    flex items-center justify-center"
                  >
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-600 mb-4 text-lg">No questions found</p>
                  <p className="text-gray-500 text-sm">Questions will appear here once they are loaded</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Stats */}
        {questions.length > 0 && (
          <div className="mt-12 text-center">
            <div
              className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full 
              px-6 py-3 shadow-lg border border-white/20"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-600 font-medium">
                {questions.length} question{questions.length !== 1 ? "s" : ""} loaded
              </span>
            </div>
          </div>
        )}
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
        
        @keyframes animate-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-reverse {
          animation: animate-reverse 1s linear infinite;
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 9px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #6366f1);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #4f46e5);
        }
      `}</style>
    </div>
  )
}

export default HRQuestionsPage

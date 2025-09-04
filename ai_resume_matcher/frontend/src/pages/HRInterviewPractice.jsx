import { useState, useEffect } from "react";
import HRChatBot from "../components/HRChatBot";
import HRQuestionsPage from "../components/HRQuestionsPage";
import api from "../api/axiosConfig";
import {
  Bot,
  Search,
  Filter,
  ArrowRight,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function HRInterviewPractice() {
  const [searchQuery, setSearchQuery] = useState("");
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [categories, setCategories] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setIsLoading(true);
    api
      .get("/chatbot/hr-questions/")
      .then((response) => {
        const questionsData = response.data;
        setQuestions(questionsData);
        setFilteredQuestions(questionsData);

        const categorySet = new Set(
          questionsData.filter((q) => q.category).map((q) => q.category)
        );

        if (categorySet.size > 0) {
          setCategories(["All", ...Array.from(categorySet)]);
        }

        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = [...questions];

    if (searchQuery) {
      result = result.filter(
        (q) =>
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter((q) => q.category === selectedCategory);
    }

    setFilteredQuestions(result);
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, questions]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedQuestions = filteredQuestions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-100/60 relative overflow-hidden animate-fade-in">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/8 to-purple-400/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-400/8 to-pink-400/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-cyan-400/5 to-blue-400/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* iOS-Style Header Card */}
        <div className="m-4 mb-8">
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-3xl shadow-2xl shadow-blue-500/20 overflow-hidden backdrop-blur-xl border border-white/10">
            <div className="px-8 py-10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-white tracking-tight">
                      HR Interview Practice
                    </h1>
                  </div>
                  <p className="text-blue-100/90 text-lg font-medium ml-15">
                    Prepare for your next interview with confidence
                  </p>
                </div>
                <Link
                  to="/home"
                  className="group flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-5 py-2.5 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 border border-white/20"
                >
                  <span>Dashboard</span>
                  <div className="group-hover:translate-x-1 transition-transform duration-300">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              </div>
            </div>

            {/* Enhanced Decorative Wave */}
            {/* <div className="relative">
              <svg className="w-full h-8 text-slate-50" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path
                  d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                  opacity=".15"
                  fill="currentColor"
                ></path>
                <path
                  d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
                  opacity=".3"
                  fill="currentColor"
                ></path>
                <path
                  d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div> */}
          </div>
        </div>

        <div className="px-4 pb-8">
          {/* iOS-Style Search and Filter Card */}
          <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl shadow-slate-200/40 mb-10 border border-white/60 transform transition-all duration-500 hover:shadow-3xl hover:shadow-slate-200/50 hover:scale-[1.02]">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-grow relative group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none z-10">
                  <Search className="h-6 w-6 text-slate-400 group-focus-within:text-blue-500 transition-all duration-300 group-focus-within:scale-110" />
                </div>
                <input
                  type="text"
                  placeholder="Search questions or answers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-16 pr-6 py-5 border-2 border-slate-200/60 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-slate-700 placeholder-slate-400 bg-white/80 backdrop-blur-sm hover:bg-white/95 hover:border-slate-300/80 text-lg font-medium"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              {categories.length > 1 && (
                <div className="md:w-80 relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none z-10">
                    <Filter className="h-6 w-6 text-slate-400 group-focus-within:text-blue-500 transition-all duration-300 group-focus-within:scale-110" />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-16 pr-6 py-5 border-2 border-slate-200/60 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white/80 backdrop-blur-sm hover:bg-white/95 hover:border-slate-300/80 transition-all duration-300 text-slate-700 appearance-none cursor-pointer text-lg font-medium"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none">
                    <svg
                      className="h-6 w-6 text-slate-400 transition-transform duration-300 group-focus-within:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Loading State */}
          {isLoading ? (
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-16 text-center">
              <div className="flex flex-col items-center space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/30">
                    <Loader2 className="h-10 w-10 text-white animate-spin" />
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-3xl blur-xl animate-pulse"></div>
                </div>
                <div className="space-y-3">
                  <p className="text-slate-700 text-xl font-semibold">
                    Loading questions...
                  </p>
                  <p className="text-slate-500 font-medium">
                    Preparing your interview practice session
                  </p>
                </div>
                <div className="w-48 h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-pulse shadow-lg"></div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Questions Display with Enhanced Container */}
              <div className="transform transition-all duration-700 ease-out">
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden">
                  <HRQuestionsPage questions={paginatedQuestions} />
                </div>
              </div>

              {/* Premium iOS-Style Pagination */}
              {filteredQuestions.length > itemsPerPage && (
                <div className="flex justify-center mt-12">
                  <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-xl p-3 rounded-3xl shadow-2xl border border-white/60">
                    {Array.from({
                      length: Math.ceil(
                        filteredQuestions.length / itemsPerPage
                      ),
                    }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`relative px-4 py-2 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 min-w-[40px] ${
                          currentPage === index + 1
                            ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30"
                            : "bg-white/80 text-slate-600 hover:bg-white hover:text-blue-600 hover:shadow-md border border-slate-200/60 backdrop-blur-sm"
                        }`}
                      >
                        <span className="relative z-10">{index + 1}</span>
                        {currentPage === index + 1 && (
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 blur-lg"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Fixed Size Floating Chat Button */}
          <button
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-8 right-8 group"
          >
            <div className="relative">
              {/* Outer glow */}
              <div className="absolute -inset-3 bg-gradient-to-br from-blue-600/30 via-purple-600/30 to-pink-600/30 rounded-3xl blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Main button */}
              <div className="relative flex items-center gap-4 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-8 py-5 rounded-3xl shadow-2xl shadow-blue-500/30 transition-all duration-300 hover:scale-110 hover:shadow-3xl hover:shadow-purple-500/40 backdrop-blur-sm border border-white/20">
                <div className="relative">
                  <Bot className="h-7 w-7 transition-transform duration-300 group-hover:rotate-12" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50">
                    <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
                  </div>
                </div>
                <span className="font-bold text-white group-hover:text-blue-100 transition-colors duration-300 text-lg">
                  Chat with AI
                </span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce delay-200"></div>
                  <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce delay-300"></div>
                </div>
              </div>
            </div>
          </button>

          {/* Fixed Size Floating Chat Button */}
          {/* <button onClick={() => setIsChatOpen(true)} className="fixed bottom-6 right-6 group">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-br from-blue-600/30 via-purple-600/30 to-pink-600/30 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>

              
              <div className="relative flex items-center gap-3 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-2xl shadow-xl shadow-blue-500/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/40 backdrop-blur-sm border border-white/20">
                <div className="relative">
                  <Bot className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-sm shadow-green-400/50">
                    <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
                  </div>
                </div>
                <span className="font-semibold text-white group-hover:text-blue-100 transition-colors duration-300">
                  Chat with AI
                </span>
              </div>
            </div>
          </button> */}

          <HRChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

          {/* Simple Footer */}
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

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

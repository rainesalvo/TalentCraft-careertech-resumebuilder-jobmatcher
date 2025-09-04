import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  // State management remains unchanged
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  // Login handler remains unchanged
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const response = await axios.post(
        "http://localhost:8000/login/",
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );

      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      navigate("/home");
    } catch (error) {
      console.error("Login error:", error);
      setErrorMsg(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Invalid credentials. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-100 relative overflow-hidden">
      {/* Enhanced floating elements */}
      <div className="absolute top-20 -right-10 w-80 h-80 bg-indigo-300 rounded-full mix-blend-soft-light filter blur-3xl opacity-40 animate-float"></div>
      <div className="absolute bottom-20 -left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-soft-light filter blur-3xl opacity-40 animate-float animation-delay-2000"></div>
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-300 rounded-full mix-blend-soft-light filter blur-3xl opacity-30 animate-float animation-delay-4000"></div>
      
      <div className="w-full max-w-md px-4 z-10">
        {/* Logo section with refined animation */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-1.5 rounded-xl shadow-lg flex items-center justify-center ring-2 ring-white/30 ring-inset">
              <img
                src="./logo.png"
                alt="Logo"
                className="w-16 h-16 object-contain rounded-lg bg-white p-1"
              />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 tracking-tight mb-3">
            TalentCraft
          </h1>
          <p className="text-gray-600 font-medium text-lg">
            Sign in to your workspace
          </p>
        </div>

        {/* Glassmorphism form container */}
        <form
          onSubmit={handleLogin}
          className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50 border-b-0 relative overflow-hidden"
        >
          {/* Form background elements */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-100 rounded-full opacity-20 blur-xl"></div>
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-violet-100 rounded-full opacity-20 blur-xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-8 text-gray-800 flex items-center gap-2">
              <svg
                className="w-6 h-6 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.75"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              Account Login
            </h2>

            {/* Enhanced error message */}
            {errorMsg && (
              <div className="mb-6 p-3 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-700 rounded-lg shadow-sm animate-pulse-fast flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="font-medium">{errorMsg}</p>
              </div>
            )}

            {/* Input fields with refined styling */}
            <div className="mb-6">
              <label
                htmlFor="username"
                className="block text-gray-700 font-medium mb-2.5 text-sm uppercase tracking-wider"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-indigo-500">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.75"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3.5 border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent bg-white/50 shadow-sm transition duration-300 hover:bg-white/70"
                />
              </div>
            </div>

            <div className="mb-8">
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-2.5 text-sm uppercase tracking-wider"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-indigo-500">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.75"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3.5 border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent bg-white/50 shadow-sm transition duration-300 hover:bg-white/70"
                />
              </div>
            </div>

            {/* Refined button with better loading state */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 px-4 rounded-xl font-medium transition-all duration-400 shadow-lg hover:shadow-xl ${
                isLoading ? "opacity-90 cursor-not-allowed" : "hover:from-blue-600 hover:to-indigo-800"
              } relative overflow-hidden group`}
            >
              <span className={`flex items-center justify-center ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                <svg
                  className="w-5 h-5 mr-2 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                Sign In
              </span>
              
              {isLoading && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </span>
              )}
            </button>
          </div>

          <div className="text-center mt-8 pt-6 border-t border-gray-100">
              <p className="text-gray-600">
                New to TalentCraft?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors relative inline-block group"
                >
                  Create account
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
              </p>
            </div>

          {/* <div className="text-center mt-8 pt-6 border-t border-gray-200/50">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/"
                className="text-indigo-600 hover:text-indigo-800 font-medium transition-all duration-300 hover:underline hover:underline-offset-3"
              >
                Create account
              </Link>
            </p>
          </div> */}
        </form>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 font-medium">
            © 2025 TalentCraft. All rights reserved.
          </p>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
          33% { transform: translateY(-20px) translateX(10px) rotate(2deg); }
          66% { transform: translateY(10px) translateX(-15px) rotate(-2deg); }
        }
        
        @keyframes pulse-fast {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.9; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.7s ease-out forwards;
          opacity: 0;
        }
        
        .animate-float {
          animation: float 12s ease-in-out infinite;
        }
        
        .animate-pulse-fast {
          animation: pulse-fast 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animation-delay-500 {
          animation-delay: 500ms;
        }
        
        .animation-delay-2000 {
          animation-delay: 2000ms;
        }
        
        .animation-delay-4000 {
          animation-delay: 4000ms;
        }
      `}</style>
    </div>
  );
}

export default Login;
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Calculate password strength
    let strength = 0;
    if (formData.password.length > 5) strength += 1;
    if (/[A-Z]/.test(formData.password)) strength += 1;
    if (/[0-9]/.test(formData.password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength += 1;
    setPasswordStrength(strength);
  }, [formData.password]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    // Clear error when user types
    if (errorMsg) setErrorMsg("");
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setErrorMsg("Username is required");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMsg("Please enter a valid email address");
      return false;
    }

    if (formData.password.length < 6) {
      setErrorMsg("Password must be at least 6 characters");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords don't match");
      return false;
    }

    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || "http://localhost:8000"}/signup/`,
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }
      );

      if (response.status === 201) {
        navigate("/login", {
          state: {
            message: "Account created successfully! Please log in.",
            email: formData.email,
          },
        });
      }
    } catch (error) {
      console.error("Signup error:", error);

      if (error.response) {
        if (error.response.status === 400) {
          setErrorMsg(error.response.data?.error || "Validation failed");
        } else if (error.response.status === 409) {
          setErrorMsg("Username or email already exists");
        } else {
          setErrorMsg("Server error. Please try again later.");
        }
      } else {
        setErrorMsg("Network error. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return "bg-gray-200";
    if (passwordStrength === 1) return "bg-red-500";
    if (passwordStrength === 2) return "bg-yellow-500";
    if (passwordStrength === 3) return "bg-green-500";
    return "bg-green-600";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-gray-100 p-4">
      <div className="w-full max-w-md">

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
            Create your account
          </p>
        </div>

        <form
          onSubmit={handleSignup}
          className="bg-white p-6 md:p-8 rounded-xl shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Sign Up</h2>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              <p>{errorMsg}</p>
            </div>
          )}

          <div className="mb-5">
            <label
              htmlFor="username"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
              </div>
              <input
                id="username"
                type="text"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="mb-5">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="mb-5">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  ></path>
                </svg>
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password (min 6 characters)"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
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
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    ></path>
                  </svg>
                ) : (
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
                      strokeWidth="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    ></path>
                  </svg>
                )}
              </button>
            </div>

            {/* Password strength meter */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex items-center mb-1">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getPasswordStrengthColor()}`}
                      style={{ width: `${passwordStrength * 25}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  {passwordStrength < 2
                    ? "Weak password"
                    : passwordStrength < 4
                    ? "Medium strength"
                    : "Strong password"}
                </p>
              </div>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  ></path>
                </svg>
              </div>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium transition duration-200 ${
              isLoading
                ? "bg-indigo-400 cursor-not-allowed"
                : "hover:bg-indigo-700 "
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>

          <div className="text-center mt-8 pt-6 border-t border-gray-100">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors relative inline-block group"
              >
                Sign In
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
            </p>
          </div>

          {/* <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium">
                                Sign in
                            </Link>
                        </p>
                    </div> */}
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            By signing up, you agree to our Terms and Privacy Policy
          </p>
          <p className="text-sm text-gray-500 mt-2">
            © 2025 Romil Monpara. All rights reserved.
          </p>
        </div>
      </div>
      <style jsx>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fade-in 0.7s ease-out forwards;
          opacity: 0;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
          33% { transform: translateY(-20px) translateX(10px) rotate(2deg); }
          66% { transform: translateY(10px) translateX(-15px) rotate(-2deg); }
        }
      `}</style>
    </div>
  );
}

export default Signup;

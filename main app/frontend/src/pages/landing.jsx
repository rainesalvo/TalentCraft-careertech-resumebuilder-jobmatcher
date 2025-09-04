import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";

function Landing() {
  // Smooth scroll for anchor links
  useEffect(() => {
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (anchor) {
        const id = anchor.getAttribute('href').slice(1);
        const el = document.getElementById(id);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };
    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-gray-50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand Name */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="bg-gradient-to-br from-blue-600 to-indigo-700 p-1 rounded-lg border border-white/10 shadow-md backdrop-blur-sm focus:outline-none"
                style={{ borderWidth: 0.5 }}
                aria-label="Go to top"
              >
                <img
                  src="/logo.png"
                  alt="TalentCraft Logo"
                  className="w-11 h-11 object-contain transition-transform duration-300 rounded-md hover:scale-105"
                />
              </button>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent leading-tight">
                  TalentCraft
                </span>
                <span className="text-sm text-gray-400 font-medium tracking-wide pt-1">
                  • An initiative by Romil Monpara
                </span>
              </div>
            </div>


            {/* Navigation Items */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="https://www.youtube.com/@romilmonpara"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <span>Demo</span>
              </a>

              <a
                href="#features"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                Features
              </a>

              <a
                href="#testimonials"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                Testimonials
              </a>

              <Link
                to="/signup"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                Sign Up
              </Link>

              <Link
                to="/login"
                className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
              >
                Sign In
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
              Craft Your Career with
              <span className="bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent"> TalentCraft</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              The ultimate AI-powered platform for resume building, job matching, and interview preparation.
              Take your career to the next level with intelligent tools designed for success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl"
              >
                Get Started Free
              </Link>
              <a
                href="https://www.youtube.com/@romilmonpara"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200 font-semibold text-lg"
              >
                Watch Demo
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <motion.section
        id="features"
        className="py-20 px-4 bg-white/50"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to succeed in your career journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "📄",
                title: "AI Resume Builder",
                description: "Create professional resumes with AI-powered suggestions and templates"
              },
              {
                icon: "🎯",
                title: "Smart Job Matching",
                description: "Find the perfect job matches based on your skills and experience"
              },
              {
                icon: "💼",
                title: "Interview Practice with Chatbot",
                description: "Practice with 100+ HR questions and get AI-powered feedback from our intelligent chatbot"
              },
              {
                icon: "📊",
                title: "Skill Analysis",
                description: "Get detailed insights into your skills and career opportunities"
              },
              {
                icon: "🔒",
                title: "Secure & Private",
                description: "Your data is protected with enterprise-grade security"
              },
              {
                icon: "📱",
                title: "Mobile Friendly",
                description: "Access your career tools anywhere, anytime"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Special Training Section */}
      <motion.section
        id="special-training"
        className="py-20 px-4"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/50 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-8 text-white">
              <h2 className="text-3xl md:text-4xl font-bold">Special Training for Trainees</h2>
              <p className="text-orange-100 mt-2 max-w-3xl">
                Close your skill gaps with a personalized Interactive Learning Roadmap, Mini Projects & Assignments,
                and a Progress Tracker with badges. New skills auto-sync to your resume.
              </p>
            </div>
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <div className="text-3xl">🎯</div>
                  <h3 className="mt-2 font-semibold text-gray-800">Skill Gap Analysis</h3>
                  <p className="text-gray-600 text-sm mt-1">We analyze your resume vs. job needs and suggest modules.</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <div className="text-3xl">🗺️</div>
                  <h3 className="mt-2 font-semibold text-gray-800">Interactive Roadmap</h3>
                  <p className="text-gray-600 text-sm mt-1">Beginner → Intermediate → Advanced learning path.</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <div className="text-3xl">🏅</div>
                  <h3 className="mt-2 font-semibold text-gray-800">Badges & Resume Sync</h3>
                  <p className="text-gray-600 text-sm mt-1">Earn badges and auto-update skills in your resume.</p>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/training"
                  className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-xl shadow hover:from-orange-600 hover:to-pink-600 text-center font-semibold"
                >
                  Start Special Training
                </Link>
                <Link
                  to="/roadmap"
                  className="border-2 border-orange-400 text-orange-600 px-6 py-3 rounded-xl hover:bg-orange-50 text-center font-semibold"
                >
                  View Roadmap
                </Link>
                <Link
                  to="/progress"
                  className="border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 text-center font-semibold"
                >
                  See Progress
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        id="testimonials"
        className="py-20 px-4"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of professionals who have transformed their careers with TalentCraft
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Software Engineer",
                company: "Tech Corp",
                content: "TalentCraft helped me land my dream job! The AI resume builder is incredible and the job matching feature found opportunities I never knew existed."
              },
              {
                name: "Michael Chen",
                role: "Marketing Manager",
                company: "Global Marketing",
                content: "The interview practice feature is a game-changer. I felt so much more confident going into interviews after using TalentCraft."
              },
              {
                name: "Emily Rodriguez",
                role: "Data Analyst",
                company: "Analytics Inc",
                content: "Professional, easy to use, and the results speak for themselves. I got 3 job offers within 2 weeks of using TalentCraft!"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/50"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Career?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have already taken their careers to the next level with TalentCraft
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl"
              >
                Start Free Trial
              </Link>
              <Link
                to="/login"
                className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-200 font-semibold text-lg"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img src="/logo.png" alt="TalentCraft Logo" className="w-11 h-11 object-contain transition-transform duration-300 rounded-md hover:scale-105" />
                <span className="text-xl font-bold">TalentCraft</span>
              </div>
              <p className="text-gray-400">
                Empowering professionals to build successful careers with AI-powered tools.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-6 text-center text-gray-400 text-sm">
            <p>&copy; 2025 <span className="font-semibold text-white">TalentCraft</span>. All rights reserved.</p>
            <p className="mt-2">
              Crafted by{" "}
              <a
                href="https://github.com/romilmonpara"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-indigo-400 font-medium transition-colors duration-300"
              >
                Romil Monpara
              </a>
            </p>
          </div>

        </div>
      </footer>
    </div>
  );
}

export default Landing; 
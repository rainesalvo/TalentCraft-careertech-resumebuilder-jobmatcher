import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/home';
import Landing from './pages/landing';
import ResumeUpload from './pages/upload';
import Profile from './pages/profile';
import JobMatcher from './pages/jobmatch';  
import JobMatche from './pages/jobs';
import Me from './pages/me';
import HRInterviewPractice from './pages/HRInterviewPractice';
import ResumeBuilder from './pages/resumebuilder';
import PublicRoute from './components/PublicRoute';
import PrivateRoute from './components/PrivateRoute';
import TrainingDashboard from './pages/TrainingDashboard';
import Roadmap from './pages/Roadmap';
import Assignments from './pages/Assignments';
import Progress from './pages/Progress';

function App() {
 
  return (
    <>
        <BrowserRouter>
        <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/upload" element={<PrivateRoute><ResumeUpload /></PrivateRoute>} />
        <Route path="/profiles" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/job-matcher" element={<PrivateRoute><JobMatcher /></PrivateRoute>} />
        <Route path="/job-matches" element={<PrivateRoute><JobMatche /></PrivateRoute>} />
        <Route path="/me" element={<PrivateRoute><Me /></PrivateRoute>} />
        <Route path="/HR" element={<PrivateRoute><HRInterviewPractice /></PrivateRoute>} />
        <Route path="/ResumeBuilder" element={<PrivateRoute><ResumeBuilder /></PrivateRoute>} />
        <Route path="/training" element={<PrivateRoute><TrainingDashboard /></PrivateRoute>} />
        <Route path="/roadmap" element={<PrivateRoute><Roadmap /></PrivateRoute>} />
        <Route path="/assignments/:slug" element={<PrivateRoute><Assignments /></PrivateRoute>} />
        <Route path="/progress" element={<PrivateRoute><Progress /></PrivateRoute>} />

        </Routes>
        </BrowserRouter>
    </>
  )
}

export default App

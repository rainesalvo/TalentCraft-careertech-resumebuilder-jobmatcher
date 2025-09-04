import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Link } from 'react-router-dom';

export default function Progress() {
  const [data, setData] = useState({ progress: [], completed_skills: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await axiosInstance.get('/training/progress/');
        setData(res.data);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Progress Tracker</h1>
            <p className="text-sm text-gray-600">Badges and certificates for completed modules</p>
          </div>
          <Link to="/training" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Back</Link>
        </div>

        <div className="bg-white rounded-xl shadow p-5 mb-6">
          <h3 className="font-semibold text-gray-800 mb-2">Badges Earned</h3>
          <div className="flex flex-wrap gap-3">
            {data.progress.filter(p => p.badge_awarded).map(p => (
              <span key={p.id} className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">{p.module.title}</span>
            ))}
            {data.progress.filter(p => p.badge_awarded).length === 0 && (
              <div className="text-sm text-gray-500">No badges yet.</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="font-semibold text-gray-800 mb-3">Completed Skills</h3>
          <div className="flex flex-wrap gap-2">
            {data.completed_skills.map(s => (
              <span key={s} className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">{s}</span>
            ))}
            {data.completed_skills.length === 0 && (
              <div className="text-sm text-gray-500">Complete modules to earn skill badges.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



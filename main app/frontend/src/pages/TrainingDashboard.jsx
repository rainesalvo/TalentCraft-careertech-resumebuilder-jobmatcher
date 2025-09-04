import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const levels = [
  { key: 'beginner', label: 'Beginner' },
  { key: 'intermediate', label: 'Intermediate' },
  { key: 'advanced', label: 'Advanced' },
];

export default function TrainingDashboard() {
  const [modules, setModules] = useState([]);
  const [progress, setProgress] = useState({ progress: [], completed_skills: [] });
  const [activeLevel, setActiveLevel] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [modsRes, progRes] = await Promise.all([
          axiosInstance.get('/training/modules/' + (activeLevel ? `?level=${activeLevel}` : '')),
          axiosInstance.get('/training/progress/'),
        ]);
        setModules(modsRes.data);
        setProgress(progRes.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [activeLevel]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const progressMap = new Map(progress.progress.map(p => [p.module.id, p]));

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Special Training for Trainees</h1>
              <p className="text-gray-600">Personalized modules to close your skill gaps</p>
            </div>
            <Link to="/roadmap" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Interactive Roadmap</Link>
          </div>
          {!!progress.completed_skills?.length && (
            <div className="mt-4">
              <h3 className="font-semibold text-gray-700 mb-2">Newly earned skills</h3>
              <div className="flex flex-wrap gap-2">
                {progress.completed_skills.map((s) => (
                  <span key={s} className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-4 mb-6">
          <div className="flex gap-2">
            <button onClick={() => setActiveLevel('')} className={`px-3 py-1 rounded ${activeLevel === '' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>All</button>
            {levels.map(l => (
              <button key={l.key} onClick={() => setActiveLevel(l.key)} className={`px-3 py-1 rounded ${activeLevel === l.key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>{l.label}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {modules.map(m => {
            const p = progressMap.get(m.id);
            const badge = p?.badge_awarded;
            const status = p?.status || 'not_started';
            return (
              <div key={m.id} className="bg-white rounded-2xl shadow p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{m.title}</h3>
                    <p className="text-sm text-gray-500 capitalize">{m.level}</p>
                  </div>
                  {badge && <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">Badge</span>}
                </div>
                <p className="text-gray-600 mt-2 line-clamp-3">{m.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(m.skills_covered || []).slice(0,6).map(s => (
                    <span key={s} className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded">{s}</span>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <Link to={`/assignments/${m.slug}`} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">View Assignments</Link>
                  <form onSubmit={async (e)=>{e.preventDefault(); await axiosInstance.post('/training/progress/', { module_id: m.id, status: status === 'completed' ? 'in_progress' : 'completed' }); const pr = await axiosInstance.get('/training/progress/'); setProgress(pr.data); }}>
                    <button type="submit" className={`px-3 py-2 rounded ${status==='completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                      {status==='completed' ? 'Completed' : 'Mark Complete'}
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}



import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Link } from 'react-router-dom';

export default function Roadmap() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await axiosInstance.get('/training/modules/');
        setModules(res.data);
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

  const stages = ['beginner', 'intermediate', 'advanced'];
  const stageToLabel = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Interactive Learning Roadmap</h1>
            <p className="text-gray-600">Step-by-step path: Beginner → Intermediate → Advanced</p>
          </div>
          <Link to="/training" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Back to Training</Link>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-blue-100"></div>
          {stages.map((stage, idx) => (
            <div key={stage} className="relative mb-10">
              <div className={`flex ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-start gap-6`}>
                <div className="w-1/2">
                  <div className="bg-white rounded-xl shadow p-5">
                    <h3 className="text-lg font-semibold text-gray-800">{stageToLabel[stage]}</h3>
                    <p className="text-sm text-gray-600 mb-3">Recommended modules</p>
                    <div className="space-y-3">
                      {modules.filter(m => m.level === stage).map(m => (
                        <div key={m.id} className="border rounded p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-800">{m.title}</div>
                              <div className="text-xs text-gray-500">{(m.skills_covered || []).slice(0,4).join(', ')}</div>
                            </div>
                            <Link to={`/assignments/${m.slug}`} className="text-indigo-600 text-sm">Open</Link>
                          </div>
                        </div>
                      ))}
                      {modules.filter(m => m.level === stage).length === 0 && (
                        <div className="text-sm text-gray-500">No modules yet.</div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-1/2 relative">
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



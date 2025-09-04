import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

export default function Assignments() {
  const { slug } = useParams();
  const [module, setModule] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const [m, p] = await Promise.all([
          axiosInstance.get(`/training/modules/${slug}/`),
          axiosInstance.get(`/training/modules/${slug}/assignments/progress/`),
        ]);
        setModule(m.data);
        setItems(p.data);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [slug]);

  const toggle = async (assignmentId, status) => {
    await axiosInstance.post('/training/assignments/progress/', { assignment_id: assignmentId, status });
    const p = await axiosInstance.get(`/training/modules/${slug}/assignments/progress/`);
    setItems(p.data);
  };

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
            <h1 className="text-2xl font-bold text-gray-800">{module?.title}</h1>
            <p className="text-sm text-gray-600">Mini Projects & Assignments</p>
          </div>
          <Link to="/training" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Back</Link>
        </div>

        <div className="space-y-4">
          {items.map((row, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-gray-800">{row.assignment.title}</div>
                  <div className="text-sm text-gray-600 mt-1">{row.assignment.description}</div>
                  {row.assignment.repo_template && (
                    <a href={row.assignment.repo_template} target="_blank" rel="noreferrer" className="text-indigo-600 text-sm mt-2 inline-block">Open Template</a>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggle(row.assignment.id, 'in_progress')} className={`px-3 py-2 rounded ${row.status==='in_progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>In Progress</button>
                  <button onClick={() => toggle(row.assignment.id, 'completed')} className={`px-3 py-2 rounded ${row.status==='completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Mark Complete</button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-sm text-gray-500">No assignments found.</div>
          )}
        </div>
      </div>
    </div>
  );
}



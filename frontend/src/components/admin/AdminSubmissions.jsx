import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Eye, Filter } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const AdminSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await api.get('/submissions/all/admin?limit=100');
      setSubmissions(response.data.submissions);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      accepted: 'bg-green-100 text-green-800',
      wrong_answer: 'bg-red-100 text-red-800',
      time_limit: 'bg-orange-100 text-orange-800',
      runtime_error: 'bg-purple-100 text-purple-800',
      compile_error: 'bg-pink-100 text-pink-800',
      pending: 'bg-gray-100 text-gray-800',
      judging: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredSubmissions = filter === 'all' 
    ? submissions 
    : submissions.filter(s => s.status === filter);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">All Submissions</h1>
          <p className="text-gray-600">{submissions.length} total submissions</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex items-center space-x-3">
            <Filter className="text-gray-400" size={20} />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="accepted">Accepted</option>
              <option value="wrong_answer">Wrong Answer</option>
              <option value="time_limit">Time Limit</option>
              <option value="runtime_error">Runtime Error</option>
              <option value="compile_error">Compile Error</option>
            </select>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Problem</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Language</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Time</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSubmissions.map((submission) => (
                <tr key={submission._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-800">
                      {submission.userId?.username || 'Unknown'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/problems/${submission.problemId?.slug}`}
                      className="text-purple-600 hover:text-purple-800 font-medium"
                    >
                      {submission.problemId?.title || 'Unknown'}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                      {submission.language.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(submission.status)}`}>
                      {submission.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {submission.executionTime ? `${submission.executionTime}ms` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminSubmissions;
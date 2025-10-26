import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Users, FileCode, Send, Trophy, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProblems: 0,
    totalSubmissions: 0,
    totalContests: 0,
    recentSubmissions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch stats from multiple endpoints
      const [usersRes, problemsRes, submissionsRes] = await Promise.all([
        api.get('/users/leaderboard?limit=1'),
        api.get('/problems?limit=1'),
        api.get('/submissions/all/admin?limit=10')
      ]);

      setStats({
        totalUsers: usersRes.data.total || 0,
        totalProblems: problemsRes.data.total || 0,
        totalSubmissions: submissionsRes.data.total || 0,
        recentSubmissions: submissionsRes.data.submissions || []
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      link: '/admin/users'
    },
    {
      title: 'Total Problems',
      value: stats.totalProblems,
      icon: FileCode,
      color: 'from-green-500 to-green-600',
      link: '/admin/problems'
    },
    {
      title: 'Total Submissions',
      value: stats.totalSubmissions,
      icon: Send,
      color: 'from-purple-500 to-purple-600',
      link: '/admin/submissions'
    },
    {
      title: 'Total Contests',
      value: stats.totalContests,
      icon: Trophy,
      color: 'from-orange-500 to-orange-600',
      link: '/admin/contests'
    }
  ];

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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your coding platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Link
                key={index}
                to={stat.link}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <TrendingUp className="text-green-500" size={20} />
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/admin/problems/create"
                className="block w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition text-center"
              >
                + Create New Problem
              </Link>
              <Link
                to="/admin/contests/create"
                className="block w-full bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-teal-700 transition text-center"
              >
                + Create New Contest
              </Link>
              <Link
                to="/admin/users"
                className="block w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition text-center"
              >
                Manage Users
              </Link>
            </div>
          </div>

          {/* Recent Submissions */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Submissions</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {stats.recentSubmissions.map((submission) => (
                <div key={submission._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">
                      {submission.userId?.username || 'Unknown'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {submission.problemId?.title || 'Problem'}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    submission.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    submission.status === 'wrong_answer' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {submission.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
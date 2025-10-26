import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Code2, Trophy, BarChart3, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Code2 className="text-purple-600" size={32} />
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              CodeJudge
            </span>
          </Link>

          {user && (
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/problems" className="flex items-center space-x-1 text-gray-700 hover:text-purple-600 transition">
                <Code2 size={18} />
                <span>Problems</span>
              </Link>
              <Link to="/contests" className="flex items-center space-x-1 text-gray-700 hover:text-purple-600 transition">
                <Trophy size={18} />
                <span>Contests</span>
              </Link>
              <Link to="/leaderboard" className="flex items-center space-x-1 text-gray-700 hover:text-purple-600 transition">
                <BarChart3 size={18} />
                <span>Leaderboard</span>
              </Link>
            </div>
          )}

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/profile" className="flex items-center space-x-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {user.username[0].toUpperCase()}
                  </div>
                  <div className="hidden md:block">
                    <div className="text-sm font-semibold">{user.username}</div>
                    <div className="text-xs text-gray-500">Rating: {user.rating}</div>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition"
                >
                  <LogOut size={18} />
                  <span className="hidden md:block">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-purple-600 font-semibold transition">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
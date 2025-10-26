import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Code2, Trophy, Users, Zap } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Code2,
      title: 'Practice Problems',
      description: 'Solve 100+ coding problems from easy to hard'
    },
    {
      icon: Trophy,
      title: 'Compete in Contests',
      description: 'Join weekly contests and improve your ranking'
    },
    {
      icon: Users,
      title: 'Global Leaderboard',
      description: 'Compare your skills with coders worldwide'
    },
    {
      icon: Zap,
      title: 'Instant Feedback',
      description: 'Get real-time results with our auto-judge system'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Master Coding Through Practice
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100">
              Solve problems, compete in contests, and level up your programming skills
            </p>
            
            {!user ? (
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/register" className="bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition">
                  Get Started Free
                </Link>
                <Link to="/problems" className="bg-purple-700 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-purple-800 transition border-2 border-white">
                  Browse Problems
                </Link>
              </div>
            ) : (
              <Link to="/problems" className="inline-block bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition">
                Start Solving Problems
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
          Why Choose CodeJudge?
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="card text-center hover:scale-105 transition-transform">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">100+</div>
              <div className="text-gray-600">Coding Problems</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">1000+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-gray-600">Weekly Contests</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      {!user && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your Coding Journey?
            </h2>
            <p className="text-xl mb-8 text-purple-100">
              Join thousands of developers improving their skills every day
            </p>
            <Link to="/register" className="inline-block bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition">
              Create Free Account
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
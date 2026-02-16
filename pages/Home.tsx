import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Target, Search } from 'lucide-react';

const Home: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/offerings?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-6rem)]">
      {/* Hero Section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 text-center">
          
          {/* Main Headline */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-extrabold text-gray-900 tracking-tight mb-8">
            Empowering Growth
          </h1>

          {/* Gradient Bar - Matching screenshot */}
          <div className="w-full h-24 sm:h-32 bg-gradient-to-r from-blue-700 via-purple-700 to-red-600 mb-10 shadow-sm rounded-sm"></div>

          {/* Subtext */}
          <p className="max-w-4xl mx-auto text-xl sm:text-2xl md:text-3xl text-gray-600 leading-relaxed font-light mb-12">
            Welcome to the DBM Training Offerings portal. Our mission is to enhance the competencies of our workforce through targeted learning and development programs.
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-16">
            <form onSubmit={handleSearch} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-red-500 rounded-full opacity-30 group-hover:opacity-60 transition duration-500 blur-md"></div>
              <div className="relative flex items-center bg-white rounded-full p-2 border border-gray-200 shadow-xl">
                <Search className="h-6 w-6 text-gray-400 ml-4" />
                <input
                  type="text"
                  className="flex-grow p-4 text-gray-700 text-lg focus:outline-none bg-transparent"
                  placeholder="Search for training programs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="bg-blue-700 text-white px-8 py-3 rounded-full hover:bg-blue-800 transition duration-200 font-bold uppercase tracking-wide text-sm sm:text-base">
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              to="/offerings"
              className="flex items-center justify-center px-10 py-4 border border-transparent text-lg font-bold rounded-full text-white bg-blue-700 hover:bg-blue-800 shadow-lg transform transition hover:-translate-y-1"
            >
              View Offerings <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/services"
              className="flex items-center justify-center px-10 py-4 border-2 border-gray-300 text-lg font-bold rounded-full text-gray-700 bg-white hover:bg-gray-50 shadow-sm"
            >
              Our Services
            </Link>
          </div>
        </div>
      </div>

      {/* Features/Highlights */}
      <div className="py-16 bg-white/80 backdrop-blur-md mt-auto border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-50 text-blue-600 mb-6 group-hover:bg-blue-100 transition-colors">
                <BookOpen size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Continuous Learning</h3>
              <p className="text-gray-500 text-lg">Access a wide range of training programs designed to keep your skills sharp.</p>
            </div>
            
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-purple-50 text-purple-600 mb-6 group-hover:bg-purple-100 transition-colors">
                <Target size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Career Development</h3>
              <p className="text-gray-500 text-lg">Tailored programs to support your professional growth.</p>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-red-50 text-red-600 mb-6 group-hover:bg-red-100 transition-colors">
                <Users size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Expert Community</h3>
              <p className="text-gray-500 text-lg">Connect with colleagues and learn from industry experts.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
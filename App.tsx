import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ServicesPage from './pages/ServicesPage';
import TrainingOfferings from './pages/TrainingOfferings';
import Recordings from './pages/Recordings';
import Contacts from './pages/Contacts';
import { BG_IMAGE } from './constants';

// Simple footer component
const Footer = () => (
  <footer className="bg-gray-900/90 text-white py-8 backdrop-blur-sm mt-auto z-10 relative">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <p className="text-gray-400 text-sm">
        © {new Date().getFullYear()} DBM Administrative Service - Human Resource Development Division. All rights reserved.
      </p>
    </div>
  </footer>
);

// Scroll to top on route change wrapper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen relative font-sans">
        <ScrollToTop />
        
        {/* Fixed Background with Transparency */}
        <div 
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${BG_IMAGE})`,
          }}
        >
          {/* Overlay to adjust transparency/readability */}
          <div className="absolute inset-0 bg-white/85"></div>
        </div>

        {/* Content Wrapper */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/offerings" element={<TrainingOfferings />} />
              <Route path="/recordings" element={<Recordings />} />
              <Route path="/contacts" element={<Contacts />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </Router>
  );
};

export default App;

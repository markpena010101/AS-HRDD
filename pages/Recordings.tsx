import React, { useEffect, useState } from 'react';
import { fetchRecordings } from '../services/sheetService';
import ContentRenderer from '../components/ContentRenderer';
import { FetchStatus, Recording } from '../types';
import { AlertCircle, Loader2, PlayCircle, FileVideo } from 'lucide-react';

const Recordings: React.FC = () => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [status, setStatus] = useState<FetchStatus>(FetchStatus.IDLE);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setStatus(FetchStatus.LOADING);
      try {
        const data = await fetchRecordings();
        setRecordings(data);
        setStatus(FetchStatus.SUCCESS);
      } catch (err) {
        console.error(err);
        setError("Unable to load recordings. Please ensure the Google Sheet is accessible.");
        setStatus(FetchStatus.ERROR);
      }
    };
    loadData();
  }, []);

  if (status === FetchStatus.LOADING) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/90 p-8 rounded-3xl shadow-xl text-center backdrop-blur-sm">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-700 font-bold text-lg">Loading Recordings...</p>
        </div>
      </div>
    );
  }

  if (status === FetchStatus.ERROR) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border-t-4 border-red-500">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-12 bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-sm border border-white/50 animate-fade-in">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-purple-600 mb-4">
            Session Recordings
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto font-medium">
            Catch up on missed training sessions and webinars.
          </p>
        </div>

        {recordings.length === 0 ? (
          <div className="text-center py-20 bg-white/50 rounded-3xl backdrop-blur-sm">
            <p className="text-gray-500 text-xl">No recordings available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recordings.map((rec, idx) => (
              <div
                key={rec.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col h-full animate-slide-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="bg-gradient-to-r from-gray-900 to-gray-700 p-6 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white line-clamp-2 pr-2">
                    {rec.title}
                  </h3>
                  <FileVideo className="text-white/80 h-6 w-6 flex-shrink-0" />
                </div>
                
                <div className="p-6 flex-grow flex flex-col space-y-4">
                  {rec.content.map((row, i) => {
                     if (!row.trim()) return null;
                     return (
                       <div key={i} className="text-sm text-gray-700 border-b border-gray-50 last:border-0 pb-2 last:pb-0">
                         <ContentRenderer content={row} />
                       </div>
                     );
                  })}
                </div>
                
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center text-red-600 text-sm font-bold">
                    <PlayCircle className="h-4 w-4 mr-2" />
                    <span>Watch Recording</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recordings;

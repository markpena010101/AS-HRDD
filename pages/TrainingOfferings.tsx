import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchAllOfferings } from '../services/sheetService';
import ContentRenderer from '../components/ContentRenderer';
import { FetchStatus, Offering } from '../types';
import { AlertCircle, ArrowLeft, Loader2, Calendar, MapPin, Video, Users, Search, X, FileText, Info, Paperclip, ImageIcon, Target } from 'lucide-react';

const TrainingOfferings: React.FC = () => {
  const location = useLocation();
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [filteredOfferings, setFilteredOfferings] = useState<Offering[]>([]);
  const [selectedOffering, setSelectedOffering] = useState<Offering | null>(null);
  
  const [status, setStatus] = useState<FetchStatus>(FetchStatus.IDLE);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchText, setSearchText] = useState('');
  const [filterDate, setFilterDate] = useState('');

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setStatus(FetchStatus.LOADING);
      try {
        const data = await fetchAllOfferings();
        setOfferings(data);
        setFilteredOfferings(data);
        setStatus(FetchStatus.SUCCESS);
      } catch (err) {
        console.error(err);
        setError("Unable to load training data. Please ensure the Google Sheet is accessible.");
        setStatus(FetchStatus.ERROR);
      }
    };
    loadData();
  }, []);

  // Handle URL Search Params
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('search');
    if (query) {
      setSearchText(query);
    }
  }, [location.search]);

  // Filtering Logic
  useEffect(() => {
    let result = offerings;

    // Search Text Filter
    if (searchText) {
      const lowerQuery = searchText.toLowerCase();
      result = result.filter(item => 
        item.title.toLowerCase().includes(lowerQuery) ||
        item.provider.toLowerCase().includes(lowerQuery) ||
        item.venue.toLowerCase().includes(lowerQuery) ||
        item.objectives.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery)
      );
    }

    // Date Filter
    if (filterDate) {
      const dateObj = new Date(filterDate);
      if (!isNaN(dateObj.getTime())) {
        const monthName = dateObj.toLocaleString('default', { month: 'long' });
        // Check if Sheet date contains selected month
        result = result.filter(item => 
          (item.date.includes(monthName) || item.date.includes(dateObj.toLocaleString('default', { month: 'short' }))) 
        );
      }
    }

    setFilteredOfferings(result);
  }, [searchText, filterDate, offerings]);

  const handleBack = () => {
    setSelectedOffering(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchText('');
    setFilterDate('');
  };

  // Helper to get usable image URL from potential Drive link
  const getDirectImageUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('drive.google.com') && (url.includes('/view') || url.includes('/file/d/'))) {
      const idMatch = url.match(/\/d\/([^/]+)/);
      if (idMatch && idMatch[1]) {
        return `https://drive.google.com/uc?export=view&id=${idMatch[1]}`;
      }
    }
    return url;
  };

  if (status === FetchStatus.LOADING) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/90 p-8 rounded-3xl shadow-xl text-center backdrop-blur-sm">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-700 font-bold text-lg">Fetching Training Offerings...</p>
          <p className="text-gray-500 text-sm mt-2">Connecting to DBM Sheets</p>
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
        
        {/* Main List View */}
        {!selectedOffering && (
          <div className="animate-fade-in">
            <div className="text-center mb-12 bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-sm border border-white/50">
              <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-600 to-pink-600 mb-4">
                Training Calendar & Offerings
              </h1>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto font-medium">
                Browse our upcoming learning and development opportunities.
              </p>

              {/* Filters Section */}
              <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center items-center max-w-4xl mx-auto">
                {/* Search */}
                <div className="relative w-full md:w-1/2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input 
                    type="text" 
                    placeholder="Search by title, venue, provider..." 
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                  {searchText && (
                    <button onClick={() => setSearchText('')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Calendar Filter */}
                <div className="relative w-full md:w-auto">
                  <div className="flex items-center bg-white border border-gray-200 rounded-xl px-3 py-1 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
                    <Calendar className="text-blue-600 mr-2 h-5 w-5" />
                    <input 
                      type="date" 
                      className="py-2 outline-none text-gray-600 bg-transparent"
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                    />
                  </div>
                </div>

                {(searchText || filterDate) && (
                  <button onClick={clearFilters} className="text-sm text-red-500 hover:text-red-700 font-medium underline">
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            {filteredOfferings.length === 0 ? (
              <div className="text-center py-20 bg-white/50 rounded-3xl backdrop-blur-sm">
                <p className="text-gray-500 text-xl">No offerings match your criteria.</p>
                <button onClick={clearFilters} className="mt-4 text-blue-600 font-bold hover:underline">Reset Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredOfferings.map((offering) => (
                  <button
                    key={offering.id}
                    onClick={() => setSelectedOffering(offering)}
                    className="group flex flex-col h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden text-left"
                  >
                    {/* Poster Image or Placeholder Pattern */}
                    <div className="h-48 w-full bg-gray-100 overflow-hidden relative">
                       {offering.poster ? (
                         <img 
                           src={getDirectImageUrl(offering.poster)} 
                           alt={offering.title} 
                           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                           onError={(e) => {
                             (e.target as HTMLImageElement).style.display = 'none';
                             (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                           }}
                         />
                       ) : null}
                       {/* Fallback pattern if no poster or error */}
                       <div className={`w-full h-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center ${offering.poster ? 'hidden' : ''}`}>
                         <ImageIcon className="text-white/20 h-16 w-16" />
                       </div>
                    </div>

                    <div className="p-6 flex flex-col flex-grow border-t border-gray-100">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                          {offering.title}
                        </h3>
                      </div>
                      
                      <div className="space-y-3 mb-6 flex-grow">
                        <div className="flex items-start text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="font-semibold">{offering.date}</span>
                        </div>
                        <div className="flex items-start text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-1">{offering.venue}</span>
                        </div>
                        <div className="flex items-start text-sm text-gray-600">
                          <Video className="h-4 w-4 mr-2 text-purple-500 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-1">{offering.modality}</span>
                        </div>
                      </div>

                      {offering.objectives && (
                        <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-500 mb-4 line-clamp-3">
                          <span className="font-bold block mb-1 text-gray-700">Objective:</span>
                          {offering.objectives}
                        </div>
                      )}

                      <div className="mt-auto pt-4 border-t border-gray-100 w-full flex justify-end">
                         <span className="text-blue-600 text-sm font-bold group-hover:underline">View Full Details &rarr;</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Details View */}
        {selectedOffering && (
          <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
              <button
                onClick={handleBack}
                className="flex items-center text-gray-700 bg-white/80 hover:bg-white px-4 py-2 rounded-full shadow-sm hover:text-blue-700 font-bold transition mb-4 md:mb-0 backdrop-blur-sm"
              >
                <ArrowLeft className="mr-2" size={20} /> Back to Offerings
              </button>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
              
              {/* Header Banner with Poster Background if available, else Gradient */}
              <div className="relative">
                 <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-purple-900/90 z-10"></div>
                 {selectedOffering.poster && (
                   <img 
                     src={getDirectImageUrl(selectedOffering.poster)} 
                     className="absolute inset-0 w-full h-full object-cover z-0 opacity-50 blur-sm"
                     alt="Background"
                   />
                 )}
                 
                 <div className="relative z-20 p-8 sm:p-12 text-white">
                    <div className="flex flex-col md:flex-row gap-8">
                      {/* Poster in Header */}
                      {selectedOffering.poster && (
                        <div className="flex-shrink-0 w-full md:w-64 rounded-xl overflow-hidden shadow-2xl border-4 border-white/20">
                          <img 
                            src={getDirectImageUrl(selectedOffering.poster)} 
                            alt={selectedOffering.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex-grow">
                        <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 shadow-black drop-shadow-lg">{selectedOffering.title}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-blue-50">
                          <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md">
                            <div className="flex items-center mb-1"><Calendar size={16} className="mr-2 opacity-75"/> <span className="text-xs uppercase tracking-wider opacity-75">Date</span></div>
                            <p className="font-bold text-lg">{selectedOffering.date}</p>
                          </div>
                          <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md">
                            <div className="flex items-center mb-1"><MapPin size={16} className="mr-2 opacity-75"/> <span className="text-xs uppercase tracking-wider opacity-75">Venue</span></div>
                            <p className="font-bold text-lg">{selectedOffering.venue}</p>
                          </div>
                          <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md">
                            <div className="flex items-center mb-1"><Video size={16} className="mr-2 opacity-75"/> <span className="text-xs uppercase tracking-wider opacity-75">Modality</span></div>
                            <p className="font-bold text-lg">{selectedOffering.modality}</p>
                          </div>
                          <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md">
                            <div className="flex items-center mb-1"><Users size={16} className="mr-2 opacity-75"/> <span className="text-xs uppercase tracking-wider opacity-75">Provider</span></div>
                            <p className="font-bold text-lg">{selectedOffering.provider}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                 </div>
              </div>

              <div className="p-8 sm:p-12 space-y-10">
                
                {selectedOffering.description && (
                  <section>
                    <div className="flex items-center mb-4 text-blue-700">
                      <FileText className="mr-3" size={28}/>
                      <h3 className="text-2xl font-bold">Description</h3>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                      <ContentRenderer content={selectedOffering.description} />
                    </div>
                  </section>
                )}

                {selectedOffering.objectives && (
                  <section>
                    <div className="flex items-center mb-4 text-purple-700">
                      <Target className="mr-3" size={28}/>
                      <h3 className="text-2xl font-bold">Objectives</h3>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                      <ContentRenderer content={selectedOffering.objectives} />
                    </div>
                  </section>
                )}

                {selectedOffering.otherInfo && (
                  <section>
                    <div className="flex items-center mb-4 text-orange-700">
                      <Info className="mr-3" size={28}/>
                      <h3 className="text-2xl font-bold">Other Information</h3>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                      <ContentRenderer content={selectedOffering.otherInfo} />
                    </div>
                  </section>
                )}

                {selectedOffering.attachments && (
                  <section>
                    <div className="flex items-center mb-4 text-green-700">
                      <Paperclip className="mr-3" size={28}/>
                      <h3 className="text-2xl font-bold">Attachments</h3>
                    </div>
                    <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                      <ContentRenderer content={selectedOffering.attachments} />
                    </div>
                  </section>
                )}

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingOfferings;
import React, { useState, useMemo } from 'react';
import { Search, MapPin, Calendar, X } from 'lucide-react';
import { NationalPark } from '../types/park';

interface ParksListProps {
  parks: NationalPark[];
  onParkSelect: (park: NationalPark) => void;
  selectedPark?: NationalPark;
}

export const ParksList: React.FC<ParksListProps> = ({ parks, onParkSelect, selectedPark }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredParks = useMemo(() => {
    return parks.filter(park =>
      park.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      park.state.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [parks, searchTerm]);

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="bg-white h-full flex flex-col shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">National Parks</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search parks by name or state..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-3">
          {filteredParks.map((park) => (
            <div
              key={park.id}
              onClick={() => onParkSelect(park)}
              className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedPark?.id === park.id
                  ? 'border-emerald-500 bg-emerald-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <h3 className={`font-semibold text-lg mb-2 ${
                selectedPark?.id === park.id ? 'text-emerald-900' : 'text-gray-900'
              }`}>
                {park.name}
              </h3>
              
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-sm">{park.state}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-sm">Established {park.established}</span>
                </div>
              </div>
              
              <p className="text-gray-700 text-sm mt-3 line-clamp-2">
                {park.description}
              </p>
              
              <div className="mt-2 text-xs text-gray-500">
                Area: {park.area}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <p className="text-sm text-gray-600 text-center">
          {filteredParks.length} of {parks.length} parks
        </p>
      </div>
    </div>
  );
};
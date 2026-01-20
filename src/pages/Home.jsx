import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getPlaces } from '../services/api';
import PlaceCard from '../components/PlaceCard';
import { Search } from 'lucide-react';

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true);
      try {
        // Always fetch local data. If query exists, api.js handles filtering, 
        // but user asked to "get me all the 30 packages", so we might want to just fetch all 
        // and let the user filter if they want, OR if the query is for filtering local packages, we keep it.
        // The request said "remove all these search adn geoapify adn related files instead just get me all the 30 packages"
        // This implies showing all packages by default.
        const data = await getPlaces(query);
        setPlaces(data);
      } catch (error) {
        console.error('Error fetching places:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [query]);

  return (
    <div>
      {!query && (
        <div className="relative bg-indigo-800 rounded-3xl overflow-hidden mb-12">
          <div className="absolute inset-0">
            <img
              className="w-full h-full object-cover opacity-40"
              src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop"
              alt="Travel background"
            />
          </div>
          <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 flex flex-col items-center text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Discover your next adventure
            </h1>
            <p className="mt-6 text-xl text-indigo-100 max-w-3xl">
              Find the best places to visit and book hotels seamlessly.
            </p>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          {query ? `Search Results for "${query}"` : 'All Destinations'}
        </h2>
        <p className="text-gray-500 mt-2">Found {places.length} results</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Local Results */}
          {places.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {places.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <Search className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No places found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search terms.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
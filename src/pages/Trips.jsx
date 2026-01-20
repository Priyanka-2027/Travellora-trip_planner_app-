import React, { useState, useEffect } from 'react';
import { Search, MapPin, Heart, Ruler, Globe } from 'lucide-react';
import { getPlaces, updateUserBookmarks } from '../services/api';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_KEY = "bf40fa58f8af4c5fa2c93d73a34f48f1";

const Trips = () => {
    const { user, login, logout } = useAuth();
    const [places, setPlaces] = useState([]);
    const [externalPlaces, setExternalPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [distance, setDistance] = useState(50);

    const fetchPlaces = async (searchQuery = '') => {
        setLoading(true);
        try {
            // 1. Fetch Local Places
            const localData = await getPlaces(searchQuery);
            setPlaces(localData);

            // 2. Fetch External Places (Geoapify) if query exists
            if (searchQuery && searchQuery.length > 2) {
                try {
                    // First get coordinates for the city
                    const geocodeUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(searchQuery)}&limit=1&apiKey=${API_KEY}`;
                    const geocodeResp = await axios.get(geocodeUrl);
                    const feature = geocodeResp.data.features?.[0];

                    if (feature) {
                        const { lat, lon } = feature.properties;
                        // Then search for tourist sights around those coordinates
                        const placesUrl = `https://api.geoapify.com/v2/places?categories=tourism.sights&filter=circle:${lon},${lat},${distance * 1000}&limit=20&with_photos=true&apiKey=${API_KEY}`;
                        const placesResp = await axios.get(placesUrl);

                        // Map external results to a common format
                        const mappedExternal = placesResp.data.features.map(p => {
                            const props = p.properties;
                            return {
                                id: props.place_id, // Use Geoapify's unique place_id
                                place_id: props.place_id, // Ensure place_id is also present for consistency
                                name: props.name || props.formatted,
                                city: props.city || props.county || '',
                                country: props.country || '',
                                description: props.formatted,
                                images: [props.photo?.url || `https://picsum.photos/seed/${props.place_id}/300/200`], // Fallback image
                                isExternal: true,
                                lat: props.lat,
                                lon: props.lon
                            };
                        });
                        setExternalPlaces(mappedExternal);
                    } else {
                        setExternalPlaces([]);
                    }
                } catch (extError) {
                    console.error('Error fetching external places:', extError);
                    setExternalPlaces([]);
                }
            } else {
                setExternalPlaces([]);
            }

        } catch (error) {
            console.error('Error fetching places:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlaces();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchPlaces(query);
    };

    const toggleBookmark = async (place) => {
        if (!user) return alert('Please login to bookmark');

        // Robust check for existing bookmark using ID or place_id
        const isBookmarked = user.bookmarks?.some(b => {
            if (place.id && b.id === place.id) return true;
            if (place.place_id && b.place_id === place.place_id) return true;
            return false;
        });

        let newBookmarks;

        if (isBookmarked) {
            newBookmarks = user.bookmarks.filter(b => {
                if (place.id) return b.id !== place.id;
                if (place.place_id) return b.place_id !== place.place_id;
                return true;
            });
        } else {
            newBookmarks = [...(user.bookmarks || []), place];
        }

        try {
            // Update backend
            await updateUserBookmarks(user.id, newBookmarks);
            // Update local context
            const updatedUser = { ...user, bookmarks: newBookmarks };
            login(updatedUser);
        } catch (error) {
            console.error('Error updating bookmarks:', error);
            if (error.response && error.response.status === 404) {
                alert('Session expired or invalid. Please logout and login again.');
                logout();
            } else {
                alert('Failed to update bookmark');
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Explore Attractions</h1>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Search places (e.g. Paris, London)..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                    <button type="submit" className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
                        Search
                    </button>
                </form>

                {/* Distance Meter */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center text-gray-700 font-medium">
                            <Ruler className="h-5 w-5 mr-2 text-indigo-600" />
                            <span>Search Radius</span>
                        </div>
                        <span className="text-indigo-600 font-bold">{distance} km</span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="100"
                        value={distance}
                        onChange={(e) => setDistance(e.target.value)}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <div className="space-y-12">
                    {/* External Results */}
                    {externalPlaces.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                                <Globe className="h-5 w-5 mr-2 text-indigo-600" />
                                Global Results (Geoapify)
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {externalPlaces.map((place) => {
                                    const isBookmarked = user?.bookmarks?.some(b => {
                                        if (place.id && b.id === place.id) return true;
                                        if (place.place_id && b.place_id === place.place_id) return true;
                                        return false;
                                    });
                                    return (
                                        <div key={place.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-indigo-100">
                                            <div className="relative h-48">
                                                <img
                                                    src={place.images[0]}
                                                    alt={place.name}
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    onClick={() => toggleBookmark(place)}
                                                    className={`absolute top-4 right-4 p-2 rounded-full shadow-sm ${isBookmarked ? 'bg-red-500 text-white' : 'bg-white text-gray-400 hover:text-red-500'}`}
                                                >
                                                    <Heart className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
                                                </button>
                                                <div className="absolute top-4 left-4 bg-indigo-600 text-white text-xs px-2 py-1 rounded-md">
                                                    External
                                                </div>
                                            </div>
                                            <div className="p-5">
                                                <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-1">{place.name}</h3>
                                                <div className="flex items-center text-gray-500 text-sm mb-3">
                                                    <MapPin className="h-4 w-4 mr-1" />
                                                    {place.city}, {place.country}
                                                </div>
                                                <p className="text-gray-600 text-sm line-clamp-2">
                                                    {place.description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Local Results */}
                    {places.length > 0 && (
                        <div>
                            {externalPlaces.length > 0 && <h2 className="text-xl font-semibold text-gray-700 mb-4 mt-8">Local Results</h2>}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {places.map((place) => {
                                    const isBookmarked = user?.bookmarks?.some(b => {
                                        if (place.id && b.id === place.id) return true;
                                        if (place.place_id && b.place_id === place.place_id) return true;
                                        return false;
                                    });
                                    return (
                                        <div key={place.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                            <div className="relative h-48">
                                                <img
                                                    src={place.images?.[0] || place.image || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1000&auto=format&fit=crop'}
                                                    alt={place.name}
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    onClick={() => toggleBookmark(place)}
                                                    className={`absolute top-4 right-4 p-2 rounded-full shadow-sm ${isBookmarked ? 'bg-red-500 text-white' : 'bg-white text-gray-400 hover:text-red-500'}`}
                                                >
                                                    <Heart className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
                                                </button>
                                            </div>
                                            <div className="p-5">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{place.name}</h3>
                                                    {place.rating && (
                                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                                                            {place.rating} ★
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center text-gray-500 text-sm mb-3">
                                                    <MapPin className="h-4 w-4 mr-1" />
                                                    {place.city}, {place.country}
                                                </div>
                                                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                                                    {place.description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {!loading && places.length === 0 && externalPlaces.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                            <Search className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No places found</h3>
                            <p className="mt-1 text-sm text-gray-500">Try adjusting your search terms or increasing the radius.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Trips;

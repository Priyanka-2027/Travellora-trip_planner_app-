import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getPlaceById, getHotelsByPlaceId } from '../services/api';
import HotelCard from '../components/HotelCard';
import { MapPin, Globe } from 'lucide-react';
import MapViewer from '../components/MapViewer';

const PlaceDetail = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const [place, setPlace] = useState(null);
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const isExternal = id.startsWith('ext-');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (isExternal) {
                    const name = searchParams.get('name');
                    const lat = parseFloat(searchParams.get('lat'));
                    const lng = parseFloat(searchParams.get('lon'));

                    // Inline logic replacing getCityDetails
                    const details = {
                        description: `Explore the beautiful city of ${name}. Discover its rich history, vibrant culture, and stunning architecture. Whether you're looking for adventure or relaxation, ${name} has something for everyone.`,
                        image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1000&auto=format&fit=crop"
                    };

                    setPlace({
                        id,
                        name,
                        city: name,
                        country: 'Global',
                        description: details.description,
                        lat,
                        lng,
                        images: [details.image]
                    });
                    setHotels([]); // No hotels for external places
                } else {
                    const [placeData, hotelsData] = await Promise.all([
                        getPlaceById(id),
                        getHotelsByPlaceId(id)
                    ]);
                    setPlace(placeData);
                    setHotels(hotelsData);
                }
            } catch (error) {
                console.error('Error fetching place details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, isExternal, searchParams]);

    if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
    if (!place) return <div className="text-center py-12">Place not found</div>;

    return (
        <div>
            <div className="relative h-96 rounded-xl overflow-hidden mb-8 shadow-lg">
                <img
                    src={place.images[0]}
                    alt={place.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <div className="p-8 text-white">
                        <h1 className="text-4xl font-bold">{place.name}</h1>
                        <div className="flex items-center mt-2 text-lg">
                            {isExternal ? <Globe className="h-5 w-5 mr-2" /> : <MapPin className="h-5 w-5 mr-2" />}
                            {place.city}, {place.country}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">{place.description}</p>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Hotels Nearby</h2>
                    {isExternal ? (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-700">
                                        Hotel booking is currently not available for global destinations.
                                        Please check back later or search for our featured destinations.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {hotels.map((hotel) => (
                                <HotelCard key={hotel.id} hotel={hotel} />
                            ))}
                            {hotels.length === 0 && (
                                <p className="text-gray-500">No hotels found near this place.</p>
                            )}
                        </div>
                    )}
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-24 h-64 lg:h-80">
                        <MapViewer lat={place.lat} lng={place.lng} name={place.name} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceDetail;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { updateUserBookmarks } from '../services/api';

const PlaceCard = ({ place, isExternal = false }) => {
    const { user, login } = useAuth(); // login used to update user state
    const navigate = useNavigate();
    const [isBookmarked, setIsBookmarked] = useState(false);

    useEffect(() => {
        if (user && user.bookmarks) {
            // Fix: Ensure we don't compare undefined values
            const isMarked = user.bookmarks.some(b => {
                if (place.id && b.id === place.id) return true;
                if (place.place_id && b.place_id === place.place_id) return true;
                return false;
            });
            setIsBookmarked(isMarked);
        }
    }, [user, place]);

    const handleBookmark = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            if (window.confirm('You need to login to bookmark places. Go to login?')) {
                navigate('/login');
            }
            return;
        }

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
            // Optimistic update
            const updatedUser = { ...user, bookmarks: newBookmarks };
            login(updatedUser); // Update local context
            setIsBookmarked(!isBookmarked);

            // API update
            await updateUserBookmarks(user.id, newBookmarks);
        } catch (error) {
            console.error('Error updating bookmarks:', error);
            // Revert on error (optional, but good practice)
        }
    };

    const linkTo = isExternal
        ? `/places/ext-${place.place_id}?lat=${place.lat}&lon=${place.lon}&name=${encodeURIComponent(place.name)}`
        : `/places/${place.id}`;

    return (
        <div className="group relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
            <Link to={linkTo} className="block h-full">
                <div className="relative h-48 w-full">
                    <img
                        src={place.images ? place.images[0] : (place.image || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1000&auto=format&fit=crop")}
                        alt={place.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <button
                        onClick={handleBookmark}
                        className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors z-10"
                    >
                        <Heart
                            className={`h-5 w-5 ${isBookmarked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                        />
                    </button>
                </div>
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900">{place.name}</h3>
                    <p className="text-sm text-gray-500">{place.city || place.country}</p>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">{place.description}</p>
                </div>
            </Link>
        </div>
    );
};

export default PlaceCard;

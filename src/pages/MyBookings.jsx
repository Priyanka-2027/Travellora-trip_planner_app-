import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserBookings, cancelBooking, getHotelById, getPlaceById } from '../services/api';
import { Calendar, MapPin, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const MyBookings = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [enrichedBookings, setEnrichedBookings] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true);
            try {
                const data = await getUserBookings(user.id);
                setBookings(data);

                // Fetch details for each booking
                const details = await Promise.all(data.map(async (booking) => {
                    const hotel = await getHotelById(booking.hotelId);
                    const place = await getPlaceById(booking.placeId);
                    return { ...booking, hotel, place };
                }));
                setEnrichedBookings(details);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchBookings();
        }
    }, [user]);

    const handleCancel = async (bookingId) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            try {
                await cancelBooking(bookingId);
                // Refresh bookings
                const updatedBookings = enrichedBookings.map(b =>
                    b.id === bookingId ? { ...b, status: 'cancelled' } : b
                );
                setEnrichedBookings(updatedBookings);
            } catch (error) {
                console.error('Error cancelling booking:', error);
                alert('Failed to cancel booking');
            }
        }
    };

    if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

            {enrichedBookings.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Start exploring to make your first reservation.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {enrichedBookings.map((booking) => (
                        <div key={booking.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                            <div className="p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{booking.hotel?.name}</h3>
                                        <div className="flex items-center mt-1 text-gray-500">
                                            <MapPin className="h-4 w-4 mr-1" />
                                            {booking.place?.name}, {booking.place?.city}
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                            booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <div className="flex items-start">
                                        <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Dates</p>
                                            <p className="text-sm text-gray-500">
                                                {format(new Date(booking.checkIn), 'MMM d, yyyy')} - {format(new Date(booking.checkOut), 'MMM d, yyyy')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <Clock className="h-5 w-5 text-gray-400 mr-2" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Details</p>
                                            <p className="text-sm text-gray-500">
                                                {booking.rooms} Room(s), {booking.guests} Guest(s)
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="text-lg font-bold text-gray-900">
                                            ₹{booking.totalPrice.toFixed(2)}
                                        </div>
                                    </div>
                                </div>

                                {booking.status === 'confirmed' && (
                                    <div className="mt-6 flex justify-end">
                                        <button
                                            onClick={() => handleCancel(booking.id)}
                                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                                        >
                                            Cancel Booking
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Map, User, LogOut, LogIn, Menu, X, Package, Calendar, Heart, Hotel, Plane, TicketPercent, TramFront, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsMenuOpen(false);
    };

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
                            <Map className="h-8 w-8 text-indigo-600" />
                            <span className="ml-2 text-xl font-bold text-gray-800">Travellora</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link
                            to="/"
                            className={`text-sm font-medium transition-colors duration-200 ${isActive('/') ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
                        >
                            Home
                        </Link>

                        {user && (
                            <>
                                <Link
                                    to="/hotels"
                                    className={`flex items-center text-sm font-medium transition-colors duration-200 ${isActive('/hotels') ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
                                >
                                    <Hotel className="h-4 w-4 mr-1" />
                                    Hotels
                                </Link>
                                <Link
                                    to="/trips"
                                    className={`flex items-center text-sm font-medium transition-colors duration-200 ${isActive('/trips') ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
                                >
                                    <Plane className="h-4 w-4 mr-1" />
                                    Trips
                                </Link>
                                <Link
                                    to="/plans"
                                    className={`flex items-center text-sm font-medium transition-colors duration-200 ${isActive('/plans') ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
                                >
                                    <Package className="h-4 w-4 mr-1" />
                                    Plans
                                </Link>
                                <Link
                                    to="/bookmarks"
                                    className={`flex items-center text-sm font-medium transition-colors duration-200 ${isActive('/bookmarks') ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
                                >
                                    <Heart className="h-4 w-4 mr-1" />
                                    Bookmarks
                                </Link>
                                <Link
                                    to="/bookings"
                                    className={`flex items-center text-sm font-medium transition-colors duration-200 ${isActive('/bookings') ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
                                >
                                    <TicketPercent className="h-4 w-4 mr-1" />
                                    Bookings
                                </Link>
                                <Link
                                    to="/profile"
                                    className={`flex items-center text-sm font-medium transition-colors duration-200 ${isActive('/profile') ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
                                >
                                    <User className="h-4 w-4 mr-1" />
                                    Profile
                                </Link>
                                <div className="flex items-center border-l pl-4 ml-4 border-gray-200">
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
                                    >
                                        <LogOut className="h-4 w-4 mr-1" />
                                        Logout
                                    </button>
                                </div>
                            </>
                        )}

                        {!user && (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/login"
                                    className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                                >
                                    <LogIn className="h-5 w-5 mr-1" />
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 font-medium transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}

                        
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-600 hover:text-gray-900 focus:outline-none"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link
                            to="/"
                            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'}`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Home
                        </Link>

                        {user ? (
                            <>
                                <Link
                                    to="/hotels"
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/hotels') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'}`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Hotels
                                </Link>
                                <Link
                                    to="/trips"
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/trips') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'}`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Trips
                                </Link>
                                <Link
                                    to="/plans"
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/plans') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'}`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Plans
                                </Link>
                                <Link
                                    to="/bookmarks"
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/bookmarks') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'}`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Bookmarks
                                </Link>
                                <Link
                                    to="/profile"
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/profile') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'}`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Profile
                                </Link>
                                <div className="px-3 py-2 border-t border-gray-100 mt-2">
                                    <div className="flex items-center mb-3">
                                        <User className="h-5 w-5 mr-2 text-indigo-500" />
                                        <span className="font-medium text-gray-900">{user.name}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-500 hover:bg-red-600"
                                    >
                                        <LogOut className="h-5 w-5 mr-2" />
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="pt-4 pb-2 border-t border-gray-100 mt-2 space-y-2">
                                <Link
                                    to="/login"
                                    className="block w-full text-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                        <div className="pt-4 pb-2 border-t border-gray-100 mt-2 px-4">
                            <button
                                onClick={toggleTheme}
                                className="flex items-center w-full text-left text-base font-medium text-gray-700 hover:text-indigo-600"
                            >
                                {theme === 'dark' ? (
                                    <>
                                        <Sun className="h-5 w-5 mr-2" />
                                        Light Mode
                                    </>
                                ) : (
                                    <>
                                        <Moon className="h-5 w-5 mr-2" />
                                        Dark Mode
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import PlaceDetail from './pages/PlaceDetail';
import HotelDetail from './pages/HotelDetail';
import MyBookings from './pages/MyBookings';
import Hotels from './pages/Hotels';
import Trips from './pages/Trips';
import Plans from './pages/Plans';
import Bookmarks from './pages/Bookmarks';
import Profile from './pages/Profile';
import PackageDetail from './pages/PackageDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="places/:id" element={<PlaceDetail />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
          <Route path="hotels" element={<Hotels />} />
          <Route path="hotels/:id" element={<HotelDetail />} />
          <Route path="trips" element={<Trips />} />
          <Route path="plans" element={<Plans />} />
          <Route path="plans/:id" element={<PackageDetail />} />
          <Route path="bookmarks" element={<Bookmarks />} />
          <Route path="profile" element={<Profile />} />
          <Route path="bookings" element={<MyBookings />} />
        </Route>

        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
    </Routes>
  );
}

export default App;
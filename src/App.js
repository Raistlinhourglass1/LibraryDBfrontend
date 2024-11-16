// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import ProtectedRoute from './ProtectedRoute';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Fines from './TotalFines';
import StudentBookFines from './StudentBookFines';
import ProfilePage2 from './ProfilePage2';
import ProfilePage from './ProfilePage';
import StudentBookRentals from './StudentBookRentals';
import Nice from './Nice';
import StudentRoomReservationTable from './RoomReserveTable';
import 'bootstrap/dist/css/bootstrap.min.css';
import RoomReservation from './RoomReservation';
import Feedback from './feedback';
import CreateRoom from './CreateRoom';
import Reports from './Reports';
import BookSearchResults from './BookSearchResults';
import BookDetail from './BookDetail';
import PeriodicalEntry from './PeriodicalEntry';
import Maintenance from './Maintenance';
import BookEntry from './BookEntry';
import BookSearch from './BookSearch';
import AudioBookEntry from './AudioBookEntry';
import EBookEntry from './EBookEntry';
import AdvancedSearch from './AdvancedSearch';
import _calculatorReservation from './_calculatorReservation';
import _laptopReservation from './_laptopReservation';
import _bookReservation from './_bookReservation';
import _laptopSearch from './_laptopSearch';
import _calculatorEntry from './_calculatorEntry';
import _calculatorSearch from './_calculatorSearch';
import _laptopEntry from './_laptopEntry';
import Home from './HomePage';
import TestBookSearch from './TestBookSearch';
import AddStaff from './addstaff';
import HomePage from './HomePage';
import BookCheckout from './BookCheckout';
import StaffCatalog from './StaffCatalog';
import LandingPage from './landingPage';






function App() {
  const [userInfo, setUserInfo] = useState(null);

  // Function to fetch user data and update `userInfo`
  const fetchUserData = async (token) => {
    try {
      const response = await axios.get('https://librarydbbackend.onrender.com/ProfilePage2', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserInfo(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      localStorage.removeItem('token'); // Clear invalid token
      setUserInfo(null); // Reset userInfo if fetching fails
    }
  };

  // Fetch user data on mount if a token exists
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserData(token);
    }
  }, []);

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserInfo(null);
  };

  return (
    <Router>
      {/* Pass userInfo, handleLogout, and fetchUserData to Navbar */}
      < Navbar userInfo={userInfo} onLogout={handleLogout} fetchProfileData={fetchUserData} />
      {window.location.pathname !== '/' && window.location.pathname !== '/Signin' && window.location.pathname !== '/Signup' && <Navbar />}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<SignIn onLoginSuccess={() => fetchUserData(localStorage.getItem('token'))} />} />
        <Route path="/signin" element={<SignIn onLoginSuccess={() => fetchUserData(localStorage.getItem('token'))} />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected routes */}
        <Route path="/home" element={<ProtectedRoute><ProfilePage2 /></ProtectedRoute>} />
        <Route path="/addstaff" element={<ProtectedRoute><AddStaff /></ProtectedRoute>} />
        <Route path="/fines" element={<ProtectedRoute><Fines /></ProtectedRoute>} />
        <Route path="/StudentBookFines" element={<ProtectedRoute><StudentBookFines /></ProtectedRoute>} />
        <Route path="/ProfilePage2" element={<ProtectedRoute><ProfilePage2 /></ProtectedRoute>} />
        <Route path="/ProfilePage" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/StudentBookRentals" element={<ProtectedRoute><StudentBookRentals /></ProtectedRoute>} />
        <Route path="/Nice" element={<ProtectedRoute><Nice /></ProtectedRoute>} />
        <Route path="/StudentRoomReservationTable" element={<ProtectedRoute><StudentRoomReservationTable /></ProtectedRoute>} />
        <Route path="/TestBookSearch" element={<ProtectedRoute><TestBookSearch /></ProtectedRoute>} />
        <Route path="/create-room" element={<ProtectedRoute><CreateRoom /></ProtectedRoute>} />
        <Route path="/reserve-room" element={<ProtectedRoute><RoomReservation /></ProtectedRoute>} />
        <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        <Route path="/catalog-entry/book" element={<ProtectedRoute><BookEntry /></ProtectedRoute>} />
        <Route path="/catalog-entry/audiobook" element={<ProtectedRoute><AudioBookEntry /></ProtectedRoute>} />
        <Route path="/catalog-entry/ebook" element={<ProtectedRoute><EBookEntry /></ProtectedRoute>} />
        <Route path="/catalog-entry/periodical" element={<ProtectedRoute><PeriodicalEntry /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><BookSearch /></ProtectedRoute>} />
        <Route path="/advanced-search" element={<ProtectedRoute><AdvancedSearch /></ProtectedRoute>} />
        <Route path="/search-results" element={<ProtectedRoute><BookSearchResults /></ProtectedRoute>} />
        <Route path="/books/:book_id" element={<ProtectedRoute><BookDetail /></ProtectedRoute>} />
        <Route path="/_laptopEntry" element={<ProtectedRoute><_laptopEntry /></ProtectedRoute>} />
        <Route path="/_laptopSearch" element={<ProtectedRoute><_laptopSearch /></ProtectedRoute>} />
        <Route path="/_calculatorEntry" element={<ProtectedRoute><_calculatorEntry /></ProtectedRoute>} />
        <Route path="/_calculatorSearch" element={<ProtectedRoute><_calculatorSearch /></ProtectedRoute>} />
        <Route path="/_bookReservation" element={<ProtectedRoute><_bookReservation /></ProtectedRoute>} />
        <Route path="/_laptopReservation" element={<ProtectedRoute><_laptopReservation /></ProtectedRoute>} />
        <Route path="/_calculatorReservation" element={<ProtectedRoute><_calculatorReservation /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;

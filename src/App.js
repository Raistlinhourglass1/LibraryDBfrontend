import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import ProtectedRoute from './ProtectedRoute'; // Import the ProtectedRoute component

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
import AddStaff from './StaffForm';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
          <Route
            path="/AddStaff"
            element={
              <ProtectedRoute>
                <AddStaff />
              </ProtectedRoute>
            }
          />
        <Route
          path="/fines"
          element={
            <ProtectedRoute>
              <Fines />
            </ProtectedRoute>
          }
        />
        <Route
          path="/StudentBookFines"
          element={
            <ProtectedRoute>
              <StudentBookFines />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ProfilePage2"
          element={
            <ProtectedRoute>
              <ProfilePage2 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ProfilePage"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/StudentBookRentals"
          element={
            <ProtectedRoute>
              <StudentBookRentals />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Nice"
          element={
            <ProtectedRoute>
              <Nice />
            </ProtectedRoute>
          }
        />
        <Route
          path="/StudentRoomReservationTable"
          element={
            <ProtectedRoute>
              <StudentRoomReservationTable />
            </ProtectedRoute>
          }
        />
        <Route
          path="/TestBookSearch"
          element={
            <ProtectedRoute>
              <TestBookSearch />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-room"
          element={
            <ProtectedRoute>
              <CreateRoom />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reserve-room"
          element={
            <ProtectedRoute>
              <RoomReservation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feedback"
          element={
            <ProtectedRoute>
              <Feedback />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/catalog-entry/book"
          element={
            <ProtectedRoute>
              <BookEntry />
            </ProtectedRoute>
          }
        />
        <Route
          path="/catalog-entry/audiobook"
          element={
            <ProtectedRoute>
              <AudioBookEntry />
            </ProtectedRoute>
          }
        />
        <Route
          path="/catalog-entry/ebook"
          element={
            <ProtectedRoute>
              <EBookEntry />
            </ProtectedRoute>
          }
        />
        <Route
          path="/catalog-entry/periodical"
          element={
            <ProtectedRoute>
              <PeriodicalEntry />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <BookSearch />
            </ProtectedRoute>
          }
        />
        <Route
          path="/advanced-search"
          element={
            <ProtectedRoute>
              <AdvancedSearch />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search-results"
          element={
            <ProtectedRoute>
              <BookSearchResults />
            </ProtectedRoute>
          }
        />
        <Route
          path="/books/:book_id"
          element={
            <ProtectedRoute>
              <BookDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/_laptopEntry"
          element={
            <ProtectedRoute>
              <_laptopEntry />
            </ProtectedRoute>
          }
        />
        <Route
          path="/_laptopSearch"
          element={
            <ProtectedRoute>
              <_laptopSearch />
            </ProtectedRoute>
          }
        />
        <Route
          path="/_calculatorEntry"
          element={
            <ProtectedRoute>
              <_calculatorEntry />
            </ProtectedRoute>
          }
        />
        <Route
          path="/_calculatorSearch"
          element={
            <ProtectedRoute>
              <_calculatorSearch />
            </ProtectedRoute>
          }
        />
        <Route
          path="/_bookReservation"
          element={
            <ProtectedRoute>
              <_bookReservation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/_laptopReservation"
          element={
            <ProtectedRoute>
              <_laptopReservation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/_calculatorReservation"
          element={
            <ProtectedRoute>
              <_calculatorReservation />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

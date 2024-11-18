import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import { differenceInHours, format } from 'date-fns';
import { toDate } from 'date-fns-tz';
import AppTheme from './AppTheme';
import axios from 'axios';

function renderStatus(status) {
  const colors = {
    Ongoing: 'success',
    Ended: 'error',
    Canceled: 'default',
  };
  return <Chip label={status} color={colors[status] || 'default'} size="small" />;
}

const calculateTimeDue = (reservationDateTime, reservationDuration, status) => {
  if (status === 'Canceled') {
    return { status: 'Canceled', timeDue: '', overdueHours: 0 };
  }

  const now = new Date();
  const reservationStart = toDate(new Date(reservationDateTime));
  const reservationEnd = new Date(reservationStart.getTime() + reservationDuration * 60 * 60 * 1000);
  const timeRemaining = (reservationEnd - now) / (1000 * 60); // Calculate in minutes

  if (timeRemaining <= 0) {
    return { status: 'Ended', timeDue: `${Math.abs(Math.floor(timeRemaining / 60))} hours overdue`, overdueHours: Math.abs(Math.floor(timeRemaining / 60)) };
  } else {
    const hoursRemaining = Math.floor(timeRemaining / 60);
    const minutesRemaining = Math.floor(timeRemaining % 60);
    return { 
      status: 'Ongoing', 
      timeDue: `${hoursRemaining} hours ${minutesRemaining} minutes remaining`, 
      overdueHours: 0 
    };
  }
};

const RoomReserveTable = (props) => {
  const [rows, setRows] = useState([]);
  const [sortModel, setSortModel] = useState([
    { field: 'reservation_date', sort: 'desc' },
  ]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('https://librarydbbackend.onrender.com/RoomReserveTable', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        setRows(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleCancelReservation = async (reservationId, roomId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://librarydbbackend.onrender.com/cancel-reservation', { reservationId, roomId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const response = await axios.get('https://librarydbbackend.onrender.com/RoomReserveTable', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRows(response.data);
    } catch (error) {
      alert('Error while canceling the reservation.');
      console.error('Error cancelling reservation:', error);
    }
  };

  const columns = [
    {
      field: 'reservation_status',
      headerName: 'Status',
      width: 100,
      sortable: false,
      renderCell: (params) => {
        const { status } = calculateTimeDue(params.row.reservation_date, params.row.reservation_duration_hrs, params.row.reservation_status);
        return renderStatus(status);
      },
    },
    {
      field: 'reservation_date',
      headerName: 'Date',
      width: 150,
      renderCell: (params) => {
        try {
          const date = new Date(params.row.reservation_date); // Parse date directly from string
          if (isNaN(date)) throw new Error("Invalid date"); // Check if date parsing is successful
    
          // Format the date to display in 12-hour format with AM/PM
          const formattedDate = format(date, 'MM/dd/yyyy, hh:mm a');
          return <span>{formattedDate}</span>;
        } catch (error) {
          console.error("Error parsing or formatting date:", error);
          return <span>Invalid Date</span>; // Display a fallback if date is invalid
        }
      },
    },
    { field: 'room_number', headerName: 'Room Number', width: 150 },
    
    { field: 'reservation_reason', headerName: 'Reason', width: 160 },
    { field: 'reservation_duration_hrs', headerName: 'Duration (hrs)', width: 160 },
    { field: 'party_size', headerName: 'Party Size', width: 150 },
    {
      field: 'cancel',
      headerName: 'Cancel Reservation',
      width: 160,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleCancelReservation(params.row.reservation_id, params.row.room_number)}
        >
          Cancel
        </Button>
      ),
    },
  ];

  return (
    <AppTheme {...props}>
      <Box sx={{ height: 390, width: '100%', display: 'flex', boxShadow: 3, borderRadius: 2, padding: 1, bgcolor: 'background.paper' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.reservation_id}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          disableRowSelectionOnClick
          sortModel={sortModel}
          onSortModelChange={(newSortModel) => setSortModel(newSortModel)}
        />
      </Box>
    </AppTheme>
  );
}

export default RoomReserveTable;

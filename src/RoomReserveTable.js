import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import axios from 'axios';
import { differenceInHours, format, parse } from 'date-fns';
import AppTheme from './AppTheme';

function renderStatus(status) {
  const colors = {
    Ongoing: 'success',
    Ended: 'error',
    Canceled: 'default',
  };
  return <Chip label={status} color={colors[status] || 'default'} size="small" />;
}

const calculateTimeDue = (reservationDateTime, reservationDuration, status) => {
  if (status === 'canceled') {
    return { status: 'Canceled', timeDue: '', overdueHours: 0 };
  }

  const now = new Date();
  // Parse the reservationDateTime string to create a Date object
  const reservationStart = parse(reservationDateTime, 'yyyy-MM-dd HH:mm:ss', new Date());
  const reservationEnd = new Date(reservationStart.getTime() + reservationDuration * 60 * 60 * 1000);
  const timeRemaining = differenceInHours(reservationEnd, now); // Calculate remaining time till end

  if (timeRemaining <= 0) {
    return { status: 'Ended', timeDue: `${Math.abs(timeRemaining)} hours overdue`, overdueHours: Math.abs(timeRemaining) };
  } else {
    return { status: 'Ongoing', timeDue: `${timeRemaining} hours remaining`, overdueHours: 0 };
  }
};


const RoomReserveTable = (props) => {
  const [rows, setRows] = useState([]);
  const [sortModel, setSortModel] = useState([
    {
      field: 'reservation_date',
      sort: 'desc',
    },
  ]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('https://librarydbbackend.onrender.com/RoomReserveTable', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      console.log('Fetched rows:', response.data); 
      setRows(response.data);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      if (error.response && error.response.status === 401) {
        console.warn('Unauthorized access - possibly due to an invalid token.');
      }
    });
  }, []);

  const handleCancelReservation = async (reservationId, roomId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://librarydbbackend.onrender.com/cancel-reservation', {
        reservationId,
        roomId
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const response = await axios.get('https://librarydbbackend.onrender.com/RoomReserveTable', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRows(response.data); 
      console.log(`Reservation ${reservationId} canceled successfully`, response.data); 
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400 && error.response.data === 'Reservation has already ended') {
          alert('This reservation has already ended and cannot be canceled.');
        } else if (error.response.status === 400 && error.response.data === 'Reservation has already been canceled') {
          alert('This reservation has already been canceled.');
        } else if (error.response.status === 404) {
          alert('Reservation not found or already canceled');
        } else {
          console.error('Error cancelling reservation:', error);
          alert('An error occurred while attempting to cancel the reservation.');
        }
      } else {
        console.error('Error cancelling reservation:', error);
        alert('An error occurred while attempting to cancel the reservation.');
      }
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
    { field: 'room_number', headerName: 'Room Number', width: 150 },
    {
      field: 'reservation_date',
      headerName: 'Date',
      width: 150,
      renderCell: (params) => {
        try {
          const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone; // Get local timezone
          const date = new Date(params.row.reservation_date); // Parse date directly from string
          const localDate = toDate(date, { timeZone: timezone }); // Convert to local time zone
          if (isNaN(localDate)) throw new Error("Invalid date"); // Check if date parsing is successful
          const formattedDate = format(localDate, 'MM/dd/yyyy, hh:mm a'); // Display in 12-hour format with AM/PM
          return <span>{formattedDate}</span>;
        } catch (error) {
          console.error("Error parsing or formatting date:", error);
          return <span>Invalid Date</span>; // Display a fallback if date is invalid
        }
      },
    },
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
          color="danger"
          onClick={() => handleCancelReservation(params.row.reservation_id, params.row.room_number)}
        >
          Cancel
        </Button>
      ),
    },
  ];

  const handleSortChange = (newSortModel) => {
    setSortModel(newSortModel);
    console.log('Sort model changed:', newSortModel);
  };

  return (
    <AppTheme {...props}>
      <Box
        sx={{
          height: 390,
          width: '100%',
          display: 'flex',
          boxShadow: 3,
          borderRadius: 2,
          padding: 1,
          bgcolor: 'background.paper',
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.reservation_id}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          disableRowSelectionOnClick
          sortModel={sortModel}
          onSortModelChange={handleSortChange}
        />
      </Box>
    </AppTheme>
  );
}

export default RoomReserveTable;

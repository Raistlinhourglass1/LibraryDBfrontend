import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import { differenceInHours } from 'date-fns';
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
  if (status === 'canceled') {
    return { status: 'Canceled', timeDue: '', overdueHours: 0 };
  }
  const now = new Date();
  const reservationStart = new Date(reservationDateTime);
  const reservationEnd = new Date(reservationStart.getTime() + reservationDuration * 60 * 60 * 1000);
  const timeRemaining = differenceInHours(now, reservationEnd);

  if (now >= reservationEnd) {
    return { status: 'Ended', timeDue: `${timeRemaining} hours overdue`, overdueHours: timeRemaining };
  } else {
    return { status: 'Ongoing', timeDue: `${Math.abs(timeRemaining)} hours remaining`, overdueHours: 0 };
  }
};

const RoomReserveTable = (props) => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/RoomReserveTable', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        console.log('Fetched rows:', response.data); // Debugging statement
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
      await axios.post('http://localhost:5000/cancel-reservation', {
        reservationId,
        roomId
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Fetch updated reservations after cancellation
      const response = await axios.get('http://localhost:5000/RoomReserveTable', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRows(response.data); // Update rows state with fresh data
      console.log(`Reservation ${reservationId} canceled successfully`, response.data); // Debugging statement
    } catch (error) {
      console.error('Error cancelling reservation:', error);
    }
  };

  const columns = [
    { field: 'reservation_id', headerName: 'Reservation ID', width: 110 },
    { field: 'user_id', headerName: 'User ID', width: 110 },
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
          color="secondary"
          onClick={() => handleCancelReservation(params.row.reservation_id, params.row.room_number)} // Pass the room ID
        >
          Cancel
        </Button>
      ),
    },
  ];

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
        />
      </Box>
    </AppTheme>
  );
}

export default RoomReserveTable;
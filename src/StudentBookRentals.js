import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import axios from 'axios';
import AppTheme from './AppTheme';
import { DataGrid } from '@mui/x-data-grid';
import { differenceInDays, differenceInHours, addDays } from 'date-fns';

function renderStatus(status) {
  const colors = {
    Ongoing: 'success',
    Ended: 'error',
    Canceled: 'default',
    Early: 'success',
    Late: 'error',
  };
  return <Chip label={status} color={colors[status] || 'default'} size="small" />;
}

const calculateTimeDue = (dueDate, status) => {
  if (status === 'Canceled') {
    return { status: 'Canceled', timeDue: '', overdueHours: 0 };
  }

  const now = new Date();
  const due = new Date(dueDate);
  const hoursDifference = differenceInHours(now, due);

  if (hoursDifference > 0) {
    return { status: 'Ended', timeDue: `${hoursDifference} hours overdue`, overdueHours: hoursDifference };
  } else if (hoursDifference === 0) {
    return { status: 'Ongoing', timeDue: 'Due today', overdueHours: 0 };
  } else {
    return { status: 'Ongoing', timeDue: `${Math.abs(hoursDifference)} hours remaining`, overdueHours: 0 };
  }
};

const calculateAmountDue = (overdueHours) => {
  const ratePerHour = 20;
  return overdueHours * ratePerHour;
};

export default function StudentBookRentals(props) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log("Token found:", token);
    
    axios.get('https://librarydbbackend.onrender.com/booktable_reservations', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      console.log("Fetched data from /booktable_reservations:", response.data);
      
      if (Array.isArray(response.data)) {
        const bookRows = response.data.map((book) => {
          const dueDate = addDays(new Date(book.reservation_date_time), 14);
          return {
            id: book.reservation_id,
            title: book.book_title,
            author: book.book_author,
            dueDate: dueDate,
            status: book.reservation_status, // Assumes `reservation_status` from the backend
          };
        });
        setRows(bookRows);
      } else {
        console.warn("Unexpected data format:", response.data);
      }
    })
    .catch((error) => {
      console.error('Error fetching book rentals:', error);
      if (error.response && error.response.status === 401) {
        console.warn('Unauthorized access - possibly due to an invalid token.');
      }
    });
  }, []);

  const handleCancelReservation = async (reservationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://librarydbbackend.onrender.com/cancel-reservation', 
        { reservationId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Fetch the updated list of reservations after canceling
      const response = await axios.get('https://librarydbbackend.onrender.com/booktable_reservations', {
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
      field: 'status',
      headerName: 'Status',
      width: 100,
      sortable: false,
      renderCell: (params) => {
        const { status } = calculateTimeDue(params.row.dueDate, params.row.status);
        return renderStatus(status);
      },
    },
    {
      field: 'title',
      headerName: 'Book Title',
      width: 150,
    },
    {
      field: 'author',
      headerName: 'Author',
      width: 150,
    },
    {
      field: 'dueDate',
      headerName: 'Due Date',
      width: 150,
    },
    {
      field: 'elapsedTime',
      headerName: 'Time Overdue',
      sortable: false,
      width: 160,
      renderCell: (params) => {
        const { timeDue } = calculateTimeDue(params.row.dueDate, params.row.status);
        return timeDue;
      },
    },
    {
      field: 'amountDue',
      headerName: 'Amount Due',
      width: 140,
      sortable: false,
      renderCell: (params) => {
        const { overdueHours } = calculateTimeDue(params.row.dueDate, params.row.status);
        const amountDue = overdueHours > 0 ? calculateAmountDue(overdueHours) : 0;
        return `$${amountDue}`;
      },
    },
    {
      field: 'cancel',
      headerName: 'Cancel Reservation',
      width: 160,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleCancelReservation(params.row.id)}
          disabled={params.row.status === 'Canceled' || params.row.status === 'Ended'}
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
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
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

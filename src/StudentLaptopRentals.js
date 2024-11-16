import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';
import axios from 'axios';
import AppTheme from './AppTheme';
import { addDays, differenceInDays } from 'date-fns';
import { Box,Button,} from '@mui/material';


function renderStatus(status) {
  const colors = {
    Early: 'success',
    Late: 'error',
  };
  return <Chip label={status} color={colors[status]} size="small" />;
}




const calculateTimeDue = (reservationDateTime) => {
  const now = new Date();
  const reservationDate = new Date(reservationDateTime);
  const dueDate = addDays(reservationDate, 14);
  const daysDifference = differenceInDays(now, dueDate);

  if (daysDifference > 0) {
    return { status: 'Late', timeDue: `${daysDifference} days overdue`, overdueDays: daysDifference };
  } else if (daysDifference === 0) {
    return { status: 'Early', timeDue: 'Due today', overdueDays: 0 };
  } else {
    return { status: 'Early', timeDue: `${Math.abs(daysDifference)} days remaining`, overdueDays: 0 };
  }
};

const calculateAmountDue = (overdueDays) => {
  const ratePerDay = 20;
  return overdueDays * ratePerDay;
};


const StudentLaptopRentals = ({ userId, ...props }) => {
  const [rows, setRows] = useState([]);

  
  const handleCancelReservation = async (reservationId, laptopId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://librarydbbackend.onrender.com/cancel-laptop-reservation', {
        reservationId,
        laptopId  // Fixed variable name to match backend
      }, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'  // Added content type header
        },
      });
  
      // Fetch updated reservations after cancellation
      const response = await axios.get('https://librarydbbackend.onrender.com/laptop_reservations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRows(response.data);
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      // Add user feedback for errors
      alert('Failed to cancel reservation. Please try again.');
    }
  };


  // Send overdue email
  const sendOverdueEmail = (reservationDetails) => {
    const token = localStorage.getItem('token');
    return axios.post(
      'https://librarydbbackend.onrender.com/send-overdue-email',
      { reservationDetails },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(() => console.log('Overdue email sent'))
    .catch((error) => console.error('Error sending overdue email:', error));
  };

  const columns = [
    //{ field: 'reservation_id', headerName: 'Reservation ID', width: 150 },
    {
      field: 'reservation_date_time',
      headerName: 'Reservation Date & Time',
      width: 200,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      sortable: false,
      renderCell: (params) => {
        const { status } = calculateTimeDue(params.row.reservation_date_time);
        return renderStatus(status);
      },
    },
    {
      field: 'time_due',
      headerName: 'Time Due',
      width: 160,
      sortable: false,
      renderCell: (params) => {
        const { timeDue } = calculateTimeDue(params.row.reservation_date_time);
        return timeDue;
      },
    },
    {
      field: 'amount_due',
      headerName: 'Amount Due',
      width: 140,
      sortable: false,
      renderCell: (params) => {
        const { overdueDays } = calculateTimeDue(params.row.reservation_date_time);
        const amountDue = calculateAmountDue(overdueDays);
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
          color="secondary"
          onClick={() => handleCancelReservation(params.row.reservation_id, params.row.laptop_id)}
        >
          Cancel
        </Button>
      ),
    },
  ];
  








  useEffect(() => {
    const token = localStorage.getItem('token');

    // Fetch laptop reservations
    axios.get('https://librarydbbackend.onrender.com/laptop_reservations', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      // Filter reservations by userId
      const userRows = response.data.filter((row) => row.user_id === userId);
      setRows(userRows);

      // Send overdue email for "Late" reservations
      const lateEmails = userRows.map(async (row) => {
        const { status, overdueDays } = calculateTimeDue(row.reservation_date_time);
        
        // Check if the reservation is "Late" and not yet notified
        if (status === 'Late' && !row.notified) {
          await sendOverdueEmail({ reservation_id: row.reservation_id, overdueDays });
          row.notified = true; // Ideally update backend
        }
      });

      // Execute all email notifications concurrently
      Promise.all(lateEmails).then(() => setRows([...userRows])); // Update rows to reflect notified status

    })
    .catch((error) => {
      console.error('Error fetching laptop reservations:', error);
      if (error.response && error.response.status === 401) {
        console.warn('Unauthorized access - possibly due to an invalid token.');
      }
    });
  }, [userId]);

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
};

export default StudentLaptopRentals;

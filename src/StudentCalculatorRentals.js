import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';
import axios from 'axios';
import AppTheme from './AppTheme';
import { addDays, differenceInDays } from 'date-fns';
import {
  Box,
  Button,
} from '@mui/material';




function renderStatus(status) {
  const colors = {
    Pending: 'success',
    Fulfilled: 'error',
    Cancelled: 'default',
  };
  return <Chip label={status} color={colors[status] || 'default'} size="small" />;
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
/*
const handleCancelReservation = async (reservationId, calculatorId, setRows) => {
  try {
    const token = localStorage.getItem('token');
    
    // Send both IDs in the request body
    await axios.post('https://librarydbbackend.onrender.com/cancel-cal-reservation', {
      reservationId,
      calculatorId
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Refresh the data after successful cancellation
    const response = await axios.get('https://librarydbbackend.onrender.com/calculator_reservations', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    setRows(response.data);
  } catch (error) {
    console.error('Error cancelling reservation:', error);
  }
};
*/


const handleCancelClick = (reservationId) => {
  setSelectedReservation(reservationId);
  setOpenDialog(true);
};

const handleConfirmCancel = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post('https://librarydbbackend.onrender.com/cancel-cal-reservation', {
      reservationId: selectedReservation,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.error) {
      // If the backend returns an error, display it in the snackbar
      setSnackbar({ open: true, message: response.data.error, severity: 'error' });
      return;
    }

    setRows(rows.map(row => (
      row.reservation_id === selectedReservation
        ? { ...row, reservation_status: 'Cancelled' }
        : row
    )));
    setSnackbar({ open: true, message: 'Reservation cancelled successfully!', severity: 'success' });
  } catch (error) {
    setSnackbar({ open: true, message: 'Failed to cancel reservation.', severity: 'error' });
  } finally {
    setOpenDialog(false);
    setSelectedReservation(null);
  }
};

const calculateAmountDue = (overdueDays) => {
  const ratePerDay = 20;
  return overdueDays * ratePerDay;
};

const columns = [
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
    field: 'actions',
    headerName: 'Actions',
    width: 150,
    renderCell: (params) => (
      params.row.reservation_status !== 'Cancelled' && (
        <Button size="small" color="secondary" onClick={() => handleCancelClick(params.row.reservation_id)}>
          Cancel
        </Button>
      )
    ),
  },
  { field: 'calc_type', headerName: 'Calculator Type', width: 150 },
  { field: 'model_name', headerName: 'Model Name', width: 150 },
];

const StudentCalculatorRentals = ({ userId, ...props }) => {
  const [rows, setRows] = useState([]);


  




  useEffect(() => {
    const token = localStorage.getItem('token');


















    // Fetch calculator reservations
    axios.get('https://librarydbbackend.onrender.com/calculator_reservations', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      // Filter reservations by userId
      const userRows = response.data.filter((row) => row.user_id === userId);
      setRows(userRows);

      // Send overdue email for "Late" reservations
      const lateEmails = userRows.map(async (row) => {
        const { status, overdueDays } = calculateTimeDue(row.reservation_date_time);
        const amountDue = calculateAmountDue(overdueDays);
        
        // Check if the reservation is "Late" and not yet notified
        if (status === 'Late' && !row.notified) {
          await sendOverdueEmail({ 
            reservation_id: row.reservation_id, 
            overdueDays, 
            amount_due: amountDue 
          });
          row.notified = true; // Ideally update backend
        }
      });

      // Execute all email notifications concurrently
      Promise.all(lateEmails).then(() => setRows([...userRows])); // Update rows to reflect notified status

    })
    .catch((error) => {
      console.error('Error fetching calculator reservations:', error);
      if (error.response && error.response.status === 401) {
        console.warn('Unauthorized access - possibly due to an invalid token.');
      }
    });
  }, [userId]);

  return (
    <AppTheme {...props}>
      <Box sx={{ height: 650, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          disableRowSelectionOnClick
          getRowId={(row) => row.reservation_id}
        />

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Cancel Reservation</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to cancel this reservation?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>No</Button>
            <Button onClick={handleConfirmCancel} color="secondary">
              Yes
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Box>
    </AppTheme>
  );
};
export default StudentCalculatorRentals;
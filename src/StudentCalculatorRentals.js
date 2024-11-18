import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';
import axios from 'axios';
import AppTheme from './AppTheme';
import { addDays, differenceInDays } from 'date-fns';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
} from '@mui/material';

function renderStatus(status) {
  const colors = {
    Pending: 'success',
    Fulfilled: 'error',
    Cancelled: 'default',
  };
  return <Chip label={status} color={colors[status] || 'default'} size="small" />;
}

const calculateTimeDue = (reservationDateTime, status) => {
  if (status === 'Cancelled') {
    return { status: 'Cancelled', timeDue: '', overdueDays: 0 };
  }

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

const StudentCalculatorRentals = ({ userId, ...props }) => {
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleCancelReservation = async (reservationId, calculatorId) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post('https://librarydbbackend.onrender.com/cancel-cal-reservation', {
        reservationId,
        calculatorId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.error) {
        setSnackbar({ open: true, message: response.data.error, severity: 'error' });
        return;
      }
      
      setRows(rows.map(row => (
        row.reservation_id === reservationId
          ? { ...row, reservation_status: 'Cancelled' }
          : row
      )));
      setSnackbar({ open: true, message: 'Reservation cancelled successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      setSnackbar({ open: true, message: 'Failed to cancel reservation.', severity: 'error' });
    } finally {
      setOpenDialog(false);
      setSelectedReservation(null);
    }
  };

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

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('https://librarydbbackend.onrender.com/calculator_reservations', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      const userRows = response.data.filter((row) => row.user_id === userId);
      setRows(userRows);

      const lateEmails = userRows.map(async (row) => {
        const { status, overdueDays } = calculateTimeDue(row.reservation_date_time, row.reservation_status);
        const amountDue = calculateAmountDue(overdueDays);

        if (status === 'Late' && !row.notified) {
          await sendOverdueEmail({ 
            reservation_id: row.reservation_id, 
            overdueDays, 
            amount_due: amountDue 
          });
          row.notified = true; // Ideally, update backend to reflect notification status
        }
      });

      Promise.all(lateEmails).then(() => setRows([...userRows]));
    })
    .catch((error) => {
      console.error('Error fetching calculator reservations:', error);
      if (error.response && error.response.status === 401) {
        console.warn('Unauthorized access - possibly due to an invalid token.');
      }
    });
  }, [userId]);

  const handleCancelClick = (reservationId, calculatorId) => {
    setSelectedReservation({ reservationId, calculatorId });
    setOpenDialog(true);
  };

  const handleConfirmCancel = () => {
    if (selectedReservation) {
      handleCancelReservation(selectedReservation.reservationId, selectedReservation.calculatorId);
    }
  };

  const columns = [
    { field: 'reservation_id', headerName: 'ID', width: 90 },
    { field: 'user_id', headerName: 'User ID', width: 120 },
    { field: 'calculator_id', headerName: 'Calculator', width: 150 },
    { field: 'reservation_date_time', headerName: 'Reservation Date', width: 200 },
    { field: 'status', headerName: 'Status', width: 120, renderCell: (params) => renderStatus(params.row.reservation_status) },
    {
      field: 'time_due',
      headerName: 'Time Due',
      width: 160,
      renderCell: (params) => calculateTimeDue(params.row.reservation_date_time, params.row.reservation_status).timeDue,
    },
    {
      field: 'amount_due',
      headerName: 'Amount Due',
      width: 140,
      renderCell: (params) => {
        const { overdueDays } = calculateTimeDue(params.row.reservation_date_time, params.row.reservation_status);
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
          <Button 
            size="small" 
            color="secondary" 
            onClick={() => handleCancelClick(params.row.reservation_id, params.row.calculator_id)}
          >
            Cancel
          </Button>
        )
      ),
    },
    { field: 'calc_type', headerName: 'Calculator Type', width: 150 },
    { field: 'model_name', headerName: 'Model Name', width: 150 },
  ];

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

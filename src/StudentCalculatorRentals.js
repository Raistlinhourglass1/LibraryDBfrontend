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

const StudentCalculatorRentals = ({ userId, ...props }) => {
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

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
    })
    .catch((error) => {
      console.error('Error fetching calculator reservations:', error);
      if (error.response && error.response.status === 401) {
        console.warn('Unauthorized access - possibly due to an invalid token.');
      }
    });
  }, [userId]);

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
      field: 'cancel',
      headerName: 'Cancel Reservation',
      width: 160,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => handleCancelClick(params.row.reservation_id)}
        >
          Cancel
        </Button>
      ),
    },
    { field: 'calc_type', headerName: 'Calculator Type', width: 150 },
    { field: 'model_name', headerName: 'Model Name', width: 150 },
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
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          disableRowSelectionOnClick
        />

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Cancel Reservation</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to cancel this reservation?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="primary">
              No
            </Button>
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

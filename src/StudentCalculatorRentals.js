import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';
import axios from 'axios';
import AppTheme from './AppTheme';
import { addDays, differenceInDays } from 'date-fns';

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

const columns = [
  { field: 'reservation_id', headerName: 'Reservation ID', width: 150 },
  { field: 'calculator_id', headerName: 'Calculator ID', width: 150 },
  { field: 'calc_type', headerName: 'Calculator Type', width: 150 },
  { field: 'model_name', headerName: 'Model Name', width: 150 },
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
];

export default function CalculatorReserveTable({ userId, ...props }) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('https://librarydbbackend.onrender.com/calculator_reservations', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      // Filter rows to include only those matching the userId
      const userRows = response.data.filter((row) => row.user_id === userId);
      setRows(userRows);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
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
}

import React, { useState, useEffect } from 'react';
import { decode as jwt_decode } from 'jwt-decode'; // or import jwt_decode from 'jwt-decode' for older versions
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

export default function LaptopReserveTable({ userId, ...props }) {
  const [rows, setRows] = useState([]);
  
  const token = localStorage.getItem('token');
  const decodedToken = jwt_decode(token);
  const userEmail = decodedToken.email;  // Extract email from the decoded token

  const sendOverdueEmail = (reservationDetails) => {
    return axios.post('https://librarydbbackend.onrender.com/send-overdue-email', { 
      userEmail, 
      reservationDetails 
    })
    .then(() => console.log('Overdue email sent'))
    .catch((error) => console.error('Error sending overdue email:', error));
  };

  useEffect(() => {
    axios.get('https://librarydbbackend.onrender.com/laptop_reservations', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      const userRows = response.data.filter((row) => row.user_id === userId);
      setRows(userRows);

      const lateEmails = userRows.map(async (row) => {
        const { status, overdueDays } = calculateTimeDue(row.reservation_date_time);
        if (status === 'Late' && !row.notified) {
          await sendOverdueEmail({ reservation_id: row.reservation_id, overdueDays });
          row.notified = true;
        }
      });

      Promise.all(lateEmails).then(() => setRows([...userRows]));
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }, [userId, token]);

  return (
    <AppTheme {...props}>
      <Box sx={{ height: 390, width: '100%', display: 'flex', boxShadow: 3, borderRadius: 2, padding: 1, bgcolor: 'background.paper' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.reservation_id}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </AppTheme>
  );
}

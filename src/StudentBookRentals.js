import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import axios from 'axios';
import AppTheme from './AppTheme';
import { DataGrid } from '@mui/x-data-grid';
import { differenceInDays, addDays } from 'date-fns';

function renderStatus(status) {
  const colors = {
    Early: 'success',
    Late: 'error',
  };
  return <Chip label={status} color={colors[status]} size="small" />;
}

const calculateTimeDue = (dueDate) => {
  const now = new Date();
  const due = new Date(dueDate);
  const daysDifference = differenceInDays(now, due);

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
  {
    field: 'status',
    headerName: 'Status',
    width: 100,
    sortable: false,
    renderCell: (params) => {
      const { status } = calculateTimeDue(params.row.dueDate);
      return renderStatus(status);
    },
  },
  {
    field: 'title',
    headerName: 'Book Title',
    width: 150,
  },
  {
    field: 'ISBN',
    headerName: 'Book ISBN',
    width: 160,
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
      const { timeDue } = calculateTimeDue(params.row.dueDate);
      return timeDue;
    },
  },
  {
    field: 'amountDue',
    headerName: 'Amount Due',
    width: 140,
    sortable: false,
    renderCell: (params) => {
      const { overdueDays } = calculateTimeDue(params.row.dueDate);
      const amountDue = calculateAmountDue(overdueDays);
      return `$${amountDue}`;
    },
  },
];

export default function StudentBookRentals(props) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log("Token found:", token);
    
    axios.get('https://librarydbbackend.onrender.com/book_reservations', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      console.log("Fetched data from /book_reservations:", response.data);
  
      // Check if response data is an array
      if (Array.isArray(response.data)) {
        const bookRows = response.data.map((book) => ({
          id: book.reservation_id,
          title: book.book_title,
          ISBN: book.book_isbn,
          dueDate: book.due_date,
        }));
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

import AppTheme from './AppTheme';
import ColorModeSelect from './ColorModeSelect';
import React, { useState, useEffect } from 'react';
import { Avatar, Box, Card, CardContent, Chip, IconButton, Tabs, Tab, InputAdornment, Paper, Typography} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Grid from '@mui/material/Grid2';
import PropTypes from 'prop-types';
import red from './themePrimitives'
import { DataGrid, GridRowsProp, GridColDef, gridDateTimeFormatter } from '@mui/x-data-grid';
import { differenceInDays } from 'date-fns';
import axios from 'axios';




 //Everything to add table to the Rentals Function                                                                                                               

 function renderStatus(status) {
    const colors = {
      Early: 'success',
      Late: 'error',
    };
  
    return <Chip label={status} color={colors[status]} size="small" />;
  }
  
  const calculateTimeDue = (dueDate) => {
    const now = new Date(); // Get the current date
    const due = new Date(dueDate); // Convert the due date to a Date object
    const daysDifference = differenceInDays(now, due);
  
    if (daysDifference > 0) {
      return { status: 'Late', timeDue: `${daysDifference} days overdue`, overdueDays: daysDifference }; // If overdue
    } else if (daysDifference === 0) {
      return { status: 'Early', timeDue: 'Due today', overdueDays: 0 }; // Due today
    } else {
      return { status: 'Early', timeDue: `${Math.abs(daysDifference)} days remaining`, overdueDays: 0 }; // Early
    }
  };

  const calculateAmountDue = (overdueDays) => {
    const ratePerDay = 20; // $20 per day overdue
    return overdueDays * ratePerDay;
  };
  
  
  const columns = [
      { 
        field: 'book_id', 
        headerName: 'ID', 
        width: 70
      },
      {
          field: 'status', 
          headerName: 'Status', 
          width: 80,
          sortable: false,
          renderCell: (params) => {
            const { status } = calculateTimeDue(params.row.dueDate);
            return renderStatus(status);
          },
  
      },
      {
        field: 'book_title',
        headerName: 'Book Title',
        width: 400,
        editable: true,
      },
      {
        field: 'isbn',
        headerName: 'Book ISBN',
        width: 150,
        editable: true,
      },
      {
        field: 'dueDate',
        headerName: 'Due Date',
        width: 100,
      },
      {
        field: 'elaspedTime', // In the 00.00 Format
        headerName: 'Time Overdue',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 180,
        renderCell: (params) => {
          const { timeDue } = calculateTimeDue(params.row.dueDate);
          return timeDue;
        },
      },
      {
          field: 'Due',
          headerName: 'Amount Due',
          width: 120,
          sortable: false,
          editable: true, //amount should be changed automatically
          renderCell: (params) => {
            const { overdueDays } = calculateTimeDue(params.row.dueDate);
            const amountDue = calculateAmountDue(overdueDays);
            return `$${amountDue}`; // Display the amount due in dollars
          },
  
    
        },
  
    ];
  
    /*
    const rows = [
      { id: 1, 
        Catagory: 'Book', 
        title: 'Calculus 2010', 
        ISBN: '9781617408397',
        dueDate: '2024/12/31',
      },
      { id: 2, 
        Catagory: 'Book', 
        title: 'Physics 2425', 
        ISBN: '6354728191032', 
        dueDate: '2024/10/15',
      },
      { id: 3, 
        Catagory: 'Book', 
        title: 'Music 1752', 
        ISBN: '2948673205671',
        dueDate: '2024/11/31',
      },
      { id: 4, 
        Catagory: 'Book', 
        title: 'Astrology 1852', 
        ISBN: '7853926140289', 
        dueDate: '2024/11/14',
      },
      { id: 5, 
        Catagory: 'Book', 
        title: 'Geology 2684', 
        ISBN: '4912063781520', 
        dueDate: '2023/10/31',
      },
  
      
    ];*/


  export default function StudentBookRentals(props) {

    //////////GET BOOK DATA START
    const [rows, setRows] = useState([]);
    const [pendingBooks, setPendingBooks] = useState([]);
    const [checkedOutBooks, setCheckedOutBooks] = useState([]);
    const [historyBooks, setHistoryBooks] = useState([]);

    const fetchData = async () => {
    // Fetch data from the backend for book reservations
      const token = localStorage.getItem('token');

      axios
        .get('https://librarydbbackend.onrender.com/user/book_reservations', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const data = response.data;
          setRows(data); // Set the fetched data as rows for the table
          console.log('row response: ', data);

          const pending = data.filter(book => book.reservation_status === 'pending');
          const checkedOut = data.filter(book => book.reservation_status === 'fulfilled' && !book.date_returned);
          const history = data.filter(book => book.reservation_status === 'returned');

          setPendingBooks(pending);
          setCheckedOutBooks(checkedOut);
          setHistoryBooks(history);


        })
        .catch((error) => {
          console.error('Error fetching book reservations:', error);
          if (error.response && error.response.status === 401) {
            console.warn('Unauthorized access - possibly due to an invalid token.');
          }
        });
    }
    useEffect(() => {
      fetchData();
    }, []);

    const pendingColumns = [
      { field: 'book_title', headerName: 'Book Title', width: 250 },
      { field: 'author', headerName: 'Author', width: 200 },
      { field: 'reservation_date_time', headerName: 'Reservation Date', width: 180 },
      { field: 'queue_position', headerName: 'Queue Position', width: 150 },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 150,
        renderCell: (params) => {
          const { reservation_id, book_id } = params.row;
          return (
            <button
              onClick={() => handleCancelReservation(reservation_id, book_id)}
              style={{ backgroundColor: '#28a745', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
            >
              Cancel
            </button>
             );
            },
          },
    ];
  
    const checkedOutColumns = [
      { field: 'book_title', headerName: 'Book Title', width: 250 },
      { field: 'author', headerName: 'Author', width: 200 },
      { field: 'date_borrowed', headerName: 'Date Borrowed', width: 180 },
      { field: 'date_due', headerName: 'Due Date', width: 180 },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 150,
        renderCell: (params) => {
          const { reservation_id, book_id } = params.row;
          return (
            <button
              onClick={() => handleReturn(reservation_id, book_id)}
              style={{ backgroundColor: '#28a745', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
            >
              Return
            </button>
             );
            },
          },
    ];
  
    const historyColumns = [
      { field: 'book_title', headerName: 'Book Title', width: 250 },
      { field: 'author', headerName: 'Author', width: 200 },
      { field: 'date_borrowed', headerName: 'Date Borrowed', width: 180 },
      { field: 'date_returned', headerName: 'Date Returned', width: 180 },
    ];
  


  //////////////BOOK DATA END

  ///////RETURN BOOK START

  const handleReturn = async (reservationId, bookId) => {
    try {
      const token = localStorage.getItem('token');
    
      // If no token is found, you can alert the user or handle the error
      if (!token) {
        alert('User not authenticated');
        return;
      }
      const response = await axios.put('https://librarydbbackend.onrender.com/return-book', {
        reservation_id: reservationId,
        book_id: bookId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token to the headers
        },
      }
    );

      if (response.status === 200) {
        alert('Book returned successfully');
        fetchData();
      }
    } catch (error) {
      console.error('Error returning book:', error);
      alert('Error returning book');
    }
  };

  ////////////RETURN BOOK END

  ////////CANCEL RESERVATION START
  const handleCancelReservation = async (reservationId, bookId, userId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('User not authenticated');
        return;
      }
      const response = await axios.put('https://librarydbbackend.onrender.com/cancel-reservation', {
        reservation_id: reservationId,
        book_id: bookId,
        user_id: userId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token to the headers
        },
      }
    );
  
      if (response.status === 200) {
        alert('Reservation canceled successfully');
        fetchData(); // Refresh data after canceling
      } else {
        alert('Failed to cancel reservation');
      }
    } catch (error) {
      console.error('Error canceling reservation:', error);
      alert('Error canceling reservation');
    }
  };

  /////CANCEL RESERVATION END

  return(
      <AppTheme {...props}>
          <Box
      sx={{
          boxShadow: 3, // Add a shadow to the enclosing box
          borderRadius: 2, // Optional: rounded corners
          padding: 2, // Optional: some padding around the table
          bgcolor: 'background.paper', // Optional: change the background color of the box
      }}
    >
      <Typography variant="h4" gutterBottom>Your Books</Typography>

{/* Pending Books DataGrid */}
<Box sx={{ marginBottom: 4 }}>
  <Typography variant="h6" gutterBottom>Pending Reservations</Typography>
  <div style={{ height: 400, width: '100%' }}>
    <DataGrid
      rows={pendingBooks}
      columns={pendingColumns}
      pageSize={5}
      rowsPerPageOptions={[5]}
      checkboxSelection
      disableSelectionOnClick
      getRowId={(row) => row.reservation_id}
    />
  </div>
</Box>

{/* Checked Out Books DataGrid */}
<Box sx={{ marginBottom: 4 }}>
  <Typography variant="h6" gutterBottom>Checked Out Books</Typography>
  <div style={{ height: 400, width: '100%' }}>
    <DataGrid
      rows={checkedOutBooks}
      columns={checkedOutColumns}
      pageSize={5}
      rowsPerPageOptions={[5]}
      checkboxSelection
      disableSelectionOnClick
      getRowId={(row) => row.reservation_id}
    />
  </div>
</Box>

{/* History Books DataGrid */}
<Box sx={{ marginBottom: 4 }}>
  <Typography variant="h6" gutterBottom>Book History</Typography>
  <div style={{ height: 400, width: '100%' }}>
    <DataGrid
      rows={historyBooks}
      columns={historyColumns}
      pageSize={5}
      rowsPerPageOptions={[5]}
      checkboxSelection
      disableSelectionOnClick
      getRowId={(row) => row.reservation_id}
    />
  </div>
</Box>
      {/*
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
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
          /> */}
    </Box>
    </AppTheme>
  )
}

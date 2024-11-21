import React, { useState } from 'react';
import { Box, Container, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { format } from 'date-fns';

const calculateFormattedDate = (dateTime) => {
  if (!dateTime) return { formattedDate: 'N/A' };

  const date = new Date(dateTime);
  const formattedDate = format(date, 'MM/dd/yyyy'); // Format as 'MM/DD/YYYY'

  return { formattedDate };
};

const isOverdue = (dueDate) => {
  if (!dueDate) return 'N/A';
  
  const currentDate = new Date();
  const due = new Date(dueDate);
  return due < currentDate ? 'Yes' : 'No'; // Check if the due date is in the past
};

const CheckedOutBooksTable = ({ books }) => {

  const [searchQuery, setSearchQuery] = useState('');
  const [searchBy, setSearchBy] = useState('book_title'); // Default search by Book Title

  // Filter books based on search query
  const filteredBooks = books.filter((row) => {
    const valueToSearch = searchBy === 'name'
    ? `${row.first_name} ${row.last_name}`.toLowerCase() // Concatenate first and last name for User Name search
    : row[searchBy]?.toLowerCase() || '';
    return valueToSearch.includes(searchQuery.toLowerCase());
  });

  return (
    <Container maxWidth="lg" sx={{ borderRadius: 2, boxShadow: 2, margin: '0 auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 2 }}>
        {/* Search Input */}
        <TextField
          label="Search"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flexGrow: 1 }}
        />

        {/* Toggle for Search By */}
        <TextField
          select
          label="Search By"
          value={searchBy}
          onChange={(e) => setSearchBy(e.target.value)}
          variant="outlined"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="book_title">Book Title</MenuItem>
          <MenuItem value="author">Author</MenuItem>
          <MenuItem value="name">User Name</MenuItem>
        </TextField>
      </Box>

      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Showing {filteredBooks.length} result(s)
      </Typography>
      
      <TableContainer component="div">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Book Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Date Borrowed</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Overdue</TableCell> {/* New column to show if overdue */}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBooks.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.book_title}</TableCell>
                <TableCell>{row.author}</TableCell>
                <TableCell>{`${row.first_name} ${row.last_name}`}</TableCell>
                <TableCell>{calculateFormattedDate(row.date_borrowed).formattedDate}</TableCell>
                <TableCell>{calculateFormattedDate(row.date_due).formattedDate}</TableCell>
                <TableCell>{isOverdue(row.date_due)}</TableCell> {/* Show overdue status */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default CheckedOutBooksTable;
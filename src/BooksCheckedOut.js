import React from 'react';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
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
  return (
    <Container maxWidth="lg" sx={{ borderRadius: 2, boxShadow: 2, margin: '0 auto' }}>
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
            {books.map((row) => (
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
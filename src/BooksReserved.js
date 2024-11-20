import React from 'react';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import { format } from 'date-fns';

const calculateFormattedDate = (dateTime) => {
    if (!dateTime) return { formattedDate: 'N/A' };
    
    const date = new Date(dateTime);
    const formattedDate = format(date, 'MM/dd/yyyy'); // Format as 'MM/DD/YYYY'

  return { formattedDate };
  };


const ReservedBooksTable = ({ books }) => {
  return (
    <Container  maxWidth="lg" sx={{ borderRadius: 2, boxShadow: 2, margin: '0 auto' }}>
      <TableContainer component="div">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Book Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Date Reserved</TableCell>
              <TableCell>Queue Position</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.book_title}</TableCell>
                <TableCell>{row.author}</TableCell>
                <TableCell>{`${row.first_name} ${row.last_name}`}</TableCell>
                <TableCell>{calculateFormattedDate(row.date_reserved).formattedDate}</TableCell>
                <TableCell>{row.queue_position}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ReservedBooksTable;
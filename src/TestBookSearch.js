import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';

export default function TestBookSearch() {
  const [isbn, setIsbn] = useState('');
  const [bookInfo, setBookInfo] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = () => {
    // Clear previous results
    setBookInfo(null);
    setError(null);

    // Fetch book data from Open Library API
    axios
      .get(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`)
      .then((response) => {
        const data = response.data[`ISBN:${isbn}`];
        if (data) {
          setBookInfo(data);
        } else {
          setError("No information found for this ISBN.");
        }
      })
      .catch((err) => {
        console.error("Error fetching book data:", err);
        setError("Failed to retrieve book data.");
      });
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="background.default"
      padding={3}
    >
      <Paper elevation={3} sx={{ padding: 4, width: '100%', maxWidth: 600, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Book Information Lookup
        </Typography>
        <TextField
          label="Enter ISBN"
          variant="outlined"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleSearch} fullWidth>
          Search
        </Button>

        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

        {bookInfo && (
          <Box mt={4} textAlign="left">
            <Typography variant="h6">{bookInfo.title}</Typography>
            <Typography>Author: {bookInfo.authors?.[0]?.name || 'N/A'}</Typography>
            <Typography>Publisher: {bookInfo.publishers?.[0]?.name || 'N/A'}</Typography>
            <Typography>Published Date: {bookInfo.publish_date || 'N/A'}</Typography>
          
          
          </Box>
        )}
      </Paper>
    </Box>
  );
}
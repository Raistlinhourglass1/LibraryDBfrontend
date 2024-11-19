import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, Paper, Snackbar, Alert } from '@mui/material';
import { useLocation } from 'react-router-dom';
import bgImage from './external/iStock-1193287049.jpg';

const BookCheckout = () => {
  const location = useLocation();
  const { book } = location.state;
  console.log('Getting book from results:', { book });

  const [isAnimating, setIsAnimating] = useState(true);
  const [isReadyForCheckout, setIsReadyForCheckout] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success', 'error', 'info', 'warning'

  // Simulate animation delay for 3 seconds before transitioning to the checkout page
  useEffect(() => {
    setTimeout(() => {
      setIsAnimating(false);
      setIsReadyForCheckout(true);
    }, 3000);
  }, []);

  const handleCheckout = async (bookId) => {
    try {
      const response = await fetch('https://librarydbbackend.onrender.com/checkout', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ book_id: bookId }),
      });

      const data = await response.json();

      if (response.ok) {
        setSnackbarMessage(data.message || 'Book checked out successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setTimeout(() => {
          window.location.href = '/ProfilePage2';
        }, 2000); // Redirect after 2 seconds
      } else {
        setSnackbarMessage(data.message || 'Failed to check out the book.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error checking out the book:', error);
      setSnackbarMessage('An error occurred. Please try again later.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Close the snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Paper
      sx={{
        height: '100vh',
        backgroundImage: `url(${bgImage})`,
        opacity: '90%',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Main Content Box with rounded corners */}
      <Box
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)', // Semi-transparent white background
          padding: 4,
          borderRadius: 2,
          width: '100%',
          maxWidth: '500px',
          textAlign: 'center',
        }}
      >
        {/* Animation page */}
        {isAnimating && (
          <Box>
            <Typography variant="h5" component="h2">
              Reserving your book...
            </Typography>
            <div className="loading-animation">
              <Typography variant="h6" color="primary">
                Please wait...
              </Typography>
            </div>
          </Box>
        )}

        {/* Checkout Page (After animation finishes) */}
        {!isAnimating && isReadyForCheckout && (
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Your book is ready for checkout!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleCheckout(book.id || book.book_id)}
              sx={{ marginTop: 2 }}
            >
              Checkout
            </Button>
          </Box>
        )}

        {/* Snackbar for feedback messages */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Paper>
  );
};

export default BookCheckout;
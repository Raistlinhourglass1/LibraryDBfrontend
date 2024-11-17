import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, Paper } from '@mui/material';
import { useLocation } from 'react-router-dom';

const BookCheckout = () => {
  const location = useLocation();
  const { book } = location.state;
  console.log('Getting book from results:', {book});

  const [isAnimating, setIsAnimating] = useState(true); // Track if the animation is still running
  const [isReadyForCheckout, setIsReadyForCheckout] = useState(false); // Track when the book is ready for checkout

  // Simulate animation delay for 3 seconds before transitioning to the checkout page
  useEffect(() => {
    console.log('useEffect start');
    setTimeout(() => {
      console.log('Timeout ended');
      setIsAnimating(false); // End animation
      setIsReadyForCheckout(true); // Show "Book Ready for Checkout"
    }, 3000); // 3 seconds of animation
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
            alert(data.message);
            window.location.href = '/ProfilePage2';
            // Optionally, update the book array state here to reflect the new status
        } else {
            alert(data.message || 'Failed to check out the book.');
        }
    } catch (error) {
        console.error('Error checking out the book:', error);
        alert('An error occurred. Please try again later.');
    }
};


  return (
    <Paper sx={{ padding: 4, textAlign: 'center' }}>
      {/* Animation page */}
      {isAnimating && (
        <Box sx={{ padding: 2 }}>
          <Typography variant="h5" component="h2">
            Reserving your book...
          </Typography>
          <div className="loading-animation">
            {/* This is where the animation happens */}
            <Typography variant="h6" color="primary">
              Please wait...
            </Typography>
          </div>
        </Box>
      )}

      {/* Checkout Page (After animation finishes) */}
      {!isAnimating && isReadyForCheckout && (
        <Box sx={{ padding: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Your book is ready for checkout!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleCheckout(book.id)}
            sx={{ marginTop: 2 }}
          >
            Checkout
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default BookCheckout;
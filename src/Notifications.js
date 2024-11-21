import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Snackbar, Alert  } from '@mui/material';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
        if (!token) {
            alert('User not authenticated');
            return;
        }
      try {
        const response = await fetch('https://librarydbbackend.onrender.com/notifications', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        console.log('data receieved:', data);

        if (response.ok) {
          setNotifications(data.notifications);
        } else {
          setError('Error fetching notifications');
        }
      } catch (error) {
        setError('Error fetching notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);  // This will run once when the component mounts

  const handleMarkAsNotified = async () => {
    const token = localStorage.getItem('token');
        if (!token) {
            alert('User not authenticated');
            return;
        }
    try {
      const response = await fetch('https://librarydbbackend.onrender.com/notifications-notified', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setNotifications([]); // Clear the notifications once they are marked as notified
      } else {
        setError('Error marking notifications as notified');
      }
    } catch (error) {
      setError('Error marking notifications as notified');
    }
  };


/*  for use in button to check out **DEFUNCT**
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success', 'error', 'info', 'warning'


  const handleCheckout = async (bookId) => {
    try {
      const response = await fetch('http://localhost:5000/checkout', {
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
  */

  return (
    <Box
      sx={{
        padding: '30px',
        width: '90%',
        maxWidth: '600px',
        backgroundColor: 'rgba(255, 255, 255, 0)', //transparent
        borderRadius: '8px',
        textAlign: 'center',
      }}
    >
      {loading && <CircularProgress size={24} sx={{ marginBottom: 2 }} />}

      {error && (
        <Typography variant="body1" sx={{ color: 'red' }}>
          {error}
        </Typography>
      )}

      {!loading && !error && notifications.length === 0 && (
        <Typography variant="body1" sx={{ marginTop: 2 }}>
          You have no new notifications.
        </Typography>
      )}

      {!loading && !error && notifications.length > 0 && (
        <Box>
          {notifications.map((notification, index) => (
            <Box
              key={index}
              sx={{
                padding: 2,
                backgroundColor: '#d4edda',
                color: '#155724',
                borderRadius: '8px',
                fontSize: '1.2rem',
                fontWeight: 500,
                marginBottom: 3,
              }}
            >
              <Typography>{`Your reserved book "${notification.book_title}" by ${notification.author} is now available!`}</Typography>
                    
                    {/*<Button
                    variant="standard"
                    color="primary"
                    sx={{
                    marginTop: 1,
                    fontSize: '0.9rem',
                    padding: '5px 10px',
                    textTransform: 'none',
                    }}
                    onClick={() => handleCheckout(notification.book_id)}
                >
                    Click here to checkout now
                </Button>*/}
            </Box>
          ))}
        </Box>
      )}

        {notifications.length > 0 && (
            <Button
            variant="outlined"
            color="secondary"
            onClick={handleMarkAsNotified}
            sx={{
                marginBottom: 2,
                fontSize: '0.9rem',
                padding: '5px 10px',
                textTransform: 'none',
            }}
        >
          Mark All as Read
        </Button>
      )}
      

       {/* Snackbar for feedback messages 
       <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>*/}
    </Box>
  );
};

export default Notifications;
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress } from '@mui/material';

const BookReservationForm = () => {
  
  const navigate = useNavigate();
  const location = useLocation();
  const { book } = location.state;
  console.log('Getting book:', {book});
  const [queuePosition, setQueuePosition] = useState(null);

  /*
  const [formData, setFormData] = useState({
    reservation_date_time: '',
    reservation_type: '',
    book_id: book.id,
    book_title: book.title || book.book_title,
    book_author: book.author
  });*/

  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    handleSubmit();
  }, []);

  /*
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };*/

  const handleSubmit = async () => {
    //e.preventDefault();
    console.log('book from submission: ', book);
    setIsSubmitting(true);
    setStatus('Processing reservation...');

    try {
      const token = localStorage.getItem('token'); // fetch the token
      console.log('Submitting with token:', token);

      const response = await fetch('https://librarydbbackend.onrender.com/_bookReservation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({book_id: book.id})    //removed formData
      });
  
      const data = await response.json();
      
      if (response.status === 409) {
        // Book is already reserved
        setStatus('This book is already reserved for the selected date. Please choose another date.');
      } else if (response.ok) {
        setQueuePosition(data.queue_position);  // Assuming the response contains the queue position
        setStatus(`Your book was successfully reserved! Your queue position is: ${data.queue_position}`);
        // Reset form
      } else {
        setStatus(`Error: ${data.message}`);
      }
    } catch(error) {
      console.error('Error submitting reservation:', error);
      setStatus('Error submitting reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = () => {
    if (status.includes('Error') || status.includes('already reserved')) {
      return 'bg-red-100 text-red-700';
    } else if (status.includes('Processing')) {
      return 'bg-yellow-100 text-yellow-700';
    } else if (status) {
      return 'bg-green-100 text-green-700';
    }
    return '';
  };

  return (
    <>
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ backgroundColor: '#f7f7f7' }}
    >
      <Box
        sx={{
          padding: '30px',
          width: '90%',
          maxWidth: '600px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: 3, fontWeight: 600 }}>
          Book Reservation
        </Typography>

        {status && (
          <Box
            sx={{
              padding: 2,
              backgroundColor: status.includes('Error') || status.includes('reserved') ? '#f8d7da' : '#d4edda',
              color: status.includes('Error') || status.includes('reserved') ? '#721c24' : '#155724',
              borderRadius: '8px',
              fontSize: '1.2rem',
              fontWeight: 500,
              marginBottom: 3,
              display: 'inline-block',
            }}
          >
            <Typography>{status}</Typography>
            {queuePosition && (
              <Typography variant="body1" sx={{ marginTop: 1 }}>
                Queue Position: {queuePosition}
              </Typography>
            )}
          </Box>
        )}

        {isSubmitting ? (
          <CircularProgress size={24} sx={{ marginBottom: 2 }} />
        ) : null}

        {!isSubmitting && status && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/ProfilePage2')}
            sx={{
              padding: '10px 20px',
              fontSize: '1rem',
              borderRadius: '8px',
            }}
          >
            Go to My Profile
          </Button>
        )}
      </Box>
    </Box>
    {/*
    <div>
      <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', background: '#fff', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', color: '#333' }}>Book Reservation</h2>
        
        {status && (
          <div className={`mb-4 p-3 rounded ${getStatusColor()}`}>
            {status}
          </div>
        )}
        

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label htmlFor="book_title">Book Title:</label>
            <input
              type="text"
              id="book_title"
              name="book_title"
              value={formData.book_title}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div>
            <label htmlFor="reservation_date_time">Reservation Date:</label>
            <input
              type="date"
              id="reservation_date_time"
              name="reservation_date_time"
              value={formData.reservation_date_time}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div>
            <label htmlFor="book_author">Book Author:</label>
            <input
              type="text"
              id="book_author"
              name="book_author"
              value={formData.book_author}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          
          <div>
            <label htmlFor="reservation_type">Reservation Type:</label>
            <select
              id="reservation_type"
              name="reservation_type"
              value={formData.reservation_type}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="">Select type</option>
              <option value="book">Book</option>
              <option value="periodical">Periodical</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: isSubmitting ? '#ccc' : '#d9534f',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer'
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Reservation'}
          </button>
        </form>
      </div>
    </div>*/}
  </>
  );
};

export default BookReservationForm;
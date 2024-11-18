import React, { useState, useEffect } from 'react';
import { TextField, Button, FormControl, FormLabel, Typography, Box, CircularProgress, MenuItem, Select } from '@mui/material';

const LaptopReservation = () => {
  const [laptops, setLaptops] = useState([]);
  const [selectedLaptop, setSelectedLaptop] = useState('');
  const [reservationDate, setReservationDate] = useState('');
  const [reservationTime, setReservationTime] = useState('');
  const [duration, setDuration] = useState(0);
  const [loggedInUserId, setLoggedInUserId] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLaptops = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://librarydbbackend.onrender.com/get-laptops');
        const data = await response.json();
        if (data.success) {
          setLaptops(data.data);
        } else {
          setErrorMessage('Error fetching laptops.');
        }
      } catch (error) {
        console.error('Error fetching laptops:', error);
        setErrorMessage('Error fetching laptops.');
      } finally {
        setLoading(false);
      }
    };

    fetchLaptops();
    setLoggedInUserId(localStorage.getItem('loggedInUserId'));
  }, []);

  const handleLaptopSelection = (e) => {
    setSelectedLaptop(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    setErrorMessage('');
    setLoading(true);
  
    const reservationDateTime = `${reservationDate}T${reservationTime}`;
  
    try {
      const response = await fetch('https://librarydbbackend.onrender.com/_laptopReservation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: loggedInUserId,
          laptopId: selectedLaptop,
          reservationDateTime: reservationDateTime,
          duration: duration,
        }),
      });
  
      let result;
      try {
        result = await response.json();
      } catch (error) {
        throw new Error('Server response was not in JSON format');
      }
  
      if (response.ok && result.success) {
        setSuccessMessage(result.message);
        setTimeout(() => {
          setDuration(0);
          setReservationTime('');
          setReservationDate('');
          setSelectedLaptop('');
          setSuccessMessage('');
        }, 2000);
      } else {
        setErrorMessage(result.message || 'Error making reservation. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(
        error.message === 'Server response was not in JSON format'
          ? 'Server error: Invalid response format'
          : 'Error making reservation. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Laptop Reservation
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <FormLabel htmlFor="laptop">Available Laptops</FormLabel>
            <Select
              id="laptop"
              value={selectedLaptop}
              onChange={handleLaptopSelection}
              fullWidth
              variant="outlined"
              required
            >
              <MenuItem value="" disabled>Select a laptop</MenuItem>
              {laptops.map((laptop) => (
                <MenuItem key={laptop.laptop_ID} value={laptop.laptop_ID}>
                  {laptop.model_name} - {laptop.serial_number}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Laptop Details */}
          {selectedLaptop && laptops.find(l => l.laptop_ID === selectedLaptop) && (
            <Box sx={{ marginY: 2, padding: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="subtitle2">
                {`Processor: ${laptops.find(l => l.laptop_ID === selectedLaptop).processor || 'N/A'}`}
              </Typography>
              <Typography variant="subtitle2">
                {`Memory: ${laptops.find(l => l.laptop_ID === selectedLaptop).memory || 'N/A'}`}
              </Typography>
              <Typography variant="subtitle2">
                {`Storage: ${laptops.find(l => l.laptop_ID === selectedLaptop).storage || 'N/A'}`}
              </Typography>
            </Box>
          )}

          {/* Reservation Date */}
          <FormControl fullWidth margin="normal">
            <FormLabel htmlFor="reservationDate">Reservation Date</FormLabel>
            <TextField
              type="date"
              id="reservationDate"
              name="reservationDate"
              value={reservationDate}
              onChange={(e) => setReservationDate(e.target.value)}
              fullWidth
              variant="outlined"
              required
              inputProps={{
                min: new Date().toISOString().split('T')[0] // Prevent past dates
              }}
            />
          </FormControl>

          {/* Reservation Time */}
          <FormControl fullWidth margin="normal">
            <FormLabel htmlFor="reservationTime">Reservation Time</FormLabel>
            <TextField
              type="time"
              id="reservationTime"
              name="reservationTime"
              value={reservationTime}
              onChange={(e) => setReservationTime(e.target.value)}
              fullWidth
              variant="outlined"
              required
            />
          </FormControl>

          {/* Duration */}
          <FormControl fullWidth margin="normal">
            <FormLabel htmlFor="duration">Duration (hours)</FormLabel>
            <TextField
              type="number"
              id="duration"
              name="duration"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              fullWidth
              variant="outlined"
              required
              inputProps={{
                min: 1,
                max: 24 // Assuming maximum reservation duration is 24 hours
              }}
            />
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
            disabled={!selectedLaptop || !reservationDate || !reservationTime || !duration}
          >
            Reserve Laptop
          </Button>
        </form>
      )}

      {successMessage && (
        <Typography variant="h6" color="green" sx={{ marginTop: 2 }}>
          {successMessage}
        </Typography>
      )}

      {errorMessage && (
        <Typography variant="h6" color="error" sx={{ marginTop: 2 }}>
          {errorMessage}
        </Typography>
      )}
    </Box>
  );
};

export default LaptopReservation;
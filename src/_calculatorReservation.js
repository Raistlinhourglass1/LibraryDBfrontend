import React, { useState, useEffect } from 'react';
import { TextField, Button, FormControl, FormLabel, Typography, Box, CircularProgress, MenuItem, Select, Radio, RadioGroup, FormControlLabel } from '@mui/material';

const CalculatorReservation = () => {
  const [calculators, setCalculators] = useState([]); 
  const [selectedCalculator, setSelectedCalculator] = useState(''); 
  const [selectedCalculatorType, setSelectedCalculatorType] = useState(''); 
  const [reservationDate, setReservationDate] = useState(''); 
  const [reservationTime, setReservationTime] = useState(''); 
  const [duration, setDuration] = useState(0); 
  const [loggedInUserId, setLoggedInUserId] = useState(''); 
  const [successMessage, setSuccessMessage] = useState(''); 
  const [errorMessage, setErrorMessage] = useState(''); 
  const [loading, setLoading] = useState(false); 

  // Fetch available calculators based on type when component mounts or type changes
  useEffect(() => {
    const fetchCalculators = async (calculatorType) => {
      setLoading(true);
      try {
        const response = await fetch(`https://librarydbbackend.onrender.com/get-calculators?type=${calculatorType}`);
        const data = await response.json();
        setCalculators(data);
      } catch (error) {
        console.error('Error fetching calculators:', error);
        setErrorMessage('Error fetching calculators.');
      } finally {
        setLoading(false);
      }
    };

    if (selectedCalculatorType) {
      fetchCalculators(selectedCalculatorType); // Fetch calculators when type is selected
    }
    
    // Get logged-in user
    setLoggedInUserId(localStorage.getItem('loggedInUserId'));
  }, [selectedCalculatorType]); // Re-run whenever selectedCalculatorType changes

  // Handle calculator type selection
  const handleCalculatorTypeChange = (e) => {
    setSelectedCalculatorType(e.target.value);
  };

  // Handle calculator selection
  const handleCalculatorSelection = (e) => {
    setSelectedCalculator(e.target.value);
  };

  // Handle form submission for reservation
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Fetch the token from local storage
  
    setErrorMessage(''); // Reset error message if any
  
    const reservationDateTime = `${reservationDate}T${reservationTime}`;
  
    try {
      const response = await fetch('https://librarydbbackend.onrender.com/_calculatorReservation', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Authorization with token
        },
        body: JSON.stringify({
          user_id: loggedInUserId,
          calculatorId: selectedCalculator,
          reservationDateTime: reservationDateTime,
          duration: duration,
          calculatorType: selectedCalculatorType, // Send selected calculator type
        }),
      });
  
      let result;
      // Check if the response is a valid JSON
      try {
        result = await response.json();
      } catch (error) {
        // If JSON parsing fails, read the response as text to see the error message
        const text = await response.text();
        console.error('Response is not JSON:', text);
        setErrorMessage('Server error: ' + text);
        return;
      }
  
      if (response.ok) {
        setSuccessMessage(result.message);
        setTimeout(() => {
          // Reset form
          setDuration(0);
          setReservationTime('');
          setReservationDate('');
          setSelectedCalculator('');
          setSelectedCalculatorType('');
          setSuccessMessage('');
        }, 2000);
      } else {
        // Log and display any message from the server if the response is not OK (400 or 500)
        console.error('Error from server:', result);
        setErrorMessage(result.message || 'Error making reservation. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Error making reservation. Please try again.');
      setSuccessMessage('');
    }
  };
  

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Calculator Reservation
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Type Selection */}
          <FormControl fullWidth margin="normal">
            <FormLabel>Select Calculator Type</FormLabel>
            <RadioGroup
              name="calculatorType"
              value={selectedCalculatorType}
              onChange={handleCalculatorTypeChange}
              row
            >
              <FormControlLabel value="Graphing" control={<Radio />} label="Graphing" />
              <FormControlLabel value="Scientific" control={<Radio />} label="Scientific" />
            </RadioGroup>
          </FormControl>

          {/* Available Calculators */}
          <FormControl fullWidth margin="normal">
            <FormLabel htmlFor="calculator">Available Calculators</FormLabel>
            <Select
              id="calculator"
              value={selectedCalculator}
              onChange={handleCalculatorSelection}
              fullWidth
              variant="outlined"
              disabled={!selectedCalculatorType} // Disable if no type selected
            >
              <MenuItem value="" disabled>Select a calculator</MenuItem>
              {calculators.map((calculator) => (
                <MenuItem key={calculator.calculator_id} value={calculator.calculator_id}>
                  {calculator.calculator_model} - {calculator.calc_type} ({calculator.model_name})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Other form fields for reservation details */}
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
            />
          </FormControl>

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
            />
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
            disabled={!selectedCalculator || !reservationDate || !reservationTime || !duration}
          >
            Reserve Calculator
          </Button>
        </form>
      )}

      {successMessage && (
        <Typography variant="h6" color="green" sx={{ marginTop: 2 }}>
          {successMessage}
        </Typography>
      )}

      {errorMessage && (
        <Typography variant="h6" color="red" sx={{ marginTop: 2 }}>
          {errorMessage}
        </Typography>
      )}
    </Box>
  );
};

export default CalculatorReservation;
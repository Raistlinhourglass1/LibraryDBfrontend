import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const theme = createTheme();

function AudioBookEntry({ book, onSubmit, onClose }) {
  const navigate = useNavigate();  // React Router for navigation
  const [formData, setFormData] = useState({
    abISBN: book?.abISBN || '',
    abTitle: book?.abTitle || '',
    abAuthor: book?.abAuthor || '',
    abNarrator: book?.abNarrator || '',
    abPublisher: book?.abPublisher || '',
    abCategory: book?.abCategory || '',
    abEdition: book?.abEdition || '',
    abLanguage: book?.abLanguage || '',
    abDate: book?.abDate || '',
    abDuration: book?.abDuration || '',
    abFormat: book?.abFormat || '',
    abSummary: book?.abSummary || '',
    abNotes: book?.abNotes || '',
    abFile: null, // File input
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); 
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You must be logged in to add an audiobook.');
      setMessageType('error');
      navigate('/login');  // Redirect to login page
    } else {
      setAuthToken(token); // Token exists, proceed with the normal flow
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      abFile: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!authToken) {
      setMessage('You must be logged in to add an audiobook.');
      setMessageType('error');
      setLoading(false);
      return;
    }

    // Prepare FormData for submission
    const formDataObj = new FormData();
    formDataObj.append('abFile', formData.abFile);
    formDataObj.append('abISBN', formData.abISBN);
    formDataObj.append('abTitle', formData.abTitle);
    formDataObj.append('abAuthor', formData.abAuthor);
    formDataObj.append('abNarrator', formData.abNarrator);
    formDataObj.append('abPublisher', formData.abPublisher);
    formDataObj.append('abCategory', formData.abCategory);
    formDataObj.append('abEdition', formData.abEdition);
    formDataObj.append('abLanguage', formData.abLanguage);
    formDataObj.append('abDate', formData.abDate);
    formDataObj.append('abDuration', formData.abDuration);
    formDataObj.append('abFormat', formData.abFormat);
    formDataObj.append('abSummary', formData.abSummary);
    formDataObj.append('abNotes', formData.abNotes);

    try {
      const response = await fetch('https://librarydbbackend.onrender.com/catalog-entry/audiobook', {
        method: 'POST',
        body: formDataObj,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Audiobook successfully submitted!');
        setMessageType('success');
      } else {
        throw new Error(result.message || 'Unknown error occurred');
      }
    } catch (error) {
      setMessage(error.message);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      abISBN: '',
      abTitle: '',
      abAuthor: '',
      abNarrator: '',
      abPublisher: '',
      abCategory: '',
      abEdition: '',
      abLanguage: '',
      abDate: '',
      abDuration: '',
      abFormat: '',
      abSummary: '',
      abNotes: '',
      abFile: null,
    });
    setMessage('');
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{ mt: 3 }}
        >
          <Typography component="h1" variant="h5" gutterBottom>
            {book ? 'Edit Audiobook' : 'Add New Audiobook'}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="ISBN"
                helperText="Enter a valid ISBN"
                fullWidth
                variant="standard"
                name="abISBN"
                value={formData.abISBN}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Title"
                helperText="Enter the audiobook's title"
                fullWidth
                variant="standard"
                name="abTitle"
                value={formData.abTitle}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Author"
                helperText="Enter the audiobook's author"
                fullWidth
                variant="standard"
                name="abAuthor"
                value={formData.abAuthor}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} mt={2}>
            <Grid item xs={6}>
              <TextField
                label="Duration (HH:MM:SS)"
                helperText="Enter the duration"
                fullWidth
                variant="standard"
                name="abDuration"
                value={formData.abDuration}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Number of Copies"
                type="number"
                helperText="Enter the number of copies"
                fullWidth
                variant="standard"
                name="abNumCopies"
                value={formData.abNumCopies}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} mt={2}>
            <Grid item xs={6}>
              <TextField
                label="Summary"
                helperText="Enter a brief summary"
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                name="abSummary"
                value={formData.abSummary}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Notes"
                helperText="Enter any additional notes"
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                name="abNotes"
                value={formData.abNotes}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <input
              type="file"
              name="abFile"
              onChange={handleFileChange}
              required
            />
          </Grid>

          <Stack direction="row" spacing={2} mt={3}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? 'Submitting...' : book ? 'Update Audiobook' : 'Add Audiobook'}
            </Button>
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              onClick={handleClear}
              disabled={loading}
            >
              Clear
            </Button>
            <Button
              type="button"
              variant="outlined"
              color="error"
              onClick={onClose}
            >
              Cancel
            </Button>
          </Stack>

          {message && (
            <Typography
              variant="body2"
              color={messageType === 'error' ? 'red' : 'green'}
              mt={2}
            >
              {message}
            </Typography>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default AudioBookEntry;

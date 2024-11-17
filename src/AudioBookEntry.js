import React, { useState, useEffect  } from 'react';
import { Breadcrumbs, Box, Button, CssBaseline, Container, Link, MenuItem, Stack, ThemeProvider, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import ClaudeTheme from './ClaudeTheme';

const format = [
    { value: 'mp3', label: 'MP3' },
    { value: 'cd', label: 'CD' },
    { value: 'digitaldownload', label: 'Digital Download' }
];

function AudioBookEntry({book, onClose, fetchData}) {
    const [cleared, setCleared] = useState(false);

    const [formData, setFormData] = useState({
        abIsbn: '',
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
        abNumCopies: '',
        abSummary: '',
        abNotes: ''
    });

        ////this is for editing book state
        useEffect(() => {
            if (book) {
                
              setFormData({
                abook_id: book.audio_id,
                abIsbn: book.audio_isbn,
                abTitle: book.audio_title,
                abAuthor: book.audio_author,
                abPublisher: book.audio_publisher,
                abNarrator: book.audio_narrator,
                abCategory: book.audio__category,
                abEdition: book.audio_edition,
                abDate: book.date_published,
                abDuration: book.duration,
                abFormat: book.format,
                abLang: book.audio_language,
                abSummary: book.audio_summary,
                abNotes: book.book_notes,
              });
              setIsbn(book.audio_isbn)
            }
          }, [book]);
          ////////////end book edit state

    /////formatting isbn start
    const [isbn, setIsbn] = useState(formData.abIsbn);

    const formatIsbn = (isbn) => {
        // Remove non-numeric characters
        const cleanedIsbn = isbn.replace(/[^0-9]/g, '');
    
        // Format as ISBN-13 or ISBN-10
        if (cleanedIsbn.length <= 10) {
          return cleanedIsbn.replace(/(\d{3})(\d{1})(\d{4})(\d{4})/, '$1-$2-$3-$4');
        } else if (cleanedIsbn.length <= 13) {
          return cleanedIsbn.replace(/(\d{3})(\d{1})(\d{4})(\d{4})(\d{1})/, '$1-$2-$3-$4-$5');
        }
        return cleanedIsbn;
      };
    
      // Handle ISBN change: store raw value and format for display
      const handleIsbnChange = (event) => {
        // Get the raw input value (remove dashes and non-numeric characters)
        let rawIsbn = event.target.value.replace(/[^0-9]/g, '');
        
        // Limit to 13 characters
        if (rawIsbn.length > 13) {
          rawIsbn = rawIsbn.slice(0, 13); // Cut off excess characters
        }
    
        setIsbn(rawIsbn); // Store raw ISBN (no dashes)
        handleChange(event); // Call the parent handler for other form fields
      };

    ////////formatting isbn end

    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('');
    const [error, setError] = useState(false); // State for error
    const [helperText, setHelperText] = useState(''); // State for helper text
    const [loading, setLoading] = useState(false); // Loading state for the form submission

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        if (name === 'abIsbn' && !/^\d{10}|\d{13}$/.test(value)) {
            setError(true);
            setHelperText('Invalid ISBN format');
        } else {
            setError(false);
            setHelperText('Enter the ISBN');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const isEditMode = !!formData.book_id; // Check if we are editing (has book_id)
        const method = isEditMode ? 'PUT' : 'POST';
        try {
            const response = await fetch('https://librarydbbackend.onrender.com/audiobook', {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const successMessage = isEditMode ? 'Audiobook updated successfully!' : 'Audiobook added successfully!';
                setMessage(successMessage);
            setMessageType('success');
            } else {
                const errorData = await response.json();
                setMessage(errorData.message);
                setMessageType('danger');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage(`Error submitting data: ${error.message}`);
            setMessageType('danger');
        }
    };

    React.useEffect(() => {
        if (cleared) {
            const timeout = setTimeout(() => setCleared(false), 1500);
            return () => clearTimeout(timeout);
        }
    }, [cleared]);

    const handleClear = () => {
        setFormData({
            abIsbn: '',
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
            abNumCopies: '',
            abSummary: '',
            abNotes: ''
        });
      };

    return (
        <>
    <ThemeProvider theme={ClaudeTheme}>
      <CssBaseline />
        <Container maxWidth="lg">
            <Box
                component="form"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    '& .MuiTextField-root': { marginBottom: 5 },
                    p: 3,
                    borderRadius: 2, // Rounded corners
                    boxShadow: 3, // Shadow for a card-like effect
                }}
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit}
                >

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Grid item size={6}>
                        <TextField
                            required
                            helperText={helperText}
                            error={error}
                            label="ISBN"
                            type="number"
                            variant="standard"
                            name="abIsbn"
                            value={formatIsbn(isbn)}
                            onChange={handleIsbnChange}
                            
                        />
                    </Grid>
                </Box>

                {/* Use Grid with size configuration like the BookEntry page */}
                <Grid container spacing={2}>
                    <Grid item size={5}>
                        <TextField
                            required
                            helperText="Enter the Title"
                            label="Title"
                            variant="standard"
                            name="abTitle"
                            value={formData.abTitle}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item size={5}>
                        <TextField
                            required
                            helperText="Enter the Author"
                            label="Author"
                            variant="standard"
                            name="abAuthor"
                            value={formData.abAuthor}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
                
                <Grid container spacing={2}>
                    <Grid item size={5}>
                        <TextField
                            helperText="Enter the Narrator"
                            label="Narrator"
                            variant="standard"
                            name="abNarrator"
                            value={formData.abNarrator}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item size={5}>
                        <TextField
                            helperText="Enter the Publisher"
                            label="Publisher"
                            variant="standard"
                            name="abPublisher"
                            value={formData.abPublisher}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item size={3}>
                        <TextField
                            helperText="Enter the Category"
                            label="Category"
                            variant="standard"
                            name="abCategory"
                            value={formData.abCategory}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item size={3}>
                        <TextField
                            label="Edition"
                            variant="standard"
                            name="abEdition"
                            value={formData.abEdition}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            label="Language"
                            variant="standard"
                            name="abLanguage"
                            value={formData.abLanguage}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item size={4}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                variant="standard"
                                label="Date Published"
                                views={['year', 'month', 'day']}
                                name="abDate"
                                value={formData.abDate ? dayjs(formData.abDate, 'YYYY-MM-DD') : null}
                                onChange={(newValue) => {
                                    setFormData((prevFormData) => ({
                                        ...prevFormData,
                                        abDate: newValue ? newValue.format('YYYY-MM-DD') : null
                                    }));
                                }}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item size={4}>
                        <TextField
                            select
                            label="Format"
                            helperText="Please select the format type"
                            variant="standard"
                            name="abFormat"
                            value={formData.abFormat}
                            onChange={handleChange}
                        >
                            {format.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item size={4}>
                        <TextField
                            required
                            label="Duration"
                            variant="standard"
                            name="abDuration"
                            value={formData.abDuration}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
                <TextField
                    label="Summary"
                    multiline
                    rows={4}
                    name="abSummary"
                    value={formData.abSummary}
                    onChange={handleChange}
                />
                <TextField
                    label="Notes"
                    multiline
                    rows={4}
                    name="abNotes"
                    value={formData.abNotes}
                    onChange={handleChange}
                />
                    

                    <Stack spacing={2} direction="row" justifyContent="flex-end">
                        <Button variant="text" onClick={handleClear}>Clear</Button>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>{book ? 'Update Book' : 'Add Book'}</Button>
                    </Stack>
                    {message && <div>{message}</div>} {/* Display success or error message */}
                </Box>
            </Container>
        </ThemeProvider>
        </>
    );
}

export default AudioBookEntry;
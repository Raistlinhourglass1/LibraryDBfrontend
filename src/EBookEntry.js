import React, { useState, useEffect } from 'react';
import {
    Breadcrumbs, Box, Button, CssBaseline, Container, MenuItem, Stack, TextField, ThemeProvider, Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import ClaudeTheme from './ClaudeTheme';

const format = [
    { value: 'pdf', label: 'PDF' },
    { value: 'epub', label: 'EPUB' },
    { value: 'online', label: 'Online' },
];

const access_type = [
    { value: 'open access', label: 'Open Access' },
    { value: 'subscription-based', label: 'Subscription-Based' },
    { value: 'library patrons only', label: 'Library Patrons Only' },
];

function EBookEntry({ ebook, onClose, fetchData }) {
    const [formData, setFormData] = useState({
        ebIsbn: '',
        ebTitle: '',
        ebAuthor: '',
        ebPublisher: '',
        ebCategory: '',
        ebEdition: '',
        ebLanguage: '',
        ebDate: '',
        ebFormat: '',
        ebUrl: '',
        ebAccessType: '',
        ebSummary: '',
        ebNotes: '',
    });

    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('');
    const [error, setError] = useState(false);
    const [helperText, setHelperText] = useState('');

    // Populate form for editing
    useEffect(() => {
        if (ebook) {
            setFormData({
                ebIsbn: ebook.ebook_isbn || '',
                ebTitle: ebook.ebook_title || '',
                ebAuthor: ebook.ebook_author || '',
                ebPublisher: ebook.ebook_publisher || '',
                ebCategory: ebook.ebook_category || '',
                ebEdition: ebook.ebook_edition || '',
                ebLanguage: ebook.ebook_language || '',
                ebDate: ebook.ebook_year || '',
                ebFormat: ebook.resource_type || '',
                ebUrl: ebook.url || '',
                ebAccessType: ebook.accessType || '',
                ebSummary: ebook.ebook_summary || '',
                ebNotes: ebook.ebook_notes || '',
            });
            setIsbn(ebook.ebook_isbn)
        }
    }, [ebook]);

    
    /////formatting isbn start
    const [isbn, setIsbn] = useState(formData.ebIsbn);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'ebIsbn' && !/^\d{10}|\d{13}$/.test(value)) {
            setError(true);
            setHelperText('Invalid ISBN format');
        } else {
            setError(false);
            setHelperText('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const method = ebook ? 'PUT' : 'POST';

            const response = await fetch('https://librarydbbackend.onrender.com/catalog-entry/ebook', {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const responseData = await response.json();

            if (response.ok) {
                setMessage(ebook ? 'eBook updated successfully' : 'eBook added successfully');
                setMessageType('success');
                fetchData(); // Fetch updated list
                onClose(); // Close dialog
            } else {
                setMessage(responseData.message || 'Error submitting eBook');
                setMessageType('danger');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Error submitting data: ' + error.message);
            setMessageType('danger');
        }
    };

    const handleClear = () => {
        setFormData({
            ebIsbn: '',
            ebTitle: '',
            ebAuthor: '',
            ebPublisher: '',
            ebCategory: '',
            ebEdition: '',
            ebLanguage: '',
            ebDate: '',
            ebFormat: '',
            ebUrl: '',
            ebAccessType: '',
            ebSummary: '',
            ebNotes: '',
        });
        setError(false);
        setHelperText('');
    };

    return (
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
                        borderRadius: 2,
                        boxShadow: 3,
                    }}
                    noValidate
                    autoComplete="off"
                    onSubmit={handleSubmit}
                >
                    <Typography variant="h5" gutterBottom>
                        {ebook ? 'Edit eBook' : 'Add eBook'}
                    </Typography>
                    <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                helperText={helperText}
                                error={error}
                                id="standard-basic"
                                label="ISBN"
                                variant="standard"
                                name="ebIsbn"
                                value={formatIsbn(isbn)}
                                onChange={handleIsbnChange}
                                sx={{ width: '40%' }}
                            />
                        </Grid>
                    <Grid container spacing={2}>
                        
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                helperText="Enter the Title"
                                label="Title"
                                variant="standard"
                                name="ebTitle"
                                value={formData.ebTitle}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            helperText="Enter the Author"
                            label="Author"
                            variant="standard"
                            name="ebAuthor"
                            value={formData.ebAuthor}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            helperText="Enter the Publisher"
                            label="Publisher"
                            variant="standard"
                            name="ebPublisher"
                            value={formData.ebPublisher}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            helperText="Enter the Category"
                            label="Category"
                            variant="standard"
                            name="ebCategory"
                            value={formData.ebCategory}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item size={2}>
                        <TextField
                            label="Edition"
                            variant="standard"
                            name="ebEdition"
                            value={formData.ebEdition}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Language"
                            variant="standard"
                            name="ebLanguage"
                            value={formData.ebLanguage}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item size={3}>
                        <TextField
                            select
                            label="Format"
                            helperText="Please select the format type"
                            variant="standard"
                            name="ebFormat"
                            value={formData.ebFormat}
                            onChange={handleChange}
                            fullWidth
                        >
                            {format.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item size={4}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                views={['year']}
                                label="Copyright Year"
                                name="ebDate"
                                value={formData.ebDate ? dayjs(`${formData.ebDate}`, 'YYYY') : null}
                                onChange={(newValue) => {
                                    setFormData((prevFormData) => ({
                                    ...prevFormData,
                                    ebDate: newValue ? newValue.year() : null, // Store the year directly as a number
                                    }));
                                }}
                                slo
                                slotProps={{
                                    textField: { helperText: 'Select the publication year' },
                                }}
                                fullWidth
                            />
                        </LocalizationProvider>
                    </Grid>
                    
                    <Grid item size={8}>
                        <TextField
                            label="URL"
                            variant="standard"
                            name="ebUrl"
                            value={formData.ebUrl}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            label="Access Type"
                            helperText="Please select the access type"
                            variant="standard"
                            name="ebAccessType"
                            value={formData.ebAccessType}
                            onChange={handleChange}
                            fullWidth
                        >
                            {access_type.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
     
                        <TextField
                            label="Summary"
                            multiline
                            rows={4}
                            name="ebSummary"
                            value={formData.ebSummary}
                            onChange={handleChange}
                            fullWidth
                        />

                        <TextField
                            label="Notes"
                            multiline
                            rows={4}
                            name="ebNotes"
                            value={formData.ebNotes}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Stack spacing={2} direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
                        <Button variant="outlined" onClick={handleClear}>
                            Clear
                        </Button>
                        <Button variant="contained" type="submit">
                            {ebook ? 'Update' : 'Submit'}
                        </Button>
                    </Stack>
                    {message && (
                    <Typography
                        variant="body2"
                        color={messageType === 'success' ? 'green' : 'red'}
                        sx={{ mt: 2 }}
                    >
                        {message}
                    </Typography>
                )}
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default EBookEntry;
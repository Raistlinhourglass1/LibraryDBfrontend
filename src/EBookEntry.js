import React, { useState } from 'react';
import { Breadcrumbs, Box, Button, CssBaseline, Container, Link, MenuItem, Stack, TextField, ThemeProvider, Typography } from '@mui/material';
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

function EBookEntry() {
    const [cleared, setCleared] = useState(false);
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
        ebNumCopies: '',
        ebSummary: '',
        ebNotes: '',
    });

    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('');
    const [error, setError] = useState(false);
    const [helperText, setHelperText] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'ebIsbn' && !/^\d{10}|\d{13}$/.test(value)) {
            setError(true);
            setHelperText("Invalid ISBN format");
        } else {
            setError(false);
            setHelperText("Enter the ISBN");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (error || Object.values(formData).some(field => !field)) {
            setMessage('Please fill all the required fields correctly');
            setMessageType('danger');
            return;
        }

        try {
            const response = await fetch('https://librarydbbackend.onrender.com/catalog-entry/ebook', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const responseData = await response.json();

            if (response.ok) {
                setMessage('eBook added successfully');
                setMessageType('success');
            } else {
                setMessage(responseData.message || 'Error adding eBook');
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
            ebNumCopies: '',
            ebSummary: '',
            ebNotes: '',
        });
        setError(false);
        setHelperText('');
    };

    React.useEffect(() => {
        if (cleared) {
            const timeout = setTimeout(() => {
                setCleared(false);
            }, 1500);

            return () => clearTimeout(timeout);
        }
        return () => {};
    }, [cleared]);

    return (
        <>
    <ThemeProvider theme={ClaudeTheme}>
      <CssBaseline />
        <Container maxWidth="lg">
            <Box component="form"
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
                onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Grid item size={6}>
                        <TextField
                            required
                            helperText={helperText}
                            error={error}
                            id="standard-basic"
                            label="ISBN"
                            type="number"
                            variant="standard"
                            name="ebIsbn"
                            value={formData.ebIsbn}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                </Box>
                <Grid container spacing={2}>
                    
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            helperText="Enter the Title"
                            id="standard-required"
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
                            id="standard-required"
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
                            id="standard-basic"
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
                            id="standard-basic"
                            label="Category"
                            variant="standard"
                            name="ebCategory"
                            value={formData.ebCategory}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            id="standard-basic"
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
                            id="standard-basic"
                            label="Language"
                            variant="standard"
                            name="ebLanguage"
                            value={formData.ebLanguage}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                variant="standard"
                                slotProps={{
                                    textField: { helperText: 'Year' },
                                    field: { clearable: true, onClear: () => setCleared(true) },
                                }}
                                label="Copyright Year"
                                views={['year']}
                                name="ebDate"
                                value={formData.ebDate ? dayjs(formData.ebDate, 'YYYY') : null}
                                onChange={(newValue) => {
                                    if (newValue) {
                                        setFormData((prev) => ({ ...prev, ebDate: newValue.year() }));
                                    } else {
                                        setFormData((prev) => ({ ...prev, ebDate: null }));
                                    }
                                }}
                                fullWidth
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} sm={6}>
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
                    <Grid item xs={12} sm={6}>
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
                        id="outlined-multiline-static"
                        label="Summary"
                        multiline
                        rows={4}
                        name="ebSummary"
                        value={formData.ebSummary}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        id="outlined-multiline-static"
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
                    <Button variant="outlined" onClick={handleClear}>Clear</Button>
                    <Button variant="contained" type="submit">Submit</Button>
                </Stack>
            </Box>
        </Container>
    </ThemeProvider>
    </>
    );
}

export default EBookEntry;
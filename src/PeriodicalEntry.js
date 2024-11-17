import React, { useState } from 'react';
import { Breadcrumbs, Box, Button, CssBaseline, Container, Link, MenuItem, Stack, TextField, ThemeProvider, Typography, Paper } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import ClaudeTheme from './ClaudeTheme';

const type = [
    { value: 'newspaper', label: 'Newspaper' },
    { value: 'magazine', label: 'Magazine' },
    { value: 'journal', label: 'Journal' }
];

const format = [
    { value: 'print', label: 'Print' },
    { value: 'digital', label: 'Digital' }
];

const frequency = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' }
];

function PeriodicalEntry() {
    const [cleared, setCleared] = React.useState(false);
    const [formData, setFormData] = useState({
        pIssn: '',
        pTitle: '',
        pAuthor: '',
        pType: '',
        pPublisher: '',
        pCategory: '',
        pFormat: '',
        pUrl: '',
        pFrequency: '',
        pIssueDate: '',
        pIssueVolume: '',
        pIssueNumber: '',
        pLanguage: '',
        pNumCopies: '',
        pDescription: '',
        pNotes: '',
    });

    const [message, setMessage] = useState(null); 
    const [messageType, setMessageType] = useState('');
    const [error, setError] = useState(false); 
    const [helperText, setHelperText] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://librarydbbackend.onrender.com/catalog-entry/periodical', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setMessage('Periodical added successfully');
                setMessageType('success');
            } else {
                const errorData = await response.json();
                setMessage(errorData.message);
                setMessageType('danger');
            }
        } catch (error) {
            setMessage('Error submitting data: ' + error.message);
            setMessageType('danger');
        }
    };

    React.useEffect(() => {
        if (cleared) {
            const timeout = setTimeout(() => setCleared(false), 1500);
            return () => clearTimeout(timeout);
        }
    }, [cleared]);

    return (
        <>
    <ThemeProvider theme={ClaudeTheme}>
      <CssBaseline />
        <Container maxWidth="lg">
            <Box component="form" sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }} noValidate autoComplete="off" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
        {/* First Row - ISSN, Title, Author */}
        <Grid item xs={12} sm={4}>
          <TextField
            helperText="Enter the ISSN if applicable"
            id="standard-basic"
            label="ISSN"
            variant="standard"
            name="pIssn"
            value={formData.pIssn}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            required
            helperText="Enter the Title"
            id="standard-required"
            label="Title"
            variant="standard"
            name="pTitle"
            value={formData.pTitle}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            helperText="Enter the Author if applicable"
            id="standard-basic"
            label="Author"
            variant="standard"
            name="pAuthor"
            value={formData.pAuthor}
            onChange={handleChange}
          />
        </Grid>

        {/* Second Row - Type, Publisher, Category */}
        <Grid item xs={12} sm={4}>
          <TextField
            select
            label="Type"
            helperText="Please select the type of periodical"
            variant="standard"
            name="pType"
            value={formData.pType}
            onChange={handleChange}
          >
            {type.map((option) => (
              <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            helperText="Enter the Publisher"
            id="standard-basic"
            label="Publisher"
            variant="standard"
            name="pPublisher"
            value={formData.pPublisher}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            helperText="Enter the Category"
            id="standard-basic"
            label="Category"
            variant="standard"
            name="pCategory"
            value={formData.pCategory}
            onChange={handleChange}
          />
        </Grid>

        {/* Third Row - Format, URL, Frequency */}
        <Grid item xs={12} sm={4}>
          <TextField
            select
            label="Format"
            helperText="Please select the format"
            variant="standard"
            name="pFormat"
            value={formData.pFormat}
            onChange={handleChange}
          >
            {format.map((option) => (
              <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            helperText="Enter the URL if applicable"
            id="standard-basic"
            label="URL"
            variant="standard"
            name="pUrl"
            value={formData.pUrl}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            select
            label="Frequency"
            helperText="Please select the frequency of the issues"
            variant="standard"
            name="pFrequency"
            value={formData.pFrequency}
            onChange={handleChange}
          >
            {frequency.map((option) => (
              <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Fourth Row - Issue Date */}
        <Grid item xs={12} sm={4}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              variant="standard"
              label="Date of Publication"
              views={['year', 'month', 'day']}
              name="pIssueDate"
              value={formData.pIssueDate ? dayjs(formData.pIssueDate) : null}
              onChange={(newValue) => {
                if (newValue && newValue.isValid()) {
                  setFormData((prevData) => ({
                    ...prevData,
                    pIssueDate: newValue.format('YYYY-MM-DD'),
                  }));
                } else {
                  setFormData((prevData) => ({
                    ...prevData,
                    pIssueDate: null,
                  }));
                }
              }}
            />
          </LocalizationProvider>
        </Grid>

        {/* Fifth Row - Issue Volume, Issue Number */}
        <Grid item xs={12} sm={4}>
          <TextField
            label="Issue Volume"
            variant="standard"
            name="pIssueVolume"
            value={formData.pIssueVolume}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Issue Number"
            variant="standard"
            name="pIssueNumber"
            value={formData.pIssueNumber}
            onChange={handleChange}
          />
        </Grid>

        {/* Sixth Row - Language, Number of Copies */}
        <Grid item xs={12} sm={4}>
          <TextField
            label="Language"
            variant="standard"
            name="pLanguage"
            value={formData.pLanguage}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Number of Copies"
            variant="standard"
            name="pNumCopies"
            value={formData.pNumCopies}
            onChange={handleChange}
          />
        </Grid>

        {/* Seventh Row - Description, Notes */}
        <Grid item xs={12}>
          <TextField
            label="Description"
            multiline
            rows={4}
            variant="standard"
            name="pDescription"
            value={formData.pDescription}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Notes"
            multiline
            rows={4}
            variant="standard"
            name="pNotes"
            value={formData.pNotes}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
            </Box>

            <Stack spacing={2} direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
                <Button variant="text" onClick={() => setFormData({})}>Clear</Button>
                <Button variant="outlined">Cancel</Button>
                <Button variant="contained" onClick={handleSubmit}>Add Periodical</Button>
            </Stack>
            {message && (
                <Typography variant="body2" color={messageType === 'success' ? 'green' : 'red'} sx={{ mt: 2 }}>
                    {message}
                </Typography>
            )}
        </Container>
    </ThemeProvider>
    </>
    );
}

export default PeriodicalEntry;
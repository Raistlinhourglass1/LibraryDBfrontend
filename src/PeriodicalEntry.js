import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, MenuItem, Stack, Typography, Paper, Container, CssBaseline } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { ThemeProvider } from '@mui/material/styles';
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

function PeriodicalEntry({ periodical, onClose, fetchData }) {
  console.log("selected periodical: ", periodical);
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
    pDescription: '',
    pNotes: '',
  });
    const [message, setMessage] = useState(null); 
    const [messageType, setMessageType] = useState('');
    const [error, setError] = useState(false); 
    const [helperText, setHelperText] = useState('');

    useEffect(() => {
      if (periodical) {
        setFormData({
          pIssn: periodical.periodical_issn || '',
          pTitle: periodical.periodical_title || '',
          pAuthor: periodical.periodical_author || '',
          pType: periodical.periodical_type || '',
          pPublisher: periodical.periodical_publisher || '',
          pCategory: periodical.periodical_category || '',
          pFormat: periodical.format || '',
          pUrl: periodical.periodical_url || '',
          pFrequency: periodical.frequency || '',
          pIssueDate: periodical.issue_date || '',
          pIssueVolume: periodical.issue_volume || '',
          pIssueNumber: periodical.issue_number || '',
          pLanguage: periodical.periodical_language || '',
          pDescription: periodical.periodical_description || '',
          pNotes: periodical.periodical_notes || '',
        });
      }
    }, [periodical]);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };
  

    const handleSubmit = async (e) => {
      e.preventDefault();
      const method = periodical ? 'PUT' : 'POST';
        try {
            const response = await fetch('https://librarydbbackend.onrender.com/catalog-entry/periodical', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
              setMessage('Periodical saved successfully');
              setMessageType('success');
              onClose();  // Close dialog after successful submission
              fetchData();  // Refetch data to update the catalog
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
      <ThemeProvider theme={ClaudeTheme}>
      <CssBaseline />
      <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>{periodical ? 'Edit Periodical' : 'Add Periodical'}</DialogTitle>
        <DialogContent>
          <Container>
            <Paper sx={{ p: 3 }}>
              
              <TextField
                    helperText="Enter the ISSN if applicable"
                    label="ISSN"
                    variant="standard"
                    name="pIssn"
                    value={formData.pIssn}
                    onChange={handleChange}
                  />

              <Grid container spacing={2} sx={{ marginTop: 2 }}>
                {/* First Row - ISSN, Title, Author */}

                <Grid item size={5}>
                  <TextField
                    required
                    helperText="Enter the Title"
                    label="Title"
                    variant="standard"
                    name="pTitle"
                    value={formData.pTitle}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item size={5}>
                  <TextField
                    helperText="Enter the Author if applicable"
                    label="Author"
                    variant="standard"
                    name="pAuthor"
                    value={formData.pAuthor}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ marginTop: 2 }}>
                {/* Second Row - Type, Publisher, Category */}
                <Grid item size={4}>
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
                <Grid item size={4}>
                  <TextField
                    helperText="Enter the Publisher"
                    label="Publisher"
                    variant="standard"
                    name="pPublisher"
                    value={formData.pPublisher}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item size={2.5}>
                  <TextField
                    helperText="Enter the Category"
                    label="Category"
                    variant="standard"
                    name="pCategory"
                    value={formData.pCategory}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ marginTop: 2 }}>
                {/* Third Row - Format, URL, Frequency */}
               <Grid item size='grow'>
                  <TextField
                    helperText="Enter the URL if applicable"
                    label="URL"
                    variant="standard"
                    name="pUrl"
                    value={formData.pUrl}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid> 
                <Grid item size={4}>
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
                
              </Grid>
              <Grid container spacing={2} sx={{ marginTop: 2 }}>
                <Grid item size={4}>
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
                <Grid item size={3}>
                  <TextField
                    label="Issue Volume"
                    variant="standard"
                    name="pIssueVolume"
                    value={formData.pIssueVolume}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item size={3}>
                  <TextField
                    label="Issue Number"
                    variant="standard"
                    name="pIssueNumber"
                    value={formData.pIssueNumber}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
              
              <Grid container spacing={2} sx={{ marginTop: 2 }}>
              <Grid size={4}>
                  <TextField
                    label="Language"
                    variant="standard"
                    name="pLanguage"
                    value={formData.pLanguage}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item size={4}>
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
                </Grid>
                <Grid item sx={{ marginTop: 2 }}>
                  <TextField
                    label="Description"
                    variant="standard"
                    name="pDescription"
                    value={formData.pDescription}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    fullWidth
                  />
                  </Grid>
                  <Grid item sx={{ marginTop: 2 }}>
                  <TextField
                    label="Notes"
                    variant="standard"
                    name="pNotes"
                    value={formData.pNotes}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    fullWidth
                  />
                  </Grid>
                  
             
            </Paper>
          </Container>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">{periodical ? 'Save Changes' : 'Add Periodical'}</Button>
        </DialogActions>
        {message && (
          <Typography variant="body2" color={messageType === 'success' ? 'green' : 'red'} sx={{ mt: 2, textAlign: 'center' }}>
            {message}
          </Typography>
        )}
      </Dialog>
    </ThemeProvider>
  );
}

export default PeriodicalEntry;
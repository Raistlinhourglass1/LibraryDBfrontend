import React, { useState } from 'react';
import { MenuItem, TextField, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, ToggleButtonGroup, ToggleButton, Typography, Button, Paper, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import EBookEntry from './EBookEntry'; // Assuming EBookEntry component for eBooks

const EBookCatalog = ({ catalogData, fetchData }) => {
  console.log('Catalog Data: ', catalogData);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedEBook, setSelectedEBook] = useState(null); // Used for editing an existing eBook
  const [searchInput, setSearchInput] = useState('');
  const [searchBy, setSearchBy] = useState('title'); // Default to 'Title'
  
  // Function to open the add dialog
  const handleOpenAddDialog = () => {
    setSelectedEBook(null); // Clear selected eBook for adding new eBook
    setOpenAddDialog(true);
  };

  // Function to open the edit dialog with a selected eBook
  const handleOpenEditDialog = (eBook) => {
    setSelectedEBook(eBook);
    setOpenAddDialog(true);
  };

  // Function to close the dialog
  const handleCloseDialog = () => {
    setOpenAddDialog(false);
    setSelectedEBook(null); // Clear selected eBook when dialog is closed
  };

  const ebooks = catalogData
    .filter((item) => item.source === 'ebook') // Filter for eBooks
    .sort((a, b) => {
      const dateA = new Date(a.date_added);
      const dateB = new Date(b.date_added);
      return dateB - dateA; // Sort descending
    });

  // Deleting eBook
  const handleDelete = async (eBookId) => {
    if (!window.confirm('Are you sure you want to delete this eBook?')) return;

    try {
      const response = await fetch('https://librarydbbackend.onrender.com/soft-delete-ebook', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ book_id: eBookId }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        fetchData(); // Refresh the eBook list
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error deleting eBook:', error);
      alert('Failed to delete the eBook. Please try again.');
    }
  };

  // Restoring eBook
  const handleRestore = async (eBookId) => {
    try {
      const response = await fetch('https://librarydbbackend.onrender.com/restore-ebook', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ book_id: eBookId }),
      });
      const data = await response.json();
      console.log('Restore Response:', data);

      if (response.ok) {
        alert('eBook restored successfully');
        fetchData(); // Refresh the eBook list after restore
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error restoring eBook:', error);
    }
  };

  // Toggle deleted eBook visibility
  const [viewOption, setViewOption] = useState('showNormal'); // Default to show normal eBooks only

  const filteredEbooks = ebooks
  .filter((ebook) => {
    if (viewOption === 'showNormal') return !ebook.deleted;
    if (viewOption === 'showDeleted') return true;
    if (viewOption === 'showOnlyDeleted') return ebook.deleted;
    return true;
  })
  .filter((ebook) => {
    const searchLower = searchInput.toLowerCase();
    if (searchBy === 'title') return ebook.ebook_title.toLowerCase().includes(searchLower);
    if (searchBy === 'isbn') return ebook.ebook_isbn.toLowerCase().includes(searchLower);
    if (searchBy === 'author') return ebook.ebook_author.toLowerCase().includes(searchLower);
    return false;
  });

  const handleViewChange = (event, newViewOption) => {
    if (newViewOption) {
      setViewOption(newViewOption);
    }
  };

  const renderEBookItem = (item) => {
    const formattedDate = item.date_added ? new Date(item.date_added).toLocaleDateString('en-US') : 'No date available';

    return (
      <Grid item size={2} key={item.ebook_id}>
        <Card sx={{
          minHeight: '300px',
          opacity: item.deleted ? 0.5 : 1, // Grey out if deleted
          backgroundColor: item.deleted ? '#f0f0f0' : 'white',
        }}>
          <CardContent>
            <Typography variant="h6" component="div" gutterBottom>
              {item.ebook_title}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>ISBN:</strong> {item.ebook_isbn}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Author:</strong> {item.ebook_author}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Publisher:</strong> {item.ebook_publisher}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Category:</strong> {item.ebook_category || 'N/A'}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Year of Copyright:</strong> {item.ebook_year || 'N/A'}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Resource Type:</strong> {item.resource_type || 'N/A'}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Language:</strong> {item.ebook_language || 'N/A'}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Summary:</strong> {item.ebook_summary || 'No summary available.'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>URL:</strong> {item.url || 'N/A'}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Date Added:</strong> {formattedDate}
            </Typography>

            {/* Buttons */}
            <Box mt={2}>
              {!item.deleted && (
                <Button onClick={() => handleOpenEditDialog(item)} color="primary">
                  Edit
                </Button>
              )}

              {!item.deleted ? (
                // Show the Delete button when the item is not deleted
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(item.ebook_id)} // Delete function
                >
                  Delete
                </Button>
              ) : (
                // Show the Restore button when the item is deleted
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleRestore(item.ebook_id)} // Restore function
                >
                  Restore
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  return (
    <Paper sx={{ boxShadow: 3, padding: 2, backgroundColor: '#ffffff' }}>
      <Typography variant="h4" component="h1" gutterBottom>
            eBook Catalog
          </Typography>

          <Button variant="contained" color="primary" onClick={handleOpenAddDialog} sx={{ marginBottom: 2 }}>
            Add New eBook
          </Button>

    <Grid container spacing={2} sx={{ marginBottom: 3}}>
      {/* Search Query Input */}
      <Grid item xs={4}>
        <TextField
          label="Search"
          variant="outlined"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          fullWidth
          sx={{ marginRight: 2 }}
        />
      </Grid>

      {/* Search By Dropdown */}
      <Grid item>
        <TextField
          select
          label="Search By"
          value={searchBy}
          onChange={(e) => setSearchBy(e.target.value)}
          variant="outlined"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="title">Title</MenuItem>
          <MenuItem value="isbn">ISBN</MenuItem>
          <MenuItem value="author">Author</MenuItem>
        </TextField>
      </Grid>
    
      <ToggleButtonGroup
        value={viewOption}
        exclusive
        onChange={handleViewChange}
        aria-label="View option"
        sx={{ marginBottom: 3 }}
      >
        <ToggleButton value="showNormal" aria-label="Hide Deleted eBooks">
        Default
        </ToggleButton>
        <ToggleButton value="showDeleted" aria-label="Show Deleted eBooks">
        All
        </ToggleButton>
        <ToggleButton value="showOnlyDeleted" aria-label="Show Only Deleted eBooks">
        Deleted Only
        </ToggleButton>
      </ToggleButtonGroup>
      </Grid>

      {ebooks.length > 0 ? (
        <Grid container spacing={3}>
          {filteredEbooks.map(renderEBookItem)} {/* Render each eBook item */}
        </Grid>
      ) : (
        <Typography variant="h6" color="textSecondary">No eBooks found.</Typography>
      )}

      {/* Dialog for adding/editing an eBook */}
      <Dialog
        open={openAddDialog}
        onClose={handleCloseDialog}
        maxWidth="md" // Predefined sizes: 'sm', 'md', 'lg', 'xl'
        fullWidth
        sx={{
          '& .MuiDialogContent-root': {
            padding: '5px', // Optional: You can add padding to the content
          },
          '& .MuiDialog-paper': {
            width: '80%', // Custom width percentage
            maxWidth: '800px', // Max width of the dialog box
          }
        }}
      >
        <DialogTitle>{selectedEBook ? 'Edit eBook' : 'Add New eBook'}</DialogTitle>
        <DialogContent>
          <EBookEntry ebook={selectedEBook} onClose={handleCloseDialog} fetchData={fetchData} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default EBookCatalog;
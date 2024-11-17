import React, { useState } from 'react';
import { Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, ToggleButtonGroup, ToggleButton, Typography, Button, Paper, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import EBookEntry from './EBookEntry'; // Assuming EBookEntry component for eBooks

const EBookCatalog = ({ catalogData, fetchData }) => {
  console.log('Catalog Data: ', catalogData);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedEBook, setSelectedEBook] = useState(null); // Used for editing an existing eBook

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

    {/*
  // Deleting eBook
  const handleDelete = async (eBookId) => {
    if (!window.confirm('Are you sure you want to delete this eBook?')) return;

    try {
      const response = await fetch('http://localhost:5000/soft-delete-ebook', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ebook_id: eBookId }),
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
      const response = await fetch('http://localhost:5000/restore-ebook', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ebook_id: eBookId }),
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
 */}
  // Toggle deleted eBook visibility
  const [viewOption, setViewOption] = useState('showNormal'); // Default to show normal eBooks only

  const filteredEbooks = ebooks.filter((ebook) => {
    if (viewOption === 'showNormal') {
      return !ebook.deleted; // Show only non-deleted eBooks
    } else if (viewOption === 'showDeleted') {
      return true; // Show all eBooks, including deleted
    } else if (viewOption === 'showOnlyDeleted') {
      return ebook.deleted; // Show only deleted eBooks
    }
    return true;
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
              {item.title}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>ISBN:</strong> {item.isbn}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Author:</strong> {item.author}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Publisher:</strong> {item.publisher}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Category:</strong> {item.category || 'N/A'}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Year of Copyright:</strong> {item.year_copyright || 'N/A'}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Format:</strong> {item.format || 'N/A'}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Language:</strong> {item.language || 'N/A'}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Summary:</strong> {item.summary || 'No summary available.'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Status:</strong> {item.status || 'N/A'}
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
    <Paper sx={{ padding: 2, backgroundColor: '#f4f4f4' }}>
      <ToggleButtonGroup
        value={viewOption}
        exclusive
        onChange={handleViewChange}
        aria-label="View option"
        sx={{ marginBottom: 3 }}
      >
        <ToggleButton value="showNormal" aria-label="Hide Deleted eBooks">
          Hide Deleted eBooks
        </ToggleButton>
        <ToggleButton value="showDeleted" aria-label="Show Deleted eBooks">
          Show All eBooks
        </ToggleButton>
        <ToggleButton value="showOnlyDeleted" aria-label="Show Only Deleted eBooks">
          Show Deleted eBooks Only
        </ToggleButton>
      </ToggleButtonGroup>

      <Typography variant="h4" component="h1" gutterBottom>
        eBook Catalog
      </Typography>

      <Button variant="contained" color="primary" onClick={handleOpenAddDialog} sx={{ marginBottom: 2 }}>
        Add New eBook
      </Button>

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
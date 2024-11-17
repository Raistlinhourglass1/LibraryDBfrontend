import React, { useState } from 'react';
import { Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, ToggleButtonGroup, ToggleButton, Typography, Button, Paper, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import AudiobookEntry from './AudioBookEntry';

const AudioBookCatalog = ({ catalogData, fetchData }) => {
  console.log('Catalog Data: ', catalogData);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedAudiobook, setSelectedAudiobook] = useState(null); // Used for editing an existing audiobook

  // Function to open the add dialog
  const handleOpenAddDialog = () => {
    setSelectedAudiobook(null); // Clear selected audiobook for adding new audiobook
    setOpenAddDialog(true);
  };

  // Function to open the edit dialog with a selected audiobook
  const handleOpenEditDialog = (audiobook) => {
    setSelectedAudiobook(audiobook);
    setOpenAddDialog(true);
  };

  // Function to close the dialog
  const handleCloseDialog = () => {
    setOpenAddDialog(false);
    setSelectedAudiobook(null); // Clear selected audiobook when dialog is closed
  };

  const audiobooks = catalogData
    .filter((item) => item.source === 'audiobook')
    .sort((a, b) => {
      const dateA = new Date(a.date_added);
      const dateB = new Date(b.date_added);
      return dateB - dateA; // Sort descending
    });


  // Deleting Audiobook
  const handleDelete = async (audiobookId) => {/*
    if (!window.confirm('Are you sure you want to delete this audiobook?')) return;
    
    try {
      const response = await fetch('http://localhost:5000/soft-delete-audiobook', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ audiobook_id: audiobookId }),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        fetchData(); // Refresh the audiobook list
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error deleting audiobook:', error);
      alert('Failed to delete the audiobook. Please try again.');
    }
  */};

  // Restoring Audiobook
  const handleRestore = async (audiobookId) => {/*
    try {
      const response = await fetch('http://localhost:5000/restore-audiobook', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ audiobook_id: audiobookId }),
      });
      const data = await response.json();
      console.log('Restore Response:', data);

      if (response.ok) {
        alert('Audiobook restored successfully');
        fetchData(); // Refresh the audiobook list after restore
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error restoring audiobook:', error);
    }
    */}; 

  // Toggle for deleted audiobooks visibility
  const [viewOption, setViewOption] = useState('showNormal'); // Default to show normal audiobooks only

  const filteredAudiobooks = audiobooks.filter((audiobook) => {
    if (viewOption === 'showNormal') {
      return !audiobook.deleted; // Show only non-deleted audiobooks
    } else if (viewOption === 'showDeleted') {
      return true; // Show all audiobooks, including deleted
    } else if (viewOption === 'showOnlyDeleted') {
      return audiobook.deleted; // Show only deleted audiobooks
    }
    return true;
  });

  const handleViewChange = (event, newViewOption) => {
    if (newViewOption) {
      setViewOption(newViewOption);
    }
  };

  const renderAudiobookItem = (item) => {
    const formattedDate = item.date_added ? new Date(item.date_added).toLocaleDateString('en-US') : 'No date available';
    
    return (
      <Grid item size={2} key={item.audiobook_id}>
        <Card sx={{ minHeight: '300px', 
            opacity: item.deleted ? 0.5 : 1, // Grey out if deleted
            backgroundColor: item.deleted ? '#f0f0f0' : 'white' }}>
          <CardContent>
            <Typography variant="h6" component="div" gutterBottom>
              {item.audiobook_title}
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
              <strong>Duration:</strong> {item.duration || 'N/A'}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Language:</strong> {item.language || 'N/A'}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Summary:</strong> {item.summary || 'No summary available.'}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Notes:</strong> {item.notes || 'No additional notes.'}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
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
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(item.audiobook_id)} // Delete function should be called
                >
                  Delete
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleRestore(item.audiobook_id)} // Call restore function
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
        <ToggleButton value="showNormal" aria-label="Hide Deleted Audiobooks">
          Hide Deleted Audiobooks
        </ToggleButton>
        <ToggleButton value="showDeleted" aria-label="Show Deleted Audiobooks">
          Show All Audiobooks
        </ToggleButton>
        <ToggleButton value="showOnlyDeleted" aria-label="Show Only Deleted Audiobooks">
          Show Deleted Audiobooks Only
        </ToggleButton>
      </ToggleButtonGroup>
      <Typography variant="h4" component="h1" gutterBottom>
        Audiobook Catalog
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpenAddDialog} sx={{ marginBottom: 2 }}>
        Add New Audiobook
      </Button>

      {audiobooks.length > 0 ? (
        <Grid container spacing={3}>
          {filteredAudiobooks.map(renderAudiobookItem)} {/* Render each audiobook item */}
        </Grid>
      ) : (
        <Typography variant="h6" color="textSecondary">No audiobooks found.</Typography>
      )}

      {/* Dialog for adding/editing an audiobook */}
      <Dialog 
        open={openAddDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"  
        fullWidth       
        sx={{ 
          '& .MuiDialogContent-root': { padding: '5px' }, 
          '& .MuiDialog-paper': { width: '80%', maxWidth: '800px' }
        }}>
        <DialogTitle>{selectedAudiobook ? 'Edit Audiobook' : 'Add New Audiobook'}</DialogTitle>
        <DialogContent>
          <AudiobookEntry audiobook={selectedAudiobook} onClose={handleCloseDialog} fetchData={fetchData} />
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

export default AudioBookCatalog;
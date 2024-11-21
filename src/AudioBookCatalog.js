import React, { useState } from 'react';
import { TextField, MenuItem, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, ToggleButtonGroup, ToggleButton, Typography, Button, Paper, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import AudiobookEntry from './AudioBookEntry';

const AudioBookCatalog = ({ catalogData, fetchData }) => {
  console.log('Catalog Data: ', catalogData);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedAudiobook, setSelectedAudiobook] = useState(null); // Used for editing an existing audiobook
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBy, setSearchBy] = useState('audio_title'); // Default search criterion

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
  const handleDelete = async (audiobookId) => {
    if (!window.confirm('Are you sure you want to delete this audiobook?')) return;
    
    try {
      const response = await fetch('https://librarydbbackend.onrender.com/soft-delete-audiobook', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ book_id: audiobookId }),
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
  };

  // Restoring Audiobook
  const handleRestore = async (audiobookId) => {
    try {
      const response = await fetch('https://librarydbbackend.onrender.com/restore-audiobook', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ book_id: audiobookId }),
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
  };

  // Toggle for deleted audiobooks visibility
  const [viewOption, setViewOption] = useState('showNormal'); // Default to show normal audiobooks only

  const filteredAudiobooks = audiobooks.filter((audiobook) => {
    const valueToSearch = audiobook[searchBy]?.toLowerCase() || '';
    return valueToSearch.includes(searchQuery.toLowerCase());
  }).filter((audiobook) => {
    if (viewOption === 'showNormal') return !audiobook.deleted;
    if (viewOption === 'showOnlyDeleted') return audiobook.deleted;
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
              {item.audio_title}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>ISBN:</strong> {item.audio_isbn}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Author:</strong> {item.audio_author}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Narrator:</strong> {item.audio_narrator}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Publisher:</strong> {item.audio_publisher}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Category:</strong> {item.audio_category}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Edition:</strong> {item.audio_edition || 'N/A'}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Duration:</strong> {item.duration || 'N/A'}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Language:</strong> {item.audio_language || 'N/A'}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Summary:</strong> {item.audio_summary || 'No summary available.'}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Notes:</strong> {item.audio_notes || 'No additional notes.'}
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
    <Paper sx={{ boxShadow: 3, padding: 2, backgroundColor: '#ffffff' }}> 
    
    <Typography variant="h4" component="h1" gutterBottom>
        Audiobook Catalog
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpenAddDialog} sx={{ marginBottom: 2 }}>
        Add New Audiobook
      </Button>

      
     
      <Grid container spacing={2} sx={{}}>  
      {/* Search Bar */}
        <Grid item xs={4}>
          <TextField
            label="Search"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
            <MenuItem value="audio_title">Title</MenuItem>
            <MenuItem value="audio_isbn">ISBN</MenuItem>
          </TextField>
        </Grid>

        <Grid item size="auto">
        <ToggleButtonGroup
          value={viewOption}
          exclusive
          onChange={handleViewChange}
          aria-label="View option"
          sx={{ marginBottom: 3 }}
        >
          <ToggleButton value="showNormal" aria-label="Hide Deleted Audiobooks">
            Default
          </ToggleButton>
          <ToggleButton value="showDeleted" aria-label="Show Deleted Audiobooks">
            All
          </ToggleButton>
          <ToggleButton value="showOnlyDeleted" aria-label="Show Only Deleted Audiobooks">
            Deleted Only
          </ToggleButton>
        </ToggleButtonGroup>
        </Grid>
      </Grid>

      {filteredAudiobooks.length > 0 ? (
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
import React, { useState } from 'react';
import {Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, TextField, ToggleButtonGroup, ToggleButton, Typography, Button, Paper, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import BookEntry from './BookEntry';


const BookCatalog = ({ catalogData, fetchData }) => {
console.log('Catalog Data: ', catalogData);
const [openAddDialog, setOpenAddDialog] = useState(false);
const [selectedBook, setSelectedBook] = useState(null); // Used for editing an existing book
const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
const [searchInput, setSearchInput] = useState(''); // Search input state
const [viewOption, setViewOption] = useState('showNormal');

  // Function to open the add dialog
  const handleOpenAddDialog = () => {
    setSelectedBook(null); // Clear selected book for adding new book
    setOpenAddDialog(true);
  };

  // Function to open the edit dialog with a selected book
  const handleOpenEditDialog = (book) => {
    
    setSelectedBook(book);
    setOpenAddDialog(true);
  };

    // Function to open the details dialog
    const handleOpenDetailsDialog = (book) => {
      setSelectedBook(book);
      setOpenDetailsDialog(true);
    };

  // Function to close the dialog
  const handleCloseDialog = () => {

    setOpenAddDialog(false);
    setOpenDetailsDialog(false);
    setSelectedBook(null); // Clear selected book when dialog is closed
  };

const books = catalogData
  .filter((item) => item.source === 'book')
  .sort((a, b) => {
    const dateA = new Date(a.date_added);
    const dateB = new Date(b.date_added);
    return dateB - dateA; // Sort descending
  });

  ////DELETING BOOK
  const handleDelete = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
  
    try {
      const response = await fetch('https://librarydbbackend.onrender.com/soft-delete-book', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ book_id: bookId }),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        fetchData(); // Refresh the book list
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Failed to delete the book. Please try again.');
    }
  };
///DELETING BOOK END

////RESTORE BOOK
const handleRestore = async (bookId) => {
  try {
    const response = await fetch('https://librarydbbackend.onrender.com/restore-book', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ book_id: bookId }),
    });
    const data = await response.json();
    console.log('Restore Response:', data);

    if (response.ok) {
      alert('Book restored successfully');
      fetchData(); // Refresh the book list after restore
    } else {
      const errorData = await response.json();
      alert(`Error: ${errorData.message}`);
    }
  } catch (error) {
    console.error('Error restoring book:', error);
  }
};

///RESTORE BOOK END

/////TOGGLE DELETED BOOKS VISIBILITY

const filteredBooks = books
    .filter((book) => {
      if (viewOption === 'showNormal') return !book.deleted;
      if (viewOption === 'showDeleted') return true;
      if (viewOption === 'showOnlyDeleted') return book.deleted;
      return true;
    })
    .filter((book) => {
      const lowerSearch = searchInput.toLowerCase();
      return (
        book.book_title.toLowerCase().includes(lowerSearch) ||
        book.isbn.toLowerCase().includes(lowerSearch)
      );
    });


    const handleViewChange = (event, newViewOption) => {
      if (newViewOption) {
        setViewOption(newViewOption);
      }
    };
    ///////////DELETED BOOKS END

  const renderBookItem = (item) => {
    const formattedDate = item.date_added ? new Date(item.date_added).toLocaleDateString('en-US') : 'No date available';
    
    return (
      <>
      

      <Grid item size={2} key={item.book_id}>
        <Card sx={{ minHeight: '300px', 
            opacity: item.deleted ? 0.5 : 1, // Grey out if deleted
            backgroundColor: item.deleted ? '#f0f0f0' : 'white', }}>
          <CardContent>
            <Typography variant="h6" component="div" gutterBottom>
              {item.book_title}
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
              <strong>Category:</strong> {item.book_category || 'N/A'}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Year of Copyright:</strong> {item.year_copyright || 'N/A'}
            </Typography>
            {/*
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Edition:</strong> {item.edition || 'N/A'}
            </Typography>*/}
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Media Type:</strong> {item.media_type || 'N/A'}
            </Typography>
            {/*
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Language:</strong> {item.language || 'N/A'}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Page Count:</strong> {item.num_pages || 'N/A'}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Summary:</strong> {item.book_summary || 'No summary available.'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Notes:</strong> {item.book_notes || 'No additional notes.'}
            </Typography>*/}
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Status:</strong> {item.book_status || 'N/A'}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Date Added:</strong> {formattedDate}
            </Typography>


            {/*buttons*/}
            <Button 
            onClick={() => handleOpenDetailsDialog(item)} 
            size="small" 
            color="primary"
          >
            Show Details
          </Button>

            <Box mt={2}>
            {!item.deleted && (
            <Button onClick={() => handleOpenEditDialog(item)} color="primary">
            Edit
          </Button>)}

            {!item.deleted ? (
            // Show the Delete button when the item is not deleted
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleDelete(item.book_id)} // Delete function should be called
            >
              Delete
            </Button>
          ) : (
            // Show the Restore button when the item is deleted
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleRestore(item.book_id)} // Call restore function
            >
              Restore
            </Button>
          )}
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      </>
    );  
  };

  return (
    <Paper sx={{ padding: 2, backgroundColor: '#f4f4f4' }}>
<Grid container spacing={2}>
  <Grid item size={8}>
      <ToggleButtonGroup
        value={viewOption}
        exclusive
        onChange={handleViewChange}
        aria-label="View option"
        sx={{ marginBottom: 3 }}
      >
        <ToggleButton value="showNormal" aria-label="Hide Deleted Books">
          Hide Deleted Books
        </ToggleButton>
        <ToggleButton value="showDeleted" aria-label="Show Deleted Books">
          Show All Books
        </ToggleButton>
        <ToggleButton value="showOnlyDeleted" aria-label="Show Only Deleted Books">
          Show Deleted Books Only
        </ToggleButton>
      </ToggleButtonGroup>
</Grid>
<Grid item size={4}>
      <TextField
        label="Search by Title or ISBN"
        variant="outlined"
        fullWidth
        sx={{ marginBottom: 3 }}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      </Grid>
</Grid>


      <Typography variant="h4" component="h1" gutterBottom>
        Book Catalog
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpenAddDialog} sx={{ marginBottom: 2 }}>
        Add New Book
      </Button>

      {books.length > 0 ? (
        <Grid container spacing={3}>
          {filteredBooks.map(renderBookItem)} {/* Render each book item */}
        </Grid>
      ) : (
        <Typography variant="h6" color="textSecondary">No books found.</Typography>
      )}

      {/* Dialog for displaying book details */}
      <Dialog 
        open={openDetailsDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Book Details</DialogTitle>
        <DialogContent>
          <Typography variant="h6">{selectedBook?.book_title}</Typography>
          <Typography variant="body2"><strong>ISBN:</strong> {selectedBook?.isbn}</Typography>
          <Typography variant="body2"><strong>Author:</strong> {selectedBook?.author}</Typography>
          <Typography variant="body2"><strong>Publisher:</strong> {selectedBook?.publisher}</Typography>
          <Typography variant="body2"><strong>Category:</strong> {selectedBook?.book_category || 'N/A'}</Typography>
          <Typography variant="body2"><strong>Status:</strong> {selectedBook?.book_status || 'N/A'}</Typography>
          <Typography variant="body2"><strong>Year of Copyright:</strong> {selectedBook?.year_copyright || 'N/A'}</Typography>
          <Typography variant="body2"><strong>Edition:</strong> {selectedBook?.edition || 'N/A'}</Typography>
          <Typography variant="body2"><strong>Media Type:</strong> {selectedBook?.media_type || 'N/A'}</Typography>
          <Typography variant="body2"><strong>Language:</strong> {selectedBook?.language  || 'N/A'}</Typography>
          <Typography variant="body2"><strong>Page Count:</strong> {selectedBook?.num_pages || 'N/A'}</Typography>
          <Typography variant="body2"><strong>Summary:</strong> {selectedBook?.book_summary || 'No summary available.'}</Typography>
          <Typography variant="body2"><strong>Status:</strong> {selectedBook?.book_status || 'N/A'}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>


       {/* Dialog for adding/editing a book */}
       <Dialog 
          open={openAddDialog} 
          onClose={handleCloseDialog}
          maxWidth="md"  // You can use 'sm', 'md', 'lg', or 'xl' for predefined sizes
          fullWidth       // Ensures the dialog takes the full width of the container
          sx={{ 
            '& .MuiDialogContent-root': {
              padding: '20px', // Optional: You can add padding to the content
            },
            '& .MuiDialog-paper': {
              width: '80%', // You can set this to any percentage or fixed pixel value
              maxWidth: '800px', // Max width of the dialog box
            }
        }}>
          
        <DialogTitle>{selectedBook ? 'Edit Book' : 'Add New Book'}</DialogTitle>
        <DialogContent>
          <BookEntry book={selectedBook} onClose={handleCloseDialog} fetchData={fetchData} />
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

export default BookCatalog;
import React, { useState } from 'react';
import {Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, ToggleButtonGroup, ToggleButton, Typography, Button, Paper, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import BookEntry from './BookEntry';


const BookCatalog = ({ catalogData, fetchData }) => {
console.log('Catalog Data: ', catalogData);
const [openAddDialog, setOpenAddDialog] = useState(false);
const [selectedBook, setSelectedBook] = useState(null); // Used for editing an existing book

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

  // Function to close the dialog
  const handleCloseDialog = () => {

    setOpenAddDialog(false);
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

const [viewOption, setViewOption] = useState('showNormal'); // Default to show normal books only

const filteredBooks = books.filter((book) => {
  if (viewOption === 'showNormal') {
    return !book.deleted; // Show only non-deleted books
  } else if (viewOption === 'showDeleted') {
    return true; // Show all books, including deleted
  } else if (viewOption === 'showOnlyDeleted') {
    return book.deleted; // Show only deleted books
  }
  return true;
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
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Edition:</strong> {item.edition || 'N/A'}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Media Type:</strong> {item.media_type || 'N/A'}
            </Typography>
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
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Status:</strong> {item.book_status || 'N/A'}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Date Added:</strong> {formattedDate}
            </Typography>


            {/*buttons*/}
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



       {/* Dialog for adding/editing a book */}
       <Dialog 
          open={openAddDialog} 
          onClose={handleCloseDialog}
          maxWidth="md"  // You can use 'sm', 'md', 'lg', or 'xl' for predefined sizes
          fullWidth       // Ensures the dialog takes the full width of the container
          sx={{ 
            '& .MuiDialogContent-root': {
              padding: '24px', // Optional: You can add padding to the content
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
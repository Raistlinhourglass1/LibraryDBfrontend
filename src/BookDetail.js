import React, {useEffect, useState} from 'react'
import { Alert, Box, Button, Card, CardContent, CardMedia, CircularProgress, Container, Snackbar, Stack, Paper, Rating, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import bookCover from './external/book-cover.png';
import { useParams, Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function BookDetail() {
  
  const { book_id } = useParams();
  const [book, setBook] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [isInUserList, setIsInUserList] = useState(false); // State to track if the book is in the user's list 
  

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const term = queryParams.get('term'); // Extracts the search term
  console.log('Search term:', term);



  const handleBackToSearch = () => {
    console.log('Search term before navigation:', term);
    const searchTerm = term ? encodeURIComponent(term) : '';
    navigate(`/search?term=${encodeURIComponent(searchTerm)}`);
  };

  const handleReserve = (book) => {
    navigate('/_bookReservation', { state: { book } });
  };

  const handleCheckout = (book) => {
    console.log('Sending book:', book);
    navigate('/checkout', { state: { book } });
};


  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the book data
        const bookResponse = await fetch(`https://librarydbbackend.onrender.com/books/${book_id}`);
        if (!bookResponse.ok) throw new Error('Book not found');
        const bookData = await bookResponse.json();
        setBook(bookData);
        console.log('the book: ', bookData);
  
        // Fetch reviews only if the book has an ISBN
        if (bookData.isbn) {
          console.log('ISBN found:', bookData.isbn);
          const reviewsResponse = await fetch(`https://librarydbbackend.onrender.com/reviews/${bookData.isbn}`);
          if (!reviewsResponse.ok) throw new Error('Error fetching reviews');
  
          const reviewsData = await reviewsResponse.json();
          setReviews(reviewsData);
          console.log('the reviews: ', reviewsData);
        }
  
        // Check if the book is in the user's list
        const checkIfInUserList = async () => {
          const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
          if (!bookData?.isbn) return; // Ensure ISBN is present before making the request
        
          try {
            console.log('ISBN sending:', bookData.isbn);
        
            const response = await fetch(`https://librarydbbackend.onrender.com/user-list/${bookData.isbn}`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json', // If needed by your server
              },
            });
        
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
        
            const responseData = await response.json();
            console.log('got back:', responseData);
        
            // Check if responseData is an array and has elements
            const bookFavorited = Array.isArray(responseData) && responseData.length > 0;
            setIsInUserList(bookFavorited);
        
            console.log('user list:', bookFavorited);
        
          } catch (error) {
            console.error('Error checking user list:', error);
          }
        };
  
        // Call the function to check if the book is in the user's list
        checkIfInUserList();
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setBook(null); // Handle book fetch error
        setReviews([]); // Handle reviews fetch error
      }
    };
  
    fetchData();
  }, [book_id]); 


    const handleUserList = async () => {
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
    if (!token) {
      setError('You must be logged in to add books to your list');
      setSnackbarMessage('You must be logged in to add books to your list');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }
    if (isInUserList) {
      // Remove from list
      try {
        const response = await fetch('https://librarydbbackend.onrender.com/user-list', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            book_id: book.book_id,
            isbn: book.isbn,
          }),
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        setIsInUserList(false); // Update the UI after removing the book
    
        // Show success snackbar
        setSnackbarMessage('Book removed from your list');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
    
      } catch (error) {
        console.error('Error removing book from user list:', error);
        // Show error snackbar if there was an issue
        setSnackbarMessage('Failed to remove book from list');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    } else {

      try {
        setIsAdding(true);
        const response = await axios.post('https://librarydbbackend.onrender.com/add-to-list', 
          { book_id: book.book_id,
            isbn: book.isbn
          }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsInUserList(true);
        console.log(response.data); 

        setSnackbarMessage('Book added to your list successfully!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
      } catch (error) {
        console.error('Error adding book to list:', error);
        setSnackbarMessage('Failed to add book to list');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      } 
      
      finally {
        setIsAdding(false);
      }
    }
  };

  /////REVIEWS END
  if (!book) return <p>Loading...</p>;
  
  return (
    <Container maxWidth="xl" direction = "row" sx={{ /*bgcolor: '#EDE4CF'*/}} >
      {/* Book Detail Layout */}
      <Grid container spacing={4} wrap='nowrap' sx={{ marginTop: 2, display: 'flex', alignItems: 'flex' }}>
        {/* Left Column: Book Cover */}
        <Grid item size={3} sx={{}}>
          <CardMedia
            component="img"
            sx={{ maxHeight: '500px', objectFit: 'cover', mb: 2 }}
            image={`https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`}
            alt={book.title}
            onError={(e) => (e.target.src = bookCover)}
          />
        </Grid>

        {/* Middle Column: Book Information */}
        <Grid item size={8} sx={{}}>
          <Typography variant="h3">{book.title}</Typography>

          <Box sx={{ my: 2 }}>
            <Typography gutterBottom sx={{ fontSize: 20 }}>
              <strong>ISBN:</strong> <span>{book.isbn}</span>
            </Typography>

            <Typography variant="subtitle1">
              <strong>Author:</strong> {book.author}
            </Typography>

            <Typography>
              <strong>Publisher:</strong> {book.publisher}
            </Typography>

            <Typography sx={{ wordWrap: 'break-word' }}>
              <strong>Summary:</strong> {book.book_summary}
            </Typography>

            <Typography>
              <strong>Category:</strong> {book.book_category}
            </Typography>

            <Typography>
              <strong>Copyright Year:</strong> {book.year_copyright}
            </Typography>

            <Typography>
              <strong>Edition:</strong> {book.edition}
            </Typography>

            <Typography>
              <strong>Number of Pages:</strong> {book.num_pages}
            </Typography>

            <Typography>
              <strong>Media Type:</strong> {book.media_type}
            </Typography>

            <Typography>
              <strong>Language:</strong> {book.language}
            </Typography>

            <Typography>
              <strong>Available:</strong> {book.available_count}
            </Typography>

            <Typography>
              <strong>Number of Copies:</strong> {book.duplicate_count}
            </Typography>
          </Box>
        </Grid>

        {/* Right Column: Buttons */}
        <Grid item size={3} sx={{ }}>
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-end', gap: 2 }}>
            {/* Conditionally render Check Out or Reserve button */}
            {book.available_count > 0 ? (
              <Button
                  onClick={() => handleCheckout(book)}
                  variant="contained"
                  color="primary"
              >
                  Check Out
              </Button>
              ) : (
              <Button
                  onClick={() => handleReserve(book)}
                  variant="contained"
                  color="secondary"
              >
                  Reserve
              </Button>
              )}
              {/*add/remove from list button */}
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleUserList}
                disabled={isAdding}
                startIcon={isAdding && <CircularProgress size={20} />}
              >
                {isAdding ? 'Adding...' : (isInUserList ? 'Remove from List' : 'Add to List')}
              </Button>

              <Snackbar 
                open={openSnackbar} 
                autoHideDuration={6000} 
                onClose={() => setOpenSnackbar(false)}
              >
                <Alert 
                  onClose={() => setOpenSnackbar(false)} 
                  severity={snackbarSeverity} 
                  sx={{ width: '100%' }}
                >
                  {snackbarMessage}
                </Alert>
              </Snackbar>


              {/*back to search*/}
            <Button onClick={handleBackToSearch}>
            Back to Search
          </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Back to Search Button */}
      <Grid container spacing={2} sx={{ marginTop: 3 }}>
        {/* Reviews Section (Placeholder) */}
        <Box sx={{ padding: '20px' }}>
        <Typography variant="h5" sx={{ marginBottom: '20px', fontWeight: 'bold' }}>
          Reviews
        </Typography>
        {reviews.length > 0 ? (
          <Grid container spacing={3} sx={{ flexWrap: 'wrap' }}>
            {reviews.map((review) => (
              <Grid item size={12} key={review.date_submitted}>
                <Paper
                  sx={{
                    padding: '16px',
                    backgroundColor: '#fafafa',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    height: '100%', // Ensure the paper takes full height of the container
                  }}
                >
                  {/* User Information Section */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: '#ccc',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontWeight: 'bold',
                        color: '#fff',
                      }}
                    >
                      {review.first_name[0]} {/* Display the first letter of the user's first name as the avatar */}
                    </Box>
                    <Typography variant="body1" fontWeight="bold">{review.first_name}</Typography>
                  </Box>

                  {/* Rating Section */}
                  <Rating name="read-only" value={review.rating/2} readOnly precision={0.5} sx={{ alignSelf: 'flex-start' }} />

                  {/* Review Date */}
                  <Typography variant="body2" color="textSecondary" sx={{ marginTop: '8px' }}>
                    {new Date(review.date_submitted).toLocaleDateString()}
                  </Typography>

                  {/* Review Description */}
                  <Typography variant="body2" sx={{ marginTop: '8px', fontStyle: 'italic' }}>
                    "{review.description}"
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ marginTop: '20px' }}>
            No reviews yet.
          </Typography>
        )}
        </Box>
      </Grid>
    </Container>
);
}

export default BookDetail
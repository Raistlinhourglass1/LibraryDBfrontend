import React, { useState } from 'react'
import { Box, Button, Card, CardContent, CardActions, CardMedia, Container, Link, Paper, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import bookCover from './external/book-cover.png';
import { useNavigate, useLocation } from 'react-router-dom';
import BookSearchFilter from './BookSearchFilter';

function BookSearchResults({books = [], term}) {
    
    console.log('Data fetched:', books);
    console.log('Search term:', term);

    const location = useLocation(); //pull from navigate in BookSearch

    const navigate = useNavigate();
    const [book, setBook] = useState([]); //holds the book map
    const [filteredBooks, setFilteredBooks] = useState(books);

    const handleFilterBooks = (filteredResults) => {
        const filtered = filteredResults.filter(book => book.deleted === 0);
        setFilteredBooks(filtered);
      };

    const handleReserve = (book) => {
        console.log('Sending book:', book);
        navigate('/_bookReservation', { state: { book } });
    };

    const handleCheckout = (book) => {
        console.log('Sending book:', book);
        navigate('/checkout', { state: { book } });
    };

    const handleDetails = (bookId, term) => {
        navigate(`/books/${bookId}?term=${encodeURIComponent(term)}`);
      };

    const groupedBooks = {
        book: books.filter((book) => book.source === 'book'),
        audiobook: books.filter((book) => book.source === 'audiobook'),
        ebook: books.filter((book) => book.source === 'ebook'),
        periodical: books.filter((book) => book.source === 'periodical'),
    };

    const renderSection = (title, items) => (
        <>
            {items.length > 0 && (
                <Container maxWidth="lg" sx={{ marginBottom: '20px' }}>
                    <Typography variant="h5" sx={{ marginBottom: '10px' }}>{title}</Typography>
                    <Box sx={{ bgcolor: '#f2f2f2', padding: '10px', borderRadius: '8px' }}>
                        <Stack spacing={2}>
                            {items.map((book) => (
                                <Paper square elevation={3} key={book.isbn}>
                                    <Grid container
                                        sx={{
                                            width: '100%',
                                            height: 220,
                                            overflow: 'hidden',
                                            boxSizing: 'border-box',
                                            padding: '10px',
                                            display: 'flex',
                                            flexDirection: 'row',
                                        }}
                                    >
                                        <Grid item size={2} sx={{ width: 130, height: 200 }}>
                                        <CardMedia
                                            component="img"
                                            sx={{ width: 130, height: 200 }}
                                            image={`https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`}
                                            alt={book.title}
                                            onError={(e) => (e.target.src = bookCover)}
                                        />
                                         </Grid>

                                         <Grid item size="grow" sx={{ paddingLeft: 2, display: 'flex', flexDirection: 'column' }}>
                                            <CardContent sx={{ flex: '1 0 auto' }}>
                                                <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                                                    {book.media_type}
                                                </Typography>

                                                <Link href={`/books/${book.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                    {book.title}
                                                </Link>

                                                {book.author && (
                                                    <Typography variant="body2" color="text.secondary">
                                                        by {book.author}
                                                    </Typography>
                                                )}
                                                <Typography variant="body2" color="text.secondary">
                                                        Available: {book.available_count}
                                                    </Typography>


                                            </CardContent>
                                        </Grid>

                                        <Grid 
                                            item 
                                            size={2.5}
                                            offset={{ md: 'auto' }}
                                            sx={{ 
                                                display: 'flex', 
                                                flexDirection: 'column',                                             
                                                padding: 1 }}>
                                            <Stack direction="column" spacing={2}> {/* Set spacing between the buttons */}
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

                                                <Button size="small" onClick={() => handleDetails(book.id, term)}>
                                                    View Summary
                                                </Button>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            ))}
                        </Stack>
                    </Box>
                </Container>
            )}
        </>
    );

    return (
        <>
        <Grid container spacing={2} sx={{ marginTop: '1px' }}>
            {/* Filter Bar */}
            <Grid item size={2.5}>
                <Box sx={{ padding: '10px', bgcolor: '#f2f2f2', borderRadius: '8px' }}>
                    <Typography variant="h6">Filter Results</Typography>
                    <BookSearchFilter books={books} onFilter={handleFilterBooks} />
                </Box>
            </Grid>

            {/* Book Results Section */}
            <Grid item size={8}>
                {filteredBooks.length === 0 ? (
                    <Typography variant="h6" color="text.secondary">
                        No books found matching your search criteria.
                    </Typography>
                ) : (
                    <>
                        {renderSection('Books', groupedBooks.book)}
                        {renderSection('Ebooks', groupedBooks.ebook)}
                        {renderSection('Audiobooks', groupedBooks.audiobook)}
                        {renderSection('Periodicals', groupedBooks.periodical)}
                    </>
                )}
            </Grid>
        </Grid>
    </>
);
}

export default BookSearchResults
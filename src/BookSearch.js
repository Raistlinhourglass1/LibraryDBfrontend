import React, { useEffect, useState, useCallback } from 'react'
import { Breadcrumbs, Box, Button, Card, CardMedia, CardContent, Container, Grid2, Link, TextField, Typography, IconButton } from '@mui/material';
import BookSearchResults from './BookSearchResults';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate, useLocation } from 'react-router-dom';
import bgImage from './external//books1.jpg';

function BookSearch() {
    const location = useLocation();
    const navigate = useNavigate();

    const [term, setTerm] = useState('');
    const [books, setBooks] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // New state to track loading
    
    useEffect(() => {
      const params = new URLSearchParams(location.search);
      const searchTerm = params.get('term');
      setTerm(searchTerm || '')
      console.log('Search term:::', searchTerm);
      setTerm(searchTerm);
      if (searchTerm) {
        setHasSearched(true);
        handleSearch(searchTerm);
      }
    }, [location.search]);

    const fetchAllBooks = async () => {
      const response = await fetch('https://librarydbbackend.onrender.com/catalog');
      const data = await response.json();
      setBooks(data);
    };



    const handleSearch = async (term) => {
        //e.preventDefault();
        setIsLoading(true);
        navigate(`/search?term=${encodeURIComponent(term)}`, { replace: true });
        console.log('Search initiated with term:', term);
        setBooks([]); 
        try {
            const response = await fetch(`https://librarydbbackend.onrender.com/search?term=${encodeURIComponent(term)}`);
            console.log('Response received:', response);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Data fetched:', data);
            setBooks(Array.isArray(data) ? data : []); //check that its an array
            console.log('Books in BookSearch:', books);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
        setIsLoading(false);
      }

    const onSearchClick = (e) => {
      e.preventDefault();
      e.preventDefault();
        if (term.trim()) {
            handleSearch(term); // Initiate search
        }
    };
      
  return (
    <>
    {/*
    <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/">
            Home
        </Link>
        <Link
            underline="hover"
            color="inherit"
            href="./BookEntry"
        >
            Books
        </Link>
        <Typography sx={{ color: 'text.primary' }}>Search</Typography>
    </Breadcrumbs> */}


    <Box sx={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', padding: 8, marginBottom: 0, width: '100%'}}> 
    <Container maxWidth='lg'>
    <Box sx={{padding: 4, borderRadius: 2, bgcolor: 'background.paper'}}>
  
        <Typography variant="h4" sx={{ color: 'primary.main' }}>Browse Our Catalog</Typography>
        <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>Search for books, journals, newspapers, magazines and more</Typography>
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            component="form"
            sx={{ '& .MuiTextField-root': { m: 1, width: '50ch' } }}
            noValidate
            autoComplete="off"
            >
            <TextField
                id="standard-basic"
                label="Title, Author, ISBN, etc..."
                variant="standard"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
            />
            <IconButton type="submit" variant="contained" size="large" color='primary' onClick={onSearchClick}>
              <SearchIcon fontSize="inherit" />
            </IconButton>
            <Button variant="text" size="small" onClick={fetchAllBooks}>Show All Books</Button>
            {/* 
            <Button component={Link} href="/advanced-search" variant="text" size="small" >Advanced Search</Button>
            */}
        </Box>
    </Box> 
    </Container>
    </Box>

    <Container maxWidth="xl">
      {/* Display a message only after search attempt */}
      {hasSearched && !isLoading && books.length === 0 ? (
        <Typography variant="h6" color="text.secondary">
          No books found matching your search criteria.
        </Typography>
      ) : (
        books.length > 0 && (
          <Box sx={{ padding: 3, borderRadius: 2 }}>
            <BookSearchResults books={books} term={term} />
          </Box>
        )
      )}
    </Container>
    
    </>
  )
}

export default BookSearch
import React, { useState, useEffect } from 'react';
import { CssBaseline, ThemeProvider, AppBar, Toolbar, Typography, Button, IconButton, Box, Container, TextField, Link, Menu, MenuItem, Card, CardMedia, CardContent } from '@mui/material';
import { Skeleton } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import bgImage from './external/library_homepage.jpg';
import BookSearch from './BookSearch';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import axios from 'axios';
import ClaudeTheme from './ClaudeTheme';

const HomePage = () => {
  const navigate = useNavigate();
  const [staffChoiceBooks, setStaffChoiceBooks] = useState([]);
  const [latestEntries, setLatestEntries] = useState([]);
  const [term, setTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleSearch = () => {
    if (term.trim()) {
      // Navigate to the search page with the term as a URL parameter
      navigate(`/search?term=${encodeURIComponent(term)}`);
    }
  };

  const fetchStaffChoice = async () => {
    try {
      const response = await axios.get('https://librarydbbackend.onrender.com/staff-choice');
      console.log('Fetched data:', response.data);
      setStaffChoiceBooks(response.data);
      console.log('Fetched staff:', staffChoiceBooks);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch staff choice books.');
    }

  };

  const fetchLatestEntries = async () => {
    try {
      const response = await axios.get('https://librarydbbackend.onrender.com/latest-entries');
      console.log('Fetched data:', response.data);
      setLatestEntries(response.data);
      console.log('Fetched entry:', latestEntries);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch latest entry books.');
    }

  };

  const handleDetails = (bookId) => {
    navigate(`/books/${bookId}`);
  };


  // Fetch data for Staff's Choice and Latest Entries
  useEffect(() => {
    fetchStaffChoice();
      console.log(staffChoiceBooks)

      fetchLatestEntries();
      console.log(latestEntries)
  }, []);

  const handleSignOut = () => {
    navigate('/sign-in');
  };
  
  const [anchorEl, setAnchorEl] = useState(null);  // To control the dropdown menu

  // This is the handler for opening and closing the dropdown
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);  // This sets the anchor element for the Menu
  };

  const handleClose = () => {
    setAnchorEl(null);  // This closes the Menu
  };

  if (!staffChoiceBooks) {
    // Display skeleton loading placeholders while data is being fetched
    return (
        <Container>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 3 }}>
                <Typography variant="h4" gutterBottom>
                    <Skeleton width={200} />
                </Typography>
                <Card sx={{ maxWidth: 345 }}>
                    <Skeleton variant="rectangular" width="100%" height={400} />
                    <CardContent>
                        <Skeleton height={30} width="60%" />
                        <Skeleton height={20} width="40%" />
                        <Skeleton height={15} width="80%" />
                        <Skeleton height={15} width="70%" />
                        <Skeleton height={40} width="100%" />
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
}


  return (
    <ThemeProvider theme={ClaudeTheme}>
        <CssBaseline />
    <Box>
      {/* Navbar 
      <AppBar position="static" sx={{ height: '100px', justifyContent: 'flex-end', paddingBottom: '10px' }}> {/*
        <Toolbar sx={{ height: '100%', display: 'flex', alignItems: 'flex-end' }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/home')}>
            My Library
          </Typography>
          <Button color="inherit" onClick={() => navigate('/search')}>Browse</Button>
          <Button color="inherit" onClick={() => navigate('/reserve-room')}>Reserve a Room</Button>
          <Button color="inherit" onClick={() => navigate('/ProfilePage2')}>My Account</Button>
          
          <Button
        variant="standard"
        endIcon={<ArrowDropDownIcon />}
        onClick={handleClick}
      >
        Rent a Device
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>
          <Link to="/_laptopReservation" style={{ textDecoration: 'none', color: 'inherit' }}>
            Laptops
          </Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link to="/_calculatorReservation" style={{ textDecoration: 'none', color: 'inherit' }}>
            Calculators
          </Link>
        </MenuItem>
      </Menu>
          <Button color="inherit">Sign Out</Button>
        </Toolbar> 
      </AppBar>*/}

      {/* Hero Section */}
      <Box sx={{ position: 'relative', width: '100%', height: '400px', backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <Container sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', alignItems: 'center' }}>
          
          {/*SEARCH BOX HERE */}
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
                <IconButton type="submit" variant="contained" size="large" color='primary' onClick={(e) => { e.preventDefault(); handleSearch();}}>
                  <SearchIcon fontSize="inherit" />
                </IconButton>
            </Box>
          </Box> 
            <IconButton color="primary" sx={{ ml: 1 }}>
              <SearchIcon />
            </IconButton>
          </Container>
        </Box>

      {/* Book Rows */}
      <Container maxWidth='xl' sx={{ mt: 4, boxShadow: 3, padding: 2, borderRadius: 3}}>
        {/* Staff's Choice */}
        <Typography variant="h5" sx={{ mb: 2 }}>Staff's Choice</Typography>
        <Grid container spacing={3} justifyContent={'center'}>
          {staffChoiceBooks.map((book) => (
            <Grid item size={2.25} key={book.book_id}>
              <Card sx={{ width: 250, height: 300 }}>
                <CardMedia
                  component="img"
                  image={`https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`}
                  alt={book.book_title}
                  height="200"
                />
                <CardContent>
                <Typography
                  onClick={() => handleDetails(book.book_id)}
                  style={{ cursor: 'pointer', color: 'inherit' }}
                >
                  {book.book_title}
                </Typography>

                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Latest Entries */}
        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>Latest Entries</Typography>
        <Grid container spacing={2} justifyContent={'center'}>
          {latestEntries.map((book) => (
            <Grid item size={2.25} key={book.book_id}>
              <Card sx={{ width: 250, height: 300 }}>
                <CardMedia
                  component="img"
                  image={`https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`}
                  alt={book.book_title}
                  height="200"
                />
                <CardContent>
                <Typography
                  onClick={() => handleDetails(book.book_id)}
                  style={{ cursor: 'pointer', color: 'inherit' }}
                >
                  {book.book_title}
                </Typography>

                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Bottom Navigation */}
      <Box sx={{ mt: 4, py: 2, bgcolor: '#333', color: '#fff' }}>
        <Container sx={{ display: 'flex', justifyContent: 'space-around' }}>
          <Button color="inherit" onClick={() => navigate('/home')}>Home</Button>
          <Button color="inherit" onClick={() => navigate('/search')}>Browse</Button>
          <Button color="inherit" onClick={() => navigate('/ProfilePage2')}>My Account</Button>
          <Button color="inherit" onClick={() => navigate('/reserve-room')}>Reserve a Room</Button>
          <Button color="inherit" onClick={() => navigate('/about')}>About Us</Button>
          <Button color="inherit" onClick={() => navigate('/contact')}>Contact</Button>
        </Container>
      </Box>
    </Box>
    </ThemeProvider>
  );
};

export default HomePage;
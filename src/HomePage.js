import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Container, TextField, Link, Grid, Menu, MenuItem, Card, CardMedia, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import bgImage from './external/library_homepage.jpg';
import BookSearch from './BookSearch';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const HomePage = () => {
  const navigate = useNavigate();
  const [staffChoiceBooks, setStaffChoiceBooks] = useState([]);
  const [latestEntries, setLatestEntries] = useState([]);
  const [term, setTerm] = useState('');

  const handleSearch = () => {
    if (term.trim()) {
      // Navigate to the search page with the term as a URL parameter
      navigate(`/search?term=${encodeURIComponent(term)}`);
    }
  };

  // Fetch data for Staff's Choice and Latest Entries
  /*
  useEffect(() => {
    fetch('/api/staff-choice')
      .then((res) => res.json())
      .then((data) => setStaffChoiceBooks(data));

    fetch('/api/latest-entries')
      .then((res) => res.json())
      .then((data) => setLatestEntries(data));
  }, []);

  const handleSignOut = () => {
    navigate('/sign-in');
  };*/
  
  const [anchorEl, setAnchorEl] = useState(null);  // To control the dropdown menu

  // This is the handler for opening and closing the dropdown
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);  // This sets the anchor element for the Menu
  };

  const handleClose = () => {
    setAnchorEl(null);  // This closes the Menu
  };

  return (
    <Box>
      {/* Navbar */}
      <AppBar position="static" sx={{ height: '100px', justifyContent: 'flex-end', paddingBottom: '10px' }}>
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
      </AppBar>

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
      <Container sx={{ mt: 4 }}>
        {/* Staff's Choice */}
        <Typography variant="h5" sx={{ mb: 2 }}>Staff's Choice</Typography>
        <Grid container spacing={2}>
          {staffChoiceBooks.map((book) => (
            <Grid item xs={12} sm={6} md={3} key={book.book_id}>
              <Card>
                <CardMedia
                  component="img"
                  image={book.cover_image}
                  alt={book.title}
                  height="200"
                />
                <CardContent>
                  <Typography variant="subtitle1">{book.title}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Latest Entries */}
        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>Latest Entries</Typography>
        <Grid container spacing={2}>
          {latestEntries.map((book) => (
            <Grid item xs={12} sm={6} md={3} key={book.book_id}>
              <Card>
                <CardMedia
                  component="img"
                  image={book.cover_image}
                  alt={book.title}
                  height="200"
                />
                <CardContent>
                  <Typography variant="subtitle1">{book.title}</Typography>
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
  );
};

export default HomePage;
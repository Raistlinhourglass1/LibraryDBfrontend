import React, { useState, useEffect } from 'react';
import { CssBaseline, ThemeProvider, AppBar, Tabs, Tab, Box, Typography } from '@mui/material';
import BookCatalog from './BookCatalog';
import AudioBookCatalog from './AudioBookCatalog';
import EBookCatalog from './EBookCatalog';
import PeriodicalCatalog from './PeriodicalCatalog';
import bgImage from './external/iStock-1411029939-L.jpg';
import BooksCheckedOut from './BooksCheckedOut';
import BooksReserved from './BooksReserved';
import ClaudeTheme from './ClaudeTheme';

const StaffCatalog = () => {

  //const [catalogData, setCatalogData] = useState([]);
  const [bookData, setBookData] = useState([]);
  const [audiobookData, setAudiobookData] = useState([]);
  const [ebookData, setEbookData] = useState([]);
  const [periodicalData, setPeriodicalData] = useState([]);
  const [checkedOutBooks, setCheckedOutBooks] = useState([]);
  const [reservedBooks, setReservedBooks] = useState([]);

  const [selectedTab, setSelectedTab] = useState(0); // Tab index state
  // Fetch data from your backend
  
  /*
  const fetchData = async () => {
      const response = await fetch('http://localhost:5000/catalog');
      const data = await response.json();
      setCatalogData(data);
    }; */

    const handleTabChange = (event, newValue) => {
      setSelectedTab(newValue);
    };

    const fetchBooks = async () => {
      const response = await fetch('https://librarydbbackend.onrender.com/get-all-books');
      const data = await response.json();
      setBookData(data);
    };

    const fetchAudioBooks = async () => {
      const response = await fetch('https://librarydbbackend.onrender.com/get-all-audiobooks');
      const data = await response.json();
      setAudiobookData(data);
    };

    const fetchEBooks = async () => {
      const response = await fetch('https://librarydbbackend.onrender.com/get-all-ebooks');
      const data = await response.json();
      setEbookData(data);
    };

    const fetchPeriodicals = async () => {
      const response = await fetch('https://librarydbbackend.onrender.com/get-all-periodicals');
      const data = await response.json();
      setPeriodicalData(data);
    };

    const fetchCheckedOutBooks = async () => {
      try {
        const response = await fetch('https://librarydbbackend.onrender.com/checked-out-books');
        const data = await response.json();
        setCheckedOutBooks(data);
      } catch (error) {
        console.error('Error fetching checked out books:', error);
      }
    };
  
    const fetchReservedBooks = async () => {
      try {
        const response = await fetch('https://librarydbbackend.onrender.com/reserved-books');
        const data = await response.json();
        setReservedBooks(data);
      } catch (error) {
        console.error('Error fetching reserved books:', error);
      }
    };

  useEffect(() => {
    //fetchData();
    fetchBooks();
    fetchAudioBooks();
    fetchEBooks();
    fetchPeriodicals();
    fetchReservedBooks();
    fetchCheckedOutBooks();

  }, []);

  //const booksData = catalogData.filter((item) => item.item_type === 'book');
  //const audioBooksData = catalogData.filter((item) => item.item_type === 'audiobook');
  //const eBooksData = catalogData.filter((item) => item.item_type === 'ebook');
  //const periodicalsData = catalogData.filter((item) => item.item_type === 'periodical');

  return (
    <ThemeProvider theme={ClaudeTheme}>
        <CssBaseline />
    <div style={{ padding: '20px' }}>
       <Typography variant='h3'>Catalog</Typography>
      <AppBar position="static" sx={{ backgroundImage: `url(${bgImage})`, height: '200px', justifyContent: 'flex-end', paddingBottom: '10px', marginTop: 1 }}></AppBar>
      {/* Tabs for switching between catalogs */}

      <Box sx={{ marginTop: 2 }}>
      <Tabs value={selectedTab} onChange={handleTabChange} aria-label="catalog and book views tabs" centered>
          <Tab label="Books" />
          <Tab label="Audiobooks" />
          <Tab label="eBooks" />
          <Tab label="Periodicals" />
          <Tab label="Checked Out Books" />
          <Tab label="Reserved Books" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box sx={{ marginTop: 2 }}>
        {selectedTab === 0 && <BookCatalog catalogData={bookData} fetchData={fetchBooks} />}
        {selectedTab === 1 && <AudioBookCatalog catalogData={audiobookData} fetchData={fetchAudioBooks} />}
        {selectedTab === 2 && <EBookCatalog catalogData={ebookData} fetchData={fetchEBooks} />}
        {selectedTab === 3 && <PeriodicalCatalog catalogData={periodicalData} fetchData={fetchPeriodicals} />}

        {/* Book Views Content */}
        {selectedTab === 4 && <BooksCheckedOut books={checkedOutBooks} />}
        {selectedTab === 5 && <BooksReserved books={reservedBooks} />}
      </Box>
    </div>
    </ThemeProvider>
  );
};

export default StaffCatalog;
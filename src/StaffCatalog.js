import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import BookCatalog from './BookCatalog';
import AudioBookCatalog from './AudioBookCatalog';
import EBookCatalog from './EBookCatalog';
import PeriodicalCatalog from './PeriodicalCatalog';

const StaffCatalog = () => {

  //const [catalogData, setCatalogData] = useState([]);
  const [bookData, setBookData] = useState([]);
  const [audiobookData, setAudiobookData] = useState([]);
  const [ebookData, setEbookData] = useState([]);
  const [periodicalData, setPeriodicalData] = useState([]);

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
      const response = await fetch('http://localhost:5000/get-all-books');
      const data = await response.json();
      setBookData(data);
    };

    const fetchAudioBooks = async () => {
      const response = await fetch('http://localhost:5000/get-all-audiobooks');
      const data = await response.json();
      setAudiobookData(data);
    };

    const fetchEBooks = async () => {
      const response = await fetch('http://localhost:5000/get-all-ebooks');
      const data = await response.json();
      setEbookData(data);
    };

    const fetchPeriodicals = async () => {
      const response = await fetch('http://localhost:5000/get-all-periodicals');
      const data = await response.json();
      setPeriodicalData(data);
    };


  useEffect(() => {
    //fetchData();
    fetchBooks();
    fetchAudioBooks();
    fetchEBooks();
    fetchPeriodicals();

  }, []);

  //const booksData = catalogData.filter((item) => item.item_type === 'book');
  //const audioBooksData = catalogData.filter((item) => item.item_type === 'audiobook');
  //const eBooksData = catalogData.filter((item) => item.item_type === 'ebook');
  //const periodicalsData = catalogData.filter((item) => item.item_type === 'periodical');

  return (
    <div style={{ padding: '20px' }}>
      <h1>Catalog Page</h1>
      
      {/* Tabs for switching between catalogs */}
      <Tabs value={selectedTab} onChange={handleTabChange} aria-label="catalog tabs" centered>
        <Tab label="Books" />
        <Tab label="Audiobooks" />
        <Tab label="eBooks" />
        <Tab label="Periodicals" />
      </Tabs>

      {/* Tab Content */}
      <Box sx={{ marginTop: 2 }}>
        {selectedTab === 0 && <BookCatalog catalogData={bookData} fetchData={fetchBooks} />}
        {selectedTab === 1 && <AudioBookCatalog catalogData={audiobookData} fetchData={fetchAudioBooks} />}
        {selectedTab === 2 && <EBookCatalog catalogData={ebookData} fetchData={fetchEBooks} />}
        {/*selectedTab === 3 && <PeriodicalCatalog catalogData={periodicalData} fetchData={fetchPeriodicals}/>*/} 
        
        {selectedTab === 3 && <div>Periodical Catalog (coming soon)</div>} 
      </Box>
    </div>
  );
};

export default StaffCatalog;
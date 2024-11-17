import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import BookCatalog from './BookCatalog';
import AudioBookCatalog from './AudioBookCatalog';
import EBookCatalog from './EBookCatalog';
import PeriodicalCatalog from './PeriodicalCatalog';

const StaffCatalog = () => {

  const [catalogData, setCatalogData] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0); // Tab index state
  // Fetch data from your backend
  
  const fetchData = async () => {
      const response = await fetch('https://librarydbbackend.onrender.com/catalog');
      const data = await response.json();
      setCatalogData(data);
    };

    const handleTabChange = (event, newValue) => {
      setSelectedTab(newValue);
    };

  useEffect(() => {
    fetchData();
  }, []);

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
        {selectedTab === 0 && <BookCatalog catalogData={catalogData} fetchData={fetchData} />}
        {selectedTab === 1 && <AudioBookCatalog catalogData={catalogData} fetchData={fetchData} />}
        {selectedTab === 2 && <EBookCatalog catalogData={catalogData} fetchData={fetchData} />}
        {selectedTab === 3 && <PeriodicalCatalog catalogData={catalogData} fetchData={fetchData}/>} 
        
        {/*selectedTab === 2 && <div>eBook Catalog (coming soon)</div>*/}  {/* Placeholder for eBooks */}
        {/*selectedTab === 3 && <div>Periodical Catalog (coming soon)</div>*/}  {/* Placeholder for Periodicals */}
      </Box>
    </div>
  );
};

export default StaffCatalog;
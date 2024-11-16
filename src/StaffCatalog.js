import React, { useState, useEffect } from 'react';
import BookCatalog
 from './BookCatalog';
const StaffCatalog = () => {

  const [catalogData, setCatalogData] = useState([]);

  // Fetch data from your backend
  
  const fetchData = async () => {
      const response = await fetch('http://localhost:5000/catalog');
      const data = await response.json();
      setCatalogData(data);
    };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Catalog Page</h1>
      <BookCatalog catalogData={catalogData} fetchData={fetchData}/>
    </div>
  );
};

export default StaffCatalog;
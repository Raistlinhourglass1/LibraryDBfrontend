import React, { useEffect, useRef, useState } from 'react';


const useDebounce = (value, delay) => {   //this is used to delay sending the isbn prematurely 
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};



const BarcodeScanner = ({ setScannedData }) => {
  const videoRef = useRef(null);


  const [isbnBuffer, setIsbnBuffer] = useState(""); //for the debounce
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const debouncedIsbn = useDebounce(isbnBuffer, 500); // Wait 500ms for the full ISBN to be scanned

  // Assuming the scanner sends the scanned value and an "Enter" string
  const [inputData, setInputData] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  
  useEffect(() => {
    const handleKeyPress = (event) => {
      // If the scanner sends 'Enter' as the value, skip it
      if (event.key === 'Enter') {
        return;
      }

     // Accumulate input characters in the buffer
     setIsbnBuffer((prev) => prev + event.key);
    };

    // Attach keydown event listener to capture scanned data
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

   // Handle ISBN after debouncing and send it to the parent component (BookEntry or other)
   useEffect(() => {
    if (debouncedIsbn) {
      setScannedData(debouncedIsbn); // Pass the final ISBN once it's fully scanned
      setIsbnBuffer(""); // Clear the buffer after the scan is complete
    }
  }, [debouncedIsbn, setScannedData]);
  return (
    <>
    {loading && <p>Loading...</p>}
    {error && <p style={{ color: 'red' }}>{error}</p>}
    </>
  );
};

export default BarcodeScanner;
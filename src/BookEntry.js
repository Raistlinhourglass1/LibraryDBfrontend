import React, { useState, useEffect  } from 'react';
import { Breadcrumbs, Box, Button, CircularProgress, Container, CssBaseline, InputAdornment, IconButton, Link, MenuItem, Stack, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { DatePicker, LocalizationProvider  } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs';
import BarcodeScanner from './BarcodeScanner';
import { ThemeProvider } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import ClaudeTheme from './ClaudeTheme';

const categories = [
    {
        value: 'paperback',
        label: 'Paperback',
    },
    {
        value: 'hardcover',
        label: 'Hardcover',
    },
    {
        value: 'digital',
        label: 'Digital',
    }
];

const status = [
    {
        value: 'available',
        label: 'Available',
    },
    {
        value: 'reserved',
        label: 'Reserved',
    },
    {
        value: 'checked_out',
        label: 'Checked Out',
    },
    {
        value: 'lost',
        label: 'Lost',
    }
];

function BookEntry({ book, onClose, fetchData }) {
    console.log('Book: ', book);


    const [scannedISBN, setScannedISBN] = useState(''); //used for scanner
    const [bookData, setBookData] = useState(null); //scanner
    const [showScanner, setShowScanner] = useState(false); //shows scanner
    const [cleared, setCleared] = React.useState(false); //clears data in textboxes
    
    const [formData, setFormData] = useState({
        bIsbn: '',
        bTitle: '',
        bAuthor: '',
        bPublisher: '',
        bCategory: '',
        bEdition: '',
        bYear: '',
        bMediaType: 'paperback',
        bNumPages: '',
        bLang: 'English',
        bSummary: '',
        bNotes: '',
        bStatus: 'available',
    });

    ////this is for editing book state
    useEffect(() => {
        if (book) {
            
          setFormData({
            book_id: book.book_id,
            bIsbn: book.isbn,
            bTitle: book.book_title,
            bAuthor: book.author,
            bPublisher: book.publisher,
            bCategory: book.book_category,
            bEdition: book.edition,
            bYear: book.year_copyright,
            bMediaType: book.media_type,
            bNumPages: book.num_pages,
            bLang: book.language,
            bSummary: book.book_summary,
            bNotes: book.book_notes,
            bStatus: book.book_status,
          });
          setIsbn(book.isbn)
        }
      }, [book]);
      ////////////end book edit state

    const [message, setMessage] = useState(null); 
    const [messageType, setMessageType] = useState('');
    const [error, setError] = useState(false); // State for error
    const [helperText, setHelperText] = useState(''); // State for helper text
    const [loading, setLoading] = useState(false); // Loading state for the form submission
    

    ////////this is for formatting the isbn visually to include dashes for the user to see
    const [isbn, setIsbn] = useState(formData.bIsbn);

    const formatIsbn = (isbn) => {
        // Remove non-numeric characters
        const cleanedIsbn = isbn.replace(/[^0-9]/g, '');
    
        // Format as ISBN-13 or ISBN-10
        if (cleanedIsbn.length <= 10) {
          return cleanedIsbn.replace(/(\d{3})(\d{1})(\d{4})(\d{4})/, '$1-$2-$3-$4');
        } else if (cleanedIsbn.length <= 13) {
          return cleanedIsbn.replace(/(\d{3})(\d{1})(\d{4})(\d{4})(\d{1})/, '$1-$2-$3-$4-$5');
        }
        return cleanedIsbn;
      };
    
      // Handle ISBN change: store raw value and format for display
      const handleIsbnChange = (event) => {
        // Get the raw input value (remove dashes and non-numeric characters)
        let rawIsbn = event.target.value.replace(/[^0-9]/g, '');
        
        // Limit to 13 characters
        if (rawIsbn.length > 13) {
          rawIsbn = rawIsbn.slice(0, 13); // Cut off excess characters
        }
    
        setIsbn(rawIsbn); // Store raw ISBN (no dashes)
        handleChange(event); // Call the parent handler for other form fields
      };
    
    /////////end isbn formatting

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
          }));
        if (!/^\d{10}|\d{13}$/.test(value)) {
            setError(true);
            setHelperText("Invalid ISBN format");
          } else {
            setError(false);
            setHelperText("Enter the ISBN");
          }
          if (name === 'bYear' && value) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                bYear: value.year(),
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const isEditMode = !!formData.book_id; // Check if we are editing (has book_id)
        const method = isEditMode ? 'PUT' : 'POST';
        console.log('Original formData:', formData);
        
        try {
            const response = await fetch('https://librarydbbackend.onrender.com/book-entry', {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const errorMessage = errorData?.message || 'Something went wrong';
                throw new Error(errorMessage);
            }

            const responseData = await response.json();
            console.log('Response Data:', responseData);


            const successMessage = isEditMode ? 'Book updated successfully!' : 'Book added successfully!';
            setMessage(successMessage);
            setMessageType('success');
            fetchData(); // Refresh the book list

        } catch (error) {
            console.error('Error:', error);
            setMessage('Error submitting data:' + error.message);
            setMessageType('danger');
        } finally {
            setLoading(false);
            onClose();
        }
    };
    
    useEffect(() => {
        if (cleared) {
        const timeout = setTimeout(() => {
            setCleared(false);
        }, 1500);
    
        return () => clearTimeout(timeout);
        }
        return () => {};
    }, [cleared]);

    const handleClear = () => {
        setFormData({
          bIsbn: '',
          bTitle: '',
          bAuthor: '',
          bPublisher: '',
          bCategory: '',
          bEdition: '',
          bYear: '',
          bMediaType: '',
          bNumPages: '',
          bNumCopies: '',
          bLang: '',
          bSummary: '',
          bNotes: '',
        });
        setIsbn('');
      };


    /////////////SCANNER STUFF//////////////////
    const focusInput = () => {
        document.getElementById('isbn-input').focus();
    };

    const fetchBookDetails = async (isbn) => {
        try {
          // Clear previous error before making the API call
          setError("");
      
          const response = await fetch(
            `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`
          );
      
          if (!response.ok) {
            setError("Failed to fetch book data.");
            return;
          }
      
          const data = await response.json();
          console.log("API Response Data:", data);
      
          const book = data[`ISBN:${isbn}`];
      
          if (book) {
            // Update form data with the retrieved book information
            setFormData((prevFormData) => ({
              ...prevFormData,
              bIsbn: isbn,
              bTitle: book.title || "",
              bAuthor: book.authors ? book.authors.map((author) => author.name).join(", ") : "",
              bPublisher: book.publishers && book.publishers[0] ? book.publishers[0].name : "",
              bCategory: book.subjects ? book.subjects.map((subject) => subject.name).join(', ') : '',
              bYear: book.publish_date || "",
              bNumPages: book.number_of_pages || "",
              bSummary: typeof book.description === "string" ? book.description : book.description?.value || "",
              bLang: book.languages ? book.languages[0] : '', // May return language code like 'eng'
            }));
          } else {
            // ISBN not found in the OpenLibrary database
            setError("No book information found for this ISBN.");
          }
        } catch (error) {
          console.error("Error fetching book details:", error);
          setError("An error occurred while retrieving the book details.");
        }
      };


      //handles scanner
      const handleScan = (isbn) => {
        console.log('Scanned ISBN:', isbn);
        if (isbn) {
            fetchBookDetails(isbn);
            setFormData((prevFormData) => ({
                ...prevFormData,
                bIsbn: isbn, // Autofill ISBN in the form
            }));
            setShowScanner(false);
        } else {
            console.error('No ISBN received from scanner.');
        }
    };

    /////////////////END SCANNER STUFF/////////////////

    ////////////START IMAGE UPLOAD
/*
      //for book cover image uploading
      const [coverPreview, setCoverPreview] = useState(null);  // state to store image preview
      const [imageError, setImageError] = useState(""); // Error state for image input
  
  
      const handleImageUpload = (e) => {
          const file = e.target.files[0];
          if (file) {
            if (file.type.startsWith('image/')) {
              setFormData((prevFormData) => ({
                ...prevFormData,
                bCoverImage: file, // Store the file directly as a Blob (not base64)
              }));
             
            } else {
              setImageError('Please upload a valid image file.');
            }
             // Create a preview URL for the selected file
              const reader = new FileReader();
              reader.onloadend = () => {
                  setCoverPreview(reader.result); // Set the preview URL in the state
              };
              reader.readAsDataURL(file); // Convert the file to a data URL for preview
          }
      };

      
      /////END IMAGE UPLOAD
*/

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  return (
<>
<ThemeProvider theme={ClaudeTheme}>
      <CssBaseline />
      {/* Form Section */}
      <Box
        component="form"
        sx={{
            display: 'flex',
            flexDirection: 'column',
            '& .MuiTextField-root': { marginBottom: 5 },
            p: 3,
            borderRadius: 2, // Rounded corners
            boxShadow: 3, // Shadow for a card-like effect
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >

      {/* ISBN Scanning Option */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          required
          helperText="Enter the ISBN"
          id="isbn-input"
          label="ISBN"
          variant="standard"
          name="bIsbn"
          value={formatIsbn(isbn)}  //displayed pretty isbn
          onChange={handleIsbnChange}  ///stores raw isbn for db
          sx={{ width: '40%' }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {/* Divider Box */}
                <Box sx={{ borderLeft: '1px solid #ccc', height: '24px', margin: '0 8px' }} />
                {/* Icon Button */}
                <IconButton
                  sx={{ padding: 0, 
                    marginRight: '12px', // Add margin to the right to extend the underline
                  }}
                  onClick={() => {
                    focusInput();
                    setShowScanner(true); // Trigger your scanner logic
                  }}
                >
                  <span className="material-symbols-outlined">barcode_scanner</span> {/* Barcode scanner icon */}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {showScanner && (
        <BarcodeScanner setScannedData={handleScan} />
      )}

        
        <Grid container spacing={2}>
            <Grid item size={5}>
              <TextField
                required
                label="Title"
                variant="standard"
                name="bTitle"
                value={formData.bTitle}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item size={5}>
              <TextField
                required
                label="Author"
                variant="standard"
                name="bAuthor"
                value={formData.bAuthor}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            
          </Grid>

        <Grid container spacing={2}>
            <Grid item size={5}>
                <TextField
                    required
                    label="Publisher"
                    variant="standard"
                    name="bPublisher"
                    value={formData.bPublisher}
                    onChange={handleChange}
                    fullWidth
                />
                </Grid>
            <Grid item size={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                    variant="standard"
                    label="Publication Date"
                    views={['year']}
                    name="bYear"
                    value={formData.bYear ? dayjs(`${formData.bYear}`, 'YYYY') : null} // Ensure valid date
                    onChange={(newValue) => {
                        setFormData((prevFormData) => ({
                        ...prevFormData,
                        bYear: newValue ? newValue.year() : null, // Store the year directly as a number
                        }));
                    }}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                </LocalizationProvider>
            </Grid>
            <Grid item size={2}>
              <TextField
                label="Edition"
                type="number"
                variant="standard"
                name="bEdition"
                value={formData.bEdition}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
        </Grid>

        {/*category media type */}
          <Grid container spacing={2} sx={{ marginTop: 2 }}>

            <Grid item size={3}>
              <TextField
                label="Category"
                variant="standard"
                name="bCategory"
                value={formData.bCategory}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            
    {/* Media Type */}
            <Grid item size={3}>
                <TextField
                id="media-input"
                select
                label="Media Type"
                variant="standard"
                name="bMediaType"
                value={formData.bMediaType}
                onChange={handleChange}
                sx={{ width: '100%' }}
                >
                {categories.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                    {option.label}
                    </MenuItem>
                ))}
                </TextField>
            </Grid>        
    {/* Language */}
            <Grid item size={3}>
                <TextField
                id="language-input"
                label="Language"
                variant="standard"
                name="bLang"
                value={formData.bLang}
                onChange={handleChange}
                //sx={{ width: '20%' }}
                />
            </Grid>
    {/* Number of Pages */}
            <Grid item size={2}>
                <TextField
                id="pages-input"
                label="Pages"
                variant="standard"
                name="bNumPages"
                value={formData.bNumPages}
                onChange={handleChange}
                sx={{ width: '100%' }}
                />
            </Grid>
          </Grid>


        {/* Summary */}
        <TextField
          id="summary-input"
          label="Summary"
          multiline
          rows={4}
          name="bSummary"
          value={formData.bSummary}
          onChange={handleChange}
        />

        {/* Notes */}
        <TextField
          id="notes-input"
          label="Notes"
          multiline
          rows={4}
          name="bNotes"
          value={formData.bNotes}
          onChange={handleChange}
        />

            <Grid item size={3}>
                <TextField
                id="status-input"
                select
                label="Status"
                variant="standard"
                name="bStatus"
                value={formData.bStatus}
                onChange={handleChange}
                sx={{ width: '100%' }}
                >
                {status.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                    {option.label}
                    </MenuItem>
                ))}
                </TextField>
            </Grid>
            {/* Book Cover Image Upload 
            <Typography variant="h6" gutterBottom>Book Cover Image</Typography>
                                <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="book-cover-upload"
                                type="file"
                                onChange={handleImageUpload}
                                />
                                <label htmlFor="book-cover-upload">
                                <IconButton
                                    color="primary"
                                    aria-label="upload picture"
                                    component="span"
                                    sx={{ marginBottom: '16px' }}
                                >
                                    <PhotoCamera />
                                </IconButton>
                                <Typography variant="body2" color="text.secondary">
                                    Upload Cover Image
                                </Typography>
                                </label>


                                {imageError && <Typography color="error">{imageError}</Typography>}


                                {coverPreview && (
                                <Box sx={{ marginTop: 2 }}>
                                    <Typography variant="body1" gutterBottom>Selected Cover:</Typography>
                                    <img
                                    src={coverPreview}
                                    alt="Cover Preview"
                                    style={{ width: 100, height: 150, objectFit: 'cover' }}
                                    />
                                </Box>
                                )}*/}        

        {/* Action Buttons */}
        <Stack spacing={2} direction="row" justifyContent="flex-end" sx={{ marginTop: 3 }}>
          <Button variant="text" onClick={handleClear}>Clear All</Button>
          <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ marginTop: 2 }}>
        {book ? 'Update Book' : 'Add Book'}
      </Button>
        </Stack>

        {message && <div>{message}</div>} {/* Display success or error message */}
      </Box>
  </ThemeProvider>
</>
  )
}

export default BookEntry
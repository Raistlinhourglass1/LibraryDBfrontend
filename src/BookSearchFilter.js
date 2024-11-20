import React, { useState } from 'react'
import { Accordion, AccordionDetails , AccordionSummary } from '@mui/material';
import {  Box, Button, Container, Checkbox, MenuItem, Stack, TextField, Typography } from '@mui/material';
import  { FormLabel, FormControl, FormControlLabel, FormGroup, FormHelperText,  Radio, RadioGroup } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';


function BookSearchFilter({ books, onFilter }) {
    const [state, setState] = React.useState({
        book: false,
        journal: false,
        magazine: false,
        newspaper: false,
        digital: false,
        dvd: false
      });
    const [statusFilter, setStatusFilter] = useState('all');

      const handleStatusChange = (e) => { //handles book status filter
        setStatusFilter(e.target.value);
      };
    
      const handleFilterClick = () => {
        let result = books;
    
        // Filter by status
        if (statusFilter !== 'all') {
          result = result.filter((book) => book.book_status === statusFilter);
        }
    
        // Pass the filtered books to the parent component
        onFilter(result);
      };

      
      const { book, journal, magazine, newspaper, digital, dvd } = state;
      const error = [book, journal, magazine, newspaper, digital, dvd].filter((v) => v).length !== 2;
  return (
    <>
    <Container sx={{ boxShadow: 3, borderRadius:3, padding: 2 }}>
    <Typography>Filter By:</Typography>
    <Stack
          direction="column"
          sx={{
            p: 2,
            gap: 1,
            justifyContent: "flex-start",
            alignItems: 'stretch',
            maxWidth: '100%',
            minWidth: '100%'
          }}
        >
          {/* Status Filter */}
          <Typography>Book Status</Typography>
        <FormControl component="fieldset" variant="standard">
          <RadioGroup value={statusFilter} onChange={handleStatusChange}>
            <FormControlLabel value="all" control={<Radio />} label="All" />
            <FormControlLabel value="available" control={<Radio />} label="Available" />
            <FormControlLabel value="checked_out" control={<Radio />} label="Checked Out" />
            <FormControlLabel value="reserved" control={<Radio />} label="Reserved" />
          </RadioGroup>
        </FormControl>
{/*
          <Typography>Exclude</Typography>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography>Material Type</Typography>
            </AccordionSummary>
            <AccordionDetails>
              
            <FormControl sx={{ pt: 0, ml: 2 }} component="fieldset" variant="standard">
                <FormGroup>
                    <FormControlLabel
                        control={
                        <Checkbox checked={book} onChange={handleChange} name="book" />
                        }
                        label="Books"
                    />
                    <FormControlLabel
                        control={
                        <Checkbox checked={journal} onChange={handleChange} name="journal" />
                        }
                        label="Journals"
                    />
                    <FormControlLabel
                        control={
                        <Checkbox checked={magazine} onChange={handleChange} name="magazine" />
                        }
                        label="Magazines"
                    />
                    <FormControlLabel
                        control={
                        <Checkbox checked={newspaper} onChange={handleChange} name="newspaper" />
                        }
                        label="Newspapers"
                    />
                    <FormControlLabel
                        control={
                        <Checkbox checked={digital} onChange={handleChange} name="digital" />
                        }
                        label="Digital"
                    />
                    <FormControlLabel
                        control={
                        <Checkbox checked={dvd} onChange={handleChange} name="dvd" />
                        }
                        label="CD/DVD"
                    />
                </FormGroup>
                <FormHelperText></FormHelperText>
            </FormControl>

            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Typography>Format Type</Typography>
            </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Add the checkboxes here
            </Typography>
          </AccordionDetails>
        </Accordion>
        */}
        {/* Apply Filter Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleFilterClick}
          sx={{ mt: 2 }}
        >
          Apply Filters
        </Button>
        </Stack>
        </Container>
      </>
  )
}

export default BookSearchFilter
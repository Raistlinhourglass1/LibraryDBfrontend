import React, { useState, useEffect } from 'react';
import { Breadcrumbs, Box, Button, Container, Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Link, Paper, Stack, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography, IconButton } from '@mui/material';
import { Search } from '@mui/icons-material';
import PeriodicalEntry from './PeriodicalEntry';

const PeriodicalCatalog = ({ periodicalData, fetchData }) => {
    const [periodicals, setPeriodicals] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filteredPeriodicals, setFilteredPeriodicals] = useState([]);

    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [selectedPeriodical, setSelectedPeriodical] = useState(null); // Used for editing an existing periodical
    
    const handleOpenAddDialog = () => {
        setSelectedPeriodical(null); // Clear selected periodical for adding a new one
        setOpenAddDialog(true);
      };
    
      const handleOpenEditDialog = (periodical) => {
        setSelectedPeriodical(periodical);
        setOpenAddDialog(true);
      };
    
      const handleCloseDialog = () => {
        setOpenAddDialog(false);
        setSelectedPeriodical(null); // Clear selected periodical when dialog is closed
      };
    
    
      {/*
      const handleDelete = async (periodicalId) => {
        if (!window.confirm('Are you sure you want to delete this periodical?')) return;
    
        try {
          const response = await fetch('http://localhost:5000/soft-delete-periodical', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ periodical_id: periodicalId }),
          });
    
          const data = await response.json();
          if (response.ok) {
            alert(data.message);
            fetchData(); // Refresh the periodical list
          } else {
            alert(`Error: ${data.message}`);
          }
        } catch (error) {
          console.error('Error deleting periodical:', error);
          alert('Failed to delete the periodical. Please try again.');
        }
      }; 

    // Fetch periodicals from the API
    useEffect(() => {
        const fetchPeriodicals = async () => {
            const response = await fetch('http://localhost:5000/catalog-periodicals'); // Your API endpoint
            const data = await response.json();
            setPeriodicals(data);
            setFilteredPeriodicals(data); // Initially display all periodicals
        };

        fetchPeriodicals();
    }, []);*/}

    // Handle search input change
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // Filter periodicals based on search query
    useEffect(() => {
        if (searchQuery === '') {
            setFilteredPeriodicals(periodicals);
        } else {
            const filtered = periodicals.filter((periodical) =>
                periodical.pTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                periodical.pAuthor.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredPeriodicals(filtered);
        }
    }, [searchQuery, periodicals]);

    // Handle page change
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Handle rows per page change
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Container maxWidth="lg">
            <Paper sx={{ bgcolor: '#f2f2f2', padding: 3 }}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link underline="hover" color="inherit" href="/">Home</Link>
                    <Link underline="hover" color="inherit" href="/catalog-periodicals">Periodicals</Link>
                    <Typography sx={{ color: 'text.primary' }}>Periodical Catalog</Typography>
                </Breadcrumbs>

                <Typography variant="h4" gutterBottom>Periodical Catalog</Typography>

                {/* Search Bar */}
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <TextField
                        value={searchQuery}
                        onChange={handleSearchChange}
                        label="Search by Title or Author"
                        variant="outlined"
                        size="small"
                        sx={{ width: '300px' }}
                        InputProps={{
                            endAdornment: (
                                <IconButton>
                                    <Search />
                                </IconButton>
                            ),
                        }}
                    />
                </Box>
                
                {/* Button to open Periodical Entry Dialog */}
                <Button variant="contained" color="primary" onClick={handleOpenAddDialog} sx={{ marginBottom: 2 }}>
                Add New Periodical
                </Button>


                {/* Periodical Table */}
                <TableContainer component={Paper} sx={{ mb: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Author</TableCell>
                                <TableCell>Publisher</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Frequency</TableCell>
                                <TableCell>Issue Date</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredPeriodicals
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((periodical) => (
                                    <TableRow key={periodical.pIssn}>
                                        <TableCell>{periodical.pTitle}</TableCell>
                                        <TableCell>{periodical.pAuthor}</TableCell>
                                        <TableCell>{periodical.pPublisher}</TableCell>
                                        <TableCell>{periodical.pType}</TableCell>
                                        <TableCell>{periodical.pCategory}</TableCell>
                                        <TableCell>{periodical.pFrequency}</TableCell>
                                        <TableCell>{periodical.pIssueDate}</TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={1}>
                                            <Button
                                                onClick={() => handleOpenEditDialog(periodical)}
                                                variant="outlined"
                                                size="small"
                                                color="primary"
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                onClick={() => handleDelete(periodical.periodical_id)}
                                                >
                                                Delete
                                                </Button>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Pagination */}
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredPeriodicals.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />

                 {/* Dialog for adding/editing periodical */}
      <Dialog
        open={openAddDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{selectedPeriodical ? 'Edit Periodical' : 'Add Periodical'}</DialogTitle>
        <DialogContent>
          <PeriodicalEntry
            periodical={selectedPeriodical}
            onClose={handleCloseDialog}
            fetchData={fetchData}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
            </Paper>
        </Container>
    );
};

export default PeriodicalCatalog;
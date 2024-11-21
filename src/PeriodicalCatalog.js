import React, { useState, useEffect } from 'react';
import {
  Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle,
  Paper, Stack, TextField, Table, TableBody, TableCell, TableContainer, TableHead,
  TablePagination, TableRow, Typography, IconButton, ToggleButtonGroup, ToggleButton
} from '@mui/material';
import { Search } from '@mui/icons-material';
import PeriodicalEntry from './PeriodicalEntry';
import { format } from 'date-fns';

const calculateFormattedDate = (dateTime) => {
  if (!dateTime) return { formattedDate: 'N/A' };
  
  const date = new Date(dateTime);
  const formattedDate = format(date, 'MM/dd/yyyy'); // Format as 'MM/DD/YYYY'

return { formattedDate };
};

const PeriodicalCatalog = ({ catalogData, fetchData }) => {
  const [periodicals, setPeriodicals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredPeriodicals, setFilteredPeriodicals] = useState([]);
  const [viewOption, setViewOption] = useState('showNormal'); // Default view option

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedPeriodical, setSelectedPeriodical] = useState(null);

  // Fetch periodicals from the passed data
  useEffect(() => {
    console.log('Received periodicalData:', catalogData);
    setPeriodicals(catalogData);
  }, [catalogData]);

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle toggle for view options
  const handleViewOptionChange = (event, newValue) => {
    if (newValue !== null) {
      setViewOption(newValue);
    }
  };

  // Filter periodicals based on view option and search query
  useEffect(() => {
    if (!Array.isArray(periodicals)) {
      setFilteredPeriodicals([]);
      return;
    }
    const lowerSearch = searchQuery.toLowerCase();
    const filtered = periodicals
      .filter((periodical) => {
        if (viewOption === 'showNormal') return !periodical.deleted;
        if (viewOption === 'showOnlyDeleted') return periodical.deleted;
        if (viewOption === 'showDeleted') return true;
        return true;
      })
      .filter((periodical) =>
        periodical.periodical_title.toLowerCase().includes(lowerSearch)
      );

    setFilteredPeriodicals(filtered);
  }, [searchQuery, periodicals, viewOption]);

  // Handle delete (soft delete)
  const handleDelete = async (periodicalId) => {
    if (!window.confirm('Are you sure you want to delete this periodical?')) return;

    try {
      const response = await fetch('https://librarydbbackend.onrender.com/soft-delete-periodical', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ periodical_id: periodicalId }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        fetchData();
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error deleting periodical:', error);
      alert('Failed to delete the periodical. Please try again.');
    }
  };

  // Handle restore of a deleted periodical
  const handleRestore = async (periodicalId) => {
    try {
      const response = await fetch('https://librarydbbackend.onrender.com/restore-periodical', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ periodical_id: periodicalId }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        fetchData();
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error restoring periodical:', error);
      alert('Failed to restore the periodical. Please try again.');
    }
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle opening/closing of the add/edit dialog
  const handleOpenAddDialog = () => {
    setSelectedPeriodical(null);
    setOpenAddDialog(true);
  };

  const handleOpenEditDialog = (periodical) => {
    console.log('Editing periodical:', periodical); // Log the selected periodical
    setSelectedPeriodical(periodical);
    setOpenAddDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenAddDialog(false);
    setSelectedPeriodical(null);
  };

  return (
    <Container maxWidth="lg">
      <Paper sx={{ bgcolor: '#f2f2f2', padding: 3 }}>
        <Typography variant="h4" gutterBottom>Periodical Catalog</Typography>

         {/* Add Periodical Button */}
         <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" color="primary" onClick={handleOpenAddDialog}>
            Add Periodical
          </Button>
        </Box>

        {/* Search Bar */}
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <TextField
            value={searchQuery}
            onChange={handleSearchChange}
            label="Search by Title"
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

        {/* Toggle for view options */}
        <ToggleButtonGroup
          value={viewOption}
          exclusive
          onChange={handleViewOptionChange}
          sx={{ mb: 2 }}
        >
          <ToggleButton value="showNormal">Normal</ToggleButton>
          <ToggleButton value="showDeleted">All</ToggleButton>
          <ToggleButton value="showOnlyDeleted">Only Deleted</ToggleButton>
        </ToggleButtonGroup>

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
                   <TableRow key={periodical.periodical_id}>
                    <TableCell>{periodical.periodical_title}</TableCell>
                    <TableCell>{periodical.periodical_author}</TableCell>
                    <TableCell>{periodical.periodical_publisher}</TableCell>
                    <TableCell>{periodical.periodical_type}</TableCell>
                    <TableCell>{periodical.periodical_category}</TableCell>
                    <TableCell>{periodical.frequency}</TableCell>
                    <TableCell>{calculateFormattedDate(periodical.issue_date).formattedDate}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button onClick={() => handleOpenEditDialog(periodical)} variant="outlined" size="small" color="primary">Edit</Button>
                        {!periodical.deleted ? (
                          <Button variant="outlined" color="error" onClick={() => handleDelete(periodical.periodical_id)}>Delete</Button>
                        ) : (
                          <Button variant="outlined" color="success" onClick={() => handleRestore(periodical.periodical_id)}>Restore</Button>
                        )}
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
        <Dialog open={openAddDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>{selectedPeriodical ? 'Edit Periodical' : 'Add Periodical'}</DialogTitle>
          <DialogContent>
            <PeriodicalEntry periodical={selectedPeriodical} onClose={handleCloseDialog} fetchData={fetchData} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default PeriodicalCatalog;
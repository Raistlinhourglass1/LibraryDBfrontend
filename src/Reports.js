import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import AppTheme from './AppTheme';
import ColorModeSelect from './ColorModeSelect';
import { Select, MenuItem } from '@mui/material';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  maxWidth: '100%',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const ReportsContainer = styled(Stack)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  padding: theme.spacing(2),
  backgroundImage:
    'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
  backgroundRepeat: 'no-repeat',
  ...theme.applyStyles('dark', {
    backgroundImage:
      'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
  }),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
}));

const TableContainer = styled(Box)(({ theme }) => ({
  overflowX: 'auto',
  maxHeight: '400px',
  width: '100%',
  marginTop: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

const StyledTable = styled('table')(({ theme }) => ({
  width: '100%',
  borderCollapse: 'collapse',
  '& th, & td': {
    padding: theme.spacing(1),
    border: `1px solid ${theme.palette.divider}`,
    textAlign: 'left',
  },
  '& th': {
    backgroundColor: theme.palette.action.hover,
  },
}));

function Reports(props) {
  const [specification, setSpecification] = useState('');
  const [date, setDate] = useState('');
  const [userId, setUserId] = useState('');
  const [laptopId, setLaptopId] = useState('');
  const [calcId, setCalcId] = useState('');
  const [periodType, setPeriodType] = useState('');
  const [reservationType, setReservationType] = useState('');
  const [staffId, setStaffId] = useState('');
  const [teachEmail, setTeachEmail] = useState('');
  const [bookName, setBookName] = useState('');
  const [bookIsbn, setBookIsbn] = useState('');
  const [roomNum, setRoomNum] = useState('');
  const [mediaType, setmediaType] = useState('');
  const [reportData, setReportData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [topBooks, setTopBooks] = useState(5);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Clear irrelevant filters when the specification changes
  useEffect(() => {
    setDate('');
    setStartDate('');
    setEndDate('');
    setUserId('');
    setStaffId('');
    setCalcId('');
    setTeachEmail('');
    setBookName('');
    setBookIsbn('');
    setLaptopId('');
    setPeriodType('');
    setRoomNum('');
    setTopBooks('');
    setReservationType('');
    setmediaType('');
  }, [specification]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prepare the payload based on the selected specification
    const payload = { specification };
    if (startDate && endDate && specification !== 'most liked') {
      payload.start_date = startDate;
      payload.end_date = endDate;
    } else if (date && specification !== 'most liked') {
      payload.date = date;
    }
    
    if (specification === 'user transactions') {
      payload.reservation_type = reservationType;
      payload.user_id = userId;
    }

    if (specification === 'session activity') {
      payload.user_id = userId;
    }
    if (specification === 'catalog') {
      payload.media_type = mediaType;
      payload.date = date;
    }



    try {
      const response = await fetch('https://librarydbbackend.onrender.com/get-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ specification, date, user_id: userId, book_name: bookName, book_isbn: bookIsbn, staff_id: staffId, teach_email: teachEmail, laptop_id: laptopId, calc_id: calcId, period_type: periodType, room_num: roomNum, media_type: mediaType, topBooks:topBooks, reservation_type: reservationType, start_date: startDate, end_date: endDate}),
      });
      if (!response.ok) {
        throw new Error('Error fetching reports');
      }
      const data = await response.json();
      setReportData(data);
      setErrorMessage('');
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Failed to fetch reports. Please try again.');
      setReportData([]);
    }
  };

  const renderTableHeaders = () => {
    if (reportData.length === 0) return null;
    const headers = Object.keys(reportData[0]);
    return (
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
    );
  };
 
  const renderTableRows = () => {
    return reportData.map((item, index) => (
      <tr key={index}>
        {Object.values(item).map((value, idx) => (
          <td key={idx}>{value}</td>
        ))}
      </tr>
    ));
  };

  return (
    <div>
      <AppTheme {...props}>
        <CssBaseline enableColorScheme />
        <ReportsContainer direction="column">
          <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
          <Card variant="outlined">
            <Typography
              component="h1"
              variant="h4"
              sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', mt: 2 }}
            >
              Generate Report
            </Typography>
            {errorMessage && (
              <div className="alert alert-danger mt-3" role="alert">
                {errorMessage}
              </div>
            )}
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                gap: 2,
              }}
            >
              <FormControl>
                <FormLabel htmlFor="specification">Specification</FormLabel>
                <TextField
                  id="specification"
                  select
                  name="specification"
                  value={specification}
                  onChange={(e) => setSpecification(e.target.value)}
                  fullWidth
                  variant="outlined"
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="">-- Select Specification --</option>
                  <option value="most liked">Most Liked Books</option>
                  <option value="user transactions">User Transactions</option>
                  <option value="session activity">Session Activity</option>
                  <option value="catalog">Library Catalog</option>
                </TextField>
              </FormControl>

              {/* Date Filter - Always shown */}
              {specification !== 'most liked' && (
              <>
                {/* Single Date Filter */}
                <FormControl>
                  <FormLabel htmlFor="date">By Date (optional, YYYY-MM-DD)</FormLabel>
                  <TextField
                    id="date"
                    name="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    fullWidth
                    variant="outlined"
                  />
                </FormControl>

                  {/* Date Range Filters */}
                  <FormControl>
                    <FormLabel htmlFor="startDate">Start Date (optional, YYYY-MM-DD)</FormLabel>
                    <TextField
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      fullWidth
                      variant="outlined"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel htmlFor="endDate">End Date (optional, YYYY-MM-DD)</FormLabel>
                    <TextField
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      fullWidth
                      variant="outlined"
                    />
                  </FormControl>
                </>
              )}


            {(specification === 'user transactions') && (
              <>
                {/* User ID Filter */}
                <FormControl>
                  <FormLabel htmlFor="userId">By User ID (optional)</FormLabel>
                  <TextField
                    id="userId"
                    name="userId"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    fullWidth
                    variant="outlined"
                  />
                </FormControl>

                {/* Reservation Type Dropdown */}
                <FormControl fullWidth>
                  <FormLabel htmlFor="reservationType">By Reservation Type (optional)</FormLabel>
                  <Select
                    id="reservationType"
                    name="reservationType"
                    value={reservationType}
                    onChange={(e) => setReservationType(e.target.value)}
                    displayEmpty
                    variant="outlined"
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="book">Book</MenuItem>
                    <MenuItem value="room">Room</MenuItem>
                    <MenuItem value="laptop">Laptop</MenuItem>
                    <MenuItem value="calculator">Calculator</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}

              {(specification === 'session activity') && (
                <>
                  <FormControl>
                  <FormLabel htmlFor="userId">By User ID (optional)</FormLabel>
                  <TextField
                    id="userId"
                    name="userId"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    fullWidth
                    variant="outlined"
                  />
                </FormControl>
                </>
              )}


              {(specification === 'most liked') && (
                <>
                  <FormControl>
                    <FormLabel htmlFor="topBooks">Select Top Books</FormLabel>
                    <Select
                      id="topBooks"
                      value={topBooks}
                      onChange={(e) => setTopBooks(e.target.value)}
                      fullWidth
                      variant="outlined"
                    >
                      <MenuItem value={5}>Top 5</MenuItem>
                      <MenuItem value={10}>Top 10</MenuItem>
                      <MenuItem value={50}>Top 50</MenuItem>
                    </Select>
              </FormControl>
                </>
              )}


              {
                specification === 'catalog' && (
                  <FormControl fullWidth variant="outlined">
                    <FormLabel htmlFor="mediaType">By Media Type</FormLabel>
                    <Select
                      id="mediaType"
                      name="mediaType"
                      value={mediaType}
                      onChange={(e) => setmediaType(e.target.value)}
                      label="Media Type"
                    >
                      <MenuItem value="all">All</MenuItem>
                      <MenuItem value="book">Book</MenuItem>
                      <MenuItem value="audiobook">Audiobook</MenuItem>
                      <MenuItem value="ebook">Ebook</MenuItem>
                      <MenuItem value="periodical">Periodical</MenuItem>
                    </Select>
                  </FormControl>
                )
              }

              <Button type="submit" fullWidth variant="contained">
                Generate
              </Button>
            </Box>
            <Typography variant="h6" mt={4}>Report Data:</Typography>
            <TableContainer>
              {reportData.length > 0 ? (
                <StyledTable>
                  {renderTableHeaders()}
                  <tbody>{renderTableRows()}</tbody>
                </StyledTable>
              ) : (
                <Typography variant="body1" mt={2}>
                  No data available for the selected specification.
                </Typography>
              )}
            </TableContainer>
          </Card>
        </ReportsContainer>
      </AppTheme>
    </div>
  );
}

export default Reports;

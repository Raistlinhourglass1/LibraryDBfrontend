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
  const [staffId, setStaffId] = useState('');
  const [teachEmail, setTeachEmail] = useState('');
  const [bookName, setBookName] = useState('');
  const [bookIsbn, setBookIsbn] = useState('');
  const [roomNum, setRoomNum] = useState('');
  const [reportData, setReportData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Clear irrelevant filters when the specification changes
  useEffect(() => {
    setDate('');
    setUserId('');
    setStaffId('');
    setCalcId('');
    setTeachEmail('');
    setBookName('');
    setBookIsbn('');
    setLaptopId('');
    setPeriodType('');
    setRoomNum('');
  }, [specification]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prepare the payload based on the selected specification
    const payload = { specification, date };
    if (specification === 'users') payload.user_id = userId;
    if (specification === 'staff') payload.staff_id = staffId;
    if (specification === 'teacher') payload.teach_email = teachEmail;
    if (specification === 'laptops') payload.laptop_id = laptopId;
    if (specification === 'calculators') payload.calc_id = calcId;
    if (specification === 'periodical') payload.period_type = periodType;
    if (specification === 'room reservations') payload.room_num = roomNum;
    if (specification === 'books') {
      payload.book_name = bookName;
      payload.book_isbn = bookIsbn;
    }

    try {
      const response = await fetch('https://librarydbbackend.onrender.com/get-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ specification, date, user_id: userId, book_name: bookName, book_isbn: bookIsbn, staff_id: staffId, teach_email: teachEmail, laptop_id: laptopId, calc_id: calcId, period_type: periodType, room_num: roomNum }),
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
                  <option value="laptops">Laptops</option>
                  <option value="calculators">Calculators</option>
                  <option value="books">Books</option>
                  <option value="audiobooks">Audio Books</option>
                  <option value="periodical">Periodicals</option>
                  <option value="ebook">Ebooks</option>
                  <option value="book reservations">Book Reservations</option>
                  <option value="room reservations">Room Reservations</option>
                  <option value="feedback">Book Reviews</option>
                  <option value="users">Users</option>
                  <option value="staff">Staff</option>
                  <option value="teacher">Teacher</option>
                </TextField>
              </FormControl>

              {/* Date Filter - Always shown */}
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

              {/* Conditional filters based on selected specification */}
              {(specification === 'users') && (
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
              )}

              {(specification === 'staff') && (
                <FormControl>
                  <FormLabel htmlFor="staffId">By Staff ID (optional)</FormLabel>
                  <TextField
                    id="staffId"
                    name="staffId"
                    value={staffId}
                    onChange={(e) => setStaffId(e.target.value)}
                    fullWidth
                    variant="outlined"
                  />
                </FormControl>
              )}

              {(specification === 'teacher') && (
                <FormControl>
                  <FormLabel htmlFor="teachEmail">By Teacher Email (optional)</FormLabel>
                  <TextField
                    id="teachEmail"
                    name="teachEmail"
                    value={teachEmail}
                    onChange={(e) => setTeachEmail(e.target.value)}
                    fullWidth
                    variant="outlined"
                  />
                </FormControl>
              )}

              {(specification === 'laptops') && (
                <FormControl>
                  <FormLabel htmlFor="laptopId">By Laptop ID (optional)</FormLabel>
                  <TextField
                    id="laptopId"
                    name="laptopId"
                    value={laptopId}
                    onChange={(e) => setLaptopId(e.target.value)}
                    fullWidth
                    variant="outlined"
                  />
                </FormControl>
              )}

              {(specification === 'calculators') && (
                <FormControl>
                  <FormLabel htmlFor="calcId">By Calculator ID (optional)</FormLabel>
                  <TextField
                    id="calcId"
                    name="calcId"
                    value={calcId}
                    onChange={(e) => setCalcId(e.target.value)}
                    fullWidth
                    variant="outlined"
                  />
                </FormControl>
              )}

              {(specification === 'periodical') && (
                <FormControl>
                  <FormLabel htmlFor="periodType">By Periodical Type (newspaper/journal/magazine)</FormLabel>
                  <TextField
                    id="periodType"
                    name="periodType"
                    value={periodType}
                    onChange={(e) => setPeriodType(e.target.value)}
                    fullWidth
                    variant="outlined"
                  />
                </FormControl>
              )}


              {(specification === 'books' || specification === 'audiobooks' || specification === 'book reservations' || specification === 'ebook') && (
                <>
                  <FormControl>
                    <FormLabel htmlFor="bookName">By Book Name (optional)</FormLabel>
                    <TextField
                      id="bookName"
                      name="bookName"
                      value={bookName}
                      onChange={(e) => setBookName(e.target.value)}
                      fullWidth
                      variant="outlined"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="bookIsbn">By Book ISBN (optional)</FormLabel>
                    <TextField
                      id="bookIsbn"
                      name="bookIsbn"
                      value={bookIsbn}
                      onChange={(e) => setBookIsbn(e.target.value)}
                      fullWidth
                      variant="outlined"
                    />
                  </FormControl>
                </>
              )}

              {(specification === 'room reservations') && (
                <FormControl>
                  <FormLabel htmlFor="roomNum">By Room Number</FormLabel>
                  <TextField
                    id="roomNum"
                    name="roomNum"
                    value={roomNum}
                    onChange={(e) => setRoomNum(e.target.value)}
                    fullWidth
                    variant="outlined"
                  />
                </FormControl>
              )}

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
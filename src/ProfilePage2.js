import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  CssBaseline,
  Typography,
  TextField,
  Stack,
  Card as MuiCard,
  Grid2,
  Avatar,
  Paper,
  Tabs,
  Tab,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import AppTheme from './AppTheme';
import ColorModeSelect from './ColorModeSelect';
import StudentBookRentals from './StudentBookRentals';
import StudentLaptopRentals from './StudentLaptopRentals';
import StudentCalculatorRentals from './StudentCalculatorRentals';
import RoomReserveTable from './RoomReserveTable';






// Function to determine the max books allowed based on user_level
const getMaxBooksAllowed = (userLevel) => {
  switch (userLevel) {
    case 'Student':
      return 10;
    case 'Teacher':
      return 50;
    case 'Staff':
      return 100;
    case 'Admin':
      return 200;
    default:
      return 0;
  }
};
const SignInContainer = styled(Stack)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  padding: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage: 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage: 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function ProfilePage2(props) {
  const [value, setValue] = useState(0);
  const [userInfo, setUserInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({});
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const navigate = useNavigate();

  const fetchProfileData = () => {
    const token = localStorage.getItem('token');
    axios
      .get('https://librarydbbackend.onrender.com/ProfilePage2', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUserInfo(response.data);
        setEditedInfo({
          first_name: response.data.first_name,
          last_name: response.data.last_name,
        });
        console.log("User Info:", response.data);
      })
      .catch((error) => {
        console.error('Error fetching profile data:', error);
        localStorage.removeItem('token');
        navigate('/SignIn');
      });
  };

  useEffect(() => {
    fetchProfileData();
  }, [navigate]);

  const handleChange = (event, newValue) => setValue(newValue);
  const handleEditToggle = () => setIsEditing(!isEditing);
  const handleSave = () => {
    const token = localStorage.getItem('token');
    axios
      .put('https://librarydbbackend.onrender.com/ProfilePage2', editedInfo, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setIsEditing(false);
        fetchProfileData(); // Refresh profile data after successful update
      })
      .catch((error) => {
        console.error('Error updating profile data:', error);
      });
  };
  const handleDeleteProfile = () => {
    const token = localStorage.getItem('token');
    axios
      .delete('https://librarydbbackend.onrender.com/DeleteProfile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(() => {
        navigate('/SignIn'); // Redirect after deletion
      })
      .catch((error) => {
        console.error('Error deleting profile:', error);
      });
  };

  const openDeleteConfirmDialog = () => setOpenConfirmDialog(true);
  const closeDeleteConfirmDialog = () => setOpenConfirmDialog(false);

  if (!userInfo) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column">
        <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
        <MuiCard variant="outlined" sx={{ width: '100%', maxWidth: 1200 }}>
          <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.paper', display: 'flex', flexDirection: 'row' }}>
            {/* Left Panel */}
            <Grid2 item sx={{ width: 150, minWidth: 150, mr: 2 }}>
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start', // Align items at the top
                }}
              >
                <Box>
                  <Avatar
                    alt="Profile Picture"
                    src="/static/images/avatar/2.jpg"
                    sx={{ width: 120, height: 120, mb: 2 }}
                  />
                  <Button variant="contained" component="label" fullWidth>
                    Change Photo
                    <input type="file" hidden />
                  </Button>
                </Box>
                <Box mt={4} sx={{ textAlign: 'left', overflowY: 'auto', maxHeight: '50vh' }}>
                  <Typography variant="h6" gutterBottom>
                    Additional Links
                  </Typography>
                  <Link href="/SignIn" variant="body1" display="block" gutterBottom>
                    Sign out
                  </Link>
                  <Link href="/feedback" variant="body2" display="block" gutterBottom>
                    Feedback
                  </Link>
                  <Link href="/reserve-room" variant="body2" display="block" gutterBottom>
                    Room Reservation
                  </Link>
                  {(userInfo.user_level === 'Staff' || userInfo.user_level === 'Admin') && (
                    <>
                      <Link href="/Nice" variant="body2" display="block" gutterBottom>
                        Nice
                      </Link>
                      <Link href="/reports" variant="body2" display="block" gutterBottom>
                        Reports
                      </Link>
                      <Link href="/create-room" variant="body2" display="block" gutterBottom>
                        Create Room
                      </Link>
                      <Link href="/catalog-entry/book" variant="body2" display="block" gutterBottom>
                        Add Book
                      </Link>
                      <Link href="/catalog-entry/ebook" variant="body2" display="block" gutterBottom>
                        Add E-Book
                      </Link>
                      <Link href="/catalog-entry/audiobook" variant="body2" display="block" gutterBottom>
                        Add Audiobook
                      </Link>
                      <Link href="/catalog-entry/periodical" variant="body2" display="block" gutterBottom>
                        Add Periodical
                      </Link><Link href="/_laptopEntry" variant="body2" display="block" gutterBottom>
                        Add laptop
                      </Link><Link href="/_calculatorEntry" variant="body2" display="block" gutterBottom>
                        Add Calculator
                      </Link>
                    </>
                  )}
                </Box>
              </Paper>
            </Grid2>

            {/* Right Panel */}
            <Grid2 item xs={12} md={8} sx={{ flexGrow: 1, overflow: 'auto' }}>
              <Paper elevation={1} sx={{ p: 2, minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  {isEditing ? (
                    <Box>
                      <TextField
                        label="First Name"
                        name="first_name"
                        value={editedInfo.first_name}
                        onChange={(e) => setEditedInfo({ ...editedInfo, [e.target.name]: e.target.value })}
                        fullWidth
                        margin="normal"
                      />
                      <TextField
                        label="Last Name"
                        name="last_name"
                        value={editedInfo.last_name}
                        onChange={(e) => setEditedInfo({ ...editedInfo, [e.target.name]: e.target.value })}
                        fullWidth
                        margin="normal"
                      />
                    </Box>
                  ) : (
                    <Box>
                      <Typography variant="h4">
                        {userInfo.first_name} {userInfo.last_name}
                      </Typography>
                      <Typography color="primary">{userInfo.user_level} at University of Houston</Typography>
                    </Box>
                  )}

                  {/* Edit Buttons */}
                  {isEditing ? (
                    <Box>
                      <Button variant="outlined" color="primary" onClick={handleSave} sx={{ ml: 2 }}>
                        Save
                      </Button>
                      <Button variant="outlined" color="secondary" onClick={handleEditToggle} sx={{ ml: 2 }}>
                        Cancel
                      </Button>
                      <Button variant="contained" color="error" onClick={openDeleteConfirmDialog} sx={{ ml: 2 }}>
                        Delete Profile
                      </Button>
                    </Box>
                  ) : (
                    <Button variant="outlined" color="primary" onClick={handleEditToggle}>
                      Edit Profile
                    </Button>
                  )}
                </Box>

                {/* Tabs and Tab Panels */}
                <Box mt={3}>
                  <Tabs value={value} onChange={handleChange}>
                    <Tab label="Profile Details" {...a11yProps(0)} />
                    <Tab label="Book Rentals" {...a11yProps(1)} />
                    <Tab label="Laptop Rentals" {...a11yProps(2)} />
                    <Tab label="Calculator Rentals" {...a11yProps(3)} />
                    <Tab label="Reservations" {...a11yProps(4)} />
                    <Tab label="Fines Due" {...a11yProps(5)} />
                  </Tabs>
                  <CustomTabPanel value={value} index={0}>
                  <Box>
                      <Grid2 container spacing={4}>
                        <Grid2 item xs={12} sm={6}>
                          <Typography variant="body1">First Name</Typography>
                          <br />
                          <Typography variant="body1">Last Name</Typography>
                          <br />
                          <Typography variant="body1">Email</Typography>
                          <br />
                          <Typography variant="body1">User ID</Typography>
                          <br />
                          <Typography variant="body1">Max Books Allowed</Typography>
                        </Grid2>

                        <Grid2 item xs={12} sm={8}>
                          <Typography variant="body2" color="primary">{userInfo.first_name}</Typography>
                          <br />
                          <Typography variant="body2" color="primary">{userInfo.last_name}</Typography>
                          <br />
                          <Typography variant="body2" color="primary">{userInfo.email}</Typography>
                          <br />
                          <Typography variant="body2" color="primary">{userInfo.user_ID}</Typography>
                          <br />
                          <Typography variant="body2" color="primary">{getMaxBooksAllowed(userInfo.user_level)}</Typography>
                          <br />
                        </Grid2>
                      </Grid2>
                    </Box>
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={1}>
                    <StudentBookRentals />
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={2}>
                    <StudentLaptopRentals />
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={3}>
                    <StudentCalculatorRentals />
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={4}>
                    <RoomReserveTable />
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={5}>
                    <Typography>Fines Due</Typography>
                  </CustomTabPanel>
                </Box>
              </Paper>
            </Grid2>
          </Paper>
        </MuiCard>

        {/* Delete Confirmation Dialog */}
        <Dialog open={openConfirmDialog} onClose={closeDeleteConfirmDialog}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to delete your profile?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDeleteConfirmDialog} color="secondary">Cancel</Button>
            <Button onClick={handleDeleteProfile} color="error">Yes, Delete</Button>
          </DialogActions>
        </Dialog>
      </SignInContainer>
    </AppTheme>
  );
}

import React from 'react';
import { Box, Typography, Button, Stack, Card, CssBaseline } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import AppTheme from './AppTheme';
import ColorModeSelect from './ColorModeSelect';

// Reusing the Card and Container styles from Login
const RightContainer = styled(Stack)(({ theme }) => ({
  minHeight: '100vh', // Full viewport height for vertical centering
  display: 'flex', // Flexbox display for centering
  justifyContent: 'center', // Center vertically
  alignItems: 'center', // Center horizontally
  position: 'relative', // Required for the background with ::before
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

const RightCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

// Define the styles for the typography elements
const Title = {
  textAlign: 'center',
  marginBottom: '16px',
};

const Description = {
  textAlign: 'center',
  marginBottom: '24px',
};

const LandingPage = () => {
  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex', height: '100vh' }}>
        {/* Left side (image) */}
        <Box
          sx={{
            flex: 0.6, // Set the left side to 60%
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundImage: 'url(/temple-of-books-6.jpg)', // Replace with your image path
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100vh',
          }}
        >
          {/* Image as background, no text needed here */}
        </Box>

        {/* Right side (text and buttons) */}
        <RightContainer direction="column" sx={{ flex: 0.4 }}> {/* Set the right side to 40% */}
          <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
          <RightCard variant="outlined">
            {/* Text content */}
            <Typography variant="h4" sx={Title}>
              Welcome to the Library
            </Typography>
            <Typography variant="body1" sx={Description}>
              Sign in or create an account to start exploring our vast collection of books.
            </Typography>

            {/* Buttons for login and signup */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Button
                component={Link}
                to="/Signin"
                variant="contained"
                color="primary"
                fullWidth
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/Signup"
                variant="outlined"
                color="secondary"
                fullWidth
              >
                Sign Up
              </Button>
            </Box>
          </RightCard>
        </RightContainer>
      </Box>
    </AppTheme>
  );
};

export default LandingPage;

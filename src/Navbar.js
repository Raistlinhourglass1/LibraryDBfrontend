import React, { useState, useEffect } from 'react';
import { NavDropdown, Navbar, Nav, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NavbarComponent = () => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = () => {
      const token = localStorage.getItem('token');
      if (token) {
        axios
          .get('https://librarydbbackend.onrender.com/ProfilePage2', {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            setUserInfo(response.data);
          })
          .catch(() => {
            setUserInfo(null); // Clear user info on fetch failure
          });
      }
    };

    fetchProfileData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserInfo(null); // Clear user info on logout
    navigate('/SignIn');
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="/">Library</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/home">Home</Nav.Link> 
            <Nav.Link href="/search">Search</Nav.Link>
            <Nav.Link href="/reserve-room">Room reservation</Nav.Link>
            <Nav.Link href="/feedback">Book Reviews</Nav.Link>
            
            {/* Conditionally render Staff Functions only if userInfo is available and has the correct role */}
            {userInfo && (userInfo.user_level === 'Admin' || userInfo.user_level === 'Staff') && (
              <NavDropdown title="Staff Functions" id="staff-functions-dropdown">
                {userInfo.user_level === 'Admin' && (
                  <NavDropdown title="Admin Functions" id="admin-functions-dropdown" drop="end">
                    <NavDropdown.Item href="/addstaff">Add a Staff Member</NavDropdown.Item>
                  </NavDropdown>
                )}
                <NavDropdown.Item href="/reports">Create a Report</NavDropdown.Item>
                <NavDropdown.Item href="/create-room">Add a Room</NavDropdown.Item>
                <NavDropdown.Item href="/catalog-entry/book">Add a Book</NavDropdown.Item>
                <NavDropdown.Item href="/_laptopEntry">Add a Laptop</NavDropdown.Item>
                <NavDropdown.Item href="/_calculatorEntry">Add a Calculator</NavDropdown.Item>
                <NavDropdown.Item href="/nice">PERSONAL VIEW ONLY</NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>

          {/* Show logout button if user is logged in */}
          {userInfo ? (
            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
          ) : (
            <Nav.Link href="/SignIn">Sign In</Nav.Link>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;

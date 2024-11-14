import React, { useState, useEffect } from 'react';
import { NavDropdown, Navbar, Nav, Container } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function NavbarComponent() {
  const [userInfo, setUserInfo] = useState(null); // Define userInfo state
  const navigate = useNavigate(); // Define navigate hook for redirection

  // Function to fetch profile data
  const fetchProfileData = () => {
    const token = localStorage.getItem('token');
    axios
      .get('https://librarydbbackend.onrender.com/ProfilePage2', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUserInfo(response.data); // Set user info data
        console.log("User Info:", response.data);
      })
      .catch((error) => {
        console.error('Error fetching profile data:', error);
        localStorage.removeItem('token');
        navigate('/SignIn'); // Navigate to SignIn on error
      });
  };

  // Fetch user info when the component mounts
  useEffect(() => {
    fetchProfileData();
  }, []);

  return (
    <Navbar expand="lg" className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="#home">Library</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/ProfilePage2">Home</Nav.Link> 
            <Nav.Link href="/search">Search</Nav.Link>
            <Nav.Link href="/reserve-room">Room reservation</Nav.Link>
            <Nav.Link href="/feedback">Book Reviews</Nav.Link>

            {/* Only show "Staff Functions" dropdown if userInfo is loaded and user is "Admin" or "Staff" */}
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
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;

import React, { useEffect } from 'react';
import { NavDropdown, Navbar, Nav, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NavbarComponent = ({ userInfo, onLogout, fetchProfileData }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !userInfo) {
      fetchProfileData(token);
    }
  }, [fetchProfileData, userInfo]);

  return (
    <Navbar expand="lg" data-bs-theme="dark"style={{ backgroundColor: '#202632', color: '#ecf0f1', height: '70px'}}>
      <Container>
        <Navbar.Brand href="/">Library</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/home">Home</Nav.Link>
            <Nav.Link href="/ProfilePage2">My Profile</Nav.Link>
            <Nav.Link href="/search">Search</Nav.Link>
            <Nav.Link href="/reserve-room">Room reservation</Nav.Link>
            <NavDropdown title="Rent Device" id="basic-nav-dropdown">
              <NavDropdown.Item href="/_laptopReservation">Laptops</NavDropdown.Item>
              <NavDropdown.Item href="/_calculatorReservation">
                Calculator
              </NavDropdown.Item>
              <NavDropdown.Divider />
            </NavDropdown>
            {/* Conditionally render Staff Functions only if userInfo is available and has the correct role */}
            {userInfo && (userInfo.user_level === 'Admin' || userInfo.user_level === 'Staff') && (
              <NavDropdown title="Staff Functions" id="staff-functions-dropdown">
                {userInfo.user_level === 'Admin' && (
                  <NavDropdown title="Admin Functions" id="admin-functions-dropdown" drop="end">
                    <NavDropdown.Item href="/addstaff">Add a Staff Member</NavDropdown.Item>
                  </NavDropdown>
                )}
                <NavDropdown.Item href="/reports">Create a Report</NavDropdown.Item>
                <NavDropdown.Item href="/catalog">View the Catalog</NavDropdown.Item>
                <NavDropdown.Item href="/create-room">Add a Room</NavDropdown.Item>
                <NavDropdown.Item href="/_laptopEntry">Add a Laptop</NavDropdown.Item>
                <NavDropdown.Item href="/_calculatorEntry">Add a Calculator</NavDropdown.Item>
                <NavDropdown.Item href="/Nice">PERSONAL VIEW ONLY</NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
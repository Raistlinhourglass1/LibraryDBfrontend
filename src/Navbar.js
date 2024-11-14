import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';






function NavBar() {
  
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
            <NavDropdown title="Rent Device" id="basic-nav-dropdown">
              <NavDropdown.Item href="/_laptopReservation">Laptops</NavDropdown.Item>
              <NavDropdown.Item href="/_calculatorReservation">
                Calculator
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Staff Functions" id="basic-nav-dropdown">
              <NavDropdown.Item href="/addstaff">Add a Staff Member</NavDropdown.Item>
              <NavDropdown.Item href="/nice">PERSONAL VIEW ONLY</NavDropdown.Item>
              <NavDropdown.Item href="/reports">Create a Report</NavDropdown.Item>
              <NavDropdown.Item href="/create-room">Add a Room</NavDropdown.Item>
              <NavDropdown.Item href="/catalog-entry/book">Add a Book</NavDropdown.Item>
              <NavDropdown.Item href="/_laptopEntry">Add a Laptop</NavDropdown.Item>
              <NavDropdown.Item href="/_calculatorEntry">Add a Calculator</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;

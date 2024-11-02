import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';





function NavBar() {
  
  const location = useLocation();
  
  // Paths where NavBar should be hidden
  const hiddenNavPaths = ['/signin', '/signup'];
  const shouldHideNav = hiddenNavPaths.includes(location.pathname);

  return (
    <div>
      {/* Render NavBar only if the path is not in hiddenNavPaths */}
      {!shouldHideNav && <NavBar />}
      
      {/* Your other content and routing components go here */}

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
                calculator
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>




    </div>
  );
}

export default NavBar;

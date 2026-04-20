import { Container, Nav, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router";
import logo from "../assets/images/benford-logo.jpg";

const TopNavNotLoggedIn = () => {
  let navigate = useNavigate();
  return (
    <>
      {/* Banner */}
      <div className="bg-light text-dark text-center py-2  banner"></div>

      {/* Navigation Bar */}
      <Navbar bg="light" expand="lg" sticky="top">
        <Container>
          {/* Logo Placeholder */}
          <Container>
            <Navbar.Brand
              onClick={() => navigate("/")}
              style={{ cursor: "pointer" }}
            >
              <img
                alt=""
                src={logo}
                width="30"
                height="30"
                className="d-inline-block align-top"
              />{" "}
              BENFORD Fitness Gym
            </Navbar.Brand>
          </Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link onClick={() => navigate("/attendance")}>
                Attendance
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/login")}>Login</Nav.Link>
              {/* <Nav.Link onClick={() => navigate("/register")}>
                Register
              </Nav.Link> */}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default TopNavNotLoggedIn;

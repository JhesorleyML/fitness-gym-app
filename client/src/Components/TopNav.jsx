import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router";
import { AuthContext } from "../helpers/AuthContext";
import { useContext } from "react";
import PropTypes from "prop-types";
import logo from "../assets/images/benford-logo.jpg";

const TopNav = ({ userRole }) => {
  const { setAuthState } = useContext(AuthContext);
  let navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    setAuthState({ username: "", id: 0, status: false, role: "" });
    alert("Logged-out successfully.");
    navigate("/");
  };
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
              <Nav.Link onClick={() => navigate("/dashboard")}>
                Dashboard
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/subscription")}>
                Subscriptions
              </Nav.Link>
              <NavDropdown title="Clients" id="client-nav-dropdown">
                <NavDropdown.Item onClick={() => navigate("/clients")}>
                  All Clients
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => navigate("/clients/add")}>
                  New Client
                </NavDropdown.Item>
              </NavDropdown>
              <Nav.Link onClick={() => navigate("/payments")}>
                Payments
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/expenses")}>
                Expenses
              </Nav.Link>
              <NavDropdown title="Reports" id="report-nav-dropdown">
                <NavDropdown.Item onClick={() => navigate("/reports/payments")}>
                  Payment Reports
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigate("/reports/clients")}>
                  Gym Clients
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigate("/reports/expenses")}>
                  Expenses Reports
                </NavDropdown.Item>
              </NavDropdown>
              {userRole === "admin" && (
                <NavDropdown title="User" id="user-nav-dropdown">
                  <NavDropdown.Item onClick={() => navigate("/register")}>
                    New User
                  </NavDropdown.Item>
                </NavDropdown>
              )}
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

TopNav.propTypes = {
  userRole: PropTypes.string,
};

export default TopNav;

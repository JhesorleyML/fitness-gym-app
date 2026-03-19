import { Col, Container, Row } from "react-bootstrap";

const Footer = () => {
  return (
    <>
      <footer className="bg-dark text-light py-4">
        <Container>
          <Row>
            <Col md={8} className="mb-2">
              <h5>About Us</h5>
              <p>
                Welcome to BENFORD Fitness Gym, your ultimate fitness
                destination! Whether you are a fitness enthusiast or just
                starting your journey, we offer state-of-the-art equipment,
                professional trainers, and a variety of classes tailored to all
                fitness levels. Join us today and experience a community that
                inspires you to be your best self every step of the way.
              </p>
            </Col>

            <Col md={4} className="mb-2">
              <h5>Contact Us</h5>
              <p className="mb-0">
                Email:{" "}
                <a
                  href="https://www.google.com"
                  className="text-light text-decoration-none"
                >
                  benfordfitnessgym@gmail.com
                </a>
              </p>
              <p className="mb-0">Phone: 09102457812</p>
              <p className="mb-0">
                Address: P-7 Mabini, Poblacion, San Jose, Dinagat Islands
              </p>
            </Col>
          </Row>
          <Row>
            <Col className="text-center mt-2">
              <p className="mb-0">
                &copy; {new Date().getFullYear()} DJEMC-ICT. All Rights
                Reserved.
              </p>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
};

export default Footer;

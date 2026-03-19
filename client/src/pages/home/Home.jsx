import { Carousel, Container } from "react-bootstrap";

import firstImage from "../../assets/images/img1.png";
import secImage from "../../assets/images/img2.png";
import thirdImage from "../../assets/images/img3.png";
import "./style.css";

const Home = () => {
  return (
    <Container>
      <div className="homepage">
        <h2>BENFORD FITNESS GYM</h2>
      </div>
      {/**Images in carousel */}
      <Carousel>
        <Carousel.Item>
          <img className="d-block w-100" src={firstImage} />
          <Carousel.Caption>
            <h3>First slide label</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100" src={secImage} />
          <Carousel.Caption>
            <h3>Second slide label</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100" src={thirdImage} />
          <Carousel.Caption>
            <h3>Third slide label</h3>
            <p>
              Praesent commodo cursus magna, vel scelerisque nisl consectetur.
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      <div className="mb-3"></div>
    </Container>
  );
};

export default Home;

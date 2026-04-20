import { useEffect } from "react";
import image1 from "../../assets/images/image-1.jpg";
import image2 from "../../assets/images/image-2.jpg";
import image3 from "../../assets/images/image-3.jpg";
import image4 from "../../assets/images/image-4.jpg";
import "./homepage.css";
import { Container } from "react-bootstrap";

const HomePage = () => {
  useEffect(() => {
    const nextCon = document.getElementById("next");
    const prevCon = document.getElementById("prev");
    const carouselCon = document.querySelector(".carousel");
    const listItemCon = document.querySelector(".carousel .list");
    const thumbnailCon = document.querySelector(".carousel .thumbnail");

    if (!nextCon || !prevCon || !carouselCon || !listItemCon || !thumbnailCon) {
      console.log("Carousel elements not found. Skipping script execution.");
      return;
    }

    const showSlider = (type) => {
      const itemSlider = document.querySelectorAll(".carousel .list .item");
      const itemThumbnail = document.querySelectorAll(
        ".carousel .thumbnail .item",
      );

      if (itemSlider.length === 0 || itemThumbnail.length === 0) {
        console.error("No items found for slider or thumbnail.");
        return;
      }

      if (type === "next") {
        listItemCon.appendChild(itemSlider[0]);
        thumbnailCon.appendChild(itemThumbnail[0]);
        carouselCon.classList.add("next");
      } else {
        const positionLastItem = itemSlider.length - 1;
        listItemCon.prepend(itemSlider[positionLastItem]);
        thumbnailCon.prepend(itemThumbnail[positionLastItem]);
        carouselCon.classList.add("prev");
      }

      clearTimeout(runTimeOut);

      runTimeOut = setTimeout(() => {
        carouselCon.classList.remove("next");
        carouselCon.classList.remove("prev");
      }, timeRunning);

      clearTimeout(runAutoRun);
      runAutoRun = setTimeout(() => {
        nextCon.click();
      }, timeAutoNext);
    };

    let timeRunning = 3000;
    let timeAutoNext = 10000;
    let runTimeOut;
    let runAutoRun = setTimeout(() => {
      nextCon.click();
    }, timeAutoNext);

    nextCon.onclick = () => showSlider("next");
    prevCon.onclick = () => showSlider("prev");

    carouselCon.addEventListener("mouseenter", () => {
      clearTimeout(runAutoRun);
    });

    carouselCon.addEventListener("mouseleave", () => {
      runAutoRun = setTimeout(() => {
        nextCon.click();
      }, timeAutoNext);
    });

    return () => {
      // Cleanup on component unmount
      nextCon.onclick = null;
      prevCon.onclick = null;
      carouselCon.removeEventListener("mouseenter", () => {});
      carouselCon.removeEventListener("mouseleave", () => {});
      clearTimeout(runTimeOut);
      clearTimeout(runAutoRun);
    };
  }, []);
  return (
    <Container>
      <div className="carousel">
        <div className="list">
          <div className="item">
            <img src={image1} alt="Workout Equipment" />
            <div className="content">
              <div className="author">Benford Fitness Gym</div>
              <div className="title">Gym Equipments</div>
              <div className="topic">Fitness Excellence</div>
              <div className="des">
                At Benford Fitness Gym, we offer cutting-edge workout equipment
                designed to help you achieve your fitness goals efficiently and
                effectively.
              </div>
            </div>
          </div>
          <div className="item">
            <img src={image2} alt="Gym Trainers" />
            <div className="content">
              <div className="author">Benford Fitness Gym</div>
              <div className="title">Expert Trainers</div>
              <div className="topic">Personal Guidance</div>
              <div className="des">
                Our expert trainers are here to guide you every step of the way,
                ensuring a safe and personalized fitness experience.
              </div>
            </div>
          </div>
          <div className="item">
            <img src={image3} alt="Gym Classes" />
            <div className="content">
              <div className="author">Benford Fitness Gym</div>
              <div className="title">Engaging Classes</div>
              <div className="topic">Group Fitness</div>
              <div className="des">
                Join our dynamic group classes to stay motivated and have fun
                while working towards your health goals.
              </div>
            </div>
          </div>
          <div className="item">
            <img src={image4} alt="Healthy Lifestyle" />
            <div className="content">
              <div className="author">Benford Fitness Gym</div>
              <div className="title">Healthy Lifestyle</div>
              <div className="topic">Your Fitness Journey</div>
              <div className="des">
                {`"If healthy lifestyle is your choice, Benford Fitness Gym is one of your way." Located at P-7 Poblacion, San Jose, Dinagat Islands, we are here to support your fitness journey.`}
              </div>
            </div>
          </div>
        </div>
        <div className="thumbnail">
          <div className="item">
            <img src={image1} alt="Equipment Thumbnail" />
            <div className="content">
              <div className="title">State-of-the-Art Equipment</div>
              <div className="des">
                Discover the latest in workout technology.
              </div>
            </div>
          </div>
          <div className="item">
            <img src={image2} alt="Trainer Thumbnail" />
            <div className="content">
              <div className="title">Expert Trainers</div>
              <div className="des">Get personalized fitness advice.</div>
            </div>
          </div>
          <div className="item">
            <img src={image3} alt="Classes Thumbnail" />
            <div className="content">
              <div className="title">Engaging Classes</div>
              <div className="des">Stay motivated with group workouts.</div>
            </div>
          </div>
          <div className="item">
            <img src={image4} alt="Lifestyle Thumbnail" />
            <div className="content">
              <div className="title">Healthy Lifestyle</div>
              <div className="des">Embrace a healthier you.</div>
            </div>
          </div>
        </div>
        <div className="time"></div>
        <div className="arrows">
          <button id="prev">&#10094;</button>
          <button id="next">&#10095;</button>
        </div>
      </div>
    </Container>
  );
};

export default HomePage;

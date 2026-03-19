import { Card } from "react-bootstrap";
import { MdAccessibilityNew, MdHowToReg } from "react-icons/md";
import PropTypes from "prop-types";

const SampleCards = ({ data, isMember, cardTitle, desc }) => {
  return (
    <Card
      className="d-flex flex-row align-items-center p-3 shadow-sm"
      style={{ borderRadius: "12px" }}
    >
      <div
        className="icon-container d-flex align-items-center justify-content-center"
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "10px",
          backgroundColor: "#0d6efd",
          marginRight: "15px",
        }}
      >
        <i
          className="bi bi-laptop"
          style={{ color: "white", fontSize: "24px" }}
        >
          {" "}
          {isMember ? <MdHowToReg /> : <MdAccessibilityNew />}
        </i>
      </div>
      <div>
        <h6 className="text-muted mb-1">{cardTitle}</h6>
        <h3 className="mb-0">{data}</h3>
        <small className="text-success">{desc}</small>
      </div>
    </Card>
  );
};

SampleCards.propTypes = {
  data: PropTypes.number,
  isMember: PropTypes.bool,
  cardTitle: PropTypes.string,
  desc: PropTypes.string,
};

export default SampleCards;

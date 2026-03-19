import PropTypes from "prop-types";
import { Alert, Button } from "react-bootstrap";

const AlertCustom = ({ show, handleClose, type, onDeletion, id }) => {
  //console.log(id);

  AlertCustom.propTypes = {
    type: PropTypes.string,
    onDeletion: PropTypes.func,
    show: PropTypes.bool,
    handleClose: PropTypes.func,
    id: PropTypes.number,
  };

  return (
    <Alert show={show} variant="danger">
      <Alert.Heading>{`Proceed the ${type}`}</Alert.Heading>
      <p>Do you want to delete this data?</p>
      <hr />
      <div className="d-flex justify-content-end">
        <Button onClick={handleClose} variant="outline-warning">
          No
        </Button>
        <Button onClick={() => onDeletion(id)} variant="outline-success">
          Yes
        </Button>
      </div>
    </Alert>
  );
};

export default AlertCustom;

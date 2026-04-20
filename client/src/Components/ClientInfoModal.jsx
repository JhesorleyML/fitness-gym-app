import PropTypes from "prop-types";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import "./style.css";
import { format } from "date-fns";

const ClientInfoModal = ({ data, handleClose, show }) => {
  // Extract and format data directly from props
  const firstname = data?.firstname || "";
  const lastname = data?.lastname || "";
  const middlename = data?.middlename || "";
  const address = data?.address || "";
  const contact = data?.contactno || "";
  const sex = data?.sex || "";
  const pic = data?.pic || "";
  const membership = data?.isMember ? "Gym Member" : "Non-Member";
  const emName = data?.EmergencyContact?.name || "N/A";
  const emContact = data?.EmergencyContact?.contact || "N/A";

  let bdate = "N/A";
  if (data?.bdate) {
    try {
      bdate = format(new Date(data.bdate), "MMMM dd, yyyy");
    } catch (error) {
      console.error("Invalid birthdate:", error);
    }
  }

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title> Client Information </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div className="text-center mb-3">
            <img
              src={pic || "/default-account.jpg"}
              alt="Profile"
              className="rounded-circle border"
              width="150"
              height="150"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="mb-2 text-primary fw-bold">
            Client Information Details
          </div>

          <InputGroup className="mb-2">
            <InputGroup.Text
              className="input-group-text-uniform bg-success text-white"
              style={{ width: "120px" }}
            >
              Firstname
            </InputGroup.Text>
            <Form.Control type="text" readOnly value={firstname} />
          </InputGroup>

          <InputGroup className="mb-2">
            <InputGroup.Text
              className="input-group-text-uniform bg-success text-white"
              style={{ width: "120px" }}
            >
              Middlename
            </InputGroup.Text>
            <Form.Control type="text" readOnly value={middlename} />
          </InputGroup>

          <InputGroup className="mb-2">
            <InputGroup.Text
              className="input-group-text-uniform bg-success text-white"
              style={{ width: "120px" }}
            >
              Lastname
            </InputGroup.Text>
            <Form.Control type="text" readOnly value={lastname} />
          </InputGroup>

          <InputGroup className="mb-2">
            <InputGroup.Text
              className="input-group-text-uniform bg-success text-white"
              style={{ width: "120px" }}
            >
              Sex
            </InputGroup.Text>
            <Form.Control type="text" readOnly value={sex} />
          </InputGroup>

          <InputGroup className="mb-2">
            <InputGroup.Text
              className="input-group-text-uniform bg-success text-white"
              style={{ width: "120px" }}
            >
              Address
            </InputGroup.Text>
            <Form.Control type="text" readOnly value={address} />
          </InputGroup>

          <InputGroup className="mb-2">
            <InputGroup.Text
              className="input-group-text-uniform bg-success text-white"
              style={{ width: "120px" }}
            >
              Birthdate
            </InputGroup.Text>
            <Form.Control type="text" readOnly value={bdate} />
          </InputGroup>

          <InputGroup className="mb-2">
            <InputGroup.Text
              className="input-group-text-uniform bg-success text-white"
              style={{ width: "120px" }}
            >
              Phone No.
            </InputGroup.Text>
            <Form.Control type="text" readOnly value={contact} />
          </InputGroup>

          <InputGroup className="mb-3">
            <InputGroup.Text
              className="input-group-text-uniform bg-success text-white"
              style={{ width: "120px" }}
            >
              Status
            </InputGroup.Text>
            <Form.Control type="text" readOnly value={membership} />
          </InputGroup>

          <div className="mb-2 text-primary fw-bold mt-4">
            Emergency Contact Details
          </div>

          <InputGroup className="mb-2">
            <InputGroup.Text
              className="input-group-text-uniform bg-warning text-dark"
              style={{ width: "120px" }}
            >
              Name
            </InputGroup.Text>
            <Form.Control type="text" readOnly value={emName} />
          </InputGroup>

          <InputGroup className="mb-2">
            <InputGroup.Text
              className="input-group-text-uniform bg-warning text-dark"
              style={{ width: "120px" }}
            >
              Contact No
            </InputGroup.Text>
            <Form.Control type="text" readOnly value={emContact} />
          </InputGroup>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

ClientInfoModal.propTypes = {
  data: PropTypes.object,
  handleClose: PropTypes.func,
  show: PropTypes.bool,
};

export default ClientInfoModal;

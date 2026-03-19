import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import "./style.css";
import { format } from "date-fns";

const ClientInfoModal = ({ data, handleClose, show }) => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [middlename, setMiddlename] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [bdate, setBdate] = useState("");
  const [sex, setSex] = useState("");
  const [pic, setPic] = useState("");
  const [membership, setMembership] = useState("Non-Member");
  const [emName, setEmName] = useState("");
  const [emContact, setEmContact] = useState("");

  //console.log(data.lastname);

  useEffect(() => {
    if (data) {
      //format bdate
      console.log(data);
      const formattedDate = format(new Date(data.bdate), "MMMM dd, yyyy");
      if (data.isMember) {
        setMembership("Gym Member");
      } else {
        setMembership("Non-Member");
      }
      setFirstname(data.firstname || "");
      setLastname(data.lastname || "");
      setMiddlename(data.middlename || "");
      setAddress(data.address || "");
      setContact(data.contactno || "");
      setBdate(formattedDate || "");
      setSex(data.sex || "");
      setPic(data.pic || "");
      setEmName(data.EmergencyContact.name || "");
      setEmContact(data.EmergencyContact.contact || "");
    }
  }, [data]);

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard="false">
      <Modal.Header closeButton>
        <Modal.Title> Client Information </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div className="text-center mb-3">
            <img
              src={pic}
              alt="Profile"
              className="rounded-circle"
              width="150"
              height="150"
            />
          </div>
          <div className="mb-2 text-primary">Client Information Details</div>
          <InputGroup className="mb-2">
            <InputGroup.Text
              id="basic-addon1"
              className="input-group-text-uniform d-flex justify-content-end bg-success text-white"
            >
              Firstname
            </InputGroup.Text>
            <Form.Control
              type="text"
              readOnly
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-2">
            <InputGroup.Text
              id="basic-addon2"
              className="input-group-text-uniform d-flex justify-content-end bg-success text-white"
            >
              Middlename
            </InputGroup.Text>
            <Form.Control
              type="text"
              readOnly
              value={middlename}
              onChange={(e) => setMiddlename(e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-2">
            <InputGroup.Text
              id="basic-addon3"
              className="input-group-text-uniform d-flex justify-content-end bg-success text-white"
            >
              Lastname
            </InputGroup.Text>
            <Form.Control
              type="text"
              readOnly
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-2">
            <InputGroup.Text
              id="basic-addon8"
              className="input-group-text-uniform d-flex justify-content-end bg-success text-white"
            >
              Sex
            </InputGroup.Text>
            <Form.Control
              type="text"
              readOnly
              value={sex}
              onChange={(e) => setSex(e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-2">
            <InputGroup.Text
              id="basic-addon4"
              className="input-group-text-uniform d-flex justify-content-end bg-success text-white"
            >
              Address
            </InputGroup.Text>
            <Form.Control
              type="text"
              readOnly
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-2">
            <InputGroup.Text
              id="basic-addon5"
              className="input-group-text-uniform d-flex justify-content-end bg-success text-white"
            >
              Birthdate
            </InputGroup.Text>
            <Form.Control
              type="text"
              readOnly
              value={bdate}
              onChange={(e) => setBdate(e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-2">
            <InputGroup.Text
              id="basic-addon6"
              className="input-group-text-uniform d-flex justify-content-end bg-success text-white"
            >
              Phone No.
            </InputGroup.Text>
            <Form.Control
              type="text"
              readOnly
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text
              id="basic-addon7"
              className="input-group-text-uniform d-flex justify-content-end bg-success text-white"
            >
              Status
            </InputGroup.Text>
            <Form.Control
              type="text"
              readOnly
              value={membership}
              onChange={(e) => setMembership(e.target.value)}
            />
          </InputGroup>
          <div className="mb-2 text-primary">
            In case of Emergency Contact Details
          </div>
          <InputGroup className="mb-2">
            <InputGroup.Text
              id="basic-addon7"
              className="input-group-text-uniform d-flex justify-content-end bg-warning text-white"
            >
              Name
            </InputGroup.Text>
            <Form.Control
              type="text"
              readOnly
              value={emName}
              onChange={(e) => setEmName(e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-2">
            <InputGroup.Text
              id="basic-addon7"
              className="input-group-text-uniform d-flex justify-content-end bg-warning text-white"
            >
              Contact No
            </InputGroup.Text>
            <Form.Control
              type="text"
              readOnly
              value={emContact}
              onChange={(e) => setEmContact(e.target.value)}
            />
          </InputGroup>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleClose}>
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

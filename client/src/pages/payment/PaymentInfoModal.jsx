import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { format } from "date-fns";

const PaymentInfoModal = ({ show, handleClose, data }) => {
  const [fname, setfname] = useState("");
  const [amount, setAmount] = useState(0);
  const [pDate, setPDate] = useState("");
  const [subs, setSubs] = useState("");
  //console.log(data);

  useEffect(() => {
    if (data) {
      //console.log(data.paymentdate);
      try {
        const formattedDate = format(
          new Date(data.paymentdate),
          "MMMM dd, yyyy"
        );
        setSubs(data.ClientSubscription.Subscription.category);
        setPDate(formattedDate || "");
      } catch (error) {
        console.log(error);
        setPDate("");
      }
      setfname(data.fullname || "");

      setAmount(data.amount || 0);
    }
  }, [data]);

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard="false">
      <Modal.Header closeButton>
        <Modal.Title>Payment Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
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
              value={fname}
              onChange={(e) => setfname(e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-2">
            <InputGroup.Text
              id="basic-addon1"
              className="input-group-text-uniform d-flex justify-content-end bg-success text-white"
            >
              Payment Date
            </InputGroup.Text>
            <Form.Control
              type="text"
              readOnly
              value={pDate}
              onChange={(e) => setPDate(e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-2">
            <InputGroup.Text
              id="basic-addon1"
              className="input-group-text-uniform d-flex justify-content-end bg-success text-white"
            >
              Amount
            </InputGroup.Text>
            <Form.Control
              type="text"
              readOnly
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-2">
            <InputGroup.Text
              id="basic-addon1"
              className="input-group-text-uniform d-flex justify-content-end bg-success text-white"
            >
              Payment For
            </InputGroup.Text>
            <Form.Control
              type="text"
              readOnly
              value={subs}
              onChange={(e) => setSubs(e.target.value)}
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

PaymentInfoModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  data: PropTypes.object,
};

export default PaymentInfoModal;

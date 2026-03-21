import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import { format } from "date-fns";

const PaymentInfoModal = ({ show, handleClose, data }) => {
  // Extract and format data directly from props
  const fname = data?.fullname || "";
  const amount = data?.amount ? parseFloat(data.amount).toLocaleString(undefined, { minimumFractionDigits: 2 }) : "0.00";
  const subs = data?.ClientSubscription?.Subscription?.category || "N/A";
  
  let pDate = "N/A";
  if (data?.paymentdate) {
    try {
      pDate = format(new Date(data.paymentdate), "MMMM dd, yyyy");
    } catch (error) {
      console.error("Invalid date:", data.paymentdate);
    }
  }

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Payment Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <InputGroup className="mb-2">
            <InputGroup.Text
              className="input-group-text-uniform bg-success text-white"
              style={{ width: "130px" }}
            >
              Firstname
            </InputGroup.Text>
            <Form.Control type="text" readOnly value={fname} />
          </InputGroup>
          <InputGroup className="mb-2">
            <InputGroup.Text
              className="input-group-text-uniform bg-success text-white"
              style={{ width: "130px" }}
            >
              Payment Date
            </InputGroup.Text>
            <Form.Control type="text" readOnly value={pDate} />
          </InputGroup>
          <InputGroup className="mb-2">
            <InputGroup.Text
              className="input-group-text-uniform bg-success text-white"
              style={{ width: "130px" }}
            >
              Amount
            </InputGroup.Text>
            <Form.Control type="text" readOnly value={amount} />
          </InputGroup>
          <InputGroup className="mb-2">
            <InputGroup.Text
              className="input-group-text-uniform bg-success text-white"
              style={{ width: "130px" }}
            >
              Payment For
            </InputGroup.Text>
            <Form.Control type="text" readOnly value={subs} />
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

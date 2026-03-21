import PropTypes from "prop-types";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import { format } from "date-fns";

const ExpenseInfoModal = ({ show, handleClose, data }) => {
  // Extract and format data directly from props
  const title = data?.title || "";
  const category = data?.category || "";
  const description = data?.description || "";
  const amount = data?.amount ? parseFloat(data.amount).toLocaleString(undefined, { minimumFractionDigits: 2 }) : "0.00";
  const image = data?.image || "";

  let expdate = "N/A";
  if (data?.expdate) {
    try {
      expdate = format(new Date(data.expdate), "MMMM dd, yyyy");
    } catch (error) {
      console.error("Invalid date:", data.expdate);
    }
  }

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Expense Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div className="text-center mb-3">
            {image ? (
              <img
                src={image}
                alt="Receipt"
                className="img-thumbnail"
                style={{ maxWidth: "100%", maxHeight: "200px" }}
              />
            ) : (
              <div className="p-4 bg-light text-muted">No Receipt Image Attached</div>
            )}
          </div>

          <InputGroup className="mb-2">
            <InputGroup.Text className="input-group-text-uniform bg-primary text-white" style={{ width: "130px" }}>
              Expense Name
            </InputGroup.Text>
            <Form.Control type="text" readOnly value={title} />
          </InputGroup>

          <InputGroup className="mb-2">
            <InputGroup.Text className="input-group-text-uniform bg-primary text-white" style={{ width: "130px" }}>
              Category
            </InputGroup.Text>
            <Form.Control type="text" readOnly value={category} />
          </InputGroup>

          <InputGroup className="mb-2">
            <InputGroup.Text className="input-group-text-uniform bg-primary text-white" style={{ width: "130px" }}>
              Description
            </InputGroup.Text>
            <Form.Control as="textarea" rows={2} readOnly value={description} />
          </InputGroup>

          <InputGroup className="mb-2">
            <InputGroup.Text className="input-group-text-uniform bg-primary text-white" style={{ width: "130px" }}>
              Date
            </InputGroup.Text>
            <Form.Control type="text" readOnly value={expdate} />
          </InputGroup>

          <InputGroup className="mb-2">
            <InputGroup.Text className="input-group-text-uniform bg-primary text-white" style={{ width: "130px" }}>
              Amount
            </InputGroup.Text>
            <Form.Control type="text" readOnly value={`₱ ${amount}`} />
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

ExpenseInfoModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  data: PropTypes.object,
};

export default ExpenseInfoModal;

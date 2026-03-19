import { useEffect, useState } from "react";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import { format } from "date-fns";

const ExpenseInfoModal = ({ data, handleClose, show }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (data) {
      const formattedDate = format(new Date(data.expdate), "MMMM dd, yyyy");
      setTitle(data.title || "");
      setCategory(data.category || "");
      setAmount(data.amount || "");
      setDescription(data.description || "");
      setDate(formattedDate);
      setImage(data.image);
    }
  }, [data]);

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard="false">
      <Modal.Header closeButton>
        <Modal.Title>Expense Information</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div className="text-center mb-3">
            <img
              src={image}
              alt="Image"
              className="rounded-0 img-fluid"
              width="300"
              height="200"
            />
          </div>
          <InputGroup className="mb-2">
            <InputGroup.Text
              id="basic-addon1"
              className="input-group-text-uniform d-flex justify-content-end bg-success text-white"
            >
              Title
            </InputGroup.Text>
            <Form.Control
              type="text"
              readOnly
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-2">
            <InputGroup.Text
              id="basic-addon1"
              className="input-group-text-uniform d-flex justify-content-end bg-success text-white"
            >
              Description
            </InputGroup.Text>
            <Form.Control
              type="text"
              readOnly
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-2">
            <InputGroup.Text
              id="basic-addon1"
              className="input-group-text-uniform d-flex justify-content-end bg-success text-white"
            >
              Category
            </InputGroup.Text>
            <Form.Control
              type="text"
              readOnly
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-2">
            <InputGroup.Text
              id="basic-addon1"
              className="input-group-text-uniform d-flex justify-content-end bg-success text-white"
            >
              Date
            </InputGroup.Text>
            <Form.Control
              type="text"
              readOnly
              value={date}
              onChange={(e) => setDate(e.target.value)}
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

ExpenseInfoModal.propTypes = {
  data: PropTypes.object,
  handleClose: PropTypes.func,
  show: PropTypes.bool,
};

export default ExpenseInfoModal;

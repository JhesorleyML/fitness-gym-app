import { Formik } from "formik";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import { MdCategory, MdDataUsage, MdMoney } from "react-icons/md";
import PropTypes from "prop-types";
import axios from "axios";

const UpdateSubsModal = ({
  modalShow,
  handleModalClose,
  data,
  validationSchema,
  handleModalSubmit,
}) => {
  //console.log(data);

  const initialValues = data || {
    category: "",
    duration: "",
    description: "",
    amount: 0,
    id: 0,
  };

  const handleUpdate = (values, { resetForm }) => {
    //save to database
    axios
      .put(`/api/subscriptions/update/${values.id}`, values)
      .then((response) => {
        console.log(response.data.message);
        alert(response.data.message);
        //resets form
        resetForm();
        //call modal submit
        handleModalSubmit();
      });
  };

  return (
    <Modal
      show={modalShow}
      onHide={handleModalClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Update Subscription</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleUpdate}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isSubmitting,
          }) => (
            <Form onSubmit={handleSubmit}>
              {" "}
              {/**Category */}
              <Form.Label className="label-left">Category</Form.Label>
              <InputGroup className="mb-3">
                <InputGroup.Text id="category-addon">
                  <MdCategory />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Enter category"
                  aria-label="category"
                  aria-describedby="category-addon"
                  name="category"
                  value={values.category}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  isInvalid={touched.category && !!errors.category}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.category}
                </Form.Control.Feedback>
              </InputGroup>
              {/**Description */}
              <Form.Label className="label-left">Description</Form.Label>
              <InputGroup className="mb-3">
                <InputGroup.Text id="description-addon">
                  <MdCategory />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Enter description"
                  aria-label="description"
                  aria-describedby="description-addon"
                  name="description"
                  value={values.description}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  isInvalid={touched.description && !!errors.description}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.description}
                </Form.Control.Feedback>
              </InputGroup>
              {/**Amount */}
              <Form.Label className="label-left">Amount</Form.Label>
              <InputGroup className="mb-3">
                <InputGroup.Text id="amount-addon">
                  <MdMoney />
                </InputGroup.Text>
                <Form.Control
                  type="number"
                  placeholder="Enter amount"
                  aria-label="amount"
                  aria-describedby="amount-addon"
                  name="amount"
                  value={values.amount}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  isInvalid={touched.amount && !!errors.amount}
                />
                <InputGroup.Text>.00</InputGroup.Text>
                <Form.Control.Feedback type="invalid">
                  {errors.amount}
                </Form.Control.Feedback>
              </InputGroup>
              {/**Duration */}
              <Form.Label className="label-left">Duration</Form.Label>
              <InputGroup className="mb-3">
                <InputGroup.Text id="duration-addon">
                  <MdDataUsage />
                </InputGroup.Text>
                <Form.Select
                  title="Duration"
                  name="duration"
                  value={values.duration}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  isInvalid={touched.duration && !!errors.duration}
                >
                  <option value={""}>-Select Duration (in days)-</option>
                  <option value={`1`}>1 - (One) </option>
                  <option value={`30`}>30 - (Thirty)</option>
                  <option value={`0`}>Lifetime</option>
                </Form.Select>
                <InputGroup.Text>days</InputGroup.Text>
                <Form.Control.Feedback type="invalid">
                  {errors.duration}
                </Form.Control.Feedback>
              </InputGroup>
              <div className="d-grid">
                <Button variant="success" type="submit" disabled={isSubmitting}>
                  Update
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};

UpdateSubsModal.propTypes = {
  modalShow: PropTypes.bool,
  handleModalClose: PropTypes.func,
  data: PropTypes.object,
  validationSchema: PropTypes.object,
  handleModalSubmit: PropTypes.func,
};

export default UpdateSubsModal;

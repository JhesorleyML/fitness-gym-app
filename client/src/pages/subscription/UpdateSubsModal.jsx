import { Formik } from "formik";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import { MdCategory, MdDataUsage, MdMoney, MdDescription } from "react-icons/md";
import PropTypes from "prop-types";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const UpdateSubsModal = ({
  modalShow,
  handleModalClose,
  data,
  validationSchema,
}) => {
  const queryClient = useQueryClient();

  const initialValues = {
    category: data?.category || "",
    duration: data?.duration || "",
    description: data?.description || "",
    amount: data?.amount || 0,
    id: data?.id || 0,
  };

  const mutation = useMutation({
    mutationFn: (updatedSubs) => 
      axios.put(`/api/subscriptions/update/${updatedSubs.id}`, updatedSubs),
    onSuccess: (res) => {
      alert(res.data.message);
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["subscriptionCategories"] });
      handleModalClose();
    },
    onError: (error) => {
      alert(error.response?.data?.message || "An error occurred during update");
    }
  });

  const handleUpdate = (values, { setSubmitting }) => {
    mutation.mutate(values, {
      onSettled: () => setSubmitting(false)
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
          enableReinitialize={true}
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
              {/**Category */}
              <Form.Label className="label-left">Category</Form.Label>
              <InputGroup className="mb-3">
                <InputGroup.Text id="category-addon">
                  <MdCategory />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Enter category"
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
                  <MdDescription />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Enter description"
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
                <Button 
                  variant="success" 
                  type="submit" 
                  disabled={isSubmitting || mutation.isLoading}
                >
                  {mutation.isLoading ? "Updating..." : "Update"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

UpdateSubsModal.propTypes = {
  modalShow: PropTypes.bool,
  handleModalClose: PropTypes.func,
  data: PropTypes.object,
  validationSchema: PropTypes.object,
};

export default UpdateSubsModal;
